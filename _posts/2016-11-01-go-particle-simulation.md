---
title: Creating a Simple Particle Simulation with Go
date: 2016-11-01 00:00:00 Z
categories:
- wferguson
- Tech
tags:
- featured
author: wferguson
layout: default_post
summary: In this post, I take a look at writing a simple particle simulation as a
  way of learning some of the basics of the Go language.
image: wferguson/assets/featured/particles.png
---

I've been looking at Go with some interest for a period of time, and of particular interest was how easy it was to parallelise computations. As a way to try to learn some of the key concepts behind the language, I tried to make a particle simulation. This simulation was pretty simple: there's a bunch of particles bouncing around in a box, being influenced by gravity.

## The Basic Setup

First, the initial groundwork had to be set: some basic structures that would be reused multiple times: `Point`s and `Vector`s. Coincidentally, they both have the same properties: X, Y, and Z components.

{% highlight go %}
type Point struct {
  X, Y, Z float64
}
{% endhighlight %}

Next up, the `Particle` structure was made. This was slightly more than a structure, as it needed implementation for accelerating due to gravity and adjusting positions after a given unit of time. The structure of the particle was pretty straightforward: its position, a `Point`; and its velocity, a `Vector`. Implementing the functionality was straightforward, though a bit different to what I'm used to by not specifying functions on a class:

{% highlight go %}
const GRAVITY = 9.81

// Non-exported function, due to the lowercase letter at the start of the function
func (p *Particle) incrementGravity(time float64) {
  // Accelerate due to the force of gravity (no terminal velocity)
  p.Velocity.Y -= GRAVITY * time
}

// Exported function, due to the uppercase letter at the start of the function
func (p *Particle) Tick(time float64) {
  p.incrementGravity(time)

  p.Point = Point{
    X: p.Point.X + p.Velocity.X*time,
    Y: p.Point.Y + p.Velocity.Y*time,
    Z: p.Point.Z + p.Velocity.Z*time,
  }
}
{% endhighlight %}

All that was required was a pointer to the `Particle` structure, as Go passes by value. Otherwise, a copy of the structure would have been created and then mutated, as opposed to mutating in place. Although immutability could have been achieved in this test, I didn't choose to pursue it as it would lead to some minor overheads later on -- particles would need to be continually reassigned.

The bulk of the logic was done in the `Cube`. Rather than specifying the cube as six different walls, it made more sense to use two points: one corner and the one diagonally opposite it. Although this doesn't make that much difference to the end result, it reduces the size of the structure to 2 sets of 3 co-ordinates instead of 6 sets of 1:

{% highlight go %}
type Cube struct {
  origin, edge Point
}
{% endhighlight %}

Next up, the logic was needed to test collision. Rather simply, the particle would collide with the box if any of the particles co-ordinates were less than the box's lower-left point, or greater than the box's upper-right point. This lent itself to a fairly short collision test function:

{% highlight go %}
// Tests if a given particle's co-ordinate would collided with the corresponding box point
// The lessThan flag indicates if less than should be employed (ie. on the lower-left origin point)
func wouldCollide(a float64, b float64, lessThan bool) bool {
  if lessThan {
    return a < b
  }
  return a > b
}

func testCollision(point Point, particle *Particle, lessThan bool) {
  if wouldCollide(particle.Point.X, point.X, lessThan) {
    particle.Point.X = reflect(particle.Point.X, point.X)
    particle.Velocity.X *= -0.9 // Only reflect at 90% of its previous velocity
  }

  if wouldCollide(particle.Point.Y, point.Y, lessThan) {
    particle.Point.Y = reflect(particle.Point.Y, point.Y)
    particle.Velocity.Y *= -0.9
  }

  if wouldCollide(particle.Point.Z, point.Z, lessThan) {
    particle.Point.Z = reflect(particle.Point.Z, point.Z)
    particle.Velocity.Z *= -0.9
  }
}
{% endhighlight %}

Note again how a pointer to a particle is passed in, so that it can be mutated during the collision logic.

Reflection was also straightforward. Since each particle had independent velocities in each direction, it was a simple case of inverting what it, and also applying some attenuation (dampening) so it doesn't bounce quite as highly next time. If the particle collided, its co-ordinates needed to be corrected to remain in the box. This was a difference function, that worked regardless of whether less than was employed or not:

{% highlight go %}
func reflect(a float64, b float64) float64 {
  var diff = a - b
  return b - diff
}
{% endhighlight %}

Finally, wrapping up the collision logic was implementing a function that works on the `Cube` itself, and tests the collision on both points, specifying whether to use less than or greater than collision testing:

{% highlight go %}
func (c *Cube) collide(particle *Particle) {
  testCollision(c.origin, particle, true)
  testCollision(c.edge, particle, false)
}
{% endhighlight %}

## Bringing it Together

So, each of the moving parts had been implemented, now it was just a case of wiring it all together. A box and particles had to be created as an initial set-up, and then running over a fixed number of iterations.

{% highlight go %}
const BOX_SIZE = 100.0
const PARTICLES = 500
const ITERATIONS = 1000

var cube = Cube{
       origin: Point{X: 0, Y: 0, Z: 0},
       edge:   Point{X: BOX_SIZE, Y: BOX_SIZE, Z: BOX_SIZE},
}

