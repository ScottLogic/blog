---
author: dgrew
layout: default_post
title: 'Blob, the Builder - A Step by Step Guide to SwiftUI Animation'
summary: >-
  A step by step guide through the process of building my first bespoke animation with SwiftUI. Touching on technical aspects specific to SwiftUI and more general concepts relating to animation.
category: Tech
tags: >-
  SwiftUI Swift Animation
---

A year ago, most of my time as a developer had been spent writing backend applications. My frontend skills extended just far enough to write basic HTML and CSS. Animation was the pinnacle of frontend witchcraft and something I could only marvel at.

However, I wanted to understand frontend development and to build something for myself. As a fan of Apple technologies, I decided to build an app as a personal project using SwiftUI  - Apple's new cross-platform UI framework. 

What I found is something I suspect many others have found with SwiftUI; animations are easy! What was I afraid of? More specifically, SwiftUI has some powerful tools that allow you to create impressive animations with very little code. A few carefully placed `.animation()` modifiers and you're off to the races. SwiftUI will animate movements, colour changes, element sizes and plenty more. 

This is great for beginners and allowed me to build the bulk of a functioning iOS app. But what if you want to create a more bespoke animation? SwiftUI has the tools to help with this too, but they require a slightly higher level of understanding and a touch more finessing.

The process of building my first bespoke animation required a number of technical and conceptual leaps in my understanding. In this article I want to walk you through that process.

## Prerequisites

I want to focus primarily on animation. I won't be explaining every line of code - the article is long enough as it is - and so this requires you to have some knowledge of SwiftUI. You should know how to use the SwiftUI View type and ideally have some exposure to drawing custom shapes with the SwiftUI Shape and Path types.

If you don't have this knowledge, [Hacking with Swift](https://www.hackingwithswift.com) is a brilliant resource that I would highly recommend. It has plenty to say about [SwiftUI](https://www.hackingwithswift.com/quick-start/swiftui), including specific articles on [Shapes and Paths](https://www.hackingwithswift.com/books/ios-swiftui/creating-custom-paths-with-swiftui). Just remember to come back here once you've got the gist!

## The Animation

In my app, I wanted users to rate how happy they are with something, on a scale of 1 to 5. The only sensible way to do that these days is using emoji. So, I wanted to build a row of five emoji faces, sad to happy, with a green highlight behind the currently selected emoji. Here's where the animation comes in; as the user clicks a new emoji, the highlight should slide across to highlight it. Not just by moving across, but by stretching over to the new emoji and then contracting to center behind it. 

For lack of a better term, I called this highlight a blob, with the end goal that it should look something like this:

![Target animation]({{ site.github.url }}/dgrew/assets/2021-04-01-custom-swiftui-animation/refined_blob.gif)

## Setup

Before I started building the animation I created a view to display my emoji faces. The following Faces view spaces the 5 faces equally across the width of the screen:

~~~swift
struct Faces: View {
    
    @Binding var position: Int
    
    var widthMultiplier: CGFloat = 0.1
    
    private let faces: [String] = ["😫","☹️️","😐","🙂","😃"]
    
    var body: some View {
        GeometryReader { geometry in
            VStack {
                Spacer()
            
                HStack(spacing: 0) {
                    Spacer()
                    ForEach(0..<5) { i in
                        Button(action: {
                            position = i
                        }) {
                            Text(faces[i])
                                .font(.system(size: geometry.size.width * widthMultiplier * 0.9))
                                .frame(width: geometry.size.width * widthMultiplier, alignment: .center)
                        }
                        Spacer()
                    }
                }
                
                Spacer()
            }
        }
    }
}
~~~

Note that the view contains a binding to a state variable: `position`. This variable determines which of the 5 emoji faces is selected and will be used in the rest of our views. The Faces view has the responsibility of updating `position` any time the user taps one of the emoji.

To create the animation I used two further views:

1. Blob - the increasingly animated blob
2. BlobHost - a simple view to display the emoji faces on top of the blob

