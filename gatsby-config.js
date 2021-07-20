module.exports = {
  siteMetadata: {
    title: "Complete Intro to Realtime",
    subtitle: "Websockets, Polling, and More",
    author: "Brian Holt",
    authorSubtitle: "Stripe",
    authorImage: "author.jpg", // this image should go in /static
    courseImage: "courseImage.png", // this also should go in /static
    twitter: "https://twitter.com/holtbt", // make empty string to omit socials
    linkedin: "https://linkedin.com/in/btholt",
    github: "https://github.com/btholt",
    description:
      "Learn how to do realtime communcation on the web with your teacher Brian Holt",
    keywords: [
      "realtime",
      "websockets",
      "polling",
      "signalr",
      "node.js",
      "javascript",
      "frontend",
    ],
  },
  pathPrefix: "/complete-intro-to-realtime", // if you're using GitHub Pages, put the name of the repo here with a leading slash
  plugins: [
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /src/,
        },
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-plugin-layout`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/lessons`,
        name: "markdown-pages",
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-prismjs`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              linkImagesToOriginal: true,
              sizeByPixelDensity: false,
            },
          },
        ],
      },
    },
  ],
};