var particles = make([]Particle, PARTICLES)

// Create the particles in some random position, each with the same velocity
for i := 0; i < PARTICLES; i++ {
       var float = float64(i)
       particles[i] = Particle{
               Point:    Point{X: float / PARTICLES * BOX_SIZE, Y: rand.Float64() * BOX_SIZE, Z: rand.Float64()
               Velocity: Vector{X: rand.Float64() * 5, Y: 0, Z: 0},
       }
}

// Run for a constant number of iterations
for i := 0; i < ITERATIONS; i++ {
       // Update each particle's position, then check their collision.
       for j := range particles {
               particles[j].Tick(0.1)
               cube.collide(&particles[j])
       }

       // Save as CSV file
       writeOutput(i, particles)
}
{% endhighlight %}

One thing I noticed when using the `for j := range particles` was that you were able to use `for j, particle := range particles` to reference each particle directly. However, this passed `particle` by value, and not pointer. I had a case where each particle was iterating each tick, but because `particle` was being passed by value, it wasn't storing that change. This was the main driver for mutability, as otherwise I'd have to keep reassigning the particle in the array where it wasn't really needed to do so.

Overall, this worked pretty well. After writing the output as a CSV file, I could import the files into a visualisation program, and it produced the following:

<iframe width="560" height="315" src="https://www.youtube.com/embed/lgYxH_iw9HI" frameborder="0" allowfullscreen style="margin: auto;"></iframe>

However, it turned out to not be as fast as it could be, since one thread was operating: doing all the computations, then saving the CSV output for that iteration before moving on to the next one. Since each particle was independent of each other, it meant that they could all run at the same time, across all iterations.

## Running in Parallel

There was a surprisingly small amount to change for parallel. I needed some form of communication in order to save the iterations as CSV files, so channels proved useful:

{% highlight go %}
// Create one channel per thread
var channels = make([]chan string, NUM_THREADS)
const numberPerThread = float64(PARTICLES) / float64(NUM_THREADS)

for i := 0; i < NUM_THREADS; i++ {
  // Create the channel for that thread, returning the CSV export string for that iteration.
  // Use a size of the channel such that it's asynchronous in the go routine.
  var channel = make(chan string, ITERATIONS)
  channels[i] = channel

  // Each thread is responsible for PARTICLES / NUM_THREADS particles, with buckets based off of their index
  var startIndex = int(float64(i) * numberPerThread)
  var endIndex = int(float64(i+1) * numberPerThread)

  // Run the iterator in parallel. The 'go' is all that's needed
  go iterate(particles[startIndex:endIndex], cube, channel)
}
{% endhighlight %}

The iterator was pretty similar to the iteration stage before. I'd changed things around slightly in that the iterator generates the CSV string instead of the save function, which helps create a set state at a given point. In hindsight, Go's pass by value approach would have worked just as well, as it would have created an immutable record of the entire state of each particle at a given time.

{% highlight go %}
func iterate(slice []Particle, cube Cube, channel chan string) {
  for i := 0; i < ITERATIONS; i++ {
    var workingString = ""

    for j := range slice {
      slice[j].Tick(0.1)
      cube.collide(&slice[j])

      // Save the position of the particle into the working string
      workingString += fmt.Sprintf("%v,%v,%v\n", slice[j].Point.X, slice[j].Point.Y, slice[j].Point.Z)
    }

    // Push the CSV state at this point into the channel
    channel <- workingString
  }
}
{% endhighlight %}

The iterator pushes the state into the channel for each iteration. Creating a buffer for the channel meant that the thread wasn't blocked waiting for the string to be received on the main thread. This meant that the entire iteration count could run on each thread independently of each other, which is pleasingly parallel.

The last thing I needed to do was save the state of the particles into a CSV file, so the main thread was used to collect the responses and join them together:

{% highlight go %}
// Assemble the chunks, save to file.
for i := 0; i < ITERATIONS; i++ {
    var responses = make([]string, NUM_THREADS)

    for j := range channels {
      // Take the first item in the channel, if it exists. Blocks the thread until an item is received.
      responses[j] = <-channels[j]
    }

    // After all channels have given their response for this iteration, join them together, and save.
    writeOutput(i, strings.Join(responses, ""))
}
{% endhighlight %}

This ran spectacularly faster, meaning that I could increase the number of particles with similar runtimes. Here's what 5,000 particles dancing around looks like (with some slightly tweaked initial velocities):

<iframe width="560" height="315" src="https://www.youtube.com/embed/mXKYJ2PqCf4" frameborder="0" allowfullscreen style="margin: auto;"></iframe>

## Wrapping Up

I found Go a pleasant language to write in. It's simple to pick up and has some interesting functionality, like the channels. I was particularly impressed how easy it was to write parallel programs, although this was a simple example. It's also fairly readable, too -- nothing immediately jumped out as confusing. I may have a look at making a set of web services using Go later on.

The simulation itself, although simple, is quite nice to look at and works well, so I'm happy with the result. To make the simulation more complicated, the particles could interact with each other (either through collision, attraction or repulsion), and the approach to parallelising each one is slightly different, though would include more synchronisation, perhaps after each iteration.
