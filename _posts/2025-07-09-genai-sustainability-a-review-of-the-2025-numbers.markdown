---
title: 'GenAI sustainability: a review of the 2025 numbers'
date: 2025-07-09 11:40:00 Z
categories:
- Artificial Intelligence
- Sustainability
tags:
- Artificial Intelligence
- AI
- Sustainability
- ocronk
- ESG
summary: A year after predicting GenAI's sustainability crisis, the 2024/25 financial
  data tells a concerning story. OpenAI's $10 billion revenue comes with $5 billion
  losses, whilst Anthropic burns $3-4 billion annually. With the sector consuming
  over $100 billion in venture funding and Big Tech spending $250 billion on AI infrastructure,
  we're witnessing what some critics are now calling a "subprime AI crisis" – an entire
  industry built on services sold at massive losses. The transparency initiatives
  from Hugging Face's AI Energy Score and the shift towards open source models (now
  46% of enterprise preference) offer hope for a more sustainable GenAI 2.0 focused
  on efficiency over scale.
author: ocronk
---

Almost exactly a year ago, in July 2024, I published ["Will Generative AI Implode and Become More Sustainable?"](https://blog.scottlogic.com/2024/07/16/the-impending-implosion-of-generative-ai-and-the-potential-of-a-more-sustainable-future.html) warning that brute-force approaches to AI development are fundamentally unsustainable. I predicted that massive energy consumption, escalating costs, and hardware demands would eventually cause first-generation GenAI platforms to "implode under their own weight." Whilst that's not happened yet, the fundamentals haven't changed much, and I still think (and hope) that in the medium term there will be shifts towards more sustainable approaches.

So, twelve months later, we've got some updated financial data and analyst reports to work with. And frankly, the numbers are telling a story that's consistent with the concerns I raised. **[OpenAI has reached $10 billion annualised revenue](https://www.reuters.com/business/media-telecom/openais-annualized-revenue-hits-10-billion-up-55-billion-december-2024-2025-06-09/)**, up from $3.7 billion in 2024, whilst **[Microsoft reports $13 billion in AI-related revenue](https://www.constellationr.com/blog-news/insights/microsoft-q2-azure-revenue-growth-31-ai-revenue-run-rate-13-billion)**. Impressive numbers, but here's the catch: many are projected to be burning $2-5 for every dollar earned. The data I've found suggests that current approaches still face significant challenges, though some monetisation approaches and more efficient models show promise.

In an ironic bit of timing, as I was doing final edits on this piece, [tech critic Ed Zitron published a piece calling this the "subprime AI crisis"](https://www.wheresyoured.at/anthropic-and-openai-have-begun-the-subprime-ai-crisis/) – drawing parallels to the 2007 subprime mortgage crisis, where financial institutions lent far more than they could hope to recover. The analogy is apt: we have an entire industry built on services sold at massive losses, with the assumption that scale will eventually solve the economics. As Zitron puts it, these companies are providing services at such discounted rates that when reality catches up, the entire ecosystem built on top will face serious challenges.

## The uncomfortable truth about unit economics

Let's be brutally honest about what these revenue figures actually mean. OpenAI's journey from $3.7 billion to $10 billion revenue looks spectacular, but [the company loses approximately $5 billion annually](https://www.cnbc.com/2024/09/27/openai-sees-5-billion-loss-this-year-on-3point7-billion-in-revenue.html) against this revenue – that's a 50% loss ratio that would send most traditional software company CFOs into a panic.

It's not just an OpenAI thing, **[Anthropic achieved $3 billion annualised revenue](https://www.reuters.com/business/anthropic-hits-3-billion-annualized-revenue-business-demand-ai-2025-05-30/)** whilst burning through similar proportions of capital. Recent reports suggest [Anthropic hit $4 billion in annualised revenue but expects to lose $3 billion in 2025](https://www.wheresyoured.at/anthropic-and-openai-have-begun-the-subprime-ai-crisis/) – an improvement from a $5.6 billion loss in 2024, though that included "a one-off payment to access data centres." Both companies remain firmly in the camp of "let's try and build AGI and work out profitability later".

[AI consumed ](https://news.crunchbase.com/venture/global-funding-data-analysis-ai-eoy-2024/)**[over $100 billion in venture funding during 2024](https://news.crunchbase.com/venture/global-funding-data-analysis-ai-eoy-2024/)**, representing 80% year-on-year growth. This capital intensity creates exactly the unsustainable dynamic I predicted – companies must achieve massive scale or face inevitable consolidation.

## Big Tech's survival strategies

Microsoft is showing signs of success in "how do we actually make money from this?" as mentioned earlier, with **[$13 billion annualised AI revenue](https://www.pymnts.com/earnings/2024/microsofts-ai-business-surges-set-to-hit-10-billion-milestone/)**. They've embedded AI into existing profitable products rather than trying to invent entirely new business models. Office 365 Copilot subscriptions (around $30 per user monthly), Azure OpenAI services, and that [clever 49% profit share](https://www.fool.com/investing/2024/11/10/microsoft-13-billion-openai-best-money-ever-spent/) from OpenAI operations.

[Google's approach remains rather opaque](https://www.investopedia.com/google-launches-gemini-business-and-enterprise-in-move-to-raise-revenue-from-ai-tools-8598204), even for analysts trying to work out AI profitability. The company's $96.5 billion quarterly revenue includes AI improvements across search, cloud, and workspace products, but try finding specific AI contribution numbers. Perhaps the TPU architecture is more cost-effective, or they are very clever about integration / good at hiding the real costs?

**[Meta represents pure speculation](https://techcrunch.com/2025/04/30/meta-forecasted-it-would-make-1-4t-in-revenue-from-generative-ai-by-2035/)**, investing over $60 billion annually in AI infrastructure whilst generating minimal direct AI revenue. Meta AI's 700 million users look impressive until you realise Zuckerberg himself has said AI won't meaningfully contribute to revenue until beyond 2025. That's a very expensive bet on the future with some pretty wild revenue ($1.4T by 2035!) projections.

[Combined capital expenditure from Microsoft, Google, and Meta approaches ](https://www.reuters.com/technology/artificial-intelligence/big-tech-faces-heat-chinas-deepseek-sows-doubts-billion-dollar-spending-2025-01-27/)**[$250 billion for 2025](https://www.reuters.com/technology/artificial-intelligence/big-tech-faces-heat-chinas-deepseek-sows-doubts-billion-dollar-spending-2025-01-27/)**, primarily for AI infrastructure. Analysts are starting to ask the awkward questions about whether this investment level can generate adequate returns – exactly the kind of financial sustainability concerns I was highlighting last year. The "subprime AI crisis" framing captures this: we have an entire tech ecosystem built on the assumption that AI services will somehow become profitable at scale, despite all evidence pointing to the opposite.

## Chinese efficiency?

Whilst the Chinese market operates under fundamentally different economics, they have been showing signs of the kind of disruption I anticipated from more efficient approaches. **[ByteDance's Doubao costs $0.0001 per 1,000 tokens](https://technode.com/2024/05/16/bytedance-surprises-ai-rivals-with-ultra-low-cost-doubao-model/)** – that's 99.8% cheaper than GPT-4 pricing. [Alibaba's Qwen models price 83% below Western equivalents](https://www.techopedia.com/china-ai-models-83-percent-cheaper-than-us-rivals), whilst DeepSeek offers comparable performance at $0.00014 per 1,000 tokens.

Now, before we get too excited, this pricing isn't purely market forces at work. **[$912 billion in government venture capital funding](https://sccei.fsi.stanford.edu/china-briefs/government-venture-capital-and-ai-development-china)** over the past decade enables Chinese companies to sustain loss-making operations. But here's the thing – the efficiency gains aren't purely subsidised. Chinese companies are focusing on smaller, more efficient models rather than the Western obsession with brute-force scaling. In part due to constraints on US chips but also lower budgets overall.

**[Baidu reports "several hundred million yuan" in AI revenue](https://asia.nikkei.com/Business/China-tech/China-s-Baidu-reveals-first-revenue-from-ai-chatbot-Ernie)** from Ernie Bot, serving 200 million users with 200 million daily API calls. **[Tencent integrates Hunyuan across 180\+ services](https://finance.yahoo.com/news/tencent-using-hunyuan-ai-model-093000179.html)**, including WeChat.

## The environmental elephant in the room

Now let's talk about the environmental sustainability angle, because frankly, the energy numbers that have emerged recently are concerning. Sam Altman recently mentioned (rather unscientifically) that [each ChatGPT query uses about 0.34 watt-hours of electricity – "about what an oven would use in a little over one second, or a high-efficiency lightbulb would use in a couple of minutes" and about 0.000085 gallons of water](https://www.techradar.com/computing/artificial-intelligence/sam-altman-doesnt-think-you-should-be-worried-about-chatgpts-energy-usage-reveals-exactly-how-much-power-each-prompt-uses), roughly one-fifteenth of a teaspoon.

Academic studies suggest OpenAI's figure falls within a reasonable range, with GPT-4.1 nano using 0.000454 KWh and more complex models using significantly more. But here's the math that should terrify anyone thinking about scale: if OpenAI serves 1 billion queries per day at 0.34 Wh per query, that's around 340 megawatt-hours daily. Scale that across all AI providers with further user and autonomous agent adoption, and we're talking about genuinely significant energy demands from inference [(let alone the insane future scale of training models at projected Stargate scale)](https://www.forbes.com/sites/geruiwang/2025/01/24/stargates-500-billion-ai-bet-have-we-forgotten-the-hidden-cost/).

[Research from the University of California, Riverside and the Washington Post suggests ChatGPT already uses nearly 40 million kilowatts of energy per day](https://futurism.com/openai-altman-electricity-ai) – enough to power the entire substantial regions. And that's just one AI service from one company.

The emerging transparency initiatives give me some hope, though. [Hugging Face's AI Energy Score project](https://huggingface.co/AIEnergyScore) is doing exactly what I called for in my sustainability work – creating standardised benchmarks for AI energy consumption. The project offers standardised energy ratings, a public leaderboard ranking 166 (open source) AI models across 10 common tasks, and a 1- to 5-star rating system similar to household appliance efficiency ratings.

This kind of transparency is crucial because initial results show the spread between models differs dramatically by task – from a factor of 5 difference for image classification up to a factor of 50 for text generation between most and least efficient models. These aren't marginal differences – they're orders of magnitude variations that directly impact both cost and environmental sustainability. Pushing the commercial model providers to also engage in this level of transparency is going to be crucial (as I discussed with [Boris Gamazaychikov](https://www.linkedin.com/in/bgamazay/) recently at a client event on AI sustainability.

![Panel-image.jpg](/uploads/Panel-image.jpg)

## What the profitability forecasts actually tell us

Investment banks are showing surprising consensus around timing, even if they disagree on the scale of returns. **[Morgan Stanley projects 34% contribution margins by 2025](https://www.morganstanley.com/insights/articles/genai-revenue-growth-and-profitability)**, with total GenAI revenue reaching $153 billion. [McKinsey suggests ](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier)**[$2.6-4.4 trillion annual economic impact](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier)**, though only 1% of companies have achieved "AI maturity" despite widespread adoption.

I also found it interesting that: **[BCG surveys reveal 75% of executives naming AI as a top-three priority for 2025](https://www.bcg.com/publications/2024/what-gen-ais-top-performers-do-differently)**, expecting 60% higher AI-driven revenue growth by 2027. Yet only 25% report creating significant value from AI initiatives. That gap between expectation and reality? That's consistent with what I suggested might cause the first-generation approaches to face challenges.

## The structural problems aren't going away

The path to profitability faces structural challenges that validate the concerns I raised last year. **[Training costs for next-generation models approach $1 billion](https://www.bigdatawire.com/2025/04/03/genai-investments-accelerating-idc-and-gartner-say/)**, whilst data centre requirements expand from 50-200 megawatts to over 1 gigawatt. These infrastructure demands create exactly the unsustainable resource consumption trajectory I warned about.

**[Average AI engineer compensation reaches $925,000](https://www.bain.com/insights/ai-the-ambitions-are-bold-but-the-talent-is-scarce-snap-chart/)** at leading companies. That's not a typo. When your people costs approach $1 million per engineer, your burn rate calculations start looking very different indeed. For me, engineers being paid these sorts of sums is a massive red flag of a bubble; it also somewhat undermines arguments about the reducing value/demand of human intellect (albeit for a niche skill).

**[Open-source alternatives now capture 46% of enterprise preference](https://a16z.com/generative-ai-enterprise-2024/)**, up from 20% in 2023. This shift undermines pricing power for proprietary models – the sort of commoditisation pressure I expected would emerge as the technology and market for it matured.

## Looking ahead: efficiency over scale

The financial data supports my analysis from last year that current GenAI approaches face fundamental sustainability challenges. **OpenAI's $10 billion revenue alongside $5 billion losses** illustrates the sector's core problem – revenue growth struggling to outpace infrastructure costs using brute-force scaling approaches.

However, the successful models emerging align with some of the patterns I mentioned last year. Microsoft's integrated approach generates sustainable revenue by embedding AI into existing profitable products. Chinese companies achieve dramatic cost reductions through more efficient architectures. I've not really seen as much movement on the hardware efficiency side as I'd hoped - there are small players like [Fractal](https://fractalweb.app/) pushing for a distributed computing model, and the use of more TPUs over GPUs continues to be discussed. Although, as I was about to hit publish, I came across this story: [OpenAI says it won't ramp up Google's TPUs despite early tests. The Microsoft-backed AI outfit confirmed it's trialling some of Alphabet's tensor processing units but has no plans to deploy the chips at scale](https://ca.finance.yahoo.com/news/openai-passes-googles-tpus-now-142700813.html). Regardless, I see massive potential for hardware optimisation and more pragmatic, medium and smaller models.

My research suggests **2026-2027 as the critical period** when unsustainable approaches face market correction, whilst efficient models achieve profitability. Companies that transition from general-purpose scaling to specialised, integrated solutions will likely survive the consolidation that seems increasingly probable.

The transparency initiatives from organisations like Hugging Face give me hope that we can measure and manage the sustainability challenges. Their call for enterprises to "apply pressure through their customers" and integrate environmental transparency into procurement processes represents exactly the kind of market-driven sustainability pressure I believe will drive the transition to a more sustainable GenAI 2.0.

The $1 trillion in projected AI investment might generate returns, but likely for companies that move away from the current brute-force approach in favour of more efficient, integrated architectures.

And frankly, this shift from the hype bubble back to the pragmatic real world can't come soon enough. The current burn rates, energy consumption, infrastructure demands and over-promising represent exactly the kind of unsustainable trajectory that needs correcting.

As the financial sustainability of major AI providers becomes increasingly questionable, open source models offer a compelling alternative – providing organisations with certainty and control when commercial providers start looking shaky. The 46% enterprise preference shift towards open source I mentioned earlier isn't just about cost; it's about reducing dependence on companies burning billions annually with no clear path to profitability. When your AI strategy relies on a centralised provider that might not exist in their current form (or level of service) in two years, open source will probably start looking more compelling?

My hope for the future of AI is that it lies not in bigger language models requiring more power, but in diverse, smarter, more efficient approaches that deliver real value without breaking the bank – or the planet. Based on our experiences of using the tech, I would wager that pragmatic use of deterministic logic and neurosymbolic approaches will come back into fashion. Going some way to caging this beast that's been created, saving reputations and balance sheets along the way...