---
title: Developing vAirify for the ECMWF
date: 2025-01-14 00:00:00 Z
categories:
- Open Source
tags:
- vAirify
- Open Source
- featured
summary: A short blog about my experience developing on the vAirify project.
author: bell-jones
title-short: Developing vAirify for the ECMWF
image: bell-jones/assets/vAirifyLogo.png
layout: default_post
---

From crafting logos to leading stand-ups, my journey with vAirify wasn't just about code—it was a crash course in full-stack development, cross-organizational collaboration, and the art of turning weather data into actionable insights. 

As a recently promoted developer who began as a freshly trained associate, my experience was initially limited to the graduate project—an internal project designed to provide new graduates with practical development experience. In this context, my recent work on the vAirify project for the [European Centre for Medium-Range Weather Forecasts](https://www.ecmwf.int/) marks a significant milestone in my career. This blog post will highlight the experience I had as a relatively junior developer on a Scott Logic project. 

The vAirify project was part of the Code for Earth challenge, an initiative organized by the ECMWF. The aim was to build a system that would allow them to compare their forecasted Air Quality Index (AQI) values with actual measured AQI data. This would help them gauge the performance and overall accuracy of their air quality forecasts. If you would like to learn more about the project, please look at this [case study](https://www.scottlogic.com/our-work/code-for-earth-evaluating-air-quality).

## My Contributions and Experience
My role in this project was multifaceted, encompassing a diverse array of technologies and challenges. It allowed me to wear multiple hats, from technologist to problem-solver, and even gave me the opportunity to tap into my creative side. If you would like to check out the code for yourself here is a link: [The Code](https://github.com/ECMWFCode4Earth/vAirify)

## Agile
We adopted Kanban as our agile methodology. If you would like to learn more about Kanban, you can find out more [here](https://blog.scottlogic.com/2024/03/07/kanban-not-the-lazy-option.html). We used a GitHub project board, which was an interesting change from the Jira platform I had previously used on the grad project. During our daily stand-ups, we would often 'walk the board,' reviewing our progress and giving each member of the team the opportunity to talk about what they have been working on. I even had the opportunity to lead a stand-up ceremony for the first time, which was a new and enjoyable experience for me. 

## Pipeline
I developed a GitHub Actions workflow to implement conditional testing for our project. This workflow was designed to run frontend and/or backend tests only when changes were made to their respective parts of the system, improving our CI/CD pipeline efficiency. The development process required me to push code changes and create new commits each time I needed to test the action, which was quite tedious, and explains the many commits on my branch. Each commit is a step in refining and verifying the functionality of the conditional testing workflow.  

Before this update to the pipeline, the pipeline ran quite slow having to run all tests at once. The implementation of this feature significantly boosted performance by only running tests when code that corresponds to said tests change. 

## Backend Development
The backend development in this project was particularly fascinating, especially the ETL (Extract, Transform, and Load) process. Our system regularly collects data from sources like OpenAQ, processes it, and updates our database. We use powerful Python libraries such as Pandas and Xarray for this task. As is seemingly typical for Python and its libraries, I found these were all very well written and easy to use. 

For our API, we chose FastAPI, a library I hadn't used before but found exceptionally well-crafted and enjoyable to work with. It significantly streamlined the process of setting up an API to serve data to our frontend. This became clear during my work on implementing an endpoint to query forecast data from our database, highlighting FastAPI's efficiency and ease of use, needing very few lines of code to create the endpoint. 

## Frontend Development 
The frontend development also presented some exciting challenges. I had the opportunity to work with charting and graphing libraries, such as ECharts, to display the air quality data to the users. On a city detailed view page, such as London's, users could view multiple graphs showing pollutant data. A key requirement was to plot pollutant values at hourly intervals. However, the database had data points that didn't align precisely with these hourly marks. To address this, I implemented a data pre-processing step that averaged all measurements within a ±30 minute window around each hour and then plotted the data on the graph. 

Others on the project did some interesting work too, such as creating a map that displayed the location of measuring stations, which allowed users to select and deselect the stations to be used on the graphs. This was very cool to see. 

## Collaborating with External Experts 

In addition to working with ECMWF mentors, I had the chance to collaborate with a data scientist from the University of Bristol. This cross-organizational collaboration allowed me to learn from different perspectives and gain insights into the challenges faced by the various stakeholders involved in the project. 

Every week we would have a review, where we would go over what we had done that week and demo any features we implemented. It was interesting hearing their views and perspectives on the product and us working together during this call to make it better, tailoring the software more and more to the ECMWF’s vision.  A notable instance of this collaborative process occurred during one of these meetings when discussing a key user interface element: a drop-down box for adding and removing measuring stations from graphs. Initially, there was a proposal to replace this feature with an interactive map interface. While the map offered geographical context, I saw that the existing drop-down allowed for quicker removal of multiple stations.

![Measurement Sites]({{ site.baseurl }}/bell-jones/assets/MeasurementSites.png)

This observation led to a constructive discussion where I advocated for keeping the drop-down alongside the new map feature. I learnt quite a lot from this experience, such as having multiple ways of doing something could cater to different user preferences and use cases.

## A Work of Art 

And to finish off the blog, on a more unorthodox ticket, I had fun creating a logo for the project in [Procreate](https://procreate.com/). The colours were chosen to match the colours of the AQI levels we used during the project. Unfortunately, however, I was not able to fit all 6 colours on the logo... Due to not leaving enough space between letters. 5 out of the 6 is pretty good if you ask me, a happy accident you might say as I think adding an extra layer may have been too much. It proved somewhat controversial, but beauty is in the eye of the beholder, and I thought it looked good! You can make up your own mind... 

![vAirify Logo]({{ site.baseurl }}/bell-jones/assets/vAirifyLogo.png)

Perhaps it's a good thing I chose software development over software design! 

## Key things I'll take away from the project:

  1. I received more Agile experience:
      - Effectively used Kanban with a GitHub project board, leading a stand-up ceremony for the first time.

  2. Got some CI/CD Pipeline Experience:
      - Developed a GitHub Actions workflow for conditional testing, improving pipeline efficiency by running targeted tests.

  3. Got to use Python for Backend Development:
      - Worked on ETL processes using Python libraries like Pandas and Xarray.
      - Successfully implemented API endpoints with FastAPI, appreciating its efficiency and ease of use.

  4. Frontend Development:
      - Utilized ECharts for data visualization.
      - More React experience
      - Got to see some great looking maps

  5. Collaboration and Learning:
      - Engaged in cross-organizational collaboration with ECMWF mentors and a University of Bristol data scientist, gaining valuable insights and perspectives.

  6. Art is hard

## Conclusion 

The vAirify project proved to be a transformative experience, significantly contributing to my growth as a developer. It provided me with invaluable exposure to a diverse range of technologies as I worked across various aspects of the system, from frontend development to pipeline management. Navigating the complexities of a client-facing (mentor) project enhanced my professional skills and understanding of real-world development challenges. I'm grateful for the opportunity to have taken part in this project and am confident that the knowledge and experience gained will be instrumental in my future endeavours at Scott Logic. 
