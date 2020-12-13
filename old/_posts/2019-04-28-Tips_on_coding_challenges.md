---
layout: post
title: "Tips on Coding/Technical Challenges"
categories: [Career]
tags: [career, technical, coding, challenges]
image: assets/images/highlights/coding.jpg
on_post: true
toc: true
featured: false
---

It is common for Software Engineers/Programmers/Developers to face a coding/technical challenge in recruitment processes. The challenge consists of programming assignments designed to exam candidates mainly regarding hard skills (e.g. programming ability, architectural design, etc). Usually, the process is comprised of three phases: (i) specification; (ii) development; (iii) review. There are idiosyncrasies and tips for each of them.

After going through coding challenges and, especially, reviewing some of them at [Onyo](www.onyo.com) I decided to write this post and share some lessons that I have learned.

## Specification
The candidate receives an e-mail or document specifying the challenge scope. It usually lists the requirements, constraints and do/don'ts that must be followed. If you are a back-end developer, for example, you might be asked to develop a REST/GraphQL API, a SaaS or an integration with third-party provider. **The key to succeed is to be very attentive to what you have to do. Planning the execution is vital.**

### Read carefully the specification
Do not assume anything regarding what you have to do. Take a time to read every every line of the document and pay attention to **the requirements**.

### Plan the execution
At first differentiate what is a **must** from what is a **nice to have**. Plus, think about what libraries you are going to use and how you are going to architect your code. Besides, it is important to sketch out a plan preferably regarding your deliverables. Stablish steps/phases that are going to be iterated, for instance: (i) set up the project; (ii) CRUD; (iii) business logic 1; (iv) business logic 2; and so on. That way you reduce the risk of not achieving a running project.

### Any questions? Ask!
The specification is meant to have no ambiguities but it is not always that way. Feel free to question anything you did not understand.

### Don't be afraid to negotiate the deadline
Deadlines are tricky in any recrutiment process because different factors can influence how fast you can develop the solution: (i) your proficiency on the language/platform/etc; (ii) if you are already employed and will do it in your free time; (iii) your knowledge on the problem domain. If the company stablishes the deadline, do not be afraid to expose your context and negotiate the deadline.

## Development
After reading the specification and planning the execution it is time to get the hands dirty. There are many tips to keep an eye on.

### KISS (Keep it simple, stupid!)
Avoid as much as possible overengineer and unnecessary abstractions. Your code should be easy to follow. Hard problems usually demand simple solutions.

### Docs (README)
A good README is mandatory. Make sure to explicit: (i) how to run the code; (ii) how to use or interact with it;  (iii) how to run the tests; (iv) where it is deployed (if you deployed).

### Commits
Give meaningful sentences to your commits. The reviewer will check your commits to analyze how you conceived the solution.

### Use good practices
* Favor abstractions
* Don't Repeat Yourself (DRY)
* Follow SOLID principles
* Composition over Inheritance
* Modularization
* Cohesion
* etc.. 

The good practices can be summarized into:

1. Separate the responsibilities into different components
2. Do not scatter business logic
3. Use the conventions of your programming language
4. Name things correctly (classes, variables, etc)
5. Use comments only in critical parts
6. Avoid overengineering and unnecessary abstractions

### Naming
**Make sure your code is semantic.**  Classes, variables, functions, methods should be properly named in such way that the reader easily understand the purpose of that.

### Tests
Write at least unit tests and make them available to be executed at any time. Reaching a high percentage of code coverage can be hard. Therefore, make sure to cover at least the critical parts of your challenge.

### Be cautious about extra work
Some candidates decide to impress the recruiters by implementing extra features. Be careful with that because you can risk your challenge by not completing what matters: the solution according to the specification.

### Make it work, test and refactor
Do not spend too much effort on doing the best solution at first. Instead, (1) create a simple solution, (2) test and (3) refactor.

## Review
Finally it is time to get your code reviewed. In this phase the company either might ask you or not to present the solution. In any case, your code will be reviewed and it is important to **be open to constructive critics and keep in mind the technical decisions you made.**

### Be humble
Regardless your position (intern, junior, middle or senior) **being humble is the most intelligent behavior you can adopt**. Your solution: (i) might have flaws; (ii) do not cover some aspects; (ii) could be improved; (iv) is not prepared for a specific situation. **That's OK!** Accept the constructive critics and keep in mind that programming is a constant-learning path.

### Do not fake
Do not pretend knowing something you actually don't because you can be asked things you will not be able to answer and that creates an atmosphere of mistrust.

### Communication is important
You earn points depending on the way you present the solution. A nice approach is to give a general overview of the solution and, after that, go into the details of what is important (e.g. business logic). During that moment, explain about the technical decisions you made.

### Important questions to keep in mind
Many questions can be brought in the review: What could be improved? What would you do differently? Does your solution scale? What you did not like regarding your implementation? 

It is good to be prepared for them and reflect on things you could do better.

---

*\*Photo by [Fabian Grohs](https://unsplash.com/photos/dMUt0X3f59Q) on [Unsplash](https://unsplash.com)*
