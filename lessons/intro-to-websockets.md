---
path: "/intro-to-websockets"
title: "Intro to WebSockets"
order: "3A"
description: ""
section: "WebSockets By Hand"
---

Let's get into true realtime: WebSockets. WebSockets are a primitive built into both browsers and backends alike that allow to us to have a long-running connection that allows clients to push data to servers and servers to push data to clients. As opposed to long-polling where we had a client that requesting and posting data to and from a server over many small connections, a WebSocket is one long-running connection where servers can push data to clients and vice versa. This is true realtime because it allows both sides to engage in realtime communication.

So how do this connections work? We're going to implement a WebSocket connection by hand, getting down into the binary frames being sent back and forth between your server and the browser. Why? You would never actually write this code yourself. But, just like [in my containers course][containers] where we build containers by hand to see how they actually work, we are actually going to build it so we can understand what underpins the technology. While you may never need to build it yourself, it will make you a better programmer to know how the tool works and you'll be grateful for the abstraction when you use it because you'll understand the complexity it is shielding you from.

So let's begin by getting our chat app working with sockets we build by hand.

[containers]: https://frontendmasters.com/courses/complete-intro-containers/
