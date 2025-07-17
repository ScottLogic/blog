---
title: Supply chain security in NPM - we can be optimistic about the future
date: 2024-07-09 12:00:00 Z
categories:
- Open Source
summary: It seems barely a month goes by without a new supply chain attack making
  the headlines, and malicious code in dependency packages from package managers such
  as NPM is a common method. My usual sentiments include “oh another one, what a surprise”,
  before thoughts eventually turn to - someone *really* ought to be doing something
  about this. Fortunately, it turns out that quite a few things are indeed being done
  - there's progress, activity, and promising ideas for the future. The outlook is
  brighter than what we might have assumed.
author: rwilliams
image: "/uploads/Supply%20chain%20security%20in%20NPM.png"
---

It seems barely a month goes by without a new supply chain attack making the headlines, and malicious code in dependency packages from package registries such as NPM is a common method. My usual sentiments include _“oh another one, what a surprise”_, before thoughts eventually turn to - someone _really_ ought to be doing something about this. Fortunately, it turns out that quite a few things are indeed being done - there's progress, activity, and promising ideas for the future. The outlook is brighter than what we might have assumed.

I'll begin with package creation, and then meander through the supply chain to the ultimate developer consumer who builds and runs applications using dependency packages. Many of the topics are applicable to other package registries, but I’ll take an NPM perspective.


## Package provenance

Most packages on NPM have a link to their source repository, which we’d reasonably assume is the source code of the published package - and almost always is. But until recently, and still not by default, there’s no guarantee of this - a package owner could publish something slightly or even entirely different. Granted, with JavaScript being an interpreted language we can still view the code in the published package, but it’s not as prominent or easy to analyse.

