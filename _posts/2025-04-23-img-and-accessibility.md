---
title: The problem(s) with image accessibility
date: 2025-04-23 00:00:00 Z
categories:
- Tech
author: osharon
layout: default_post
summary: While the HTML <img> tag is simple, misusing it - such as omitting alt text, using images as spacers or buttons, or embedding text in images - can harm screen reader accessibility, SEO, and user experience. This post reviews 11 specific issues from a sample HTML snippet, stressing that images should be meaningful, accessible, and appropriately implemented. Thoughtful image usage not only improves inclusivity and performance but also reflects professionalism and attention to user needs.
---
Assuming one is not a "[vibe developer](https://medium.com/@niall.mcnulty/vibe-coding-b79a6d3f0caa)", one cannot truly call oneself a “web developer” without knowing how to code HTML. “Meh, it’s not even a real language”, some (backend) developers might chuckle. But even if we ignore the question of what defines a language, a good web developer should know what is considered good code and what is considered sacrilege.

As a web developer, the `<img>` was probably one of the first HTML tags you learned, and sure, why not? It's simple, straightforward, and its effects are immediate. This is probably the reason why it's very often being misused. Consider the following code that should work, but contains flaws that harm the page’s accessibility. Can you find them all? If you can spot all 11 flaws (and are UK-based), we might have a [job opening](https://www.scottlogic.com/careers/vacancies) for you!

~~~~html
<header class="site-header">
  <div class="logo-container">
    <a href="/">
      <img src="/assets/images/logo.png">
    </a>
  </div>

  <nav class="main-nav">
    <img src="/assets/images/spacer.gif" width="150" height="1">
    <ul>
      <li><a href="/products"><img src="/assets/images/nav-products.png" alt="Products"></a></li>
      <li><a href="/about"><img src="/assets/images/nav-about.png" alt="About Us"></a></li>
    </ul>
  </nav>

  <div class="social-links">
    <p>Connect with us:</p>
    <a href="https://twitter.com">
      <img src="/assets/images/social-sprite.png" alt="Social Media" usemap="#socialmap">
    </a>
    <map name="socialmap">
      <area shape="rect" coords="0,0,32,32" href="https://twitter.com" alt="Twitter">
      <area shape="rect" coords="33,0,65,32" href="https://facebook.com" alt="Facebook">
    </map>
  </div>
</header>

<main class="content">
  <section class="hero">
    <img src="/assets/images/hero-headline.png" alt="Welcome to our eCommerce store!">
    <img src="https://placehold.co/600x400" class="tbd">
  </section>

  <section class="products">
    <h2><img src="/assets/images/heading-featured.png" alt="Featured Products"></h2>
    <div class="product-grid">
      <div class="product-card">
        <div class="product-image" style="background-image: url('/assets/images/product1.jpg')"></div>
        <img src="/assets/images/buy-now-btn.png" alt="Buy Now" class="product-button">
      </div>
      <div class="product-card">
        <img src="/assets/images/product2.jpg">
        <img src="/assets/images/buy-now-btn.png" alt="Buy Now" class="product-button">
      </div>
    </div>
  </section>

  <section class="newsletter">
    <h3>Join our newsletter <img src="/assets/images/exclamation-mark"></h3>
    <form>
      <input type="email" placeholder="Your email address">
      <img src="/assets/images/submit-btn.png" alt="Submit" onclick="submitNewsletter()">
    </form>
  </section>
</main>

<footer class="site-footer">
  <img src="/tracking/pixel.gif?user=123" width="1" height="1" alt="">

  <img src="/assets/images/footer-divider.png" class="footer-divider">

  <img src="/assets/images/logo.png" class="footer-logo">

  <p class="copyright">
    <img src="/assets/images/copyright-text.png" alt="© 2023 Company Name. All Rights Reserved.">
  </p>
</footer>
~~~~

Did you write down your notes? Let's go over the answers!

1. `<img src="/assets/images/logo.png">` - Image without ALT description. Search engines won't be able to search by the content of this image; Screen readers won't be able to describe the image. That's 7 years of bad luck right there.
2. `<img src="/assets/images/logo.png">` - Image without size definition means the rest of the page's content will move once the image is loaded. That's equal to a big black fly stuck in your room the entire day.
3. `<img src="/assets/images/spacer.gif" width="150" height="1">` - Spacer images are a good indication of how outdated the web page (or the developer) is. This is not an image and therefore should not use the `<img>` tag.
4. `<img src="/assets/images/social-sprite.png" alt="Social Media" usemap="#socialmap">` - Some image-maps might make sense but in the case of a set of links to social media websites, this should be straightforward, separated links. It would also make it much easier to remove the "X" link.
5. `<img src="/assets/images/hero-headline.png" alt="Welcome to our eCommerce store!">` - Using images instead of plain text means it cannot be read by screen readers and search engines. That’s an additional 7 years of bad luck.
6. `<div class="product-image" style="background-image: url('/assets/images/product1.jpg')"></div>` - While using `div` with a CSS background-image is a great way to obscure non-relevant images, it's actually a cardinal sin to obscure items that have contextual relevancy and the user wishes to know are there.
7. `<img src="/assets/images/exclamation-mark">` - Using images to replace common symbols is incredibly redundant and even if you have the most amazing picture of an exclamation mark, it's better to use CSS as this is not relevant contextually.
8. `<img src="/assets/images/submit-btn.png" alt="Submit" onclick="submitNewsletter()">` - Using `<img>` as button (without setting the `role`) is a crime that renders the image unclickable for keyboard-navigating users.
9. `<img src="/tracking/pixel.gif?user=123" width="1" height="1" alt="">` - Tracking users' data, and being so audaciously blunt about it, you'd deserve all the negative thoughts your users will have about you.
10. `<img src="/assets/images/footer-divider.png" class="footer-divider">` - Decorative items shouldn't be `<img>` as they don't provide any contextual value to the user. It would be much better to use `hr` and give it a CSS background-image
11. `<img src="https://placehold.co/600x400" class="tbd">` - And finally, it's not an accessibility issue, but it’s worth setting a reminder to replace the placeholder images with actual images before publishing your website

The impact of properly using the `<img>` tag goes far beyond just making a page look “nice.” It directly influences how inclusive, performant, and professional your website feels. When used thoughtfully - with meaningful alt attributes, defined dimensions, and appropriate roles - images can enhance usability for screen reader users, improve SEO rankings, and reduce layout shifts that frustrate users. On the flip side, misuse of the `<img>` tag not only alienates a portion of your audience but also sends a message that user experience and accessibility are afterthoughts, or reflects badly on your developers.
In short: the `<img>` tag might be basic, but its implications are anything but.

##The Takeaways

- Don't skip writing a descriptive `alt`. It should describe the content of the image;
- Don't start your `alt` with "An image of". It's redundant;
- Don't simply quote a line from the main text. That's unhelpful;
- Don't skip specifying the image height to improve page-load smoothness;
- Don't use images for spacers;
- Don't use images as buttons (or at least set the [aria-role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles))
- Don't use images for decorative common symbols;
- Don't use a single image for social media icons;
- Don't use images with text instead of actual text;
- Don't use `<div>` instead of `<img>` when the image is a part of the context;
- Don't use images to track users' data;
- Don't use `<img>` as dividers;
- Don't forget to replace all the image placeholders with actual content;