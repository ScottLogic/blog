---
title: Fast.ai Study Group
date: 2024-01-09 15:39:00 Z
categories:
- Artificial Intelligence
tags:
- AI
- Machine Learning
- Deep Learning techniques
summary: In this blog, we will be sharing our feedback on the free fast.ai course - that has been praised by many for its hands-on and top-down approach - along with a list of additional material that we found helpful in fully understanding the course.
author: vcisse
image: "/uploads/Fast.ai%20tn.png"
---

As part of an internal study group aimed at getting a good overview of
artificial intelligence (AI) and machine learning (ML), we conducted a
deep dive into the world of [fast.ai](https://course.fast.ai/).

## What is fast.ai ?

Simply defined, fast.ai is a deep learning Python library that is
primarily used for adding higher-level functionality in standard deep
learning domains. It is also the name of a non-profit research group -
founded by Jeremy Howard and Rachel Thomas - focused on deep learning
and artificial intelligence.

The [fast.ai](https://course.fast.ai/) online course (Part 1 & Part 2)
provide a good introduction to a wide spectrum of machine/deep learning
techniques and models along with the Python libraries involved in their
implementation.

In term of libraries the course covers:

-   **PyTorch**: world\'s fastest-growing deep learning library. PyTorch
    works best as a low-level foundation library, providing the basic
    operations for higher-level functionality. PyTorch is distinctive
    for its excellent support for GPUs.

-   **Fast.ai**: popular library for adding higher-level functionality
    on top of PyTorch.

-   **NumPy**: most widely used library for scientific and numeric
    programming in Python. It provides very similar functionality and a
    very similar API to that provided by PyTorch; however, it does not
    support using the GPU or calculating gradients, which are both
    critical for deep learning.

-   **Scikit-learn**: popular library for creating machine learning
    models, using approaches that are not covered by deep learning (like
    decision trees).

-   **Pandas:** popular tabular data analysis/processing and querying.

-   **Matplotlib:** plotting library for the Python programming language
    and its numerical mathematics extension NumPy.

In term of models the course immerses us in the following:

-   **Neural networks (NNs)**: mainly used for image processing and
    object detection. 

-   **Linear regression**: for describing data and explaining the
                         relationship between them.

-   **Random forest** (combination of decision trees): for
    classification and regression tasks.

-   **Convolutional neural networks (CNNs)**: current state-of-the-art
    approach to creating computer vision models.

-   **Stable diffusion**: generative AI model that produces unique
    photorealistic images from text and image prompts.

In addition to explaining the models and their potential use cases, the
course also provides us with the inner workings of different models and
thus widens our technical horizon with new AI-related concepts. Some of
these concepts are not easy to grasp at first glance.

## Our experience

It is preferable to practice after watching a course. For our practice
we entered a Kaggle competition ([Spaceship
Titanic](https://www.kaggle.com/c/spaceship-titanic)); some of us
practiced the Stable Diffusion model with the DiffEdit implementation
([DiffEdit: Editing Images using Generative
AI](https://blog.scottlogic.com/2023/12/13/diffedit.html)).

Some parts of the course (in Part 2) are very in dept and challenging.
These parts would require more than one attempt to fully comprehend them.

Looking at core concepts from multiple perspectives is generally a crucial
point in the learning process. Therefore, we are sharing the list of
additional material that we found helpful in fully understanding the fast.ai
course.

## Linear Regression & Random Forest

#### Introduction to Machine Learning with Python - beginner level

This course first introduces the different steps involved in a ML
project and the popular Python libraries used in ML. It then uses
decision trees (via the Scikit-learn library) to resolve a basic ML
problem: predict the style of music a person -- within a specific age
group -- might like.

[Python Machine Learning Tutorial (Data
Science)](https://www.youtube.com/watch?v=7eh4d6sabA0)

Contrary to what the course suggests, you do not need to install the
Anaconda Distribution to work with Jupyter Notebook. You can just
register with [Kaggle](https://www.kaggle.com/) and create then run your
Jupyter Notebooks there.

#### Build your first machine learning model in Python

The exercise in this course resemble that of the course above but it
goes a little bit deeper into the different ML models (Linear
Regression, Random Forest) on a quantitative data.

[Build your first machine learning model in
Python](https://www.youtube.com/watch?v=29ZQ3TDGgRQ)

#### Build models from scratch in Python

The courses above make use of the implementations of decision trees,
linear regression and random forest already provided in the
aforementioned Python libraries.

The below courses adopt an interesting approach that consists in
building their custom implementations. First the theory of the concepts
is spelled out, then that theory is translated into actual Python code
and lastly the code is tested against an actual dataset.

[How to implement Decision Trees from scratch with
Python](https://www.youtube.com/watch?v=NxEHSAfFlK8)

[How to implement Random Forest from scratch with
Python](https://www.youtube.com/watch?v=kFwe2ZZU7yw)

[How to implement Linear Regression from scratch with
Python](https://www.youtube.com/watch?v=ltXSoduiVwY)

## Maths

Some of the lessons explained in the fast.ai course involve lots of maths.
Those not proficient in maths would probably be terrified by some of
them. Thankfully there are a lot of online channels that can help. If
you want to revisit maths and other related concepts (like derivatives,
integrals, etc.) we found the 3Blue1Brown channel very helpful.

For example, you can revisit the essence of calculus here:

[3Blue1Brown - Calculus - Visual introductions to the core ideas of
derivatives, integrals and
more.](https://www.3blue1brown.com/topics/calculus)

You do not necessarily have to watch all of these maths lessons.

## Neural Networks and related concepts

#### 3Blue1Brown

Apart from maths, the 3Blue1Brown channel offers great visual
presentations and explanations of key neural networks concepts. I
highly recommend their presentations, the quality is just incredible!

[But what is a neural network? \| Chapter 1, Deep
learning](https://www.youtube.com/watch?v=aircAruvnKk)

[Gradient descent, how neural networks learn \| Chapter 2, Deep
learning](https://www.youtube.com/watch?v=IHZwWFHWa-w)

[What is backpropagation really doing? \| Chapter 3, Deep
learning](https://www.youtube.com/watch?v=Ilg3gGewQ5U)

[Backpropagation calculus \| Chapter 4, Deep
learning](https://www.youtube.com/watch?v=tIeHLnjs5U8)

[But what is a
convolution?](https://www.youtube.com/watch?v=KuXjwB4LzSA)

[Convolutions \| Why X+Y in probability is a beautiful
mess](https://www.youtube.com/watch?v=IaSGqQa5O-M)

#### How to Create a Neural Network (and Train it to Identify Doodles)

This course explores how neural networks learn by programming one from
scratch in C\#, and then attempting to teach it to recognize various
doodles and images. From a developer standpoint I believe that the
approach used here has lots of merits.

[How to Create a Neural Network (and Train it to Identify
Doodles)](https://www.youtube.com/watch?v=hfMk-kjRv4c)

## Stable Diffusion

#### How Stable Diffusion works

In addition to the fast.ai course we found that it was worth
giving the below course a try. It expresses in different words -- and
examples - the process of image generation with the same core concepts
(convolutional layer, U-Nets, autoencoders, etc).

[How Stable Diffusion Works (AI Image
Generation)](https://www.youtube.com/watch?v=sFztPP9qPRc)

#### DiffEdit technique

Some of us worked on the Stable Diffusion model via the DiffEdit
implementation. The following are some of the papers we found very
valuable.

[DiffEdit Paper](https://arxiv.org/pdf/2210.11427.pdf)

[Stable Diffusion with
Diffusers](https://huggingface.co/blog/stable_diffusion#how-does-stable-diffusion-work)

[How does Stable Diffusion
work?](https://stable-diffusion-art.com/how-stable-diffusion-work/)

[How does negative prompt
work?](https://stable-diffusion-art.com/how-negative-prompt-work/)

As mentioned earlier, we also created our own implementation of the
DiffEdit technique and explained the process in a blog, which you can
find here:

[DiffEdit: Editing Images using Generative
AI](https://blog.scottlogic.com/2023/12/13/diffedit.html)

## Coding challenges

Lastly, I think you can try the following coding challenges once you
have a full knowledge of the Python libraries and deep learning models.
The contents are presented in a very entertaining and educational way.

[Building a Neural Network with PyTorch in 15 Minutes \| Coding
Challenge](https://www.youtube.com/watch?v=mozBidd58VQ)

[Building the Gradient Descent Algorithm in 15 Minutes \| Coding
Challenge](https://www.youtube.com/watch?v=Souzjv6WfrY)

[Building a ML Text to Image App with Stable Diffusion in 15 Minutes \|
Coding Challenge](https://www.youtube.com/watch?v=7xc0Fs3fpCg)

## Conclusion

The fast.ai course is a great introduction to the world of AI and ML. It
is a dense course, covering lots of concepts and models, which requires
some re-watching and additional material to fully grasp - some of which
we presented here.

When we started the study group, my knowledge of AI and ML was very limited.
Of course, as a developer, I had heard about - and used - chatbots (ChatGPT,
Bard); I had used GitHub Copilot and found it amazing at "guessing" the next
line of code. But I had no idea how those apps worked. Now, after the
insights I got from the fast.ai course and other online material, I know that
they are based on a concept called _neural networks_. This was one of many
eye-openers for me. I am hoping that you get the same insights as I did.

Needless to say that we thoroughly enjoyed the course and we hope that you
will too! As previously mentioned, we recommend that you practice after
watching the course. [Kaggle](https://www.kaggle.com/) and
[Colab](https://colab.research.google.com/) are great platforms to write
AI code. The [Hugging Face](https://huggingface.co/) platform provides
the means to collaborate with the AI community - if you want to.

Thanks for reading!
