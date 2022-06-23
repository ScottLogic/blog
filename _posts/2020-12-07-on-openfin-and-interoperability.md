---
title: On OpenFin and Interoperability
date: 2020-12-07 00:00:00 Z
categories:
- mbuhagiar
- Tech
author: mbuhagiar
layout: default_post
summary: OpenFin enables the use modern web technologies in place of older legacy
  systems. In this post we investigate the 3 primary communication techniques made
  available when using OpenFin to build the next generation of applications for the
  financial desktop.
contributors: shamiltonritchie
---

My colleagues and I recently took on some work for a client with an app that was originally launched in 2005, with the goal of migrating it to one that is web based and running on [OpenFin](http://openfin.co). It was decided that the first iteration of the migration would retain the logic in the existing legacy application, and a number of different screens would be migrated to web based ones. Included in this migration were also a number of instrument charts used in different parts of the app. This blog post investigates the three communication techniques provided by OpenFin which helped us deliver these requirements.

# What is OpenFin?

OpenFin enables you to build multi-window desktop apps that look and feel just like native installed apps so you can maximize your desktop real estate. The [OpenFin](http://openfin.co) runtime builds on [Electron](https://github.com/electron/electron) providing web content with a native application look-and-feel and additional services. With OpenFin's web distribution model, updates happen far more rapidly than the traditional installer-based model.

Their engine also provides adapters for integrating with applications in Java and .NET, development platforms that are still heavily used to build financial apps. The messaging methods explored below enable cross-technology and cross-application interoperability.

## A Modular Future

Small, loosely-coupled components deliver a robust user experience with lower ongoing development and deployment costs than monoliths. A modular approach is now largely considered to be a better way forward in modern server side architectures. Similarly, modern client facing apps should adopt similar strategies. This makes OpenFin's interoperability features a necessity from a first party perspective.

Futhermore, companies such as [Infragistics](https://www.infragistics.com/openfin), who provide tools commonly used in financial markets, are enabling their components for the OpenFin platform. Using preexisting and battle-tested third-party components can reduce both development and testing effort, reducing time to market and allowing clients an edge in an already-competitive market. This makes OpenFin's interoperability features invaluable when interacting with third party providers.

## In Touch With The Past

It is an inevitable truth that most clients have existing applications. Utilizing existing code and investments is preferable, often essential, rather than attempting 'Big Bang' migrations to a new platform. See for instance the [white paper](https://blog.scottlogic.com/2015/10/11/white-paper-html5-migration.html) by Colin Eberhardt, Technology Director at Scott Logic. Staggered migrations (the 'Little Bang' approach as Colin calls it) are becoming more common. It is these situations which highlight the importance of OpenFin's interoperability features. Using the communication methods described below, developers can migrate distinct features from the legacy application to a newer web-based app running on the OpenFin engine while maintaining seamless integration between the two apps.

# We Need to Talk

Out of the box, OpenFin provides three primary communication paradigms. The first is the OpenFin InterApplicationBus (IAB), which is a messaging system that supports a number of different interoperability strategies, including pub/sub, topic based messaging, direct connections between applications, and one-to-many connections. The latter also opens up the possibility for broadcasting messages across a number of applications. The second, is the Channels API which builds on the IAB by offering asynchronous methods for discovery, transfer of data, and lifecycle management. The IAB and the Channels API are common in that they are both designed to enable communication between apps built on OpenFin.

However, there exist other platforms which at their core provide the same base functionality as OpenFin. Some examples of these are Glue42 and Finsemble. So what happens if you want your legacy application to be able to interact with any of these platforms? This is where the FDC3 standard, our third paradigm, plays a crucial role. This is because it allows communication with applications regardless of which platform they are built on. We will see more on this below.

## Primarily Intra-app Communication

The examples in this section revolve around a scenario where an existing Java based client application is being partially migrated to a new tech stack comprised of OpenFin, TypeScript and [React](https://reactjs.org/). While the examples are all React based, we will only use OpenFin's own API, and we forgo using the [OpenFin React Hooks](https://blog.scottlogic.com/2019/09/06/Introducing-React-Hooks-for-OpenFin.html) library by my colleagues at Scott Logic. This is being done in an effort to ensure that all snippets below are somewhat framework agnostic.

### IAB

The IAB provides three main functionalities:

- **Publish**: Broadcasting a message to all subscribers to a specific topic;
- **Send**: Sending a directed message to an individual application on a specific topic;
- **Subscribe** / **Unsubscribe**: For a client to start or stop receiving messages for a particular topic, respectively. Subscriptions can either be made against a specific publisher identity, or using the `*` (i.e. all sources) wildcard.

This creates a somewhat tight level of coupling between publisher and subscriber, since they both need to agree on a topic, and they both need to know each other's identity. The latter requirement is somewhat optional when using the `*` wildcard, and we'll see this in the code samples below.

For the following examples, we're going to consider migrating the UI of our super high tech clock component from Java to React. This means that the clock logic will remain in our Java code, however it will be displayed on OpenFin instead. Let's have a look at a simple Send and Subscribe combination.

~~~java
****** Java Start ******
public static void main(String args[]) {
  // Our source, specifically bound to our java application
  String destination = "openfin-IAB-typescript-demo";
  // The topic which we are interested in
  String topic = "clock";

  try {
    // Get an instance of the IAB (Setting up OpenFin is out of scope)
    InterApplicationBus iab = OpenFinService
                                .getInstance()
                                .desktopConnection
                                .getInterApplicationBus();
    do {
      // Build our message
      String message = "The time is: " + Calendar.getInstance().getTime();
      // Send message over the IAB directly to the destination, for a specific topic
      iab.send(destination, topic, message);
      // Wait a second
      Thread.sleep(1000);
    } while (true);
  } catch (InterruptedException | DesktopException e) {
    e.printStackTrace();
  }
}
****** Java End ******
~~~

~~~typescript
****** Typescript Start ******
function App() {
  // State to hold our current message
  const [message, setMessage] = useState("Waiting for message...");

  // Our source, specifically bound to our java application
  const source = { uuid: "openfin-IAB-java-demo" };

  // The topic which we are interested in
  const topic = "clock";

  // Create a useEffect which will only be run on initial component load
  useEffect(() => {
    // Create a listener to update our message state
    const listener = (message: any) => {
      setMessage(message);
    };

    // Subscribe to the IAB for the desired source and topic
    fin.InterApplicationBus.subscribe(source, topic, listener);

    // Clean up
    return () => {
      // Unsubscribe our listener from IAB for the desired source and topic
      fin.InterApplicationBus.unsubscribe(source, topic, listener);
    };
  }, []);

  // Display the message
  return <>{message}</>;
}
****** Typescript End ******
~~~

Now, let us build upon this scenario, and imagine that there are multiple UI components which utilize this clock logic. We can implement this by having a list of destinations, and looping through them when we need to send an update. But this is obviously naive, and the best way forward would be to use the IAB's publish (broadcast) feature on a specific topic. The typescript code doesn't require any changes.

~~~java
****** Java Start ******
public static void main(String args[]) {
  // The topic which we are interested in
  String topic = "clock";

  try {
    // Get an instance of the IAB (Setting up OpenFin is out of scope)    
    InterApplicationBus iab = OpenFinService
                                .getInstance()
                                .desktopConnection
                                .getInterApplicationBus();();
    do {
      // Build our message
      String message = "The time is: " + Calendar.getInstance().getTime();
      // Publish message on the IAB for a specific topic
      iab.publish(topic, message);
      // Wait a second
      Thread.sleep(1000);
    } while (true);
  } catch (InterruptedException | DesktopException e) {
    e.printStackTrace();
  }
}
****** Java End ******
~~~

Alright, fantastic, so we're now notifying anyone and everyone who cares to know about the time.
But what happens if we're created a new app, that doesn't know who's going to be sending messages on the clock topic? This is when we'd use the **\*** wildcard to subscribe to a topic irrespective the source. I would urge anyone considering using this to do so with **_EXTREME_** caution. Since the sender is somewhat anonymous, there is an element of blind belief that this entity is trustworthy. For instance, it is possible that a different sender will send messages on our clock topic in a different timezone.

~~~typescript
****** Typescript Start ******
function App() {
  // State to hold our current message
  const [message, setMessage] = useState("Waiting for message...");

  // Our source parameter will now accept messages from all sources irrelevant of their UUID
  const source = { uuid: "*" };

  // The topic which we are interested in
  const topic = "clock";

  // Create a useEffect which will only be run on initial component load
  useEffect(() => {
    // Create a listener to update our message state
    const listener = (message: any) => {
      setMessage(message);
    };

    // Subscribe to the IAB for the desired source and topic
    fin.InterApplicationBus.subscribe(source, topic, listener);

    // Clean up
    return () => {
      // Unsubscribe our listener from IAB for the desired source and topic
      fin.InterApplicationBus.unsubscribe(source, topic, listener);
    };
  }, []);

  // Display the message
  return <>{message}</>;
}
****** Typescript End ******
~~~

### Channels API

The Channels API should be used when we want to integrate asynchronous calls into the workflow and employ secure two-way messaging. It should also be used when providing a service over OpenFin. In fact, OpenFin's own developed services use the Channels API to send messages to other applications running on the desktop. The provider (the service app) creates a channel which clients can then connect to and send messages across. Channels also differ from the IAB in that they provide bidirectional communication between the provider and the client.

If we retain our example from above, our provider is the Java app, and the React app is our client.

~~~java
****** Java Start ******
public static void main(String args[]) {
  // The OpenFin desktop connection
  DesktopConnection desktopConnection = OpenFinService.getInstance().desktopConnection;
  // Desired channel name
  String channelName = "clock";
  // Get the desired channel, and create it.
  // This will fail if a channel with the same name already exists.
  desktopConnection.getChannel(channelName).create(new AsyncCallback<ChannelProvider>() {
    @Override
    public void onSuccess(ChannelProvider provider) {
      try {
        // Loop ad infinitum
        do {
          // Build message object
          JSONObject message = new JSONObject() {{
            put("message", "The time is: " + Calendar.getInstance().getTime());
          }};
          // Publish a message by invoking the update action
          provider.publish("update", message, new AckListener() {
            @Override
            public void onSuccess(Ack ack) {
              // Process message sent back by the client
              System.out.println(ack.getJsonObject()
                      .getJSONObject("data")
                      .getJSONObject("result")
                      .get("response"));
            }

            @Override
            public void onError(Ack ack) {
              // Handle error if client throws
              System.out.println("An error was encountered!");
            }
          });
          // Wait a second
          Thread.sleep(1000);
        } while (true);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
  });
}
****** Java End ******
~~~

~~~typescript
****** Typescript Start ******
function App() {
  // State to hold our current message
  const [message, setMessage] = useState("Waiting for message...");

  // The channel name which we are interested in
  const channelName = "clock";

  // Create a useEffect which will only be run on initial component load
  useEffect(() => {
    // Create a variable to hold the channelClient
    let channelClient: ChannelClient;

    // Channel API is async, which means we need a wrapper for use in UseEffect
    (async () => {
      // Connect to the desired channel
      channelClient = await fin.InterApplicationBus.Channel.connect(channelName);

      // Register an action which will be executed after an action invocation is complete
      channelClient.afterAction(() => {
        console.log("Action invocation complete");
      });

      // Register to the update action, and invoke the provided listener when action is called
      channelClient.register("update", (messageWrapper: any) => {
        // Set the message state
        setMessage(messageWrapper.message);
        // Send a response to the provider
        return { response: "Thank you!" };
      });

      // Register a callback which is called when provider is no longer available
      channelClient.onDisconnection(() => {
        setMessage("Service has disconnected!");
      });
    })();

    // Clean up
    return () => {
      if (channelClient) {
        // Disconnect from the channel
        channelClient.disconnect();
      }
    };
  }, []);

  // Display the message
  return <>{message}</>;
}
****** Typescript End ******
~~~

Note that the provider now has the opportunity to wait for replies after sending a message by means of the _ackListener_ that can be provided to the _publish_ method. On the client side we've also added support for _afterAction_ and _onDisconnection_.

## Primarily Inter-app Communication

Let us now consider a different scenario. You're working on a suite of components to display different market information. The logical route in this situation is to expose these using FDC3. This will allow your components to be used by any application as long as they support the FDC3 standard.

## FDC3

Using FDC3, provider apps simply register what their intent is, and then wait for a different application to raise that intent. For instance, consider a scenario where a number of different applications, some built using OpenFin, and others using a competing platform, provide a functionality to view an instrument chart. These would each register the 'ViewChart' intent, exposing their ability to view a chart. During the runtime of your main application, whenever you would like to display the chart for a particular instrument, the 'ViewChart' intent would be raised and a list of the applications which support the intent is then displayed, delegating the choice of application to the end user. Similarly, it is through the use of FDC3 intents that we enable the use of third party components such as those provided by Infragistics.

In order to enable FDC3 support in our OpenFin app, we need to add `"fdc3Api": true` to our _startup_app_ property in the app manifest. Note, that in older version of the OpenFin runtime (< 17.85.55) required FDC3 to be registered as a service in the application's manifest file. This is no longer a requirement.

~~~java
****** Java Start ******
public static void main(String args[]) {
  // Create the FDC3 Client
  FDC3Client fdc3Client = FDC3Client.getInstance(OpenFinService.getInstance().desktopConnection);
  // Connect to the FDC3 Client
  fdc3Client.connect(new AckListener() {
    @Override
    public void onSuccess(Ack ack) {
      // Desired channel name
      String intent = "ViewChart";

      // Construct a the context object for an instrument
      Context context = new Context("fdc3.instrument", "Apple");
      context.put("id", new JSONObject() {{
        put("ticker", "aapl");
      }});

      // If we have multiple applications that support the ViewChart intent
      // allow the user to pick which app to use
      fdc3Client.raiseIntent(intent, context, null, new AsyncCallback<IntentResolution>() {

        // On receipt of a successful ack
        @Override
        public void onSuccess(IntentResolution result) {
          // Print out the message sent back by the recipient of our message
          System.out.println(String.format("reply received: %s", result.getData()));
        }
      });
    }

    @Override
    public void onError(Ack ack) {
      // Handle error with creating FDC3 client
    }
  });
}
****** Java End ******
~~~

~~~typescript
****** Typescript Start ******
function App() {
  // State to hold our current message
  const [message, setMessage] = useState("Waiting for message...");

  // The channel name which we are interested in
  const intentName = "ViewChart";

  // Create a useEffect which will only be run on initial component load
  useEffect(() => {
    // Create a variable to store listener
    let listener: IntentListener;
    // Channel API is async, which means we need a wrapper for use in UseEffect
    (async () => {
      // Register intent handler
      listener = await fdc3.addIntentListener(
        intentName,
        (context: Context) => {
          setMessage((context as InstrumentContext).id.ticker || "");
          return "Thank you!";
        }
      );
    });

    // Clean up
    return () => {
      if (listener) listener.unsubscribe();
    };
  }, []);

  // Display the message
  return <>{message}</>;
}
****** Typescript End ******
~~~

# Conclusion

In this post we had a brief look at the different communication options available to us when using OpenFin. The most important consideration when picking any of the three options, is the availability of the service being provided.

The IAB will lead to a somewhat more tightly coupled solution, over those using the Channels API. This is because more often than not, sending and receiving messages over the IAB requires prior knowledge of the other end's identity. Having said this, both are still adequate options when migrating from a legacy app, or writing components which are designed to work in a smaller scope. If we use client-server communication as an analogy, the IAB is similar to UDP.

The Channels API will be a better option when working on a services intended to be used by various applications within the same organization. Similar to a websocket in client-server communication, this is best suited when bidirectional communication over a persistent connection is required.

Finally, if you are working on a suite of new UI components that are encapsulated in the task which they perform (such as charts, grids, etc.), your best bet is likely to be using FDC3, since as long as the standard is adhered to, it will allow reusing the same tools across many different contexts. If we were to once again use our analogy form above, FDC3 is more akin to a REST API allowing request/response interaction.

For more information on the functionalities provided by each of the three methods discussed above, kindly consult the [OpenFin developer resources](https://developers.openfin.co/docs/channels-api-and-interapp-bus).
