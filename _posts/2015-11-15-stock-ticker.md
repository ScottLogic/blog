---
title: Creating a High Performance Stock Ticker Using Haskell
date: 2015-11-15 00:00:00 Z
categories:
- Data Engineering
author: isullivan
layout: default_post
summary: This post demonstrates how to create an efficient stock ticker app using
  HTML5 WebSockets and a Haskell server.
disqus-id: "/2015/11/15/stock-ticker.html"
---

This post demonstrates how to create an efficient stock ticker app using HTML5 WebSockets and a Haskell server. The stock ticker itself simply shows a list of symbols and prices that dynamically update:

<img alt="Server Architecture" src="{{ site.baseurl }}/isullivan/assets/stock-ticker-screenshot.png" />

## Haskell

Functional programming is becoming more and more popular and it is not just a passing novelty, it offers many advantages over other paradigms. One important feature is that it lends itself to concurrent programming. A focus on immutable state and pure functions (functions without side effects) both make it easier to reason about concurrent code. The purely functional [Haskell](https://www.haskell.org/) is the language I've decided to use to write my server. It has several features that make it ideal for implementing a high performance stock ticker:

* It is fast - the most popular compiler (GHC) compiles code into native machine code.
* It has a rich set of libraries - there is already a high level WebSocket library that implements the protocol for me.
* It supports [green threads](https://en.wikipedia.org/wiki/Green_threads) which makes it easy to split work across multiple processors.
* Data structures are immutable by default therefore the compiler ensures that data is safe to share between threads.

## The Problem

I want to create an application that displays a table of stocks and their current price. The application should be fast and should support thousands of active users. The prices will come from some external service such as a web service or a database call (for the purposes of this post, I will ignore fetching the price data). As prices will constantly need to be pushed to clients WebSockets are a sensible choice for client-server communication.

## Client

The client is fairly uninteresting. It connects to a WebSocket server and listens for messages of the form `{stock symbol}:{price}`. When a message is received, rows are updated or appended as appropriate. I won't go into any details about the client as it is fairly uninteresting, but here is the code for reference:

{% highlight html %}

<!doctype html>
<html>

  <head>
    <title>Stock Ticker</title>

    <style>
      body {
        padding: 10px;
        font-family: sans-serif;
      }

      td {
        padding: 3px 5px;
      }

      td:first-child {
        font-weight:bold;
      }
    </style>

  </head>
  <body>
    <table id="prices">

    </table>
    <script>
      var connection = new WebSocket("ws://localhost:3000"),
          table = document.getElementById("prices");

      connection.onmessage = function(e) {
          // Message is text and is of the form 'symbol:price'
          var values = e.data.split(':'),
              symbol = values[0],
              price = parseFloat(values[1]);

          var row = table.querySelector("tr[data-symbol='" + symbol + "']");
          if (!row) {
              // If the row doesn't exist yet, create it
              row = document.createElement("tr");
              row.setAttribute("data-symbol", symbol);
              table.appendChild(row);
          }

          // Set the new price on the row
          row.innerHTML = "<td>" + symbol + "</td><td>" + price.toFixed(2) + "</td>";

      };
    </script>
  </body>
</html>


{% endhighlight %}

## Server

The server code has to be fast and support multiple clients. To achieve this, the server code must have the following properties:

* It must utilise all processor cores.
* Sending messages or negotiating a connection with one client should not block other clients.
* The external price service should not be called excessively for example if we have 10,000 clients, the external service should not be called 10,000 times a second.
* Ideally the language itself should compile to fast code.

Haskell makes it easy to write code that ticks all of these boxes.

### Extremely Brief Introduction to Haskell

In case you have never used Haskell, I'll quickly outline the syntax which should make the code a little more understandable.

Functions are written like this:

{% highlight haskell %}

add :: Int -> Int -> Int
add a b = a + b

{% endhighlight %}

The top (optional!) line is the type signature. It says: "there is a function called `add` that takes two `Int` and returns an `Int`". There's a [very good reason](https://wiki.haskell.org/Currying) there is no distinction between the arguments and the return type but for now just assume the last type in the signature is the return type.

The second line is the implementation of `add`. The arguments are named `a` and `b` and the result is simply `a + b` (there is no need for the return keyword). Functions are called by writing the function name followed by its arguments separated by spaces, there is no need for any parenthesis for example `add 3 4 == 7` returns `True`.

As mentioned above, Haskell supports green threads. These are threads that are managed by the Haskell runtime and not the OS. They are extremely lightweight and it is perfectly reasonable to spawn thousands of these threads without a noticeable impact on performance. The runtime splits the work of these green threads across all cores of a processor.

Threads can communicate with one another using the `Chan` (Channel) type. This is a FIFO queue that threads can read from and write to. A channel that integers can be written to to has the type `Chan Int` (analogous to Java's generic `Chan<Int>` syntax). There are several useful functions when working with channels:

 * `readChan` - this takes an item out of a channel. Importantly, it blocks if the channel is empty.
 * `writeChan` - this puts an item into a channel.
 * `dupChan` - this takes a channel and returns a new channel. When an item is written to the original or new channel, it will be available in both.

### Code

Here is the architecture that is used:

<img alt="Server Architecture" src="{{ site.baseurl }}/isullivan/assets/stock-ticker-architecture-diagram.png" />

Each card represents a thread. Each connection is handled by it's own thread. The threads handling the connections simply 'listen' for a new price and when they get one, they send it to their client.

There is another single thread that continuously gets the latest stock prices, sends the prices to all of the threads and then sleeps for a little while.

*I'm actually proud of that diagram - it's good right?*

The code starts by importing some modules (which I won't bother showing) and then I define a type alias:

{% highlight haskell %}

type Price = (String, Double)

{% endhighlight %}

This lets me use `Price` to refer to a tuple containing a stock symbol and a price. The first function `handleConnection` is the function that runs on a new thread for each client that connects:

{% highlight haskell %}

1. handleConnection :: Connection -> Chan Price -> IO ()
2. handleConnection conn chan = forever $ do
3.  (symbol, price) <- readChan chan
4.  let message = pack (symbol ++ ":" ++ show price)
5.  sendTextData conn message

{% endhighlight %}

The lines do the following:

1. Defines a function that takes a WebSocket connection, a channel for sending prices and has a mysterious return type of `IO ()`. The type `IO ()` is sometimes referred to as an [action](https://wiki.haskell.org/Introduction_to_IO) as it indicates the code has an impure side effect.
2. Uses the aptly named function `forever` which says 'repeat an action forever' - the Haskell equivalent of `while (true)`. The subsequent lines will run forever.
3. Reads a value from the channel. If the channel is empty, it blocks. As soon as a price is added to the channel, the code continues. This is all that's needed to make a thread wait until a price is ready to be sent.
4. Creates a Unicode string called `message` in the required `{stock symbol}:{price}` format.
5. Uses the function `sendTextData` defined in the [WebSocket](https://hackage.haskell.org/package/websockets-0.9.6.1/docs/Network-WebSockets.html) package to send the message to the client.

The next piece of code is the function `notifyClients` that requests the latest prices and sends them to the other threads:

{% highlight haskell %}

1. notifyClients :: Chan Price -> IO ()
2. notifyClients chan = forever $ do
3.   prices <- getAllPrices
4.   forM_ prices (writeChan chan)
5.   threadDelay 1000000

{% endhighlight %}

1. Defines a function that takes a channel for sending prices and returns an action.
2. Like the previous function, this one runs forever using `forever`.
3. Calls `getAllPrices` and names the result `prices`. The implementation of this could be a call to a web service or a database or maybe I was just lazy and it generates some random, fake prices.
4. This line says: "For each price in `prices`, call `writeChan` using `chan`".
5. Sleep for a second.

The last bit of code is the `main` function which is the entry point to the application.

{% highlight haskell %}

1. main :: IO ()
2. main = do
3.   chan <- newChan
4.   forkIO (notifyClients chan)
5.   runServer "127.0.0.1" 3000 $ \pc -> do
6.     conn <- acceptRequest pc
7.     c <- dupChan chan
8.     handleConnection conn c

{% endhighlight %}

1. The type signature of a Haskell program. The Haskell equivalent of `public static void main(String [] args)`.
2. Says the `main` function is composed of the following actions.
3. Creates the initial channel from which all other channels are duplicated.
4. Calls `notifyClients` that was defined earlier. The `forkIO` function is all that's needed to invoke this on a separate thread.
5. This creates a simple socket server using the [WebSocket](https://hackage.haskell.org/package/websockets-0.9.6.1/docs/Network-WebSockets.html) package. `runServer` takes an IP address to bind to, a port and a function that runs each time a client attempts a connection.
6. `pc` is a pending connection. At this point, it is still possible to accept or reject the client, but because I'm nice, I call `acceptRequest` that takes a pending connection and gives me a `Connection` in return.
7. `dupChan` creates a new channel by duplicating the initial one. As described above, when an item gets added to the initial channel it will get added to each of the duplicated channels as well. This lets the initial thread 'broadcast' to all other threads.
8. Call the `handleConnection` function that was defined above using the new connection and duplicated channel.

Done! A high performance stock ticker server in 18 lines of code (although I did skip the code that actually gets the prices)! I'm not entirely sure what the aim of this blog post is but maybe it has piqued your interest in Haskell. Its many practical advantages aside, my favourite feature is that it's fun to use.

Any comments, criticisms and questions are welcome. Full code and instructions on how to run it are available on [github](https://github.com/iansullivan88/stock-ticker/).
