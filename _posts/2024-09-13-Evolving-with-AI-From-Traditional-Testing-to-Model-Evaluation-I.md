---
title: Evolving with AI from Traditional Testing to Model Evaluation I
date: 2024-09-13 10:00:00 Z
categories:
- Artificial Intelligence
tags:
- Machine Learning
- Testing
- Model Evaluation
- Artificial Intelligence
summary: Having worked on developing Machine Learning skill definitions and L&D pathway
  recently, in this blog post I have tried to explore the evolving role of test engineers
  in the era of machine learning, highlighting the key challenges ML brings, strategies
  for effective model evaluation and finally tried to outline a roadmap for developing
  the necessary skills to excel in ML model testing.
author: snandal
image: "/uploads/Evolving%20with%20AI%20From%20Traditional%20Testing%20to%20Model%20Evaluation%20I.png"
---

Machine learning (ML) is no longer just a concept for the future, it is now a vital part of many everyday applications. From personalised recommendations on streaming services and self-driving cars to detecting fraud in banking and advancements in healthcare, ML is changing the way industries work.

For a test engineer, the increasing use of ML brings new challenges and opportunities. As ML technology advances, the role of a test engineer also changes. Unlike traditional software, which gives consistent and predictable results, ML models work with probabilities and patterns, making testing and evaluation more complex.

In this blog, we will look at how ML has developed, how it might affect our job as test engineers and the important strategies, considerations and skills needed to effectively evaluate and test ML models. 
We will also draw a roadmap to help us grow professionally in this area.

## How Machine Learning Has Evolved

Machine learning has significantly advanced since its early days. Initially, ML models were fairly simple, handling tasks like basic predictions or classifications. However, with improvements in computing power, access to large amounts of data and more complex algorithms, ML has grown into a powerful tool capable of handling sophisticated tasks like natural language processing and image recognition.

This progress has made ML widespread across industries, leading businesses to increasingly rely on data-driven decisions. As companies embrace ML, the need for thorough and reliable testing of these models has become more important, which directly affects the role of test engineers.

Before we get into the testing process, it is important to understand what makes ML models different and **what impact they can have on our job as a test engineer.** 

At their core, ML models learn from data. They are trained on large datasets to recognise patterns and make predictions or decisions based on new information. Unlike traditional software, where rules are clearly programmed, ML models develop their logic through training, making their behaviour less predictable and sometimes harder to understand.

Traditionally, a test engineer's job involved testing systems where a given input always produced the same output, making results predictable. However, with ML, this approach changes. ML models are probabilistic, meaning their outputs can vary depending on the training data and some built-in randomness. This shift has significantly changed how software testing is done.

We now need to do more than just check whether a system works as expected. We must also evaluate how well a model performs, whether it's reliable and fair. This requires combining traditional testing skills with additional knowledge specific to ML.

## Looking at the unique challenges that testing ML models brings

**Unpredictable Outputs:** Unlike regular software, where the same input always gives the same result, ML models can give different results because they work with probabilities. This makes testing harder because instead of just checking if the output is correct, we need to evaluate how accurate and reliable the model’s predictions are.

**Dependence on Data:** The quality of an ML model depends a lot on the data it was trained on. Testing ML models means we need to deeply understand the training data and its weaknesses because any bias or missing information in the data can lead to incorrect results.

**Performance Metrics:** Traditional testing metrics like pass/fail don’t apply directly to ML models. Instead, we use statistical metrics like accuracy, precision, recall, F1 score and AUC-ROC to evaluate model performance. Understanding and choosing the right metrics is key to effective testing.

**Model Degradation Over Time:** As new data becomes available, an ML model’s performance can degrade causing a problem known as model drift. This means continuous monitoring and retraining are equally important, adding complexity to the testing process.

## Model Evaluation Vs. Model Testing

Before we dive deep into discussing possible strategies for ML model testing, it is important to understand the difference between Model evaluation and Model testing.

