---
title: Web app or desktop app? Considering user needs in technical discussions
date: 2020-07-22 00:00:00 Z
categories:
- csanderson
- UX Design
tags:
- Web
- apps,
- desktop
- containers,
- Electron,
- PWAs,
- UX
- design
author: csanderson
layout: default_post
summary: The choice of whether to build a web app, a PWA, a desktop container app
  or a native desktop application is one that is usually dominated by technical discussions.
  Of course, a deep understanding of the technical tradeoffs is essential. But what
  can often be underrepresented is a consideration of the real end-users, and what
  approach might be best for them.
image: csanderson/assets/comparison.png
---

Once upon a time, if you wanted to create an application, you’d have to decide if you wanted to build a web app or a desktop app. Or invest massive resources into building and maintaining both.

Thanks to recent advancements, the gap between web apps and desktop apps is shrinking. We can now get some of the advantages of native desktop applications for much cheaper using technologies such as desktop containers and progressive web apps (PWAs), whilst also maintaining an online offering.
Why pick between creating a desktop app or a web app when you could have both?

![Why don''t we have both?]({{site.baseurl}}/csanderson/assets/why-not-both.gif)

The choice of whether to build a web-only app, a PWA, a desktop container app or a native desktop application is one that is usually dominated by technical discussions.

Of course, a deep understanding of the technical tradeoffs is essential. But what can often be underrepresented is a consideration of the real end-users, and what approach might be best for them.

To contribute to these conversations, we should have an appreciation for two areas:

- The different technical approaches available, and how each one influences the end user experience.

- Our users’ context and tasks, and how these relate to what technology choice might be best for them.

---

## Web vs. desktop

The first thing we need to understand is the positives and negatives of web-apps versus desktop apps. 

What do I mean by ‘web app’ and ‘desktop app’? Web apps run inside a web browser, while desktop apps are installed and run on the user’s machine. Both have their benefits, from a user’s perspective, in different situations:

![Summary of web app positives]({{site.baseurl}}/csanderson/assets/web-apps.png)

### Web apps...

**✅ Are cross-platform**  
Web apps will be able to function pretty much the same across different operating systems, while a different version of a desktop app may need to be built for Windows, Mac and Linux - each with its own set of design standards that users will expect. However, when designing and building a web app, considerations still need to be made for different browsers.

**✅ ️Can be accessed from anywhere**  
Including on a mobile device or a shared computer. Desktop apps exist only on the devices they have been installed on.

**✅ Require no installation or manual updates**  
Web apps require no installation and updates are applied automatically. Desktop apps require the user to install the software and apply updates when major versions are released. These steps are just extra effort for the user and provide more chances for things to go wrong and cause frustration. 

![Summary of desktop app positives]({{site.baseurl}}/csanderson/assets/desktop-apps.png)


### Desktop apps…
**✅ Can access operating system features**  
Desktop apps can use OS features such as the notification system and file management, while web apps have very restricted access. The capabilities of a web app are limited by the capabilities of the browser on which it’s run.

**✅ Offer better offline support**  
Web apps typically require an internet connection to access and save progress. Desktop apps can be opened and run without an internet connection. However, this is just a general rule, of which there are exceptions. There are instances of web apps that work offline and desktop apps that don't.

**✅ Increase chances of repeated use**  
Once installed, desktop apps can open on start-up or become the default application for opening a certain file. This makes them great for long-term, daily use. They have their own presence on a user's desktop, instead of just being another tab in the browser. 

![Web vs. desktop summary]({{site.baseurl}}/csanderson/assets/web-vs-desktop.png)


You can see that there are benefits to both approaches. But, as I mentioned earlier, we no longer have to choose between the two. New technologies are making it easier to get the best of both worlds 🎉.

---

## Progressive Web Apps

An evolving technology that seeks to draw on some of the benefits of native applications, a Progressive Web App (PWA) is essentially a web app with a few extra lines of code added to allow it to look and act like a mobile or desktop app.

**What does this mean?**
- You can install it with one click onto your device.
- Once installed, it can be opened and run like a mobile/desktop app.
- There is no browser border surrounding it, you can pin it to your taskbar or homescreen.
- You can access it while offline through caching.

Sounds almost just like a desktop app, right?

![Progressive web app summary]({{site.baseurl}}/csanderson/assets/pwa.png)

While on the surface it may look much like a desktop app, it is still missing some of the powerful under-the-hood features that give desktop apps an advantage, such as access to OS features. 

However, an advantage of PWAs is that they can be installed both on desktop computers _and_ mobile devices. So you’re essentially getting three apps for the price of one. Kinda. 

_(Of course, in the case of a mobile PWA, you would still have to make your app responsive and consider other aspects such as performance on a mobile device.)_

While PWAs can offer all of the great stuff above in theory, different levels of support across operating systems means that they can't be fully relied upon to replace native applications - yet. For now, it remains a fringe technology that is not widely adopted by those outside the tech world. 

