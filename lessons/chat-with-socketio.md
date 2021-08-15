---
path: "/chat-with-socketio"
title: "Chat with Socket.IO"
order: "4B"
description: ""
section: "Socket.IO"
---

> Open the project directory to [websockets/exercise-socketio][start]

This is going to be 100x teams easier than what we were doing before because we don't have to handle the raw mechanics of accepting a connection, negotiating an upgrade, handling the handshake to acknowledge what sort WebSocket connection it will be and what protocol they'll speak with, and so on. Instead, we just get to accept a connection.

In exercise-socketio/backend/server.js, let's do the following

```javascript
const io = new Server(server, {});

io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });
});
```

That's it, at least from a server perspective, to a hello-world Socket.IO app. I want you to take a take a second and pause and appreciate how little we had to do get that working. Whereas before we had to worry about the upgrade, the magic key, the sha1 hash, the base64 response, the data frames, and the binary format, this is _all_ we have to do here. The rest is just handled for us. Can you believe that? It barely seems possible. It's a good moment to reflect on how grateful we should be open source and that a lot of this complexity just gets handled by really smart and hard-working people and we get to stand on the shoulders of these giants.

Let's implement the frontend connection. In exercise-socketio/frontend/socketio-chat.js

```javascript
const socket = io("http://localhost:8080");

socket.on("connect", () => {
  console.log("connected");
  presence.innerText = "🟢";
});

socket.on("disconnect", () => {
  presence.innerText = "🔴";
});
```

The `io` library is being loaded from CDN for you. Normally you'd npm install it and import but for the sake of not having you mess with build tools for the one library I just loaded it for you.

So this code looks really similar to what we had before which is to be expected: from the client's perspective, it doesn't really change too much. But let's talk about two key differences.

1. Like we mentioned before, if your browser couldn't handle sockets (as of writing 98% of browsers can, since IE10) it will fall back to polling and your code doesn't need to change.
1. There is automatic retry logic if your connection closes unexpectedly. Remember in our previous version if the server restarted because we saved it would close the connection. Try that here. Notice our presence indicator will go red for a sec and then back to green. This is free and built into Socket.IO.

Let's implement the initial get. In server.js

```javascript
// inside io.on("connection") under console.log
socket.emit("msg:get", { msg: getMsgs() });
```

Okay, well, that's pretty straightforward. Let's read off the socket in socketio-chat.js

```javascript
socket.on("msg:get", (data) => {
  allChat = data.msg;
  render();
});
```

Let's talk about "msg:get". With Socket.IO that string represents an event name, similar to a browser. Here we're saying we're receiving a "msg:get" library from the server (which we emitted above) and that's when we should expect data. If you've ever done Pub/Sub, that's exactly what this is.

The colon in the middle is what we'd call namespacing. The first bit, the msg part, is the namespace. All "msg" related events will be inside of it. The "get", the last part, represents what actions we're looking to do in that namespace. In reality, it's just a string, this is just a common pattern you'll in Pub/Sub in general, not just Socket.IO.

Okay, so let's finish out now. In socketio-chat.js

```javascript
// replace postNewMsg
async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  };

  socket.emit("msg:post", data);
}
```

We're using the same emit function, just from the client. It's nice to learn the semantics once and apply it multiple ways. Now in server.js

```javascript
// beneath socket.emit("msg:get")
socket.on("msg:post", (data) => {
  msg.push({
    user: data.user,
    text: data.text,
    time: Date.now(),
  });
  io.emit("msg:get", { msg: getMsgs() });
});
```

First part looks familiar, add to our existing data structure. However a big key different lies in the io.emit part. Notice we're using io instead of socket to call emit. Why? Well, we don't want to _just_ emit the msg:get back to the client who posted to us, we want to emit to _all_ clients listening to us. The easy way to do this is just to call io.emit. Try it! Open a second window and try chatting between two clients. Much easier than trying to keep track of all the clients ourselves.

And that's it! Again, we scratched the surface here but I wanted to show you how easy it is to get off to the races with realtime and particularly WebSockets wit Socket.IO. Cool ways you could expand this project.

- Convert from a JavaScript project to a React or other framework project to see how to add realtime to your frameworks
- Make it so users can private message each other based on their usernames
- Add authentication and authorization
- Add rooms so people can jump in and out of various rooms
- Add a super user that can ban usernames
- Connect your server to a data store (like Redis) so chat histories can survive restarts

Congrats!

> The finished code can be found in the project at [websockets/socketio][gh]

[gh]: https://github.com/btholt/realtime-exercises/tree/main/websockets/socketio
[start]: https://github.com/btholt/realtime-exercises/tree/main/websockets/exercise-socketio
