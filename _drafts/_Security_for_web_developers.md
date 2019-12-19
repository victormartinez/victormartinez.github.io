---
layout: post
title: "Understand security attributes of cookies"
categories: [Web Development]
tags: [security, web, cookies, attributes]
image: 
on_post: false
toc: true
featured: true
---

If you work with web applications probably you have 

Security is a topic that every programmer should study. Generally speaking, many of us rely on frameworks and tools built by the open-source community. However, there might come the time you will need to proper understand how your application should handle security issues. The time has come to me and I hope this post gets useful to someone.


What happens if someone steals the cookies of your browser? If the action succeeds, the hacker is able to perform actions on your behalf (*e.g.* access personal data, payments, send messages, etc). This is an attack known as [Session Hijacking](https://www.owasp.org/index.php/Session_hijacking_attack) and can be performed if your application does not handle cookies properly.


Since HTTP is a stateless protocol, two consecutive requests are handled independently by the server. 

However, the web server is usually required to deal with issues like:

1. Session management
1. Personalization
1. Tracking user behavior

Cookies correspond to pieces of data sent by a web server to the client's browser that helps to address the issues aforementioned.


## Cookie Anatomy
Open the Developer Tool of your favorite browser. Go to *Application* tab and click in *Cookies* located on the left. The Figure below illustrates the process. 

![List of cookies displayed in DevTool](/assets/images/posts/cookies.png "List of cookies displayed in DevTool")

As illustrated, the browser stores several cookies from different websites I visited.
They have attributes responsible for specific aspects of 
 a cookie has a collection of attributes responsible for specific aspects


1. Name


2. Value


3. Domain


4. Path


5. Expires/Max-Age


6. Size



7. HttpOnly



8. Secure



9. SameSite




## XSS
Cross-site scripting 

## CSRF

## Man in the Middle

## SQL Injection


https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
https://www.wst.space/cookies-samesite-secure-httponly/
https://www.owasp.org/index.php/Session_hijacking_attack