I will show you the code for these views as we progress. The Faces view will be mostly consistent for the rest of the article. 

## Step 1 - Simple Blob

My first step was to create a custom circle shape that centered itself behind the selected face. You may be asking why I didn't use the `Circle()` view that Swift provides out of the box. I knew that I was going to need this circle to stretch in due course, and so it seemed a good idea to start with a custom shape. Here's the code for my blob:

~~~swift
struct Blob: Shape {
    
    var position: Int
    
    let blobWidthMultiplier: CGFloat = 0.15
    let faceWidthMultiplier: CGFloat = 0.1
    let numberOfFaces: CGFloat = 5
    
    func path(in rect: CGRect) -> Path {
        
        var path = Path()
        
        let blobRadius = rect.width * blobWidthMultiplier / 2
        let blobCenter = CGPoint(x: calculateXPosition(for: position, 
						       with: rect.width), 
				 y: rect.midY)
        
        path.addArc(center: blobCenter, 
		    radius: blobRadius, 
		    startAngle: Angle(degrees: 0), 
		    endAngle: Angle(degrees: 360), 
		    clockwise: true)

        return path
    }
    
    func calculateXPosition(for position: Int, with width: CGFloat) -> CGFloat {
        let faceWidth: CGFloat = width * faceWidthMultiplier
        let totalFaceWidth: CGFloat = faceWidth * numberOfFaces
        let numberOfSpaces = numberOfFaces + 1
        let spaceWidth = (width - totalFaceWidth) / numberOfSpaces
        
        let positionFaceWidth: CGFloat = faceWidth * CGFloat(position)
        let positionSpaceWidth: CGFloat = spaceWidth * CGFloat(position + 1)
        let halfFaceWidth: CGFloat = faceWidth / 2
        
        return positionSpaceWidth + positionFaceWidth + halfFaceWidth
    }
}
~~~

Without diving too much into the detail, know that the SwiftUI Shape type allows you to draw custom shapes on screen by moving a path through lines and curves. Here, the path is very simple, in `calculateXPosition` I find the point on screen that is directly behind the selected emoji face. I then use the `.addArc(...)` function to draw a circle around that face. Note again, the `position` variable  that tells the view which face is selected.

To place my blob behind the faces I have created a simple BlobHost View:

~~~swift
struct BlobHost: View {
    
    @State var position: Int = 2
    
    var body: some View {
        GeometryReader { geometry in
            VStack {
                Spacer()
                
                ZStack(alignment: .center) {
                    BasicBlob(position: position)
                        .foregroundColor(Color.green)
                        .shadow(radius: 10)
                    Faces(position: $position)
                }
                .frame(width: geometry.size.width, height: geometry.size.width * 0.2)
                
                Spacer()
            }
        }
    }
}
~~~

This host view contains the `position` variable that is passed into our Faces and Blob views. It takes the circle drawn by Blob and fills it green. Faces is then placed on top.

As you can see from the image below, this isn't too far off the end goal, but I don't have any animation yet. As a new face is selected, the blob just disappears from the old face and appears behind the new one. You might think that adding a `.animation()` modifier will do the trick but it won't on this occasion.

![Target animation]({{ site.github.url }}/dgrew/assets/2021-04-01-custom-swiftui-animation/simple_blob.gif)

## Step 2 - Animated Blob

To understand how to animate my Blob, I needed to learn what an animation really is. In short, an animation is a blueprint for how a view should transition from one state to a new state. In this context, state could be any number of different characteristics. For instance, let's say I want to animate changing the colour of a view from red to blue. A blueprint for this animation might be to iterate across a series of smaller colour changes through shades of red, purple and finally settling on blue. In this way the transition is smooth rather than a dramatic shift from red to blue.

SwiftUI understands states like colour, size, and rotation and offers built-in animations for them. That is why adding `.animation` is often enough. However, the state change I wanted to animate is the `position` variable. SwiftUI doesn't have an out of the box blueprint for that.

