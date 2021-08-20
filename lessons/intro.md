---
path: "/intro"
title: "Introduction"
order: "1A"
section: "Welcome"
description: "this is the description that will show up in social shares"
icon: "door-open"
---

Hello! And welcome to the Complete Intro to Realtime.

> An easy to link to this site is [bit.ly/intro-realtime][bitly] (case sensitive)

In this course we're going to go over the two primary ways of doing realtime communication between a client (a browser) and a server (your backend). If you've ever needed to sync state across multiple devices, this is the course for you. We'll go over the two primary ways of doing this, long-polling and WebSockets. This course aims to take a first-principles approach: we will go over the lowest level details we can and build our way up to the higher level abstractions. The reason why we do this is that I want you to value your tools. I've found that if I don't experience the problem that a tool solves for me, I don't know how to use the tool as well and I frequently resist the complexity the tool introduces. That's what was abstractions frequently trade-off for you: complexity and performance in exchange for ease and velocity. You and will build a long-polling system and a WebSocket tool by hand before introducing you to Socket.IO which will cover all of it for you.

## Who are you

In order to best grasp this course this should not be your first JavaScript course. If you need to learn JavaScript or programming in general, Frontend Masters definitely has you covered. [Check out the free Boot Camp][bc] (taught by [Jen Kramer][jen] and me) or the [Intro to Web Dev v2][web] (taught by me) and get up to speed before you hop into this one. It'd be great if this wasn't your first exposure to Node.js too. If you need help with that, check out [Scott Moss's fantastic course][scott].

## Who am I

![Brian drinking a beer](./images/brian-beer.jpg)

Hi! My name is Brian Holt and I developed this course. I'm currently the product manager of developer products at [Stripe][stripe] which means I help create and maintain all the tools developers use to integrate with Stripe. I've been a developer, advocate, and PM during my career at companies like Reddit, Netflix, LinkedIn, Microsoft, and now Stripe. I absolutely love to teach and have now taught [many courses at Frontend Masters][courses]. All these things we'll be talking about today are things I've done before in production. I did a lot of realtime stuff at Reddit and Netflix in particular.

![Brian speaking at conference](./images/brian.jpg)

I currently live in Seattle, Washington and I love it. When not working, you'll find me hanging out with my little family and Havanese dog Luna, exercising on my Peloton, playing Dota 2 and Overwatch poorly, and sampling the finest Islay Scotches and local hazy IPAs and medium roast coffees. I absolutely love to travel, speak fluent Italian, and meeting new friends.

![Luna, havanese dog](./images/lunasit.jpg)

Feel free to catch up with my / add me on these social medias. I'm really bad at responding to DMs!

- [Twitter][twitter]
- [GitHub][gh]
- [LinkedIn][li]
- [Peloton][pelo]

## Where to File Issues

I write these courses and take care to not make mistakes. However when teaching over ten hours of material, mistakes are inevitable, both here in the grammar and in the course with the material. However I (and the wonderful team at Frontend Masters) are constantly correcting the mistakes so that those of you that come later get the best product possible. If you find a mistake we'd love to fix it. The best way to do this is to [open a pull request or file an issue on the GitHub repo][issues]. While I'm always happy to chat and give advice on social media, I can't be tech support for everyone. And if you file it on GitHub, those who come later can Google the same answer you got.

## Special Thanks to Frontend Masters

![Frontend Masters](./images/FrontendMastersLogo.png)

I want to thank Marc and the whole Frontend Masters team explicitly. In addition to being family to me these are some of the most wonderful people I've ever met. You are reading or watching this course thanks to their hard work to make the world of tech more approachable with high quality instructors teaching what they know best. I want to thank them for creating the platform, garnering a community of knowledge-seeking developers, and giving me incentive and a platform to speak to you all. One specific kindness is that while the videos are on the platform (and I think they are worth every penny to watch) they let me release this website and materials as open source so every person can acquire the knowledge.

Thanks Frontend Masters. Y'all are the best.

> [Please star the repo! ⭐️][repo]

[bitly]: https://bit.ly/intro-realtime
[bc]: https://frontendmasters.com/bootcamp/
[web]: https://frontendmasters.com/courses/web-development-v2/
[scott]: https://frontendmasters.com/courses/node-js-v2/
[stripe]: https://stripe.com/
[courses]: https://frontendmasters.com/teachers/brian-holt/
[twitter]: https://twitter.com/holtbt
[gh]: https://github.com/btholt
[li]: https://www.linkedin.com/in/btholt/
[pelo]: https://members.onepeloton.com/members/btholt/overview
[issues]: https://github.com/btholt/complete-intro-to-realtime/issues
[repo]: https://github.com/btholt/complete-intro-to-realtime
