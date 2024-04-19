---
title: Measuring energy consumption in the cloud
date: 2024-04-19 00:00:00 Z
categories:
  - jcwright
  - Sustainability
layout: default_post
summary: A look into one approach to measuring energy consumption of CPU benchmarks on AWS.
---

Measuring energy consumption in the cloud is deceptively hard. You would think that the cloud providers, with their God-like omniscience, would be able to rustle up a chart or two. Alas this data remains frustratingly absent from most cloud providers’ reporting tools. As the world becomes more aware of the impending climate crisis, businesses that wish to keep an eye on their energy (and by extension carbon) impact are left at the mercy of their cloud provider to give them some kind of idea of how they’re doing. Often all that’s available is a generic carbon footprint report that, if you’re lucky, is updated once a month.

This blog post is one in a series of posts from an internal project undertaken here at Scott Logic. The aim of the project was to investigate the carbon footprint of mobile computation. A slight misnomer in that we’re also comparing mobile to the server. I won’t go into the actual results as that’s a topic for a different blog post. Instead I wanted to talk through the steps we took to solve the problem for our use case.

### What we were trying to solve

Before we could actually start building anything we needed to know what data we needed to capture or generate. I knew from the mobile apps the team had already built before I joined that we would be running some CPU benchmarks. Although the project has the words ‘carbon footprint’ in the name, the actual point of comparison between the three platforms (iOS, Androids, and the server) would be energy consumption.

So we needed some sort of test harness that could be deployed to the cloud (provider TBD) from which we could run these CPU benchmarks, record how long they take to complete, and calculate the energy consumption. Easy enough, right?

### Non Starters

Our first idea was to make use of the built in carbon footprint reporting tools. We determined that Google Cloud Platform (GCP) would be the best provider here. Our theory was we would be able to take the carbon footprint number, given in kilograms of CO2 equivalent, and calculate it back into a figure for energy used. However, after reading the white paper and diving into the GCP console it became clear that this approach would not work at all. There were too many unknowns about exactly how Google was calculating the carbon footprint, particularly the embodied carbon they were including. Also the report is generated monthly and is an aggregate across the services so this approach was swiftly shelved.

My background is primarily in AWS so while doing research into GCP I came across a blog post by Etsy on their Cloud Jewels. Truthfully, I think I found it by Googling something like “how to measure energy consumption on GCP”, a blatant shot in the dark hoping someone had already done the heavy lifting for me. The Cloud Jewel approach looked promising enough, although it still seemed a little too vague. For instance it assumes a figure of 2.1Wh per vCPU. Any vCPU, regardless of instance type. So that got moved to the back burner. It would be good enough if we couldn’t find anything else but we wanted to keep digging.

Around the same time, our Principal Architect on the project pointed me in the direction of a post by Teads. They had created a carbon footprint estimator for AWS instances and helpfully had created a spreadsheet with energy figures for almost every instance. This was the data we needed. We would run the benchmarks, capture the CPU utilisation from CloudWatch, then use the Teads energy figures for the instance type we were using and the duration of the run to calculate energy.

### Running Benchmarks

Now armed with a rough idea of what to do it was time to start building. So that we could compare the server results to the mobile results we would need to implement the benchmarks in Java and Swift. I decided to start with Java as it’s a language I’m already familiar with. I decided to create a simple Java Spring Boot application that would act as the test runner. I created a REST controller from which we could select the benchmark to run, the complexity, and a number of iterations. That last part will become important when it comes to measuring the energy.

The benchmarks used were:

- Fannkuch
- Mandelbrot
- Spectral

I was able to lift the benchmark code directly from the Android app repo.

The test runner was Dockerised and ran on ECS using EC2. I started with the t2 instance family but the boosting ability meant that run durations weren’t consistent. I changed to an m4.large. This gave me 2 vCPU cores and 8GB of memory. The memory was somewhat irrelevant as utilisation never got higher than around 9.5%. The m4.large was fine until it came time to implement the WebAssembly versions of the benchmarks. For whatever reason the wasm binaries would refuse to run and exit with a 132 exit code. Changing to a more modern m6i.large instance fixed that. We were never able to get to the bottom of it.

For Swift, rather than creating an entirely new test harness application, I was able to run it from the same Docker container as the Java benchmarks using another Spring REST controller and the Java ProcessBuilder API.

It was much the same story for WebAssembly. I included a WASM interpreter along with the benchmark binaries and again used the ProcessBuilder to run the benchmarks.

### Measuring Energy

So what approach did we take? Because the Teads spreadsheet gave us energy figures for basically every instance, I figured I could write a simple method that would take the CPU utilisation data and estimate the energy consumption by comparing it to the Teads data. Better still, if I could integrate this into the test runner app all I would need to do is set the benchmarks away running and wait for the results.

Fortunately, because our test harness is a Java Spring application, that gives us the ability to use the AWS SDK for Java to programmatically get CPU utilisation metrics from CloudWatch. This presented a slight problem. CloudWatch utilisation data is an average of CPU utilisation for the last minute. If the benchmark doesn’t run for long enough, the CPU utilisation percentage won’t be accurate. To combat this there are two options: increase the complexity of the benchmark, or run lots of benchmarks consecutively. We needed to keep the complexity values consistent across runs on all platforms so that just left running consecutive benchmarks.

Having the energy calculation functionality built into the Java test harness was a big reason behind the decision to run the Swift and Wasm benchmarks from it. There are almost certainly better ways of doing it but we found this approach worked well for us.

### Potential Future Steps

As is the case with most research projects, the work is seldom finished. Our server experimentation only covers CPU benchmarks. The mobile work started looking at JavaScript, GPU benchmarks, and video encoding. Expanding the server testing to cover these areas is the logical next step in the project. Unfortunately we ran out of time to complete them as part of this project, but perhaps it’s something that we or another team could circle back to.
