---
path: "/websockets-backend"
title: "WebSockets Backend"
order: "4B"
description: ""
section: "WebSockets By Hand"
---

Go ahead and open in our project the websockets/exercise-raw folder. In here you'll find a relatively similar project to the other one we were working on: a Chat with Me app where multiple anonymous users can hop on and have a chat.

A first warning here: we are intentionally doing an imperfect, incomplete implementation here. Most important is that you learn what a websocket is and how it works. Then we'll use a battle-tested library that will handle the rest of it for us.

Okay, let's do a little thing in our frontend app first. Open raw-chat.js and put this

```javascript
// under postNewMessage

const ws = new WebSocket("ws://localhost:8080", ["json"]);

ws.addEventListener("open", () => {
  console.log("connected");
  presence.innerText = "🟢";
});
```

This will attempt to make a connection from our browser to our server. Once it does, it will log out in the console it's connected and update the little circle in the top right that it's connected. If you try to run it right now you'll see a browser error similar to `Firefox can’t establish a connection to the server at ws://localhost:8080/.`

We'll talk about the "json" portion below, but know it's the client saying "hey, I want to speak to JSON with you".

Cool, now we can start building a server to handle having a socket connection. It's actually really interesting process. We are going to first just try to receive _any_ connection from anyone. That's how sockets work: they make a normal TCP/IP connection but after that connection is established, it requests an **upgrade** to a socket connection. So we can actually use a similar methodology we did in the first exercise to accept that request. In backend/server.js put:

```javascript
// under server creation
server.on("upgrade", function (req, socket) {
  if (req.headers["upgrade"] !== "websocket") {
    // we only care about websockets
    socket.end("HTTP/1.1 400 Bad Request");
    return;
  }

  console.log("upgrade requested!");
});
```

Try running your server with `npm run dev` and opening your browser. You should see your server log out "upgrade requested!". This means your browser connected and then requested your connection be upgraded from a normal connection to a websocket. In theory there are other types of upgrades other than websockets, I just don't know what they are. In any case, we only care about websockets so we'll reject anything that isn't with a 400.

Okay, so next part is we need to have the server and client negotiate and verify with each other that indeed they both want to do a websocket connection. The way they do this is the client (the browser) send an acceptance key in the headers (the browser does this automatically for you when you say `new WebSocket`) and the browser needs to create a hash that mixes the key the browser sent with the key `258EAFA5-E914-47DA-95CA-C5AB0DC85B11`. Why that key? It's a randomly generated key that's hardcoded into the WebSocket spec.

Why do we do this? It's _not_ for security as some of you may suspect (as I did too.) There's actually a HTTPS version of WebSockets that's wss:// instead of ws:// and that is what provides the encryption (we're not doing that today.) No, actually, the reason why we do this is because we don't either the client nor the server to mistake each other for wanting to do a WebSocket connection. This is meant so that you can't just make a REST request to a WebSocket endpoint accidentally (or intentionally by a bad actor.) By doing this handshake we're assuring that both parties know they're about to engage in a WebSocket connection.

Okay, let's do that. I already made `generate-accept-value.js` for you so you just need to use the imported function. We're going to use that to write some headers back to the client so we can establish a firm connection between browser and client.

```javascript
// under if (req.headers["upgrade"] !== "websocket") { … }
// inside the on("upgrade")

const acceptKey = req.headers["sec-websocket-key"];
const acceptValue = generateAcceptValue(acceptKey);
const headers = [
  "HTTP/1.1 101 Web Socket Protocol Handshake",
  "Upgrade: WebSocket",
  "Connection: Upgrade",
  `Sec-WebSocket-Accept: ${acceptValue}`,
  "Sec-WebSocket-Protocol: json",
  "\r\n",
];

socket.write(headers.join("\r\n"));
```

Now refresh your browser. Notice the presence indicator in the top right says you're connected! In your console you should see a connected log as well. We now have an open connection that we're just leaving open.

Let's talk about the headers. Most of those should make sense but let's about the last two. The Protocol allows the client and server to work out how the data is going to be formatted going back and forth. At the beginning when we said `const ws = new WebSocket("ws://localhost:8080", ["json"]);`, the array is a list of protocols the client is saying it can handle. In this case, we're just saying "we only want json". We could have said "we can support json and xml." No matter what, the server will send back _one_ protocol it will be speaking. There's no set rules of what protocols can be used here. All that matters is that you settle on one by the end.

