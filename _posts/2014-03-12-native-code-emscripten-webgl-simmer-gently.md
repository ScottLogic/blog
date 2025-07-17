---
title: Native code + Emscripten + WebGL. Simmer gently.
date: 2014-03-12 00:00:00 Z
categories:
- Tech
tags:
- blog
author: ilopatkin
image: ilopatkin/assets/featured/debug.png
layout: default_post
summary: An emeging recipe that can change the way we make rich web apps.
oldlink: http://www.scottlogic.com/blog/2014/03/12/native-code-emscripten-webgl-simmer-gently.html
disqus-id: "/2014/03/12/native-code-emscripten-webgl-simmer-gently.html"
---

Yep, it's WebGL and Native together. This is a short tutorial on using [Emscripten](https://github.com/kripken/emscripten) to integrate a C++/OpenGL code with JS environment. There are some other tutorials on the net you might want to have a look at if you want to simply convert an existing native app and not bother with web-specific input events or render loops ([gears](http://ehsanakhgari.org/blog/2012-01-25/porting-opengl-application-web),[simplegl](http://www.joshuagranick.com/blog/2013/04/21/deploying-cpp-to-javascript-using-emscripten/)). If you have some native code you want to use within a bigger webapp, e.g., write a JS API around your existing library, read on. Also there are some conclusions regarding performance and maturity of Emscripten+WebGL solutions closer to the end of this page.

