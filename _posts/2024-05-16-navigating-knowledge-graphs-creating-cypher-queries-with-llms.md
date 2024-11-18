---
title: Navigating Knowledge Graphs - Creating Cypher Queries with LLMs
date: 2024-05-16 00:00:00 Z
categories:
- Artificial Intelligence
tags:
- Large Language Models
- Knowledge Graphs
- Cypher
- Artificial Intelligence
- AI
summary: This blog demonstrates how to generate graph database queries using a large language model. This allows users to ask natural language questions in order to understand their data presented in a knowledge graph better! This can be done without extensive understanding of the querying language.
author: bheyman
image: "/uploads/Navigating%20knowledge%20graphs%20thumbnail.png"
layout: default_post
---

## Introduction

In this blog post I’ll show you how to create graph database queries using a large language model (LLM) and very minimal query language knowledge. By using an LLM, anyone who wants to start using a graph database can do so, without having to learn a new querying language (“Great news!” I hear you all say).

Graph databases are not like your typical relational database and are represented by a knowledge graph. This is a graph of nodes, connected by edges which act as relationships between the different nodes. Graph databases are extremely useful when trying to query your data and find complex insights with a lot simpler form of querying (It won’t seem like this at first though, I am sure).

This is where cypher comes in. Cypher is the chosen querying language for Neo4j, one of the most prominent graph database providers around. The only problem is that not that many people have used Cypher and no one wants to have to learn new querying languages after sinking all their precious time into learning SQL. How about we use an LLM to try and generate these queries for us?