To define a blueprint, I needed to tell SwiftUI that I want to animate changes in the `position` variable. This is done by adding a computed property called `animatableData` to the Blob view:

~~~swift
var animatableData: CGFloat {
	get { position }
	set { position = newValue }
}
~~~

By mapping the `get` and `set` functions of `animatableData` to the `position` variable, I am telling SwiftUI that I want to animate all changes in the `position` variable. This is where the magic comes in.

From now on, whenever the value of `position` changes, SwiftUI will not immediately update the view with the new value, instead it will repeatedly update the view with values between the old `position` and the new `position`. For example, if `position` changes from '1' to '2', SwiftUI might update the view with the following `position` values '1.2, 1.4, 1.6, 1.8, 2'. I'd already done the hard work of defining where the Blob should be placed for any value of `position` and so the effect is that the Blob should now transition smoothly from one position to the next.

But hold on a second, position is an integer. An integer cannot have the value '1.2'. Changing `position` to a CGFloat - `var position: CGFloat` - will do the trick.

Also, just like any other SwiftUI animation, I still need to add the `.animation()` modifier for it to be enabled. This is done in the BlobHost.

~~~swift
BasicBlob(position: position)
	.foregroundColor(Color.green)
	.shadow(radius: 10)
	.animation(.linear)
~~~

With these changes, the Blob now looks like this:

![Target animation]({{ site.github.url }}/dgrew/assets/2021-04-01-custom-swiftui-animation/animated_blob.gif)

The code for the animated Blob is as follows:

~~~swift
struct Blob: Shape {
    
    var position: CGFloat
    
    let blobWidthMultiplier: CGFloat = 0.15
    let faceWidthMultiplier: CGFloat = 0.1
    let numberOfFaces: CGFloat = 5
    
    func path(in rect: CGRect) -> Path {
        
        var path = Path()
        
        let blobRadius = rect.width * blobWidthMultiplier / 2
        let blobCenter = CGPoint(x: calculateXPosition(for: position, 
						       with: rect.width), 
				 y: rect.midY)
        
        path.addArc(center: blobCenter, 
		    radius: blobRadius, 	
		    startAngle: Angle(degrees: 0), 
		    endAngle: Angle(degrees: 360), 
		    clockwise: true)

        return path
    }
    
    var animatableData: CGFloat {
        get { position }
        set { position = newValue }
    }
    
    func calculateXPosition(for position: Int, with width: CGFloat) -> CGFloat {
        let faceWidth: CGFloat = width * faceWidthMultiplier
        let totalFaceWidth: CGFloat = faceWidth * numberOfFaces
        let numberOfSpaces = numberOfFaces + 1
        let spaceWidth = (width - totalFaceWidth) / numberOfSpaces
        
        let positionFaceWidth: CGFloat = faceWidth * CGFloat(position)
        let positionSpaceWidth: CGFloat = spaceWidth * CGFloat(position + 1)
        let halfFaceWidth: CGFloat = faceWidth / 2
        
        return positionSpaceWidth + positionFaceWidth + halfFaceWidth
    }
}
~~~

### Tip

To see what is happening under the hood, add `print(position)` in the path function and you can see all of the values that SwiftUI is updating the view with...it's a lot.

## Step 3 - Sliding Blob

If the previous step required a leap in technical understanding, step 3 was more about improving my conceptual understanding. With the Blob now animating, it needed to slide over from one position to the next. This meant the blob expanding from the previous position to the new position and then contracting to cover only the new position. 

The breakthrough came when I realised that every animation has a timeline, from start to finish. The `position` variable doesn't just mark a location on screen, it also indicates a point in the timeline of the animation. If it is moving from position 1 to position 2, when the position is set to 1.5, it is exactly halfway through the animation. I stopped trying to think what the blob should look like in a given position, and instead consider what it should look like at a particular point in the animation timeline. 

With this context, I decided that for the first half of the animation the Blob should expand and cover the full distance between old and new positions. For the second half it should contract and end up settled behind the new position.

