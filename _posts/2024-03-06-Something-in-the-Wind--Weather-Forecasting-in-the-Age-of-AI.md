---
title: 'Something in the Wind: Weather Forecasting in the Age of AI'
date: 2024-03-06 09:00:00 Z
categories:
- Artificial Intelligence
tags:
- Artificial Intelligence
- AI
- Machine Learning
- ML
- Weather
- Forecast
- GraphCast
- Graph
- Neural Network
- GNN
- featured
summary: Accurate weather forecasting helps us make decisions every day, from the trivial to the critical. I take a look at the technology that goes into predicting the weather, and consider how the AI revolution could change that.
author: pling
image: "/uploads/Something%20in%20the%20wind%20-%20thumbnail.png"
---

Talking about the weather: it’s a national obsession. And why not? It changes so rapidly in this part of the world, and 
it impacts us every day. We can all relate to checking the forecast before deciding whether to wear a coat or grab an 
umbrella, but think of all the critical decisions that depend on weather predictions. Should we evacuate this town? 
Should we delay this space mission? People’s lives and livelihoods rely on accurate weather forecasts.

In this blog post, I’m going to dive into some of the technology that we use to predict the weather, and look at an 
exciting new development that could revolutionise the field of meteorology: artificial intelligence.

<br/>

## A Brief History of Weather Forecasting

Since the beginning of time, people have tried to predict the weather. At first, with nothing more than prophecy and 
superstition (and perhaps some rituals to change any unfavourable outcomes). Aristotle was the first to put a bit of 
critical thinking into his predictions, but it wasn’t until the 17th century that the ideas and inventions of the 
Renaissance came together to give us the first scientific understanding of the weather. Fast-forward another couple of 
centuries, and Lewis Fry Richardson throws a bit of maths into the mix to give us our first glimpse of Numerical Weather 
Prediction. Then, in the 1950s, computers get involved and forecasting as we know it today really takes off.

Numerical Weather Prediction (NWP) is the practice of producing forecasts using deterministic algorithms, built from 
the physics-based equations that govern real-world weather patterns. These techniques calculate a prediction based on 
our best theoretical understanding of physical systems. Early numerical models used highly simplified equations, only 
taking a few variables into account. Over the ensuing decades, these models got more and more complex, incorporating 
concepts from thermodynamics, fluid dynamics and chaos theory. While many industries could take advantage of the 
downsizing of computers, the world’s forecasting agencies kept it large; the report you check today will have been 
calculated by a warehouse-filling supercomputer.

Predictions have become more and more accurate as a result, but this heavyweight hardware comes at a cost. Aside from 
the great expense of buying one of these machines, vast amounts of energy are required every time a forecast is 
produced. It has been joked that running a simulation has its own impact on the weather (although most European 
agencies have done a good job at switching to low-carbon sources). Now consider that a supercomputer will need 
replacing or upgrading every four or five years, and factor in all the costs and emissions from manufacturing and 
transport…

So what will come next in the world of weather forecasting? More complex numerical models? Bigger, more powerful 
supercomputers? Or could there be something a bit more sustainable?

