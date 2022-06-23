---
title: Sculpting Shapes with a WebGL Fragment Shader
date: 2019-10-17 00:00:00 Z
categories:
- mstobbs
- Tech
tags:
- WebGL
- D3FC
author: mstobbs
layout: default_post
image: mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/chisel.jpg
summary: When first using WebGL, even rendering a simple shape can be a challenge.
  In this post, I take a look at the approach we've taken in D3FC to render shapes
  using the fragment shader.
---

I recently had the opportunity to help implement some of the functionality of [D3FC](https://d3fc.io/) in [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API). D3FC is a library which extends the [D3](https://d3js.org/) library, providing commonly used components to make it easier to build interactive charts. 

D3FC was initially created using an SVG implementation. A Canvas implementation was later added, which was generally faster than SVG by an order of magnitude. It still performs slowly, however, when handling more than 10,000 points.

WebGL is a GPU accelerated 3D framework which provides a JavaScript API. By using this to render 2D graphics, we are hoping to render a few orders-of-magnitude faster than Canvas (for a demonstration of this, see Andy Lee's [example](https://bl.ocks.org/DevAndyLee/raw/a901617de28912b1e3cbdc6e86d7ac26/))

Running code on the GPU is significantly quicker than JavaScript, so we want to pass over as much work as possible.

## How Does WebGL Work?

Everything rendered by WebGL is built using triangles. To construct these triangles, we need to define two things - the locations of the vertices and the colour of the individual pixels (or fragments) within the triangle.

![Vertices and fragments of a triangle]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/shaders.jpg "Vertices and fragments of a triangle")

These triangles can be combined to generate detailed, 3D visualisations (check out this [aquarium example](https://webglsamples.org/aquarium/aquarium.html)). However, we only need to worry about 2D environments, which removes a lot of the complexity of WebGL.  For instance, we don't need to worry about lighting or textures.

We define the vertices and the fragments using the creatively named **vertex shader** and **fragment shader**. The vertex shader is called for each vertex and sets the position of that vertex. Similarly, the fragment shader is called for each pixel and determines the colour of that pixel.

Our job, as the developers, is simple:

1. Define the shaders.
2. Pass the data and any other variables to the GPU with **buffers**.
3. Hand our shaders to the GPU.
4. Let the magic happen.

Sounds easy enough, but how do we do all this in practice?

Making a simple D3FC component that renders to WebGL is quite easy. We convert our series data to "triangles", load them into the buffers, and render them using simple shaders. To maximise our performance, however, we want to minimise the number of triangles and move as much computation to the shaders as possible.

This blog explores one approach to this process, looking at how to render circular points with minimal data transferred across buffers and making best use of the shaders.

## Drawing squares

Because each shape has equal height and width, we can perform most of the calculations in the fragment shader without too much waste. Our vertex shader can return a square big enough to contain the shape, and the fragment shader will discard any pixels that aren't needed.

We need to calculate the length of the edges of the square, which we'll call `vSize`. Since we know the area we want our symbol to fill, we can work backwards to calculate `vSize`. For example, to calculate `vSize` for a circle:

~~~glsl
attribute float aSize; // The area of the shape
varying float vSize; // The length of the edge of the square containing the shape

vSize = 2.0 * sqrt(aSize / 3.14159); // Calculate the diameter of the circle from the area
~~~

We pass in `aSize` into the buffers, and our vertex shader uses this to calculate `vSize`.  Because `vSize` is `varying`, it can be passed to the fragment shader.

The vertex shader also needs to define two variables - the point size (`gl_PointSize`) and the point's coordinates (`gl_Position`).

`gl_Position` is a vector with four components (`vec4`). The first three components represent the x, y, and z coordinates of the point. We'll pass the x and y coordinates in through the buffers. Since we're working in 2D space, we don't have to worry about the z coordinate, so we'll set it to 0.

The 4th component of `gl_Position` changes this point into a [homogeneous coordinate](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection#Homogeneous_Coordinates). This is useful when manipulating 3D data. In our case though, we'll leave it as the default of 1.

~~~glsl
attribute float aXValue;
attribute float aYValue;

gl_Position = vec4(aXValue, aYValue, 0, 1);
~~~

`gl_PointSize` will be the length of the square (`vSize`) plus any extra length added by the edge (we'll use this to add a "stroke" to the points later). We can see what this extra length is by imagining the shape lying flat with the edge as a separate layer above it.

![Relationship between vSize and uEdgeSize]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/gl_PointSize.jpg "Relationship between vSize and uEdgeSize")

Each edge is half within the shape and half without. This means the point size becomes `vSize + (0.5 * uEdgeSize) + (0.5 * uEdgeSize)`, or `vSize + uEdgeSize`.

In theory, we're done. In practice, however, there's one more thing we need.

The value we just calculated is continuous. However, we'll be drawing to discrete pixels. This, in addition to only using an approximate value for pi and floating-point errors, can lead to aliasing.

![Source of aliasing]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/gl_PointSize%20Aliasing.jpg "Source of aliasing")

If one of our shape's outer pixel is less than `gl_PointSize` (the blue pixel), then it will render fine. However, if the outer pixel is just outside `gl_PointSize` (the orange pixel), then it will be cut off. To prevent this, we'll add 1 to our `gl_PointSize` to ensure the shape's outer pixels are always rendered.

~~~glsl
uniform float uEdgeSize;

gl_PointSize = vSize + uEdgeSize + 1.0;
~~~

Put this all together, and we have a vertex shader drawing our correctly sized shapes.

![Points as squares]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/Squares.jpg "Points as squares")

So far our circles are looking quite... not round. So let's jump over to the fragment shader and find the statue hidden in the marble.

### Drawing circles

For each pixel of the square, we need to determine whether it is within the shape and if not, discard the pixel. For a circle, this is straightforward - we calculate the distance from the pixel to the centre.

The vertex shader transforms our coordinates into a different coordinate system called [**clip space**](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection#Clip_space). Clip space is a cube that is two units wide and contains the points from one corner (-1, -1, -1) to other (1, 1, 1).

![A 3d graph showing clip space in WebGL.]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/clip-space.JPG "A 3d graph showing clip space in WebGL.")

To convert our points to clip space, we can use [`gl_PointCoord`](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/gl_PointCoord.xhtml). `gl_PointCoord` gives us the two-dimensional coordinates of the point, ranging from 0.0 to 1.0 in both directions. Therefore, to convert `gl_PointCoord` to clip space, we can use `(2.0 * gl_PointCoord) - 1.0`.

Once we map our point to clip space, we can discard any pixels which have a greater distance to (0, 0, 0) than 1. To calculate the distance, we can use [`length`](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/length.xhtml), which will calculate the length of the vector (or, in other words, the distance from the point to the origin).

~~~glsl
varying float vSize;

float distance = length(2.0 * gl_PointCoord - 1.0);
if (distance > 1.0) {
    discard;
}
~~~

![Points as black circles]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/Black%20Circles.jpg "Points as black circles")

That's more like it! Instead of black circles, though, it'd be nice to be able to decorate the points - change the colour, add a border, etc.

### Decorating circles

Changing the colour is uncomplicated. We pass the colour into the buffers and then set `gl_FragColor` to that colour in the fragment shader.

~~~glsl
uniform vec4 uColor;

gl_FragColor = uColor;
~~~

Adding the border is more complicated. We need to calculate whether the pixel we're looking at is on the border and, if it is, colour the pixel the edge colour. Sounds simple but a lot is going on here so let's break it down.

We create a variable called `sEdge`, which will be a float between 0.0 and 1.0. When `sEdge` is 0.0, we keep the existing `gl_FragColor`. When it is 1.0, we set `gl_FragColor` to `uEdgeColor`, which is passed in through the buffer. Any number in between will result in a blend between the two colours.

How do we calculate `sEdge`? It's easier to see what's happening in 1D. Imagine a line being drawn from the centre of the shape to the edge. Part of that line will be the shape colour and part will be the border colour. We need a function that will set `sEdge` to 0.0 at the points of the line where it should be the shape colour, 1.0 at the border and a number in between during the transition between the two. We'll use the intermediate numbers to smooth the transition. This reduces the aliasing that can occur when square pixels try to represent a curved edge. 

![Smoothstep values on a line]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/Smoothstep%20line.jpg "Smoothstep values on a line")