Nevertheless, creating a PWA has the _potential_ to give users an ‘app-like’ experience, for a fraction of the cost of building native mobile and desktop applications when you already have a web app. And with the technology developing rapidly, it could be a serious contender in the future.

---

## Desktop Containers

Desktop containers are frameworks that allow desktop apps to be written using web technologies such as Javascript, HTML and CSS. 

The most commonly used desktop container at the time of writing is Electron. You probably have a few Electron apps running right now. Microsoft Teams, Slack, Spotify, Figma and Skype are just a few examples that I use on a daily basis. Popular code editors Atom and Visual Studio are also built on this technology. What makes it such a popular choice?

Because desktop container apps can be written using web technologies, it makes it much easier to maintain both a desktop and web app. Firstly, they can share a single codebase with minimal differences between them. It also makes it easier to run across different platforms. However, users will still expect slightly different experiences across different operating systems, so work will still need to be done to cater to these expectations.

The experience of using a desktop container app is much closer to that of a native application when compared to a PWA. Desktop container apps are often installed and updated in a similar way to native applications. A big advantage of a desktop container over a PWA is the ability to access OS features such as notifications, file systems and multi-window management.

![Desktop containers summary]({{site.baseurl}}/csanderson/assets/desktop-containers.png)

This makes them more powerful than PWAs, but with great power comes great…development cost. Designing and building for a web and desktop experience at the same time is still extra effort - even with the advantage of being able to write them in the same languages. What we need to measure up is whether that extra effort is worth it - and we can do that by understanding the users.

---

## User Considerations

Now that we understand what the different trade-offs are of the different technical approaches, we are better informed to consider how these might affect the end-user.

The next step is understanding our users and the different aspects that may make one approach more favourable to another.

![User considerations summary]({{site.baseurl}}/csanderson/assets/user-considerations.png)

### Context

**- What kind of environments will the user be in?** What devices will they be using? Do you expect them to use this app in the office, at home, or while travelling? On a work computer, personal laptop, or mobile? Will they always have an internet connection? Things like this could inform whether you would be better to have an installed desktop application, a more easily-accessible web-app, or an offline-friendly PWA.

**- What operating systems or browsers do they use?** Do they have restrictions on installing software, or using different browsers? If you find out that your users are restricted in installing new software, then a web-app could be a safer choice. However, if your users are stuck using an outdated browser, then an installable desktop container app may be better. Unfortunately, there is often significant overlap between these two groups of people 🤦‍♀️.

### Tasks

**- How long will they use the app for? How frequently?** Desktop apps are more suited to heavy daily use, while web apps are ideal for quick, irregular tasks that don’t warrant the commitment of installed software.

**- Do they need any operating system features?** Do users need native alerts? or multi-window management? Are there tasks that can’t be completed from within a web browser? If so, then a desktop container app may be the way to go.

**- Do they need to integrate with other software?** Often, we can use multiple different apps to complete a complex task. For example, editing shared documents over email. These tasks can become a lot easier when the programs can talk to each other — this is a feature that desktop container apps can offer over web apps.

![Comparison of web apps, PWAs, desktop containers and native apps]({{site.baseurl}}/csanderson/assets/comparison.png)

---

## The best of both worlds

Thanks to recent advancements, the gap between desktop and web apps is shrinking, and we can now get the best of both worlds by using technologies like desktop containers and PWAs. This allows us to have both a web and desktop offering for far cheaper than would have been possible in the past.

However, cheap does not mean free, and we should always weigh up the expected real-life benefit to the user against the cost of what we are building. Are there aspects of having a desktop app that are valuable enough to warrant the extra time it will take to design, develop and maintain? Will the user care enough and use it often enough to install it onto their device?

What is the ‘MVP’? Yes, a desktop app would be really cool, but is it essential? Could you start with a web app and then layer on functionality, moving to a PWA and then a desktop container in future? Understanding your users will help to answer these questions.

Felix Rieseberg gives some great advice on building iteratively based on requirements in his [comparison of Progressive Web Apps and Electron](https://felixrieseberg.com/progressive-web-apps-electron/):  
> "If you’re building an app with web technologies, make it a progressive web app. Once you’ve outgrown the constraints given to you, make your PWA run within Electron. Until you have needs that aren’t met by progressive web apps, don’t incur the cost of maintaining your own desktop software."

![Building iteratively from web app, progressive web app, to desktop container]({{site.baseurl}}/csanderson/assets/interative-building.png)

Ultimately, we are building tools to help users solve problems, and we should choose the approach that best facilitates this, whether that is desktop-only, web-only, or somewhere in-between.

To find out more about using web technologies to build desktop ecosystems, check out the introductory white paper and various webinars from Scott Logic:
[How to cultivate tomorrow’s integrated desktop ecosystem](https://www.scottlogic.com/how-to-cultivate-tomorrows-integrated-desktop-ecosystem/)






