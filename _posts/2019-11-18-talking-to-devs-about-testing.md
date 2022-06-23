---
title: Why I'm talking to developers about Exploratory Testing
date: 2019-11-18 00:00:00 Z
categories:
- cakehurstryan
- Testing
tags:
- Testing,
- featured
author: cakehurstryan
layout: default_post
summary: As a tester in a cross disciplined agile team I frequently talk to and teach
  developers what Exploratory Testing is and how to do it. This account shows what
  I've been talking about and explains why it's beneficial for other testers to do
  the same.
image: cakehurstryan/assets/explorer2.jpg
---

<p>Listening at conferences, reading through articles detailing how large companies like Facebook have no testers and seeing job specs asking for automation and coding skills only you'd almost think that manual testing is dead; but it's definitely alive and kicking. Manual testing has shifted from confirmation of behaviour being right or wrong to the investigation of information that can assist with the design of software, code or products. To augment their automation skills, a tester now must be able to manually explore the system in order to uncover and share information that’s useful to the team.</p>

<p>In the new world of agile development, a tester will frequently be dropped into a team of developers, many of whom will 
not have worked with a tester before, where everybody is responsible for the quality of that product. It’s then on us as testers 
to build an understanding of testing techniques to help the whole team reach the quality that they want to achieve; to that end 
I’ve been training developers in exploratory testing.</p>
<br>
<br>

<h2>What is exploratory testing?</h2>

<p>Exploratory testing is a testing technique that allows for the controlled and planned use of a system or piece of software to 
discover information about it. The aim of exploratory testing is not to confirm things that we know, which is better handled through 
automated tests, but to look for new information by uncovering and challenging implicit assumptions or the unknown.</p>

<p style="text-align:center;"><img src="{{site.baseurl}}/cakehurstryan/assets/infolevels.jpg" alt="Fig 1: Information Levels"></p>
<p style="text-align:center;"><i>Fig 1: Information Levels</i></p>
<br>

<p>When we don’t know about how something will work, or assume how it’ll work, this introduces risk to our product. By exploring that 
behaviour, we can uncover what actually happens, making that information explicit and less risky. With explicit information available 
on how something works, the team can make informed design decisions on whether that’s good or bad; we can also create automated tests 
to validate that this explicit behaviour continues as required.</p>

<p>I’ve spoken to several testers who’ve said that exploratory testing is playing around with the system in an unplanned, or 
unstructured way, but this is not the case. Exploratory testing must be planned in order to be purposeful and useful to the team. The 
test ideas themselves must be tailored and timeboxed to make the best use of time and find information useful to the team and that can 
help shape design.</p>

<p style="text-align:center;"><img src="{{site.baseurl}}/cakehurstryan/assets/testprocess.jpg" alt="Fig 2: Process of Testing"></p>
<p style="text-align:center;"><i>Fig 2: Process of Testing</i></p>
<br>

<p>I use the example of a chair to help explain the process to people new to exploratory testing.</p>
<li>Testing a whole thing means that we run out of ideas for what to test pretty quickly, so break down the product into components 
makes it easier to come up with a greater number of risks or test ideas. A chair breaks down into: Legs, Seat, Cushion, Arm rests, 
Hydraulic raiser, Wheels, Materials it’s made from, Location of the chair, Aesthetic appeal…</li>
<li>For testing to be useful we need to find out information related to risks in the product, hence we should drive out what could go 
wrong with each component. For chair legs that might be: The legs might buckle of break under load, Legs might not reach the floor, Legs 
may not attach to the seat, Legs may not be tall enough, Legs may not provide stability…</li>
<li>From risks we can then create exploratory tests to investigate for information related to the risk, these should be written in such 
a way as to give a specific playground that keeps the testing on track. For example: Explore the use of the chair with different weights 
and loads to uncover information related to the risk that the legs will buckle.</li>
<li>With the tests created the whole team should prioritise them based on what would find the most interesting information. Based on 
that priority the team can explore the product using that test, this should be limited to specific amount of time to keep testing 
relevant. During testing notes should always be taken to help with sharing the information that’s discovered.</li>
<li>The information discovered from testing should be shared to the team can use that to inform design decisions and refine further 
testing to be done in order to ensure its usefulness.</li>
<br>

<p>Another common misconception, stemming from old waterfall approaches or only having exposure to automated tests, is that testing 
must come after having the product built; that testing happens at the end of a lifecycle. As exploratory testing is not concerned with 
confirming behaviour, but instead looks to uncover unknown information, it can be run at any stage of the product development lifecycle 
allowing testing to be pushed earlier.</p>

<p style="text-align:center;"><img src="{{site.baseurl}}/cakehurstryan/assets/projecttimeline.jpg" alt="Fig 3: Testing fitting into Project Timelines"></p>
<p style="text-align:center;"><i>Fig 3: Testing fitting into Project Timelines</i></p>
<br>

