---
published: true
author: acarr
layout: default_post
summary: "What started as one faulty gas reading in the summer of 2017, ended up as a series of wasted calls where my bill kept getting higher and higher until it reached £11k.  How could this have been handled faster and left me without considering moving energy provider."
categories:
  - Data Engineering
title: 'The £11k gas bill, customer satisfaction and improved interactions'
---
It all started with a faulty reading in the summer of 2017.  I say faulty reading, it was an inspector from the energy company who came round to read my meter, and somehow instead of reading something in the region of 5068 (my last estimate), the inspector entered my reading as 9236.

This one incorrect reading caused my end of year bill to be over five thousand pounds.  Five thousand pounds?  I live alone!  I can’t even begin to calculate how many roast dinners, showers and radiators on full blast I would need to achieve to get that as a bill.

Obviously seeing the five thousand pound bill, I decided to phone up my energy company, who shall remain anonymous, as I suspect it could have happened to many of them and to be fair to them they did try and resolve the problem quickly, their systems just made it hard for them.

![Screen Shot 2018-07-15 at 07.22.43.png]({{site.baseurl}}/acarr/assets/Screen Shot 2018-07-15 at 07.22.43.png)

But at first they were adamant, no mistake had been made, as one of their inspectors had come round to read my meter.  Even though clearly they are human, and had to enter the reading into their system manually.

![Screen Shot 2018-07-15 at 07.39.24.png]({{site.baseurl}}/acarr/assets/Screen Shot 2018-07-15 at 07.39.24.png)

![Screen Shot 2018-07-15 at 07.40.39.png]({{site.baseurl}}/acarr/assets/Screen Shot 2018-07-15 at 07.40.39.png)

I tried to point out, that clearly even according to their calculations I had used 22,605 kWh for the same period this year, what was the chance that I had used 89,494 kWh this year?  To put this into context, energy industry figures say an example of high usage would be 4 or 5 students sitting around all day in a large four bedroom house and they could typically rack up usage about 19,000 kWh of gas per year.

This means they believed I has used the equivalent of 23.5 students sitting around my house all day trying to eek out as much gas from the network as possible.  

![gatmeter.jpg]({{site.baseurl}}/acarr/assets/gatmeter.jpg)

A few tense phone calls later and the energy company admitted this probably wasn’t what had happened and accepted my new meter reading of 5624.  Hurray, the end of the large bill, or so I thought.  Unfortunately due to the fact the bill generation is done nightly in what is typically called batch processing - the helpful assistant and I couldn’t see whether the new entered meter reading would reset my bill to a much more wallet friendly level.

So I woke up in the morning to see the new fixed bill.  I didn’t get my wish.  My new bill was for £11,867.60 - almost £12k, £12k for a yearly gas/electricity bill.  My bill hadn’t gone down, it had more than doubled.

![Screen Shot 2018-07-15 at 07.59.16.png]({{site.baseurl}}/acarr/assets/Screen Shot 2018-07-15 at 07.59.16.png)

Right I thought, I’m in IT, I can work out what is going on.  And low and behold, I did.  The bill calculation engine had decided I had used gas from the meter point 5068 to 9236.  When the nice customer service assistant managed to add a new reading of 5624, the billing system had then decided I must have continued to use gas from 9236, the meter then wrapped around to 0000 and then I had used enough gas to get back up to 5624.  Thus giving me a huge bill of almost £12k.

I then phoned back the nice customer service assistants again and explained what was going on.  The next three days of calls mostly involved sympathy, agreements on what was the issue, and attempts to fix it by trying different things out.  Due to this nightly batch processing every time they tried to fix it, we had to wait until the next day to see the results.  If they had moved to a more modern software architecture like streaming, we would have seen the changes instantly and this would have reduced the cycle to fixing it in one day.  A good example of a modern streaming architecture is the faster payments system we have now in the UK.  A payment made via faster payments takes minutes compared with several days when cheques are cleared.

![cheque.png]({{site.baseurl}}/acarr/assets/cheque.png)

While Batch architectures have been common for many years, a lot of companies are moving over to Streaming Architectures because they enable new features not available in Batch processing, but also because everything happens faster, and the people expect instant or very quick responses and results nowadays.  Old Batch systems typically just can’t support that.

So after all those calls my bill was fixed, but not after a few more stressful mornings of checking my bill to see what had changed, the good news it turns out the energy company owes me money, around £800 to be precise.  And to answer the question will I stay with this energy company?  I’m still deciding, although several people have told me they would move.  I’ve got my fingers crossed that they will move to a streaming architecture soon so any future interactions happen faster, and if they would like some help to achieve that I hope they know where to find me (without my 23.5 students).

