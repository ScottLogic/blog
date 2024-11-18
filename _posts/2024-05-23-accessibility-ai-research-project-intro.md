---
title: Can LLMs spot accessibility issues?
date: 2024-05-23 08:00:00 Z
categories:
- Artificial Intelligence
tags:
- accessibility
- Artificial Intelligence
summary: This blog series reports on our R&D project exploring the potential of LLMs to enhance accessibility testing.
author: rvango
image: "/uploads/llms%20accessibility.png"
---

## Introducing our Accessibility AI research project

Let's embark on a journey to explore new methods for conducting accessibility testing! These days, it is still
very tricky to create truly inclusive websites. While traditional methods have made progress, there's plenty of room
for innovation.

This blog series is here to document the journey of our R&D project, where we’re exploring whether we can harness LLMs
to improve accessibility testing. Join us as we share our findings and experiences in investigating its potential.

## The state of accessibility testing today

Let’s start with where we are now. The [Web Content Accessibility Guidelines](https://intopia.digital/wp-content/uploads/2023/10/Intopia-WCAG-2.2-Map-Portrait-Mode.pdf) (**WCAG**) provide a set of standards aimed
at making web content more accessible to people with diverse cognitive and physical needs. 
However, only about [20 to 30% of these guidelines](https://blog.usablenet.com/automated-wcag-testing-is-not-enough-for-web-accessibility-ada-compliance) 
can currently be tested automatically.

Why is that? Many accessibility tests require context-aware evaluation, something that traditional automated tools
struggle with. For example, determining whether a heading accurately describes the content that follows isn't something
a machine can easily do by just parsing HTML tags. It requires understanding the context and purpose of the content,
which is why these tests are traditionally performed by humans. This manual process is slow, and often happens too late 
in the development process. 

Imagine if we could catch these issues earlier and faster—wouldn't that be
amazing?

## Exploring LLM-driven accessibility testing

One area where we see significant potential for improvement is in automating the evaluation of headings and labels as
part of the "[_Headings and Labels (Level AA) SC 2.4.6_](https://wcag.com/authors/2-4-6-headings-and-labels/)" criterion from **WCAG**. This criterion ensures that headings
and labels on a webpage clearly indicate what follows, which is super important for people using screen readers.

### The role of Information Architecture in accessibility

To understand why this is important, let's talk about [**Information Architecture**](https://blog.optimalworkshop.com/learn-about-information-architecture/) (IA). IA involves organising and
structuring information to make it easy to find and use, which is essential for good web design. Clear and descriptive
headings and labels are fundamental components of IA, guiding users to the relevant content efficiently.

Imagine you're in a large supermarket. If the signs above each aisle are clear and descriptive, like "_Fresh
Produce_", "_Dairy Products_", or "_Baked Goods_", you can quickly find what you’re looking for.
Now, imagine the signs are vague or non-descriptive, saying things like "_Section A_", "_Section B_", or "
_Miscellaneous_".
You’d spend a lot of time wandering around, getting frustrated trying to find the right section.

![Supermarket aisles: the left side aisles are brightly lit and clearly labelled, with well-organised 'Fruits and Vegetables' and 'Dairy Products' sections. The right side aisles are greyed out, poorly labelled as 'SECTION A' and 'SECTION B,' and are cluttered and disorganised, highlighting the contrast]({{site.github.url }}/rvango/assets/aisle_analogy.jpg)

For users of screen readers, the experience is similar. A screen reader interprets the content on a webpage one element
at a time, navigating through headings, links, and other elements sequentially. This is where the concept of [**information
scent**](https://www.nngroup.com/articles/information-scent/) comes in. It refers to the cues users rely on to decide whether to dive deeper into a section of content. 
Clear and descriptive headings and labels provide a strong information scent, guiding users directly to the
information they need.

### Why do headings and labels matter?

Headings and labels act like aisle signs for users of screen readers. They need to be clear and descriptive to help
users navigate the webpage efficiently. When headings and labels accurately describe the content that follows, it’s
like having clear signs in the supermarket, guiding you directly to what you need.
But if the headings and labels are unclear, it’s like having those useless signs, making navigation difficult and
time-consuming.

![An illustration shows a Y-shaped road with a person standing at the split. The person has a thinking bubble that says, "I want to find the phone number." The left path is labelled "About Us" and leads to an empty chest. The right path is labelled "Contact Information" and leads to a full, overflowing treasure chest]({{site.github.url }}/rvango/assets/information_scent_analogy.jpg)

Descriptive headings and labels provide a strong **information scent** that helps users quickly find what they are 
looking for. Best of all, this improves the experience for both screen reader users and everyone else.

## Can LLMs enhance accessibility? Our hypothesis

We are hypothesising that LLMs could significantly improve accessibility testing.
Our research explores whether LLMs can effectively automate the evaluation of headings and labels, a task traditionally
performed by humans due to its context-aware nature.

LLMs are built on [**embeddings**](https://learn.microsoft.com/en-us/semantic-kernel/memories/embeddings#what-are-embeddings-to-a-programmer) that encode rich semantic relationships and context. This means they inherently capture the
**information scent**—the cues that help users decide whether to delve deeper into content. Because of this, LLMs have the
potential to understand and evaluate headings and labels with a high degree of accuracy, potentially similar to human evaluators.

But can we achieve the same level of effectiveness with the use of LLMs?

## Setting the stage for experimentation

Now, let’s talk about our experiments. We’ve set up two key tests to see how well LLMs can handle these tasks:

- **Experiment One**: Will conduct a [**tree testing**](https://www.nngroup.com/articles/tree-testing/) comparison between LLMs and humans to assess how well LLMs can 
  navigate through website menus when looking for specific information. Can they find it as well as a human can?
- **Experiment Two**: Will investigate how LLMs use a screen reader tool to navigate through headings and labels to achieve a 
  [**task scenario**](https://www.nngroup.com/articles/task-scenarios-usability-testing/).  How do they compare to humans?

These two experiments, when combined, represent the full navigation process on a website—from moving through the main
menu to diving into individual pages. By breaking it down into these two parts, we're able to test our hypothesis in a
more manageable way. If we can’t disprove our hypothesis in these focused experiments, it gives us more confidence that
LLMs could handle end-to-end navigation on websites effectively.

Additionally, we want to ensure that the LLMs don't perform like superhumans. Instead, we aim for their behaviour to be
representative of typical human users. To verify this, we'll compare the LLM results to human performance and check if
the results fall within one standard deviation of human results. This helps us validate that the LLMs are comparable to
human behaviour and not providing results that are unrealistically perfect.

Ultimately, our goal is to determine if we can feed a user story to an LLM as a task and see if it can autonomously
achieve it using a screen reader. If it can’t complete the task, we want the LLM to report on any issues or pain points
it noticed. This approach could enhance accessibility testing by shifting it left in the development process, making it
more efficient and systematic.

## Get involved?

If you would like to participate in these experiments, please
email [accessibility.ai@scottlogic.com](mailto:accessibility.ai@scottlogic.com?subject=Participation%20in%20Accessibility%20AI%20Experiments&body=Dear%20Scott%20Logic%20Team,%0D%0A%0D%0AI%20am%20interested%20in%20participating%20in%20the%20Accessibility%20AI%20experiments.%20Please%20provide%20me%20with%20further%20details%20on%20how%20I%20can%20get%20involved.%0D%0A%0D%0AI%20understand%20that%20my%20participation%20will%20be%20anonymised,%20and%20no%20personal%20information%20will%20be%20kept%20or%20linked%20to%20me%20as%20an%20individual.%0D%0A%0D%0AThank%20you!).
We have designed the experiment to take only a few minutes of your time, and your participation would be invaluable to
our research.

## The journey ahead

What’s next? In the upcoming posts, we’ll dive deeper into these experiments. This is an open process, and we’re eager
to learn and share what we discover along the way, taking you with us on this journey of exploration. Stay tuned
for more updates!