<li>At ideation we can highlight initial risks and question to shape the design of the idea.</li>
<li>During design we can highlight risks that may occur.</li>
<li>During coding we can use risk analysis to identify edge cases.</li>
<li>At pre-release we can run tests to uncover information about the built software.</li>
<li>At release and beyond release we can run tests to see how the product has been deployed and works in the wild.</li>
<br>

<p><b>Note that exploratory testing does not replace the need for automated or unit tests, instead it is a technique used alongside 
these tests to discover more information. Ideally, information that’s been identified from exploratory testing should be used to create 
new automated tests (when that’d be useful).</b></p>

<p>A frequent fear that the team will have is that a tester is there to audit them, show them up or just point out all their flaws. This 
may come from their only experiences of working with testers being bug reports that are ping-ponged back and forth between teams, or 
test reports emailed to the whole team awash in a sea of red failing tests. Exploratory testing isn’t about finding fault, it’s about 
finding and sharing information; the bad and the good. After any exploratory testing a debrief should be being held that shares this 
information in a narrative way so that the tester and developer can learn more about the system and jointly make decisions on whether 
that behaviour is desired or not.</p>

<p style="text-align:center;"><img src="{{site.baseurl}}/cakehurstryan/assets/testnotes.jpg" alt="Fig 4: Test Notes from an Exploratory Testing Session"></p>
<p style="text-align:center;"><i>Fig 4: Test Notes from an Exploratory Testing Session</i></p>
<br>

<h2>What are the benefits of exploratory testing?</h2>

<p>When discussing the use of a different technique it’s key to explain the benefits that we, as a team, can get from using it. Where 
people have no knowledge, or a misunderstanding of what testing is then it can be hard to see why we’d want to do it.</p>

<p>Exploratory testing means getting started and providing insights earlier. Since the nature of this testing approach is to find 
information, rather than confirm that something has been built correctly, we can start it at a much earlier point in the design of a 
product. With no need to create scripts in advance the tester can be interacting with the product almost immediately to find useful 
information for the team; this means that we can avoid costly and timely rework because we can identify issues as the product is being 
designed or built.</p>

<p>Exploratory testing uncovers a wealth of qualitive information about the product, good bad and ugly. This means that we can tailor 
and share useful information about the product itself which can influence design, rather than provide an almost meaningless set of 
pass/fail numbers. This means that testing is providing something that’s more engaging and helpful to the team throughout the product 
lifecycle.</p>

<p>As this method of testing is manual, it uses human ingenuity and insight, this means that we can test a wider scope than could 
be achieved through automated testing. Exploratory testing can provide us information on the “untestable”; how does something feel to 
use? Is the branding of the website engaging? What errors can occur when people use the system in an unexpected way? Human insight also 
means that testing can be aligned to investigating potential opportunities rather than being stuck to the steps on a script, allowing 
for more interesting information to be found out.</p>

<p>This style of testing also breaks down the old development phase then testing phase mindset. Through the increased collaboration 
achieved via sharing of information throughout the lifecycle of the product teams can readily see that testing can occur, and is useful 
to do, as early and frequently as possible. The different types of insights that can be provided by a tester through the quality 
narratives they share, spanning business, marketing, user and technical domains, shows that they have a wealth of knowledge that’s 
worth tapping into whilst having that shared information tailored to be useful shows builds trust that the tester is part of the team 
and working towards the same goal.</p>
<br>
<br>

<h2>So, why am I teaching developers?</h2>

<p>Starting to work closely with team members from a different discipline can be daunting; with neither side knowing what to expect 
from each other or even what they do day to day. Moving from those initial fears to build a high performing cross-disciplinary team requires understanding and trust on both sides. I share what exploratory testing is with developers so that they know what I’m doing 
and how I can help them, this means they know what to expect from me and what they can hold me to account for.</p>

<p>Quality is everybody’s responsibility in a team and one tester cannot do all the testing alone. By sharing skills of how to run 
different types of testing it helps other team members to get involved, run their own exploratory testing, think about increasing 
automation test coverage and generally have a mindset to thinking about improving quality. In a high performing agile team, an embedded 
tester can almost take on the role of a quality and testing coach, focusing their time on upskilling the team to ensure quality is 
baked in from the start.</p>

<p>Finally, training developers in testing techniques sets up a culture of skills cross pollination across disciplines. In an agile 
environment people want to become more well-rounded, frequently called T-shaped, so that they can help with whatever needs doing and 
increase team velocity. If you take the time to teach your team members skills from your discipline, it’s more likely that they will 
respond in kind and teach you skills from theirs. Everybody wins.</p>

<p>Let’s ensure that manual testing and the benefits it brings don’t die out. Teach your teams about exploratory testing and the 
benefits they can gain from it.</p>
