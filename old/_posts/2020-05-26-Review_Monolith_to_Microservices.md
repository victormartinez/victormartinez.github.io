---
layout: post
title: "Review: Monolith to Microservices"
categories: [Reviews]
tags: [book, review, monolith, microservices]
toc: false
image: assets/images/highlights/book-review-monolith-to-microservices.png
on_post: true
rating: 5
featured: true
---

Microservice has been a heated topic in the past few years and many ~~reckless~~ developers urge to migrate their legacy monoliths to that architecture. However, the process of breaking down databases and source code demands cautiousness, domain understanding and a strong technical foundation to support the new architecture. Monolith to Microservices, by Sam Newman, is a must to understand patterns that can help you with the transition.

The author starts the book with fundamental concepts like Information Hiding, Domain Driven Design, Coupling, Delivery Contention, etc. It plays an important role as it exposes aspects that you must understand to properly model a microservice-driven architecture.

Then, the book dives into the patterns on how to split your code and database. It presents many challenges that you will probably face and proposes solutions you must assess according to your reality.

Finally, Sam Newman discusses common pain points when growing from a few services to hundreads of them. He covers bother technical (*e.g.* traceability & observability) and non-technical aspects (*e.g*. ownership and developer experience).

In my opinion, Monolith to Microservices worth reading because it brings solutions for problems you don't know until you face. Moreover, the challenges presented make you think about the requirements to move towards a new architecture. It is important to highlight that it does not advocate for a microservice architecture - neither tells you that you should keep your monolith. Since you understand the foundations and you are mature enough to assess your situation, it shows you patterns to ease the transition.

Despite knowing that a Modular Monolith or a macroservice-driven architecture will be appropriate for many cases, it worth knowing patterns to decompose databases and systems. With the challenges at hand you can create systems easier to maintain, evolve and decompose.
