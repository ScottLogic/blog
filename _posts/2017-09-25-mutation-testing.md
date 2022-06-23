---
title: Mutation Testing - Who will test the tests themselves?
date: 2017-09-25 00:00:00 Z
categories:
- jwhite
- Testing
author: jwhite
summary: Having good tests is vital for maintaing code but it is difficult to assess
  the quality of your tests. Mutation testing provides one way of evaluating your
  tests. In this post I will be using PIT with Java to demonstrate the capabilities
  of mutation testing.
layout: default_post
---

In this post I will be looking at mutation testing. This is aimed at people who are not familiar with mutation testing. I will give an introduction to what mutation testing is; show some examples of what it can do; consider its limitations and look at how mutation testing can be added to a Java project using PIT. The examples I use throughout this post can be found in this [repository](https://github.com/j-n-white/mutationTestingDemo).

## What is mutation testing?
Very simply mutation testing is a way of testing the quality of your tests by introducing changes into your code and seeing if your test suite detects them.

## But why would I want to test my tests?
I think the best way to look at this is to jump straight into an example. Imagine you have just written the following Java code:

~~~java
private static final int MARGARINE_WEIGHT = 100;
private static final int COCOA_WEIGHT = 25;
private static final int EGG_COUNT = 2;
private static final int ORANGE_JUICE_VOLUME = 15;

Cake createCake(CakeType cakeType) {
	Cake cake = new Cake();
	cake.setMargarine(MARGARINE_WEIGHT);
	cake.setSugar(MARGARINE_WEIGHT);
	cake.setEggs(EGG_COUNT);
	if (CakeType.CHOCOLATE.equals(cakeType)) {
		cake.setFlour(MARGARINE_WEIGHT - COCOA_WEIGHT);
		cake.setCocoa(COCOA_WEIGHT);
	} else {
		cake.setFlour(MARGARINE_WEIGHT);
		if (CakeType.ORANGE.equals(cakeType)) {
			cake.setOrangeJuice(ORANGE_JUICE_VOLUME);
		}
	}
	return cake;
}
~~~

This is a fairly simple factory method for creating Cake objects with the relevant ingredient fields populated. And together with this you have created the following tests:

~~~java
@Test
public void canCreateVictoriaSponge() {
	Cake actual = testee.createCake(CakeType.VICTORIA_SPONGE);
	assertEquals(100, actual.getMargarine());
	assertEquals(100, actual.getFlour());
	assertEquals(100, actual.getSugar());
	assertEquals(2, actual.getEggs());
	assertEquals(0, actual.getOrangeJuice());
}

@Test
public void canCreateChocolateCake() {
	Cake actual = testee.createCake(CakeType.CHOCOLATE);
	assertEquals(100, actual.getMargarine());
	assertEquals(25, actual.getCocoa());
	assertEquals(100, actual.getSugar());
	assertEquals(2, actual.getEggs());
	assertEquals(0, actual.getOrangeJuice());
}

@Test
public void canCreateOrangeCake() {
	Cake actual = testee.createCake(CakeType.ORANGE);
	assertEquals(100, actual.getMargarine());
	assertEquals(100, actual.getFlour());
	assertEquals(100, actual.getSugar());
	assertEquals(2, actual.getEggs());
	assertEquals(15, actual.getOrangeJuice());
}
~~~

This is all excellent, you have test scenarios for each of the different types of cake and you've run your code coverage tool and you have 100% line coverage. So you are left with the warm fuzzy feeling that comes with the knowledge that your functionality is fully tested and if it is ever broken in the future a test will fail to alert the developer. But is this confidence misplaced? The more astute amongst you will have realised that I would not have included this example if there was not a deliberate mistake in it so let's take a look at what a mutation test run makes of this code:

[![createCake mutation test result]({{ site.baseurl }}/jwhite/assets/mutation_fig1.png "createCake mutation test result")]({{ site.baseurl }}/jwhite/assets/mutation_fig1.png)

As you can see the mutation test has highlighted the line that sets the amount of flour for the chocolate cake and sure enough when you look back at the test, the assertion on the flour is missing. The highlighted line of code could be changed and or even removed and all the tests would still pass and no one would know until some unfortunate user came to a sticky end trying to make a chocolate cake with no flour.

Admittedly this is a simple, contrived example and extracting out the duplicated assertions in the tests into a helper method would probably have made the mistake obvious but I'm sure you can imagine more complicated real world scenarios where the code is executed by the test but not actually asserted upon.

## What is this witchcraft, how does it work?
Mutation testing works on the principle that since your test code is there to ensure your deployed code does the right thing then if the deployed code is changed to do something else then at least one test should fail. A mutation testing tool will introduce a mutation to your deployed code then run your test suite against it. If a test fails that is great, the mutation is killed but if all the tests pass then the mutation survived and this indicates a potential area where bugs could be introduced.

## So what are these mutations and how are they introduced?
To answer this I will look in more detail at the tool I am using. In these examples I am using [PIT](http://pitest.org/) which uses [ASM](http://asm.ow2.org/) to manipulate the byte code in memory and insert the mutations into the JVM using the instrumentation API. There are other tools that use different approaches which are discussed in more detail on PIT's [website](http://pitest.org/java_mutation_testing_systems/).

As regards the mutations themselves I shall look at an example:

[![Example mutations]({{ site.baseurl }}/jwhite/assets/mutation_fig2.png "Example mutations")]({{ site.baseurl }}/jwhite/assets/mutation_fig2.png)

This test report is all green meaning all the mutations were killed. The blue numbers next to the lines of code show how many mutations were generated for that line of code. Below the code in the Mutations section it details all of the mutations that were introduced for each line and if they were killed or not. In this example there are 5 different mutations so let's look at those.

### Changed conditional boundary
This mutation changes relational operators to either add or remove the equals sign, effectively shifting the boundary by one. The mutations in the example are

<style type="text/css">
.comparisonTable th,
.comparisonTable td {
    border: 1px solid;
    padding: 10px;
}
.comparisonTable th {
    font-weight: bold;
}
</style>
<table class="comparisonTable">
  <thead>
    <tr>
      <th>Line Number</th>
      <th>Original</th>
      <th>Mutated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>8</td>
      <td><code class="highlighter-rouge">if (input > 0) {</code></td>
      <td><code class="highlighter-rouge">if (input >= 0) {</code></td>
    </tr>
    <tr>
      <td>10</td>
      <td><code class="highlighter-rouge">} else if (input < 0) {</code></td>
      <td><code class="highlighter-rouge">} else if (input <= 0) {</code></td>
    </tr>
  </tbody>
</table>

### Negated conditional
This mutation will invert the conditional to do the opposite of what it originally did.  The mutations in the example are

<table class="comparisonTable">
  <thead>
    <tr>
      <th>Line Number</th>
      <th>Original</th>
      <th>Mutated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>8</td>
      <td><code class="highlighter-rouge">if (input > 0) {</code></td>
      <td><code class="highlighter-rouge">if (input <= 0) {</code></td>
    </tr>
    <tr>
      <td>10</td>
      <td><code class="highlighter-rouge">} else if (input < 0) {</code></td>
      <td><code class="highlighter-rouge">} else if (input >= 0) {</code></td>
    </tr>
  </tbody>
</table>

This can also mutate between `==` and `!=`.

### Removed conditional - replaced comparison check with false
This mutation removes the entire conditional statement and replaces it with false so the code within the if block is never executed.  The mutations in the example are

<table class="comparisonTable">
  <thead>
    <tr>
      <th>Line Number</th>
      <th>Original</th>
      <th>Mutated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>8</td>
      <td><code class="highlighter-rouge">if (input > 0) {</code></td>
      <td><code class="highlighter-rouge">if (false) {</code></td>
    </tr>
    <tr>
      <td>10</td>
      <td><code class="highlighter-rouge">} else if (input < 0) {</code></td>
      <td><code class="highlighter-rouge">} else if (false) {</code></td>
    </tr>
  </tbody>
</table>

### Removed conditional - replaced comparison check with true
This mutation is the same as the previous one except the conditional is replaced with true so the if block is always executed.  The mutations in the example are

<table class="comparisonTable">
  <thead>
    <tr>
      <th>Line Number</th>
      <th>Original</th>
      <th>Mutated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>8</td>
      <td><code class="highlighter-rouge">if (input > 0) {</code></td>
      <td><code class="highlighter-rouge">if (true) {</code></td>
    </tr>
    <tr>
      <td>10</td>
      <td><code class="highlighter-rouge">} else if (input < 0) {</code></td>
      <td><code class="highlighter-rouge">} else if (true) {</code></td>
    </tr>
  </tbody>
</table>

### Mutated return of Object value for com/mutation/testing/demo/FullMutationCoverage::isIntegerGreaterThanOrLessThanZero to ( if (x != null) null else throw new RuntimeException )
This mutation requires a little more explanation. It effectively mutates the return statement so that it returns null to ensure the return value is asserted upon. However sometimes the correct return value may be null so in those cases the code is mutated to throw an exception instead. So in the example line 13 (`return "Zero";`) would be mutated to something like this:

~~~java
if ("Zero" != null) {
    return null;
} else {
    throw new RuntimeException();
}
~~~

This mutation can also be applied to methods that return primitive values instead of returning null in those cases it returns a different primitive value.

### Other mutations
This example only demonstrates a hand full of the potential mutations. The others include mutators which:
- change arithmetic operations
- remove calls to methods
- change which block is the default in a switch statement

Full details of the mutators can be found on PIT's [website](http://pitest.org/quickstart/mutators/)

## So this will change each line of my code then run the entire test suite against it, is that not going to take an eternity to run?
Whist it is true that this process is not quick PIT does a lot of things to optimise the performance so it does not take as long as you might think.

First off PIT does not run the entire test suite against each mutation. It starts off by doing a quick line coverage analysis. This enables it know which tests execute a given line of code. It will then only run the tests that actually execute the given line of code against the mutation. On top of that PIT will prioritise the tests in favour of the ones that are faster and in test classes that matches the standard naming convention e.g. for a mutation in Foo it will prioritise tests in FooTest or TestFoo.

Beyond PIT's inherent optimisation there are additional configuration options. Probably the most effective at reducing the analysis time is enabling incremental analysis. When this is enabled PIT will create a history file and then on subsequent runs it will only analyse the changed files.

Often you will only be interested in the classes you are currently working on so you do not want to run the analysis against the whole code base. PIT allows you to add filters to pick out the specific packages or classes you want to include. It also has a less manual way to limit the scope of the analysis in the it can be configured to tie into your version control system and only analyse source files that have been added or modified.

Another effective way of speeding up the test run is (assuming you have a multicore processor)  to simply increases the number of parallel threads PIT uses.

## Is it not possible that a mutation will fundamentally break the test run?
It is highly likely when generating mutations in loops that it will cause infinite loops. For this reason PIT has a time out and it is generally safe to assume that any mutation the timed out would be picked up by your tests as you are not going to commit code where the test suite runs forever.

PIT can theoretically produce invalid bytecode when creating a mutation but I have not encountered this. Also it should only affect that individual mutation and allow the rest of the analysis to continue.

## What about code that it would not be logical to unit test?
Yes from time to time you have code which you cannot or does not make logical sense to test at the unit test level. Understandably you don't want the mutation testing taking up time analysing this and obscuring the results with failures.

The most obvious example of this is logging code, generally you will not be too concerned about the exact details of the logging output. Fortunately PIT has considered this as well and by default it will recognise logging code from the standard logging libraries and not create mutations in those lines. See the following example:

[![Example with log statements]({{ site.baseurl }}/jwhite/assets/mutation_fig3.png "Example with log statements")]({{ site.baseurl }}/jwhite/assets/mutation_fig3.png)

As you can see in this example there are logging methods present on lines 14, 44 and 45 but there are no mutations generated on those lines. Line 45 is however still highlighted. Unfortunately since my tests were not run with trace level logging that line was never executed so it is highlighted as uncovered code.

Additionally PIT can be configured to exclude sections of code as necessary. This can a done by specifying classes or method names which should be excluded. Alternatively lines which call to specific packages or classes can be excluded in the same way the calls to standard logging packages are. This will not create mutations in the configured lines of code but it will still highlight lines of code that are never executed in any tests.

## So what else can mutation testing do?
On top of the core goal of verifying the quality of your tests there are a couple of other benefits. Firstly it can identify redundant code. Consider the following example:

[![Example with redundant code]({{ site.baseurl }}/jwhite/assets/mutation_fig4.png "Example with redundant code")]({{ site.baseurl }}/jwhite/assets/mutation_fig4.png)

Lines 18 and 19 are highlighted as allowing mutations to survive. This is not due to a deficiency in the tests but that those lines of code are not necessary. Since `computeIfAbsent` returns the existing value if present then if the initial `get` on line 18 is removed the code will enter the if block and fetch the same result on line 20. Similarly when the if condition is mutated to always be true the value will fetched from the map twice but it will still be the same value so the net result will be the same.

A PIT specific advantage is that because it splits up the test and runs them in groups it can reveal unwanted test order dependencies.

## Excellent, is there anything mutation testing can't do?
As with any metric for assessing the test quality there is a danger that the focus becomes achieving an arbitrary statistic. Compared to code coverage, mutation testing gives a much better measure of test quality but still a good mutation coverage cannot guarantee that your code is correct and well tested. It is however a useful indicator of areas of your code which are vulnerable to bugs being introduced as no tests fail when the behaviour is changed.

There are some occasions when mutation testing will flag up issues where there are none.

[![Equivalent mutation example]({{ site.baseurl }}/jwhite/assets/mutation_fig5.png "Equivalent mutation example")]({{ site.baseurl }}/jwhite/assets/mutation_fig5.png)

The above example shows an equivalent mutation as when the line is mutated the code still produces the same result. To see what is happening in line 8 we need to look at what happens when the next value is the same as the current lowest. In the unmutated code `lowest.compareTo(i) > 0` resolves to false so lowest remains at the same value. When the code is mutated the condition becomes `lowest.compareTo(i) >= 0` so now when the values are the same the condition evaluates to true  and lowest is reassigned. However because both values are the same the result is unchanged so the mutation is flagged as surviving. There is no way to avoid these false positives. This is a fairly simple example but there could be more complicated scenarios for example if you have written code to improve performance that does not change the end result.

Another potential scenario for surviving mutations is where you have an intentionally included unreachable code. Remember the cake factory method we started with?  In that example if the cake type was not chocolate or orange then it gave the ingredients for a Victoria sponge. Since those are the only 3 supported cake types this works fine but if you wanted to add a safeguard against new types of cake being added you might refactor the code to be as follows:

[![Unreachable code example]({{ site.baseurl }}/jwhite/assets/mutation_fig6.png "Unreachable code example")]({{ site.baseurl }}/jwhite/assets/mutation_fig6.png)

Now we have a switch statement with a default block. If a new cake type is added without being configured here then the code will fail fast. However for the moment none of the possible scenarios will execute the code in the default block so all mutation there survive.

## Okay I'm sold, how do I run this on my project?
If you have a Maven project then the minimum you need to do to run PIT is to add the plugin to your pom file:

~~~xml
<plugin>
    <groupId>org.pitest</groupId>
    <artifactId>pitest-maven</artifactId>
    <version>1.2.3</version>
 </plugin>
~~~

Then run the following from the command line:

~~~
mvn org.pitest:pitest-maven:mutationCoverage
~~~

This will create a mutation coverage report in `./target/pit-reports` This will provide an overall coverage summary but you can then also drill down into packages and specific classes.

You can of course add additional configuration, some of which I have already discussed earlier. Here is the configuration I have in the repository I used to generate all these examples.

~~~xml
<plugin>
	<groupId>org.pitest</groupId>
	<artifactId>pitest-maven</artifactId>
	<version>1.2.3</version>
	<executions>
		<execution>
			<goals>
				<goal>mutationCoverage</goal>
			</goals>
			<configuration>
				<historyInputFile>./pitHistory.bin</historyInputFile>
				<historyOutputFile>./pitHistory.bin</historyOutputFile>
				<excludedClasses>com.mutation.testing.demo.ExcludedFromAnalysis</excludedClasses>
				<excludedMethods>unusedMethod</excludedMethods>
				<threads>8</threads>
				<mutators>
					<mutator>ALL</mutator>
				</mutators>
			</configuration>
		</execution>
	</executions>
</plugin>
~~~

This configuration includes the mutationCoverage goal so that it will executed as part of the build and does not need to be run independently.  The specified configuration parameters are as follows:

- historyInputFile/historyOutputFile -  Together these values activate the incremental analysis. These specify the location of the history file. These will generally be the same location so that the analysis is just carried out on the changes since its last run.
- excludedClasses - This is a comma separated list of classes which will be excluded from the analysis. * can be used as a wild card to specify whole packages.
- excludedMethods - This is a comma separated list  of method names that will be excluded from the analysis. Any method with a matching name will be excluded irrespective of the class it is in.
- threads - As discussed earlier this is the number of threads to use which will speed up the analysis if your processor has enough cores.
- mutators - This specifies which mutations to apply to your code by default PIT only has some of the mutators enabled. The default configuration focuses on mutations that are not too easy to detect and unlikely to generate equivalent mutations.

These are just the configuration options I used in this demo project. Full details can be found on PIT's [website](http://pitest.org/quickstart/maven/).


PIT can alternatively be configured using [Gradle or Ant](http://pitest.org/quickstart/).

## Cool, one last thing can you summarise this post in a convenient paragraph for anyone who doesn't want to read the whole thing?

Yes I can. Mutation testing is a method of measuring test quality that not only detects if code is executed but assesses the test suite's ability to detect changes in the code. It does this by introducing changes, called mutations into the code and then seeing if that mutation causes a test to fail. This can occasionally falsely flag lines of code due to equivalent mutations where the the mutated code behaves differently but the net result is the same. If you are using Java then PIT offers an easy to use tool that is relatively quick to run, highly configurable and produces user friendly output.