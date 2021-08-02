---
path: "/requestanimationframe"
title: "Polling with requestAnimationFrame"
order: "2D"
description: ""
section: "Polling"
---

What if a user unfocuses the window? Either focuses another tab or opens Spotify. Do you want to still be making requests in the background? That's a valid product question and one you'd need to make a deliberate answer to. If your user is trying to buy concert tickets and they're going to sell out then you absolutely should run in the background to give your user the best shot of getting the tickets. If it's a realtime weather app, it's probably okay to pause your polling and wait for the user to refocus again so we don't waste data and resources of the user's device, especially if they're just going to close the tab and never look at it again. I don't know about you, but lots of people have 10 million Chrome tabs open at once and it could waste a lot of data if they're all doing polling in the background.

If you want to not pause when unfocused, setTimeout is a good way. If you do want to pause, requestAnimationFrame will automatically pause when the window isn't in use. In general, when on the fence, I'd prefer the latter as a better implementation.

The difference in code is actually surprisingly small too. Let's go knock it out.

```javascript
// delete the following line from getNewMessage
setTimeout(getNewMsgs, INTERVAL);

// replace the final getNewMesgs call at the bottom
let timeToMakeNextRequest = 0;
async function rafTimer(time) {
  if (timeToMakeNextRequest <= time) {
    await getNewMsgs();
    timeToMakeNextRequest = time + INTERVAL;
  }
  requestAnimationFrame(rafTimer);
}

requestAnimationFrame(rafTimer);
```

getNewMessages doesn't change other than deleting the one line. The post doesn't change either.

Let's chat about requestAnimationFrame. It runs _a lot_. But the good thing is it only runs when the main JS thread is idle, guaranteeing you're not interrupting any repaints. setInterval and setTimeout are hammers: they run and will absolutely interrupt any code execution and paints that happening. For our previous example it's probably not a big deal: our code was fairly lightweight and not really heavy enough to ever cause much issue. But when dealing with a more animated frontend or any sort of heavier app this could be a problem that requestAnimationFrame can help.

So requestAnimationFrame runs whenever the thread is idle. That's a lot. So that core function rafTimer needs to be super lightweight. Just check if it's time to run and if not just schedule itself to run again. That's all. We get the background pausing feature for free. Notice now if you put your tab in the background and wait a few minutes it will eventually stop polling until your bring it back up. Every browser is different before it sleeps a tab but it could be a few minutes. I think Firefox will actually resume the tab if you even just hover over the tab. Cool stuff, but it's nice to offload all that work to the browser.

That's it! That's really the basics of just doing long-polling.