If you want to learn more about graph databases and knowledge graphs, read Richard's excellent blog post that gives a great introduction to what they're all about. This can be found on the [Scott Logic blog](https://blog.scottlogic.com/2024/05/01/knowledge-graphs-what-are-they.html). 

### What sort of insights can we get?

Ultimately you can ask any question you want about your data. Instead of concentrating on what the query is, you can get greater insights by just having to think of the questions you want answers to!

I have populated a graph database (see below for further details) with some financial data for transactions made by 3 different people.

Here are some of the questions and the responses I get back.

~~~python
question("Find all persons who made transactions with Aldi?")

>>> "John, I found out that Jane Smith and you have made transactions with Aldi. It seems that both of you have made multiple transactions there."

question("How much did I spend at Tesco?")

>>> "John, you have spent a total of £1750 at Tesco."

question("What did I spend more on Tesco or Aldi?")

>>> "John, you've spent more at Tesco. The total amount there is £1750, while at Aldi, you've spent £225."
~~~
*We shall use the last question as our example throughout the blog post*

To me this fascinating! What is so versatile about this is that we can ask natural language questions that will then be converted to a Cypher query and the data can then be returned to us as natural language again. This is where the combination of graph databases and LLMs becomes really powerful. 

The ability to be able to ask questions as you normally would to a friend or colleague and get useful responses is amazing! The possibilities are truly endless (all caveats aside!), so let's see what's happening under the hood.

## Set Up

There are 3 main components of the set up:

1. Selecting a large language model (Mistral in this case)
2. Creating the schema
3. Populating a Neo4j graph database

### Selecting and implementing a large language model

 When deciding what LLM to use, I didn't want to use any of OpenAI’s GPT models. For those who don’t know, there are several different models that can be used (Claude and Mistral being two of the largest competitors at the time to OpenAI). I decided to go with Mistral and use their `Large` model to see how it compares with `GPT-4`. [It's a lot cheaper to use as well!](https://context.ai/compare/mistral-large/gpt-4)

![mistral ranking]({{ site.github.url }}/bheyman/assets/mistral_ranking.png "mistral ranking")
*Mistral ranks just below GPT-4 on MMLU (Measuring massive multitask language understanding)*
  
We then incorporate this into a small python project that can make these calls to the Mistral-Large API endpoint - **All code is provided at the end of this blog post**.

### Creating the schema

For the schema we want to show how each node of the graph relates to other nodes. Getting this right is important, but also fixable.

A basic schema was created as below.

![schema]({{ site.github.url }}/bheyman/assets/schema.png "schema")
*This shows the different nodes of the graph database, the properties of each node and the relationships between the nodes.*

I found that I had a first draft schema that wasn't 100% working correctly. When I started asking it some questions, these weren't returning the correct query. This then directed me to change the schema to something more appropriate and fitting for the data I had. You can use the LLM to help in building the schema, which I found very helpful.

### Populating the graph database

After deciding on a schema, it now needs to be populated with some dummy data. The great part about this step is that we can also use an LLM to create some dummy data.

I passed the schema in a text format into the LLM, and this produced some Cypher queries for me to input into Neo4j to create the nodes. The cypher generated can be seen [here](https://github.com/bheyman-scottlogic/creating-cypher-queries/blob/main/dummy_data.txt).

*This did take a couple of attempts to create sufficient data, but it did work in the end. A small caveat can be noted here that some basic knowledge of Cypher will help you confirm the dummy data is useable. Alternatively, you can just run the queries in Neo4j and see what graph you get, if you are adamant about not learning any Cypher!*

To add this to Neo4j, we go to the Neo4j browser and paste in our Cypher queries to populate the database.

We then get a beautiful looking graph of inter-linked nodes!

![graph]({{ site.github.url }}/bheyman/assets/graph.png "graph")

## Using the LLM

The most important part of this is giving the LLM enough background information to use as a system prompt for it to know what to do. 

### Generating the query

For this part, the LLM is expected to be proficient at writing cypher queries and this has been incorporated into the prompt. We therefore provide a system prompt that gives the LLM enough context to be proficient at this. We want a cypher query to be returned from a question that we ask it. If it is not possible to generate a corresponding query, then we want the LLM to acknowledge this and not try to create something. This is where [hallucinations](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)) are likely to happen if not explicitly dealt with.

Let's take a look at the prompt used:

~~~
You are an expert in NEO4J and generating CYPHER queries. Help create cypher queries in json format {question: question provided by the user, query: cypher query}.

If you cannot make a query, query should just say "None"

Only use relationships that are present in the schema below. Do not under any circumstances create new relationships.

If the user asks about spending on X. Check whether this is one of the narrative options: {narrative_options}

You are only able to make queries that search for information, you are not able to create, or delete or update entries

Here is the graph schema:
{graph_schema}

The current date and time is {datetime.now()}

The current user is {current_user}
~~~

There are a few things in the prompt that help the LLM to make the right predictions when generating the next token. By telling it how it's an expert in Neo4j and Cypher it can take on this persona. You can then provide the format that you want it to return. I have asked for a JSON format as this is easy to interpret and provides a standard way of presenting the returned information.

I found that the most important part is providing the schema, along with a bit of semantic help for the LLM to gain context around what Cypher query to create. 

*There is a small caveat regarding Cypher knowledge and the notation for relationships. The syntax may be unfamiliar, but you will need to add this in to represent the relationships accurately. Beyond this you can get away with no further understanding of the querying language.*

~~~
Node properties are the following:\n  
Person {name: STRING, birth_date: DATE},  
Transaction {transaction_id: INTEGER, transaction_date: DATE, narrative: STRING, type: STRING, amount: INTEGER, balance: INTEGER}, "date format is 2024-02-15" "narrative can only be one of the following: Bills, Groceries, Entertainment, Rent, Shopping"  
Account {account_number: INTEGER, sort_code: INTEGER, account_type: STRING},  
Shop {merchant_name: STRING, account_number: INTEGER, sort_code: INTEGER},  
Category {transaction_category: STRING} "This category can either be: {online shopping, in-store}"  
  
The relationships between the nodes are the following:\n  
(:Person)-[:MADE]->(:Transaction),  
(:Person)-[:HAS]->(:Account),  
(:Transaction)-[:PAID_TO]->(:Shop),  
(:Transaction)-[:CLASSIFIED_AS]->(:Category),  
(:Transaction)-[:PAID_BY]->(:Account)
~~~

The semantic help that is added in makes this a lot more powerful. Without you telling the LLM what category means, it will be a lot harder for the LLM to unpack a natural language question and create a query. 

For example, if you ask about online shopping spend, with the extra help as above, the LLM will better understand that we want to know about the **Category** node. Otherwise, it may have assumed that online shopping is one of the potential narrative options and generated a completely different query.

This prompt was not all thought of completely at once and was an iterative process that evolved as I asked different questions, found that it would return the wrong thing and then added in a new line to help get what I wanted. This seems to be a common process that occurs when [prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering) and it seems that you could continue to iterate for a very long time until your prompt is perfect.

*It is worth noting that the additional semantic help in the prompt is not extensive in this simple application. To give the LLM a much better chance of predicting the next token, we can provide the underlying meaning behind each node and relationship in the graph. This can therefore be improved by being as detailed and explicit as possible (You could even use an LLM to provide these details!). The less room for interpretation that is given, the better the response will likely be.*

So, what do we get back from this prompt when we make the LLM call?

~~~json
{
    "question": "What did I spend more on Tesco or Aldi?",
    "query": "MATCH (p:Person {name: 'John Doe'})-[:MADE]->(t:Transaction)-[:PAID_TO]->(s:Shop) 
        WHERE s.merchant_name IN ['Tesco', 'Aldi']
        WITH s.merchant_name as merchant, SUM(t.amount) as total_spent 
        RETURN merchant, total_spent ORDER BY total_spent DESC"
}
~~~

We get a JSON object returned in the format that we specified in our prompt. This makes it easy to extract the query and use this to further extract the data from Neo4j.

### Querying the database

Now we have a query, we can use this to query Neo4j and hopefully get some information out of it.

The function below will take the query from our JSON object and run this in our Neo4j instance. It will then return any records from the database in a dictionary or return an exception if not possible.

~~~python
def create_query(query):  
    try:  
        session = driver.session()   
        records = session.run(query)  
        record_dict = []  
        for record in records:  
            record_dict.append(record.data())  
        return record_dict  
  
    except Exception as e:  
        logging.exception(f"Error: {e}")  
        raise  
  
    finally:  
        if session:  
            session.close()  
        driver.close()
~~~

When we run our example question we get the following response: 

~~~JSON
[{'merchant': 'Tesco', 'total_spent': 1750}, {'merchant': 'Aldi', 'total_spent': 225}]
~~~

We can then put this through another LLM with a different "personality" to get the natural language response for the user.

### Returning data as words

The final piece of the puzzle is getting a well worded sentence back to the user that summarises any data returned from the database. 

For the user prompt, we can pass the JSON object of the question and the Cypher query, along with the response from the database. This provides a good amount of context around the query for what it is doing.

For the system prompt we use the following:

~~~
You are an expert at summarising responses from a graph database. You will be provided with the original question and the response from the database.  
  
The information will come in the format:  
  
**User prompt: {"question": "Whats the sum of all my transactions", "query": "MATCH (p:Person {name: 'Terry Turner'})-[:MADE]->(t:Transaction) RETURN SUM(t.amount)"} response: [{'SUM(t.amount)': 1000}]**  
  
Use the "question" as context for your reply  
Use the response as the main content of your answer. This should however be in prose English ie. use the information to create sentences as a reply.  
  
answer example: "The sum of your transactions Terry, is £1000"  
  
You are speaking to {current_user}, if another user is mentioned, you are still speaking to {current_user}  
  
Only reply with a relevant answer as a string, do not return any of the prompt back to the user and don't include any IDs as these are only relevant for the database.  
  
All amounts are in GBP £
~~~

Here we can see that we provide an example for the user prompt format and an example for what we want the answer returned to the user to look like. This is called [one-shot prompting](https://www.linkedin.com/pulse/zero-shot-one-few-learning-prompt-engineering-pathan) and scratches the surface of how to improve our LLM prompts. All this information really helps the LLM to reply in a more consistent format.

The final result is a well written natural language response that presents our data.

~~~python
question("What did I spend more on Tesco or Aldi?")

>>> "John, you've spent more at Tesco. The total amount there is £1750, while at Aldi, you've spent £225."
~~~

## The Full Journey

Here you can see the sequence diagram, showing the full flow through each step of the process.

![sequence diagram]({{ site.github.url }}/bheyman/assets/sequence_diagram.png "sequence diagram")

## Main Takeaways

Overall, this is an incredible use of large language models. The fact that you can ask all these questions without having to thoroughly understand the querying language opens up many doors! You don't have to provide structure in your questions being asked as the LLM is able to infer things from the question and the relative context it has. I had a lot of fun messing around with the data and asking different things and on the most part it was very successful. 

The [non-deterministic](https://en.wikipedia.org/wiki/Nondeterministic_algorithm) nature of using LLMs can provide some nuances when generating these queries and will likely mean that it isn't going to work 100% of the time. Adding in the graph schema and some explanation of what nodes/properties/edges represent makes this very powerful and gives the LLM a strong understanding of how everything interacts together.

So do you need to learn Cypher? Realistically, it is beneficial to learn Cypher if you plan to work with it. Using an LLM to generate Cypher queries can be a valuable stepping stone for understanding the query structure and gaining deep insights into your data. However, relying solely on LLM-generated queries without understanding the underlying concepts may lead to future issues within a codebase and as a developer. Additionally, it is important to consider the energy costs of using this approach when building an application, as it may not be the most efficient solution.

Finally, large language models are only going to get more powerful and therefore get better at this process. There is also the option to [fine-tune an LLM specifically on Cypher queries](https://towardsdatascience.com/fine-tuning-an-llm-model-with-h2o-llm-studio-to-generate-cypher-statements-3f34822ad5) to make it even more reliable. At this point I am already extremely impressed and look forward to seeing what can be done in the future.

## Have a Go Yourself

If you want to have a play around with the code and ask some questions, all you need is a Mistral API key. All the code is available [here](https://github.com/bheyman-scottlogic/creating-cypher-queries). 

The `README.md` has all the information on how to set up the project and includes some example questions to ask the data. Try and find some questions that break it and see if you can improve the prompts yourself!