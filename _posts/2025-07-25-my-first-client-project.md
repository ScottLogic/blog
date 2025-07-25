---
title: "Lessons under construction: My first client project"
date: 2025-07-25 00:00:00 Z
categories:
  - Tech
tags: 
- Tech
summary: I have recently come off my first client project, which I was part of for 9 months, and so I wanted to reflect on everything that I learnt during that time.
author: hsauve
---  

I have recently come off my first client project, which I was part of for 9 months, and so I wanted to reflect on everything that I learnt during that time. 

The client was a Fintech company, specialising in regulatory compliance and the project was greenfield, which meant that our team was building the platform from the ground up. I joined as an Associate Developer and most of the technology was new to me, which made the experience feel like an exciting challenge. 

## The building site 

At the time I onboarded, the project had been going on for a few months, the foundations were laid, a lot of architecture decisions had been made and everyone was busy building the product at a fast pace. 

I could see parallels with the concept of a building site with many moving parts happening simultaneously. 
Each day, I could see our project taking shape, with new features and functionalities being added, much like the walls and floors of a building. I will therefore extend the metaphor by reflecting on my experience. 

![My Image]({{ site.github.url }}/hsauve/assets/first-project/building-site.jpg "A building site")

<sub>*Photo by [Quang Nguyen Vinh](https://www.pexels.com/@quang-nguyen-vinh-222549/) on [Pexels](https://www.pexels.com/photo/building-canes-2138126/)*</sub>

## The technology 

### Frontend development 

For the first few months I primarily focused on frontend development using Angular with TypeScript. We were using a recent version of the framework, which gave me the opportunity to experiment with signals to handle reactivity. The project also used the component library PrimeNG to design the platform in accordance to what the User Experience (UX) team had set on our blueprint [Figma](https://www.figma.com/), a collaborative interface design tool used to prototype the product. 

One of the first tickets I tackled was building the initial version of a modal, to display specific content in an overlay when a user requested it. I built the modal component to be responsive and reusable, so it could appear in differents parts of the platform.

In building terms, it would be a bit like building a structure with rafters and trimmers to install a skylight on the top of the building. I would start by spending time reading the manuals for the tools I was to use and look at how other people were building similar elements elsewhere. I'd then make sure I cut the timber with the required dimensions, apply the right colours and make sure the window coming in later would fit in without sticking out. 

![My Image]({{ site.github.url }}/hsauve/assets/first-project/woman-builder.jpg "Cutting timber for a skylight")

<sub>*Photo by [Los Mertos Crew](https://www.pexels.com/@cristian-rojas/) on [Pexels](https://www.pexels.com/photo/handywoman-grinding-a-wood-plank-8447849/)*</sub>

The project had a strong emphasis on testing, so I spent a significant amount of time writing unit tests using the Jasmine testing framework. I also got the opportunity to explore integration and end-to-end tests which made me appreciate the crucial part that testing plays in the success of a project. 

### Backend development 

Spending a few months focused on a single area allowed me to deepen my understanding of programming logic and principles and meant that I felt ready to hop on the backend side of things when the opportunity arose. 

The project used C# which was my first introduction to the .NET ecosystem. An example of the work I did was around getting data into an existing calendar. I was tasked with adding a new tab to display content tailored to the user's selected interests. For this I created a new API endpoint which would retrieve data from a Cosmos database using adequate query selectors, and display the results in the User Interface (UI). 

If I was on a building site, my next task would be to turn the skylight into an electric window by connecting it to the building's electricity supply. That way, on a sweltering summer day, the inhabitants of the building would only have to press a button to get fresh air coming in. 

![My Image]({{ site.github.url }}/hsauve/assets/first-project/electrical-box.jpg "A power supply")

<sub>*Photo by [Kindel Media](https://www.pexels.com/@kindelmedia/) on [Pexels](https://www.pexels.com/photo/close-up-photo-of-opened-switchboard-8488029/)*</sub>

### Cloud 

The choice of Cloud provider was Azure, and I had the opportunity to delve into that space a little, specifically on the Azure event hubs. One of the non-functional requirements was to audit user activity happening on the platform, such as when a user created a feed or viewed a piece of content. When a change appeared in the Cosmos database, a mediator service would publish the event to an event hub.

Working with Azure event hubs was particularly fascinating because it allowed me to see how different parts of the platform could communicate and interact in real-time. This work also enabled the client to access valuable pieces of insights into platform usage. 

## Spanner in the works 

The nature of the work and the number of people working on the project meant that teams were navigating constant streams of changes, which inevitably presented challenges. This is where working under [Agile](https://agilealliance.org/agile101/) principles took on its full meaning, providing the ability to pivot and adapt to changing requirements. The agile rituals of daily stand up and end of sprint ceremonies for instance enabled us to keep track of the workflow, adapt to the direction the project was taking and to reflect on completed work. 

One pivotal moment was when we transitioned from using Scrum to the Kanban methodology as it proved to be a better fit for the workflow at that stage.  While we initially committed to completing increments of work within two-week periods, it became clear that maximising flow was more important at that stage of the project. Kanban offered the flexibility we needed, allowing us to focus on continuous delivery while still retaining valuable Scrum elements like regular ceremonies.

## Construction team 

Most of my team was based in the Bristol office, and as we operate in a hybrid manner, we would meet in the office on a weekly basis. Those days were great for pair programming, asking for advice, getting to hear about other areas of the project but also socialising. There was a strong sense of collaboration and support within the team and I felt fortunate to work alongside experienced developers who would always find the time to share their knowledge and answer questions.

As a junior developer, I particularly enjoyed listening in on discussions, whether on the topic of API structure or broader architectural decisions. It was also a formative experience to observe how senior colleagues communicated, navigated trade-offs, and represented the team in a client-facing environment. 

![My Image]({{ site.github.url }}/hsauve/assets/first-project/team-of-builders.jpg "A construction team on a building")

<sub>*Photo by [Randy Fath](https://unsplash.com/@randyfath) on [Unsplash](https://unsplash.com/photos/people-building-structure-during-daytime-ymf4_9Y9S_A)*</sub>

## Conclusion 

As I look back on my time on the project, I realise how much I have grown, working across the stack and getting new technologies and tools under my belt. While there were moments that felt daunting, each step gave me a little bit more confidence, stronger foundation and deeper understanding of software development in a real-world setting.

On a final note, although the project lent itself to a construction metaphor, I hope to never have to handle electricity work, for my sake and that of others. 
