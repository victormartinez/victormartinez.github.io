---
layout: post
title: "Getting Started with Recommender Systems: Part I"
categories: [RecSys]
tags: [recommender, systems, machine, learning, recsys, recommendation]
image: assets/images/highlights/vinyles-part-i.png
on_post: false
toc: true
featured: true
---

I have been studying Recommender Systems (RecSys) for the past few months. Many topics are scattered in the Internet and I thought about condensating the main concepts into a series of blog posts. For those of you who are interested in the subject, I organized the content and split into parts:

* Part I: Introduction and Levels of Personalization
* Part II: How it Works
* Part III: Techniques
* Part IV: Metrics
* Part V: Challenges
* Part VI: References and Further Reading

## Introduction
RecSys is a topic of concern of big players like Amazon, Spotify, Netflix, Github and Linkedin. Mike McGuire in this [post](https://www.huffpostbrasil.com/2013/08/01/netflix-profiles_n_3685876.html) explains that companies have realized that "if there's not something else there surfacing that meets your interest beyond what you initially dialed in for, then you're out". In other words, companies are concerned with providing not only what the user is looking for but other items that meets the user's preferences. At Amazon, for example, if you want to buy a Kindle the website will drive you to the product but will also show related items you might want like a charger and a waterproof cover. 

An interesting article from Standford, [When Choice is Demotivating: Can One Desire Too Much of a Good Thing?](https://www.researchgate.net/publication/12189991_When_Choice_is_Demotivating_Can_One_Desire_Too_Much_of_a_Good_Thing), shows the negative impact of presenting too many options to customers.


![When Choice is Demotivating - Experiment](/assets/images/posts/jams-conversion.png "When Choice is Demotivating - Experiment")

In fact, when there is no personalization your customers end up doing ["infinite browsing"](https://www.youtube.com/watch?v=VqdQZCvpIyo) and there is no conversion and, consequently, a high level of churn. This [article](https://www.businessinsider.com/netflix-recommendation-engine-worth-1-billion-per-year-2016-6) from Business Insider explains how "the combined effect of personalization and recommendations save us [Netflix] more than $1B per year".

RecSys are valuable at [increasing the sales](http://fortune.com/2012/07/30/amazons-recommendation-secret/). In 2012, Amazon has reported "a 29% sales increase to $12.83 billion during its second fiscal quarter, up from $9.9 billion during the same time last year". However, they are not limited to profit. [This infographic](https://sigmoidal.io/recommender-systems-recommendation-engine/) illustrates they also **improve retention**, **form habits** and **accelerate work**.

### Formal definition
So far we have seen RecSys as a general idea that mixes some topics like `personalization`, `items`, `recommendation` and `user's preferences`. But, **how can we define it?**

> Recommender Systems are software tools and techniques that provide suggestions for items that are most likely of interest to a particular user.
>
> \- F. Ricci, L. Rokach, B. Shapira, and P. B. Kantor, editors. Recommender Systems Handbook. Springera, 2011

## Levels of Personalization
In RecSys context, personalization means how much your algorithm understand each user to provide a meaningful recommendation. Basically, the approach can be understood as **non-personalyzed** or **personalyzed**.

### Non-Personalized
Non-personalized RecSys do not take into consideration individual preferences. They usually consider an heuristic or statistical calc to recommend items. The most common scenario is the News websites like CNN, Bloomber, Globo.com, etc, in which there are sections like "Breaking news" or "Featured". In Spotify, "Top songs in Brazil". Amazon, "Top-selling books".

Some examples:
1. Most listened songs
2. Most read blog posts
3. Breaking news articles
4. Top tracks on the radio
5. Top-selling books
6. High-scored hotels
7. Best places to stay

The advantage of this approach is that it is not that expensive and is useful when you do not have enough information about your users. That way you can solve **cold start problems** (explained in Part IV) and start doing recommendation without too much effort.

### Personalyzed
The personalyzed approach considers the user's preferences to recommend an item. Algorithms in this category rely on a pipeline that (i) takes user's data; (ii) does processing to find patterns in the preferences; (iii) calc predictions. *Disclaimer: in Part II and III it will be crystal clear.*

The most common example is Netflix. Based on the titles you liked, Netflix does a lot of processing and recommends you new movies or series.

The advantage of this approach is the level of personalization you can achieve and, thus, increase the convertion in your system. However, it takes much more effort than the previous one and, of course, requires a more complex solution/algorithm/architecture.

### Notes
There is no silver bullet. The best approach is the one that works for you business. It is pretty common to adopt both approaches in the same platform/website/system. For example, Spotify provides those "Top Lists" but also does a personalized approach when recommending you a song similar to the one you are listening to.

A golden rule is to think about the whole experience and what you want to achieve: more sales; retention increase; form a habbit; etc. Once you have defined your goal, the Metrics, algorithms and technical decisions will relate to that and mixed approaches are very common.

---

*\*Photo by [Mr Cup / Fabien Barral](https://unsplash.com/photos/o6GEPQXnqMY) on [Unsplash](https://unsplash.com)*
