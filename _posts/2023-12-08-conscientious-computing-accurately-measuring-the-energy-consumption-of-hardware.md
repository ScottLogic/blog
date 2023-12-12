---
title: Conscientious Computing - Accurately measuring the energy consumption of hardware
date: 2023-12-08 00:00:00 Z
categories:
- Sustainability
summary: An investigation of the methods available to measure energy consumption programmatically.
author: mgriffin
image: "/uploads/Conscientous%20Computing%203_.png"
---

In this instalment of the [Conscientious Computing series](https://blog.scottlogic.com/2023/10/26/conscientious-computing-facing-into-big-tech-challenges.html), I wanted to investigate the methods available to measure the energy consumption of your code programmatically. As a Software Developer moving into the realm of sustainability, the number of assumptions made when it comes to estimating carbon impacts was surprising to me. My first thought was how do we automate this process and how can you get closer to a measured energy figure without needing additional hardware.

And while there are ways to get more accurate estimations, their use is fragmented depending on your hardware and operating system. In this blog post I will cover these issues in more detail and consider some alternative proxies for energy consumption. But before we dive into that, let’s look at the most accurate forms of measurement and when this might be appropriate.

## Power Monitors

This is a device that will sit between your electricity supply (i.e. the wall socket for consumer devices) and any device you are trying to measure. Their features can vary but should at least display the instantaneous power demand of the hardware and the cumulative energy used over time. More complex devices may provide connectivity via Bluetooth or Wi-Fi, but these often come with an increased cost, or consumer level devices may not allow you direct access to the data, instead connecting via a proprietary app or other devices such as Alexa.

At the lower end of the spectrum, these devices may not be accurate enough to profile an application, especially when having to eyeball readings as you start and finish a test. And even with integrated connectivity, for an organisation with 1000s of machines, adding a monitor for each one is just not feasible. But they can provide a better understanding of your baseline usage, either via the number of Kilowatt-hours used on a daily basis, or the power demand of a system at rest vs at capacity.

For example, I’ve been tracking my energy usage at home at the start and end of each working day. Dividing that into an hourly rate has given a fairly consistent average of around **0.038kWh per hour**. It also tracks the minimum and maximum Watts used at any point, with a current maximum of **72.3W** (although the minimum here is **1.1W**, which must be just before devices go to sleep or are turned off).

## Moving into the hardware

The next level where you can access power measurements is within the PSU or motherboard of your device. This is not something found in all hardware as standard but there are some end user models which include it. It is more common in server grade kit, so when you have software running in your own data centre, this may be the best way to monitor your usage continuously.

This can give you programmatic access to the data, with almost as much accuracy as a wall meter. It also has the advantage of being able to get power and application data from one source, instead of having to sync up power monitor and hardware metrics later. Beyond this level, the readings you will get come from more of an estimation model (which may still be very accurate), as well as being for a more specific subset of the hardware components.

## RAPL

The first term I found when searching for energy measurement methods was RAPL or Running Average Power Limit. This is a feature found in modern Intel Processors, which provides a way to measure and control the energy consumption of a system. You are constrained by your chip manufacturer here but there are also differences in how Windows and Linux allow you to access this information.

The Linux kernel provides a [power capping framework](https://www.kernel.org/doc/html/next/power/powercap/powercap.html), which allows you to access RAPL information via a file like interface (as with all Linux devices). This can be accessed programmatically via standard file access methods. Windows does not offer such a simple interface and requires that you install additional software. Until recently, this was the Intel Power Gadget, which provided GUI and Command line tools, along with a library that could be accessed via code.

Intel have now ended support for this option, with users advised to uninstall and discontinue use as soon as possible. There is a replacement called [Intel Performance Counter Monitor](https://www.intel.com/content/www/us/en/developer/articles/tool/performance-counter-monitor.html) (Intel PCM), but it does not appear to be a simple drop-in replacement. You must build the source code yourself - including compiling and signing your own driver. This is designed to be a common interface across operating systems, so it will be worth following to see how it develops.

Many other tools that aim to measure energy use are wrappers around this functionality. A couple of note that we have experimented with are [JoularJX](https://www.noureddine.org/research/joular/joularjx) and [CodeCarbon](https://codecarbon.io/), which have both been affected by the removal of Intel Power Gadget. Many other libraries will not work when the Linux file paths cannot be found. WSL currently gets the worst of both worlds as it cannot access power readings using either OS method. This is unfortunate if you rely on it for a Linux environment or Docker containerisation on Windows.

## Windows Energy Estimation Engine (E3)

The name gives away the operating system required here, but E3 also relies on your device having a battery. It is a system that always runs in the background, tracking the power used and apportioning it to specific applications. It can fall back to software guesses/estimates when the interfaces aren't implemented in hardware. This is a more holistic approach than RAPL, which only estimates the energy consumption of the CPU, GPU, and memory. CPU/GPU usage is usually the major driver of energy consumption in hardware but there are other aspects like storage, networking and particularly displays in a laptop device that play a part.

It also has the advantage of assigning the energy used to different processes whereas RAPL can only give you the energy used by the entire system. If you wanted to understand the power draw of individual applications running on one system, then you would have to apportion the total power to different processes. This is additionally complicated in a virtualised environment, where you would need to break down by the amount of CPU/RAM allocated to each VM as well as how much work it is doing at that point in time (see [Kepler](https://sustainable-computing.io/) as an example of a project doing this for Kubernetes).

There is a [blog](https://devblogs.microsoft.com/sustainable-software/measuring-your-application-power-and-carbon-impact-part-1/) from Microsoft that demonstrates how to estimate an application’s power and carbon impact using this tool. But I would argue that this does not lend itself to an automated process that could be run repeatedly. There are alternative [tools](https://github.com/MarkBaggett/srum-dump) to dump out the information without stopping the service and backing it up, but it would be great if this data could be queried programmatically without extra steps.

After initially thinking that Linux had the better suite of tools for power measurement, I was surprised to find that this kind of kernel level measurement was something that Linux was missing. I found out about the work of [Aditya Manglik](https://lfenergy.org/lf-energy-summit-2023-recap-understanding-and-measuring-the-carbon-footprint-of-personal-computing/) via the Green Software Foundation’s Environment Variables podcast, who is aiming to create an equivalent system that is helpful for both general users and developers. Having this kind of system running in the background on almost any type of machine would be an immense help in getting an overview of the energy consumption of your entire technology estate.

## Alternative estimation methods

As previously mentioned, CPU usage is not the only driver of energy consumption in a system, but it usually has the biggest impact and variance. [Power provisioning for a Warehouse-sized computer](https://static.googleusercontent.com/media/research.google.com/en/archive/power_provisioning.pdf) (a Google research paper) correlates CPU usage with power demand, and it is one of the main factors used to estimate energy consumption in tools like [Cloud Carbon Footprint](https://www.cloudcarbonfootprint.org/), [Climatiq](https://www.climatiq.io/), [Teads](https://medium.com/teads-engineering/estimating-aws-ec2-instances-power-consumption-c9745e347959), and others. It is also the main aspect that developers can affect in their daily coding practices.

If CPU usage correlates with Power, then the other required measurement to calculate Energy consumption is time.

**Energy (J) = Power (W) x Time (s)**

So as a proxy for Energy you can periodically estimate power via CPU usage and multiply by the time difference since the last estimation. It is important to remember that zero CPU usage would not indicate zero Power, so the estimate should include a constant to account for idle power demand. This could be measured from a simple power monitor or estimated from another source ([SPEC Power database](https://www.spec.org/power/), derived from the chip's TDP etc.). There is also a choice to make in terms of how frequently to make estimations, as this will in turn have an impact on the CPU usage and energy consumption.

The accuracy of this approach would depend on the operations of the code being tested and the method chosen for power estimation. For example, an AI training workload is a major consumer of energy but the load there is on the GPU instead. But it could provide a useful metric for comparisons, for example using it as part of benchmarking multiple dependencies when trying to select the one that is the most efficient. Otherwise, you are left to choose by the shortest time alone or doing more in-depth profiling.

## Testing some of this out

As mentioned earlier, I now have a power monitor set up to track my daily usage. This allowed me to get some actual figures to use for idle and maximum power values. With my fully charged Windows laptop plugged into the device, the lowest observed power with the device awake was around **10 Watts**. I then used a simple Java app, which would do some intense calculations in parallel that took the CPU utilization up to 100% for around 60 seconds. During this period the peak power draw was around **48 Watts**.

The meter itself wasn’t accurate enough to capture a difference in such a short test, only showing consumed kilowatt hours to a maximum of 3 decimal points. But using the time and power observed would give a theoretical maximum of **48W x 60s = 2880 Joules**. RAPL reported around **1800 Joules** used during this period, which may be a lot less but is missing the additional overhead of the laptop’s display. Using some additional monitoring code, I recorded the current CPU load to estimate power and came up with a figure between **2500 – 2700 Joules**.

While my own figure got a little closer in theory, there was more variance in my calculation compared to the RAPL output. This is something that would require further investigation in more ideal circumstances - a Windows laptop is going to have a lot going on in the background that you probably can’t control, like virus scanners etc. A pure Linux desktop would probably be more of a fair comparison to exclude the power draw of the display amongst other things.

## Conclusion

Energy consumption is clearly a complex topic when it comes to software, and there is not a one size fits all approach – nor is there likely to be one in the foreseeable future. The data you can access is only as good as the sensors you have available and the drivers or kernel module implementations that use them. There will almost always be some hardware specific effort involved in finding out what is available to you.

But your choice of measurement may also depend on where you are in terms of your sustainability journey and what level of detail you need. Even something as simple as consulting manufacturer's published estimated energy usage stats for their hardware could be a good starting point to get an idea of your current footprint. But as you look to improve you will need finer detail to validate any changes you make. For example, a daily figure for energy consumption won’t help you verify that a Carbon Aware demand shifting approach is bringing down your carbon emissions.

All we can do is be honest and upfront about the compromises that were made in any estimations. Defining your quantification methods along with which software components you include is an important part of the Green Software Foundation’s [SCI](https://sci-guide.greensoftware.foundation/) methodology for example. As companies move forward with their sustainability plans, we can only hope that the hardware and software keep pace in providing more easily accessible and consistently available methods of measurement.

Accurately assessing the energy impacts of software remains challenging. However, it is an important step towards aligning sustainability and efficiency goals. As developers, we must continue to push for better tools, share techniques, and design with energy efficiency in mind. Small steps towards more sustainable software will collectively make a real difference.

*[PSU]: Power Supply Unit
*[RAPL]: Running Average Power Limit
*[GUI]: Graphical User Interface
*[WSL]: Windows Subsystem for Linux
*[OS]: Operating System
*[CPU]: Central Processing Unit
*[GPU]: Graphics Processing Unit
*[RAM]: Random-Access Memory
*[VM]: Virtual Machine
*[AI]: Artificial Intelligence
*[TDP]: Thermal Design Power
*[SCI]: Software Carbon Intensity