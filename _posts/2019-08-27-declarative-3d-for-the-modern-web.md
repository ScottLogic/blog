---
title: 'X3D: Declarative 3D for the Modern Web'
date: 2019-08-27 00:00:00 Z
categories:
- Tech
author: asureshkumar
layout: default_post
summary: In this post we look at X3D and how it offers a simple declarative approach
  for including 3D visualisations in web pages in a way that is supported by major
  browsers.
---

## Introduction
Modern web technologies enable developers to create clean, yet visually rich, user experiences which are widely supported as standard by all of the major browsers.

So, how do you actually go about writing standards-based visualisations for the web...? And what support is there exactly for 3D graphics?

Let's start by reviewing the two main supported approaches in the [HTML standard](https://html.spec.whatwg.org/multipage/): SVG and Canvas.

## SVG: Scalable Vector Graphics
[SVG](https://www.w3.org/TR/SVG11/) is itself a standalone XML-based format for declarative 2D vector-graphics. However, it can also be embedded within a HTML document and this is [supported](https://caniuse.com/#feat=svg)  by all of the major browsers.

Let's consider an [example]({{ site.github.url }}/asureshkumar/assets/2019-08-27-declarative-3d-for-the-modern-web/circle-svg.html) of how you might use SVG to draw a resizable circle: 

~~~ html
<html style="height: 100%; width: 100%">
  <body style="height: 100%; width: 100%; margin: 0px">
    <svg style="height: 100%; width: 100%; display: block" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="25" fill="red" stroke="black"
              vector-effect="non-scaling-stroke" />
    </svg>
  </body>
</html>
~~~

Hopefully it is pretty straightforward to understand this code! We are simply providing the browser with a description of __what__ to draw (much like with a traditional HTML document). It retains this description and takes responsibility for how to render it on the screen.

It will re-scale the image when the browser window is resized or zoomed without any loss of quality (as the image is defined in terms of shapes rather than pixels). It will also re-render the image automatically when the SVG elements get mutated by JavaScript code. This makes it particularly suitable for use with JavaScript libraries such as [D3](https://d3js.org/) which bind data to elements in the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) to create anything from simple charts to more exotic interactive visualisations of the data.

This __declarative__ approach is also known as _retained-mode_ graphics rendering.

## Canvas
The [canvas element](https://html.spec.whatwg.org/multipage/canvas.html) simply provides an area on a webpage onto which you can draw. Using JavaScript code you first obtain a context from the canvas and then use the provided API to define a procedure for __how__ to draw an image.

~~~ javascript
const canvas = document.getElementById(id);
const context = canvas.getContext(contextType);

// call some methods on context to draw onto the canvas
~~~

When the script is executed, the drawing is immediately rendered to the pixels of an underlying bitmap; the browser does not retain any information about how it was drawn. In order to update the drawing, the script needs to be executed again. This also includes when re-scaling the image; otherwise the browser would just stretch the original bitmap leading to a visibly blurry or pixellated image.

This __procedural__ approach is also known as _immediate-mode_ graphics rendering.

#### Context: 2D
First of all lets consider the `2d` rendering context, which provides a high-level API for drawing 2D graphics onto a canvas.

Let's take a look at an [example]({{ site.github.url }}/asureshkumar/assets/2019-08-27-declarative-3d-for-the-modern-web/circle-canvas-2d.html) of how you might use it to draw our resizable circle:

~~~ html
<html style="height: 100%; width: 100%">
  <body style="height: 100%; width: 100%; margin: 0px">
    <canvas id="my-canvas" style="height: 100%; width: 100%; display: block"></canvas>
    <script>
      const canvas = document.getElementById("my-canvas");
      const context = canvas.getContext("2d");
      
      function render() {
        // Size the drawing surface to match the actual element (no stretch).
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;

        context.beginPath();

        // Calculate relative size and position of circle in pixels.
        const x = 0.5 * canvas.width;
        const y = 0.5 * canvas.height;
        const radius = 0.25 * Math.min(canvas.height, canvas.width);

        context.arc(x, y, radius, 0, 2 * Math.PI);
        
        context.fillStyle = "red";
        context.fill();
        
        context.strokeStyle = "black";
        context.stroke();
      }
      
      render();
      addEventListener("resize", render);
    </script>
  </body>
</html>
~~~

Once again, this is fairly simple, but it is certainly more verbose than the previous example! We have to calculate the radius and centre position of the circle ourselves in pixels, based on the current size of the canvas. This also means we have to listen to resize events and re-render accordingly.

So why would you want to use this approach rather than an SVG? Well in most scenarios you probably don't. However, what this does give you is more control over what is being rendered. For more complex dynamic visualisations made up of a lot of objects, it can be more performant than updating lots of elements in the DOM and letting the browser work out when and what to render.

### Context: WebGL
Most modern browsers also [support](https://caniuse.com/#feat=webgl) the `webgl` context. This provides you with a low-level API for drawing hardware-accelerated graphics using the [WebGL](https://www.khronos.org/webgl/) standard, although it does require GPU support to do this. It can be used for rendering both 2D, and perhaps more significantly for this blog post, 3D graphics.

Let's now take a look at an [example]({{ site.github.url }}/asureshkumar/assets/2019-08-27-declarative-3d-for-the-modern-web/circle-canvas-webgl.html) of how to render our circle using WebGL:

~~~ html
<html style="height: 100%; width: 100%">
  <body style="height: 100%; width: 100%; margin: 0px">
    <canvas id="my-canvas" style="height: 100%; width: 100%; display: block"></canvas>
    <script>
      const canvas = document.getElementById("my-canvas");
      const context = canvas.getContext("webgl");

      const redColor = new Float32Array([1.0, 0.0, 0.0, 1.0]);
      const blackColor = new Float32Array([0.0, 0.0, 0.0, 1.0]);

      // Use an orthogonal projection matrix as we're rendering in 2D.
      const projectionMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
      ]);

      // Define positions of the vertices of the circle (in clip space).
      const radius = 0.5;
      const segmentCount = 360;
      const positions = [0.0, 0.0];
      for (let i = 0; i < segmentCount + 1; i++) {
      	positions.push(radius * Math.sin(2 * Math.PI * i / segmentCount));
        positions.push(radius * Math.cos(2 * Math.PI * i / segmentCount));
      }

      const positionBuffer = context.createBuffer();
      context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);

      // Create shaders and program.
      const vertexShader = context.createShader(context.VERTEX_SHADER);
      context.shaderSource(vertexShader, `
        attribute vec4 position;
        uniform mat4 projection;

        void main() {
          gl_Position = projection * position;
        }
      `);
      context.compileShader(vertexShader);
      
      const fragmentShader = context.createShader(context.FRAGMENT_SHADER);
      context.shaderSource(fragmentShader, `
        uniform lowp vec4 color;

        void main() {
          gl_FragColor = color;
        }
      `);
      context.compileShader(fragmentShader);

      const program = context.createProgram();
      context.attachShader(program, vertexShader);
      context.attachShader(program, fragmentShader);
      context.linkProgram(program);

      const positionAttribute = context.getAttribLocation(program, 'position');

      const colorUniform = context.getUniformLocation(program, 'color');
      const projectionUniform = context.getUniformLocation(program, 'projection');
      
      function render() {
        // Size the drawing surface to match the actual element (no stretch).
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;

        context.viewport(0, 0, canvas.width, canvas.height);

        context.useProgram(program);

        // Scale projection to maintain 1:1 ratio between height and width on canvas.
        projectionMatrix[0] = canvas.width > canvas.height ? canvas.height / canvas.width : 1.0;
        projectionMatrix[5] = canvas.height > canvas.width ? canvas.width / canvas.height : 1.0;
        context.uniformMatrix4fv(projectionUniform, false, projectionMatrix);

        const vertexSize = 2;
        const vertexCount = positions.length / vertexSize;

        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
        context.vertexAttribPointer(positionAttribute, vertexSize, context.FLOAT, false, 0, 0);
        context.enableVertexAttribArray(positionAttribute);

        context.uniform4fv(colorUniform, redColor);
        context.drawArrays(context.TRIANGLE_FAN, 0, vertexCount);

        context.uniform4fv(colorUniform, blackColor);
        context.drawArrays(context.LINE_STRIP, 1, vertexCount - 1);
      }

      render();
      addEventListener("resize", render);
    </script>
  </body>
</html>
~~~

That escalated rather quickly! There is a quite a lot of setup going on before we even render anything. We have to define our circle as a sequence of small triangles using a list of vertices. We also have to define a projection to take our 3D model (of a flat circle) and project it onto the 2D canvas. We then have to write "shaders" (in a language called GLSL) which get compiled and run on the GPU in order to determine the positions and colours of the vertices.

However, the additional complexity and lower-level API does give us even more control over the performance of rendering 2D graphics (if we really need it). It also gives us the ability to render 3D visualisations, even if we have not considered an example of this yet.

## Towards Declarative 3D Graphics
We've now looked at WebGL and seen how we can use it to draw a circle. As we move into the world of 3D graphics, the next logical step would therefore be to use it to draw a sphere. However, this adds another level of complexity as we will need to work out how to use a set of vertices to represent the surface of our sphere. We'll also need to add some lighting effects so that we can actually see the contours of a sphere, rather than just a flat red circle from any angle that you happen to look at it.

We've also seen how simple and concise declarative approaches such as SVG can be for scenarios where absolute performance is not critical. They can also enable us to easily produce visualisations linked to data using libraries like D3. So wouldn't it be better if we could somehow represent web-based 3D graphics in a similar way?

Alas there is currently no support for doing this as standard in HTML. But maybe there is another way...

As Mike Bostock (the creator of D3) demonstrated in a [proof of concept](https://bl.ocks.org/mbostock/1276463) it is relatively straightforward to define a custom XML representation of a 2D "sketch" in the DOM and combine it with some JavaScript code to render it onto a canvas using the `2d` context.

This means that all that is really needed for declarative 3D that will run on all major browsers is:

1. An XML-based format for declaring 3D models
2. JavaScript code to render them onto a canvas using the `webgl` context

## X3D - The missing piece of the puzzle?
[X3D](https://www.web3d.org/x3d) is an ISO standard for representing 3D models and is the successor to the Virtual Reality Modelling Language (VRML). It can be represented in various encodings including JSON and XML; the latter being particularly suited for embedding within an HTML document. It is maintained by the [Web3D Consortium](https://www.web3d.org/) who have [aspirations](https://www.web3d.org/html-3d) for it to become natively supported in HTML5 in a similar way to SVG.

There are currently two open source JavaScript implementations of X3D recognised by the Web3D Consortium: [X3DOM](https://www.x3dom.org/) and [X_ite](http://create3000.de/x_ite/).

X3DOM was developed by [The Fraunhofer Institute for Computer Graphics Research IGD](https://www.igd.fraunhofer.de/en) who are themselves a member of the  Web3D consortium. In order to use it you just need to include the X3DOM JavaScript code and stylesheet in your HTML page.

Let's take a look at what our circle [example]({{ site.github.url }}/asureshkumar/assets/2019-08-27-declarative-3d-for-the-modern-web/circle-x3dom.html) would be like using X3D with X3DOM:

~~~ html
<html style="height: 100%; width: 100%">
  <head>
    <script type="text/javascript" src="http://www.x3dom.org/release/x3dom-full.js"></script>
    <link rel="stylesheet" type="text/css" href="http://www.x3dom.org/release/x3dom.css">
    <style>x3d > canvas { display: block; }</style>
  </head>
  <body style="height: 100%; width: 100%; margin: 0px">
    <x3d style="height: 100%; width: 100%">
      <scene>
        <orthoviewpoint></orthoviewpoint>
        <shape>
          <appearance>
            <material diffuseColor="1 0 0"></material>
          </appearance>
          <disk2d outerRadius="0.5"></disk2d>
        </shape>
        <shape>
          <appearance>
            <material emissiveColor="0 0 0"></material>
          </appearance>
          <circle2d radius="0.5"></circle2d>
        </shape>
      </scene>
    </x3d>
  </body>
</html>
~~~

That's a bit more palatable than the WebGL example! However, if you compare the X3DOM circle with our WebGL version, you will notice that the circumference appears to be less smooth. This is because the X3DOM library's approximation of the shape uses 32 segments; whereas we chose to use 360 in our implementation. We have a much simpler description of what to render, but at the same time have given up some control over how it is rendered.

Now it's _finally_ time to step out of our "flat" world and render something in 3D! As mentioned before let's have a look at a [sphere]({{ site.github.url }}/asureshkumar/assets/2019-08-27-declarative-3d-for-the-modern-web/sphere-x3dom.html):

~~~ html
<html style="height: 100%; width: 100%">
  <head>
    <script type="text/javascript" src="http://www.x3dom.org/release/x3dom-full.js"></script>
    <link rel="stylesheet" type="text/css" href="http://www.x3dom.org/release/x3dom.css">
    <style>x3d > canvas { display: block; }</style>
  </head>
  <body style="height: 100%; width: 100%; margin: 0px">
    <x3d style="height: 100%; width: 100%">
      <scene>
        <orthoviewpoint></orthoviewpoint>
        <navigationinfo headlight="false"></navigationinfo>
        <directionallight direction="1 -1 -1" on="true" intensity="1.0"></directionallight>
        <shape>
          <appearance>
            <material diffuseColor="1 0 0"></material>
          </appearance>
          <sphere radius="0.5"></sphere>
        </shape>
      </scene>
    </x3d>
  </body>
</html>
~~~

Once again that was quite straightforward. We have defined a sphere using an XML element with a single attribute specifying the radius. In order to see the contours of the sphere we have also adjusted the lighting, removing the default light source aligned with the viewer's head and replacing it with a directional light at an angle to our viewpoint. There was no need to define a complicated mesh for the sphere's surface or write a shader to control the lighting effect.

X3DOM also provides navigation out of the box, allowing you to rotate, pan and zoom the model. There are also various different control schemes and [navigation modes](https://doc.x3dom.org/tutorials/animationInteraction/navigation/index.html) available depending on the type of application that you are writing.

## Conclusion

That's it! We've seen that we can use X3D with the X3DOM library to write declarative 3D graphics that will run in most modern web browsers. It is a much simpler way to get started with 3D graphics for the web than diving straight into WebGL, at the expense of control over the underlying rendering. If you are interested in finding out more about this library, there are some [tutorials](https://doc.x3dom.org/tutorials/index.html) in the official X3DOM documentation.

In my [next blog post]({{ site.github.url }}/2019/10/03/how-to-make-3d-charts-for-the-web-using-d3-and-x3dom.html), I will be demonstrating how to combine X3DOM with D3 to produce dynamic 3D charts.

_Updated 19 September 2019: Consistent shape sizing and removal of vertical scrollbars in code examples._