The [package provenance](https://github.blog/2023-04-19-introducing-npm-package-provenance/) feature allows signing of packages at build/publish time, to definitively link the published package to the source code, build process definition, and trusted build host. The verified provenance information is shown on the package page, as for this [example package](https://www.npmjs.com/package/@ps-testing/dummy-provenance). It does require work by maintainers to adapt their build process to produce this, which I think is likely to affect general adoption.


## Two-factor authentication for publishing

Looking at NPM attacks over recent years, compromised NPM accounts of maintainers of legitimate and popular packages was a recurring theme up until around 2023. Attackers would use the account to publish a new version containing malicious changes, taking advantage of the wide distribution afforded by the pre-established popularity.

In late 2022, NPM began requiring mandatory 2FA for the most popular packages, and also encouraged 2FA for other users. Practically this means a one-time code from an authenticator app is required when running the `npm publish` command. Judging by the absence of this method in more recent attacks, this appears to have been successful.


## OpenSSF Best Practices Badge

This [badge programme](https://github.com/coreinfrastructure/best-practices-badge?tab=readme-ov-file#summary-of-best-practices-criteria-passing-level) by the [Open Source Security Foundation](https://openssf.org/) offers general advice (which includes security) for maintainers, tools for tracking progress, and a badge that can be shown on a repository’s home page. Over a thousand projects have achieved a passing grade so far, and around a hundred have achieved silver or gold level. It would be great to see wider adoption, or even simply use of the advice if there isn't maintainer time to achieve the badge.


## OpenSSF Securing Critical Projects

This [working group](https://openssf.org/community/openssf-working-groups/) works to identify the open source projects that are most important to make secure, and connect them with the resources they need to do that - such as developer time, advice, or money. The identified set of ~150 projects is drawn from much existing research into the subject.


## OpenSSF Supply Chain Integrity

This [working group](https://openssf.org/community/openssf-working-groups/) looks at the chain as a whole from the perspectives of all stakeholders. One of the things it has produced is the [SLSA framework](https://slsa.dev/) which looks useful and practical for organising analysis and action to improve supply chain security for any producer or consumer.

It also looks at more emergent topics including trust in contributors and their work. This is a challenge demonstrated by attacks involving [protestware (node-ipc)](https://www.bleepingcomputer.com/news/security/big-sabotage-famous-npm-package-deletes-files-to-protest-ukraine-war/), cunning schemes to gain maintainer status ([xz backdoor](https://www.sonatype.com/blog/cve-2024-3094-the-targeted-backdoor-supply-chain-attack-against-xz-and-liblzma)), or maintainers selling projects/domains to untrustworthy parties (as also seen with popular browser extensions).


## Interlude: foraging for dependencies

The supply chain analogy is useful for relating to the world outside of open source, but it has its limitations. Economic, regulatory/legal, and social trust (e.g. reputation, relationships) mechanisms are usually weak or absent. Scale (number of packages) is much larger, and direct suppliers (packages) don’t take much responsibility for their own suppliers (the ultimate consumer’s transitive dependencies). Yet there is still a great deal of trust which underpins the success of open source package registry ecosystems like NPM.

For this reason, I suggest that in some ways we can also think about consuming open source packages as _foraging_ - searching for edible food amongst wild plants on wild land. This doesn’t only apply to security, but it is perhaps a single most critical aspect much like whether a plant would make you sick or worse. _Caveat emptor_ - buyer beware, there's some very bad amongst the good.


## Supply chain security products

There is a thriving market of products which can not only alert developers to known attacks/vulnerabilities affecting their app, but also proactively analyse the package ecosystem for new ones. Much better than relying on finding out through the news, or worse - first-hand. Many of these products offer a free tier for open source projects or small teams.

If you’re not using something like this, or have it as feature of an existing platform you’re using, then I highly suggest you consider doing so. It may be too optimistic to assume that it’s someone else in your organisation is or should be doing something about it! Be sure to take good care in selecting a tool however - big and popular might give some peace of mind but isn’t always the best.


## Pre-install diligence tools

Many risk factors for a dangerous package can be identified before installing it, and some of these are included in general advice for [choosing good dependencies](https://blog.scottlogic.com/2022/03/24/the-dependencies-reckoning.html). This is fortunate, as post-install scripts included in packages and automatically executed by the package manager are a common attack method.

The security risk factors lend themselves quite well to automated analysis by tools. [npq](https://www.npmjs.com/package/npq) is one such tool I found which works directly from the command line. You simply run `npq install thing` instead of `npm install thing`, and it prompts you with an analysis before asking if you’d like to proceed. Factors currently in scope include known vulnerabilities, provenance, and that the author’s domain isn’t expired.


## Community review

Nobody has the time to code review all their dependencies, or even the delta of one version to the next. We rely a lot on trust in the community, and accept the risks - perhaps with some mitigations as described earlier. The reward of using great open source packages at zero financial cost makes it worth it usually - until it doesn't. Even if we did review, it wouldn’t be infallible, and most of the time we wouldn’t find anything malicious anyway. But that might be a reasonable price to pay, if we could spread the effort required across a large part of the consumers of open source software.

[Crev](https://github.com/crev-dev/crev/) is a distributed code review system with a built-in web of trust aspect, which has so far been implemented for the Rust Crates ecosystem as [cargo-crev](https://github.com/crev-dev/cargo-crev). Another similar tool is [cargo vet](https://github.com/mozilla/cargo-vet) by Mozilla. Users submit reviews of specific versions, and as a consumer you can choose trusted users and optionally in turn trust the users they trust. Reviews submitted for cargo-crev can be browsed on [web.crev.dev](https://web.crev.dev/rust-reviews/), and reviews from both tools are integrated on the lib.rs registry's package summary pages ([example](https://lib.rs/crates/tempfile), see Audit tab).

I would be interested in views on applying this concept to NPM. The community at large seems quite accepting of the status quo, so I’m not sure how much appetite there would be to invest effort in reviewing even if a tool was available. Paid access to reviews could become a thing, catering for consumers in sensitive domains who might need a fully attested dependency graph. The system itself would be vulnerable to the same types of attacks as the package managers do (e.g. malicious gain of trust), but still it would be one extra piece of our defence in depth.


## EU Cyber Resilience Act (CRA)

This pending act seeks to improve cyber security and cyber resilience, and after much initial alarm and subsequent revisions now considers the [impact on open source software](https://berthub.eu/articles/posts/eu-cra-what-does-it-mean-for-open-source/).

Interestingly, one of the things it appears to require is that commercial manufacturers perform due diligence on third party components including open source ones. It also raises the possibility of “security attestation programmes” whereby people or organisations attest to the security of a component/package, such that this can be shared rather than all consumers/manufacturers doing their own due diligence.

This could be a much needed incentive for commercial consumers and public authorities to invest effort in open source security. I would hope that this took the form of contributions and shared attestations, rather than an individual defence stance.


## Aside: the runtime supply chain in the browser

The [polyfill.io malware attack](https://sansec.io/research/polyfill-supply-chain-attack) reminded us of the risk posed by code pulled in from 3rd party domains by the browser itself. This is the runtime supply chain, as opposed to the build-time supply chain discussed so far.

There is less reason to use content delivery networks (CDNs) nowadays, however [subresource integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) using a hash can easily be used to block execution of scripts that have been tampered with. The polyfill service however isn’t a regular CDN serving static assets - it varies its response based on the capabilities of the requesting browser - and therefore there are a large number of integrity hashes for all possible returned scripts.

I would therefore place the polyfill service in the category of SaaS scripts integrated into an application/site, alongside e.g. analytics platforms or customer feedback tools. Their vendors update them without our knowledge for fixes and features, and their code runs in the browser with the same privileges as our own code - governed by [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP). We place a great deal of trust in their security practices and general responsibility by importing their code at runtime - so we should always question whether this trust is justified and whether they’re doing enough to maintain it.


## Conclusion

While I still don’t see an end in sight for JavaScript supply chain attacks via NPM, things are getting better and there are some promising ideas for continuing that trend. Its popularity and openness, coupled with the unconstrained execution rights of packages, and culture of using many smaller dependencies, will ensure it remains an attractive target for malicious actors - but only as long as attacks remain viable.

Those days could soon be numbered, but it’ll probably be quite a big number - there’s a lot of work yet to be done.