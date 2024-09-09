---
title: Introducing Our Technology Carbon Estimator
date: 2024-09-04 00:00:00 Z
categories:
- Sustainability
summary: Scott Logic's Technology Carbon Estimator helps organizations assess their tech-related carbon footprint by providing an accessible, proportional view of emissions. It highlights high-impact areas and allows users to explore how changes can reduce their environmental impact.
author: mgriffin
---

Introducing Our Technology Carbon Estimator

In February of this year, Scott Logic [announced](https://blog.scottlogic.com/2024/02/13/announcing-the-proposed-technology-carbon-standard.html) our proposed [Technology Carbon Standard](https://www.techcarbonstandard.org/), setting out an approach to describing an organisation’s technology footprint. This standard has proven invaluable in mapping our own carbon footprint, as well as those of clients we've worked with. As awareness of the environmental impact of digital infrastructure grows, it has become crucial to understand and manage technology-related emissions. Around the time of the standard’s release, we began developing a high-level, rough order of magnitude estimation tool to complement it: our [Technology Carbon Estimator](https://www.techcarbonstandard.org/estimator).

![Technology Carbon Estimator]({{ site.github.url }}/mgriffin/assets/tech-carbon-estimator.png "A screenshot of our Tech Carbon Estimator, showing some of the input and a result.")

## Why We Started This Project

The driving force behind the creation of the Technology Carbon Estimator was the growing need to provide organizations with a practical tool to assess and manage their technology-related carbon footprint. Mapping out an entire technological estate’s carbon footprint can be daunting, requiring significant time and resources. Our goal was to create a tool that highlights the biggest areas of concern, offering a practical starting point for organizations aiming to reduce their environmental impact.

We wanted to make something user-friendly and accessible, which could be completed by anyone with a small amount of information about an organization. By providing an indicative percentage of emissions rather than an absolute figure, the Estimator offers a proportional view that is easier to comprehend, giving an indication of what could be prioritised.

## Building the Estimator

As we started this project, it was unclear exactly where this Estimator would be hosted – either as part of the Technology Carbon Standard, our company website or somewhere else entirely. For that reason, we decided to build it primarily as a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) or Custom element, to make it easy to drop it into any site.

We used [Angular](https://angular.dev/) to accomplish this, partially due to the team’s familiarity with the framework, but it also provides some relevant benefits as well. While the Angular framework is large, it will use 'Tree Shaking' out of the box to build the minimal code required and keep the download size low - so that we practice what we preach about the downstream impacts of web traffic. We’d like to reduce its size further in future, as currently the largest component is a library used for the results chart.

It's also been a goal to keep accessibility in mind, recognizing one of the UN’s Sustainable Development Goals being ‘Reduced Inequalities’. We strive to ensure that the site has good keyboard support and ARIA descriptions for visual elements like the results chart. This has been a challenging area to navigate, as it's often difficult to implement accessibility changes without creating some drawbacks for certain groups. Instead, we must carefully weigh the pros and cons of different approaches, seeking solutions that benefit the greatest number of users.

## Understanding the Estimator’s Accuracy and Limitations

One of the challenges we faced in developing the Technology Carbon Estimator was measuring its accuracy. Finding comparable breakdowns of an organisation’s technology footprint was difficult, and those that exist often exclude the embodied carbon of purchased hardware. We attempted to model our own footprint in more detail (as mentioned in our recent [Net Zero update](https://www.scottlogic.com/news/making-good-progress-towards-net-zero)) but found that the Estimator’s results could differ significantly.

However, we believe that the Estimator’s value lies in its ability to provide a proportional view of emissions, rather than attempting to deliver a precise figure that may be laden with large uncertainties. By focusing on the relative proportions of emissions, the Estimator helps users identify which areas of their technology estate are likely contributing the most to their carbon footprint. This approach makes the tool accessible and actionable, even for those who may not be familiar with the intricacies of carbon accounting.

We are also being transparent about the assumptions the Estimator makes, as well as its limitations. For instance, we would like to expand its capabilities to include Software as a Service (SaaS) platforms and develop a greater understanding of the typical differences between industries. We see the Estimator as a starting point, a tool to foster awareness and drive action, rather than as a definitive measure of emissions.

While the Estimator is not suitable for formal reporting purposes, we believe it still offers significant value by guiding users in their sustainability journey and allowing them to experiment with different scenarios to see how changes can affect the overall outcome.

## Try the Technology Carbon Estimator Today

We invite you to try out our Technology Carbon Estimator for yourself. Input your organisation's data, see how changes can affect the output, and gain insights into where your biggest opportunities for carbon reduction might lie. And of course, we're here to help you interpret and act on your results – don't hesitate to reach out to us for a deeper discussion of your findings and next steps.

By providing this tool, we hope to empower organisations to take meaningful action on their technology carbon footprint. While it's just one step on the journey to sustainability, we believe it's an important one. Try the estimator today and join us in working towards a more sustainable future for technology.

*[ARIA]: Accessible Rich Internet Applications