Model evaluation and model testing might sound similar, but there is a key difference between the two. Evaluation focuses on assessing the model’s performance in a controlled environment, while model testing checks how well the model works in real-world conditions.

Let's look at it with a simple example of a spam detection model that filters out unwanted emails. 

During the **model evaluation** phase (validation mode), we will use a labelled dataset of emails to calculate metrics like accuracy, precision and recall. For example, the model might successfully identify 95% of spam emails in this dataset.

After evaluation, during **model testing** phase (prediction mode) the model will be subjected to real incoming emails to see how well it handles a variety of messages, if it can correctly filter out spam in different languages, formats, or tricky emails that look legitimate. Model testing makes sure the model works well in the real environment where it will be used, way beyond the controlled conditions of evaluation.

## Strategies for Testing ML Models

To effectively address the challenges that ML brings, test engineers can benefit from the following strategies:

**1.	Define Clear Objectives:** Start by defining what success looks like for your ML model. Are you aiming for high accuracy? or is it more important to avoid mistakes like false positives? Understanding the business objectives and how they translate into model performance metrics is essential.

**2.	Validate the Data:** Ensure that the training, validation and testing datasets are represent real-world situations the model will face. Check for issues like missing values, duplicates and biases. Proper data validation is very important to prevent garbage-in, garbage-out scenarios.

**3.	Apply Cross-Validation:** Implement cross-validation techniques to check that the model’s performance is consistent across different subsets of the data. This helps in identifying overfitting, where the model performs well on training data but poorly on new unseen data.

**4.	Analyse Performance Metrics:** Use a combination of metrics to get a comprehensive view of the model’s performance. For classification models, confusion matrices can be useful in providing insights into where the model is making errors. For regression models, metrics like Mean Squared Error (MSE) or R-squared can offer valuable information.

**5.	Perform A/B Testing:** Compare the ML model’s performance with existing solutions (if available) using A/B testing. This helps in understanding whether the new model provides a significant improvement over the current system.

**6.	Perform Stress Testing:** Subject the model to edge cases and scenarios with outliers to see how it handles unexpected inputs. This can uncover vulnerabilities and help in making the model more robust.

**7.	Continuous Monitoring and Feedback Loop:** After deployment, continuously monitor the model’s performance. Set up a feedback loop where new data is used to retrain and improve the model. Tools like MLflow can help in managing this process efficiently.

### Let’s look at the practical application of the above strategies with a case study of an ML model predicting patient re-admission after discharge

Consider a hospital implementing an ML model to predict the likelihood of patients being readmitted within 30 days of discharge. 

**Defining Objectives:** The goal here is to identify the most high-risk patients so that the hospital can take proactive measures to reduce readmission rates and improve patient care.

**Data Validation:** Further start by validating the dataset, ensuring that it includes a balanced representation of various patient, medical history, treatment plans etc. Use cross-validation to train the model and select the most effective algorithm for predicting readmissions.

**Metric Selection:** Choose sensitivity/recall and specificity as key metrics. High sensitivity ensures that most high-risk patients are identified, while specificity ensures that the model doesn't over-predict readmissions, leading to unnecessary interventions.

**Stress Testing:** Test the model with scenarios where patient data is incomplete, such as missing medical history or inconsistent treatment records. Assess how the model performs when handling these edge cases, which are common in real-world medical data.

**A/B Testing:** Implement the ML model alongside the existing manual risk assessment process. Compare the model's predictions with the manual predictions in real-time, focusing on how well the model improves patient outcomes.

**Post-Deployment Monitoring:** After deployment, continuously monitor the model’s performance, looking for signs of model drift as new patient data becomes available. Implement a feedback loop where the model is retrained regularly with the latest data to maintain accuracy and relevance.

## Skills Needed for ML Model Testing

To effectively perform model evaluation, a test engineer would need a combination of technical, analytical and domain-specific skills:

**1. Understanding of Machine Learning Concepts**

* Understanding fundamental ML concepts such as model learning algorithms – supervised learning, unsupervised learning and reinforcement learning, model performance issues like overfitting and underfitting and the types of models (e.g., regression, classification, clustering).
* Familiarity and understanding of model evaluation metrics such as accuracy, precision, recall, F1 score, AUC-ROC, mean squared error, R-squared, etc. and knowing when and how to apply them.

**2. Statistical Knowledge**

* Understanding statistical measures - mean, median, variance, standard deviation and concepts like hypothesis testing, p-values, confidence intervals and correlation.
* Knowledge of probability distributions and how they apply to model outputs and uncertainties.

**3. Programming Skills**

* Proficiency in one of the scripting languages - Python or R, which are commonly used for ML model evaluation. Familiarity with libraries like Scikit-learn, TensorFlow or PyTorch is advantageous.
* Ability to write scripts to automate the evaluation of models, including running tests across different datasets and tracking performance over time.

**4. Data Analysis and Validation**

* Skills in data cleaning, handling missing data, outliers, data normalisation and feature engineering.
* Ability to validate datasets for biases, errors and representativeness, ensuring that the training data is of high quality and relevant to the model objectives.
* Proficiency in using tools like Python’s Pandas, Matplotlib and Seaborn for EDA to understand the dataset before feeding it into an ML model.

**5. Familiarity with common ML Tools and Platforms**

* Experience with tools like Scikit-learn for traditional ML, or TensorFlow/PyTorch for deep learning models.
* Familiarity with tools like MLflow, which assist in tracking experiments, managing models and automating the retraining process.
* Knowledge of using version control systems like Git for managing code and model versions.

By combining these skills along with domain knowledge of the business context in which the model will be deployed, it can be effectively evaluate and tested, ensuring that it meets both technical and business requirements while remaining reliable, accurate and fair.

## Roadmap for Developing ML Model Testing Skills

Here’s a step-by-step roadmap for a test engineer to develop ML model testing skills:

**1.	Start with Basic ML Theory:** Learn the fundamental concepts of ML, focusing on the types of learning, model evaluation metrics and common challenges.

**2.	Build Statistical Knowledge:** Study key statistical principles and how they relate to ML. This is essential for understanding model performance.

**3.	Learn Data Analysis:** Practice data preprocessing, cleaning and validation using tools like Python’s Pandas or R. Data quality is critical for effective ML models.

**4.	Develop Programming Skills:** Get comfortable with Python or R. Start by running simple ML models using libraries like Scikit-learn and gradually move to more complex tasks.

**5.	Explore ML Tools:** Familiarise yourself with popular ML frameworks like TensorFlow, Keras, or PyTorch and model management tools like MLflow.

**6.	Practice Model Evaluation:** Apply your skills by testing real ML models. Use cross-validation, stress testing and performance metrics analysis to assess models.

**7.	Continuous Learning:** Stay updated with the latest trends in ML and software testing. Engage in online courses, webinars and forums to keep your knowledge fresh.

By following this roadmap, test engineers can successfully transition into ML model testing, ensuring they stay relevant in an evolving field.

## In Conclusion

Evaluating and testing ML models requires a mix of traditional testing skills and an understanding of statistical methods. With the right testing strategies and by following a structured approach to testing, incorporating data validation, metric analysis, stress testing and continuous monitoring, we can ensure that our ML model provides real value and meets business objectives.

Additionally, staying informed about the latest trends and tools can help handle the challenges of ML testing effectively and make a significant impact on your organisation’s success.
Machine learning is complex but also an exciting opportunity to explore new dimensions of software quality. Let’s embrace these challenges as a chance to grow and expand our skills in the field of software testing.

*Hoping to publish my next blog soon, where I will dive deeper into evaluation metrics and how to choose the right ones for assessing machine learning models effectively.*