First challenge: I only had a position variable, so I needed to also start tracking the old position and the new position. I renamed `position` to `currentPosition` and added these variables and initialiser to the Blob:

~~~swift
var currentPosition: CGFloat
    
var nextPosition: CGFloat
var previousPosition: CGFloat

init(position: CGFloat, previousPosition: CGFloat) {
	currentPosition = position
	nextPosition = position
	self.previousPosition = previousPosition
}
~~~

Next, the Blob would no longer always be a circle. When between positions it needs to stretch out. So I updated the path from one arc to two 180 degree arcs which, when together, would form a circle, but when apart, would form the elongated blob:

~~~swift
path.addArc(center: leftCenter, 
	    radius: radius, 
	    startAngle: Angle(degrees: -90), 
	    endAngle: Angle(degrees: 90), 
	    clockwise: true)

path.addArc(center: rightCenter, 
	    radius: radius, 
	    startAngle: Angle(degrees: 90), 
	    endAngle: Angle(degrees: 270), 
	    clockwise: true)
~~~ 

Note here the use of `leftCenter` and `rightCenter`. These are the two points that determine how expanded or contracted the Blob is. When they are the same point we will have a circle, when they are apart we have the elongated blob. These are the points I needed to progressively move for my Blob to animate correctly. To do that I updated by Blob View as follows:

~~~swift
struct Blob: Shape {
    
    var currentPosition: CGFloat
    
    var nextPosition: CGFloat
    var previousPosition: CGFloat
    
    let blobWidthMultiplier: CGFloat = 0.15
    let faceWidthMultiplier: CGFloat = 0.1
    let numberOfFaces: CGFloat = 5
    
    init(position: CGFloat, previousPosition: CGFloat) {
        currentPosition = position
        nextPosition = position
        self.previousPosition = previousPosition
    }
    
    func path(in rect: CGRect) -> Path {
        
        var path = Path()
        
        let radius = rect.width * blobWidthMultiplier / 2
        
        let totalDistance = nextPosition - previousPosition
        let distanceCovered = currentPosition - previousPosition
        let animationCompletion = distanceCovered / totalDistance
        
        let leftDistance = calculateLeftDistance(given: totalDistance, 
        					 and: animationCompletion)
        let rightDistance = calculateRightDistance(given: totalDistance, 
        					   and: animationCompletion)
        
        let leftCenter = CGPoint(x: calculateXPosition(for: leftDistance, 
        					       with: rect.width), 
				 y: rect.midY)
        let rightCenter = CGPoint(x: calculateXPosition(for: rightDistance, 
        						with: rect.width), 
				  y: rect.midY)
        
        path.addArc(center: leftCenter, 
		    radius: radius, 
		    startAngle: Angle(degrees: -90), 
		    endAngle: Angle(degrees: 90), 
		    clockwise: true)
        
        path.addArc(center: rightCenter, 
		    radius: radius, 
		    startAngle: Angle(degrees: 90), 
		    endAngle: Angle(degrees: 270), 
		    clockwise: true)

        return path
    }
    
    var animatableData: CGFloat {
        get { currentPosition }
        set { currentPosition = newValue }
    }
    
    func calculateLeftDistance(given totalDistance: CGFloat, 
			       and totalAnimationCompletion: CGFloat) -> CGFloat {
        if totalAnimationCompletion < 0.5 {
            return previousPosition
        } else {
            let secondHalfAnimationCompletion = (totalAnimationCompletion - 0.5) * 2
            let currentDistanceToCover = totalDistance * secondHalfAnimationCompletion
            return previousPosition + currentDistanceToCover
        }
    }
    
    func calculateRightDistance(given totalDistance: CGFloat, 
				and totalAnimationCompletion: CGFloat) -> CGFloat {
        if totalAnimationCompletion < 0.5 {
            let firstHalfAnimationCompletion = totalAnimationCompletion * 2
            let currentDistanceToCover = totalDistance * firstHalfAnimationCompletion
            return previousPosition + currentDistanceToCover
        } else {
            return nextPosition
        }
    }
    
