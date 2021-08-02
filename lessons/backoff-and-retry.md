---
path: "/backoff-and-retry"
title: "Backoff and Retry"
order: "2E"
section: "Polling"
description: ""
---

What is a polling request fails? You don't want to thundering-herd yourself by hammering your own API with more requests, but you also want the user to get back in once it's not failing anymore. We'll look at strategies to mitigate that.

The worst case scenario is what we called the thundering herd. I've discussed this previously in my databases courses when talking about caches and how you can overwhelm your servers when your cache misses and every user directly hits your server. This is a similar problem we can cause with polling where we have an error in our polling so every user immediately makes another request to try to recover. When that request fails again, the poller will try again. Request after request. Now imagine this at 10,000x the scale. You basically wrote code to [DDoS][ddos] yourself.

So how do we balance a good user experience (recovering as fast as possible) with technical needs (allowing your servers space to recover)? Back off strategies!

Let's imagine for a second our chat app polls every thirty seconds. That's enough time for them to notice that we skipped a poll; they'd be waiting a minute between polls. And since many errors are not servers crashing but intermittent blips of a load balancer or latency or really anything else besides your whole service going down, it'd be best to not wait the whole next thirty seconds but to try again immediately. Assuming the server isn't down, you'd prevent the user from ever knowing something was amiss.

So on an API failure, we should immediately try again to see if we can recover. Assuming it goes well and we get a 200 OK response, then all is well and we continue polling as normal. Okay, but what if it fails again? Well, here you can try several strategies of how to do the math but the idea is you wait increasing intervals. First try again after 10 seconds, then 20, then 30, then 40, etc. Or you could exponential backoff and wait 2, 4, 8, 16, 32, 64, 128, etc. You'll have to choose a backoff strategy that works best for your usecase depending on vital is it to recover immediately and how difficult it will be for your servers to recover.

Let's do a pretty simple strategy of exponential back off by doing 3 seconds (our default poll length) _plus_ 5 seconds times how many times we've tried. So if we've had four errors in a row, it'd take 23 seconds before we'd try again (3 + 4 \* 5). So let's go do it together in polling-chat.js

```javascript
// replace getNewMsgs
async function getNewMsgs() {
  try {
    const res = await fetch("/poll");
    const json = await res.json();

    if (res.status >= 400) {
      throw new Error("request did not succeed: " + res.status);
    }

    allChat = json.msg;
    render();
    failedTries = 0;
  } catch (e) {
    // back off
    failedTries++;
  }
}

// replace at bottom
const BACKOFF = 5000;
let timeToMakeNextRequest = 0;
let failedTries = 0;
async function rafTimer(time) {
  if (timeToMakeNextRequest <= time) {
    await getNewMsgs();
    timeToMakeNextRequest = time + INTERVAL + failedTries * BACKOFF;
  }
  requestAnimationFrame(rafTimer);
}

requestAnimationFrame(rafTimer);
```

Awesome! Now this backoff an additional 5 seconds every time a request fails.

If you want to try it, replace you get in server.js with this

```javascript
app.get("/poll", function (req, res) {
  res.status(Math.random() > 0.5 ? 200 : 500).json({
    msg: getMsgs(),
  });
});
```

This will 500 (which means server error) 50% of the requests to poll to show you it recovering and backing off.

So a few things here:

- fetch does throw an error if there's a network error like not being able to connect to the Internet, hence the try/catch
- fetch does not throw an error if the server responds with a 500, hence the throw statement to make sure those errors get handled the same way
- This is just one way of doing the math. Feel free to look at other strategies and decide what's best for you.

> Here's my default strategy when I do it: on a failed request, wait a few seconds, try again. This will catch most incidental blips like your user changed networks or something like that. If fails, wait a few more seconds and try again. This will catch _most_ people who are having temporary issues. After two failed requests, we can assume we're having either server problems (or the user is offline totally or something not temporary on their side.) This is when I want to start putting bigger gaps in time between requests so I don't overwhelm my servers while I'm trying to recover.

In general I don't write retry logic myself. There are numerous, numerous packages on npm that handle backoff and retry with lots of unit tests and users so I tend to just rely on that. If I did, I'd write one central library for my project to rely on and then I'd test the hell out of it. But it's good for you to know how to write this!

[ddos]: https://en.wikipedia.org/wiki/Denial-of-service_attack
