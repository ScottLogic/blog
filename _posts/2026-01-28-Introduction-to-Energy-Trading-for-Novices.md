---
title: Introduction to Energy Trading for Novices
date: 2026-01-28 00:00:00 Z
categories:
- Resources
tags:
- energy
- trading
- market
- power
- trader
- epex
- nordpool
- intraday
- day
- ahead
summary: Energy trading is a complex domain. Having just finished my first project
  in the energy sector I've written this quick-start guide to exaplain all the concepts
  and terminology I wish I'd known at the start of the project.
author: pmarsh
image: "/uploads/Peter-Marsh-blog-quote-01.jpg"
layout: default_post
---

Do you picture a scene like The Wolf of Wall Street when you imagine a trading floor? Do you see hordes of wide-eyed guys in suits shouting down telephones to customers, hustle and bustle, and huge parties when big deals are made? The truth is that trading happens in quiet offices where calm, focused and very qualified individuals study numbers in grids that stretch across ranks of computer monitors. They know how to use the data, how to analyse trends, how to calculate to maximise a profit, and how to get the best outcomes for their business. And they know the systems and rules of trading inside and out. As a developer (or tester or designer) working on a trading application, you will also need to gain a basic understanding of the domain.

<p>
  <figure>
    <img
      src="{{ site.github.url }}/pmarsh/assets/trader_drawing.GIF"
      alt="stick-figure drawing of an energy trader."
    />
  </figure>
</p>

I just completed my first software project in the energy sector. Over the two years, aside from improving my dev skills, I learned a lot of interesting stuff about the complexities of sending electricity around the world! What follows is a summary of what I learned about energy trading and the energy market written in simple terms: A quick-start guide for novices that I wish that I’d had at the start of the project.

## Energy

Let’s go from the start: with Energy. Energy is a hugely useful resource that people and businesses pay good money for. Energy companies own power plants that burn gas, break down nuclear materials, or capture the movement of wind and water to generate the electricity that is then sent to all the people that use it.

Energy can be traded in the form of electricity, or as oil and gas. In this article I focus on electricity, especially in the European market.

## The Grid

Electricity travels down cables to get from people that generate it to people that use it. Every country has a big set of interconnected cables called the **Grid** that connects houses and buildings to the power stations that generate electricity.

For complicated physics reasons (ask a scientist) the grid must stay **balanced**. This means that all the electricity generated and fed into the grid must be immediately used up – in other words: The electricity coming into the grid (the **supply**) must equal the energy going out (the **demand**) at all times. If that doesn’t happen then the grid’s hardware will take damage and it could shut down. Balancing the grid is a crazy task. Think about it: Imagine the hundreds of millions of homes and offices and shops in your country, and then picture all the heaters, fridges, lightbulbs, computers, and phone chargers in each building that may or may not be being used at a particular moment. All this fluctuating demand must be accounted for by electricity generators. Market and grid operators make sure balance is reached by dishing out severe penalties to those that disrupt it. But fear not, dear reader. As a bog-standard user of electricity, yours will be bought from an energy supplier (think British Gas, EDF, Octopus Energy etc) rather than wholesale from the market. It is the supplier’s job and not yours to trade on the market directly and anticipate how much energy you will use.

## Energy between grids

Remember how each country has its own grid\*? Well, there are cables that connect each grid to neighbouring ones - for instance, France’s grid will be linked to Spain’s. This means that electricity produced in Spain can be bought and used in France, which is useful if Spain cannot produce enough electricity to meet their demand or if France’s production is greener or cheaper.

\*_Side note: sometimes a country’s grid can be split by region. For example, Germany has 4 separate control areas which are operated by different people. When you send/receive energy from Germany you send/receive from a specific control area as if they were separate grids. For the sake of simplicity, the article is written as though each country has one grid._

<p>
  <figure>
    <img
      src="{{ site.github.url }}/pmarsh/assets/power_lines_drawing.GIF"
      alt="stick-figure drawing of a set of power lines and pylons."
    />
  </figure>
</p>

But you can only transfer a limited amount of electricity from one country to another. That’s because the linking cables can only carry a limited amount of electricity without getting damaged. The amount of energy that can be transferred from one country to another in a time period is called the **transmission capacity**. Before transmitting energy across a border, traders must bid for and book capacity, which is a separate system from the electricity market (at least when markets are not coupled – see the next section).

So, if Antoni in Switzerland needs to buy energy from France, then he must check that there is enough available capacity at the border to transmit that amount of energy. If he makes the purchase and there is not enough transmission capacity, then the electricity cannot be transmitted, the trade cannot be fulfilled, and he will face penalties from the market (unless he can fix his error by trading back).

## Market coupling

