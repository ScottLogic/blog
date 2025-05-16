---
title: Read the books! Should junior developers use LLMs?
date: 2024-07-12 00:00:00 Z
categories:
  - Artificial Intelligence
tags:
summary: Large Language Models are powerful tools that can greatly enhance software developers' productivity, but for junior developers starting a career in tech, they may hinder long-term growth by abstracting away essential programming fundamentals.
author: hsauve
---  

I started my career in software development as a graduate just a few months after the first demo of ChatGPT had been released. With limited experience and exposure to code, and with a non-coding related background, I felt I needed all the help I could get so at the time Large Language Models (LLMs) seemed like an appealing solution to help me get to grips with programming.   

But LLMs didn’t come out with an instruction manual and like everyone else, I experimented with them. Because of how easy and instinctive they were to use, they quickly became a go-to place for help and I started noticing a pattern in my learning that didn’t feel quite right. So I decided to take a step back and get back to the basics.  

In this blog, I explore the role of AI through the lens of someone just beginning their journey in tech - and consider how we can embrace it moving forward.  

## The appeal of AI  

The world of software engineering is becoming increasingly competitive and with the tech sector experiencing slowdown in hiring, candidates must show even more acumen, flexibility and the ability to adapt and learn at a fast pace.   

The breakthrough of LLMs brought the prospect of an increase in efficiency and productivity in programming, questioning the very notion of what it means to be productive as a developer, and bringing with it fears of job replacements.  

In that context, why would anyone shy away from a personal coding assistant available 24/7?  

## Learning to code takes time (and energy)  

Whether it’s learning a new language with its complex grammar and syntax or going through the complicated rules of a board game, learning comes with discomfort.  

In that respect, the first few weeks of coding are challenging or at least they were for me. With the first programming language, you also need to get your head around programming, its logic and concepts as well as the myriads of libraries, tools and plugins that everyone on the internet and their dog seems to have an opinion on.   
The first few months of learning to code are mentally exhausting, punctuated by eureka moments when something ‘clicks’, as the brain forges a new neural pathway.  

![My Image]({{ site.github.url }}/hsauve/assets/junior-devs-llms/neural-network-representation.jpg "Representation of neural networks")

*Photo by [Growtika](https://unsplash.com/@growtika/) on [Unsplash](https://unsplash.com/photos/an-abstract-image-of-a-sphere-with-dots-and-lines-nGoCBxiaRO0/)*

When using AI, the journey leading to a solution is often obscured and these neural pathways aren’t developed in the same way.  
This reminds me of the children’s book *The incredible book eating boy* by Oliver Jeffers, where the main character Henry, rather than reading books, actually eats them and in huge quantities to become the smartest person on earth. His knowledge expands so much that everything gets mixed up in his head, because it is said: ‘he didn’t have time to digest it properly’.   
One day, Henry picks up a half-eaten book and starts reading it, which opens up a whole new world he hadn’t been able to see, and he realises that reading the books can still make him the smartest person on earth, just with a bit more time.  

![My Image]({{ site.github.url }}/hsauve/assets/junior-devs-llms/book-eating-boy.jpg "Henry eating books")
*Picture taken of the book 'The incredible book eating boy' by Oliver Jeffers*

Skipping the books isn’t an option when it comes to coding. The learning curve can be tough when the brain adjusts to new ways of thinking, but this process is essential for integrating knowledge, and consistent practice helps reinforce it.  

## AI can turn into a crutch  

AI tools are incredibly impressive, and in my experience, they can also be addictive, the same way social media is. They offer instant results and gratification and are like a one-stop shop for all kinds of information.   

But over reliance on chatbots to produce code can prevent the development of a deep understanding of a problem and its possible solutions. The same way chatbots rely on context to provide accurate responses, delegating problem-solving entirely limits the formation of an internal context or mental model. And next time a similar issue arises, that déjà-vu feeling may not be there.  

Using AI to write code that you don’t really understand feels a bit like cheating, which can equate in some situations to a lack of ownership and accountability.   

It’s a bit like paying a private tutor at uni to write your essay. Yes you’ve had an amazing grade, but if you were asked about it, would you be able to answer?   

It also means that without these tools, independent problem-solving can be difficult. And when the moment comes for a coding challenge or a technical interview, your artificial colleague is not here to help.  

I was recently working on a client project that uses Angular. Having no prior experience with the framework, I was faced with an issue that involved listening to changes made in one component that were affecting a functionality in the component I was working on.  

ChatGPT recommended I use a computed signal, it even wrote it for me and all I had to do was pop it into my code. Just like that I had a fix and my code was working. However, at the time I only vaguely understood the concept of signals, I knew of them and roughly how they worked but I hadn’t properly experimented with them and they didn’t feel familiar. Like when you have a flat tyre and know all the steps to fix it, where your kit and spare wheel are in the boot, but until you do it yourself, your understanding of it is conceptual.  

By using an LLM for a concept I didn’t fully grasp only delayed the process of integrating the knowledge. When a similar problem came up a few days later, I read the documentation, looked up examples in the code base and came up with a solution of my own.   

There are many reasons why taking the time to get familiar with programming fundamentals is essential.  

### Searching for information  

An important skill to hone as a developer is the ability to look for the information needed. At times, it may feel like searching for a needle in a haystack on Stackoverflow, sifting through people’s comments, the conversations they generate, why one solution was upvoted and not another.  

You’ll get to know the websites you can trust, the YouTube channels to follow, you go through tutorials and documentation galore.  

### Debugging and troubleshooting  

Where ChatGPT tailors its answer to a specific question, online forums will rarely give the exact answer to a problem, instead they help build critical thinking, getting to know whether an answer can be adapted to a specific case, to then be tested and tweaked until a solution works.  

Although chatbots are getting better at asking for feedback and which option was the most helpful, it is still one straight line from point A to point B, which doesn’t reflect the reality of the job.  

### Reviewing code  

Reviewing other people’s code is another important part of a developer’s job so it is important to learn to read and understand code, and ask questions as your learning expands. Developers will be expecting their colleagues to review the code, not AI.  

### Sharing knowledge  

Getting confident with the fundamentals of coding also enables you to pass on that knowledge to future generations of developers. What appealed to me in a career in software was the collaborative nature of the work, and how it is the collectiveness of brains that make software better and safer.  

By replacing the passing of knowledge with AI, we run the risk of limiting ourselves and missing sharing opportunities.  

## How can we embrace AI in our jobs?  

With more experience in software now but still at a junior level, and with a better understanding of how to effectively prompt an LLM in a way that serves me, I’ve developed new usages for AI in my day-to-day job namely:   

- A fast Google search for which I could easily find the answer to, given more time such as: 

`What is the syntax in Tailwind for triggering a scroll bar only when the height of the text is bigger than that of the div it’s in? `  

- Rubber Duck debugging 

Detailing my thought process, the potential solutions I envisage, the pitfalls I can already see, in as much plain language as possible, i.e. not providing any actual code. 

- A refactoring assistant  

Once I have a solution that works, LLMs can be useful in suggesting refactoring ideas, when prompted correctly with the purpose of the refactoring i.e. verbosity, performance etc. 

### Conclusion  

AI is undoubtedly reshaping the world of software and whilst AI tools can enhance experienced developers' capabilities by automating repetitive tasks so they can focus on higher levels of complexity, they can also hinder the foundational programming skills in junior developers. At the start of a career in tech, mastering the basics should take precedence over short-term productivity gains.  

Learning to use these tools is important to keep abreast of changes in the industry and so as developers, it is essential we learn to use AI in a way that does not hinder our human potential but instead enhances it; using AI as a support rather than a substitute.  
