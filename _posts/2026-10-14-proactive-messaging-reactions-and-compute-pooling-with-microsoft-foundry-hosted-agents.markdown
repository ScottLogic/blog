---
title: Proactive messaging, reactions, and compute pooling with Microsoft Foundry
  hosted agents
date: 2026-10-14 12:00:00 Z
categories:
- Artificial Intelligence
summary: In the course of building a Foundry hosted agent for Microsoft Teams, we
  found that while it was straightforward to get a basic code-based agent working,
  we quickly ran into use cases that weren’t supported. We wanted our agent to contact
  users proactively rather than only respond directly to their messages, and we wanted
  it to be in the loop for message reactions and other rich communication beyond simple
  text messages.
author: rwilliams
---

In the course of building a Foundry hosted agent for Microsoft Teams, we found that while it was straightforward to get a basic code-based agent working, we quickly ran into use cases that weren’t supported. We wanted our agent to contact users proactively rather than only respond directly to their messages, and we wanted it to be in the loop for message reactions and other rich communication beyond simple text messages.

In this post, I’ll cover how building a bespoke gateway in front of hosted agents allows these use cases (and others) to be solved, while continuing to make use of the platform’s capabilities. I’ll start with the simplest use case \- passing message reactions (e.g. thumbs up).

## Primer: Microsoft Foundry

Foundry is Microsoft’s latest AI platform on Azure, offering a wide range of capabilities needed by agents and agentic software. The hosted agents feature takes care of deployment and hosting, allowing developers to focus on building. Agent applications are built as containers, which the platform then provisions and wires up to facilities including model inference, conversation management, and connections to user facing bot applications.

## Message reactions

Reactions are a normal part of chat-based conversations, so users will use them and expect agents to understand them. A feedback gathering solution could also make use of reactions. Foundry agents won’t however receive these when connected to Teams through the default flow.

The following simplified diagram shows the full path of user messages to our agent. The Azure Bot Service can connect to a wide range of user applications that can embed agents (in this case, just Teams), and expose them internally using the standardised Activity protocol. This protocol includes all concepts required to drive rich conversations, such as messages, typing activity indicators, and message reactions. By default, the Bot Service is connected directly to Foundry using this protocol. Foundry does a few things to run our hosted agent (more on this in the next section), and passes messages between the Bot Service and it. This passing uses OpenAI’s Responses protocol, which is a more general protocol for model responses. The protocol translation is lossy and only the text of messages is passed through \- the other rich activities are dropped by Foundry.

![]({{ site.github.url }}/rwilliams/assets/foundry-middle-tier/image1.png)

To solve this lossy conversion, we introduce a bespoke gateway component between the Bot Service and the Agent Service where we implement our own translation. The gateway is a small application built using the Microsoft 365 Agents SDK, which I chose to run in an Azure Function in this example. It will later also enable other use cases including proactive messaging.

In addition to providing pass-through functionality for simple messages like Foundry did, it registers a handler for \`messageReaction\` activities. When a reaction is received, it fabricates a Responses message narrating the reaction, and passes it to the agent.

![]({{ site.github.url }}/rwilliams/assets/foundry-middle-tier/image2.png)

```python
# Simplified
agent_app = AgentApplication[TurnState](...)

@agent_app.activity("messageReaction")
async def on_message_reaction(context: TurnContext, _state: TurnState):
    user_id = context.activity.from_property.aad_object_id

    message = "\n\n".join([
        f"The user reacted in Teams to your message.",
        f"Added: {context.activity.reactions_added[0].type}"
    ])

    await survey_agent_client.send(user_id, message, role="developer")