    func calculateXPosition(for position: Int, with width: CGFloat) -> CGFloat {
        let faceWidth: CGFloat = width * faceWidthMultiplier
        let totalFaceWidth: CGFloat = faceWidth * numberOfFaces
        let numberOfSpaces = numberOfFaces + 1
        let spaceWidth = (width - totalFaceWidth) / numberOfSpaces
        
        let positionFaceWidth: CGFloat = faceWidth * CGFloat(position)
        let positionSpaceWidth: CGFloat = spaceWidth * CGFloat(position + 1)
        let halfFaceWidth: CGFloat = faceWidth / 2
        
        return positionSpaceWidth + positionFaceWidth + halfFaceWidth
    }
}
~~~

There's a lot going on here, but remember what I said about the animation timeline. In the path method I use the `oldPosition`, `newPosition` and `currentPosition` to determine the `animationCompletion` - the proportion of the animation timeline that is complete. With this I then calculate how far along the X-Axis the left and right sides of my Blob should be (`leftDistance` and `rightDistance`).

In `calculateRightDistance` `rightDistance` is changing for the first half of the animation. This is the right side moving from the old position to the new position, the blob is expanding. This method determines how far to move by taking the total distance between positions multiplied by twice the proportion of the animation that is complete - effectively it moves the right half in double quick time to cover the new position by the halfway point of the animation.

`calculateLeftDistance` handles the contraction. In contrast, it only changes during the second half of the animation. It operates in the same way as `calculateRightDistance` but in reverse. Again it moves in double quick time so the two halves of the Blob are reunited by the end of the animation and sit behind the new position. 

Success! The Blob now slid smoothly from one position to the next!

![Target animation]({{ site.github.url }}/dgrew/assets/2021-04-01-custom-swiftui-animation/sliding_blob.gif)

But wait, you'll notice that it only works from left to right, Going backwards the Blob inverts itself. 

I deliberately focused on animating one direction initially. It was enough to wrap my head around without trying to do both at once. This is a useful point to consider and a theme of this article - focus on a smaller part of the animation and build from there. If you're lucky, you'll find the next part is much easier.

## Step 4 - Refined Blob

With the animation mostly finished, it needed some tidying up, primarily supporting left to right movement. One of the parameters passed to the `addArc` method is `clockwise`. I just needed to change this from a hardcoded value to an appropriate value based on the direction of the animation:

~~~swift
let forward: Bool = nextPosition > previousPosition

path.addArc(center: leftCenter, 
	    radius: radius, 
	    startAngle: Angle(degrees: -90), 
	    endAngle: Angle(degrees: 90), 
	    clockwise: forward)

path.addArc(center: rightCenter, 
	    radius: radius, 
	    startAngle: Angle(degrees: 90), 
	    endAngle: Angle(degrees: 270), 
	    clockwise: forward)
~~~

With that small change, we've reached our final Blob:

![Target animation]({{ site.github.url }}/dgrew/assets/2021-04-01-custom-swiftui-animation/refined_blob.gif)

I mentioned at the outset that custom animations require finessing. For me, the trick was to get it mostly working and then slow the animation down to find the imperfections. Setting a longer duration is a useful tool for debugging as you can clearly see what is happening. However, it is important not to spend too much time building an animation that works perfectly over a 10 second duration if it will only ever run with a 0.2 second duration. It doesn't need to be perfect if the imperfections are imperceptible.

## Wrap-Up

Learning how to build a custom animation was one of the most fun, pure coding challenges I've had as a developer. I hope that reading about my experience helps you create something of your own.

You can view the source code for this animation on [GitHub](https://github.com/grewdw/BlobPrototype). The blob for each step is in its own file to easily understand the progression. Running on the simulator or on a device, you can change the animation type and duration so try experimenting with different conditions.
