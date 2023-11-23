---
title: Conscientious Cloud – Pick your cloud region deliberately
date: 2023-11-23 20:39:00 Z
categories:
- Sustainability
- Cloud
tags:
- ocronk
- jhowlett
- sustainable software
- Cloud
summary: If you do one thing to optimise cloud carbon footprint start with your choice
  of region. Consider the balance between cost, environmental, security and performance
  considerations when it comes to choosing a cloud region consciously.
author: 'ocronk

'
collaborators: jhowlett
---

This instalment of the [Conscientious Computing](https://blog.scottlogic.com/2023/10/26/conscientious-computing-facing-into-big-tech-challenges.html) series dives into a far more practical example of a consideration that many aren't making consciously: The cloud region being used. In our experience over the last year this one choice can have one of the biggest impacts of the CO2e of your software. BTW if you've missed earlier editions of this series, you can now find them all under the Sustainability section of the Scott Logic blog: [https://blog.scottlogic.com/category/sustainability.html](https://blog.scottlogic.com/category/sustainability.html)

# Cocktails and Carbon Intensity

Before we get on to the cloud region its worth reminding ourselves that not all electricity grids have the same properties. You can think of the electricity supplied by the grid as a nice refreshing mojito. It isn't just a glass of plain old coal anymore, there is now a splash of solar and some fresh sprigs of wind in the mix! Every bar has their own special recipe depending on the ingredients they can find locally, that is why the one you tasted on your holiday to Cuba can't be beaten, and it is the same with data centres. The proportions of fossil fuel energy to low carbon and renewable energy depend on what grids have connected and operational at any given time. This in turn means that the cleanliness of the electricity differs with the data centre you choose.

The mojito analogy holds true for not just location but time too. If the limes aren't in season, you won't get the best flavour and if it is night, there will be no solar energy generation. Just like solar, most renewable energy sources are intermittent and fluctuate depending on environmental factors like wind speed, tide height and river flow.

To get a good visualisation of this in practise check out electricity maps [https://app.electricitymaps.com/map](https://app.electricitymaps.com/map)

[electricitymaps.PNG](/uploads/electricitymaps.PNG)

Electricity maps shows a heat map of carbon intensity – the greener an area the lower CO2 and the more dark red an area is the more carbon intensive it is. So it is worth taking this into consideration when thinking about where you compute and storage workloads are located.

# Default CSP regions

Cloud Service Providers (CSPs) have a default region that they use if a specific region is not selected. Forgetting about the location of where your resources are and just using this default value is the easiest, but it isn't always best. It turns out this one conscientious decision can make a big difference to the carbon footprint of your usage of cloud (as well as the financial cost).

At the time of writing from our investigations we found the CSP regions default to the following:

**AWS** - US East (Ohio) (us-east-2)

**Azure** – state that is calculated by 'trying to find somewhere close to you that has the most available capacity' but to users it appears to be randomly selected

[https://learn.microsoft.com/en-us/answers/questions/311855/when-creating-an-azure-resource-is-the-default-sel](https://learn.microsoft.com/en-us/answers/questions/311855/when-creating-an-azure-resource-is-the-default-sel)

**GCP** – us-central-1 (Ohio) - although note that GCP have an excellent cloud region picker tool that is well worth looking at: [https://cloud.withgoogle.com/region-picker/](https://cloud.withgoogle.com/region-picker/)

# Considerations for choosing a region:

Picking a region that is different from the defaults won't always be the best decision, and there are quite a few factors to determining your optimal region, below we have outlined some of these so that you can understand the trade-offs.

**Cost**

FinOps is an entire discipline dedicated to cost optimisation of technology operations, with technology, finance and business considerations balanced to find appropriate blend (or cocktail?) [Ed: ok we get it you like cocktails!]. GreenOps is very similar to this, taking into account the environmental impact of any deployment. This means that there can be a large overlap of the two, but as shown in the graphic below recently shared by [James Hall from GreenPixie](https://www.linkedin.com/feed/update/urn:li:activity:7125879902414729216/), low carbon intensity regions won't always be the most cost effective. This makes the important point that reducing carbon intensity isn't going to always align with picking the cheapest region, and finding a good balance between the two (and the other requirements called out in this blog) should result in a pragmatic solution.

[finops-greenops.jfif](/uploads/finops-greenops.jfif)

**Data Protection**

Your organisation may hold, use or even request sensitive information which may mean you have to abide by certain data protection laws, these can include the inability to transport and store data outside of the country it was obtained.

This can really limit your region choice and so should be the one of the first factors you filter against when determining your optimal region.

**Supported Services**

After you have discovered the regions that you will not breach policies using the next step is to look at the services supported.

Each region corresponds to one or more data centres, each data centre has different capabilities depending on the hardware inside. This means that not all services a cloud provider promotes will be available in every region.

Making a quick assessment of all the services you require is an easy way to further filter down that list into something manageable that only contains regions that are viable.

**Latency**

Data transfer is pretty quick these days, but it isn't instant. The further your cloud resources and users are apart, the slower your application is going to be. Moving to a region that is closer to your end users than the default region could not only improve the efficiency of the application, but also be a greener solution.

It's important to note that not all networks around the globe have the same speed and efficiency so actually following the path of your data travel and looking at the infrastructure your data will flow can aid in deciding between two data centres that are equal distance for your user base.

**Carbon Intensity**

As a recap Carbon Intensity is the amount of carbon produced per unit of electricity – described as CO2e per Kilowatt Hour – KWH. There are some great tools out there that visualise this like the one screenshotted at the start of this blog Electricity Maps. You can select the latest near real time data on grid intensity or use it to show you averages based on past performance.

There are also some APIs that you can use to retrieve historical, current and even forecast future carbon intensities. Both WattTime and the Electricity Maps API provide this functionality.

For those using the [Cloud Carbon Footprint tool](https://demo.cloudcarbonfootprint.org/) you can also see regions (for each CSP) visualised against the world map with similar carbon intensity colour coding.

[ccf-regions.PNG](/uploads/ccf-regions.PNG)

# Conclusion – pick your cocktail consciously

Changing the region of cloud services from the default can have a drastic impact on the carbon footprint of a solution, but there are several potentially conflicting attributes to consider including cost, latency and privacy. Make deliberate choices based on your priorities to select the most appropriate region for you (although we hope environmental considerations are high up that list!).

If you are interested in learning more or want to collaborate on conscientious computing please get in touch, we would be more than happy to discuss your plans and help you find the perfect mojito [Ed: you definitely wrote this one in a bar didn't you?!] sorry region that offers the most pragmatic balance for your needs!

Email [oliver@scottlogic.com](mailto:oliver@scottlogic.com) or get in touch through [LinkedIn](https://www.linkedin.com/in/cronky/)