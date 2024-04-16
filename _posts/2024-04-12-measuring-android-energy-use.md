---
title: 'Measuring Energy use of Android Devices'
date: 2024-04-12 00:00:00 Z
categories:
- Sustainability
tags:
- Sustainability
summary: A post about how to gather power usage of android devices without the needs for external tools or equipment.
author: swoods
---

# Introduction
As part of a project onto the carbon footprint of mobile computing (CFoMC), we required a method to be able to record the energy use of certain computational workloads on differing mobile devices, part of that being android mobile devices. So we needed an method to accurately measure the energy use on a device. 

## Why measure energy use?
The reason why we wanted to measure the energy use for our research was to calculate how much energy was used for certain mathematical calculations across differing devices to be able to calculate the carbon footprint difference between them. Other uses for being able to accurately calculate energy use of methods / process etc could also be used for :-

- Comparison of differing functions for efficiency.
- Detect energy intensive areas of an application. 

## Methods of measurement
From investigation we determined there was 2 ways to measure energy use, by using an external power monitor, or the internal Battery Manager API. Each of which have pros and cons to their use. We initially used both methods as to compare them against each other to verify others results, and as both gave similar results we decided to use the Battery Manager API as this did not require any external equipment. 

## Measuring using the Battery Manager API
Using the Battery Manager API, we can query the device for its battery status at various point / intervals and collate results over time to be able to calculate the energy usage of a specific workload. The API can gather detailed information on a devices battery status at a point in time, such as the current power left in a devices battery.

![Android Energy Measurement Method]({{ site.github.url }}/swoods/assets/Anrdoid_Energy_Measure_Method.svg)

### Services
Using a service we can create a reusable method to monitor the energy use throughout a process. We can choose the sample rate of how often we keep record the power levels, then keep it in a list so we can see changes over time of energy use, to be summarised and collated when the process has finished. 

### Battery Monitor API

The battery API can gather a selection of information out from the device, for calculating the energy use from the API we extract the `BATTERY_PROPERTY_CURRENT_NOW` which is the current current of the battery in Microamps.

~~~~~~
	currentPower = BatteryManager.getIntProperty(BATTERY_PROPERTY_CURRENT_NOW)
~~~~~~

We also need the Voltage of the device in question, this is acquired via the via the context and intents of the application.

~~~~~~
	intentFilter: IntentFilter = IntentFilter().apply {addAction(Intent.ACTION_BATTERY_CHANGED)}
	receiver: Intent? = context.registerReceiver(null, intentFilter)

	deviceVoltage = receiver?.getIntExtra(EXTRA_VOLTAGE, Int.MIN_VALUE)

~~~~~~

### Taking the service to useful data
From the collection of data points we collect, we then can use this information to calculated the energy used into Joules of energy consumed. From the list of data we can work out the energy use between two points. 

~~~~~~
    currentInAmps = recordedCurrent / 1000000.0
    joules = currentInAmps * timeDifference * voltage
~~~~~~

For our measurements we took samples every 1 second, so when calculated we had a array of joules used in each second of the process. To get the total amount of energy used we had to sum up all these values to a figure for the entire process. 

### Pitfalls and limitations
There are a few limitations to measuring the devices power by these methods, most can be negated or controlled by ensure certain device conditions

- The phone cannot be plugged in / charging

If the device is plugged in the battery monitor can give incorrect results as it may be charging the device which can cause a negative power measurement.

- Emulators cannot record power correctly. 

When using the app in development using an emulator it cannot record the power correctly as the battery is also an emulation and does not charge/discharge like a proper device.

- Other apps may interfere with results

If there are other apps / system processes running they may impact results. While running tests for the CFoMC project we had a set list of conditions a device must be in for each test.


## Links / Sources etc
- [Battery API link](https://developer.android.com/reference/kotlin/android/os/BatteryManager)
- [Carbon Footprint of Mobile Computing GitHub](https://github.com/ScottLogic/Mobile-Carbon-Android)
