---
title: How to Make Your Own Search Engine
date: 2023-08-11 09:40:00 Z
categories:
- Tech
- Data Engineering
- Artificial Intelligence
tags:
- search engine
- search
- google
- semantic search
- lexical search
- LLM
- Grad Project
- AI
- Artificial Intelligence
- Google
- Machine Learning
- Beginner
- Algorithms
- Technology
- ''
- Tech
- cosine similarity
- FAISS
- vector
- embedding
- encoding
- TF-IDF
- tokenization
summary: Understand how Google and other search engines use LLMs to gain insights
  into the semantic meaning of the language in search queries using embedding and
  cosine similarity.
author: wboothclibborn
---

Google’s largest revenue source are its adverts which comprise [80% of its revenue](https://www.oberlo.com/statistics/how-does-google-make-money#:~:text=Google%20revenue%20breakdown%20(Q1%202023)&text=In%20Q1%202023%2C%20Google's%20revenue,at%20%246.7%20billion%20(9.6%25).). This relies on Google domination of the search engine market with Google Search enjoying a [92% market share](https://gs.statcounter.com/search-engine-market-share). This is because Google search prioritises web pages that uses Google Ads, and the [self proclaimed second largest search engine](https://www.tubics.com/blog/youtube-2nd-biggest-search-engine) on the internet is Youtube which exclusively uses Google Ads. Therefore, Google has had a huge incentive for over two decades to become world experts in making the best search engines, but thanks to the billions sunk into LLMs and cloud you too can now create your own search engine to be (nearly) as good as Google.

In this article we will be discussing two methods that search engines use for ranking, Lexical Search (bag of words), and Semantic Search. If you’ve never heard of these, never used an LLM, or have limited programming knowledge, this article is for you.

# What are search Engines?

Search engines that search through websites on the internet are an example of a more general concept called a document search engine. In this context, a document is some structured data, containing a large piece of text (e.g. Websites, books, song lyrics, etc) and metadata (e.g. author, date written, date uploaded) attached to it. Document search engines are software systems that rank these documents based of their relevance to a search query. Document search engines have access to a dataset of these documents that need to be ranked, and performs a search whenever it receives a search query. In Google Search our documents are web pages, and the search query is the text we type into Google. The software system in a document search engine ranks documents by how close documents are to a search query, the two methods discussed in this blog post are designed to do this. One solution could be matching words in the search query to words in the document. This is called Lexical Search and is our first search method.

# Lexical Search

This is a low tech solution for a document search (essentially a ctrl \+ f across all your documents). It’s a word search that matches individual words in the search query with individual words in the document.

## How do we implement the search?

Our main object in this is to match words in the search query with words in the document. This means we need to make increase the chances as much as possible that words match. To do this we can remove the punctuation and make the text lowercase. We also want to make sure we only match words that are relevant, hence we can remove common words (called stop words) like *“the”*, *“said”*, etc. 

To recap we do this both to the documents when they’re created and to the search query when we receive it.

1. Remove punctuation and make text lowercase.  
E.g. *“The quick brown fox’s Jet Ski”* becomes *“the quick brown fox s jet ski”*

2. Split sentence into words by turning the string into a list by splitting on spaces.  
E.g. *“the quick brown fox s jet ski”* becomes *\[“the” , “quick”, “brown”, “fox”, “s”, “jet”, “ski”\]*

3. Remove the most common words (stop words)  
E.g. *\[“the” , “quick”, “brown”, “fox”, “s”, “jet”, “ski”\]*  becomes *\[“quick”, “brown”, “fox” , “jet”, “ski”\]*

We've formatted a list of words of the search query and document now, we need to rank which of our document’s words match the search query. If every document contains the words *\[“Scott”, “Logic”\]* somewhere, then it doesn’t help our user if our search engine matches them because every document contains those words. If we take each word from the search query and count the number of matching words in each document we can’t ensure the words we’ve marched are unique in the documents

 We need a way of prioritising rare words in our collection of documents. One common formula for this is called TF-IDF.

## TF-IDF

This is a method of measuring how important a search word is in a collection of documents. It includes two measures; Term Frequency (TF) and Inverse Document Frequency (IDF). The higher the value of TF-IDF the better match a document is to a search word.

The Term Frequency is the number of times a word appears in a single document divided by the total number of words. This is just: what percentage of the words in our document is our search word.

For example, If a document contained the text, *“I’m a Barbie Girl, In a Barbie World”* we would remove punctuation, and stop words giving us *\[“barbie”, “girl”, “barbie”, “world”\].* If we were then to take the Term Frequency it would be 0.25 for both *“girl”* and “*world”*, but 0.5 for *“barbie”* as it appears twice out of the four words.

![CodeCogsEqn (3).png](/uploads/CodeCogsEqn%20(3).png)

The Inverse Document Frequency measures the rarity of a word, the score is lower if a word appears in more documents. This achieves our goal of prioritising search words that appear in fewer documents. It is calculated by dividing; the number of all documents, by the number of documents the search word appears in, and then taking the log of that to scale it. We also add 1 in various places to give IDF a range from 0 to log(No. Documents)\+1.

![CodeCogsEqn (1).png](/uploads/CodeCogsEqn%20(1).png)

For example, if you had three documents containing *\[“barbie”\]*, *\[“world”\]*, and *\[“barbie”\]*, then the search word *“barbie”* would give the following IDF scores. The document *\[“barbie”\]* would have an IDF of:

![CodeCogsEqn (6).png](/uploads/CodeCogsEqn%20(6).png)

and the document *\[“world”\]* would have an IDF of 

![CodeCogsEqn (8).png](/uploads/CodeCogsEqn%20(8).png)

To use the benefits of both measures we need to mathematically combine them into TF-IDF, this can be done by just multiplying the two measures together. Each document is given a TF-IDF score for each search word in a search query. As a result TF-IDF for a given word and document has a maximum of 1 which is a perfect match where a document only contains the search word and is only mentioned once in the dataset of documents, and a minimum of 0 where a word never appears in a given document, or a word appears in every document.

Once we have a list of TF-IDF values of every document for every search word, then we can combine the documents scores of all search words. This is called Pooling and is how we summerise how good of a match a document is. A common method is just taking the average of all TF-IDF values which gives us the total score for a document compared to a search query.

At this point all we need to do is sort the documents in order of highest TF-IDF score to lowest, and we’ve successfully made a basic search engine!

## Limitations of this method

This methodology is a great first step to understand how a simple document search engine could work, though it does have limitations. One thing is that spelling mistakes aren’t accounted for and our model does not understand the different ways the user may use language. For example, if someone’s search query was “barbie doll” (split into separatee topics of “barbie” and “doll”), our search engine would show them several topics with the same name; barbie the move, barbie the Australian BBQs, and rag dolls in video games. The problem here is our search engine doesn’t know anything about context, how language is used, and multiple meanings of words. We need a method that understands language. For this, we need an LLM in Semantic Search.

# Semantic Search

Semantic search doesn’t exactly match words but instead finds similar meaning between the text. This requires us to have a more sophisticated understanding of text, rather than just being a list of words, instead we need a method that has understanding of language and the context of how it is used. One popular computational method that can understand language is Large Language Models (LLMs). We use LLMs in a technique called sentence embedding, that creates a vector that represents the strength of certain language categories. Some of these concepts may be new to you, so let’s explain the last few sentences.

## LLMs and Embeddings

Large Language Models (LLMs) are machine learning models that have been trained on huge quantities of text data to do a number of specialised tasks. One of these tasks could be anticipating what the next word in a sentence is, which you may have seen as autocomplete, another task could be a conversational chatbot like ChatGPT. LLMs don’t think like humans, so need to convert the text they read into some computer friendly format. This computer friendly format is called embedding which is a way for a computer to represent what text means using a vector.

Vectors are lists of values, where the length of the list is the dimension of the vector, so a 4D vector has 4 values.

Embeddings can contain different amounts of context; from sentence embedding which represents the meaning of a whole sentence, to word embeddings that represent the meaning of individual words independent of their context. In semantic search we want to take into account as much context as we can, therefore we will be using sentence embedding for this application. We can then combine several sentence embeddings . The sentence embedding vector contains many values, and each of these values represent the strength of a category that somehow represent the meaning of our sentence. This means the number of values in the vector are the number of categories it contains. The values represent the strength of that category in a range from 0 to 1, where 1 means our sentence is a perfect match for a certain category and 0 means the sentence doesn’t fit the category at all. These categories are decided by the LLM while it is being trained and aren’t obvious human categories, hence they can be tricky to interpret exactly, but an analogy would be categories like *positivity* or *isBangladeshiFood*.

If our document or query contains many sentences we will get several sentence embeddings for each when we run our LLM’s encoding. We want the document and query to both be represented by just one embedding vector each; a document embedding vector and query embedding vector. To achieve this we need to summarise our many sentence embeddings, we can do this by average of each category of all sentence embeddings, to create a summary embedding. This is can work because the embedding vector is consistent when using the same LLM, same categories and same size of vector.

## How do we use embeddings to rank documents?

Now we understand what embeddings are, we next need to understand how to compare our document embedding and query embedding vectors. One advantage of embeddings being vectors is that they can be interpreted as being lines in space. Text with similar embedding values should contain similar topics and represent similar things, and therefore they should be in a similar place in our embedding vector space. We can use this for our search, where the closer our query embedding vector is to a document embedding vector in space, the better the match. The best match between a document and a query will have the same values in each category in the document embedding and query embedding respectively. One method to find the similarity between two embedding vectors is by finding how small the angle is between the two vectors, using a formula called cosine similarity.

![download (2).png](/uploads/download%20(2).png)

The image above is a diagram of a 3D embedding vector. Q is our query embedding vector (search term), and D1, D2, D3 are document embedding vectors. The smaller the angle between a document and our query, the better the match. [Source](https://medium.com/analytics-vidhya/build-your-semantic-document-search-engine-with-tf-idf-and-google-use-c836bf5f27fb)

Cosine similarity doesn’t give us the angle in degrees, but rather calculates the value of the cosine of the angle between the two vectors. The cosine similarity gives us a range from 0 to 1, where 1 is the best fit and has an angle of 0o between our document and search query. Embedding involves a tradeoff, to do more pre-processing and use more storage to speedup search at runtime.

For the mathematically familiar the formula is below, and you may recognise it as the vector dot product. Where, θ is the angle between the vectors, **D** is the document embedding vector, **Q** is the search query embedding vector. In words, the cosine of the angle between two vectors is equal to the dot product of the two vectors, divided by the product of both vectors magnitude (their Euclidian length).

![CodeCogsEqn (4).png](/uploads/CodeCogsEqn%20(4).png)

In this article we’re not taking into account the distance between the two vectors to try and keep complexity low. It is worth noting the best way of finding similarity between embedding vectors is the [FAISS measure](https://engineering.fb.com/2017/03/29/data-infrastructure/faiss-a-library-for-efficient-similarity-search/) from Facebook.

## The stages of semantic search in summary

We need to do preprocessing on our documents to create their document embeddings ready for search. You can do this preprocessing each time a new document is created, or if your list of documents are static you can calculate the document embeddings all at once. If our documents are stored as a table, then the embedding vector can be stored as just another column.

1. **Embedding**  
We first embed the document's sentences. We do this by passing the text of our document into an LLM that creates the sentence embedding that represent the meaning of the text.
2. **Pooling**  
Documents contain several sentences, therefore the many sentence embeddings need to be summarised to describe the document as one vector. We can do this by taking the average of all sentence embeddings.
3. **Storage**  
Save this single document embedding vector as a field in some database ready for when we want to search

Now we’ve got the document embeddings ready for us to search through, we need to actually perform our search when a user submits a query.

1. **Embedding**  
We embed the search query by creating a sentence embedding that represents the query.
2. **Scoring**  
Each of the documents will have its text already mapped to a single document vector. We can then rank how close our query embedding vector is to the document embedding vector using Cosine Similarity.
3. **Ranking**  
We then take the cosine scores of our documents, and rank them from highest to lowest. This gives us our ranked list of documents in order of relevance to the search query, and completes our search engine.

## Semantic Search Example

Say we have a list of two documents: *\[“Come on Barbie let’s go party”\]* and *\[“Barbie on the beach”\]*. These two sentences both include the word *“Barbie”*, but use it in two different ways. In our example we use a sentence embedding with just 3 categories, this gives us a 3D embedding vector. It is worth noting as we only have one sentence in each document we don’t need to do any pooling, there was multiple sentences then our next step would be pooling these sentence embeddings into a document embedding. Our three categories are *isAboutBarbieDoll*, *isAboutBBQ* and *isAGoodTime*. In the image below we can see a value for each category in the embedding that our LLM has decided.

![download (3).png](/uploads/download%20(3).png)

Now we wanted to search through these documents with the two queries *“Barbie dolls”* and *“BBQ location”*. We start by calculating the embeddings for these search queries. We then compare the embedding of the search query against the embeddings for each of the documents. This is the Score and is calculated using cosine similarity score (0 to 1 where 1 is best match). Finally our semantic search engine now ranked these documents based off the search query used to find them.

![download (4).png](/uploads/download%20(4).png)

## Trade-offs

Semantic search now can understand what documents and search queries means. This can account for spelling mistakes and users not being able to remember a given word. An added bonus is this improves the accessibility of your search engine, especially for dyslexics who have issues with word recall and spelling.

The disadvantages is that the extra computation steps will cost more time and money. You need to architect this pipeline carefully to make sure it is quick and users don’t need to wait for their query to be executed. It is also far more complicated to implement manually, but AWS supports [AWS OpenSearch](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html) if you wanted to build your own solution, and [Amazon Kendra](https://aws.amazon.com/kendra/) which is a fully implemented semantic search engine.

# Conclusion

Now you have an overview of two implementations of search engines, and now you too can dominate the planet with your implementation! We are looking at creating a semantic search engine on an internal project, and therefore we will post a follow up blogpost explaining how we did this on AWS in the future. Thank you for reading, if any point you get lost in the article please do comment on here and I will aim to edit it to be more clear. Special thanks to Joe Carstairs for proof reading this document.