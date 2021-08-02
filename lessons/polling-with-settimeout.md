---
path: "/settimeout"
title: "Polling with setTimeout"
order: "2C"
description: ""
section: "Polling"
---

The frontend is more where the interesting part of long-polling lives. At first let's do it with a simple setTimeout to get our response back.

Open polling-chat.js in the frontend directory.

```javascript
// replace getNewMessages
async function getNewMsgs() {
  let json;
  try {
    const res = await fetch("/poll");
    json = await res.json();
  } catch (e) {
    // back off code would go here
    console.error("polling error", e);
  }
  allChat = json.msg;
  render();
  setTimeout(getNewMsgs, INTERVAL);
}

// just notice this is the last line of the doc
getNewMsgs();
```

This is what does the heavy lifting for us. This is what will hit that endpoint every 3 seconds (well, 3 seconds plus however long the request takes).

Again, the temptation here would be to just use setInterval but this strategy is superior because it will make sure only one request is ever in flight. With setInterval, it will request every X seconds, no matter what. Let's knock out the post request too.

```javascript
async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  };

  // request options
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  // send POST request
  const res = await fetch("/poll", options);
  const json = await res.json();
}
```

Nothing too special here: just a normal ol' post request.

Now your app should be working for long polling! This is the simplest way to acheive realtime: just make a lot of requests! Let's take this a step further and try to make it a bit better.

> The current state of the repo can be found in the [noPause][gh] directory on the project.

[gh]: todo