```

The message is sent with the [“developer” role](https://model-spec.openai.com/2025-02-12.html#chain_of_command), so the agent model understands its relative authority and that it’s not something the user typed.

While the simplified implementation above illustrates the pattern, it doesn’t handle removing reactions (easy to add), and more significantly, it doesn’t inform the agent which message the user reacted to. There are a few ways that could be done, all driven from the reaction activity’s \`reply\_to\_id\`. We could keep track of the id of the agent’s last message, and compare against that to determine if the reaction was to it (perhaps the most common case) or to an older message (less likely and significant; could be ignored). Alternatively we could retrieve the reacted-to message’s text from Teams via the Microsoft Graph API, and pass it back to the agent within our narration message. A more advanced solution might expose message IDs to the model context in the hosted agent, so the narration message could simply refer to them by ID. Note the Foundry and Bot Service sides use different message identifiers, so some mapping may be required.

With the gateway in place, we have full access to the Activity protocol and full control over the API calls made to Foundry, while Foundry retains responsibility for managing the hosted agent containers and conversations.

## The default user to agent chain

Whilst that sets out the concept of the solution, to fully understand and implement it we need to understand a bit more about what’s happening in Foundry and its architectural surroundings. Let’s delve into the components between the user and the agent \- first **without** our new gateway in place (you may wish to skip this if you’re already familiar with them).

![]({{ site.github.url }}/rwilliams/assets/foundry-middle-tier/image3.png)

**Microsoft Teams** is the only user facing application we’re targeting here. Agents/bots and other software that can be conversed with are called “apps”. They are packaged as zip files containing a manifest file and an icon image as a minimum. The manifest contains a “bot id” referencing our Bot Service on Azure, so Teams knows where to send conversation traffic. Apps are published to an organisation’s store (with approval), which makes them available for users to install. Developers can also install apps directly for themselves alone (sideloading) using the zip package.

**Azure Bot Service** connects bot applications to user facing applications (known as channels) for consumption. It offers broad compatibility and integrations on both sides \- bespoke or pre-packaged commercial bots, and user channels including Teams, Slack, Alexa, and a “direct line” HTTP API for applications such as bespoke web/mobile apps. It’s a stateless service.

**Microsoft Foundry**, which is primarily an Azure service, is a platform made up of many components and features. It’s often helpful to refer to specific parts of it rather than as a whole. “Foundry” resources are created in the Azure Portal, and then managed in the Foundry Portal. Some, or perhaps many, of its features are rebrands or abstractions on top of Microsoft’s previous AI offerings.

**Foundry Agent Service** runs no-code prompt agents and code-based hosted agents. The latter are packaged as containers, and the service provisions them as needed to serve incoming requests. They can expose APIs using the Responses and/or Invocations protocols \- both over HTTP. Supporting features such as models, conversation history continuation, and observability are made available with little or no effort for agent developers. The “basic setup” configuration allows getting started with agents quickly by using platform defaults for most of the surrounding components (e.g. conversation storage), while the “standard setup” configuration gives developers control and responsibility for these.

As I described earlier, the Foundry Agent Service by default acts as a bridge between the Activity protocol on the Azure Bot Service side, and the Responses protocol on the hosted agent side. It’s responsible for translating messages between the protocols (lossily, as we saw), identifying the user to the agent, and maintaining association between Bot Service conversations (i.e. the conversation as seen in Teams) and Agent Service conversations (i.e. the conversation as seen by the agent).

**Hosted Agents** are where your agent product’s code and prompts live. Python and C\# are the only languages currently supported. Developers can use their frameworks or libraries of choice, such as Microsoft Agent Framework, or Langchain. The Foundry Agent Service strongly separates user data and sessions \- even running a separate container instance for each user conversation by default. Each agent instance runs using its own identity rooted in an agent identity blueprint.

Overall, this setup enables the basic use case of a user chat agent with relative ease. However, I found limited room for configuration or adaptations without taking a significant step up in bespoke development, deployment, and operation.

### Aside: logging and ConditionalAccessBlocked error

After I assembled my first end to end agent setup, nothing would happen when I sent the agent a message, whether from Teams or from “Test in Web Chat” on the Bot Service in Azure Portal. Request logs in the Bot Service’s Log Analytics Workspace and the Foundry instance’s Application Insights showed my messages passing through, but no agent activity, and no errors either.

The first suspect,  \`GET NonExistentController\` entries in the Bot Service’s \`ABSBotRequests\` logs turned out to be a red herring \- these seem to be caused by liveness checks polling the service.

Looking more widely in the Foundry instance’s App Insights logs, I found a \`dependencies\` table which contained some “agents.error” entries. These were for \`ConditionalAccessBlocked\` errors with the message “Agent Identity token issuance is blocked by a Conditional Access policy. Update the Conditional Access policy to allow token issuance for the agent identity.”.

This indicated that the organisation’s corporate IT policy blocked agent identities that were not known to the administrators. Foundry Agent Service was unable to obtain an identity to use when starting the hosted agent container. Yet there was no sign of this in the request log \- presumably, incoming messages are queued up for asynchronous processing, meaning there’s no intact caller chain for this error to bubble back to the callers.

Once the IT administrators had greenlit the agent’s identity blueprint, the policy stopped blocking it, and the agent started and replied.

## Our bespoke gateway

The gateway I introduced earlier to handle reactions takes over some of the responsibilities of the Foundry Agent Service: translating between the protocols, identifying the user, and maintaining the association between Bot Service conversations and Agent Service conversations.

If we want visibility of the Activity protocol traffic (e.g. for the reactions use case), or be able to trigger proactive messages from the agent etc. (see next sections), we have to take over all those responsibilities. This is because the aforementioned responsibilities of the Agent Service are inseparable and don’t appear to offer any room for customisation. While it’s a lot to take on for one of our not-that-advanced use cases alone, it becomes more acceptable when amortised over all of them. Still, it’s something I’d like to see the Foundry platform accommodate more straightforwardly in the future.

The gist of relaying simple text messages is as follows:

1. Listen for activity of type \`message\` on the Bot Service side.  
2. Make a Responses API call to the Foundry Agent Service, including the message text and user identity taken from the message activity.  
3. When the reply comes back, send it back to the Bot Service as a \`message\` activity.

To associate Bot Service and Agent Service conversations with each other, we need to store a mapping table of conversation IDs. This needs to be in persistent storage if conversations are to be long-lived.

![]({{ site.github.url }}/rwilliams/assets/foundry-middle-tier/image4.png)

### Deploying and publishing

The introduction of the gateway means we can no longer use Foundry’s “Publish” feature to create a Bot Service for the agent and publish an app to Teams. That feature creates a Bot Service that uses the agent’s own identity, meaning they can only talk directly \- whereas now they need to go via the gateway.

Instead, we create our own identity for the Bot Service, and create the Bot Service to talk to the gateway with it. Foundry Agent Service requires the calling identity (that of the gateway itself) to have the \`UserIdentityImpersonation\` permission, to permit the \`x-ms-user-identity\` header to be passed.

Finally, because the Teams app’s manifest needs the Bot Service’s App ID, and we created it ourselves, we now also have to build the manifest with this ID and zip up the installation package.

## Proactive work & messaging

Our next use case was proactive messaging \- allowing the agent to message users of its own accord rather than only in reply to a user’s message. This can be split further into what we term “outreach” \- contacting users who haven’t previously interacted with the agent, and “follow-up” \- resuming existing conversations.

There are many product-level use cases that would need this capability. An agent working on a task may need to contact different people for information or input. An agent monitoring system or external events, or news, may need to notify users about things they previously asked to be kept informed about. Or an agent may need to remind a user about something, or introduce itself to users who should use it.

As I mentioned earlier, users need to have Teams apps (bots, agents) installed before they can converse with them. This constraint also applies from the agent’s side \- agents can’t message users who don’t have their bot app installed, nor can they install themselves or otherwise promote themselves to users. Therefore for the outreach use case, developers and administrators first need to use the Microsoft Graph API to [proactively install](https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/proactive-bots-and-messages/graph-proactive-bots-and-messages) an agent’s Teams app for individual users. The installation will emit an “installationUpdate” activity from the Bot Service, containing user and conversation IDs \- but it’s not necessary to rely on capturing this (which could be prone to loss), as conversations can be retrieved or started from the Bot Service API using only the user’s Entra ID (which can be sourced elsewhere).

The Foundry Agent Service currently supports two modes of agent activity: a) responding to incoming messages, and b) “routines” which can be triggered by events or a schedule. Unfortunately, routines in their current form don’t lend themselves to triggering proactive messaging. The only supported trigger events are a few GitHub and Teams ones. Routines run without a user context and are disconnected from user conversations \- each invocation is effectively a short conversation between the agent and the Foundry platform triggering it.

To initiate a proactive message therefore, the only way I found is to send the agent a fabricated trigger message from the gateway, so it can then respond to it. From the agent’s perspective, it’s a response as usual, but from the user’s perspective it will appear as proactive because they won’t see our fabricated trigger message. Any other way (I tried many\!) is either obstructed by the execution model (the lack of a single, always-running agent container), or by the need to keep using the normal message path through the Agent Service in order to avoid gaps in conversation history or even complete loss of it.

![]({{ site.github.url }}/rwilliams/assets/foundry-middle-tier/image5.png)

Just like with our reaction message previously, the trigger message is sent with the “developer” role to distinguish it from user messages. For my proof of concept, I wrote my agent’s system prompt so it would understand what to expect, and used a simple text message to trigger it. To handle more complex needs, the message could be structured data, which the agent’s programmatic code could consume even before the model is invoked.

Triggering the sending of the trigger message from the gateway can be done with any common programmatic means. For example, it could expose an endpoint for something else to call, listen to a queue, or run on a schedule timer. To keep responsibilities in check and avoid the gateway’s role growing into something more, it’s likely we’d want to separate this into another component in our architecture.

## Pooling compute resources

By default, the Foundry Agent Service runs a dedicated hosted agent instance for each calling user. That means a dedicated small virtual machine for each, giving each user’s agent an operating system isolated execution environment and file system. This strong isolation helps ensure safety and security particularly for agents that have powerful capabilities such as local file handling or code execution.

For many agent use cases however, including ours here, this isn’t necessary for maintaining safety, security, and data privacy. Therefore we don’t want to incur the additional cost, resource quota use, or general wastefulness.

Even with auto suspend/resume it would mean we’re running compute that’s sitting mostly idle even during active conversations \- waiting for the user or the model to send the next message. At current prices for the smallest CPU/memory containers, that’s about \$0.15 per hour for each concurrent user. Whether the cost and inefficiency justifies any work to reduce it will depend on agent application workloads and resource requirements.

Microsoft [explains in this documentation page](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/multiplex-session-users) how container sessions can be shared between multiple users and conversations (multiplexing), while maintaining isolation between them. They introduce a “middle tier” (like our gateway), which informs the Agent Service which session should be used to handle any particular request by passing an \`agent\_session\_id\` parameter. The actual session logistics and container lifecycle are still handled by Agent Service \- the middle tier simply maintains a pool of session identifiers, and picks which one to use using any session pool algorithm it likes (e.g. sticky sessions, round robin).

I’m yet to explore implementing this in the gateway. It’s quite unusual for a server/hosting product to require application developers to go all-bespoke in order to have any control over resource pooling and session management \- usually some configuration and/or APIs would be exposed to select from a few predefined approaches and to tweak them. Resource pooling algorithms usually make use of some metrics to make their decisions, however here there doesn’t seem to be any visibility of such metrics (e.g. compute utilisation) for the hosted agent containers on which the sessions run.

## Conclusion

Starting from a straightforward hosted agent working in the Foundry playground, I worked through an identity policy issue to get it working end to end from Teams, and implemented a bespoke gateway to handle proactive messaging and passing message reactions to the agent. The gateway is something I expect to extend for compute pooling and other as-yet unknown use cases.

I was somewhat surprised to see that a bespoke component and custom code were required to implement these use cases, which aren’t particularly advanced. I wouldn’t be surprised if future versions of Foundry introduce them as built-in capabilities with convenient extension and configuration points. I think that would be reasonable to expect from an enterprise AI platform.

My general experience of Foundry so far has been that straightforward things are easy and work well, but doing much more requires developers to take on a lot of complexity and work. In this sense, the well-known programming philosophy of “easy things should be easy, and hard things should be possible” is satisfied \- however I’d like to see more of a gradient and a middle ground in between. Many common-but-not-trivial agent use cases would be well served by being able to step down just one level of abstraction rather than needing to immediately go deep. While AI coding tools can help us, creating and operating extra components and more bespoke code to mitigate the lack of middle ground is still work that takes us away from product-focused development.