## Quick links
[Live demo](http://ilyalopatkin.github.io/emscripten_webgl_simmer_gently) for results (we suggest you use Chrome or Opera).

[Github project](https://github.com/ilyalopatkin/emscripten_webgl_simmer_gently) for sources.

Build instructions:

1. Install the [Emscripten](https://github.com/kripken/emscripten) toolset
2. Build the project using `make` (or `mingw32-make`)
3. Open `index.html` in your chrowser.

## Introduction

In this tutorial we give an introduction to how Emscripten-generated code could be integrated with the rest of your web-app, and there are some sources and build files that might be helpful for a quick start. It's a simplified outcome of what we actually did as a (successful) experiment over one of our commercial products.

Emscripten is an LLVM-to-Javascript compiler that... well.. if you know what a compiler is, that pretty much explains the whole thing. Now we can write code in anything that compiles to LLVM (and this includes C++), run Emscripten and get a JS equivalent. It does not bring full coverage of C++ features but a reasonable subset of features is there and if you are not using anything fancy (and most people don't) you should be able to convert your code to JS without much trouble. The major feature here is that the resultant JS code is not a syntactical translation but a bytecode-level translation which means things like pointers to functions returning pointers to pointers to.. would work. You can see the output as a kind of a virtual machine written in JS that executes your C++ code. Plus it uses [WebGL]({{ site.baseurl }}/2014/03/11/a-developers-intro-to-webgl.html) as a back-end for your normal GL calls. As a result, all sorts of native libraries and apps are now possible to port to JS that would seem crazy some few years ago: [Unreal Engine 3](https://www.unrealengine.com/news/epic-games-releases-epic-citadel-on-the-web), [Nebula 3](http://www.flohofwoe.net/demos.html), [ffmpeg](http://bgrins.github.io/videoconverter.js), etc.

## Setup

First of all, get Emscripten installed: [https://github.com/kripken/emscripten/wiki/Emscripten-SDK](https://github.com/kripken/emscripten/wiki/Emscripten-SDK)

Make sure `emcc` is visible in your environment, typing `emcc` in console/cmd should return something like this:

{% highlight sh %}
C:\whatever\folder>emcc
WARNING  root: no input files
{% endhighlight %}

which means emcc is installed and wants to do some job. You must also have `clang`, `python`, and `node` installed. I strongly recommend going through the [Emscripten tutorial](https://github.com/kripken/emscripten/wiki/Tutorial) to make sure the whole toolchain is installed and working fine.

## Getting the code

Download the project files manually from [here](https://github.com/ilyalopatkin/emscripten_webgl_simmer_gently) or type

{% highlight sh %}
git clone https://github.com/ilyalopatkin/emscripten_webgl_simmer_gently
{% endhighlight %}

There are three files containing native C code, but let's pretend there are hundreds of classes and millions of loc :-) If you don't want to download anything and just skim through, I give here some bits of code and a general picture of what's happening.

The `shaders` couple of files have functions for compiling shaders and linking GL programs:

`shaders.h`

{% highlight c++ %}

#include <GLES2/gl2.h>
GLuint loadShader(GLenum type, const char *source);
GLuint buildProgram(GLuint vertexShader, GLuint fragmentShader, const char * vertexPositionName);
{% endhighlight %}

The `main.cpp` uses those to initialise the actual shaders. There are two functions in `main.cpp`: `initGL` initialises an SDL screen which in turn initialises the GL context, and `drawTriangle` (surprise!) draws a triangle. Note that there is no `main` entry point and in order to initialise the context and draw something, we actually need to call the two functions from somewhere. And that "somewhere" will be our JS code. The code is quite self-explanatory for those that have ever used OpenGL before.

`a bit of main.cpp`

{% highlight c++ %}

#include "shaders.h"

GLuint programObject;
SDL_Surface* screen;

GLfloat vVertices[] = {
    0.0f, 0.5f, 0.0f,
    -0.5f, -0.5f, 0.0f,
    0.5f, -0.5f, 0.0f
};
GLint uniformOriginX, uniformOriginY, uniformZoom;

extern "C" int initGL(int width, int height)
{
    //initialise SDL
    if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO | SDL_INIT_TIMER) == 0)
        //set video mode
    else return 0;

    //SDL initialised successfully, now load shaders and geometry
    const char vertexShaderSource[] = ...
    ...
    GLuint vertexShader = loadShader(GL_VERTEX_SHADER, vertexShaderSource);
    GLuint fragmentShader = loadShader(GL_FRAGMENT_SHADER, fragmentShaderSource);
    programObject = buildProgram(vertexShader, fragmentShader, "vPosition");
    //save location of uniform variables
    uniformOriginX = glGetUniformLocation(programObject, "originX");
    ...
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    glViewport(0, 0, width, height);
    return 1;
}

extern "C" void drawTriangle(float *translation)
{
    glClear(GL_COLOR_BUFFER_BIT);
    glUseProgram(programObject);
    //set up the translation
    ...
    //set up the vertices array
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, vVertices);
    glEnableVertexAttribArray(0);
    //draw the triangle
    glDrawArrays(GL_TRIANGLES, 0, 3);
    //swap buffer to make whatever we've drawn appear on the screen
    SDL_GL_SwapBuffers();
}
{% endhighlight %}

Let us compile this code. Go to the directory with the files and type

{% highlight sh %}
emcc main.cpp shaders.cpp -s FULL_ES2=1 -o glcore.js
{% endhighlight %}

It should generate a file named `glcore.js` that contains our "compiled" library. You can have a look what has been generated but it's not really meant to be edited or read. We are able to debug this though but a bit later on that.

## The Javascript / Typescript part

Now that we have our C++ library ported to JS, we can call its functions from our JS code.

The web side of our tutorial makes use of [TypeScript](http://www.typescriptlang.org/) which is basically a bit of OO syntactic sugar over JavaScript plus static type-checking. Overall, you can get away staying with JavaScript of course but you'd be better off using TypeScript for this tutorial. Given that you would already have `node` installed, getting TypeScript is as simple as

{% highlight sh %}
npm install -g typescript
{% endhighlight %}

Here are some bits of TypeScript code doing most of the gluing work (note the file extensions):

`triangle.ts`

{% highlight javascript %}
module TriangleExample {
    //type declarations for emscripten module and wrappers
    declare var Module: {
        cwrap: (name: string, returnType: string, params: string[]) => any;
        setValue: (ptr: number, value: number, type: string) => void;
    }
    declare var _malloc: (number) => number;
    declare var _free: (number) => void;

    //bindings to C++ functions
    class Bindings {
        public static initGL: (width: number, height: number) => number
            = Module.cwrap('initGL', 'number', ['number', 'number']);
        public static drawTriangle: (translationPtr: number) => void
            = Module.cwrap('drawTriangle', '', ['number']);
    }

    //a helper for some JS-to-Emscripten conversions
    class HeapUtils {
        public static floatArrayToHeap(arr: number[]): number {
            var arrayPointer = _malloc(arr.length * 4);
            for (var i = 0; i < arr.length; i++)
                Module.setValue(arrayPointer + i * 4, arr[i], 'float');
            return arrayPointer;
        }
    }

    //our program that draws a triangle
    export class Program implements IPanZoomable {
        //current translation of the triangle
        private translation = { originX: 0, originY: 0, zoom: 1.0 };
        ...

        constructor(private canvas: HTMLCanvasElement) {
            //initialise the GL context, call the compiled native function
            var initialised = Bindings.initGL(canvas.width, canvas.height);
            ...
            //request redraw
            this.invalidate();
        }

        //translate the whole GL scene by offset
        pan(offset: Point) {
            var glOffset = {
                x: offset.x / this.canvas.width * 2.0 / this.translation.zoom,
                y: offset.y / this.canvas.height * 2.0 / this.translation.zoom
            };
            this.translation.originX += glOffset.x;
            this.translation.originY -= glOffset.y;
            this.invalidate();
        }
        ...

        //render the scene
        private render() {
            //convert the JS array to an emscripten float array
            var translationPtr = HeapUtils.floatArrayToHeap(
                [this.translation.originX,
                 this.translation.originY,
                 this.translation.zoom]);
            //call the native draw function
            Bindings.drawTriangle(translationPtr);
            //free the array memory
            _free(translationPtr);
        }

        public invalidate() {
            window.requestAnimationFrame(this.render.bind(this));
        }
    }
}
{% endhighlight %}

Emscripten provides a `Module` object sitting in the global scope and that's where all JS reference to our native functions reside. In `triangle.ts`, we define `Module` and its members to make the type-checker happy and, therefore, make less type mistakes. The `Bindings` class contains references to the native functions obtained through this `Module` object. For example, in order to get a "pointer" to our native function `initGL`, we call

{% highlight javascript %}
initGL = Module.cwrap('initGL', 'number', ['number', 'number']);
{% endhighlight %}

The parameters here are: function name, return type (as a JS type), and a list of function argument types as an array of strings. This would return a function that you can call as you would do with a usual JS function:

{% highlight javascript %}
Bindings.initGL(canvas.width, canvas.height);
{% endhighlight %}

Note that where a C function expects an argument of a pointer type, the converted JS function would expect an integer which in fact represents a pointer to the Emscripten heap (or stack, choose for yourself). And since JS arrays and other JS objects are not located on that heap, we need to allocate a bit of that memory, use it in native functions by passing a pointer (JS integer number) as an argument, and later on free it as you would normally do in C. That is exactly what we do in our `render()` method to pass the current `translation` object as a float array.

Now that we have our TypeScript code, let us translate it to JavaScript:

{% highlight sh %}
tsc triangle.ts --out triangle.js
{% endhighlight %}

Since `triangle.ts` has a reference to another TypeScript file, `input.ts`, the two will be merged together and translated into `triangle.js`. Have a look in the generated file. The JavaScript version is not much different from the TypeScript code but all classes and types are gone, naturally.

## Putting everything together

Ok now as we've got the ported native library and the JS code that supposedly represents our JS API, we can glue everything together. We already have references to native functions (in the `Bindings` class), and our JS code calls those functions when needed. What's left is to make sure both the "native" `glcore.js` and the JavaScript `triangle.js` scripts are loaded into our page, also there should be a canvas on our page that can receive those GL calls, and Emscripten needs to have a reference to that canvas.

`index.html`

{% highlight html %}
<html>
    ...
    <body>
        <canvas class="topleft" id="canvas"></canvas>
        <script type="text/javascript">
            var canvas = document.getElementById("canvas");
            //make the canvas fullscreen
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            //show Emscripten environment where the canvas is
            var Module = {};
            Module.canvas = canvas;
        </script>
        <script type="text/javascript" src="glcore.js"></script>
        <script type="text/javascript" src="triangle.js"></script>
        <script type="text/javascript">
            var program = new TriangleExample.Program(canvas);
        </script>
    </body>
</html>
{% endhighlight %}

We set the canvas which we want to be receiving GL calls to the `Module.canvas` property. This says Emscripten not to generate its own canvas and use ours instead.

Also you'd want to make sure you have proper style sheet in the `styles` folder and have [this mousewheel library](https://github.com/brandonaaron/jquery-mousewheel) in your main folder (if you cloned the whole tutorial project earlier, you should have all of this set up).

One more (*IMPORTANT*) thing left to do is to say Emscripten which functions we actually want to be able to call from within JavaScript. By default all of them would be hidden, and since we need two C functions available to us, we add the `EXPORTED_FUNCTIONS` parameter to the build command:

{% highlight sh %}
emcc main.cpp shaders.cpp -s FULL_ES2=1 -s EXPORTED_FUNCTIONS=['_initGL','_drawTriangle'] -o glcore.js
{% endhighlight %}

You can read more details about name mangling and interaction with the native code [here](https://github.com/kripken/emscripten/wiki/Interacting-with-code)

Now build the library and open `index.html`. You should see a nicely coloured triangle which we can actually move around and zoom with a mouse.

<a href="http://ilyalopatkin.github.io/emscripten_webgl_simmer_gently"><img src="{{ site.baseurl }}/ilopatkin/assets/emscripten_screenshot.png" alt="Emscripten WebGL screenshot"/></a>

## Automating the build process

Since you would already have MinGW and/or MSYS installed (if using Windows), there's a high chance you'd have `make` tool available to you. This could be a nice and simple way for automating your emcc build command. Create a file called `makefile` in the same folder next to other sources and put this inside:

`makefile`

{% highlight make %}
CC=emcc
SOURCES:=$(wildcard *.cpp)
EXPORTS_FILE=makefile_exports.txt
LDFLAGS=-O2 --llvm-opts 2
OUTPUT=glcore.js

all: $(SOURCES) $(OUTPUT)

$(OUTPUT): $(SOURCES)
    $(CC) $(SOURCES) --bind -s FULL_ES2=1
        -s EXPORTED_FUNCTIONS=@$(EXPORTS_FILE)
        -std=c++11 $(LDFLAGS) -o $(OUTPUT)

clean:
    rm $(OUTPUT)
    rm $(OUTPUT).map
{% endhighlight %}

Also, move the array you supplied to `EXPORTED_FUNCTIONS` to a separate file:

`makefile_exports.txt`

{% highlight javascript %}
["_initGL", "_drawTriangle"]
{% endhighlight %}

Now you can call

{% highlight sh %}
make all
{% endhighlight %}
or simply
{% highlight sh %}
make
{% endhighlight %}
from within that folder to build the library, and call
{% highlight sh %}
make clean
{% endhighlight %}
to remove the generated files. There are certainly more scalable approaches to automating the build process out there but this would do for a quick start. Remember: if you are using TypeScript, you also need to build the main `.ts` file to get a JavaScript output.

## Debugging

It might sound crazy to some, and indeed it did look outlandish to me, nevertheless, we can debug C++ code in a browser. Ok, not the native code itself but its JS version mapped back to C++ which is close enough in the context of porting code to JS. To enable this, add the `-g` flag to your emcc compilation:

{% highlight sh %}
make LDFLAGS=-g all
{% endhighlight %}

This would generate an additional `.map` file sitting next to the output file (in our case it would be `glcore.js.map`) which we need to make sure is available to the browser at runtime.

Refresh your `index.html`, open the developer console (in Chrome press F12), go to the Sources tab, open up the list of source files and you should see and able to open our original `.cpp` files. Breakpoints and stepping through should all work as expected. The only thing is the variable viewer would not be able to resolve things like Emscripten pointers which would naturally appear as numbers. Otherwise you should be able to debug just fine although I would imagine writing a simple wrapper and using a native debugger and a native IDE would certainly bring its advantages in debugging.

<img src="{{ site.baseurl }}/ilopatkin/assets/emscripten_debug.png"/>

## Optimisation

There are two levels of optimisation available with the Emscripten tool chain. The first one is LLVM compiler optimisation which is triggered by setting the `--llvm-opts` level of `emcc` command, and the second is emcc optimisation set by `-O` level which works at the JavaScript level. There are 4 levels of each ranging from 0 (no optimisation) to 3 (heavy optimisation). We tried different optimisation flags and measured performance on different platforms and here are some conclusions:
* Emcc optimisation `-O3` can sometimes over-optimise things and throw out relevant code, so use with care.
* `-O2 --llvm-opts 2` seems to be the most reasonable in terms of performance and stability combination. Emcc optimises for performance and size in one shot, so a difference between `-O2` and `-O0` can be of a factor up to 3.
* Emcc optimisation flag `-O` makes a noticeable difference in performance (up to a factor of 3 again) whereas `--llvm-opts` not so much.
* Emscripten-generated JavaScript code is 2 to 20 times slower than its equivalent native code. This heavily depends on language features being used and is quite close to measurements done by other developers you could find on the net.

## Other considerations

All in all, we had almost no problems porting our C++ code to JS using the Emscripten toolchain. We hope this tutorial was useful to those looking at porting native code to JS as a possible solution. There is indeed a bit of learning and tweaking to do but it's quite a flat learning curve for those who has some C++ and JS coding experience. And it is definitely easier than re-writing your library in JS from scratch so it looks like a viable solution in certain cases.

The only issue that might arise in a commercial project is the final size of the generated JS code. It is somewhat larger than the native binaries, and JS version needs to be loaded by a browser, so some measures need to be taken to not put off your customer while he/she waits for this to finish. This might be only necessary to do once and hope the browser would cache it, but again, deal with care. If you need to load a 20MB script and the user has only got a 1Mb connection, it would take him/her more than 2m 40s at best.

The story of WebGL is not so bright though. Since it is a standard and not a particular implementation, browser vendors need to actually make efforts to support it and not all do. You can have a look to what extent different browsers support WebGL (e.g. [http://caniuse.com/webgl](http://caniuse.com/webgl)), but in our experience, recent Chrome and Opera (which is Chrome's clone feature-wise) are the only browsers capable of rendering whatever we render natively. Others either do not support WebGL at all or produce visual artefacts given the same sequence of GL commands that we feed to GLES 2.0 capable devices. The example given in this tutorial does produce artefacts in Firefox 27, and we had artefacts in IE 11 with some of our other examples when we used VBOs. So, unless you can "suggest" your customers to only use Chrome, WebGL is not there yet for commercial products (as of March 2014) but it as well may be there in a couple of years if Firefox, IE and Safari catch up.
