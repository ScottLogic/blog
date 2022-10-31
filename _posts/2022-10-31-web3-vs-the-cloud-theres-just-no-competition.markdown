---
title: Web3 vs the Cloud, there's just no competition
date: 2022-10-31 08:39:00 Z
published: false
categories:
- Tech
- ceberhardt
author: ceberhardt
---

There are a growing number of voices heralding Web3 as the future of the internet, and this technology (concept?) is receiving considerable coverage at conferences, in the technology press, and internet forums. I decided it was time to put Web3 to the test and see how it fares against the contemporary approach to building apps - the public cloud. Unfortunately I found Web3 to be very lacking.

This blog post takes the engineer's perspective. I took a service that I already run on AWS, ported to Ethereum, and ran it for a week, to understand first-hand how this technology fares. This article goes into the details, but here are some brief highlights:



* **Ethereum is ridiculously expensive **- it costs x100,000,000 to run my app on this network versus running on AWS
* **Running costs are unpredictable** - you’re at the mercy of both fluctuating gas prices, and the token exchange rate
* **You can get priced out of the market** - in the extreme case of the above, if demand is high, you can get priced out of the network
* **Migration is very expensive** - migrating to a new contract involves transferring all your contact state, this is a very expensive part of the process
* **It’s not really decentralised** - the great promise of Web3 is false, nothing in this technology ensures you yield control to your users.
* **Web3 itself is fragmented **- there is no single Web3 implementation and there are limited standards. As a result, you pick you blockchain (and token / currency)
* **Web3 lacks many of the conventional infrastructure concepts **- the most basic cloud services, e.g. logging, firewalls, API gateways lack Web3 equivalents
* **Web3 still needs Web2** - Web3 applications still use a bucketload of Web2 technology
* **Wallet UX** - Wallet software is really hard to use, and is a long way from being ready for mainstream use
* **Fragmented tooling** - There are so many different toolchains, API layers, etc .. selecting an appropriate set of tools is a complex challenge.
* **Security concerns** - deploying to a blockchain requires an account with funds, this is a clear target for supply chain attacks
* **Testnets are unreliable** - deployment to testnet is a vital part of the development process, however, they are often unreliable

Given the above, I would not consider Web3 a viable alternative to public cloud at the moment. In fact, I seriously doubt it ever will be. I do not buy into the notion that this will be the next ‘big thing’ or that it is the future of the web. 

Personally my feeling is that Web3 is simply a blockchain rebrand, giving this hyped technology another roll of the dice. I’ve also come to realise that there is something quite unique about Web3 / blockchain. With all other technologies that are experiencing some level of hype, low-code for example, the only parties that stand to benefit significantly from the hype are those who are actively investing in the technology itself, building products and solutions. Web3 / blockchain is unique in that the tokens (e.g. bitcoin, ETH) that are central to making the networks operate allow _anyone_ to benefit from hyping the technology. No need to invest effort, you just invest money. This has caused a wave of technology hype unlike anything we’ve ever seen before.

Anyhow, I promised that this blog post would be more engineering-focussed, so let’s get back to business.


## Web3 and blockchain primer

Let’s start with a very brief Web3 primer, you can skip this if you’re already familiar with the term.

