---
author: tmakarem
title: "Working with type: Sketch vs. Adobe Illustrator"
layout: default_post
categories:
  - UX Design
tags:
  - featured
summary: "In this post, I go over the similarities and differences between Sketch and Illustrator when working with type."
---

People moving from *[Illustrator](http://www.adobe.com/uk/products/illustrator.html?mv=search&s_kwcid=AL!3085!3!75270349970!b!!g!!illustrator%20adobe&ef_id=VuFCbQAABM2qoHFs:20170309093627:s)* to *[Sketch](https://www.sketchapp.com/)* might find that working with type in Sketch is a bit limiting compared to Illustrator. In this post, I go over the similarities and differences between the two tools when working with type.

###CHARACTER STYLES / TEXT STYLES

**Assigning text styles**

Illustrator assigns a “Normal character style” by default to any new text box, whereas in Sketch no text style is set until you create one.


**Setting text styles**

You can set text styles in both Sketch and Illustrator and apply that style to multiple text boxes. You can then update that text style once to apply global edits to any text that inherits that style. In Illustrator you can apply different text styles to selected text within the same text box, whereas in Sketch, each text box can inherit only one style.

**Customising an instance of a  text style**

Both tools allow you to set a text style and customize an instance of it. For example, you can set a header text style defining the font family as Roboto, the size as 24pt, the weight as Regular and the colour as black but for one of the headers, you change the colour to blue.

Illustrator keeps the original inherited features from the text style only changing the colour. It adds a + icon in the “Character Styles” window next to the edited text style when the customized blue header is selected. This icon indicates that the header style was customized for the selected header.

Sketch does something similar adding a refresh icon next to the text style when the edited text is selected.

![Illustrator character style customized]({{ site.baseurl }}/tmakarem/assets/040_Custom-Style.png "Sketch text style customised")

*Illustrator character style customized (+ icon appears next to the edited style)*

![Sketch text style customised ]({{ site.baseurl }}/tmakarem/assets/041_Custom-Style.png "Sketch text style customised")

*Sketch text style customised ( refresh icon appears next to the edited style)*


**Editing text styles**

You can edit a text style and apply the edit globally to any text that inherits that style.

To do that in Illustrator, you double click on the style you created, edit it and it automatically updates all the texts inheriting that style in your design.

When you do that, Illustrator preserves the previous customisation of an instance of a text style. In the example I mention above, changing the header style size from 24pt to 26pt would not affect the colours of the headers. You would still have an instance of the header that is blue but all the headers including the customised blue one would change to 26pt. That is not the case in Sketch.

In Sketch, to update text styles, you have to update a textbox first, then click on the refresh icon that appears next to the text style. Clicking the refresh icon will update all the texts that inherit that style and will override any previously customised instances of that style.

Also, having to click on the refresh icon to update the style is not very immediately clear because you might not think of changing a specific textbox to update a text style. You might think that editing a text style is not supported in Sketch.

**Previewing text styles**

A nice feature that Sketch offers and that Illustrator doesn’t is the preview of the text style. In Sketch the name of the text style inherits the settings of that style.

![Sketch, text style preview]({{ site.baseurl }}/tmakarem/assets/042_Style-Preview.png "Sketch, text style preview")

*Sketch, text style preview*

###PARAGRAPH STYLES

Illustrator distinguishes between character styles and paragraph styles whereas Sketch combines both under text styles. In both tools, you can set the text justification, the leading, and the spacing at the end of a paragraph.

However, Illustrator supports a few additional features such as preferences for hyphenation, first line indent, right/left indent, and roman hanging punctuation.  

###OUTLINE FONT

Both Illustrator and Sketch allow you to outline a font, which converts text to an outline so you can use the text as a shape. This can also be useful if you want to share a file with someone who doesn’t have the typeface you used, if you want to use the font as shape or if you want to slice the letters.

![Outlined font in Illustrator]({{ site.baseurl }}/tmakarem/assets/043_Outlined-Font.png "Outlined font in Illustrator")

*Outlined font in Illustrator*

###SUPERSCRIPT / SUBSCRIPT

Setting type as superscript or subscript in Illustrator allows better control over what you can edit in the settings and the default you can have.

In Sketch, to add superscript or subscript text, you select the type and go to type/baseline. The superscript or subscript text is positioned respectively above and below the baseline, but you have to manually decrease the font size.

![Sketch superscript text]({{ site.baseurl }}/tmakarem/assets/044_Sketch-superscript.png "Sketch superscript text")

*Sketch superscript text*

In Illustrator, you can make the word superscript or subscript with one click and the font size is smaller by default. You can customize the default font size and position of the superscript and subscript text.

![Illustrator superscript text]({{ site.baseurl }}/tmakarem/assets/045_Illustrator-superscript.png "Illustrator superscript text")

*Illustrator superscript text*

![Illustrator document settings]({{ site.baseurl }}/tmakarem/assets/046_IllustratorDocument-Settings.png "Illustrator document settings")

*Illustrator document settings*

###THE TEXT BOX

**Text box edges as a mask**

In Sketch, the height of the text box is used as a mask, which allows you to crop the letters. This is very useful, for example, if you want to show that there’s content beyond the screen you’re designing for, and that the user can scroll. In Illustrator, you can’t crop the letters. Text that goes beyond the height of the text box is hidden. You would need to outline the font to make it a shape and then add a mask to crop the letters.

![Sketch text box masks part of the letters]({{ site.baseurl }}/tmakarem/assets/047_Textbox-Sketch.png "Sketch text box masks part of the letters")

*Sketch text box masks part of the letters*


![Illustrator text box hides the text that goes beyond the bounding box]({{ site.baseurl }}/tmakarem/assets/048_Textbox-Illustrator.png "Illustrator text box hides the text that goes beyond the bounding box")

*Illustrator text box hides the text that goes beyond the bounding box*

**Editing the text box**

In Sketch, you can edit the width of the box. In Illustrator, you edit the height and width of the text box simultaneously which is more practical. Both tools allow you to change the shape of the text box and type on a path. However, text wrapping around images and objects is supported in Illustrator but not in Sketch.

**Overflow text**

Sketch doesn’t support overflow text. Illustrator on the other hand does. In Illustrator, a red + icon indicates that there is more text hidden beyond the bounding box. You can click on the icon to continue the text in a different text box. Threading text between objects can be very useful if your design has multiple columns.

![Illustrator, overflow text threaded into a second text box]({{ site.baseurl }}/tmakarem/assets/049_Overflow.png "Illustrator, overflow text threaded into a second text box")

*Illustrator, overflow text threaded into a second text box*

###SEARCHING AND REPLACING FONTS
In Illustrator, you can search for typefaces used in file and replace them. You can view if any fonts are missing and replace them. This feature is not available in Sketch.

![Illustrator find font]({{ site.baseurl }}/tmakarem/assets/050_Find-font.png "Illustrator find font")

*Illustrator find font*

###SPECIAL CHARACTERS AND ADVANCED OPTIONS

![Illustrator Opentype options]({{ site.baseurl }}/tmakarem/assets/051_Opentype.png "Illustrator Opentype options")

*Illustrator Opentype options*

Illustrator also has very useful options for glyphs under the Opentype panel. You can select between tabular or proportional and oldstyle or lining. You can choose the position of type (superscript, subscript, numerator, denominator).

![Tabular, Proportional, Lining, Oldstyle]({{ site.baseurl }}/tmakarem/assets/052_Numbers.png "Tabular, Proportional, Lining, Oldstyle")

You can add decorative elements to your type using stylized characters like swashes(characters with exaggerated flourishes), and titling alternates (characters designed to be used in large-size settings). You can select contextual alternates available for a letter and in context alternate glyphs available for a character. You can also set ordinals and fractions. You can add spaces between characters (EM, EN, hair and thin space).

![Illustrator In-context alternate glyphs]({{ site.baseurl }}/tmakarem/assets/053_Glyphs.png "Illustrator In-context alternate glyphs")

*Illustrator In-context alternate glyphs*

![Ordinals and fractions in Illustrator]({{ site.baseurl }}/tmakarem/assets/054_Ordinals.png "Ordinals and fractions in Illustrator")

*Ordinals and fractions in Illustrator*

Sketch only supports ligatures out of the characters that you find under the Opentype panel in Illustrator. However, most of these characters are rarely used when designing web and mobile applications. Also, the Opentype panel in Illustrator only works for Opentype fonts and many of Opentype fonts don’t include these characters.

When I first started using Sketch, it seemed to be less comprehensive than Illustrator when working with type. However, while Sketch does not offer all the advanced options available in Illustrator, it covers all the basics ones and there are workarounds some of the missing ones.

It is also important to note that when Adobe Illustrator was first developed, its purpose was for typesetting, graphic design, and logo development mainly used for print. The more advanced options that we find in Illustrator come from its print heritage. On the other hand, Sketch is focused on digital design rather than print. While Sketch is less comprehensive than Illustrator, its focus on digital design allows it to be more concentrated on the essential features designers need, and therefore potentially an easier entry point to this sort of tools.
