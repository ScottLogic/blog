---
title: 'Accessibility tooling: WAVE vs aXe'
date: 2023-09-12 08:48:00 Z
---

It can be difficult to appreciate just how many considerations are needed for creating software that everyone is able to access. You may have heard of screen readers such as NVDA to aid those hard of sight, but how does your software react when zoomed in 400%? You may understand the importance of site navigation using only a keyboard, but you should be sure that you don’t end up running into any keyboard traps – and that you can tell just what is highlighted at any given point. You are able to confirm that all the links on your page are working, but are they as accessible on a smaller screen, or if a person is using their finger or a stylus pen.

Where do you start?

When it comes to ironing out the more common accessibility problems, automated tools make for an excellent aid! Such tools require a user to input their URL and generate a report based on that but the two that I had come across when looking into this can be run directly from the browser on which you would like to test. These two tools are WAVE and (the free version of) aXe DevTools, both of which work in similar ways.
If you are trying to get a quick and free overview of how accessible your webpage is, how do these two tools compare?

## **Testing tools in action**

To demonstrate how each of these tools operate the following site – a testing resource page - will be used: https://testsheepnz.github.io/. This site contains various engaging testing challenges that make it worth visiting – the initial dice game challenge is really fun, though be wary that inspecting the console may spoil answers – but it also contains two of the most common types of accessibility problems: poor contrast and nondescriptive links. Before we start comparing in more detail, let’s see how each of the tools mentioned

### **WAVE**

![WAVE Dashboard showing errors, contrast errors, alerts, features, structural elements and ARIA categories](/uploads/WAVE%20Dashboard.png)

WAVE is a downloadable extension available for Chrome, Firefox and Edge. It can be run by clicking on the extension icon or through right-clicking the page and choosing the “WAVE this page” option.

The icons that will populate the page link to matching icons in the WAVE dashboard describing what the icon will mean in more detail. The red (error) and yellow (alert) icons are likely of most interest to the user. Whilst the formatting of the page may be disrupted by these icons, switching off the page styling using WAVE will help the user view each icon in isolation; As seen below this may be a necessity on some pages.

![Cluttered, unreadable icons on a page](/uploads/WAVEIcons.png)

To jump to any specific error listed by WAVE, navigate to its ‘description’ tag and click on any of the individual icons underneath the various elements that WAVE has detected to do so.

### **aXe**

![aXe dashboard with forty-three errors associated with eight different error types ](/uploads/aXeDashboard.png)

aXe is a downloadable extension available for Chrome, Firefox and Edge. It can be run by opening Devtools and clicking on the aXe extension offered by it, and then by clicking “scan full page” – most of the other features are locked behind the paid version of aXe, something that this blog post will not cover.

Once the scan is complete, the “Best practices” option is set to “on” so that everything that aXe has captured is present. Unlike WAVE, the page being tested does not get populated by icons. Instead, under each error there is an option to highlight to region in question that had caused the error to manifest. Most features that aXe offers are a part of its paid service but plenty of information is still offered.
How these tools should be utilised

Both accessibility tools have their uses for accessibility testing but they can never be used in isolation for full accessibility coverage - warnings given by the tools themselves. The example given in the introduction about using a keyboard is the best example of something that accessibility tooling will never catch. In addition, a single execution of either WAVE or aXe will usually not be enough as they only capture the current state of a website and may miss, for example, errors in contrast when text changes after hovering over it with a mouse. WAVE’s colour contrast error description has specific mention of cases in which it would miss any potential contrast error. If a user wishes to use tools to verify that these colour changes still meet accessibility requirements the accessibility tool will have to be run again once these changes in state are persisted on the page.

Also important to note is that whatever errors are flagged up should be double-checked to verify that the issue is genuine. For example, text that is part of a logo or part of an inactive UI component  (such as a ‘login’ button that can’t be clicked until the required fields are filled) may return ‘false positives’ from either tool.
More direct comparisons

## **What is found by both tools**

The information that both tools give on the lack of accessible links and contrast errors are extremely important. For the lack of accessible links, aXe supplements this information via snippets of the code where the error originated from, in which the user can note the lack of an alt text tag. WAVE goes one step further with this using its ‘order’ heading which emulates the text heard when tabbing through a page with a screen reader such as NVDA, which is an aid for people with poor or no vision. If the text \*NO ACCESSIBLE NAME\* is seen, then NVDA would only inform someone using it that they have tabbed to a link, without any context.

![WAVE order tab, showing multiple links without an accessible name](/uploads/WAVEOrderTab.png)

On the latter point, both also indicate the actual contrast – and on this particular page highlights the difficulty that would come with manual testing of such a thing. The main text *does* fail accessibility checks, but at 4.44:1 ratio compared to the minimum of 4.5:1 ratio that would be hard to see by the naked eye, especially for a tester who does not have low vision or colour blindness.