The last double `\r\n` (there's two because we do a join which means the last two lines sent are `\r\n\r\n`) is how we signify that we're done sending headers and now we'll be sending data.

Okay! So now we have an open socket. On the server side we can say `socket.write` and it'll send data to the client and on the client we can say `ws.send` to send data to the server. Let's go ahead and finish our server implementation and then we'll cover the rest of the client.

First thing, on connection let's immediately write out the state of the chat (similar to how we did previously.)

```javascript
// under write headers
socket.write(objToResponse({ msg: getMsgs() }));
```

This will immediately on connection send the client the history of the chats. Let's display that information. Head back to raw-chat.js

```javascript
// under open event
ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  allChat = data.msg;
  render();
});
```

This receives any message from the server, saves, it and calls render. When doing sockets, you may do different sorts of messages (think pub/sub if you've tried that before) and here's where you would route different messages to different functions. In our case, we're just listening for new message lists, which we'll deal with here.

Now let's listen for data from the client. In the server.js put

```javascript
// under write objToResponse
socket.on("data", (buffer) => {
  console.log(buffer);
});
```

and in the raw-chat.js put:

```javascript
// replace postNewMsg
async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  };

  ws.send(JSON.stringify(data));
}
```

Okay, so now submit a new message to from the web page to server. You'll probably see something like `<Buffer 88 82 2d bd bc 6e 2e 54>`. Like we had to with the objToResponse function, we need to make a function that can decode what the browser is sending us. This is a pretty involved function that rather than make you write, I went ahead wrote the MVP of it for you. Do note this is a very incomplete version of this, but it will do the job for us. Open parse-message.js and let's dig through it.

WebSocket messages are sent over what are called frames. Frames are basically packages of bytes that have metadata and data that correspond to data being sent back and forth. These frames can be one complete message, they can be one message split across multiple frames (particularly if they're large) or they can actually be multiple frames which align to many frames, meaning one frame can actually have two or more partial frames on it. It's a very flexible protocol.

In our case, we're just going to assume a very simple implementation that our messages fit in one frame. We're also assuming a bunch of other things (only text frames, always masked frames, etc. so we limit ourselves to just the things we need.)

So let's dissect a frame.

```text
      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
```

Source: [IETF][ietf]

This is a diagram of a frame in bits. Important to us is we need to know the op code (we only care about text frames and close frames, 1 and 8 respectively), how long the message is, the mask key, and the payload.

In parse message we go through, pull out the op code, pull out the length, pull out the mask key, and then use the mask key to convert the data from a masked string of binary to an unmasked string of binary, and then we convert that binary to a UTF8 string which will give us the final payload. And that's how it works! A similar process happens in the browser; the browsers just do it for us. And that's it! After we do that, we've converted from a frame to actual use strings characters. From there we can use JSON.parse to get back our final payload.

You'll notice a lot of the characters ^ & >>> >> << and so on. These are all operators that operate on binary. For example

```javascript
// replace socket.on('data')
socket.on("data", (buffer) => {
  const message = parseMessage(buffer);
  if (message) {
    msg.push({
      user: message.user,
      text: message.text,
      time: Date.now(),
    });
  }
});
```

Awesome, now this will take the message, parse it using our parseMessage function, and save it in our messages. If you post a message and then refresh the page, you'll see it. However, that ain't realtime. We don't expect our users to refresh the damn page. We want them to immediately see all new messages from the server. So how do we do that? We'll keep track of all active connections and inform them when a message gets posted. In server.js

```javascript
// this is already at the top, just notice it
let connections = [];

// under socket.write(objToResponse), above socket.on('data')
connections.push(socket);

// under msg.push inside the if statement in socket.on('data')
connections.forEach((s) => s.write(objToResponse({ msg: getMsgs() })));

// add an else if to the if (message)
else if (message === null) {
  // remove from my active connections
  socket.end();
}

// under socket.on('data'), inside the server.on('upgrade')
socket.on("end", () => {
  connections = connections.filter((s) => s !== socket);
});
```

Now we're keeping track of all of the active connections, and whenever new message rolls in we just push a message to all active listeners. Once a socket ends via a user closing the tab or or the socket otherwise ending we clean up and remove the listener from our connections list.

One more bit of code, let's make the presence indicator go red if the connection ends. In raw-chat.js

```javascript
// under ws open

ws.addEventListener("close", () => {
  presence.innerText = "🔴";
});
```

Now if the socket closes, we'll see that reflected in the top right. If you're using the npm run dev and you save a file, it'll cause the server to restart and you'll notice in the top righ it'll go from green to red.

That's it! We did it! We implmented WebSockets by hand! This is _way_ more burdensome than it needs to be. Lots of libraries do this for you and we're going to go look at one and talk about others. But congrats! This is not easy to do!!

> The finished version of the app can be found here: [websockets/raw][gh]

[ietf]: https://datatracker.ietf.org/doc/html/rfc6455
[gh]: https://github.com/btholt/realtime-exercises/tree/main/websockets/raw
