---
title: 'Battle of the carbon - Android vs Cloud vs iOS'
date: 2024-04-23 00:00:00 Z
categories:
- Sustainability
tags:
- Sustainability
summary: When pitted against each other, can mobile compete with cloud in terms of energy efficiency?
author: swoods
---

# Introduction
When given the same computational task which platform performs the best in terms of energy use? We wanted to find out so did some R&D where we pitted Android and iOS against a cloud based platform to find out which uses the least energy and thus the lower carbon impact. 

# Introducing the Competitors

To pit each platform against one another we picked 1 or 2 competitors for each. It's only a small sample limited by time and what we had to hand but still allows us to get a taste of the possible differences. In future we'd love to try a more comprehensive variety of mobile devices, cloud providers and instance types.  

## Android
Representing Android we have two devices, the Xiaomi Redmi Note 10 Pro, and the Google Pixel 6. Both of which were released in 2021 with the Pixel6 having the higher specifications.

|Device|  No of Cores| Core Speed| Android Version|
|---|---|--|---|
|Xiaomi| 8 | 2x2.3 GHz & 6x1.8 GHz|12|
|Pixel6| 8 | 2x2.8GHz 2x2.25GHz 4x1.8GHz|14|

## Cloud
Using AWS as our cloud provider we used a couple of different instances to run the tests on. Compared to the mobile options the cloud based instances had a lower number of cores to work with - this shouldn't matter for single threaded benchmarks but could for multi-threaded.

To give a fair comparison for the mobile devices we used the same workloads written in both Java and Swift available for execution on the cloud.  

|Instance Type| No of Cores| Core Speed|
|---|---|---
|m4.large|2|E5-2686 v4 @ 2.3GHz|
|m6i.large|2|8375C @ 2.9GHz|

## iOS
For iPhone we have the iPhone6 Mini, also released in 2021 similar to the Android devices, but having fewer CPU cores than the Android counterparts.

|Device|No of Cores| Core Speed| 
|---|---|---|
|iPhone6 Mini| 6 |2x3.23 GHz & 4x1.82 GHz|

## Keeping the results fair
In order to keep all the results fair and to try and avoid other factors affecting the measurements, for any mobile device we used the following setting in order to remove other device processes interfering with the result.
Multiple runs were also used to avoid any background tasks affecting results. 

 - Airplane Mode, Wi-Fi Off
 - Location Off
 - Bluetooth Disabled
 - Minimum Screen Brightness

