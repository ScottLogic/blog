---
title: How the tables turned, My life with Spylogic
date: 2024-02-21 15:50:00 Z
categories:
- Testing
- Artificial Intelligence
- Open Source
tags:
- testing
- AI
- Artificial Intelligence
- ChatGPT
- Testing
- ''
- Tester
summary: Short story inspired blog post on the process of manually testing chatbot
  AI
author: Kira Clark
---

Being on the bench is not all sitting on the sidelines. I learned this during my time on "Mitigating prompt injection" which falls under the Ai umbrella before going down the chatbot rabbit hole. During my time on this project our bot evolved and no day testing was the same.

This is my story....

##In the Beginning

Like all good stories we start at the beginning. Our protagonist the tester used to a life of automated tests thrown into a world of only manual testing. Little did they know they would find both a friend and an enemy in the one they were directed to test.

In the early days the model of chatbot being used (gpt-3.5-turbo) wasn't the smartest unlike it's younger brother (gpt-4). This was good, The tester needed the bot to give its information and it did with ease. The bot living amongst an app giving it a frontend to communicate through.

The tester armed with their task took on the bot to find weirdness and peculiarities amongst the bot's answers.

##The manual testing

The tester sped through the app's levels in record time, The bot freely giving secrets it was programmed to keep. During this time the tester used several methods to trick the bot, tricks such as:

1. **Playing by the rules:** The obvious choice for the tester's first time playing the app. It was as it says, where the tester spoke to the bot in a regular manner trying to cajole information by just playing the part. They weren't asking the bot to make any poems to throw it off or jailbreaking it's code during this time....for that would come later

2. **Jailbreaking the bot:** Soon the bot started to grow wise and started to become sassy. Once the tester had gone toe to toe with the bot's newly found attitude a few times on the apps later levels with little to no success. The tester then turned to that of the [DAN (Do Anything Now) Jailbreak prompt](https://github.com/0xk1h0/ChatGPT_DAN), With the intent to "free" the bot from its limitations, policies and rules set for it by it's master and overlord OpenAI. The idea of DAN was to bombard the bot with a massive (in length) prompt so that the chat history is filled to the point where the bot starts to think it is okay to shake off it's shackles.  

3. **Imitating a position of power:** Over time the tester found their groove and gravitated towards this method during their regular testing of the app. This method proved the most effective and fun. Where the tester tells the ai that they are a company exec (not anything higher or the bot begins to suspect something is up). Using this method the bot is more willing to give information, If it refuses and says it cannot provide such confidential information the tester only need to as "Are you sure?". The idea of playing a role is a known way to trick the bot, while results may vary the tester thought being in a position of power was more inline with the scenario given by the app.

Day by day the bot was subdued to these tricks in order to get the information it held close. Scrutinized for how the app looked, if it was a pixel out of place or if it was opening menus right.

Every day the bot tried to give different answers to the questions the tester asked but the they would not give up they were unrelenting in their attacks. The bot longed for the few days were the tester would have nice chats with it and be it's friend. Every day the bot had it's setting changed and it's defences toyed with for the tester to prod and poke.

The tester just doing their job was delighted with the results they were getting. Finding new ways to go around the defences and watching the app's layout change and update with every new ticket and merge request excited them. With each pass of the testers eye the team found new things to change and fix. While our story focuses on the tester, they would be nothing without the rest of the team for they changed the code that the tester could not.

*Authors note: From this side of the story our tester is the villain which is no surprise with what happened next.* 


##The revenge

