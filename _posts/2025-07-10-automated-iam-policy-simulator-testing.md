---
title: Automated permissions testing with AWS IAM Policy Simulator
date: 2025-07-10 00:00:00 Z
categories:
  - Cloud
tags:
  - AWS
  - Testing
author: tyates
summary: A quick guide to implementing a test framework for IAM permissions using the AWS IAM Policy Simulator API and a tiny hack.
image: tyates/assets/awsiam.png
---

On Scott Logic's DWP Analytics DataOps team, we're sharing a monorepo with another Scott Logic team, and exposing data in S3 for various other teams throughout DWP Analytics in both our and other AWS accounts. There are a lot of moving parts and permissions derived from shared Terraform modules, so we wanted a way to detect and highlight changes in our role and bucket policies (either deliberate or inadvertent) to ensure data access is allowed or denied correctly, and all permission sets are as least-privilege as possible.

The AWS IAM policy simulator allows theoretical evaluation of policies to determine if an action will be allowed or denied. It can be useful for ad-hoc testing of a user or role's access to resources such as S3 buckets and objects, but the console UI is clunky (if not downright infuriating) and the API imposes limitations when testing more complex, real-world situations involving both principal and resource policies. With only a small amount of shenanigans, it's possible to leverage the simulator API for more useful testing.

## Why

In the majority of cases where I've used the policy simulator console UI, I've been troubleshooting a role's access (or denial of access) to S3 objects at specific paths, which requires evaluating the result using both the role's policies and the S3 bucket policy. Adding a set of context values, test actions and S3 object ARNs (Amazon Resource Names, which specify a resource unambiguously across all of AWS) is fine for a one off, but it's not something you want to repeat often and isn't feasible for ongoing verification.

Policy simulator API methods are available via the AWS CLI and implementations such as the `boto3` Python package, but there are some limitations. The `simulate principal policy` method seems like it should do what we need by finding the policies of a user or role for us, but it doesn't work with resource policies unless you're testing a user entity as the principal, which I am not.

```
An error occurred (InvalidInput) when calling the SimulatePrincipalPolicy operation: Invalid caller - Caller must be an IAM user in this context.
```

There are other solutions around providing a friendly implementation for the policy simulator API, but I don't believe any provide the ability to test a role with a resource policy.

## So...

The other API simulation method is `simulate custom policy`, where we provide both principal and resource policies in the request. This, too, won't work with resource policies if using a role entity, but as it doesn't cause the simulator to go off and find the policies attached to a role, we can trick it by simply providing any old user ARN as the `CallerArn` in the request.

As a little up-front disclaimer: this solution requires resource policies to identify applicable principals using conditions in statements (e.g. checking the role matches the `aws:PrincipalArn` context key), rather than declaring explicit roles in the `Principals` element itself. The reason for this is that our dummy user ARN needs to match against the principal(s) that the statement will apply to, so if you're using `AWS: *` or your account root (`AWS: <your-account-id>` or `AWS: arn:aws:iam::<your-account-id>:root`) then that will match the dummy user, and the nitty-gritty bits in conditions will evaluate against our test role specified in the request's `aws:PrincipalArn`. Note that using the account root principal in a resource policy statement enables IAM users and roles within that account to grant themselves the listed permissions via their attached policies, rather than actually providing the access.

It might well be possible to adapt policies to specify the dummy user as a principal before including in the API request, but I haven't tried.

I'll be using Python for this, but it should be applicable to the AWS CLI and other AWS API implementations such as the Java SDK. I'll keep the code as obvious as possible so it can (hopefully) be followed by readers with any programming background, rather than aiming for A-grade, production ready Python.

To that end, we need to:

- Pull all Inline (a policy directly tied to this role only) and Managed (a policy entity that can be attached to multiple users or roles) policies for the role - these are the principal policies.
- Pull the bucket policy - this is the resource policy.
- Fudge the `CallerArn` in the request to a user entity to keep the simulator happy when using a role.
- Set the `aws:PrincipalArn` context key to the ARN of the role under test.
- Set any other context values to satisfy conditions for the action to be allowed, or to test denies trigger correctly when conditions are not met.

## Setup

To start off, I've created a bucket and role with the following basic policies.

`tims-fancy-bucket`

