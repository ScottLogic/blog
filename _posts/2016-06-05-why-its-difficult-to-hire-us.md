---
title: A study of software testers
date: 2016-06-05 00:00:00 Z
categories:
- Testing
tags:
- software testing survey
- data analysis
- R programming
- hiring testers
- featured
author: rhamilton
title-short: A study of software testers
summary: I decided to do some research into testers and the challenges we face in
  the work place to find some answers. These are some my findings.
image: rhamilton/assets/featured/survey.png
layout: default_post
---

<img src="{{ site.baseurl }}/rhamilton/assets/survey.png" alt="title image" title="title image"/>

##Why is it really difficult to hire testers?

A few months ago I found myself involved in a number of discussions not about testing, but about testers.

All the conversations I had revolved around the following questions:

* Why is it difficult to hire testers?
* How do people actually become testers?
* Does anyone actually choose to be a tester or do they just fall into testing by accident?
* Is it possible to persuade computer science students to pick a testing career over development?

I had my own thoughts and opinions about the answers to these questions so I immediately drafted a blog post. It was all about testers and based on my own personal experiences and conversations with some of my friends that work in testing.

It got me thinking about testers in the workplace and the challenges we face every single day. I thought about the best and worst testing roles I had previously held. I considered how these jobs had changed my outlook on testing.

I considered publishing this draft blog post, but I felt something was missing. I had spoken to some tester friends on Facebook to get their opinions and compared their experiences to mine, but I still felt uneasy. I asked myself how could I make sweeping statements such as "most testers do not have a degree in computer science" based solely upon my own subjective personal experience and opinions. The simple answer was I couldn't. So with a heavy heart I didn't publish that post. Even so, I still found myself unable to stop thinking about these questions that I really wanted to know objective answers to.

I decided to do some research into testers and the challenges we face in the work place to find some answers. I created a survey on Google Forms and distributed it to testers via Twitter, Slack chat, social media and word of mouth. I knew from the start that I wanted this project benefit the testing community so I also decided that I would make all the raw data available on Github. I wanted everything to be transparent so that other people could also potentially use the data for their own analysis.

It was very important that anyone responding to this survey could not be personally identified as sensitive questions about work were asked. I found that because the survey was conducted in an anonymous way, a lot of testers were actually very happy to help fill it in for me. But what was even more amazing was that testers also wanted answers and passed the link to the survey on to other testers they knew.

The survey ran from 4th May 2016 until 20th May 2016 and was completed by 187 people. The number of testers that responded honestly astonished me. I am very proud and thankful to be part of such a helpful and supportive community. My sincerest thanks go out to everyone that helped by taking part.

