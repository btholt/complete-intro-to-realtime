---
path: "/conclusion"
title: "Conclusion"
order: "6A"
description: ""
section: "The End"
icon: "check-circle"
---

You did it! You learned realtime and several techniques you can use to go about doing realtime communication. Before we wrap up, I want to talk about a few additional pieces of connections you can do that we didn't talk about.

## ws

[ws][ws] is the other leading implementation of WebSockets for Node.js and a damn good one. Frankly most of the time I choose it over Socket.IO because it's more minimal and I don't need the richness of what Socket.IO offers all the time. But honestly both are great and valid decisions. ws is nice because it _doesn't_ have a client; you just use the same `new WebSocket()` call we did on the client because that's more than enough for just WebSocket usage. However if you need all that retry logic, it's hard to beat Socket.IO. It's good for you to give this one a try too.

## HTTP2 Push

Think of this as a one-way socket. Your client can connect to a server and the server can push many messages to the client. The difference here is that messages don't flow the opposite way: your client can't use the same connection to push messages back. In the terms of the app we just built, we could start a long-running HTTP2 connection and use that to get updates on new messages but just a normal RESTful POST back to the API to post a new message. Perfectly great architecture decision.

## WebRTC

This is a similar idea but it's actually peer-to-peer rather than client-server. For our chat app, what would happen is a user would connect to the server and then the server would faciliate you connecting to your peers and then you would establish a connection with other chat users and send them messages directly without using the server as the middleman.

## SignalR

Just wanted to shout out an emerging technology from Microsoft that I think is cool, even if it's not really in use for Node.js yet. [SignalR][signalr] is a realtime technology built for .NET but there have been rumblings of supporting platforms outside of .NET. In any case, it builds upon WebSockets (and occasionally will use them directly) to establish realtime communications. Think of it more as a competitor to Socket.IO where it's a protocol and library that uses various transports (HTTP, WebSockets, etc.) to do that. I was really impressed with it when I worked at Microsoft.

## Where to go from here

So what now? I'd suggest either expanding upon our chat app and add features like a user system where users have to authenticate, direct/private messages, chat rooms, and some sort of durable storage like a database to store things. You could also make some sort of realtime drawing applications where many users can draw on one canvas in realtime. Try to flex those realtime muscles! You could also rebuild the frontend in your framework of choice like [React][react] to see how your preferred frameworks interacts with a realtime client.

## Congrats!

Congrats again! Be sure to tweet at me and Frontend Masters and let us know how you did!

[ws]: https://github.com/websockets/ws
[signalr]: https://docs.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-5.0
[react]: https://frontendmasters.com/courses/complete-react-v6/
