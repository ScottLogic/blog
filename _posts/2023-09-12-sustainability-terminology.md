---
title: A guide to Software Sustainability terminology
date: 2023-09-12 00:00:00 Z
categories:
- Tech
tags:
- Sustainability
summary: You think software has enough variables, right? Well there is another one
  that has become a big consideration when designing, developing and deploying software
  and its name is Sustainability. This area of consideration comes with its own terminology
  and with this blog post I hope to shed some light onto the nomenclature. So when
  someone comes up to you and says  "I want to design a sustainable, carbon aware
  system that focuses on reducing the operational carbon of my business but also minimises
  embodied carbon", you will know exactly what they are looking for!
author: jhowlett
image: "/uploads/software%20sus.png"
---

### You think software has enough variables, right?
 
Well there is another one that has become a big consideration when designing, developing and deploying software and its name is Sustainability. This area of consideration comes with its own terminology and with this blog post I hope to shed some light onto the nomenclature. So when someone comes up to you and says  "I want to design a sustainable, carbon aware system that focuses on reducing the operational carbon of my business but also minimises embodied carbon", you will know exactly what they are looking for!

## Generic terms

These are terms that are the foundation of sustainability and apply to all sectors. If you know the basics of sustainability you may already be aware of these

* **Greenhouse Gases (GHGs)** - These are gases that amplify the greenhouse effect, the effect caused by trapping energy from the sun within the Earth’s atmosphere. Examples are the well known Carbon Dioxide (CO2) emitted from electricity generation and other lesser known gases like Methane (CH4) sourced from office catering production and disposal and hydrochlorofluorocarbons (HCFCs) used in office cooling systems.

* **Greenhouse Effect** - The warming effect due to greenhouse gases. This happens because incoming shortwave radiation from the Sun passes through GHGs but the longwave radiation that is emitted by the heated Earth is absorbed by GHGs insulating the Earth from heat loss to space. The net effect is the slow warming of the atmosphere as the concentration of GHGs increases.

* **Climate Change** - The long term change in average weather patterns which is part of the natural life cycle of the Earth and is being accelerated by human related activities like burning fossil fuels.

* **Carbon Neutral** - Negating the carbon emissions of your direct and indirect emissions. This is done by either reducing or offsetting your current carbon emissions. Reducing should be the first action you take and then any sources of emissions that are unavoidable can be offset using schemes that absorb CO2. These schemes include reforestation and solar energy installations. 