What we didn't keep fair for a lot of the tests was the language. We used Swift on iOS and Java bytecode on Android and both on the server as this is what you'd normally use as a developer.  

 ## How to measure energy

 We used a mix of internal battery APIs as well as external device monitors to record the energy use. Detailed information on how we measure energy for different environments can be found in these Scott Logic blogs. 

 - [Measuring Energy use of Android Devices](https://blog.scottlogic.com/2024/05/01/measuring-android-energy-use.html)
 - [Measuring Energy use of Cloud Services](https://blog.scottlogic.com/2024/05/02/measuring-energy-usage-in-the-cloud.html)

# Round 1 - Fannkuch
Otherwise known as the Pancake algorithm, this algorithm works on reorganisation of an array based on certain [criteria](https://benchmarksgame-team.pages.debian.net/benchmarksgame/description/fannkuchredux.html#fannkuchredux). Using the same implementation of this across all devices we have the results. 


|Device|Time Taken|Energy Used|
|---|---|---|
|Xiaomi|155|0.0988|
|Pixel6|93|0.0978|
|iPhone|65|**0.0399**|
|Cloud M4 - Java|71|0.211|
|Cloud M4 - Swift|67|0.1975|
|Cloud M6i - Java|**34**|0.127|
|Cloud M6i - Swift|**31**|0.108|

As we can see in terms of pure energy use the iPhone used considerably less than any of its competitors and also beat the other mobile devices on speed, but the cloud based methods was the fastest to complete. 

# Round 2 - Mandelbrot
The Mandelbrot workload is a multithreaded process aimed at calculations of a [fractal set](https://benchmarksgame-team.pages.debian.net/benchmarksgame/description/mandelbrot.html#mandelbrot), which also when plotted onto a axis can produce some interesting images

![Mandelbrot Example]({{ site.github.url }}/swoods/assets/CFoMC_Mandlebrot_Example.svg)

|Device|Time Taken|Energy Used|
|---|---|---|
|Xiaomi|26|0.0292|
|Pixel6|18|0.0309|
|iPhone|**7**|**0.0051**|
|Cloud M4 - Java|46|0.1823|
|Cloud M4 - Swift|18|0.074|
|Cloud M6i - Java|78|0.247|
|Cloud M6i - Swift|12|0.046|

This is clean sweep for the iPhone device, performing the task in the lowest amount of time as well as using the least energy. The Cloud based Java methods seaming to struggle taking the longest. This can be because of the limited number of cores available - as mentioned earlier the mobile chips have multiple cores, albeit of varying speed.

# Round 3 - Spectral
Using another maths / benchmark measurement [algorithm](https://benchmarksgame-team.pages.debian.net/benchmarksgame/description/spectralnorm.html), which works on the spectral norm of an infinite matrix. We can create a computational expensive function which when ran gives the following results. 

|Device|Time Taken|Energy Used|
|---|---|---|
|Xiaomi|185|0.1206|
|Pixel6|**76**|**0.0846**|
|iPhone|230|**0.0875**|
|Cloud M4 - Java|253|0.7435|
|Cloud M4 - Swift|163|0.4793|
|Cloud M6i - Java|**78**|0.247|
|Cloud M6i - Swift|**75**|0.236|

This test provided a mixed amount of results, the Pixel6 being both the fastest and using the least energy, but the iPhone also matched the pixels energy efficiency despite taking 3 times longer. One of the Cloud based workloads also took similar times to the Pixel6 yet used a lot more energy in its calculations.

# Bonus Round - Web Assembly
We also tested Web Assembly code on the selection of competitors available.This has the benefit of providing a same language comparison between the platforms rather than comparing the combination of hardware and native language with Swift and Java. 

|Device|Test Name|Time Taken|Energy Used|
|---|---|---|---|
|Xiaomi|Fannkuch|457|0.2925|
|Pixel6|Fannkuch|471|0.2722|
|iPhone|Fannkuch|539|0.2050|
|Cloud M6i|Fannkuch|429|1.335|
|Xiaomi|Spectral|549|0.3519|
|Pixel6|Spectral|610|0.3369|
|iPhone|Spectral|907|0.323|
|Cloud M6i|Spectral|559|1.752|

This round shows similar times across most platforms, which would be expected due to exactly the same code being ran on both, with only differences due to how each device handles running of the Web Assembly code. This also shows the energy cost of cloud based solutions running this workload took considerably more energy than their mobile counterparts. So this shows a draw between Android and iOS when it comes to the execution of Web Assembly code.

It is worth nothing that on all devices the Web Assembly code took significantly longer to process. 

# And the winner is?

In terms of just measurement of energy use, iPhone has consistently the lowest amount of energy used for its calculations, yet on non-multithreaded processes is the slowest performer. 

The cloud based execution is on average faster than its mobile counterparts, but has a much higher energy cost. Also the choice of language used within the cloud also can cause a noticeable change in the time taken and energy consumed.

# Another challenger appears

The devices we used are from 2021 and there has been many improvements within the specifications and efficiency of mobile devices. So any of the newer mobile contenders on the market could perform these tasks more efficiently and faster than any we currently have here, maybe even an Android device could dethrone the current iPhone champion. 

Not counting out the cloud based methods, there are many different providers as well as products within them, making sure to use the best one for the processes you intend goes a long way to reducing the energy use of your workloads.

All of these results have been recorded on just the processing of a single function, for real world application there are a multitide of factors which can effect the energy use or time of a process. Including the cost of data transfer between device,  which could undo the energy cost reduction from processing on said devices.

## Statistics
- [Xiaomi Device Specs](https://www.gsmarena.com/xiaomi_redmi_note_10_pro-10662.php)
- [Pixel6 Device Specs](https://www.gsmarena.com/google_pixel_6-11037.php)
- [iPhone Device Specs](https://www.gsmarena.com/apple_iphone_13_mini-11104.php)