Web3 was initially coined by one of the Ethereum co-founders in 2014 as a term to describe the next iteration of the web, where we no longer have to place our trust in private entities to protect our personal data. It’s easiest to understand the relevance by looking at the previous ‘version’ of the web (as [described by Ethereum](https://ethereum.org/en/web3/))

The early internet was **Web1 (1990-2004)**, and described as “Read-only”. While the more technically minded users (like myself) ran our own web-servers, most of the people interacting with the web consumed content but didn’t create or contribute to the web.

**Web2 (2004-now) **is described as “Read-write”, where people create content almost as much as they consume it. However, people aren’t creating their own websites, they are instead creating content within the walled-gardens of the social media or content platforms (e.g. Facebook, Twitter, Medium). This has led to a situation where a small number of private entities have control over much of the content (and personal data) we share. Furthemore, they often use advertising for generating revenue, which means that they are incentivised to hoard and capitalise on our data.

**Web3 (the future)** is “Read-Write-Own”, where people retain control over their data. At its core it uses blockchain technology, with the promise of being decentralised, permissionless and trustless. We’ll return to these at various points within this blog post.

In a more practical sense, Web3 sees the internet becoming a network of applications (distributed apps, or dApps), written as smart contracts, running on a public blockchain.

Web3 is fundamentally blockchain technology, which probably means we need a blockchain primer too … I’ll keep that even more brief.

Blockchains are a novel combination of various pre-existing technologies. The first is a [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree) (or has tree), an append-only data structure that uses hashing to ensure the integrity of the data. This tree is replicated across the nodes in the blockchain network. The second is [public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography), which in blockchain is used as a way to ‘control’ an account on the network by holding the private key.

The interesting part of blockchain is that it combines hash-trees and public-key cryptography with a novel consensus mechanism (through burning lots of energy!) that ensures transactions are correctly processed without the need to trust the nodes within the network. This is what made bitcoin unique, a network of computers, operating without any trusted intermediary, that are able to safely process financial transactions. This is the one unique feature of bitcoin, Ethereum and all the other blockchain networks.

Whilst this may sound like a wonderful idea, it has some significant issues. To learn more, I’d thoroughly encourage you to [listen to this interview with Dr Nicholas Weaver who lectures on this subject](https://www.youtube.com/watch?v=abcKL_x_aoA). As stated previously, I’m going to try and stick to the engineering in this post.

That’s the primer out of the way, let’s get back to the task of building a service using Web3 technologies.

## Applause Button

Almost every article or tutorial I’ve read about Web3 involves building NFTs (non fungible-tokens) apps and marketplaces. Personally I’d like to see how it performed when tackling challenges that are not directly related to blockchain technology itself. Although, if you are interested in the NFT development experience, I’d thoroughly recommend Moxie’s article, [My first impressions of Web3](https://moxie.org/2022/01/07/web3-first-impressions.html).

For my Web3 experiment, I wanted to pick a service that I already run on public cloud infrastructure, and try using Ethereum for real. I opted for [Applause Button](https://applause-button.com/):

![applause-button.png](/uploads/applause-button.png)

These days most blogs use static site generators, and as a result, they lack a conventional database. I wanted to add a feature to our blog that allows users to ‘clap’ for articles that they appreciate. In order to achieve this I built a simple service that connects a web component to an AWS-hosted back-end (using Lambda, API Gateway, DynamoDB) that tracks clap-counts for URLs: 

```
<applause-button style="width: 58px; height: 58px;"/>
```

I decided to both open source the project ([client code](https://github.com/ColinEberhardt/applause-button), [server code](https://github.com/ColinEberhardt/applause-button-server)), and provide a free hosted service. Applause Button is currently used by ~3,000 websites and records ~500,000 claps each year. To support the hosting, I run an [open collective](https://opencollective.com/applause-button), and have a handful of generous backers.

How would this service work on Web3?

The current implementation is centralised, in that I have all the control. If I wanted to adjust the clap count for any of the 3,000 sites using this service, I could just pop into the Dynamo database and make that change.

Moving to Web3, the logic that increments clap counts for each URL, plus the current state, would all reside on the blockchain as a smart contract. This decentralised approach would mean that I, as the creator, have no power to change the rules or adjust the data once deployed.

This feels like a service that should benefit from being moved to Web3.

Furthermore, at the moment this service costs me money to run, which I cover for the most part, via donations. Web3 gives the opportunity to have others fund the contract execution, perhaps allowing me to remove the need for donations altogether.

Even better!

## Migrating to Ethereum

The Web3 version of Applause Button involves turning the core logic into a smart contract. For Ethereum, these are written using Solidity, a language specifically designed for the Ethereum network. Some other blockchains use more established programming languages (e.g. Rust).

Thankfully the logic required for my contract is really quite simple, which meant I didn’t need to properly learn the language. Here it is in its entirety:


```solidity
pragma solidity ^0.8.9;

contract ApplauseButton {
 mapping(string => uint) private clapCounts;

 function getClapCounts(string memory _url) external view returns (uint) {
   return clapCounts[_url];
 }

 function updateClaps(string calldata _url, uint _claps) external returns (uint) {
   require(_claps > 0, "clap count must be greater than 0");
   require(_claps <= 10, "clap count must be less than or equal to 10");

   uint clapCount = clapCounts[_url];
   clapCounts[_url] = clapCount + _claps;
   return clapCount;
 }

 function setClaps(string[] calldata _urls, uint[] calldata _claps) external  {
   for (uint i=0; i<_urls.length; i++) {
     clapCounts[_urls[i]] = _claps[i];
   }
 }
}
```

You can see that the ApplauseButton stores its state via the `clapCounts` variable which is a map from strings (i.e. the URLs) to integers (clap counts).

The three functions allow you to interact with the contract and retrieve or update its state.

The tooling for developing smart contracts is reasonably good, I used [truffle](https://github.com/trufflesuite/truffle) to compile and deploy the code, and [web3.js](https://github.com/web3/web3.js) on the client-side to communicate with my contracts. For local development I used [ganache](https://trufflesuite.com/ganache/), which allows you to run an Ethereum-compatible blockchain locally.

This local development stack allows you to get the hang of the basic concepts, which differ considerably from conventional public cloud development. 

Code that executes on the blockchain runs on the Ethereum Virtual Machine (EVM), and each operation that is executed consumes ‘gas’, which has to be payed for using the currency of the respective blockchain, which in the case of Ethereum is ETH (pronounced _eeth_). As a result, any interaction with the blockchain that updates its state, including deployment of contracts, must be paid for via a suitably funded account.

One concern I have here is that this results in a tight-coupling between the development process and the financial / billing process. With public cloud providers these are two separate roles, the developer and the financial controller. This allows you to protect your billing information and minimises individuals who have direct control over this. By coupling the two, you lose separation of concerns, which is not good for security.

To put it another way, if I was looking for a potentially lucrative supply-chain attack, I’d target truffle! The users of this toolchain will almost certainly have private keys for funded blockchain accounts available on their local system. You couldn’t say the same for their AWS accounts for example.


## Moving to a testnet

Once you have a smart contract working locally, the next step is to deploy it to a testnet. This is an important step that allows you to better understand the genuine supply / demand dynamics that exist in the blockchain world. This has an immediate impact on your application, where contract execution time can be quite volatile (and slow).

Ethereum has a number of testnets and I opted for [Goerli](https://goerli.net/). Moving to a testnet resulted in a number of additional challenges …

In order to deploy to the testnet, you need a funded account. This is a straightforward process, where Goerli ETH are given away via [faucet](https://goerlifaucet.com/), however, this is a limited resource. I have seen people posting on forums [pleading for more ETH as they’ve run out and need to deploy for a demo](https://www.reddit.com/r/ethdev/comments/ydcf0f/goerli_gas_out_of_control_unable_to_test_contracts/)!

I also found the testnet to be a little unreliable, with random failures and congestion issues. For something which is a critical part of the development process, I’d hope for something more reliable.

The next challenge that the testnet presents is how to connect to it? My application is browser-based, so I need to have an HTTP or Websocket connection to _something_. While developing locally I was able to connect directly to ganache from the client. However, this isn’t possible with the testnet (or the Ethereum mainnet). In order to connect, you either need to run your own Ethereum node locally (which I’m not keen on doing, as this costs thousands of dollars), or connect via an intermediary.

There are two main intermediary services. I opted for [Alchemy](https://www.alchemy.com/). These provide a conventional SaaS-style experience, I configured an ‘Applause Button’ app, and in return Alchemy gave me app-specific URLs that allows me to connect to the blockchain network. They also provide various value-add services, including metrics and reporting.

It’s a useful (in fact vital) service that they provide. However, I can’t help feeling that this is somehow a contradiction of the whole decentralisation that Web3 represents. To deploy an app to this network I am now entirely reliant on a third-party … do I trust them? I guess I’ll have to.


## The cracks emerge in my Web3 dream

Every interaction that changes the state of the blockchain burns gas, which must be paid for. All the Web3 applications I’ve used (NFTs of course!) require the end user to pay this fee. This is achieved by having a cryptocurrency wallet application where you can approve (and sign) transactions. I used [MetaMask](https://metamask.io/) which is one of the most popular wallets that you can install as a Chrome Extension. 

I must admit, I found MetaMask pretty confusing, it does little to hide the complexities of blockchain technology. If Web3 is going to go mainstream, this has to become a lot simpler. I can’t imagine anyone who is not a technology professional being able to use MetaMask, and by extension Web3 apps, at the moment. A [quick Google search](https://www.google.com/search?q=metamask+ux) shows that I am not the only one to share this view.

However with the Applause Button I don’t want the end user to pay the bill. With this service there are three primary actors:



* Service provider - that’s me, I provide the Applause Button service and the infrastructure that supports it
* Service users - the (currently 3,000) people who use Applause Button on their website
* End user - the millions of people who visit websites that use the Applause Button

For this service, I’d like the Service Users to pay the bills for their consumption - which is what I currently do via the donation system.

Unfortunately, with Ethereum the party that invokes the contract is responsible for payment, which is the End User. There is unfortunately no way around this. The best work-around I’ve found is that you can create a contract that credits the account which invokes the contract, basically paying them back for the consumed gas. However, this would still require that every single person (End User) who interacts with the Applause Button has a crypto wallet with some credit (ETH). This isn’t going to work.

There is one other option that I briefly explored, meta-transactions; transactions that contain other transactions. This would allow me to partially solve the problem, with the End User signing the transaction, sending it to a relay contract that pays for the contract execution.

Rather than tackle this complex challenge myself, I found there are third-party service providers, such as the [Ethereum Gas Network](https://docs.opengsn.org/) (EGN) that provide this relay capability. However, I have some concerns about this process.

It appears that the EGN concept first appeared in the form of Tabookey, which [ran out of gas](https://medium.com/tabookey/tabookey-out-of-gas-donates-ip-to-community-20b8a5fcb7e7) and ultimately folded. Will EGN suffer the same fate? Should I make this a critical component of my solution?

Also, by adding EGN, similar to the use of Alchemy, my application would feel even less decentralised. 

So instead of using EGN I opted for the simpler solution, I added a simple AWS Lambda function layer in front of my Ethereum based smart contract. This Lambda function signs transactions (using my funded account), ensuring that the End User doesn’t have to use a wallet and doesn’t have any idea that this is running on a blockchain.

This is all a bit disappointing!

Anyhow, time to get this thing deployed to the Ethereum mainnet, so that I can tell people I’m a bona fide Web3 / blockchain engineer 😎


## Deploying to Ethereum (or not)

Moving to the mainnet should be quite straightforward, with Alchemy it is a trivial task to point your application to a different blockchain. All I need to do is get my hands on some ETH, and use a fully funded account to deploy. Ahead of this, I wanted to consider the costs.

The testnet reports the gas consumption for contract deployment and invocation. For my very simple contract, the deployment process consumes 591,037 units of gas. Determining how much this would cost on the Ethereum mainnet involves a couple of factors:


* The current gas price on the network itself. This is a dynamic quantity based balance of supply (nodes providing the compute power of Ethereum) and demand (contract developers, like me). Furthermore, the price you are willing to pay has an influence on whether your contract is executed and how soon.
* The value of Ethereum itself. This is the unit of currency that you use to pay for gas. Its value fluctuates just like any other currency - only with this being cryptocurrency, the fluctuations are pretty wild!

Based on a current gas price of ~25 gwei (one-billionth of an ETH), the contract deployment costs 14,775,925 gwei. At the current exchange rate, this is $22 USD.

Yes, that’s right - $22 just to make a single deployment of an incredibly simple smart contract.

Wow.

I also calculated how much it would cost when an End User clicks the button and the clap count is updated. This is roughly $1.10, which is frankly an insane amount.

How does this compare to the current costs? It is around x100,000,000 more expensive.

Even worse is the migration costs. Before running the Applause Button I need to update the contract state with the clap counts for the ~1000 posts on this blog. This would cost around $200 (for a mere 59KBytes of data).

Whilst I was keen to run my experiment on Ethereum, there was no way I was going to pay 1000s of dollars in pursuit of this.


## Running on Polygon

Recently Ethereum moved from proof of work (i.e waste lots of energy), to proof of stake, with a promise that this would significantly increase the network's ability to execute transactions. I’d hoped this would start to drive-down prices, but there is no indication of this yet.

The ‘standard’ approach to the Ethereum cost problem is to use a side-chain (or level-2 network), a secondary blockchain that processes transactions, at a reduced cost, periodically committing transactions back to the main Ethereum network.

After a quick review of the options, I opted for Polygon. Once again, thanks to Alchemy, switching to this network was quite straightforward. However, now that I’m deployed to Polygon I need a different token, rather than ETH, Polygon runs on MATIC. I bought a modest amount of this currency, deployed my contracts, and was finally able to convert the Applause Button on this blog to run on a blockchain.

Result! I am an official Web3 developer!

This is a public and permissionless blockchain, so you can [view each ‘clap’ as a contact invocation on the network](https://polygonscan.com/address/0xaef5605322d42f0473dc6722ec322ead8fb03eb3):

![polygon-contract.png](/uploads/polygon-contract.png)

Polygon is many times cheaper than Ethereum, but is still far more expensive than AWS. My costs were roughly:

* Contract deployment: $1.5
* Migration: $5.0
* Each ‘clap’: $0.01

I ran this solution for a week, ending up spending ~$10.

I had fun running this experiment, and learnt a lot. Unfortunately, most of which has left me with a very negative impression of Web3.


## Notes and learnings

Here are some of my thoughts from this experiment

### Web3 is centralised

My final architecture was as follows:



Considering that this is a Web3 application, there is a lot of so-called Web2 technology in there. I am also reliant on various third-parties (Alchemy, Polygon).

However, what struck me the most is that Web3 is composed of numerous disconnected and unrelated blockchains. This is not what I would consider to be a decentralised technology. To develop an application, I have to choose a specific blockchain (of which there are hundreds), and my end users have to use the currency / token of that blockchain. 

In contrast, the underlying infrastructure of the web (HTTP, WebSockets, TCP/IP, etc…) means that everything can communicate with everything else.

There are various initiatives in the blockchain-space which seek to make it easier to connect chains together. I’m not sure of how this works from an end-user perspective, but a recent article where [$500m was lost due to a bug in one of these interconnects](https://www.theguardian.com/technology/2022/oct/07/binance-crypto-hack-suspended-operations) does not fill me with confidence.


## Blockchain costs

As I detailed above, Ethereum is ridiculously and prohibitively expensive compared to public cloud equivalents. Which is why people opt for level-2 solutions. 

Incidentally, I later found that Polygon isn’t really a side-chain. Your transactions don’t make it onto the Ethereum network. They perform some sort of hand-wavy checkpointing, whatever this might mean. Basically, my application was deployed to some second-tier blockchain.

Anyhow, back to costs. Even if these reduce, the volatility due to the supply and demand in the network, and the volatility in the exchange rate of the associated token, are a significant obstacle to wide-spread adoption.

If I develop an application using blockchain technologies, what if the token / cryptocurrency becomes very popular? This makes it more expensive for me to buy the currency and deploy / maintain my application. I’m not keen on this!

What if more developers move to this blockchain? This will push up gas prices, and again, my costs increase.

Furthermore, if I don’t actively monitor costs and adjust my gas prices, it is likely I will be completely priced-out of the market.

And what happens if you don’t set a high enough gas price? Your contract is partially executed, but doesn’t complete and you lose your money. Great!


## Wrap-up

I honestly cannot see any utility in Web3 beyond supporting applications that only exists because of this technology, i.e. NFTs.

Furthermore, the main claim of Web3 is that it is decentralised, which by their interpretation means that end-users have control over their data, seems flawed for a few of reasons.

Firstly, as a smart contract developer, I set the rules. Yes, they run on a blockchain, which means that it is hard for me to change them. However, I can still collect whatever personal data I like!

Secondly, the ridiculous cost of running code and storing state on the blockchain means that the vast majority of app developers store state off-chain. What gets stored in the contract is often just a URL to a more conventional storage mechanism, e.g. AWS S3. This is true for most NFTs, your artwork doesn't live on the blockchain, all you’ve really bought is an expensive URL! Given that the data is often stored off-chain, how is this solution any better at protecting you and your rights over your personal data?

Finally, you don’t need a blockchain to solve the centralisation problems that exist in Web2, predominantly within social media. Take for example Mastodon, an open source competitor to Twitter, which runs on a decentralised network of nodes. 


<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Decentralization does not mean blockchain, cryptocurrency or NFTs.</p>&mdash; Mastodon (@joinmastodon) <a href="https://twitter.com/joinmastodon/status/1458485859720867844?ref_src=twsrc%5Etfw">November 10, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
 

So, given the many seemingly fundamental flaws in Web3 / blockchain, why is it so massively hyped? I see it on the agenda at virtually every conference, and sadly people are buying into this hype.

After much head-scratching I think I’ve worked out why.

Every technology is hyped to a certain degree. Take low-code for example, vendors who wish to sell their low-code solutions will try to create ‘noise’ in the industry, and raise the profile of the technology (low code) and their specific solutions / services. The hype they generate, sells their product and they benefit as a result. For vendors, hype is a good thing, and do you know what? I’m OK with that.

Where blockchain / Web3 differs is that there are two ways to make money from this hype. The first is to be a solution vendor (e.g. Alchemy), where they have a product which delivers value to their users and they want to push their sales upwards. The second is pure speculation. Anyone can buy cryptocurrency and speculate on the future value of a given blockchain. This allows anyone to profit from hype, you don’t need to invest time and energy in building a product to benefit from the growth in interest.

This is an entirely unique situation, to my mind we've not seen anything like this before in the technology world. Sadly, while people can benefit (i.e. make money) from blockchain-hype, without having to genuinely invest in the technology through product development, this thing isn’t going to go away in a hurry. And personally, I think it needs to.
