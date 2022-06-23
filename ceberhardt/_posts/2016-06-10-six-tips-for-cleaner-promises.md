---
author: ceberhardt
title: Six tips for cleaner javascript promises
layout: default_post
summary: >-
  This blog post shares a few quick tips and patterns that I've been using to
  structure JavaScript promises; keeping them clean, simple and readable.
categories:
  - Tech
---

This blog post shares a few quick tips and patterns that I've been using to structure JavaScript promises; keeping them clean, simple and readable.

Promises have become a standard part of the JavaScript vocabulary. Where previously they were applied retrospectively to APIs via libraries like q, Bluebird or jQuery, they are now the favoured pattern for third party libraries and official Web APIs alike, for example the new [fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API), uses promises.

Promises certainly make your code more readable, when compared with the classic ['pyramid of doom'](https://medium.com/@wavded/managing-node-js-callback-hell-1fe03ba8baf#.vkxkwe5qe), however, they are not without their own challenges. Just because you are using promises doesn't mean your code is going to be clean and simple.

This post looks at a pretty common scenario, an application which obtains data from the GitHub API through a series of requests, and explores the problems and patterns that emerge. Here's the scenario in full ...

I'd like my little application to perform the following:

 1. Obtain a list of my GitHub repositories
 2. Filter this list to find the one with the most stargazers
 3. For this repo, find the number of issues
 4. Give me an indication of my current GitHub API rate-limit

A pretty simple sequence of operations.

In this example I'm using [node-github](https://github.com/mikedeboer/node-github) which (ironically) doesn't have a promise API (although [contributions have been made](https://github.com/mikedeboer/node-github/pull/262)). However, Q provides a simple way to convert node callbacks into promises via `Q.nfcall`:

~~~javascript
const GitHubApi = require('github')
const Q = require('q')
const github = new GitHubApi({ version: '3.0.0' })

const getReposForUser = user =>
    Q.nfcall(github.repos.getForUser, { user })
~~~

## Single statement 'then' blocks

Let's look at the first couple of steps in this scenario, obtaining a list of repos, and finding the one with the most stargazers. This is pretty easy to implement:

~~~javascript
const _ = require('underscore')

getReposForUser('ColinEberhardt')
  .then(repos => {
    return _.max(repos, repo => repo.stargazers_count)
  })
  .then(repo => console.log(repo))
~~~

Using underscore's [max](http://underscorejs.org/#max) function for convenience, the above outputs something like the following:

~~~
{
  "id": 19675555,
  "name": "CETableViewBinding",
  "full_name": "ColinEberhardt/CETableViewBinding",
  "owner": {
    "login": "ColinEberhardt",
    "id": 1098110,
    ...
}
~~~

A promises `then` function is invoked on fulfilment with a single argument that is the fulfilment value. As a result, there is no need to wrap the call to `console.log` in another function. Likewise, the stargazer filtering logic is a single statement, so we can lose the braces and `return` statement too:

~~~javascript
getReposForUser('ColinEberhardt')
  .then(repos => _.max(repos, repo => repo.stargazers_count))
  .then(console.log)
~~~

Better still, the filtering logic can be moved into a function that has the same signature; a function that has a single argument (the fulfilment value), as follows:

~~~javascript
const getRepoWithMostStargazers = repos =>
    _.max(repos, repo => repo.stargazers_count)

getReposForUser('ColinEberhardt')
  .then(getRepoWithMostStargazers)
  .then(console.log)
~~~

The above pattern, a sequence of clear and simple statements, is something I strive for when writing code involving promises. Having complex code within the `then` 'blocks' makes the logic very hard to follow. The other patterns in this post are mostly focussed on how to maintain the simple pattern above in the face of more complex problems.

(As an aside, if you're new to promises, I'd thoroughly recommend reading the article ['We have a problem with promises'](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html). Some of the techniques that follow rely on knowledge you will gain from reading that excellent article)

## Side effects

A common requirement when chaining promises is to perform some sort of side effect, in other words, execute an action that doesn't result in data that is passed to the next step in the chain. A side effect could be the need to send data to some other system, or simply just log some data.

In this scenario, what if we wanted to log the number of repos returned by the initial request. This could be achieved as follows:

~~~javascript   
getReposForUser('ColinEberhardt')
  .then(repos => {
    console.log(`repos returned ${repos.length}`)
    return getRepoWithMostStargazers(repos)
  })
  .then(console.log)
~~~

However, this very much destroys the simple structure I had before.

A marginally better approach is to add the logging as a new `then` block:

~~~javascript   
getReposForUser('ColinEberhardt')
  .then(repos => {
    console.log(`repos returned ${repos.length}`)
    return repos
  })
  .then(getRepoWithMostStargazers)
  .then(console.log)
~~~

Although what we really need is to perform some arbitrary logic, while passing on the original fulfilment value to the next step in the chain. This can be expressed quite simply as follows:

~~~javascript
const sideEffect = fn => d => {
  fn(d)
  return d;
};
~~~

With the above function, you create the desired side-effect -`fn`, which is invoked with the fulfilment value, while the `sideEffect` function takes care of ensuring this value is returned.

Here it is in action:

~~~javascript
getReposForUser('ColinEberhardt')
  .then(sideEffect(repos => console.log(`repos returned ${repos.length}`)))
  .then(getRepoWithMostStargazers)
  .then(console.log)
~~~

Much more elegant!

If the `fn => d => {}` syntax use for the `sideEffect` function looks a bit confusing, it might help to expand it out as follows:

~~~javascript
function sideEffect(fn) {
  return function(d) {
    fn(d);
    return d;
  }
}
~~~

Hopefully that's a bit clearer?

## Merging results from sequential promises

One very common issue people face when chaining promises is how to use the intermediate results from previous promises. There's certainly a lot of [chatter about the subject on StackOverflow](http://stackoverflow.com/questions/28250680/how-do-i-access-previous-promise-results-in-a-then-chain).

Continuing with my scenario to the next step, I'd like to obtain the number of issues for this repo. As a result, the next promise needs to use the results from the initial promise, however, I'd like the final result to be a combination of both results.

Here's the next step:

~~~javascript
const getIssues = repo =>
    Q.nfcall(github.issues.getForRepo, { user: 'ColinEberhardt', repo })
~~~

(Yes, that hard-coded username is nasty, I'll get onto that later)

Obtaining the issues is easy, the objects returned by `getReposForUser` have a `name` property, which is all the above function requires:

~~~javascript
getReposForUser('ColinEberhardt')
  .then(getRepoWithMostStargazers)
  .then(repo => getIssues(repo.name))
  .then(console.log)
~~~

This will log the returned array of issues. However we've completely lost the information from the original `getReposForUser` request.

This data could be captured as a side effect:

~~~javascript
let repoWithMostStars

getReposForUser('ColinEberhardt')
  .then(getRepoWithMostStargazers)
  .then(sideEffect(repo => repoWithMostStars = repo))
  .then(repo => getIssues(repo.name))
  .then(issues => { console.log(`the repo ${repoWithMostStars.name} has ${issues.length} issues`)})
~~~

Which logs the following:

~~~
the repo CETableViewBinding has 3 issues
~~~

But ... yuck!

The `getIssues` function is a promise factory (To use Nolan's term from the [previously reference blog post](http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)), which expects the name of the repo as its input argument.

What we want to do is transform the result of the previous promise so that is can be passed to `getIssues`, then somehow merge the result of the promise produced by `getIssues` back into this earlier result.

Here's a function that does just that:

~~~javascript
const identity = d => d

const merge = (promise, outTrans = identity, inTrans = identity) => d =>
  promise(inTrans(d))
    .then(outTrans)
    .then(result => Object.assign({}, d, result))
~~~

And here's how it's applied in this scenario:

~~~javascript
getReposForUser('ColinEberhardt')
  .then(getRepoWithMostStargazers)
  .then(merge(getIssues, d => ({ issueCount: d.length }), d => d.name))
  .then(console.log)
~~~

With this `merge` function you can pass data from one promise to the next, with the results being accumulated at each stage.

For example, you could add a step to add the number of pull requests:

~~~javascript
getReposForUser('ColinEberhardt')
  .then(getRepoWithMostStargazers)
  .then(merge(getIssues, d => ({ issueCount: d.length }), d => d.name))
  .then(merge(getPullRequests, d => ({ prCount: d.length }), d => d.name))
  .then(console.log)
~~~

And at each stage, you can determine how much of the data returned by the promise should be merged back.


## Currying

What if we wanted to obtain issues with a certain status, e.g. open, closed. This can be achieved by changing the signature of `getIssues`:

~~~javascript
const getIssuesWithState = (repo, state) =>
    Q.nfcall(github.issues.getForRepo, { user: 'ColinEberhardt', repo, state })
~~~

However, this is no longer compatible with the signature required by functions used with `then` (or the `merge` function above).

There's a surprisingly simple solution to this problem, just change `getIssues` into a curried function:

~~~javascript
const getIssuesWithState = state => repo =>
    Q.nfcall(github.issues.getForRepo, { user: 'ColinEberhardt', repo, state })
~~~

The first invocation of this function, e.g. `getIssuesWithState('all')` returns a function with the required signature, with the `state` value set to `all`.

Here it is in action:

~~~javascript
getReposForUser('ColinEberhardt')
  .then(getRepoWithMostStargazers)
  .then(merge(getIssuesWithState('all'), d => ({ issueCount: d.length }), d => d.name))
  .then(console.log)
~~~

The above shows its use in `merge`, but it will of course work for functions invoked by `then`. Here's an example where the repo filtering is more flexible, allowing the repo with the most forks to be selected:

~~~javascript
const getRepoWithMax = fn => repos =>
    _.max(repos, fn)

getReposForUser('ColinEberhardt')
  .then(getRepoWithMax(d => d.forks_count))
  .then(merge(getIssuesWithState('all'), d => ({ issueCount: d.length }), d => d.name))
  .then(console.log)
~~~

This approach can also be used to remove the hard-coded username:

~~~javascript
const getIssuesWithState = (user, state) => repo =>
    Q.nfcall(github.issues.getForRepo, { user, repo, state })

const user = 'ColinEberhardt'
getReposForUser(user)
  .then(getRepoWithMax(d => d.forks_count))
  .then(merge(getIssuesWithState(user, 'all'), d => ({ issueCount: d.length }), d => d.name))
  .then(console.log)
~~~

## Conditional logic

Sometimes you need to add logic to a chain of promises, breaking the chain on a certain condition.

As an example, the GitHub API is rate limited, so we could logic which breaks if this limit has been exceeded:

~~~javascript
const getRateLimit = () =>
    Q.nfcall(github.misc.getRateLimit, {})
~~~

Using a similar pattern to the `sideEffect` function above, the following code allows a promise to be rejected, which will exit the current chain of promises,:

~~~javascript
const rejectIfTrue = (fn, rejectValue) => d =>
    fn(d) ? Promise.reject(rejectValue) : d
~~~

Here it is in action:

~~~javascript
const user = 'ColinEberhardt'
getReposForUser(user)
  .then(getRepoWithMax(d => d.forks_count))
  .then(merge(getRateLimit, d => ({rate: d.rate})))
  // rejection logic ...
  .then(rejectIfTrue(d => d.rate.remaining < 60, 'rate limit exceeded'))
  .then(merge(getIssuesWithState(user, 'all'), d => ({ issueCount: d.length }), d => d.name))
  .then(console.log)
  .catch(console.error)
~~~

Notice the addition of the `catch` function. This is called on rejection.

(Yes, the example is a little contrived, with the rate limit being checked after the first API request)

## Chaining promises

One final little trick that removes the repeated `then` invocations in the above code is to use the technique described in the Q documentation for [sequences](https://github.com/kriskowal/q#sequences):

~~~javascript
const chainPromises = (initial, promises) =>
    promises.reduce(Q.when, Q(initial))
~~~

With this in place, you can remove the repeated use of `then`, simply providing each promise generating function as an array:

~~~javascript
const username = 'ColinEberhardt'

chainPromises(username, [
    getReposForUser,
    sideEffect(d => console.log(`total repos: ${d.length}`)),
    getRepoWithMax(d => d.forks_count),
    d => ({ repo: d.name, language: d.language }),
    merge(getIssuesWithState(username, 'all'), d => ({ issueCount: d.length }), d => d.repo)
])
.then(console.log)
.catch(console.error)
~~~

You can see the completed example in action via the a [tonicdev playground](https://tonicdev.com/colineberhardt/5751a6ac9a782d13005e0995) - these are pretty neat playgrounds that allow you to use ES6 features (via node v6), and also give access to the npm registry.

## Conclusions

Hopefully you'll have found something useful in my little toolbox of patterns for cleaner promises. As a final example, here's a much more complex chain of promises:

~~~javascript
chainPromises(Q.nfcall(github.repos.getAll, {}), [
  // fetch all the repos that this bot operates on and select one to update
  sideEffect(d => console.log('Fetched ' + d.length + ' repos')),
  repos => ({ repoName: pickRepo(repos) }),
  sideEffect(d => console.log('Updating ' + d.repoName)),
  // get the owner, for the purposes of PRs etc ...
  merge(getRepoOwner, d => ({repoOwner: d})),
  // check if the bot already has a pending PR
  merge(getUpstreamPullRequests, d => ({upstreamPRs: d})),
  rejectIfTrue(d => d.upstreamPRs.some(pr => pr.user.login === program.username), 'There is already a PR pending - Aborting!'),
  // update the bot's fork
  merge(updateToUpstream),
  // get the README and update
  merge(getReadmeForRepo, d => ({path: d.path, content: d.content, original: d.content, sha: d.sha})),
  merge(addAwesomeStars, d => ({content: d})),
  merge(checkLinks, d => ({content: d.content, report: d.report})),
  // check if this has resulted in changes
  sideEffect(d => console.log('Checking for differences')),
  rejectIfTrue(d => d.original === d.content, 'Markdown has not changed - Aborting!'),
  sideEffect(d => { if (program.test) { console.log(d.content); } }),
  rejectIfTrue(() => program.test, 'Test mode, PR not being submitted'),
  // write the changes
  merge(writeReadmeToRepo),
  sideEffect(d => console.log('Written README for repo ' + d.repoName)),
  // create the PR
  merge(createPullRequest),
  sideEffect(d => console.log('PR submitted - all done :-)'))
])
.catch(console.error)
.finally(reportRateLimit);
~~~

The above code is from a [GitHub bot](https://github.com/ColinEberhardt/awesome-lists-bot) I was playing around with a while back, which makes extensive use of the GitHub API. The patterns employed above hopefully makes the functionality of this bot quite clear.

If you've got any little tricks you use to make working with promises easier, I'd love to hear about it!

Colin E.
