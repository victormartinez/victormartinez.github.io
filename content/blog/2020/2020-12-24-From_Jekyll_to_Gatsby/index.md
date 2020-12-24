---
layout: post
title: From Jekyll to Gatsby
category: Web Development
date: 2020-12-24T00:00:00
tags: [gatsby, javascript, react]
image: featured.png
language: en
---

During the last few months I have been studying front-end development and migrating from [Jekyll](https://jekyllrb.com/) to [Gatsby](https://www.gatsbyjs.com/) was one of my personal projects. For that reason alone I already considered the process worthwhile but I ended up discovering other benefits while I developed the features.

## Requirements

I believe the best tool to maintain a website is Wordpress. However, people that choose a static website generator do not want to worry about: (i) hosting; (ii) database; (iii) maintaining plugins / third-party.

Besides, in my situation, I wanted to use [Github Pages](https://pages.github.com/) due to practicality that provides and its focus on the content over the blog maintenance.

## Advantages

In my opinion, some advantages became crystal clear:

1. **Practice front-end development**

   For my blog I got in contact with React, Styled Components, HTML, CSS, Vanilla Javascript, Media Queries (and responsiveness) and GraphQL.

   Here goes the _disclaimer_: a non front-end developer might face hard times because it is necessary to understand (even a little bit) about several technologies that might be transparent in other tools.

2. **Powerful Plugins**

   Gatsby makes available powerful [plugins](https://www.gatsbyjs.com/plugins) that allow working with: PWA, i18n, Images Optimization, Performance, and much more!

3. **Separated build from Github Pages**

   As Github Pages builds your website created with Jekyll, for security reasons it does not accept some plugins and, thus, you get limited. That does not happen with Gatsby because you execute the build phase and makes available the `public` directory to Github Pages. Therefore, since the output corresponds to HTML, CSS and Javascript, your website will be hardly affected by any incompatibility with Github.

4. **Internationalization**

   I went through hard times trying to create a multilingual blog with Jekyll and I gave up on that. Gatsby allowed me to use plugins and find materials that helped me a lot in the proccess and, finally, I have a blog that supports english and portuguese blog posts.

5. **Customization**

   Since Gatsby uses React, you can create your own components. For instance, I created a component that exhibits an alert in case of an old blog post.

6. **Influential Technologies**

   I confess that I did not fell motivated to study how Jekyll works because I did not see any aplicability to the labor market. Gatsby makes you get in touch with several technologies that are influential in the current job market (check the first item of this list).

7. **Performance**

   It's crystal clear the performance concern. That goes from doing prefetch of the pages while the user navigates until the usage of plugins that optimize images for web.

So, what do you think about the website? Any critics and suggestions are welcome!