## **How the information is presented**

WAVE’s errors are presented as definite issues that need to be addressed whilst alerts are things that may be an issue but are not necessarily. In a similar vein, the information around features, structural elements and ARIA labels are presented as an explanation of what should encompass these features and what a user should check for. Whilst it’s highly unlikely for a webpage to contain every detectable error or alert, WAVE offers an icon index that a user can look through if curious. The extra information given serves as an excellent aid to manual accessibility testing once the errors picked up by automatic testing have been resolved.

![22 WAVE icons indicating different error types.png](/uploads/WaveErrorIcons.png)

aXe, instead of separating by error and alerts, will include tags listing the severity of the found accessibility bug, ranging from ‘minor’ to ‘critical.’ The number of each issue ranked by severity is presented in a table, and a user is able to filter the issues by clicking on the number. This would help a user prioritise found accessibility bugs for resolving.

![The four aXe error types: minor, moderate, serious and critical](/uploads/aXeErrorTypes.png)

Additional information around what the accessibility tools have picked up also differs between the two. Both WAVE and aXe offer solutions to fix the problems found. WAVE also provides a brief run-down on how the error can affect accessibility with links to official WCAG documents provided. For aXe, which will highlight the area of code which has triggered the accessibility errors, “Why it matters” is to be found in an external link. What will also be provided where appropriate are examples of code which would not fail the detected issue.

## **What extra information is provided**

WAVE gives some additional information about the page that is not present in aXe. The list of features and ARIA labels already mentioned are an example of that but hidden links are also indicated, which become visible when formatting is disabled. As well as the ‘order’ tab mentioned earlier the ‘structure’ tab presents the main sections of the page including the heading, navigation and footer. Human judgement is needed here to check to see if how the page is structured makes sense. Any errors around, for example, the heading order will be flagged up once again on this tab.

![WAVE structure tab showing heading order of the 'testsheepz' website](/uploads/WAVEStructureTab.png)

aXe is able to detect at least a few extra accessibility errors (based off of testing of the TestSheep web page) that WAVE did not pick up on. The two extra errors – non-unique IDs and content not contained by landmarks – are both considered “best practice” by aXe. Whilst having unique IDs prevent invalid markup, digging a little deeper reveals that a requirement for valid markup is no longer a requirement as of WCAG 2.0. In addition, whilst using landmarks (header, nav, main, footer) is encouraged, these can be replaced with div sections with specific roles instead. Nevertheless, consideration of both will be able to give that much more confidence in the accessibility of a user’s site.

The following table is a summation of the different information on page accessibility detected by the two tools.

| Feature                                               | WAVE | aXe |
| ----------------------------------------------------- | ---- | --- |
| Able to detect contrast errors                        | Yes  | Yes |
| Able to detect lack of alternative text               | Yes  | Yes |
| Errors in heading structure checked                   | Yes  | Yes |
| Directly detects if certain key landmarks are missing | No   | Yes |
| Missing characteristics on ARIA role checked          | No   | Yes |
| Presence of duplicate Ids checked                     | No   | Yes |
| Lists tab order of page with NVDA text shown          | Yes  | No  |
| An overview of page structure is provided             | Yes  | No  |

## **To conclude…**

Since both WAVE and aXe are relatively easy to use, using both together can be beneficial. A use case for myself whilst testing out the testing site was, upon seeing the issue flagged by aXe around page content needing to be contained by landmarks, verifying via the structure tab of WAVE that there is no ‘Main’ landmark around the content of the page. This technically means that WAVE does provide information around landmarks but if a user doesn’t know to look out for it (or to check for ARIA labels, which can be a substitute for landmarks) then it can easily be missed.

If choosing to utilize both, make sure that they are both used in isolation. The icons that pop up when using WAVE is mistakenly interpreted by aXe as being part of the page and will lead to false positives in accessibility checking.
There are of course many other options for automatic accessibility checks, including implementing it as part of automated code, sites that will generate more formal reports and using a paid accessibility checker, such as that which aXe offers. However, if you are looking for a quick and free automatic accessibility check and only want to consider one then this blog post will hopefully help with that. You can use the information here to form our own opinion but to summarise my takeaway from using these two tools;

**Use WAVE if:**
•   You are also interested in the contents of the features that make up your website
•   You prefer a more visual ‘at a glance’ indicator of where detected accessibility errors exist on your page
•   You are also looking to check hidden elements on the page
•   You prefer more condensed explanations for any errors or alerts that have been picked up, which don’t require links away from the page

**Use aXe if:**
•   You are looking to catch as many accessibility errors as possible before the start of manual testing
•   You want to avoid having to disable page formatting, or dislike the way in which the WAVE icons are presented.
•   You are more interested in quickly viewing the area of code which is causing the accessibility error
•   You find the more detailed breakdown of the accessibility problems, alongside code examples of how to fix it, useful