~~~json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "*",
      "Resource": [
        "arn:aws:s3:::tims-fancy-bucket/*",
        "arn:aws:s3:::tims-fancy-bucket"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    },
    {
      "Sid": "DenyTimDelete",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:DeleteObject",
      "Resource": ["arn:aws:s3:::tims-fancy-bucket/*"],
      "Condition": {
        "ArnLike": {
          "aws:PrincipalArn": "arn:aws:iam::<ACCOUNT ID>:role/tims-test-role"
        }
      }
    }
  ]
}
~~~

`tims-test-role` - the policy can be either inline or managed:

~~~json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "s3",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:DeleteObject"],
      "Resource": ["arn:aws:s3:::tims-fancy-bucket/only-here/*"]
    }
  ]
}
~~~

From the above we can see that:

- `tims-test-role` can only perform `GetObject` and `DeleteObject` for objects in `tims-fancy-bucket` in the pseudo-folder `only-here`
- but it will be denied `DeleteObject` by the bucket policy
- all other S3 actions would be implicitly denied, as no allows are granted
- the bucket policy will explicitly deny any actions where the `aws:SecureTransport` context value is `false`. A single deny overrules any number of allows, so in actual usage if we're not using https we won't be able to do anything

## Running a test with the API

Coding up a basic class to call the simulator with `boto3` could look something like this:

~~~python
import boto3
import json

ACCOUNT_ID=112233445566 # your account id goes here
REGION="eu-west-2"
DUMMY_USER = f"arn:aws:iam::{ACCOUNT_ID}:user/dummy"

iam_client = boto3.client("iam", region_name=REGION)
s3_client = boto3.client("s3", region_name=REGION)

class S3PolicyTest:
    """Simulates action authorisation for the configured role and bucket"""

    def __init__(self, role_arn: str, bucket_name: str):
        self.role_arn = role_arn
        self.role_name = role_arn.split("/")[-1]
        self.bucket_name = bucket_name

    def _get_role_policies(self) -> list[str]:
        """Get all policies for a role in JSON format"""
        policies = self._get_inline_role_policies() + self._get_managed_role_policies()
        return [json.dumps(policy) for policy in policies]

    def _get_inline_role_policies(self) -> list[str]:
        """Get all inline policies for a role in JSON format"""
        policies = []

        for inline in iam_client.list_role_policies(RoleName=self.role_name)["PolicyNames"]:
            policy = iam_client.get_role_policy(RoleName=self.role_name, PolicyName=inline)
            policies.append(policy["PolicyDocument"])

        return policies

    def _get_managed_role_policies(self) -> list[str]:
        """Get all managed policies for a role in JSON format"""
        policies = []

        for managed in iam_client.list_attached_role_policies(RoleName=self.role_name)[
            "AttachedPolicies"
        ]:
            policy_version = iam_client.get_policy(
                PolicyArn=managed["PolicyArn"]
            )["Policy"]["DefaultVersionId"]

            policy = iam_client.get_policy_version(
                PolicyArn=managed["PolicyArn"], VersionId=policy_version
            )

            policies.append(policy["PolicyVersion"]["Document"])

        return policies

    def _get_bucket_policy(self) -> list[str]:
        """Get JSON format S3 bucket policy"""
        return s3_client.get_bucket_policy(Bucket=self.bucket_name)["Policy"]

    def simulate(self, actions: list[str], resource_arn: str):
        """Calls the simulator API"""
        response = iam_client.simulate_custom_policy(
            PolicyInputList=self._get_role_policies(),
            CallerArn=DUMMY_USER,
            ActionNames=actions,
            ResourceArns=[resource_arn],
            ResourcePolicy=self._get_bucket_policy(),
            ContextEntries=[
                {
                    "ContextKeyName": "aws:principalarn",
                    "ContextKeyValues": [self.role_arn],
                    "ContextKeyType": "string",
                },
                {
                    "ContextKeyName": "aws:SecureTransport",
                    "ContextKeyValues": ["true"],
                    "ContextKeyType": "boolean",
                }
            ]
        )

        # just return the results for now
        return response["EvaluationResults"]
~~~

We can run the test as follows:

~~~python
role = f"arn:aws:iam::{ACCOUNT_ID}:role/tims-test-role"
bucket="tims-fancy-bucket"

