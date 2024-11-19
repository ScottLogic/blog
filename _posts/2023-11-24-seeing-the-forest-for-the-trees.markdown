---
title: Seeing the Forest for the Trees
date: 2023-11-24 09:28:00 Z
categories:
- Artificial Intelligence
summary: An introduction to the random forest machine learning model, an older, yet
  interesting approach based on decision trees.
author: jstrong
image: "/uploads/Seeing%20the%20forest%20for%20the%20trees.png"
---

I recently embarked on a journey into the world of machine learning through following the [fast.ai](https://course.fast.ai/) course taught by Jeremy Howard as part of an internal study group. I have learnt a great deal about the inner workings of neural networks and how deep learning can produce seemingly magical results. However, one of the most interesting discoveries for me was learning about a completely different type of model: the Random Forest.

## Starting from the Roots

In order to explain what a random forest is, it would be beneficial to highlight what it is made up of: Decision Trees. Decision trees are simple structures which go through a dataset and pose yes or no questions about its content. The data is split according to the answers to these questions and further questions are asked to split up the data into ever smaller subsets.

<div align="center">
    <img src="/jstrong/assets/decision_tree.svg" width="400" height="400" title="Basic Decision Tree Diagram" alt="Basic Decision Tree Diagram"/>
</div>

From asking these binary questions, the decision tree allows us to get an idea of which features split the dataset most effectively. Most often, the goal is to predict a target feature of the dataset based on the rest. An example is predicting passenger survival on the Titanic. We can ask if the passenger was male or female? if they were in first class? or which port they embarked from? The effectiveness of each split may be measured by how well each side fits to the target variable. If we split by gender, how many men and women survive and therefore how accurate would a prediction be based on gender alone? Further questions aim to increase this accuracy to give a better model.

<div align="center">
<img src="/jstrong/assets/example_tree.svg" width="400" height="400" title="Titanic Example Decision Tree Diagram" alt="Titanic Example Decision Tree Diagram"/>
</div>

There are several parameters to consider when constructing a decision tree in order to get the best results:

* **Minimum Sample Size**: The least number of data points in a tree node, beyond which no further splits can be made.

* **Maximum Depth**: The limit of the number of layers of the tree

* **Maximum Features**: The most features to consider when splitting the data - sometimes considering all the data is not favourable

* **Maximum Leaf Nodes**: How many times the tree can split off into different directions

The above parameters can be chosen through trial and error or through a method such as cross-validation. Cross-validation is where myriad combinations of the parameters are used to build decision trees and the best parameters are determined as those which optimise a particular metric such as accuracy.

Programming a decision tree on your own may be an enlightening task, but there are plenty of libraries out there should you want to get started more quickly. One such library is *scikit-learn* for Python which provides a *DecisionTreeClassifier* object to feed a dataset and make predictions from.

Whilst a decision tree is useful and can itself be an accurate model, combining trees brings about even better results.

## Branching out

One example of using decision trees together is the random forest model. It is an ensemble model, entitled so due it being constructed from a number of smaller models, in this case those smaller models being decision trees.

One may construct a random forest as follows:

1. Construct a decision tree on a random subset of the data and a random subset of the features of the data (i.e. a sample of the rows *and* columns of a tabular dataset)

2. Repeat many times

3. Calculate the average of all the predictions of the decision trees

The final average will be the prediction of the random forest. It is generally much more accurate than lone decision trees. But why is this?

<div align="center">
<img src="/jstrong/assets/tree_to_forest.svg" width="400" height="400" title="Decision Trees to Random Forest Prediction Diagram" alt="Decision Trees to Random Forest Prediction Diagram"/>
</div>

The steps above constitute the process of 'bagging.' Bagging utilises the fact that each tree uses a different, random sample of the data. Due to this, each tree's error is unrelated to the others', that is to say that they are uncorrelated. This implies (theoretically) that the average of the errors is zero! Practically, this means we can produce a more accurate model by combining many less accurate models - an amazing ability.

The main advantage random forests have over decision trees is that they are more accurate and less prone to overfitting. Another benefit is that by looking the effect of features across all the trees used together in a forest, one can determine feature importances and get a better idea of the significance of each facet of a dataset. However, not every aspect of random forests is green and verdant, they do come with disadvantages:

* Decision trees and random forests are poor at extrapolating outside the input data due to their inherent reliance on averages to make predictions

* The ensemble nature of random forests makes them harder to interpret than decision trees, where splits can be followed through and understood readily

<div align="center">
<img src="/jstrong/assets/feature_importance.svg" width="400" height="400" title="Titanic Dataset Feature Importance Bar Chart" alt="Titanic Dataset Feature Importance Bar Chart"/>
</div>

The random forest is a brilliant machine-learning model which is very effective at what it does, but it is not applicable to or suitable for every situation.

## Sprouting Anew

Random forests have been around a while - [Leo Breiman](https://en.wikipedia.org/wiki/Leo_Breiman) formalised the definition and in fact coined the term in an eponymous paper in 2001! Other machine learning models have long since overtaken random forests in popularity - and for good reason. Two more modern models are neural networks/deep learning and gradient boosters.

Neural networks benefit from vast amounts of data, which we continue to acquire ever more and more of, whereas performance gains from random forests begin to stagnate after a certain level. Neural networks are also generally more flexible and versatile than random forests. They can be used on all types of data including images and language data rather than the focus of random forests which concerns tabular data. Another point to consider is that random forests, given that they consist of trees, are rules-based models and not all problems can be generalised or thought of in terms of trees. Resultantly, a function-based model, that is a neural network, performs much better in such cases.

Gradient boosters are often used instead of random forests for machine learning applications concerning tabular data as they are generally more accurate. They are also based on decision trees but instead of using bagging, they rather work on a principle of error-correction where the errors of initial models are trained against to improve the final model. Popular examples of gradient boosting models include [CatBoost](https://catboost.ai/) and [XGBoost](https://www.nvidia.com/en-us/glossary/data-science/xgboost/).

Despite its shortcomings compared to other more widely-used models, the random forest remains popular - especially for its use in studying machine learning. It is built up from the easy-to-understand decision tree, and the reasons for its increased accuracy are intuitive to comprehend therefore lending itself to use in AI education material. Aside from its pedagogical uses, the random forest model has been used in applications from fraud detection at banks, to medical imaging, to body part movement detection in the [Kinect](https://en.wikipedia.org/wiki/Kinect).

## Planting Seeds

I hope that I have provided an adequate primer on decision trees, random forests, and how they work. There is much more to learn, and I would recommend the [book](https://course.fast.ai/Resources/book.html) which complements the fast.ai course to fill in the gaps (chapter 8 in particular for random forests). Another avenue to look into is entering [Kaggle](https://www.kaggle.com/) competitions which will allow you to practise machine learning skills with real datasets and to cement knowledge through doing rather than simply reading or watching.