Fortunately, WebGL provides us with that function. `smoothstep` takes three arguments: `edge0`, `edge1` and `x`.

-	If `x` is less than `edge0`, the function returns 0.0.
-	If `x` is greater than `edge1`. the function returns 1.0.
-	If `x` is in between `edge0` and `edge1`, the function returns a number between 0.0 and 1.0, using a [Hermite polynomial](https://en.wikipedia.org/wiki/Hermite_polynomials).

We're nearly there - we now need to figure out what `edge0`, `edge1` and `x` are.

`edge1` is where the edge starts, so it is `vSize - uEdgeSize`.

`edge0` is where the colour transition starts, so it is `edge1` minus the size of the "transition gap" (where the `sEdge` is transitioning from 0.0 to 1.0). The greater we set this number, the greater the smoothing of the transition between the shape colour and the edge colour. A smaller number increases the sharpness of the transition but also increases the probability of aliasing.

![Gradients of different sizes]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/edge0.jpg "Gradients of different sizes")

2.0 removes the aliasing while maintaining the sharp line that we want, so we'll set `edge0` as `vSize - uEdgeSize - 2.0`.

Because we previously represented `distance` in clip space, it is a number between 0 and 1. We can use this number as the fraction of the total distance of the pixel from the centre to the edge of the shape. For example, if `distance = 0.5`, the pixel is halfway between the centre and the edge. Thus, to calculate where the pixel is, we need to multiply `distance` by the point size. This gives us `x = distance * (vSize + uEdgeSize)`.

