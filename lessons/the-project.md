---
path: "/the-project"
title: "The Project"
order: "1B"
description: ""
section: "Welcome"
---

This course works and has been tested on both macOS and Windows 10. It also will work very well on Linux (just follow the macOS instructions). You shouldn't need a particularly powerful computer for any part of this course. 8GB of RAM would more than get you through it and you can definitely get away with less.

- Install Node.js. Make sure your version of Node.js is at least 12, preferably the latest stable release. I prefer using nvm to install Node.js, [see setup instructions here][nvm].
- While you do not have to use [Visual Studio Code][vsc], it is what I will be using and I'll be giving you fun tips for it along the way. I am on the VS Code team so I'm a bit biased!
- People often ask me what my coding set up is so let's go over that really quick!
  - Font: [Dank Mono][dank]. Be sure to [enable ligatures][ligatures] in VS Code! If you want ligatures without Dank, check out Microsoft's [Cascadia Code][cascadia].
  - Theme: I actually just like Dark+, the default VS Code theme. Though I do love [Sarah Drasner's Night Owl][night-owl] too.
  - Terminal: I just switched back to using macOS's built in terminal. [iTerm2][iterm] is great too. On Windows I love [Windows Terminal][terminal].
  - VS Code Icons: the [vscode-icons][icons] extension.

## The exercises

[Fork and clone the btholt/realtime-exercises][exercises] repo. I have you fork it so you can keep track of your own changes.

Each of the subdirectories are a self-contained project. This means to start anyone of them, you'll need to run npm install to set up their dependencies. Let's chat a few things about the project.

- The Node.js parts do have dependencies so you will need to npm install
- Part of the course is done with Express. This is just to make it as real-world for you as possible since most people use some server-side framework
- Where I had a choice between doing things "right" versus "easy to quickly understand", I chose the latter. I tried to make it so you could just focus on the realtime portion of the course and hopefully not stumble on things not related to the course. This means the frontend and backend code are not coded with production in mind and are inefficient for the sake of being simple.
- Particularly with the front end code, it doesn't use any framework and takes an intentionally simplistic rendering scheme. It's very inefficient, but it's very simple. It suits our needs and doesn't require you to understand any framework,
- There is no frontend build process. I did this to maintain simplicity. All the dependencies are being loaded from a CDN. I don't suggest doing this in production but it made for the simplest process for all of us to get started and to have the least amount stumbling stones.
- For all the projects, npm run dev will run a dev process that will restart Node.js on every save and npm run start will just start the server without the automatic reload
- Since all the messages being stored in memory, every time you restart the server you'll lose your message history. You'd need to either write to a file or a database to keep it across reloads
- The CSS and UI code is minimal so we can focus on realtime. It's using [Materialize][materialize] as a base

Let's get started!

[nvm]: https://github.com/nvm-sh/nvm
[vsc]: https://code.visualstudio.com/
[dank]: https://gumroad.com/l/dank-mono
[ligatures]: https://worldofzero.com/posts/enable-font-ligatures-vscode/
[night-owl]: https://marketplace.visualstudio.com/items?itemName=sdras.night-owl
[cascadia]: https://github.com/microsoft/cascadia-code
[terminal]: https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab
[icons]: https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons
[iterm]: https://iterm2.com/
[exercises]: https://github.com/btholt/realtime-exercises
[materialize]: https://materializecss.com/
