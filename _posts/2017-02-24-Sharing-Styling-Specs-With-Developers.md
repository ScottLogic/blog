---
title: Sharing styling specs with developers
date: 2017-02-24 00:00:00 Z
categories:
- tmakarem
- UX Design
tags:
- UX Design
author: tmakarem
layout: default_post
image: tmakarem/assets/featured/spec.png
summary: This post looks at the pros and cons of some of the automated handoff tools
  available for designers to share style specs with developers.
---

When we design websites and applications, we decide on elements such as colours, fonts, layout, grids, components (e.g. buttons, tables, tabs), gestures and transitions. Throughout the process, we hand over designs to developers. To ensure that design decisions are captured, we also provide styling specifications. These are a combination of style guides, information architecture maps, annotated mockups and/or prototypes of the flow and transitions.

The process of creating these guides is time consuming and not always effective because things get missed or misinterpreted. A variety of tools have emerged in the last few years to help ease the handoff process. Some of these tools are standalone, and some are integrated within design applications either through plugins or as part of the application.

![Design handoff tools]({{ site.baseurl }}/tmakarem/assets/023_Design-handoff-tools.png "Design handoff tools")
<br/>
*Design Handoff tools (Left to right: Sketch, InVision, PNG Express, Measure Plugin for Sketch, Marketch, Avocode, Zeplin, Markly, InVision’s Craft, React Storybook)*

In this post, I look at a few of the design handoff tools that focus on sharing specs (spacing, properties, dimensions, colours) rather than flow, transitions or interactions. I point out their strengths and weaknesses based on my personal experience using them.

###WHAT MAKES A GOOD HANDOFF TOOL?

I believe a good handoff tool is one that

<p style="font-size: 110%; font-weight: 100; margin: 1.2em 1.4em;">
1. Generates and displays specs in the design tool
<br/>
2. Creates easily sharable outputs
<br/>
3. Syncs specs when designs are updated
<br/>
4. Categorizes the specs to distinguish between properties (e.g. Fonts, colours), assets (e.g. SVGs, bitmap), and parameters (e.g. Spacing between objects, sizes)
</p>

###MARKETCH