Put all this together, and we have our answer!

~~~glsl
uniform vec4 uEdgeColor;
uniform float uEdgeSize;

float sEdge = smoothstep(
    vSize - uEdgeSize - 2.0,
    vSize - uEdgeSize,
    distance * (vSize + uEdgeSize)
);
gl_FragColor = (uEdgeColor * sEdge) + ((1.0 - sEdge) * gl_FragColor);
~~~

![Points as grey circles with borders]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/Grey%20Circles%20with%20Borders.jpg "Points as grey circles with borders")

Ok, we're almost done, there's one last thing to handle. If you look closely at the edges of the circles, you can see they're still jagged. So our final step is to implement some [anti-aliasing](https://helpx.adobe.com/photoshop/key-concepts/aliasing-anti-aliasing.html).

### Anti-aliasing circles

We'll use a similar technique as before, but instead of smoothing the shape colour into the border, we'll smooth the border colour into the background. We'll choose a transition size of 2.0 for the same reasons as before.

~~~glsl
gl_FragColor.a = gl_FragColor.a * (1.0 - smoothstep(
    vSize - 2.0,
    vSize,
    distance * vSize
));
~~~

![Points as grey circles with anti-aliasing]({{ site.baseurl }}/mstobbs/assets/sculpting-shapes-with-webgl-fragment-shader/Grey%20Circles%20with%20Anti-Aliasing.jpg "Points as grey circles with anti-aliasing")

And we're done!

### Other shapes

Although we've used circles as an example, the same principles apply for any shape. All that needs to be adapted are the calculations for `vSize` and `distance`.

In the case of other shapes, `distance` won't be the actual distance but a number which is greater than 1.0 only for the pixels which lie outside the shape. For example, `distance` for a square could be calculated with:

~~~glsl
vec2 pointCoordTransform = 2.0 * gl_PointCoord - 1.0;
float distance = max(abs(pointCoordTransform.x), abs(pointCoordTransform.y));
~~~

Here we once again convert `gl_PointCoord` to clip space. We take the maximum absolute value of the x and y coordinate. In this way, if either the x or y coordinate is greater than 1.0 (or less than -1.0), we know it is outside of the square and can be discarded.

## Conclusion - Why are we doing this again?

Using this approach has plenty of advantages.

[`GL_POINT`](https://en.wikibooks.org/wiki/OpenGL_Programming/GLStart/Tut3#Immediate_Mode) works well when drawing a large number of small 2D items. If we used `GL_TRIANGLE_STRIP`, for example, we'd have to calculate how to draw each shape using triangles. Using each vertex as a point means we don't have to worry about geometry.

In addition, [procedural rendering](https://en.wikipedia.org/wiki/Procedural_generation) of the shape in the fragment shader is fast. It also still allows changes in size without resulting in [scaling artifacts](http://www.glennchan.info/broadcast-monitors/scaling-artifacts/scaling-artifacts.htm).
