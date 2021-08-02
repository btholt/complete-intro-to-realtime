---
path: "/polling"
title: "Intro to Long-Polling"
order: "2A"
section: "Polling"
description: ""
icon: "spinner"
---

We are going to write a chat app where anyone can connect to a URL and begin chatting about anything. How would you go about architecting how to build this sort of app?

Let's think about the product requirements.

1. A user needs to be able to post new messages
1. A user needs to be able to see old messages from the chat when they first connect
1. A user needs to be able to see their own messages
1. A user needs to be able to see new messages posted by other people

As you may imagine, there are many ways to architect this system and some work better in some ways and worse in others. In other words, there are trade-offs. We're going to start with perhaps the simplest approach to this problem: the humble long-poll.

## Long Polling

Long polling (to which I'll refer as just polling from here on out) is really a way of saying "making a lot of requests." There's no special technology here, it's just making an AJAX call on some interval.

What are some of the keys here?

The polling end point is going to get called a lot, so make sure it's designed that way. If you have a 100 clients making requests every 3 seconds, that that's 2,000 requests a minute, and it just scales from there. Try to make it as fast as possible and offload all other actions to be done outside of the hot path.

Don't just use `setInterval` as tempting as that sounds. setInterval sets some function to be set off every X seconds and doesn't account for the fact that a request takes time. What if you're making a request every 3 seconds but your API takes 4 seconds to respond? Now you're making requests while others are still in flight. Instead, what you want to do is start a timer for the next request as soon as the current one completes. `setTimeout` at the end of your function with the next time for the next request is one way to do this.
