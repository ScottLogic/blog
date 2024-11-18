---
title: Running VsTest with Cake
date: 2018-08-14 00:00:00 Z
categories:
- Tech
tags:
- Cake
author: cburbidge
summary: Cake (C# Make) is an awesome tool for writing scripts to build and test projects. This post details how the VsTest runner can be invoked using Cake.
layout: default_post
---

I'm a big fan of the build automation tool Cake. [I prefer to](https://chester.codes/let-them-use-cake) specify <strike>everything</strike> build logic in code and Cake is a good way to achieve this.


[Cake is a:](https://cakebuild.net)

> "cross-platform build automation system with a C# DSL for tasks such as compiling code, copying files and folders, running unit tests, compressing files and building NuGet packages."


There are many unit testing libraries for testing `dotnet` projects. NUnit, xUnit and MsTest are popular options and test projects can reference multiple libraries. 

I recently needed to run tests written in a combination of MsTest and NUnit.
Using Cake to run tests with the NUnit console runner is [well documented](https://cakebuild.net/api/Cake.Common.Tools.NUnit/NUnitAliases/02C315C6). Running tests written with MsTest requires use of the VsTest test runner. 


VsTest is Microsoft's Visual Studio test runner. It is the only way to run MsTest code and is pluggable to allow execution of other libraries.
This made it a perfect choice for my requirement of running MsTest and NUnit. The rest of this post details some of the tricks needed to run VsTest in Cake.

## Download and discovery

The main challenges to overcome are:

- The `VsTest` Cake alias assumes that the `vstest.console.exe` executable is available on the PATH. 
- Running NUnit 2 tests requires VsTest can find the [NUnit test adapter](https://github.com/nunit/docs/wiki/Visual-Studio-Test-Adapter).

`vstest.console.exe` can be obtained with Visual Studio, the Visual Studio Test Agent or via the `Microsoft.TestPlatform` nuget package. The Cake documentation assumes that it is available on the PATH, which is usually achieved by a heavy installation of Visual Studio or a version of build tools. This might not be convenient for all environments where the build script is being run. We can easily download the executables via the `Microsoft.TestPlatform` nuget package.
Cake has great support for downloading and using nuget packages with the `#tool` directive. To download `vstest.console.exe` to the `tools` directory, one can include:

    #tool "nuget:?package=Microsoft.TestPlatform&version=15.7.0"

at the start of the `build.cake` file. The executable path can be discovered easily in Cake with 

    Context.Tools.Resolve("vstest.console.exe");


The NUnit test adapter can also be downloaded via the `NUnitTestAdapter` nuget package with: 

    #tool "nuget:?package=NUnitTestAdapter&version=2.1.1"

at the top of the `build.cake` file. To run VsTest we need to find the `tools` directory that the adapter nuget package extracted to. This can be done with a function:


~~~ csharp
public string getNUnit2AdapterPath(){
    var nugetPaths = GetDirectories("./tools/NUnitTestAdapter*/tools");
    
    if(nugetPaths.Count == 0){
        throw new Exception(
            "Cannot locate the NUnit2 test adapter. " +
            "You might need to add '#tool \"nuget:?package=NUnitTestAdapter&version=2.1.1\"' " + 
            "to the top of your build.cake file.");
    }

    return nugetPaths.Last().ToString();
}
~~~

## Invocation

With the required tools downloaded and discoverable, it's easy to create a `Task` that runs the tests:

~~~ csharp

Task("Run-Tests").Does(() =>
{
    var testSettings = new VSTestSettings{
        ToolPath        = Context.Tools.Resolve("vstest.console.exe"),
        TestAdapterPath = getNUnit2AdapterPath(),

        // use the Trx Logger and a deterministic output file name
        // to be able to import test results into a build orchestration tool (VSTS, Teamcity etc.).
        ArgumentCustomization = arg => arg.Append("/logger:trx;LogFileName=VsTestResults.xml"); 
    };
    
    // the test file pattern will obviously depend on the project.
    VSTest("./src/**/*Tests.dll", testSettings);    
});

~~~

The line:

    ArgumentCustomization = arg => arg.Append("/logger:trx;LogFileName=VsTestResults.xml");

is required to output the results to an XML file. 
This is useful to import the test results into the build orchestration tool that is being used. It's possible to instead use `Logger = VSTestLogger.Trx` in the VSTestSettings, but this will result in an nondeterministic output file name.

## Summary

VsTest is a fantastic console test runner and invoking it with Cake is simple with a few sparsely documented steps.

An example build script, with the above steps can be [seen in this Gist](https://gist.github.com/chestercodes/a553a587c26f8c748922ca7028c694f4).