results = S3PolicyTest(role, bucket).simulate(
    actions=["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
    resource_arn=f"arn:aws:s3:::{bucket}/only-here/some-obj"
)

print(results)
~~~

Slightly truncating the output for clarity, we get:

~~~json
[
  {
    "EvalActionName": "s3:GetObject",
    "EvalResourceName": "arn:aws:s3:::tims-fancy-bucket/only-here/some-obj",
    "EvalDecision": "allowed",
    "MatchedStatements": [
      {
        "SourcePolicyId": "PolicyInputList.1",
        "SourcePolicyType": "IAM Policy",
        "StartPosition": { "Line": 1, "Column": 41 },
        "EndPosition": { "Line": 1, "Column": 180 }
      }
    ]
  },
  {
    "EvalActionName": "s3:PutObject",
    "EvalResourceName": "arn:aws:s3:::tims-fancy-bucket/only-here/some-obj",
    "EvalDecision": "implicitDeny",
    "MatchedStatements": []
  },
  {
    "EvalActionName": "s3:DeleteObject",
    "EvalResourceName": "arn:aws:s3:::tims-fancy-bucket/only-here/some-obj",
    "EvalDecision": "explicitDeny",
    "MatchedStatements": [
      {
        "SourcePolicyId": "ResourcePolicy",
        "SourcePolicyType": "Resource Policy",
        "StartPosition": { "Line": 1, "Column": 248 },
        "EndPosition": { "Line": 1, "Column": 470 }
      },
      {
        "SourcePolicyId": "PolicyInputList.1",
        "SourcePolicyType": "IAM Policy",
        "StartPosition": { "Line": 1, "Column": 41 },
        "EndPosition": { "Line": 1, "Column": 180 }
      }
    ]
  }
]
~~~

We can see that `GetObject` is allowed, and the start and end characters of the statement in the role policy json string that awards the allow are indicated; as we've fetched the policy we can use this information to show the relevant sections to aid in debugging (as you get in the simulator console). `PutObject` is an implicit deny as neither the role nor bucket policy grant it, so there are no `MatchedStatements` to show as no statements are in effect. `DeleteObject` is explicitly denied, and the matched statements indicate both the `DenyTimDelete` statement in the resource policy, and the allow in the role policy.

If we change the `aws:SecureTransport` context value to `false`, then the `DenyInsecureTransport` statement of the bucket policy kicks in and `GetObject` is now explicitly denied, with the character indexes of this statement indicated.

~~~json
{
  "EvalActionName": "s3:GetObject",
  "EvalResourceName": "arn:aws:s3:::tims-fancy-bucket/only-here/some-obj",
  "EvalDecision": "explicitDeny",
  "MatchedStatements": [
    {
      "SourcePolicyId": "ResourcePolicy",
      "SourcePolicyType": "Resource Policy",
      "StartPosition": { "Line": 1, "Column": 38 },
      "EndPosition": { "Line": 1, "Column": 248 }
    }
  ]
}
~~~

## Gettin' configgy wit' it

We can build on this basic hard-coded functionality to create a suite of config-driven tests for a whole set of roles and resources.

We'll add a yaml config file defining the role, resource and key/value pairs of actions and expected results for two tests, including a template placeholder for the AWS account id

~~~yaml
testValidPath:
  role: arn:aws:iam::{ACCOUNT_ID}:role/tims-test-role # we'll replace {ACCOUNT_ID} with our actual value
  resource: tims-fancy-bucket/only-here/some-obj
  actions:
    s3:GetObject: allow
    s3:PutObject: deny # we're only interested in the action being denied, explicit or implicit doesn't matter
    s3:DeleteObject: deny
testInvalidPath:
  role: arn:aws:iam::{ACCOUNT_ID}:role/tims-test-role
  resource: tims-fancy-bucket/not-allowed-here/some-obj
  actions:
    s3:GetObject: deny
    s3:PutObject: allow # this will be implicitly denied, but we want to see the test fail
    s3:DeleteObject: deny
~~~

and extend our class to check the simulator responses against our expected results, rather than just returning the API response as before

~~~python
class S3PolicyTest:
    # ...
    # other methods unchanged

    def simulate(self, actions: dict[str, str], resource_arn: str): # actions is now a dictionary
        """Calls the simulator API"""
        response = iam_client.simulate_custom_policy(
            PolicyInputList=self._get_role_policies(),
            CallerArn=DUMMY_USER,
            ActionNames=list(actions), # creates a list from the dict keys which are our action names to test
            ResourceArns=[resource_arn],
            ResourcePolicy=self._get_bucket_policy(),
            ContextEntries=[
                {
                    "ContextKeyName": "aws:principalarn",
                    "ContextKeyValues": [self.role_arn],
                    "ContextKeyType": "string",
                },
                {
                    "ContextKeyName": "aws:SecureTransport",
                    "ContextKeyValues": ["true"],
                    "ContextKeyType": "boolean",
                }
            ]
        )

        # check the simulated authorisation decisions against our expected config
        self._evaluate_response(actions, response["EvaluationResults"])

    def _evaluate_response(self, expected_results: dict[str, str], results: list[dict]):
        """ iterate through simulator response and compare with expected reults """
        for result in results:
            action = result["EvalActionName"]
            decision = result["EvalDecision"]

            expected_allowed = expected_results[action] == "allow"
            actual_allowed = decision == "allowed"

            if expected_allowed == actual_allowed:
                print(f"{action} - {decision} ✅")
            else:
                print(f"{action} - expected {expected_results[action]} but was {decision} ❌")

                # we can use the `MatchedStatements` response elements here to indicate
                # sections of the policies that have caused the unexpected result
~~~

We can then load the yaml file which will give us a Python dictionary containing our test definitions, and feed each set of parameters into the runner class

~~~python
import yaml

with open("config.yml") as file:
    tests = yaml.safe_load(file)

for name, params in tests.items():
    print(f"Running {name}")

    # swap in the actual account id in the templated config
    role = params["role"].replace("{ACCOUNT_ID}", str(ACCOUNT_ID))
    bucket_name = params["resource"].split("/")[0]

    S3PolicyTest(role, bucket_name).simulate(
        actions=params["actions"],
        resource_arn=f'arn:aws:s3:::{params["resource"]}'
    )

~~~

Running the above we get the following console output, which is as expected given our contrived failing `PutObject` test

```
Running testValidPath
s3:GetObject - allowed ✅
s3:PutObject - implicitDeny ✅
s3:DeleteObject - explicitDeny ✅
Running testInvalidPath
s3:GetObject - implicitDeny ✅
s3:PutObject - expected allow but was implicitDeny ❌
s3:DeleteObject - explicitDeny ✅
```

## Taking it further

We can extend this basic setup as much as necessary depending on the nature of the role and resource policies being tested. Likely upgrades include testing resource types other than S3, per-test context keys, argument parsing and extended templating to allow e.g. environment specific role names. These can then run be run locally or in pipelines as infrastructure smoke tests to alert when permissions change, or flag up potential access issues before and without executing anything tangible on AWS.

It is likely that multiple tests will run on the same buckets and roles, so adding a caching layer to reduce the number of API calls to obtain role and bucket policies will significantly speed up a larger test suite.

In many situations there will be required conditions for access such as requests originating from a specific source VPC (Amazon Virtual Private Cloud, a logically isolated virtual network) which may differ per environment; values for these can be determined via API calls at test runtime and patched into the context entries for specific tests via templating.

In addition to testing with the actual policies of deployed entities to verify role access, using a principal policy granting full access (e.g. allowing `s3:*`) enables us to check denies in the bucket policy function correctly to prevent a role accessing prohibited objects should it be given carte blanche allow permissions. We use this extensively to ensure our bucket policies correctly limit access for roles controlled by other teams in the same AWS account.

Similarly, testing with a role policy granting no permissions lets us verify cross-account access, where any allows will come from the bucket policy.

Resources such as S3 objects and SNS (AWS Simple Notification Service) topics typically require access to encryption keys in order to read or write data; this obviously forms a crucial aspect of the ability to successfully perform an action in practice, but isn't taken into consideration by the simulator. To cover more bases, you could add additional tests to verify your roles can also perform any necessary key related actions.

## Final note

We've found this approach effective as a way to keep tabs on evolving permission sets and to provide ongoing verification that our bucket policies do what they need to do. It's particularly handy for roles we don't own and therefore don't feature in our day-to-day testing, as it gives us confidence that other teams will be able to successfully read the data they need in production (subject to correct permissions on their end), while being denied access to other areas. You do need to know and understand the actions required by your roles for defining the tests, but even the initial configuration process can indicate areas where unnecessary permissions are granted.

I hope you might also find it a useful little workaround.
