---
path: "/intro-to-http2-push"
title: "Intro to HTTP2 Push"
order: "3A"
description: ""
section: "HTTP2"
icon: "angle-double-right"
---

So think of a normal HTTP request. I call `fetch("example.com")` and I wait for a single response to me. It's a one-to-one relationship. You make a request for a thing and you get back the thing.

What if we could make an HTTP request, but then just not close the connection? That's the premise behind what we're going to do right now. It's a called a long-running HTTP call, or HTTP/2 Push. We're actually going to abuse it a bit for our purposes but I wanted to show you this is absolutely possible and could be a useful tool to you sometime.

Let's chat a tiny second about HTTP's history. For a very long time (since '96) we've had HTTP 1.1 which is what we were just talking about: making a request and getting a response back. Simple and effective. Many sites out there still use HTTP 1.1 and there's little problem with that. It works and in my opinion it's still perfectly valid to use.

After that came SPDY, a protocol developed by Google that made HTTP faster in a lot of ways. After a lot of browsers started shipping SPDY, it eventually got chosen to be the successor to HTTP 1.1 after nearly 20 years.

In 2015 we got HTTP/2 ratified as the official new standard of HTTP. It added a bunch of new features, here a few highlights

- We can now multiplex requests, meaning you can send many individual messages over a single connection. With 1.1 we had to do a whole new connection with headers, handshakes, security, etc. for every single request. With 2, you can reuse the same connection for multiple things.
- Better compression strategies. Without getting into too much details, HTTP 2 allows for compression to happen at a finer grain details and thus allows better compression
- Request prioritization. You can say some things are lower priority (like maybe images) and others are higher (like stylesheets.)

There are others but let's dive into what we're here for, long running requests.

In practice, this feature is primarily used to chunk up and send pages piecemeal. Imagine you have a document that takes a long time to render the body. What you can do is when a user of your site requests the page you can immediately send them the `<head>` element because in the head you'll have all the CSS and font files that user will need to download and they can spend time downloading CSS and HTML while you rush and render everything in the body. You're streaming the content to them as soon as it's ready. Presumably your head is relatively immutable while the body is the dynamic part. Before, your user would have had to wait for the whole request to finish before they could even start downloading stuff referenced in the head. It's a very cool strategy and if you have any sort of long-rendering page you should immediately look into it.

We're gonna abuse this system and just keep a connection open and send little JSON chunks. Let's do it.

## HTTP/3

It has nothing to do with what we're doing today, but it's good to note HTTP/3 (aka QUIC) is coming. It messes less with the semantics of HTTP like 2 did and more with the transport of it. Whereas 1.1 and 2 used TCP to send data which has the fundamental problem that if you drop data, you have to wait for the packet to be sent again, making those stall painful. QUIC is based upon UDP which has a better recovery strategy and can accept packets out of order. There's lots more to read here, but that's the biggest change you can expect.
