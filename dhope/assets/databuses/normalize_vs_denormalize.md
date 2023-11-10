# What to send on your event bus
Messages, instructions, events, states
Message - this is poorly defined. The literature talks about messages being things you send on queues. I'd suggest this could be be an instruction or state but is generally targeted somewhere. You send out a message to someone usually.

An event says that something has happened or changed, e.g. "profile created". State contains the state of something like a user's profile. The two can be mixed. e.g. a state update contains 
An instruction says "do X". For example, let's say we want to request a delivery with the courier for a customer's order this may work 2 ways:
 * the courier listens to order placed events and creates delivery arranged events
 * an intermediary service consumed the order placed events and knows certain things must happen off the back of that. It writes out a "DELIVERY NEEDED" intruction

## Normalization vs de-normalization
In realational database books we always encounter a discussion around how far to normalise your data and the pros and cons of doing this. When it comes to sending data between services this is much less discussed but is also important. 

Security considerations when aggregating