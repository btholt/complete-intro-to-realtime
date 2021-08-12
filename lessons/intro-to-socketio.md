---
path: "/socketio"
title: "Intro to Socket.IO"
order: "4A"
description: ""
section: "Socket.IO"
---

Okay, so we got WebSockets working by hand, and we did it with no libraries. While a fun academic exercise, it's not a super practical approach to doing realtime communications. I'd say it's as practical as writing a Node.js server with zero libraries. Sure, the http library technically has all the building blocks you need but even something as Express can save you so much time in re-inventing the wheel. Beyond that, those core mechanics of adding middlewares and such are already well written and tested at scale.

Similarly, with WebSockets, we _could_ write something that decodes frames by hands, handles all the connections, and all that by hand, but in the end we'll have a much larger surface area of code to maintain and bugfix for not much benefit. I'm even doubtful that you could eek out much performance benefit.

In the end, you are _much_ better off using some sort of library to handle your WebSockets for you. There are a few super-high quality ones that are well maintained and already used at massive scales. There are a few options but two chief ones: [Socket.IO][io] and [ws][ws].

Let's chat a moment about ws. ws is a minimalist solution. It implements a clean, minmial take on WebSockets from a server perspective and then allows you to use the same WebSocket native object we were using in the browser for the first WebSocket example. It's a wonderful library and one you should definitely consider if you don't need the extra functionality that ships with Socket.IO. We are going to be talking about Socket.IO so you can get familiar with its functionality but know that ws is out there and a very good choice too.

We are going to be talking about Socket.IO and only scratching its service. Socket.IO has a _bunch_ of functionality that it builds on top of sockets and can be super useful depending on your usecase

- Managing of "rooms" or pools of connections. Think if you're building a Slack clone and you need multiple channels, you could use rooms to model people joining and leaving a room, but it could also be realms of a video game or multiple users collborating on a whiteboard
- Be able to send and receive binary objects like photos, audio, and videos
- If your user's browser doesn't support WebSockets, it'll fallback on long-polling! A very cool feature if you need to support devices with varying capabilities and it works seamlessly from the code perspective
- Middlewares! Socket.IO has built-in support for adding middlewares so you can do things like auth, rate limiting, logging, and the like. It's compatibile with most existing connect-style middleware (aka Express middleware) so there's already a rich amount open source stuff you can use.
- There are very cool libraries that will allow your clients to directly subscribe to data stores like MongoDB, Redis, PostgreSQL, and more with just a few lines of code.

There's a lot more we could talk about. But for now let's go reimplement our project with Socket.IO.

[ws]: https://github.com/websockets/ws
[io]: https://socket.io