Plugins like *[Marketch](http://sketchapp.rocks/plugins/marketch/)*, *Measure* or *Craft’s Inspect* can annotate the dimensions between and of objects on a screen and the style used for a specific object.

*Marketch* is a free *Sketch* plugin that allows you to export specs as a ZipFile. The file generated includes an HTML page on which you can measure specs and export assets. The downside is that you can’t see any of these specs while working on the design in *Sketch*. You can only see the specs once you export. Another limitation is that the HTML page generated is not ideal for sharing the specs because you have to take care of hosting it somewhere suitably accessible for others yourself. The specs are not synced with the designs in *Sketch* so they don’t get updated when you edit the design. If you change the designs after you export the specs, you need to manually generate a new file and override any previous exports.

![Design handoff tools]({{ site.baseurl }}/tmakarem/assets/024_Marketch.png "Marketch")
<br/>
*Marketch, snapshot of HTML page generated when specs are exported*

Like *Marketch*, the free *[Measure](https://github.com/utom/sketch-measure)* plugin for *Sketch* generates an HTML page of the specs. However, with *Measure* you can see the specs on the design within *Sketch*. You can add the specs on the artboard, which creates different folders for these. You can group all the folders generated under one so you can toggle viewing the specs on and off.

Another useful thing about *Measure* is that it distinguishes between specs for sizing, spacing, and properties.

Using *Measure*, you can generate a list of all the colours you want to add to the specs and rename them. The list appears on the HTML page generated when you export the specs. You can also select icons and objects in *Sketch* and make them exportable. When you export the specs, the HTML page would include the sliced objects. This is useful for sharing assets with developers because they can download them directly from the HTML page.

*Measure* has its limitations too. While it allows you to see the specs on the design, it creates them as shapes so if you edit the design, the specs don’t get updated. You would need to manually delete them and create new ones.

It is also not immediately obvious that making something exportable will add it as a slice in the HTML page generated once you export the specs. This feature is not easily discoverable.

![Sketch measure plugin]({{ site.baseurl }}/tmakarem/assets/025_Measure1.png "Measure")
<br/>
*Sketch measure plugin*

![Measure plugin for Sketch]({{ site.baseurl }}/tmakarem/assets/026_Measure2.png "Measure")
<br/>
*Measure plugin for Sketch*

![Measure HTML page generated when specs are exported]({{ site.baseurl }}/tmakarem/assets/027_Measure3.png "Measure")
<br/>
*Measure HTML page generated when specs are exported*

###ILLUSTRATOR

Applications like *[Adobe Illustrator](http://www.adobe.com/uk/products/illustrator.html?sdid=JRSIX&mv=search&s_kwcid=AL!3085!3!176179195832!b!!g!!illustrator%20adobe&ef_id=VuFCbQAABM2qoHFs:20170202171549:s)*, have features that help with design handoff embedded in them. You can export swatches, paragraph styles and character styles as a CSS file. If you select a text box in *Illustrator*, it will be recognized as text and the CSS properties generated would include “font-family”, “font-size” and “colour”. However, if you group text boxes, *Illustrator* will treat these as a generic object and the CSS properties window will show properties for a generic object such as “width” and “height” rather than text-specific properties. *Measure* plugin makes the same distinction between one text box and a group of text boxes.

You can share a visual style guide, by creating and sharing a *Creative Cloud Library*. You would expect *Illustrator* to automatically create the library based on the design. However, It is not very straightforward because you need to manually select and add elements such as text styles and colours to the library.  

While it allows you to share text styles and colours, *Illustrator* doesn’t allow you to export distances between or sizes of objects. You can use the measuring tool to manually measure the dimensions but Illustrator does not generate and show those measurements automatically.

![Adobe Illustrator CSS Extraction, Extracting text styles]({{ site.baseurl }}/tmakarem/assets/028_Illustrator-css-extraction.png "Adobe Illustrator CSS Extraction, Extracting text styles")
<br/>
*Adobe Illustrator CSS Extraction, Extracting text styles*

![Adding swatches to library]({{ site.baseurl }}/tmakarem/assets/030_Illustrator-adding-swatches.png "Adding swatches to library")
<br/>
*Adding swatches to library*

![Adobe CC library]({{ site.baseurl }}/tmakarem/assets/031_Illustrator-library.png "Adobe CC library")
<br/>
*Adobe CC library*

###INVISION CRAFT AND INSPECT

One of the many features of *[InVision's Craft](https://www.invisionapp.com/craft)* plugin for *Sketch* is creating specifications, and it offers something a little different to the other plugins I have covered.

It allows you to generate a dynamic style guide within *Sketch*. By clicking on “sync styles” under the *Craft* library, you can generate a page with artboards for colour palette, fonts and text styles used.

The style guide is similar to the *Adobe CC* library. When designers edit the designs, they can sync the artboards to update the style guide. This helps give designers a quick overview of all the styles they used while they are working on the design. It allows them to ensure consistency and fix any discrepancies (e.g. two similar colours that should be one).

You can use *Craft* along with *InVision’s Inspect* tool to benefit from viewing the specs on the design and the collaboration that tools like *Zeplin* and *Measure* facilitate.

![Craft library sync styles]({{ site.baseurl }}/tmakarem/assets/032_craft.png "Craft library sync styles")
<br/>
*Craft library sync styles*

###Zeplin

*[Zeplin](https://zeplin.io/)* is a tool for both designers and developers, but it is also a plugin for *Sketch*. It allows you to export an artboard from *Sketch* and import it into *Zeplin*. It generates a web link for the design where you can invite collaborators.

When you’ve imported the artboard into *Zeplin*, you can then look at the style guide tab which shows you all the styles used in the design. You can add all of them to the stylesheet or select the ones you want.

![Zeplin, Text styles added to stylesheet]({{ site.baseurl }}/tmakarem/assets/035_zeplin3.png "Zeplin, Text styles added to stylesheet")
<br/>
*Zeplin, Text styles added to stylesheet*

You can then export the stylesheet as a CSS/Sass/SCSS/Less/Stylus file, which a developer can edit and use to implement the design. Because the tool offers different formats for the stylesheet, it makes it easier for developers to integrate it with other frameworks.

You can select specific elements from the design and view the css or download icons as SVG.

While *Zeplin* is good for collaboration, it poses the inconvenience of having to use yet another tool.

![Zeplin, Select the stylesheet language]({{ site.baseurl }}/tmakarem/assets/036_zeplin4.png "Zeplin, Select the stylesheet language")
<br/>
*Zeplin, Select the stylesheet language*

![Zeplin, Select elements from the design to inspect or download as svg]({{ site.baseurl }}/tmakarem/assets/038_zeplin6.png "Zeplin, Select elements from the design to inspect or download as svg")
<br/>
*Zeplin, Select elements from the design to inspect or download as svg*

###CONCLUSION

Outputs from design handoff tools can be a useful starting point for developers to implement styles. Traditionally, designers have manually created these specs; a time-consuming and monotonous task. Automated design handoff tools potentially provide a more efficient way for facilitating the collaboration between designers and developers. The thing to be wary of is using the exported code to replace traditional processes of writing stylesheets because it can encourage bad practices in development.
