---
author: jbeckles
layout: default_post
title: "Passwordle: Musings on password strength"
summary: "Ever wondered how to tell how strong your pasword is? This blog post explores this question using the popular Wordle puzzle game for context."
category: Resources
---

What does password strength have to do with [Wordle](https://www.nytimes.com/games/wordle/index.html)? For those who don't know, Wordle is a word-based puzzle game where you are given six chances to guess the five-letter word of the day. The main rules are as follows:

* Each guess has to be a valid five-letter word
* Feedback about the accuracy of the letters in the word is given as follows:
  - Letters in today's word that are in the correct position are highlighted in green
  - Letters in today's word that are in an incorrect position are highlighted in yellow
  - Letters that are not in today's word are highlighted in grey
  - All the letters that have been used across all guesses are highlighted in grey on a QWERTY keyboard

Here's my attempt at Puzzle 330 (15 May 2022) below:

![Wordle Puzzle 330 attempt]({{ site.github.url }}/jbeckles/assets/wordle_330_solution.png "Figure 1: Wordle Puzzle 330 attempt")

Figure 1: Wordle Puzzle 330 attempt
{: .medium-text-center style="font-weight: bold"}

Playing Wordle is very similar to what an attacker will do when trying to guess a password. In both instances you have a 1 in N chance of guessing the correct word and are limited in the number of available guesses. The bigger N is, the harder it is to guess the correct word, while limiting the number of available guesses just makes enumeration of possible guesses harder. Let's take a look at some other similarities.

## Wordle's Word of the Day vs Passwords 

To compare passwords to Wordle's Word of the Day, we can look at the following characteristics of each:

* Word Anatomy, i.e., what are the valid characters in the word and how long can it be
* Feedback on word correctness

### Word Anatomy

[Permutation theory](https://en.wikipedia.org/wiki/Permutation#Permutations_with_repetition) tells us that X<sup>Y</sup> is the total the number of words that can be generated from a fixed set of available characters, X, for a word length of Y. In our case, N = X<sup>Y</sup>, and the larger X and Y become, the harder it becomes to guess the correct word. Using Wordle's Word of the Day as an example, the set of available characters is the 26 letters of the (English) alphabet, since the word is case insensitive, and the word length is fixed at 5 characters. This means that the number of possible character combinations is 26<sup>5</sup>, which is a little under 12 million combinations. However, since the attempted word needs to be a valid word in the (English) dictionary, the number of valid character combinations is significantly less. Taking [some other people's word](https://towardsdatascience.com/loaded-words-in-wordle-e78cb36f1e3c) for it, there are just under 13,000 valid 5-letter dictionary words, but just over 2300 of these are actually used in the game. 

Passwords have more characters available to them then Wordle's Word of the Day as they are usually case-sensitive (twice as many alphabet characters) and can include the 10 digits of the Arabic numeric system (0-9) as well as special characters such as '@', '&' and '$'. They also don't inherently have a dictionary-related limitation, although many password creators (myself included) artificially introduce a variant of this to make them more memorable. Security professionals and hackers alike are aware of this tendency to choose word-based passwords, including special character substitutions (e.g. '@' for 'A'), and [incorporate this knowledge](https://www.passwordmonster.com/) into their trade. 

Hackers often employ dictionary-based attacks, with the best ones seeded by leaked password lists, while security professionals encourage users to create longer passwords (passphrases), since random/unmemorable passwords don't help anyone. It's interesting to note that security experts know that users don't take much advantage of the available X that passwords have and encourage them to increase Y instead because that can be more usable. Password Manager apps can additionally help users to generate more secure (longer, more random) passwords, which removes dictionary-related limitations while maintaining sufficient usability.

### Feedback on word correctness

Wordle wouldn't be much fun if it was too hard to guess the correct word. The feedback given by the game reduces the solution-space in the following ways:

* For all letters that are known to not be in today's word, P, the solution space is affected in a way similar to (X-P)<sup>Y</sup>
* For all correct letters in the correct position, Q, the solution space is reduced to the form (X-P)<sup>Y-Q</sup>
* For every correct letter in an incorrect position, R, the solution space is of the form f(Y, Q, R) \* (X-P)<sup>Y-Q-R</sup> where f(Y, Q, R) is a function that contains a [combinatorial relationship](https://en.wikipedia.org/wiki/Combination) such that f(Y, Q, 0) = 1 and f(Y, Q, R > 0) > 0. As the focus of this blog is not the [math](https://aperiodical.com/2022/02/a-mathematicians-guide-to-wordle/) (read: "I'm not too bothered to correctly compute the relationship"), the main take away point is the way in which the solution space decreases.
* Finally, for all combinations of solution space reduction applied above, the dictionary-word limitation reduces the solution space even further

Given the rate at which the solution space can decrease with each guess (P increases with and is different for each guess; Q, also, hopefully, increases with the number of guesses; and R eventually settles to 0), it is plausible to see how Wordle can be successfully won (or lost) within 6 attempts. Logins (where passwords are usually used), on the other hand, don't provide any of the above feedback (and rightly so), which make them more difficult to guess correctly.

## Conclusion

Hopefully, now that you have, if you didn't have before, a stronger appreciation of the relationship between Wordle and password strength, the next time you play Wordle or input a password (or better yet passphrase) you remember this relationship and either be thankful that Wordle has feedback or re-examine whether your password is strong enough.
