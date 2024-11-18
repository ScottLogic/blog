---
title: Strong typing for SignalR
date: 2014-08-08 00:00:00 Z
categories:
- Tech
tags:
- blog
author: nwolverson
image: ''
layout: default_post
summary: SignalR is an easy to use framework for .NET and the browser which enables bi-directional communication over a variety of transports (from WebSockets to Ajax long-polling). The SignalR Hubs API is dynamically typed, in this post I will summarise some existing tools which can be used to provide strong typing for calls between C# and TypeScript, as well as a more experimental approach via F#, FunScript and Type Providers.
oldlink: http://www.scottlogic.com/blog/2014/08/08/signalr-typed.html
disqus-id: "/2014/08/08/signalr-typed.html"
---

[SignalR](http://signalr.net/) is an easy to use framework for .NET and the browser ([introduction](http://www.asp.net/signalr/overview/signalr-20/getting-started-with-signalr-20/introduction-to-signalr)) which enables bi-directional communication over a variety of transports (from WebSockets to Ajax long-polling). In particular the Hubs API allows both client-to-server and server-to-client calls to be made simply as method calls on a 'hub' proxy object. On the .NET side this makes use of *dynamic* method calls, while JavaScript is dynamic by nature—so although the communication is easy, it does not benefit from the safety guarantees and tooling support brought by strong typing. In this post I will summarise some existing tools which can be used to provide strong typing for the SignalR Hubs API  between C# and [TypeScript](http://www.typescriptlang.org/), as well as a more experimental approach via F#, [FunScript](http://funscript.info/) and Type Providers.

As a running example I'm going to use the ["chat" example](http://www.asp.net/signalr/overview/signalr-20/getting-started-with-signalr-20/tutorial-getting-started-with-signalr-20) from the SignalR tutorial (it's worth reading through the tutorial if you struggle to follow this post). This provides a server hub with one method `Send` which broadcasts a chat message to all connected clients, and a client hub with one method `addNewMessageToPage` which displays the received message.

On the server side we have this hub which calls back to clients directly:

{% highlight csharp %}

public class ChatHub : Hub
{
    public void Send(string name, string message)
    {
        Clients.All.AddNewMessageToPage(name, message);
    }
}

{% endhighlight %}

On the client side we have this:

{% highlight javascript %}

$(function () {
    var chat = $.connection.chatHub;
    // Set up method on client hub
    chat.client.addNewMessageToPage = function (name, message) {
        $('#discussion').append('<li><strong>' + htmlEncode(name)
            + '</strong>: ' + htmlEncode(message) + '</li>');
    };
    // ...
    $.connection.hub.start().done(function () {
        $('#sendmessage').click(function () {
            // Call the Send method on the server hub.
            chat.server.send($('#displayname').val(), $('#message').val());
            $('#message').val('').focus();
        });
    });
});

{% endhighlight %}

## TypeScript by hand

It's surprisingly easy to convert the chat example to use TypeScript. From NuGet you can install typing definitions from [DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped) for jQuery and SignalR. Then in order to be able to compile, we need to add a definition for the client-side proxy for the server chat hub. At the simplest (and giving us nothing in the way of useful typechecking!) is the following:

{% highlight javascript %}

interface SignalR {
    chatHub: any
}

{% endhighlight %}