We’ve established that the process of making electricity trades is separate from booking capacity. This can cause problems. Picture this: Antoni in Switzerland has his eye on the French market. An order has just come into France which, if he traded on it, could earn him a large profit and help his company make the most of its wind turbines. But he should act fast because the market changes very quickly; there are so many people on the market that the orders and prices are constantly shifting. So Antoni rushes to the transmission capacity booking system and secures enough capacity for the trade, switches back to his view of the market and… The order is gone. He’s lost his golden opportunity, and now the capacity system thinks he has electricity to send or receive. It’s a bad day for Antoni.

And, to worsen Antoni’s day, while focusing on the French market he has unknowingly missed several good opportunities for trades in Germany!

To solve this, certain countries have banded together to organise what’s known as a **coupled market**. Take Europe’s **Single Intraday Coupling (SIDC)** initiative, and **Cross-Border IntraDay (XBID)**, the IT system that powers it. Tereza, a trader in Austria, can make use of this. She can look at one screen which shows this coupled market, containing orders and trading opportunities from all countries involved in the SIDC initiative. Better yet, the orders that appear to her are only those that can be made with the capacity available at the relevant borders, so she doesn’t need to worry about checking the capacity system. When she spots an opportunity, she quickly makes the trade, and the correct capacity is automatically allocated. It’s a good day for Tereza!

Now Tereza is trading electricity that will be delivered between 3pm and 4pm. As soon as the clock hits 2:55pm (5 minutes before delivery, though this depends on the border), we observe what is known as **gate closure**. At this time anybody intending to send electricity across grid borders is locked in and they may no longer book further capacity. As such, Tereza’s view of the market changes. After gate closure she only sees the orders for Austria, her own country, and can only make trades with others within Austria. Thanks to SIDC, this is all handled automatically for her and there is no chance of her accidentally making cross-border trades after gate closure.

Traders within countries involved in SIDC enjoy these advantages offered by the coupled market. Meanwhile those outside SIDC must come up with their own systems to make the most of opportunities occurring across different borders, and to avoid making trades they don’t have capacity for.

## Energy Prices

Energy prices, much like the price of everything else in the world, is mostly a question of supply and demand. It depends entirely on what participants in the market are willing to buy or sell energy for. If lots of people need to use electricity, and for whatever reason not much electricity is available, then the electricity will be more expensive. On the other hand, if not many people are using electricity but there are lots of generators up and running, then electricity will be cheap.

There are different ways of generating electricity. Take, for example, nuclear powered (break down nuclear matter -> gain electricity), gas powered (burn gas -> gain electricity) and solar powered (absorb sunlight -> gain electricity). It is not important to understand exactly how these work, but it is useful to know that they each cost different amounts of money to run. For instance, solar panels cost some money to set up but once they’re there, the sunlight they use to make the electricity is free. On the other hand, a gas-powered plant will cost a lot of money to build and set up, and then even more money to buy the gas that gets burned to generate the electricity. That’s not to mention maintenance costs and paying the people that work there. Therefore, a company that owns solar panels might be more willing to sell their electricity at lower prices than a company that owns a gas-powered plant.

<p>
  <figure>
    <img
      src="{{ site.github.url }}/pmarsh/assets/windmill_drawing.GIF"
      alt="stick-figure drawing of a windmill and a solar panel."
    />
  </figure>
</p>

Different ways of electricity generation also have different startup and shutdown times, with shorter startup and shutdown times providing more **flexibility**. A solar farm that is already in the sun can be switched on and off with no wait at all, which means that on a sunny day it is useful for meeting last-minute demand and balancing the grid. On the other hand, consider a nuclear power plant. While able to produce more power more consistently and over a longer time, it can take several hours to start or stop producing electricity, so it is much less able to respond to fluctuating demand. For this reason, if there is a sudden rush of demand for electricity needed in the next five minutes, it could cost a high price since fewer power stations are able to respond to that. However, if we can forecast a large demand of energy in a week’s time, then we have plenty of time to choose how we will generate that power and start up the relevant power station. Therefore, the electricity can be sold more cheaply.

Here’s something that surprised me: Occasionally, electricity sells for negative prices! Imagine that lots of people are forecasted to use electricity at 6pm on Thursday because they’re all sitting down to watch an exciting new TV programme. So all the gas power plants are planned to start up to deliver the required electricity… But then the programme is cancelled last minute! These gas plants are still generating electricity and feeding it to the grid and there are no consumers to use it. In this case the providers might pay consumers to use up this energy, otherwise there will be a grid imbalance.

