---
path: "/polling-backend"
title: "Polling Backend"
order: "2B"
section: "Polling"
description: ""
---

> We are going to implement our chat app using long-polling. Open your app to the [polling/exercise directory][gh] and we'll do this together.

Let's do the backend first. Open backend/server.js. Let's acquaint ourselves with the code here.

- If you haven't already, please run npm install in the root of the project
- The backend is done with Express.js. I chose this because nearly every Node.js dev has some familiarity with Express and this isn't a Node.js course. Take Scott Moss's amazing Node.js course if you want more Node.js goodness.
- body-parser allows Express to parse request bodies from the browser
- nanobuffer allows us to create capped collection. Our array will only store the last 50 messages and drop them off the end. We're using this instead of database. This could be written more performantly but I erred on the side of simplicity.
- morgan is a logging library so we can see some nice request logs
- All the frontend code is being served by the `express.static` call

All the bones of what we need to do are done. We just need to implement the get and the post. We put them on the same URL endpoint but that isn't required. For now the semantic differences of post and get are enough for our little app.

If you run `npm run dev` it will start the development server with nodemon. This means everytime you save you will automatically restart your server so you can immediately see changes. Do note since all the messages are being stored in memory that it will drop your chat record. That's to be expected; normally you'd store them in a database.

Okay, let's do our get first.

```javascript
// replace get
app.get("/poll", function (req, res) {
  res.json({
    msg: getMsgs(),
  });
});
```

This is part of the charm of long-polling: it's just normal API requests done frequently. This is a very normal get request.

Now have your browser or API request client (like Postman or Insomnia) hit your http://localhost:3000/poll endpoint and see if it works! You should see a single message come back.

Okay, the post is pretty similar here, so let's go do that.

```javascript
// replace post
app.post("/poll", function (req, res) {
  const { user, text } = req.body;

  currentId++;
  msg.push({
    user,
    text,
    time: Date.now(),
  });

  res.json({
    status: "ok",
  });
});
```

Awesome! Now try using something like Insomnia to make a post to your new end point with a user and a text and see if it shows up in the get.

[gh]: https://github.com/btholt/complete-intro-to-realtime