If you are interested in the raw data collected by my survey, this can be found on [Github](https://github.com/Rosalita/tester_survey) as survey_results_raw.csv

The whole time the survey was running and collecting data I knew that I was going to need to carry out analysis and crunch the numbers to see if the data collected answered any questions. I studied Maths with Statistics at A-level so had some pretty basic knowledge of statistical analysis. I was however [concerned about having to manipulate large amounts of data in Excel](http://www.forbes.com/sites/timworstall/2013/02/13/microsofts-excel-might-be-the-most-dangerous-software-on-the-planet/#5d974d7072ae). This lead me to investigate learning [a programming language called R](https://en.wikipedia.org/wiki/R_(programming_language)). The book I worked through and used as reference was [Learning R by O'Reilly](http://shop.oreilly.com/product/0636920028352.do). The R script I wrote, named survey_analysis_1.R, [is also available on Github](https://github.com/Rosalita/tester_survey/blob/master/survey_analysis_1.R) to support my research and make my findings reproducible. I have included my commented R code as some people may find it interesting or useful to see how the charts and graphs were generated.

The actual survey results contained so much data that I could probably write volumes about testers in the workplace. Instead, I thought it was wiser to try use the survey data collected to answer one question per blog post.

The first question that I specifically wanted to try tackle was "Why is it so difficult to hire testers?"

##Our survey says: not all testing jobs are equal

In the survey I presented testers with 12 positive statements about testing in their workplace such as "When I make a decision, I feel my judgement is trusted." and 12 negative statements such as "I am usually excluded when decisions are made." I asked respondents to answer true or false to this set of 24 questions. One point was scored for answering true to a positive question and one point subtracted for answering true to a negative question. This resulted in each tester achieving a score ranging from -12 to + 12. I named this score a tester's "Workplace Happiness Index". To score +12 a tester would need to say all the positive questions were true and none of the negative questions were true.

The frequency histogram below shows the Workplace Happiness Index of 181 testers.

<img src="{{ site.baseurl }}/rhamilton/assets/histogram_happiness_at_work.png" alt="happiness histogram" title="happiness histogram"/>

* The minimum Workplace Happiness Index score is -8 and the maximum is +12. This certainly proves that not all testing jobs are equal.
* Some have many positives and few negatives, some have many negatives with few positives. The mean (average) score for a tester's Workplace Happiness Index is 4.6 so the average testing job has more positive traits than negative.
* Out of all the testers currently working in testing, only 5.5% had jobs where all the positive statements were true and all of the negative statements were false i.e. scored +12.

One of the questions asked by the survey asked was "Are you happy in your current testing job?".

<img src="{{ site.baseurl }}/rhamilton/assets/happy_pie.png" alt="happy pie" title="happy pie"/>

I wanted to compare whether testers said they were happy (or not) against their Workplace Happiness Index. I wanted to know if there were happy testers in jobs where lots of negative things happened. Or if there were lots of miserable testers in jobs where lots of positive things happened.

<img src="{{ site.baseurl }}/rhamilton/assets/work_and_tester_happiness.png" alt="work and tester happiness" title="work and tester happiness"/>

I used a box plot to visualize the relationship between a tester happiness and their workplace happiness index. A box plot is a way to show patterns of responses for a group. The groups in my box plot are Happy and Not Happy Testers.
The thick black lines inside the coloured boxes show the median or mid point of the data. The coloured boxes represent the middle 50% of scores. The circles show outliers which are observations that lie an abnormal distance from all the other values in the group.  For the Happy tester group there is one outlier, this is a single tester that said they were happy despite their work place ranking -7 on the Workplace Happiness Index. There were also two testers which said they were not happy despite their workplaces scoring +10 and +11 on the workplace Happiness Index.

The box plot does show a strong connection between how positive or negative the tester's workplace is and whether the tester working there say they are happy or not.

* The median Workplace Happiness Index for a tester that says they are happy is 7
* The median Workplace Happiness Index for a tester that says they are not happy is -1

One theory I had in my original draft blog post was that it was difficult to hire testers because testers were very unlikely to change jobs for a number of reasons. I thought some testers would be reluctant to change job in case they found themselves jumping out of the frying pan into the fire by moving from a workplace with positive traits to one with more negative traits.

I needed to know if the workplace happiness index had an influence on whether or not a tester was likely to change job. Would testers only look for new testing jobs if they were currently working in a negative workplace? Would testers working in positive workplaces be unlikely to leave.

I divided testers into groups based on their likelihood to look for a new testing job and measured these groups against the workplace happiness index. The box plot below shows this data.

<img src="{{ site.baseurl }}/rhamilton/assets/new_test_job.png" alt="likelihood to leave testing" title="likelihood to leave testing"/>

There definitely was a pattern between negativity in the workplace and testers looking for new testing jobs:

On the Workplace Happiness Index from -12 to +12 The median values were as follows:

* For a tester very likely to look for a new testing job, 1
* For a tester likely to look for a new testing job, 2
* For a tester not sure about looking for a new testing job 5.5
* For a tester unlikely to look for a new testing job, 8
* For a tester very unlikely to look for a new testing job 10

So lets summarize the data that has been crunched so far:

* Approximately 3 out of every 4 testers say they are happy.
* Happy testers are, for the most, part unlikely to look for new testing jobs.
* It harder to hire testers which have experience because only 1 in 4 testers are not happy in their current testing job making them likely to look for a new testing job.

I wanted to know about the new testers that were coming into the profession to fill the jobs that experienced testers were not moving into. The survey asked "How much testing Experience do you have" and the responses to this question have been plotted below.

<img src="{{ site.baseurl }}/rhamilton/assets/test_experience.png" alt="tester experience" title="tester experience"/>

The graph above shows that there is certainly a lack of new testers within the profession.

I chose to split the data on experience level at 2 years experience. I did this because many testing job adverts in the UK specifically ask for 2 years previous experience. The pie chart below compares numbers of testers with more than 2 years experience with testers that have not yet reached 2 years experience.

<img src="{{ site.baseurl }}/rhamilton/assets/two_years_exp.png" alt="more and less than 2 years pie" title="more and less than 2 years pie"/>

I found these numbers a little disturbing. Perhaps the "you must have two years experience" barrier imposed in most job adverts is very difficult to overcome and currently serves as a gate blocking new people from a testing career path. It feels like as an industry we are not providing enough opportunities for people to move into testing. What will happen when all the testers that have been testing 10+ years start to retire? I can only see it becoming increasingly more difficult to hire testers in the future if the number of people entering the profession does not increase.

I feel very proud because I can honestly say that my current employer actively recruits graduates with no previous experience and provides training for them. This training is not just for the developer path but there is also a graduate software testing training path too. Another initiative at my company which started this year was to launch a paid software testing internship over 12 weeks, designed to give a "taste" of a software testing.

More companies need to be aware that when the testing jobs they seek to fill are not ranked highly on the workplace happiness index, they simply won't be able to hoover up the best existing talent in the industry. Employers which are struggling to hire testers will need to either start growing their own testing talent or improve testing in in their workplace to the level where working there is better than working elsewhere. I certainly think that providing in-house training and mentoring is one way the difficulty of hiring testers can be eased.

##Retaining testers starts to become as important as hiring new testers

A company can mitigate against the fact that it's hard to hire testers by making testing in their workplace a more positive experience. The survey conducted proves that once the positivity in a workplace reaches scores of 8+ on the workplace happiness index, testers become unlikely or very unlikely to leave.

The following actions contribute to a higher workplace happiness index:

* Do not place unachievable expectations on your testers
* Make your testers feel like they are part of the team
* Include your testers when decisions are made
* Get people outside of the testing department to start caring about the quality of the project
* Implement automated testing
* Do not measure testers using metrics (e.g. bug count or number of production rollbacks)
* Give your testers access to the tools and resources they need
* Value the technical skills your testers possess
* Share important information with your testers
* Let your testers work collaboratively with others
* Address technical debt and don't let it build up
* Provide opportunities for your testers to progress and take on more responsibility
* Appreciate the role testing plays in development
* Take steps to reduce the volume of employees (not just in testing) leaving the company
* Trust the judgement of your testers
* Stabilise foundations, avoid building on broken production code, broken infrastructure and broken services
* Stop forcing testers to work unpaid hours
* Start viewing testing work with equal importance as development work
* Stop forcing testers to sign disclaimers stating code "contains no bugs"
* Support your testers to attend training courses, workshops or conferences
* Allow your testers feel like they are making a positive difference
* Educate management to understand what testing is and is not
* Permit testers more time to test, this may mean testing needs to start sooner
* Do not blame testers for missed bugs

If a company wants to be above average in terms of positivity and happiness they would need to at least apply 17 out of the 24 above actions to their workplace (based on the mean workplace happiness index of 4.6)

So far I feel like I have only scratched the surface with this data set and I intend to continue exploring this data in future posts.

This post was also published on my software testing blog [Mega Ultra Happy Software Testing Fun time](http://testingfuntime.blogspot.co.uk/).