Unless you’ve been off [measuring the weather on Mars](https://mars.nasa.gov/msl/mission/weather/) for the last few 
years, you will have noticed that artificial intelligence is *the* hot topic in tech right now. Here at Scott Logic, 
we’ve kept a keen eye on [what’s going on](https://blog.scottlogic.com/category/ai.html). We’ve 
[built chatbots](https://blog.scottlogic.com/2023/07/26/how-we-de-risked-a-genai-chatbot.html); we’ve looked at the 
[sustainability of training large language models](https://blog.scottlogic.com/2023/11/24/llm-mem.html); we’ve analysed 
[what businesses need to deploy AI](https://blog.scottlogic.com/2023/11/22/capabilities-to-deploy-ai-in-your-organisation.html) 
and [how it might impact architecture](https://blog.scottlogic.com/2023/06/06/how-ai-may-impact-software-architecture.html). 
So what are the prospects of using AI for predicting the weather?

<br/>

## Introducing GraphCast

Turns out, it’s looking quite promising. In the last few months, [Google have announced GraphCast](https://deepmind.google/discover/blog/graphcast-ai-model-for-faster-and-more-accurate-global-weather-forecasting/): 
an AI model that they claim can make medium-range weather forecasts with more accuracy than traditional NWP methods.

Google wasn’t the first to apply machine learning to the world of weather forecasting, and it’s not the last. Huawei 
have created Pangu-Weather and NVIDIA have FourCastNet, each with their own underlying flavours of AI. The European 
Centre for Medium-Range Weather Forecasts (ECMWF) have taken GraphCast as a starting point to build their own model.

For now, I’ll focus on GraphCast. According to Google’s paper, what they’ve created is an autoregressive model, 
implemented with a graph neural network architecture in an “encoder-processor-decoder” configuration and trained 
directly from reanalysis data. But what does all of that mean? Let’s break it down.

### Autoregressive

As with any AI or machine learning model, GraphCast takes a number of input values, runs them through an algorithm 
trained on a large dataset, then gives us one or more predicted output values. In GraphCast’s case, the inputs are made 
up of two sets of weather observations (temperature, wind speed, humidity etc.), separated by six hours; and the 
outputs are those same metrics, predicted for the next six hours. Each set of metrics covers the whole of the earth’s 
surface, and contains over two million values.

The autoregressive nature of GraphCast means that it can generate further predictions based on its own previous 
predictions. Say it’s 6 AM; we can make a forecast for midday today by giving GraphCast the current weather conditions, 
as well as those from six hours ago. We can then use that midday prediction, along with the current observations 
(6 AM), to forecast for 6 PM today.

We then use our two predictions (midday and 6 PM) to make a third (midnight), and continue feeding back into GraphCast 
to generate a weather forecast for up to 10 days from now. This process—you can think of it a bit like the Fibonacci 
sequence—is summarised in the diagram below.

![Flowchart showing how GraphCast uses two consecutive predictions to create a third]({{ site.github.url }}/pling/assets/Autoregression.png "Autoregression Diagram")

### Graph Neural Network

In a standard neural network (formally a Multi-Layer Perceptron, or MLP), we would take an input in the form of a 
neatly ordered list of numbers (a vector). We would then pass this input through the network one layer at a time, where 
each layer does the following:

1. Multiply each number by a weight, then sum them all together (matrix multiplication)
2. Introduce a bit of complexity (apply a non-linear activation function) to produce a new vector
3. Feed the new vector into the next layer

This continues through all the layers of the model, propagating information and manipulating the values at each stage, 
until we get some kind of prediction out the other end.

This type of network works well in a lot of applications, but when we’re modelling weather patterns around the earth’s 
surface we have a problem. If we put all our input into one vector, we lose information about the geometry of the 
globe. GraphCast solves this problem using the mathematical concept of a graph.

In mathematics and computer science, a graph is a structure made up of nodes (items or objects; data points) connected 
by edges. Graphs are particularly useful for modelling weather patterns around the earth because we can use them to 
build up a spherical surface, much like this 
[geodesic dome at the University of Surrey](https://artuk.org/discover/artworks/geodesic-dome-1982-272590).

![Two photographs of a spherical metal art sculpture. The second is in close-up with metal rods annotated as edges and intersections annotated as nodes]({{ site.github.url }}/pling/assets/GeodesicDomes.jpg "Geodesic Domes")

This represents the earth’s surface much better than a simple grid of latitude/longitude coordinates, because we’ve now 
directly linked each point with its closest neighbours.

With our graph representation, we can now make use of a Graph Neural Network (GNN). We have a much more complex input 
this time: each node has its own vector of information. Any attempt to squash them into one big vector would result in 
us losing all of that structural information that makes the graph so useful.

So instead of the MLP process described above, each layer of the GNN propagates information by passing messages between 
nodes. A node will take information from its neighbour and combine that with its own information (and anything from the 
linking edge) to create a message. These messages get created and sent between every pair of connected nodes, so each 
node receives a collection of messages. The node then aggregates all of these messages, and uses the resultant values 
to update itself.

![Diagram showing how information propagates in a Graph Neural Network]({{ site.github.url }}/pling/assets/MessagePassing.png "Message Passing Diagram")
*How information propagates in a Graph Neural Network. 
**(1)** Input graph with four connected nodes. 
**(2)** Messages are created for each neighbouring node, combining information from the sending and receiving nodes. 
**(3)** Messages are received from each neighbouring node. 
**(4)** Messages are aggregated. 
**(5)** Nodes are updated using the aggregated messages.*
{: style="font-size: 80%; text-align: center;"}

So just like weather patterns propagate around the earth’s surface over time, each layer of the network allows 
information to propagate further and further around the graph. And just as the planet doesn’t deform (at least not 
significantly enough for weather forecasting), the graph’s structure is always preserved.

### Encoder-processor-decoder

As we’ve seen, graph structures can be an excellent way of modelling how weather patterns move around the surface of 
the earth. But that’s not how our inputs are arranged, and it’s not so useful as an output. GraphCast ingests data on a 
more conventional latitude/longitude grid, and the first layer in the network is responsible for encoding the 
information into a graph. This is also learnt behaviour from the training. Likewise on the other end, the final layer 
decodes the graph back onto a standard grid and—hey presto—there’s your forecast, all ready to use.

### Reanalysis Data

As with any machine learning approach, GraphCast had to be trained with a good dataset. Fortunately for Google, there 
is an excellent dataset called ERA5, which is made freely available by ECMWF. They have produced 
[a video on reanalysis](https://youtu.be/FAGobvUGl24?si=qP7Ii1_E-TGDL4tj) that neatly explains how the data is created 
(from which I’ve borrowed the images below), but this is the process in a nutshell:

Start by collating recorded weather observations from around the world, going back as far as 1940. These measurements 
are patchy and not always accurate, so traditional NWP methods are used to essentially make “forecasts” for the past. 
This technique, known as Data Assimilation, fills in the gaps and irons out any problematic areas to give us a 
consistent, complete dataset for every point on the globe over the past 80 years.

![Two jigsaw puzzles depicting weather patterns around the earth. The first puzzle has missing pieces; the second is complete.]({{ site.github.url }}/pling/assets/ERA5.jpg "Data Assimilation Jigsaw")
*Data Assimilation fills in the missing pieces to create a complete picture of the weather over the past 80 years. 
Image credit: Copernicus ECMWF [https://youtu.be/FAGobvUGl24](https://youtu.be/FAGobvUGl24)*
{: style="font-size: 80%; text-align: center;"}

<br/>

## Changing the World, One Forecast at a Time

Whenever I come across a new application for AI, my initial thought tends to be, “that’s pretty cool…but does society 
really need this?” We’re living in a volatile time, and AI seems to be giving us more problems than solutions: 
deepfakes, copyright infringements, job insecurities. But using these techniques to predict the weather is something I 
can get on board with. I described at the start of this post just how important weather forecasting is, and using AI 
promises us more accurate results as well as more advanced notice of extreme weather events. Not only do the results 
improve, but we also see a dramatic decrease in energy demands.

The initial training can be pretty intensive (Google used 32 of their Tensor Processing Units for about four weeks), 
but this is a one-off overhead. Afterwards, a ten-day forecast can be generated in under a minute on a single chip. 
Compare this with a traditional NWP approach, which could take over an hour on a supercomputer with 260,000 cores. 
NVIDIA reckon that FourCastNet uses about 12,000 times less energy to generate a ten-day forecast than the supercomputer 
used by the ECMWF.

With less reliance on their supercomputers, forecasting agencies may need to invest in some new data engineering 
infrastructure. This could be an ideal opportunity for them to migrate to the cloud (pun very much intended) and 
perhaps to overhaul some of their legacy systems.

<br/>

## This is the End

<br/>

### The End of Supercomputers?

Clearly not, but there are other high-performance computing applications that could take advantage of machine learning. 
We’re already seeing this kind of progress in fields such as computational chemistry and drug discovery, astrophysical 
simulation, computational fluid dynamics, and structural mechanics.

### The End of NWP?

With the dawn of AI-based forecasting, will we see the end of Numerical Weather Prediction? This seems unlikely to me, 
but what we might start to see is a refocusing of what NWP is used for. Machine learning can be great at making 
predictions on an almost “intuitive” level, but it’s not capable of logical reasoning. So perhaps instead of day-to-day 
forecasts, traditional NWP will be used more as a research tool to improve our understanding of how weather patterns 
work. We could also see NWP being utilised for more bespoke weather forecasts—perhaps for high-profile aerospace or 
military applications—or for the occasional benchmarking of AI-generated outputs.

### The End of the Blog Post

Now this one is certain. We’ve seen what currently goes into forecasting the weather, and how artificial intelligence 
is making waves towards advancing and perhaps revolutionising the process with its potential to improve on both 
accuracy and energy consumption.

Given humanity’s desire and need to predict the weather, I look forward to seeing how this area of development evolves 
over the coming years. Let’s keep talking about the weather.

<br/>
