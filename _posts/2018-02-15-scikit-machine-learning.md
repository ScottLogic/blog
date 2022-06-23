---
title: Machine Learning with Scikit Learn
date: 2018-02-15 00:00:00 Z
categories:
- rrhodes
- Tech
tags:
- Scikit
- Learn,
- Python,
- Machine
- Learning,
- ML
author: rrhodes
layout: default_post
summary: Machine learning (ML) has become an increasingly popular field of Computer
  Science. In the past few years I've found myself working with ML to categorise large
  sets of data, and Scikit Learn for Python has proved itself to be exceptionally
  good for the task. This post walks through a simple example of Scikit Learn to categorise
  handwritten digits.
---

Machine learning (ML) was one of the first fields of Computer Science to grab my attention when I was studying. The concept is remarkably straightforward, but its applications are incredibly powerful. Google, AirBnB, and Uber are amongst many big names to apply ML to their products. When I first attempted to apply ML to my own work, there was one library which stood out from them all as a great starting point: <a href="http://scikit-learn.org/stable/">Scikit Learn</a>.

Developed for Python, Scikit Learn allows developers to easily integrate ML into their own projects. <a href="http://scikit-learn.org/stable/testimonials/testimonials.html">Spotify and Evernote are amongst an array of big names using Scikit Learn today</a>. I'm keen to walk through a simple application of Scikit Learn with the latest version of Python 3 (v3.6.4 at the time of writing). If Python's new to you, have no fear! I'll explain the purpose of the code as we go along.

## Installation
Critical to this walkthrough is the installation of Scikit Learn. Prior to doing this, make sure to <a href="https://www.python.org/downloads/">download Python 3</a>. With your terminal open, make sure that you have both NumPy and SciPy installed with `pip`:

~~~
pip install numpy
pip install scipy
~~~

The rest of the installation process is satisfyingly simple. One command performs the magic:

~~~
pip install scikit-learn
~~~

After a short time you should receive `successfully installed scikit-learn`. In order to read CSV files for this walkthrough, we'll also require <a href="https://pandas.pydata.org/">Pandas</a>. As before, one command covers our tracks:

~~~
pip install pandas
~~~

There we have it - installation complete!

## Setup
<a href="http://scikit-learn.org/stable/auto_examples/index.html#examples-based-on-real-world-datasets">Scikit Learn provides an abundance of example use cases on its own website</a>, which I found particularly useful when I first started playing with the library. For the purpose of demonstrating Scikit Learn here, I'm going to implement a classifier to categorise handwritten digits from a <a href="https://archive.ics.uci.edu/ml/datasets/Pen-Based+Recognition+of+Handwritten+Digits">UCI database consisting of ~11000 images</a>. This dataset arose from 44 writers, each asked to write 250 digits, and each image (which we'll call a sample) in this database corresponds to one handwritten digit between 0 and 9.

Each sample is represented as one <a href="https://en.wikipedia.org/wiki/Feature_vector">feature vector</a> holding values between 0 and 100. These values represent the intensity of individual pixels in the sample. Given that each sample was written inside a 500 x 500 tablet pixel resolution box, this approach would leave us with exceptionally long vectors to process. To resolve this, the images were resampled to reduce the number of pixels under consideration, resulting in feature vectors of length 16.

The set of digits 0-9 will be the set of categories for our classifier to consider in the classification process. The classifier will take samples from 30 writers (~7500) to learn about the samples for each category. The remaining samples will be reserved to test the classifier post-training. Each sample is already classified by hand - meaning we have the correct categories for each sample in the test set. This allows us to determine how successful the classifier was by comparing its own predictions to classifications we already hold.

Both the training and test datasets are provided online as CSV files by UCI. Importing these files into Python is made a simple process thanks to Pandas:

~~~python
import pandas as pd

def retrieveData():
  trainingData = pd.read_csv("training-data.csv", header=None).as_matrix()
  testData = pd.read_csv("test-data.csv", header=None).as_matrix()

  return trainingData, testData
~~~

Each file is read with `read_csv` to produce a Pandas DataFrame, which is converted into a Numpy array using `as_matrix` for later convenience. Each line of these files corresponds to one digit sample - consisting of one feature vector of length 16, followed by its corresponding category. Separating feature vectors and categories will prove useful later for Scikit Learn.

~~~python
def separateFeaturesAndCategories(trainingData, testData):
  trainingFeatures = trainingData[:, :-1]
  trainingCategories = trainingData[:, -1:]
  testFeatures = testData[:, :-1]
  testCategories = testData[:, -1:]

  return trainingFeatures, trainingCategories, testFeatures, testCategories
~~~

## Pre-processing
The majority of classifiers offered by Scikit Learn are sensitive to feature scaling. Each feature vector holds values between 0 and 100, with no consistent mean or variance. Rescaling these vectors to satisfy a mean of zero and a variance of one helps the classifier both in the process of training and classifying to recognise samples for any of the digit categories. It's an optional step in the ML pipeline, but one highly recommended if you're looking to improve classifier performance. Using `StandardScalar`, provided by Scikit Learn's Preprocessing package, this proves relatively straightforward to achieve. By first allowing the scaler to fit to the training data - learning what the unscaled features are like - the scaler can then transform features in both the training and testing sets to hold a mean of zero and a variance of one:

~~~python
from sklearn.preprocessing import StandardScaler

def scaleData(trainingFeatures, testFeatures):
    scaler = StandardScaler()
    scaler.fit(trainingFeatures)

    scaledTrainingFeatures = scaler.transform(trainingFeatures)
    scaledTestFeatures = scaler.transform(testFeatures)

    return scaledTrainingFeatures, scaledTestFeatures   
~~~

## Classification
<a href="http://scikit-learn.org/stable/supervised_learning.html#supervised-learning">Scikit Learn provides a range of classifiers</a> which would suit our needs. I've decided to implement a <a href="http://scikit-learn.org/stable/modules/sgd.html#classification">Stochastic Gradient Descent (SGD) Classifier</a> since I've found myself using this one a couple of times in the past. First we need to fit the classifier to the training data (i.e. train the classifier). Then we're ready to set the classifier free to predict categories for unseen test samples. With Scikit Learn, all of this is achieved in a few lines of code:

~~~python
from sklearn.linear_model.stochastic_gradient import SGDClassifier

def classifyTestSamples(trainingFeatures, trainingCategories, testFeatures):
    clf = SGDClassifier()

    clf.fit(trainingFeatures, trainingCategories)
    predictedCategories = clf.predict(testFeatures)

    return predictedCategories
~~~

## Results
We have our predictions! Now to compare them to the categories provided on file. Several questions arise here: How successful was the classifier? How do we measure its success? Given a particular measure, where do we set the threshold to distinguish a bad result from a good result? To answer the first two questions, I turn to Scikit Learn's classification metrics package. I've picked four metrics to implement for this example: Accuracy, precision, recall, and the F1 score.

* Accuracy: Percentage of samples categorised correctly
* Precision: Number of samples correctly assigned category x over the total number of samples assigned x
* Recall: Number of samples correctly assigned category x over the number of samples correctly assigned x plus the number of samples which are not x and not assigned x
* F1 Score: A weighted average of precision (P) and recall (R), defined in Scikit Learn as 2 * (P * R) / (P + R)

Scikit Learn's `accuracy_score` function covers accuracy for our classifier. The remaining three metrics are covered by `classification_report`, which prints a break down of precision, recall, and F1 scores for each category, as well as providing average figures.

~~~python
from sklearn.metrics import accuracy_score, classification_report

def gatherClassificationMetrics(testCategories, predictedCategories):
    accuracy = accuracy_score(testCategories, predictedCategories)
    metrics_report = classification_report(testCategories, predictedCategories)

    print("Accuracy rate: " + str(round(accuracy, 2)) + "\n")
    print(metrics_report)
~~~

There will always be a small variation in the metrics between runs of the classifier. There will be cases where the classifier categorises a test sample with a high degree of certainty, and whilst these predictions are likely to be consistent, there will also be cases where the classifier holds a lack of confidence in its work. Where this applies, the classifier is likely to make different predictions during each run. This may well be down to the training set holding an insufficient number of samples for particular digits, or the classifier is encountering handwriting which differs significantly from the training set. Taking into consideration these variations, here's one set of results from the SGD classifier:

~~~
Accuracy rate: 0.84

             precision    recall  f1-score   support

          0       0.98      0.84      0.90       363
          1       0.58      0.84      0.69       364
          2       0.97      0.81      0.88       364
          3       0.98      0.90      0.94       336
          4       0.95      0.93      0.94       364
          5       0.62      0.94      0.75       335
          6       1.00      0.96      0.98       336
          7       0.88      0.84      0.86       364
          8       0.85      0.76      0.80       336
          9       0.93      0.58      0.72       336

avg / total       0.87      0.84      0.85      3498
~~~

For a first attempt, 84% accuracy is pretty good! This leaves me with my third and final question, "where do we set the threshold to distinguish a bad result from a good result?". That's a tricky one to answer. This depends entirely on the purpose of the classifier, what each individual considers to be good or bad, and any previous attempts to apply ML to the same field. Could we alter our classifier to consistently perform better than the results observed here?

## Can we do better?
The likely answer: yes. There's plenty of options to consider. First, this walkthrough has applied elementary pre-processing. More sophisticated rescaling approaches may reduce the sensitivity of the classifier even further to improve the metrics. Second, this example implemented a basic SGD classifier without any adjustments to the default parameter values provided by Scikit Learn. We could alter the number of iterations over the training data (called epochs), prevent the classifier from shuffling training data after each epoch, or run the classifier multiple times, enabling its warm start property in order for the classifier to recall previous predictions made.

It's also worth considering that we've only implemented one of many classifiers Scikit Learn has to offer. Whilst the SGD classifier suffices for this example, we could also consider LinearSVC or Multinomial Naive Bayes, amongst others. This is where the fun lies with ML: there's so many variables to consider which may improve or worsen our results. Finding optimal solutions to any ML problem proves a difficult task.

## Conclusion
This wraps up our walkthrough of Scikit Learn! We've only covered the basics here. Scikit Learn has much more to offer, which I find is <a href="http://scikit-learn.org/stable/documentation.html">well documented on their own website</a>. For anyone wishing to view the code in full, or try it out for themselves, I've made the CSV files and Python code <a href="https://github.com/rrhodes/scikit-learn-example">available on GitHub</a> to work with. Enjoy!
