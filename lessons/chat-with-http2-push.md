---
path: "/chat-with-http2-push"
title: "Chat with HTTP2 Push"
order: "3B"
description: ""
section: "HTTP2"
---

> Open your project to [http2/exercise][exercise] to start this project.

Alright, so let's start digging into it.

First, a housekeeping thing, HTTP/2 does not work without HTTPS because all the browsers enforce that it must be a secure connection. Technically the spec doesn't require it but our stuff won't work otherwise so we need to quickly generate a self-signed certificate to use for our app.

You'll need to install openssl. On macOS, you can install it via [Homebrew][homebrew] with `brew install openssl`. If you're on Linux, it'll probably be available by whatever your distro's package manager is. If you're on Windows, you can either Google ["install openssl windows"][google] or use [Chocolatey][c].

Once you have it installed, go to the _root_ directory of your exercise. For you, that's probably http2/exercise, and run these two commands.

> It's important that these are located not in the backend directory but the root directory of your http2 exercise project.

```bash
openssl req -new -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
```

> It'll ask you a bunch of questions, it doesn't matter how you answer them.

This will generate a self-signed certificate that we can use for local dev. This wouldn't work in production because it'll show up as insecure to your users. When you bring up your own site, it'll warn you that the cert is self-signed. This is normal.

From here you should be able to run `npm run dev` and it should work. Make sure you're on httpS://localhost:8080, with the S. It won't work on http. You need https.

Okay, so let's open our backend/server.js and work on that. Notice at the top we're loading those two things we generated. We'll come back to the code block we have to write, but notice on the `server.on("request")`. Here we're first statically serving all our static assets. After that we're accepting the POST data. This is something Express does for us but since we're using raw HTTP2 from Node.js we have to accept that data ourselves. No big deal.

Okay, let's work with our stream of data.

```javascript
// above server.on('request')
server.on("stream", (stream, headers) => {
  const method = headers[":method"];
  const path = headers[":path"];

  // streams will open for everything, we want just GETs on /msgs
  if (path === "/msgs" && method === "GET") {
    // immediately respond with 200 OK and encoding
    console.log("connected");
    stream.respond({
      ":status": 200,
      "content-type": "text/plain; charset=utf-8",
    });

    // write the first response
    stream.write(JSON.stringify({ msg: getMsgs() }));

    stream.on("close", () => {
      console.log("disconnected");
    });
  }
});
```

So here we're responding to stream requests. All resources actually open stream requests, so we're just watching for connections to /msgs (Express would normally handle this routing.) Once we have a stream request, we'll immediately respond with headers to say how it's encoded, what type of protocol we're using, and a 200 OK. We're using text/plain because while we'll be sending JSON, if you wholistically looked at our response, it wouldn't actually be valid JSON. But at the end of the day it doesn't matter.

Okay let's pop over to the client. Open the http2-chat.js file.

```javascript
// replace getNewMsgs
async function getNewMsgs() {
  let reader;
  const utf8Decoder = new TextDecoder("utf-8");
  try {
    const res = await fetch("/msgs");
    reader = res.body.getReader();
  } catch (e) {
    console.log("connection error", e);
  }
  presence.innerText = "🟢";

  try {
    readerResponse = await reader.read();
    const chunk = utf8Decoder.decode(readerResponse.value, { stream: true });
    console.log(chunk);
  } catch (e) {
    console.error("reader failed", e);
    presence.innerText = "🔴";
    return;
  }
}
```

A few things here:

- We're still using fetch, but instead of just saying res.json(), we're opening a readable stream with getReader() and now we can expect multiple responses. Up front we're just logging out the first chunk we get back, but we can now expect that to respond multiple times.
- We're using the green and red circle to show the user if they're still connected to the socket. If it's red, we know we've disconnected. If that happens, you just need to refresh the page. In a production app, you'd just need to reconnect a new socket and keep listening. But you can do that on your own time.
- We need to decode the response that comes over the socket. That's what the utf8Decoder does.
- I'm not making you do the POST again. It's the same logic as last time.
- If you look at the network request in your network console, notice that there isn't a status code or anything. According to the browser, this request is still actually in flight.

This will only read the very first chunk from the API. We can use a do/while loop with await to make it work as long as the socket is still sending info.

```javascript
// inside getNewMsgs, replace the second, bottom try/catch
do {
  let readerResponse;
  try {
    readerResponse = await reader.read();
  } catch (e) {
    console.error("reader failed", e);
    presence.innerText = "🔴";
    return;
  }
  done = readerResponse.done;
  const chunk = utf8Decoder.decode(readerResponse.value, { stream: true });
  if (chunk) {
    try {
      const json = JSON.parse(chunk);
      allChat = json.msg;
      render();
    } catch (e) {
      console.error("parse error", e);
    }
  }
} while (!done);
// in theory, if our http2 connection closed, `done` would come back
// as true and we'd no longer be connected
presence.innerText = "🔴";
```

This will go forever, as long as that socket is open. That's what the do/while loop will do for you. Since we never actually close this connection, it'll stay open as long as there isn't a browser event (like a user closing the tab or the user closing the laptop for long enough to disconnect all active connections.) Here we're just treating each chunk as an API response, but in reality it's supposed to be a continuous stream of data of one document, hence why I called this a bit of abuse of the system.

Let's go finish up server.js

```javascript
// inside of server.on("stream")
// under stream.write
// replace stream.on("close")

// keep track of the connection
connections.push(stream);

// when the connection closes, stop keeping track of it
stream.on("close", () => {
  connections = connections.filter((s) => s !== stream);
});

// inside server.on("request")
// under const { user, text } = JSON.parse(data);
msg.push({
  user,
  text,
  time: Date.now(),
});

// all done with the request
res.end();

// notify all connected users
connections.forEach((stream) => {
  stream.write(JSON.stringify({ msg: getMsgs() }));
});
```

This is now a fully functioning realtime app with HTTP/2 push! We're now keeping track of all open streams and when we get a new post from anyone, we're writing to our open streams. Once a user closes out their stream we remove from our list to notify.

> The finished version of the app can be found here: [http2/push][gh]

That's it! We did it! Let's move onto WebSockets!

[c]: https://community.chocolatey.org/packages?q=openssl
[google]: https://www.google.com/search?q=install+openssl+windows
[homebrew]: https://brew.sh/
[exercise]: https://github.com/btholt/realtime-exercises/tree/main/http2/exercise
[gh]: https://github.com/btholt/realtime-exercises/tree/main/http2/push