* **Net Zero** - A standard designed by [The Science Based Targets initiative (SBTi)](https://sciencebasedtargets.org/) which takes carbon neutrality to the next level by ensuring businesses reduce their emission by 90% by only allowing them to offset a maximum of 10% of their emissions. It can be applied to CO2 only or to all GHGs. 

* **Operational Carbon** - CO2 emissions due to the operational phase of software, this phase includes the hosting and use of software. So sources of emissions include the energy needed to keep your servers on, energy needed to keep end user devices running and energy needed to transfer data from your server to the end user’s device.

* **Embodied Carbon** - The CO2 emitted from all processes that are not directly related to operations and keeping the software up and running. This includes the manufacturing and transporting of hardware and the planning, designing and maintaining of the software. Embodied emissions take up an even larger portion of the total emissions in software compared to other sectors. These emissions are much harder to quantify as they are indirect and usually require business to interact and retrieve emissions data on purchased products.

* **Emission Scopes** - You can think of emission scopes as how directly related your emission sources are to your actions but it doesn't mean they are any less significant or harmful to the environment. The higher the number, the less direct the emission.

  * **Scope 1** - Includes all direct emissions that are generated from sources that are directly owned or controlled by an organisation. For a software company there is a very small list of sources but it is not empty. It can include any emissions from fossil fueled hire cars used to visit customers and emissions from refrigerant leaks found in A/C & fuel burnt in heating systems within offices.

  * **Scope 2** - Includes all indirect emissions from the generation of the electricity purchased and used by an organisation at local or international sites. This is a much larger list for a software company. The most prominent is the electricity produced to run computers, office lights and office A/C and heating systems.

  * **Scope 3** - Includes all indirect emissions that occur in an organisation’s value chain. The largest and hardest to quantify because it relies on suppliers to provide detailed breakdowns of a product’s carbon footprint. This scope includes areas like emissions from cloud infrastructure and the embodied carbon of computer hardware.

* **Carbon Intensity** - The amount of carbon emitted per unit of electrical energy of a country/region’s grid. This varies not only with geographical location but also with time as it depends on the proportion of renewable energy sources which have highly variable output depending on the wind/waves/sun/rainfall at any point in time. There are two methodologies for calculating this:

  * **Location Based** - This method only considers the carbon intensity of the local grid and ignores the electricity mix purchased from suppliers.

  * **Market Based** - This method considers the electricity you have purchased from your suppliers which could be green energy tariffs that leverage Renewable Energy Certificates (REC) and Guarantees of Origin (REGO) allowing benefits in reporting for companies that source their electricity more sustainably. 

* **Marginal Carbon Intensity** - The carbon intensity of the extra electricity that was produced to meet the change in demand due to the load of a piece of software. It is a way of analysing the optimal time and location of carbon aware applications. Within a grid’s energy sources, there is a base load of fossil fuel or nuclear energy and a mix of fluctuating renewable sources. It is widely seen that to meet an increase in demand there are two methods, pausing the curtailment of sustainable energy sources or increasing the base load of a fossil fuel source.

* **Carbon Dioxide Equivalent (CO2e)** - As a way of quantifying the effect of all GHG emissions emitted CO2 is used as the baseline. Some GHGs are more potent and others are less. For example R-410A, one of the most common refrigerants used in AC units, is 2,088 more potent than CO2 therefore a leak of 1 kg of R22 is the same as a 2 tonne leak of CO2.

* **Kilowatt Hour (kWh)** - A standardised unit of measurement for energy that many cloud service providers and carbon emission calculating tools use. It equates to a 1kW machine (roughly 25 laptops) running for 1 hour, which is the equivalent to 3,600,000 Joules.

## Software specific terms

These are terms that you will predominantly find in software sustainability and so you may not have heard of these before.

* **Sustainable Software** - Software that can continue operating for a prolonged period of time without harmful effects on the environment and society. Possible sources of harm for software are air quality, biodiversity, human poverty and equality.

* **Green Software** - This term can have two meanings. The first and most used is for software that is designed to help the environment. So an app that is aimed at reducing food waste would be classed as green software. There is also another meaning that can be derived from the definition of ‘Green Energy’ which is a piece of software that has not harmed the environment during its development and operation.

* **Software Carbon Intensity (SCI)** - A methodology developed by the [Green Software Foundation](https://greensoftware.foundation/) to help calculate and track the impact of software, it is designed to be widely applicable and calculatable with a bias towards actions that eliminate carbon emissions. It considers both operational and embodied carbon and has a scaling factor (R) that allows for a value that is independent of the size of the system which could be for example per transaction or per user. The inclusion of embodied carbon ensures that this value can never reach zero but gives a value that can be tracked to validate improvements over time.

  ~~~
    SCI = (E*I) + M per R
	
    E = Energy consumed by software (kWh)
    I = Carbon intensity (gCO2/kWh)
    M = Total embodied carbon (gCO2)
    R = Functional unit
  ~~~

* **Energy Efficiency** - The efficiency of software with respect to how much energy it consumes, the higher the energy efficiency, the less electricity consumed. If the system is run on fossil fuel derived electricity then the higher the efficiency, the less emissions emitted by the software. It can be seen as the operational efficiency of software

* **Hardware Efficiency** - The efficiency of software with respect to how much hardware is required for it to be operational. The higher the hardware efficiency, the less emissions emitted to manufacture and transport the required hardware. It can be seen as the embodied efficiency of software.

* **Carbon Awareness** - An emerging sustainable design principle for software. Because carbon intensity fluctuates with time and region (see the definition of ‘Carbon Intensity’) you can design software that measures and/or predicts when and where the electricity grid is cleanest and can schedule time-insensitive tasks to run during these periods. Think of overnight backups, batch sending of newsletters or training of ML models. These can be delayed a few hours and not harm or delay the delivery or promotion of new products.

* **Power Usage Effectiveness (PUE)** - A factor that describes how efficient a data centre is, it is the electrical energy fed into the computer hardware over the total energy drawn from the grid. Sources of inefficiencies can come from lighting, cooling and even the kettle in the staff kitchen. 

* **Data Center infrastructure Efficiency (DCiE)** - It is really just the reciprocal of the above PUE that can give the value as a percentage (if multiplied by 100), it can be used to simplify equations for determining the total energy used by your software.

## Good to Know

These are terms that do not directly relate to software but you may hear in your conversations regarding sustainability

* **Fossil Fuel** - A natural fuel that is formed by the remains of animals or plants that lived in the past. This fuel is not quickly produced, much slower than the rate of extraction, and the burning of them results in the re emission of carbon that was stored within the remains of the organisms leading to GHG accumulation in the atmosphere. These two points make this type of fuel nonrenewable and unsustainable.

* **Renewable Energy** - A source of energy derived from natural sources whose reserves are replenished at a higher rate than its consumption. Examples of renewable energy are wind, solar and geothermal. This does not mean that they are sustainable, if we extracted oil at a slower rate than their reserves were replenished it would count as a renewable energy source even if the CO2 emissions are accelerating climate change.

* **Sustainable Energy** - A source of energy that can be relied upon for an extended period of time. To ensure an energy source is sustainable many different factors must be taken into account, from possible negative impacts on the natural world (biodiversity loss due to forest clearing for biomass production) to negative health impacts on humans (air pollution from burning fossil fuels).

* **Green Energy** - A source of energy that does not harm the environment, this is an idealised source that currently does not exist. I make this statement because you may think that wind is green as it does not emit any harmful gases to generate electricity however the construction, transportation and disposal of the turbines that are required to harness this energy do emit mass amounts of emissions and destroy wildlife and habitats.

* **Paris Agreement** - A legally binding international treaty on climate change with the goal of preventing “the increase in the global average temperature to well below 2°C above pre-industrial levels” and pursue efforts to limit the temperature increase to 1.5°C above pre-industrial levels.”

* **Greenwashing** - Definitely not something you want to be associated with, it is the act of marketing or presenting your organisation as beneficial to the environment however actually hiding the truth. This can be done by making unsubstantiated environmental claims, hiding or downplaying your most heinous environmental acts or even just overselling your environmental gains to aid in consumer buy-in.

* **Sustainable Development Goals (SDGs)** - A list of [17 interlinked objectives](https://sdgs.un.org/goals) adopted by the United Nations in 2015 aimed at ensuring people and the planet prosper now and in the future. They aim to do this by solving core problems like human poverty and diseases while also preserving biodiversity and a healthy planet so that future generations have a plentiful Earth for sustaining themselves.

* **Carbon Offsetting** - If sources of carbon emissions cannot be removed entirely as they are out of your hands, for example the energy supply to your servers. Carbon offsetting is a way to counteract these emissions by capturing them using alternative methods. It is usually done by participating in schemes like tree replantation and capturing methane emissions and turning them into sources of electricity.

I hope these definitions aid in your comprehension and articulation of software sustainability  because as the field grows and more people are talking about it, it becomes ever more important to ensure that we understand each other. If there is not wide knowledge of the vocabulary then we will end up misinterpreting each other and producing software that is not fit for purpose. Wasting precious resources on redundant software only makes the software industry more unsustainable.