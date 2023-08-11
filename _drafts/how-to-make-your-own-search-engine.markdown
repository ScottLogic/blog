---
title: How to make your own Search Engine
date: 2023-08-11 09:40:00 Z
categories:
- explination
- overview
tags:
- search engine
- search
- google
- semantic search
- lexical search
summary: Understand how search engines work with two implementations; lexical search
  to find exact word matches and semantic search which uses LLMs to gain insights
  into the meaning of the language of your search.
author: William Booth-Clibborn
---

# Introduction

Google’s largest revenue source are its adverts which comprise 80% of its revenue. This relies on Google domination of the search engine market with Google Search enjoying a 92% market share. This is because Google search prioritises web pages that uses Google Ads, and the second largest search engine on the internet is Youtube which exclusively uses Google Ads. Therefore, Google has had a huge incentive for over two decades to become world experts in making the best search engines, but thanks to the billions sunk into LLMs and cloud you too can now create your own search engine to be (nearly) as good as Google.

In this article we will be discussing two methods that search engines use for ranking, Lexical Search (bag of words), and Semantic Search. If you’ve never heard of these, never used an LLM, and have limited programming knowledge, this article is for you.

# What are search Engines?


Search engines that search through websites on the internet are an example of a more general concept called a document search engine. In this context, a document is some structured data, containing a large piece of text (e.g. Websites, books, song lyrics, etc) and metadata (e.g. author, date written, date uploaded) attached to it. Document search engines are software systems that rank these documents based of their relevance to a search query. Document search engines have access to a dataset of these documents that need to be ranked, and performs a search whenever it receives a search query. In Google Search our documents are web pages, and the search query is the text we type into Google. The software system in a document search engine ranks documents by how close documents are to a search query, the two methods discussed in this document are designed to do this. One solution could be matching words in the search query to words in the document. This is called Lexical Search and is our first search method.
Lexical Search
This is a low tech solution for a document search (essentially a ctrl \+ f across all your documents). It’s a word search that matches individual words in the search query with individual words in the document.
How do we implement the search?
Our main object in this is to match words in the search query with words in the document. This means we need to make increase the chances as much as possible that words match. To do this we can remove the punctuation and make the text lowercase. We also want to make sure we only match words that are relevant, hence we can remove common words (called stop words) like “the”, “said”, etc. We process
To recap we do this both to the documents when they’re created and to the search query when we receive it.
Remove punctuation and make text lowercase.
E.g. “The quick brown fox’s Jet Ski” becomes “the quick brown fox s jet ski”
Split sentence into words by turning the string into a list by splitting on spaces.
E.g. “the quick brown fox s jet ski” becomes \[“the” , “quick”, “brown”, “fox”, “s”, “jet”, “ski”\]
Remove the most common words (stop words)
E.g. \[“the” , “quick”, “brown”, “fox”, “s”, “jet”, “ski”\] becomes \[“quick”, “brown”, “fox” , “jet”, “ski”\]
Now we’ve got the list of words in the search query and document we need to rank which of our document’s word match the search query. If we take each word from the search query and count the number of matching words in each document we can’t ensure the words we’ve marched are unique in the documents. If each document contains the words \[“Scott”, “Logic”\] then it doesn’t help our search to match on that because every document contains those words. We need a way of prioritising rare words in our collection of documents. One common formula for this is called TF-IDF.
TF-IDF
This is a method of measuring how important a search word is in a collection of documents. It includes two measures; Term Frequency (TF) and Inverse Document Frequency (IDF). The higher the value of TF-IDF the better match a document is to a search word.
The Term Frequency is the number of times a word appears in a single document divided by the total number of words. This is just: what percentage of the words in our document is our search word.
For example, If a document contained the text, “I’m a Barbie Girl, In a Barbie World” we would remove punctuation, and stop words giving us \[“barbie”, “girl”, “barbie”, “world”\]. If we were then to take the Term Frequency it would be 0.25 for both “girl” and “world”, but 0.5 for “barbie” as it appears twice out of the four words.
tf=(No.  mentions of search word)/(No.words in document)

The Inverse Document Frequency measures the rarity of a word, the score is lower if a word appears in more documents. This achieves our goal of prioritising search words that appear in fewer documents. It is calculated by dividing; the number of all documents, by the number of documents the search word appears in, and then taking the log of that to scale it. We also add 1 in various places to give idf a range from 0 to log(No. Documents)\+1.
For example, if you had three documents containing \[“barbie”\],  \[“world”\], and \[“barbie”\], then the search word “barbie” would give the following idf scores. The document \[“barbie”\] would have an IDF of log_10⁡〖(3/(2\+1))\+1〗=1⁡ and the document \[“world”\] would have an IDF of (log_10⁡〖(3/(1\+1))\+1=〗⁡1.2

idf=log_10⁡〖((No.documents)/(No.documents containing serach word\+1))〗\+1
To use the benefits of both measures we need to mathematically combine them into TF-IDF, this can be done by just multiplying the two measures together . Each document is given a TF-IDF score for each search word in a search query. As a result TF-IDF for a given word and document has a maximum of 1 which is a perfect match where a document only contains the search word and is only mentioned once in the dataset of documents, and a minimum of 0 where a word never appears in a given document, or a word appears in every document.
Once we have a list of TF-IDF values of every document for every search word, then we can combine the documents scores of all search words. This is called Pooling and is how we summerise how good of a match a document is. A common method is just taking the average of all TF-IDF values which gives us the total score for a document compared to a search query.
At this point all we need to do is sort the documents in order of highest TF-IDF score to lowest, and we’ve successfully made a basic search engine!
Limitations of this method
This methodology is a great first step to understand how a simple document search engine could work, though it does have limitations. One thing is that spelling mistakes aren’t accounted for and our model does not understand the different ways the user may use language. For example, if someone’s search query was “barbie doll” (split into separatee topics of “barbie” and “doll”), our search engine would show them several topics with the same name; barbie the move, barbie the Australian BBQs, and rag dolls in video games. The problem here is our search engine doesn’t know anything about context, how language is used, and multiple meanings of words. We need a method that understands language. For this, we need an LLM in Semantic Search.