We can of course do better by specifying the actual hub interfaces. An introduction to this approach can be found [here](http://nickberardi.com/signalr-and-typescript/).

{% highlight javascript %}

interface SignalR {  
    chatHub: ChatHubProxy;
}
interface ChatHubProxy {  
    client: ChatClient;
    server: ChatServer;
}
interface ChatClient {  
    addNewMessageToPage : (name : number, message : string) => void;
}
interface ChatServer {  
    send(name: string, message: string): JQueryPromise<void>;
}

{% endhighlight %}

Applying this interface definition to the top of the file, the existing jQuery and SignalR code compiles and runs as-is (but if you change the name of the `addNewMessageToPage` or `send` calls, you can see that it is flagged up as an error).

## SRTS

The above process has helped make the types of the client/server hubs more explicit on the client side, but doesn't help us keep in sync with the server: everything has to be written out twice. To fix this we can look to generate the TypeScript interfaces automatically from the server hub definition.

There are a couple of options available for this. Firstly there is the NuGet package [`SignalR.TypeScript`](http://www.nuget.org/packages/SignalR.TypeScript/), based on the [`SRTS` generator tool](https://github.com/muratg/SRTS/). This wraps an executable which does the actual work of generating definitions based on a DLL, with a T4 template to initiate the generation process.

From our existing hub implementation, the tool generates the following typescript definition file:

{% highlight javascript %}
// Client interfaces. These are the return types for the proxies.
// Implement these in your .ts file, but do not manually edit them here. 
interface IChatHubClient { }

// Data interfaces 

// Hub interfaces 
interface IChatHub {
    send(name: string, message: string): IPromise<void>;
}

// Generetated proxies 
interface IChatHubProxy {
     server: IChatHub;
     client: IChatHubClient;
}
{% endhighlight %}

In our implementation `.ts` file we add the following (as well as a tweak to take care of changing versions of typescript definitions):

{% highlight javascript %}
interface SignalR {
    chatHub: IChatHubProxy
}

// Manually added!
interface IChatHubClient {
    addNewMessageToPage: (name: string, message: string) => void
}
{% endhighlight %}

Then for each time we change the server hub, we simply regenerate the T4 template (and this can be arranged to happen on build). This gives us a guarantee that calls from the client
to the server hub have the correct name and type, but no guarantee of any sort regarding calls in the other direction.

You can see a working example project of this approach [here](https://github.com/nwolverson/blog-signalrtyped/tree/master/SRHubExampleSRTS).

## Hubs.tt

Another implementation of a similar idea is `Hubs.tt`. This is implemented entirely as a T4 template (making use of SignalR libraries), and provides some additional functionality on top of the above version. However due to the nature of the template, some tweaking has to be done to reference the correct versions of various DLLs, or your hubs will not be picked up. The template is available [as a Gist](https://gist.github.com/robfe/4583549), and unfortunately this means that there are multiple forks to fix individual issues with no common best version containing all changes.

After dropping the template in the `typings` directory of your project (where TypeScript typings from NuGet are typically deployed), the template will generate output similar to the above. However the "killer feature" is that we can add a C# definition of the client hub interface like this:

{% highlight csharp %}
public interface IChatHubClient
{
    void AddNewMessageToPage(string name, string message);
}
{% endhighlight %}

When we have an interface with the magic name `I(HUBNAME)Client` then a corresponding TypeScript interface will be generated for the client hub.

{% highlight javascript %}
interface ChatHubClient
{
    addNewMessageToPage : (name : number, message : string) => void;
}
{% endhighlight %}

Altogether this gives us the guarantee that calls from the client to the server hub 
have the correct name and type, and that the C# server code and the TypeScript client
code share a corresponding type for the client hub methods (but no static checking of actual
calls from server to client hub).

![TypeScript IntelliSense]({{ site.baseurl }}/nwolverson/assets/signalrtyped/typescript-intellisense.png)

You can see a working example project of this approach [here](https://github.com/nwolverson/blog-signalrtyped/tree/master/SRHubExampleHubsTT).

## Calling client hubs

*Edit: See update below, this is supported directly in SignalR 2.1*

I said that the translation of a C# interface for a client hub to the corresponding TypeScript type was a killer feature, but it is not yet giving us
any form of safety, or much convenience other than having our definitions in one place. This is because the client hubs are accessed via the use of
`dynamic` method invocations:

{% highlight csharp %}

Clients.All.AddNewMessageToPage(name, message);

{% endhighlight %}

The hub has a `IHubConnectionContext<dynamic>` which exposes various things such as `Clients.All`, `Clients.Caller`, or the ability to talk to clients
for named connection IDs, groups, etc. 

One approach suggested to ensure strong typing [makes use of conditional compilation](http://onoffswitch.net/strongly-typing-signalr/) to ensure that
the client interface (as we may have generated with `Hubs.tt`) typechecks, while the actual compilation happens using the `dynamic` object (as it has to
for SignalR to work). This is a bit hacky and frankly unsatisfying, so fortunately with the use of a Castle dynamic proxy, [one can do much better](http://onoffswitch.net/strongly-typing-signalr/). With this approach, we end up with a strongly typed wrapper to the client hub (using the interface
type which corresponds to the generated TypeScript interface), which delegates to the `dynamic` hub proxy under the hood:

{% highlight csharp %}
public void Send(string name, string message)
{
    AllClients.AddNewMessageToPage(name, message);
}
private IChatHubClient AllClients
{
    get { return (Clients.All as ClientProxy).AsStrongHub<IChatHubClient>(); }
}
{% endhighlight %}


![Strong client hubs Intellisense]({{ site.baseurl }}/nwolverson/assets/signalrtyped/stronghub-autocomplete.png)


You can find a complete example [here](https://github.com/nwolverson/blog-signalrtyped/tree/master/SRHubExampleHubsTT) which puts everything together with `Hubs.tt` plus this Castle proxy approach. Here every call
from client to server or server to client is strongly typed, and nothing is declared in two places which might go out of sync. The server hub class
is implemented, and a corresponding TypeScript interface will be generated for client to server calls; then an interface is defined in C# for the 
client hub, which will be used on the server side (via Castle proxy) and will generate a TypeScript interface which must be implemented on the client side.

There's no reason this approach can't be used via the SRTS tool also: currently the client interface has to be defined by hand, but this could also be extended along the lines of `Hubs.tt` (example [updated in repository](https://github.com/nwolverson/blog-signalrtyped/tree/master/SRHubExampleHubsTT)).

## Calling client hubs - New and Improved

Since SignalR 2.1, strongly typed client hubs are [supported out of the box](http://www.asp.net/signalr/overview/signalr-20/hubs-api/hubs-api-guide-server#stronglytypedhubs) (thanks Damian for pointing this out in comments). Instead of `Hub` you can just use the `Hub<T>` type, where `T` is the interface type of your client hub. So the above looks like this:

{% highlight csharp %}

public class ChatHub : Hub<IChatHubClient>
{
    public void Send(string name, string message)
    {
        Clients.All.AddNewMessageToPage(name, message);
    }
}

{% endhighlight %}

Much better. This looks just the same as the `dynamic` version, but `Clients.All` genuinely does have the
client hub type `IChatHubClient`. Sadly the SRTS tool doesn't currently recognise the `Hub<T>` type, but there would be no obstacle to doing so; this works well together with `Hubs.tt` as above.

## F# Type Provider

The approach defined above would be my *recommendation*. However I have been experimenting with a different kind of approach based on F# Type Providers. A work in progress is [available on GitHub](https://github.com/nwolverson/signalrprovider). F# Type Providers  basically allow for code generation at compile/edit time to give code completion & type safety over some existing API. Common examples are web services, database access, or CSV/XML files. Together with this I'm using [FunScript](http://funscript.info/), an F#-to-JavaScript transpiler, for the client side. Then a type provider is used to access the client hub types from the server, and vice versa.

The server project defines a SignalR Hub class (and I'm using a simpler example for this section):

{% highlight fsharp %}
open Microsoft.AspNet.SignalR

[<HubName("myhub")>]
type MyHub() = 
    inherit Hub()

member this.frob(x: int) = 42 + x
{% endhighlight %}

The client is written using FunScript, uses the existing FunScript bindings for SignalR, and has a reference to the server DLL. FunScript and the bindings for common libraries (those with bindings in the DefinitelyTyped project) are available via NuGet, while some simple wrapper code is needed to generate the corresponding JavaScript. The client references the SignalRProvider, which searches for hubs (by attribute) in the referenced DLLs, and exposes these as new types:

{% highlight fsharp %}
let signalR = Globals.Dollar.signalR  // FunScript binding for SignalR TypeScript definition
let serverHub = new Hubs.myhub(signalR.hub) // Hubs.myhub type generated by SignalRProvider from above definition
{% endhighlight %}

Then when a method on the hub is called, it will be typechecked at compile time of the FunScript code, and code will be emitted to call the corresponding SignalR JavaScript methods. 

{% highlight fsharp %}
serverHub.frob(10); // OK
serverHub.frob("string") // Fail to compile
serverHub.foo(10) // Fail to compile
{% endhighlight %}

We also get intellisense on these methods, so that whenever the server hub API is updated, we can see the full list of methods when writing the client side.

![SignalRProvider IntelliSense]({{ site.baseurl }}/nwolverson/assets/signalrtyped/signalrprovider-autocomplete.png)

The current version of this provider is unfinished, in particular lacking support for server calls to client hubs, so I can't give the same chat example here.

## Conclusion

I really like SignalR and the ease with which it enables bidirectional communication (and particularly server-client push notifications) abstracting over the underlying transport. The combination of TypeScript and a couple of the tools outlined above resolve the one thing that
really bugged me about SignalR, the lack of type-checking, without proving too burdensome. 

It has been fun (if frustrating) to build the SignalR type provider, and I've certainly learned a few obscure things, but I can't quite recommend anybody should use it yet!