You can see the live energy prices in different countries in Europe [here](https://transparency.entsoe.eu/market/energyPrices).

## The Market

The market, or exchange, is where people (retail suppliers, generators, especially large businesses, speculative traders, etc) go to buy or sell energy. In Europe there are different markets operated by different companies. Some big names include EPEX and Nordpool. The different markets serve different places, for instance Nordpool serves most of northern Europe and EPEX serves parts of northern and central Europe, while Belpex serves only Belgium. When you start trading you must choose a market to trade in, learn how that market operates and go through the legal signup process which will involve paying license fees.

Once you have access to the market, what are you actually trading? We must start by understanding **contracts**\*. A contract is the combination of a **delivery period** and a place (**delivery area**), for instance a contract might be “Monday 3pm to 4pm in Germany”, or “Thursday 6:30am to 6:45am in Italy”. A trader will be able to buy and sell against these contracts to create **trades**. A trade is a legal promise that involves a contract, a buyer, a seller, a price and a quantity\*\*. An example trade would be “Jerry will deliver 10 MW of power to Tommy in France between 3:30pm and 4pm. Tommy will pay €30 to Jerry”.

\*_I am told that Nordpool uses the term Product instead. I was frequently bamboozled by the terms Contract and Product while on my project. Our client sometimes used them interchangeably, but EPEX used Contract as defined above, while using product to describe a type of contract, e.g. “hourly”, “half-hourly”. This is why it is important to read the specs when you’re building an app for a new system!_

\*\*_A note on energy and power: Energy is the actual physical thing that lets you do stuff, i.e. light a room. Power is that rate of energy transfer. Power is measured in watts (W) while energy is measured in watt-hours (Wh). If you transfer energy at a rate of 1 Watt for exactly one hour, then you have transferred one watt-hour of energy. A lightbulb with a power of 60W will transfer 60Wh in one hour, 30Wh in half an hour, 120Wh in 2 hours and so on._

_This is relevant because energy trades have a quantity, and that is a quantity of power (at least for EPEX). The above trade between Jerry and Tommy says “Jerry will deliver a continuous power of 10 MW between 3:30pm and 4pm, which is the same as 5MWh of energy". As you’re developing, make sure you know whether quantities refer to amounts of energy or power._

<p>
  <figure>
    <img
      src="{{ site.github.url }}/pmarsh/assets/orderbook_drawing.GIF"
      alt=""
    />
  </figure>
  <figcaption>
    <i>An example orderbook containing everone's orders for one contract - Wednesday 14:30-14:45 in the French delivery area (called RTE).</i>
  </figcaption>
</p>

Traders show that they wish to trade by placing limit **orders** on the market (there are different types of orders but that’s an explanation for another blog). They place each order against contract (reminder – that’s a delivery period and a delivery area) and it details the amount that they want to trade and the amount that they would like to buy or sell it for. An example order might be “For the period 12:00-13:00 in Germany, Jeff would like to buy 12 MW of power for €40”. Another order might be “For the period 12:00-13:00 in Germany, Sarah would like to sell 30 MW of power for €30”. For these cases, Jeff is willing to pay up to €40 (**bid** price) for that 12MW of energy that he needs, meanwhile Sarah is asking for at least €30 (**ask** price) for the 30MW of energy that she wants to sell. The market will see these two orders, see that Sarah could buy Jeff’s energy, and create that trade for them: 12 MW of power for €30.

## Auction vs Continuous Trading

Trading can happen via continuous trading or auction. With continuous trading, as soon as two orders can be matched (the buyer is willing to pay at least as much as the seller is willing to sell for), a trade will be made immediately, and the orders will be removed from the market. In contrast, orders placed in auctions remain until the fixed time that auction closes. When the auction closes, the market will choose a **clearing price** which is determined by the best orders that have been placed (different markets have different calculations for this). Then buyers that have offered more than this clearing price will have trades, and similarly for sellers that have asked for less than this clearing price. Auctions can be **blind** (traders cannot see what orders have been placed by other people) or **open** (other orders and prices are visible, so traders can adjust their bid prices accordingly).

## Day-ahead vs Intraday

The process of establishing exactly what energy is being traded for a particular day or hour doesn’t just happen in one step. It involves two separate but consecutive stages of trading: Day-ahead and Intraday. Intraday trading happens closer to the actual delivery of the electricity, which implies a couple of things: supply and demand predictions become more certain, and balance becomes more critical. Large companies will typically have different teams and departments concerned with each stage.

**Day-ahead trading**: As the name implies, Day-ahead concerns trading electricity for tomorrow. This is done as a blind auction: every day, trading for each delivery period of the following day opens at a fixed time and then closes at a later fixed time. Orders are placed and at the end of trading, the clearing price is chosen and trades are made. Europe now operates at 15-minute time periods, which is called the market time unit.

_In day-ahead trading, marginal pricing applies. This means that all sellers are paid the same price regardless of what they offered to sell at if their orders are filled. This also means all buyers pay the same price if their orders are filled._

**Intraday trading**: At this stage you can trade energy for quarters (15 minute delivery periods), half-hours and hours for the current day (though this depends on both the market and the country border / delivery area. Sometimes there are longer periods available too). Intraday trading is done as both continuous trading as well as several auctions through the day. Orders can be placed and trades can be made right up to the delivery of the electricity (or a short time before, depending on the delivery area), which allows a balance to be reached.

## Making money with Energy Trading

While the energy market is there for several reasons – to connect providers to consumers, to ensure consumers have the energy they need, to control the price of energy and to maintain balance in the grid – it is also a good opportunity to make money, and most traders will have profits in mind as they buy and sell.

As discussed, the price of energy is constantly in flux. If you sell energy when the price is high, you will earn more money. If you buy energy when the price is low, you will spend less. The difficulty, and the art, is in predicting how prices will change ahead of time. It’s a complicated enough task that companies will sometimes have entire departments dedicated to this effort, observing market trends and leveraging as much data as they can (household use throughout the day, weather trends and mountain snowmelt just to name a few) to produce the most accurate model possible. At the end of the day, it’s a data science problem.

<p>
  <figure>
    <img
      src="{{ site.github.url }}/pmarsh/assets/graph_drawing.GIF"
      alt="A scatter graph of price against time with a trend line."
    />
  </figure>
</p>

## Asset–Backed Trading

The most obvious way to make money on the energy market is by selling energy from your power station (Known as **asset-backed trading**). This is the least risky way to trade because you are selling a very real thing that you can provide. In terms of balancing the grid, if you only sell energy that you know you can generate and the person that buys it uses it all, then that trade results in zero grid imbalance. You should be savvy though because you’ll probably want to sell enough energy at high cost to cover the fuel and operational costs of your power station.

If you are a company that controls a hydroelectric dam then you have some extra tactics at your disposal. We call this pumped storage. A dam generates energy by releasing stored water downstream through a turbine. Picture a dam as a giant battery: More water in the dam represents more electricity that can be generated. The battery charges when it rains, or mountain snow melts and rivers flow to feed the dam - a perfect way of harnessing the environment for clean energy. You can also charge the battery by using energy to pump water from downstream back up into the dam, which is where a unique opportunity arises! Imagine buying energy at night when there is less demand and prices are low and using that energy to pump water into the dam. Then later during the day, when the prices are higher you can release that energy you stored, earning you a profit.

<p>
  <figure>
    <img
      src="{{ site.github.url }}/pmarsh/assets/dam_drawing.GIF"
      alt="stick-figure drawing of a hydro-dam."
    />
  </figure>
</p>

## Speculative Trading

The other way to make money is through **speculative trading**. This is when you don’t own an asset that you can sell – you can only buy and sell energy that is on the market. The principle is simple: Buy energy now at a low cost and then sell that energy later at a higher cost (buy low sell high) or sell energy now at a high cost and then buy back later at a lower cost (sell high buy low). This is risky because it puts you in an exposed **position**.

Let me explain: Suppose you haven’t bought or sold anything yet. You have a position of 0. You then buy 10MW of power which will be delivered between 6pm and 7pm today, which puts you in a position of 10MW for that contract. This tells the market “I intend to use this 10MW of power between 7pm and 8pm”. If, in fact, you don’t intend on using up this energy then you have a problem because the grid will be imbalanced: Someone will be delivering this energy onto the grid that you are not consuming. Expect stern emails from the market, a large fine or even a summons to a meeting where you should explain exactly why you should not be banned from the market! So it is now your mission before trading ends to sell your 10MW to someone else (ideally at a higher price).

Suppose instead that you start with 0 position and then you sell 10MW of energy that will be delivered between 7pm and 8pm. Remember that you don’t own a power station; you have just sold energy that you don’t own. Not yet at least. You now have a position of -10MW for that contract. If you keep this negative position then at 7pm the buyer will begin to use 10MW of energy, you will not be putting that energy onto the grid and what do we get? Imbalance. And the penalties that come with it. So instead, it is your mission to buy back that 10MW from someone else (ideally at a lower price).

If you have a nonzero position and trading is coming to an end it is almost always in your interest to make trades to reduce your position to zero, even if it means losing money. The market and grid operators are not kind to those that disrupt the balance.

We call this **position management**, and it is a top concern of any trader. Always end trading with zero position, unless you intend to add energy to the grid or take energy away.

## Summary

Trading is a complicated beast, and energy is a unique resource which comes with its own challenges. The energy market serves to maintain balance on the grid and to make sure consumers get the energy they need, when they need it, and at sensible prices. We have covered the energy grid and capacity management, energy pricing, the mechanics of putting orders on the market and making trades and the basic ideas of making money.

Like most things, this domain is a rabbit hole and there is plenty more to uncover, however this should give you a solid foundation. Armed with this knowledge, you should be able to walk confidently into your project meetings and understand the mechanisms behind whatever application you are building!
