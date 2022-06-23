---
author: rhamilton
title: A snapshot of software testers in 2016
title-short: A snapshot of software testers in 2016
summary: "Continuing my research into Software Testers I examine how and why people are getting into testing careers and present a snapshot of testers in 2016 "
image: rhamilton/assets/featured/camera.jpg
tags:
  - software testing survey
  - data analysis
  - R programming
  - software testers
  - testing trends
  - featured
categories:
  - Testing
layout: default_post
---
<img src="{{ site.baseurl }}/rhamilton/assets/camera.jpg" alt="title image" title="title image"/>

Back in May I carried out a survey of Software Testers and I have been continuing to analyse these survey results. My previous blog post about the survey was well received and focused on experience in the workplace. One of the objectives I set out to achieve with the survey was to examine the backgrounds and experiences which have led testers to be where they are today. I wrote another R script to help me interpret the survey results data. For transparency my R script that crunched the numbers and generate the charts used in this post [can be found here on github](https://github.com/Rosalita/tester_survey/blob/master/survey_analysis_2.R)

Exploring the data captured by my survey may give us clues as to how and why people are entering software testing as a career. The results could help dispel myths around hiring testers such as what the average tester looks like on paper and if we share any similar traits. For some people, the results of this survey may open their eyes to any bias or prejudice they may hold.

There was one person that responded to my survey who stated they had never actually worked in testing. Either a very curious tester decided to test the form to find out what would happen if they said they did not work in testing (if you are reading this, you know who you are). Or someone stumbled on the survey from social media without understanding what it actually was. Either way, the person that did not work in testing has been excluded from this analysis.

##Testers in Industry

186 people which had held testing jobs were asked which industries they had tested in. The tree plot below shows the industries where testers work or have worked. The colours of the boxes map to the number of testers that have worked in that industry. Keep in mind that it is possible for a single tester to have worked in multiple industries (which is why the percentages on the tree plot add up to more than 100%).

<img src="{{ site.baseurl }}/rhamilton/assets/treeplot.png" alt="tree plot of industries testers have worked in" title="tree plot of industries testers have worked in"/>

Business was the most popular industry with 95 out of 186 testers having worked within Business at some point in their careers. I did however feel that the Business category was also by far the broadest category which could explain this result.

Things start to get a bit hard to read down in the bottom right corner as the very small boxes show industries where only 1 out of 186 testers surveyed have worked. So I made a [REALLY BIG version of the tree plot which can be found here](https://raw.githubusercontent.com/Rosalita/tester_survey/master/treeplotHD.png)

For each industry, the lower the %, the harder it may be to find someone with experience of testing in that specific industry. For example the tree plot shows that it's harder to find someone with experience testing social media software than it is to find someone with experience of testing financial software.

But does specific industry experience actually matter? I wanted to see the % of testers that had tested in multiple industries vs testers which had only tested in one industry.

<img src="{{ site.baseurl }}/rhamilton/assets/industry_exp.png" alt="industry experience" title="industry experience"/>

Given that such a large % of the sample have tested in multiple industries, this indicates that testing skills are highly transferable between industries and gaps in specific domain knowledge can be bridged. Roughly 4 out of every 5 testers have already adapted and moved between industries.

##Testers in Education

I wanted to know about the education levels of testers. The sample of testers which responded to the survey had a wide range of education levels which can be seen on the bar plot below.

<img src="{{ site.baseurl }}/rhamilton/assets/education_levels.png" alt="tester education levels" title="tester education levels"/>

The most common level of education is a bachelors degree with 46.24% of testers achieving this level of education. Testers with PhDs are incredibly rare and make up for only 1.08% of the sample. There are also some testers (5.8%) which have no formal qualifications at all.

Overall, I wanted to know the proportion of graduate to non-graduates working in testing.

<img src="{{ site.baseurl }}/rhamilton/assets/graduates_pie.png" alt="pie chart of graduates" title="pie chart of graduates"/>

In the sample of testers approximately 7 out of 10 testers had graduated university (a ratio of 7:3).

Some of the testers in the sample did not graduate. I wanted to know if these testers were early or late in their careers. I wanted to see if the industry currently had a trend to only hire graduates.

On the following plots because the number of testers in the groups for "less than a year" and "one to two years" were very small so I chose to group them together into a 'less than two years' group.

The plot below compares number of years testing experience for Graduates and Non-graduates.

<img src="{{ site.baseurl }}/rhamilton/assets/education_experience2.png" alt="education by experience" title="education by experience"/>

Once this data was plotted it revealed that the most experienced testers in the sample were not graduates. However the number of testers with 20+ years experience is very small. The fact that none of the testers with 20+ years experience have a degree may not be particularly significant due to the sample size being small. Non-graduate testers were dispersed throughout all the experience groups. It certainly seems that experience can replace a degree and there are testers out there which have had careers lasting over twenty years without graduating university.

Before I carried out my survey, I had previously held a belief that the vast majority of testers were falling into testing 'by accident' without actively choosing a testing career path while in education. This was one of the reasons I included the question 'While you were studying did you know you wanted to work in testing?'. The response to this question is shown below.

<img src="{{ site.baseurl }}/rhamilton/assets/want_to_test_pie.png" alt="testers that want to test while in education" title="testers that want to test while in education"/>

So 88.6% of testers did not actively want to work in software testing while they were studying. It seems that testing software is a fairly non-aspirational career choice among students. I was curious to see if this was a recent trend or if aspiration levels had always remained low. I did this by grouping the responses by number of years experience which produced the following plot.

<img src="{{ site.baseurl }}/rhamilton/assets/want_to_test_by_exp.png" alt="want to test grouped by experience" title="want to test grouped by experience"/>

None of the testers which had started their careers in the last two years aspired to be Software Testers while they were students. Between 2 to 20 years experience there were some people which had known they wanted a testing career while in education.

##Testers After Education

I wanted to find out how many testers were entering the industry straight from education without any previous work experience. I also wanted to know if this was different for new testers compared to experienced testers. I created a stacked percentage bar plot to illustrate this. Testers were divided into groups based on number of years experience. Each group was then divided based on the percentage which had held a different job before testing and the percentage which had entered a testing job straight from education.

<img src="{{ site.baseurl }}/rhamilton/assets/tester_origin_by_exp.png" alt="origin of testers by experience" title="origin of testers by experience"/>

It appears that as the years have gone by, fewer testers have entered testing with no previous work experience. Only 20.83% of testers with less than 2 years experience had entered testing straight from education without holding a previous job. In the 10 - 20 year experience group, 31.11% had entered testing without holding a previous job. I think this shows that most companies are looking for people with at least some previous work experience for entry level testing jobs. A shortage of graduate testing opportunities may also be the reason that the percentage of testers entering testing straight from education is low.

Given that such a low percentage of people (11.4%) had known that they wanted to be a tester while they were a student I wanted to find out why people were applying for their first testing job. The survey presented a list of possible reasons for applying for first testing job and allowed respondents to select all that applied. The chart below shows these reasons in order of frequency selected.

<img src="{{ site.baseurl }}/rhamilton/assets/reasons.png" alt="reasons to apply for first test job" title="reasons to apply for first test job"/>

Being second from last jobs and careers fairs don't seem an especially effective way of recruiting testers. Unemployment seems much more of a motivator to apply for a testing job.

##Testers in Computing

I wanted to know if testers were studying computing, and also if computing knowledge was viewed as necessary to be a tester. Again, I grouped the testers by number of years experience and divided these groups based on the percentage of each group which had studied computing against the percentage which had not. This created the stacked percentage bar plot below. Keep in mind that the 20+ years experience group is very small, so the data for this group may not be a good representation of the whole population of testers with 20+ years experience.

<img src="{{ site.baseurl }}/rhamilton/assets/study_comp_exp.png" alt="did testers study computing" title="did testers study computing"/>

The most experienced testers had all studied computing, however in the group of the newest testers (less than 2 years experience) two out of every three testers (66.66%) had not studied computing or a computer related subject. Recently in the last couple of years it looks like the requirement for testers to have studied computing has relaxed and computer knowledge is no longer a barrier to entering the Software Testing industry.

##Testers in Training

My survey also investigated training courses. Each person completing the survey was asked if they had participated in any of the following training courses:

<ul>
<li>Rapid Software Testing</li>
<li>AST BBST Foundations</li>
<li>AST BBST Bug Advocacy</li>
<li>AST BBST Test Design</li>
<li>ISEB/ISTQB Foundation</li>
<li>ISEB/ISTQB Advanced</li>
<li>ISEB/ISTQB Expert</li>
</ul>

I started by assessing the percentage of testers which had attended at least one of the above training courses.

<img src="{{ site.baseurl }}/rhamilton/assets/training_pie.png" alt="tester training pie chart" title="tester training pie chart"/>

Given that 29.6% of testers surveyed did not have a degree I wanted to see if testers were undertaking training courses to qualify entry to a software testing career instead of graduating from university. The following bar plot shows numbers attending the above training courses grouped by education level.

<img src="{{ site.baseurl }}/rhamilton/assets/training_by_edu.png" alt="tester training grouped by education" title="tester training grouped by education"/>


The foundation group stands out as being very different to all the other groups. In this group 95.24% have attended one of the named training courses. This is significantly higher than in all of the other groups. The Masters degree group had 67.44% attending one of the named training courses and the Bachelors Degree group had 59.3% attending one of the courses. Maybe graduates see themselves as not needing as much training. The size of the PhD, None and GCSE groups are small so the results for those groups may not be as accurate as representation of the whole population of testers compared to as some of the larger groups.

For each training course testers were asked if they had attended, and if they had, to rate the course for effectiveness.

Each training course was scored based on the total number of responses received.
<ul>
<li>Very ineffective = 1 point</li>
<li>Did not attend = 0 points</li>
<li>Ineffective = 2 points</li>
<li>Average = 3 points</li>
<li>Effective = 4 points</li>
<li>Very effective = 5 points</li>
</ul>

I named the total points the course rating.  The course rating reflects how many people attended and also how effective those people thought the course was. A course attended by five people that all believed it was very ineffective would have the same course rating as a course attended by just one person that thought it was very effective.

The following bar plot shows course rating for all the courses named in my survey.

<img src="{{ site.baseurl }}/rhamilton/assets/training_rating.png" alt="tester training course ratings" title="tester training course ratings"/>

Rapid Software Testing (RST) was the highest rated with a score of 229. Second place was ISEB/ISTQB Foundation Level with a score of 220. Third place AST BBST Foundations scoring 132.

The RST course is regarded as belonging to the modern context driven testing school. While the ISEB/ISTQB is an old style traditional course. We are still seeing many recruiters list ISEB/ISTQB foundation as a necessary requirement for some jobs. I personally think this is the only reason that this particular qualification is popular.

##Testers in Summary

Software Testers come from a huge variety of different backgrounds. We are a diverse group of people who took a variety of paths into our careers. There is no one thing that testers specifically do to become testers but a lot of us are drawn to the profession because we find it interesting. Most testers are graduates but quite a few of us don't have a degree. There isn't a single degree or training course that churns out good testers. Hands on experience is very important because once a tester has gained some experience, formal education no longer matters quite so much. There has certainly been a trend in the last couple of years to hire new testers which do not come from a computing background. Most testers move into testing from a non-testing job rather than from education. Levels of testers entering the profession straight from education in the last two years are the lowest they have ever been.

Whether you are a tester or not I hope you have enjoyed reading about how testers fit into the big software development picture. If any of the findings here have surprised you or challenged your existing beliefs then see this as a good thing. The gift of knowledge is best when it is shared. It makes me very happy that this project has allowed me give something back to the testing community that I am so proud to be part of.

This post was also published on my software testing blog [Mega Ultra Super Happy Software Testing Fun time](http://testingfuntime.blogspot.co.uk/).
