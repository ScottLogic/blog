---
title: Could cars help predict the weather?
date: 2024-05-20 09:00:00 Z
categories:
- Tech
summary: The increase of in-car instrumentation over the years has opened up the opportunity
  to use this data as an input into weather modelling. Are we all driving around in
  mystic minivans and clairvoyant coupés?
author: rstrange
image: "/uploads/could%20cars%20help%20predict%20the%20weather.png"
---

Cars have been collecting environmental information for some time, so the concept of using in-car instrumentation to forecast potential issues in order to update the driving experience is [not that new](https://www.autocar.co.uk/car-news/industry/jaguar-land-rover-developing-new-tech-prepares-cars-upcoming-weather). Weather agencies are now looking at using this data to improve localised forecasting. With [experimentation ongoing](https://rmets.onlinelibrary.wiley.com/doi/10.1002/met.2058), it’s possible that future weather forecasts will be driven (pun definitely intended) in part by data streamed directly from motor vehicles owned by you or me.

![png]({{ site.github.url }}/rstrange/assets/car-weather-prediction/car1.jpg)
<small>Photo by [Darpan](https://unsplash.com/@darpanvisuals?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/red-car-fMI1ZUSKb2o?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)</small>

In this blog post I’ll be taking a look at some of the areas weather agencies are looking to improve with this new dataset alongside potential drawbacks, as well as offering some conjecture on how it might be applied. 

### Weather forecasting and the search for more data

Before getting into how your hatchback might be acting as the national barometer, it’s worth considering *why* weather agencies might want this data.

Traditional weather forecasting relies upon readings from observation stations. These static observatories are specifically placed to give accurate instrumentation readings across a range of parameters, that are then fed back to some central location in order to create a wide picture of weather conditions across a geological area. In the case of the UK the Met Office has [over 200](https://www.metoffice.gov.uk/weather/learn-about/how-forecasts-are-made/observations/weather-stations) observation stations [dotted](https://www.metoffice.gov.uk/weather/guides/observations/uk-observations-network) across the country, each sending data readings back to their headquarters in Exeter, Devon.

This allows them to get an accurate picture of the weather landscape across the UK as well as build up a historical account, which is then used as an input for their predictions and forecasting. Put simply, if they spot a North-Easterly warm weather front hitting Cornwall, they can predict balmy conditions in Bristol. 

However, given that these observation stations are roughly 40 km apart, there naturally exists gaps in observational knowledge between them. These grey zones can house some interesting and localised weather phenomena themselves which can have very real impacts on people's lives, especially in urban environments. 

Having access to finer-grained observational data would allow agencies to enrich their knowledge of the weather systems affecting the country, and would be especially useful in [Nowcasting](https://en.wikipedia.org/wiki/Nowcasting_(meteorology)) - the concept of producing accurate forecasts over a shorter timeframe. More specifically there are two main advantages: the data could be used as extra forecasting inputs, and the data could be used to validate forecasts produced by other means; if you predicted a heatwave across a city, do real-world measurements support that?

With more observational data comes more accurate forecasts that can be localised to inform individuals on a more personal scale. Telling you it’s going to rain all day is one thing, telling you localised flooding is expected on the road outside 2 hours from now is another.

How then, to collect this extra data to fill in these grey zones? 

Given the target is accurate observations at the granularity of 100s of metres it’s not practical to open the number of observatories this would require. The Met office has already opened their data stores to amateur weather stations to help fill in these gaps and is actively looking into using [radar](https://deepmind.google/discover/blog/nowcasting-the-next-hour-of-rain/) from their observatories to build up this more localised picture for nowcasting.

Then there is the idea of crowdsourced data; using disparate data sourced from a large collection of (usually) public data points that is cheaper to obtain.

Enter the humble car.

### Vehicles to the rescue… kind of

![png]({{ site.github.url }}/rstrange/assets/car-weather-prediction/car2.jpg)
<small>Photo by [Lisha Riabinina](https://unsplash.com/@weekendtripcreator?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/brown-wooden-bench-on-green-grass-field-near-mountain-covered-with-fog-during-daytime-V-86zlzf6pY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)</small>

Newer cars collect a lot of data. They can then send this data back to centralised data stores external to the vehicle; put simply your car may well be broadcasting all sorts of audit logs and information back to its manufacturer. I’m not going to talk about the ethics of data collection and usage here, and I’ve found it a [confusing landscape](https://www.fleetnews.co.uk/news/latest-fleet-news/connected-fleet/2023/07/31/lead-on-connected-vehicle-data-needed-to-realise-road-safety-potential) to work out exactly how this plays out with UK data laws, and who pays. Suffice it to say that, conceptually, if this data could be accessed (and I suspect that it can), it could provide a rich stream of real-time information about the physical environment.

So what kind of readings could vehicles help with, and what are the drawbacks?

**Temperature** - A fairly easy one to imagine as most cars nowadays come with a temperature sensor and happily display a reading on the dashboard. 

These are far from perfect, however, and can easily be skewed by their location on the vehicle, the road temperature, and many other factors; the temperature near your engine above a hot road surface is not going to be a reliable indicator of the ambient air temperature that forecasts would prefer. There may be other ways to make sense of this data - using a range of parameters from the car we may be able to get a more accurate estimate of the ambient temperature, but it may not be as simple as taking the reading as pure truth.

**Precipitation** - Certain cars come fitted with precipitation sensors to allow windscreen wipers to turn on automatically. Even ignoring these, by tracking windscreen wiper activation we can obtain a reasonably accurate picture of rainfall and, if you consider the wiper speed, roughly how heavy.

Again it’s not a perfect picture, as there are other reasons why drivers use their wipers; we wouldn’t want to assume it’s always raining as drivers leave a carwash for example, or when leaving a car park with lots of tree and bird cover. Nonetheless, we should be able to get a fairly reliable picture of rainfall using these.

**Visibility and road conditions** - Using image processing techniques from live feeds of on-board cameras could allow various visibility readings to be gained. An AI-trained model that can accurately read an image to detect fog, rainfall or snowfall could allow real-time weather updates, similar to a human observer without manual intervention.

**Atmospheric pressure** - Cars can come fitted with [barometers](https://www.standardbrand.com/media/1619/st10235bap-feb14_jtf_baro.pdf), so simple readings of atmospheric pressure could be possible from certain models.

Now these are only some examples, but as car instrumentation continues to improve it’s reasonable to assume that the potential for them to gather real-time information on the weather is only going to increase over time.

All of this will feed into a rich bag of diverse crowdsourced data, which then leads to questions on how it can be best used. It has to be considered alongside variations in instrumentation between car manufacturers, models, and even between different instances of car models themselves. Whilst there is a lot of potential data out there, it’s far from normalised or comparable.

And it’s not just road vehicles either. In the future [autonomous drone fleets](https://www.bbc.co.uk/news/business-67132527) that come packaged with simple weather reading devices could allow forecasters to receive granular information across a wider snapshot of vertical space.

![png]({{ site.github.url }}/rstrange/assets/car-weather-prediction/drone3.jpg)
<small>Photo by [Goh Rhy Yan](https://unsplash.com/@gohrhyyan?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/silhouette-of-quadcopter-drone-hovering-near-the-city-p_5BnqHfz3Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)</small>

Traditional observatories have a major advantage in that they generate reliable data; the weather agencies know exactly which instruments have been used and can normalise and trust that data. With crowdsourcing, we need to ensure we can trust the information we’re receiving to play into how much we trust any resultant forecasts, which will naturally require a selection of [data cleaning](https://www.geeksforgeeks.org/data-cleansing-introduction/) and processing techniques.

### That is one big pile of data

Predicting the weather comes with built-in uncertainty. 

Active experimentation is looking at using vehicle data with [Numerical Weather Prediction](https://en.wikipedia.org/wiki/Numerical_weather_prediction), which relies on measurements being plugged into physics simulations, but in time perhaps AI could help create the models used in forecasting. In either case it’s clear there are a number of potential applications aimed at providing more personalised forecasts from the dataset, and it can be fun to hypothesise about some applications.

With access to this data, what could we do?

Perhaps if we took the dataset of all windscreen wiper data and trained a neural network with local information on road closures and flood warnings for a given location, it’s plausible we could develop a model that can predict when these flooding events will occur. This is where data science comes in; which variations of data produce the most reliable results? Perhaps we get better results from cars made in certain years, or from certain manufacturers? Do we get better results if we train the model from ‘upstream’ road users from the day before? I’m not sure what the answer will be, but by utilising techniques from the field of AI maybe we could more quickly arrive at models able to create predictions with real-world applications. 

Similarly, what if we took the temperatures of cars and used them alongside data for air pollution in inner cities? The temperature readings may not necessarily be accurate but perhaps they don’t need to be. As long as the model can correlate the temperatures alongside the trained air pollution levels, it’s conceivable that we could track the temperature and movements of traffic to predict where and when higher air pollution hotspots will appear. This needs to be weighed up alongside future thermistor improvements. Still, even a rough guide of when pollution levels are likely to spike could be useful to individuals wanting to know the best time of day to be out and about. 

How does the time of day affect things, or even the time of year? Should we create targeted models for specific high-value locations - for example, models specific to capital cities, or areas more prone to concerning weather effects?

As with any model there would naturally be an element of experimentation and analysis, and all of this would require strong use of [ML Ops](https://aws.amazon.com/what-is/mlops/) to ensure models were continually refined. Indeed, given the changing nature of car instrumentation, road layouts and usage, not to mention a [shifting climate](https://www.metoffice.gov.uk/weather/climate-change/what-is-climate-change), it might be that any given model state is itself transient, with continual retraining necessary over a given timeframe to ensure it's kept up to date. Ideally, all of this retraining would be automated, pulling in the latest data for a relevant timescale to produce a model that is constantly retraining itself to be as accurate as possible.

I'm spitballing here, and whilst it makes for a fun thought experiment it’s not clear how much is actually being considered or how viable such ideas might be; it’s certainly non-trivial. It would require a vast resource of people able to trial and experiment, working alongside each other to effectively maximise outcomes on what is clearly a very rich but complex area - but who doesn’t love a good problem to get stuck into!

### Is it any better than seaweed?

![png]({{ site.github.url }}/rstrange/assets/car-weather-prediction/seaweed4.jpg)
<small>Photo by [Shea Rouda](https://unsplash.com/@shrouda?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/ocean-smashed-to-sand-during-golden-hour-Ete0zMKPWys?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)</small>

We've already come a long way from [hanging seaweed](https://www.weatherandradar.co.uk/weather-news/can-seaweed-be-used-to-predict-rain--97a9ab88-e630-458c-bbfc-64be26b9a832) to predict rain. 

Still, if all of this talk of car-based weather forecasting feels a little far in the future, I think it’s fair to say that using crowdsourced and vehicular data in weather forecasting is still something being investigated and experimented with. There are a lot of obstacles to overcome, and whether any relevant benefit can be gained from these datasets remains to be seen. 

If these obstacles can be overcome, however, the potential for using this information could be fantastic; maybe the cars we drive will be able to reroute us away from a flooded road before it’s even there, or direct us away from a build-up of air pollution before it occurs, helping to dull the spikes of such and spread the effects more evenly.

Just don’t hold out for it knowing that week’s lottery numbers. 🙂

![png]({{ site.github.url }}/rstrange/assets/car-weather-prediction/car5.jpg)
<small>Photo by [Tim Trad](https://unsplash.com/@timtrad?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/white-jeep-suv-on-gray-rocky-road-during-daytime-CLm3pWXrS9Q?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)</small>
