---
layout: post
title: "Getting Started with Recommender Systems: Part II"
category: RecSys
tags: [recommender, systems, machine, learning, recsys, recommendation]
date: "2019-09-07T00:00:00"
image_author: Mr Cup / Fabien Barral
image_url: https://unsplash.com/photos/o6GEPQXnqMY
image: featured.png
language: en
---

In the [previous](/2019-08-13-Getting_Started_with_Recommender_Systems_Part_I/) post I introduced the RecSys field and the levels of personalization. Today I will discuss about the recommendation pipeline and how it works.

If you missed the other posts, check them out:

- [Part I: Introduction and Levels of Personalization](/2019-08-13-Getting_Started_with_Recommender_Systems_Part_I/)
- Part II: How it Works
- Part III: Techniques
- Part IV: Metrics
- Part V: Challenges
- Part VI: References and Further Reading

## How it works

There are lots of work to be done before doing recommendation per se. Collecting data, preprocessing and designing the model, for example, are important phases. Generally speaking, it is possible to visualize the process as a pipeline comprised of phases illustrated in the figure below.

![Recommender System Pipeline](./recsys_phases.png "Recommender System Pipeline")

In the next sections we will dive into each phase.

### Data Collection

The most important aspect of RecSys is the understand of users's preferences. Therefore, everything starts with the collected data resulting from the interaction between users and items. Depending on the data collected you will have **implicit** or **explicit** feedbacks regarding the preferences of your users.

**1. Explicit:**

The user explicitly indicates how much they like/dislike a product. For instance, ratings ranging from 1 to 5 (e.g. Amazon) or like/dislike (e.g. Facebook, Netflix).

Working with explicit data ease the process of understanding the users' preferences but brings some challenges: (i) once rating items requires user effort, not all users rate the items consumed; (ii) people rate items differently due to different factors (some people are more demanding than others); (iii) there are biased people regarding specific items/categories/products.

**2. Implicit:**

Implicit feedback, as the name suggests, does not explicit preferences with ratings. Instead, it represents actions or characteristics that indicate how much a given user likes a given product. For example, you might not like a video on Youtube but watch it from start to end. Despite not givin a like to the video (explicit feedback) you watched the whole video (implicit feedback) and, therefore, it is highly likely you enjoyed it.

Other examples that are considered implicit feedback:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; i. Place items to the shopping cart

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ii. Number of times you searched for an item

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iii. How much time you spent reading an article

**3. Hybrid:**

There are approaches that take both feedbacks into consideration in order to provide more accurate recommendations. Once they use both explicit and implicit feedback, it is said the algorithm uses hybrid feedback. Certainly it is a more powerful approach because in the real world the users will not explicitly like/dislike all items (the Youtube example aforementioned illustrates the scenario).

**Discussion: use or not hybrid feedbacks?**
Not using hybrid feedback does not imply in a bad RecSys engine because each business domain requires specific approaches. The best way to develop a good engine is to start small and keep iterating until you reach satisfactory results and a reasonable maintenance cost. Sometimes, a very complex architecture does not pay off and, thus, a simple yet robust approach does a wonderful job.

### Preprocessing

Preprocessing is as important as the collecting phase. In real world scenario you can not fit the raw data directly into the algorithms without analysis and preprocessing. Noisy elements and data format are common issues that need to be addressed. Other questions might require a special attention:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; i. How to transform implicit data into feasible numbers to your model?

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ii. Is there any feature that does not contribute to the model?

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iii. How are you going to structure the data before training the models? (csv? buckets? files? memory?)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iv. How are you going to do data ingestion through your model?

If you follow some tutorials in the Internet you might not perceive the preprocessing step and that's because they usually use free-to-use datasets like [Movielens](https://grouplens.org/datasets/movielens/). In such cases, the data had already been preprocessed to a common pattern (_e.g._ CSV, TSV, SSV, etc) like `user_id;item_id;rating;timestamp` and you do have to worry about that. However, in real world scenarios preprocessing is a common step towards a better RecSys engine. The figure in _How it works_ section lists some techniques like _OneHot Encoding_, _Row Compression_ and _Variable Selection_ that are pretty common in the Machine Learning field but you might not use (all of) them.

### Learning

RecSys engines usually take advantage of Machine Learning algorithms to build their models. The personalized recommendation requires the building the Ratings Matrix (R): a matrix that represents the user's prefences. The table bellow illustrates that using movies as items.

|        | Batman | Avengers | Harry Potter | Star Wars | Hangover | A Star is Born | Nemo | ... |
| ------ | ------ | -------- | ------------ | --------- | -------- | -------------- | ---- | --- |
| Victor | 4.0    | 4.0      |              |           |          | 2.0            | 2.0  |     |
| Jess   | 2.5    |          | 4.0          |           | 4.0      | 5.0            | 4.0  |     |
| Luke   | 4.0    |          | 3.0          | 3.0       |          | 1.0            |      |     |
| ...    |        |          |              |           |          |                |      |     |

As you can see the matrix has some properties:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; i. It is sparse: the users did not see/watch/read the whole catalog of items, right?

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ii. Rows represent users and columns stand for items

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iii. Missing values indicate the user did not rate the item

Then, through math iterations it predicts the ratings the users would give for each item not seen and builds the Predicted Ratings Matrix (R^):

|        | Batman | Avengers | Harry Potter | Star Wars | Hangover | A Star is Born | Nemo  | ... |
| ------ | ------ | -------- | ------------ | --------- | -------- | -------------- | ----- | --- |
| Victor | 4.0    | 4.0      | [3.0]        | [5.0]     | [4.0]    | 2.0            | 2.0   |     |
| Jess   | 2.5    | [2.0]    | 4.0          | [2.0]     | 4.0      | 5.0            | 4.0   |     |
| Luke   | 4.0    | [4.0]    | 3.0          | 3.0       | [4.0]    | 1.0            | [2.0] |     |
| ...    |        |          |              |           |          |                |       |     |

\* _Values between bracket means the predicted rating._

There are many algorithms to obtain the matrix above and each one has its idiosyncrasies. We will talk about them in the next blog post (_hold your breath!_).

### Recommendation

Finally, it is time to recommend a new item to your users. Once we have the Predicted Ratings Matrix (R^) doing the recommendation is a matter of selecting and filtering the predicted items as follows:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1. Select Candidates:** Select the items whose ratings were predicted.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **2. Filtering:** Define a threshold (_e.g._ 4.0) and exclude candidates whose ratings are less than that.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **3. Top N:** Sort the result by rating, stablish the number of recommendations (N) and present to the user.

The figure below illustrates the process by taking into consideration the user Victor listed in the previous table.

![RecSys Filtering](./recsys_filtering.png "RecSys Filtering")

## Prediction vs Recommendation

You might read posts that use **prediction** and **recommendation** interchangeably but they hold different meanings. **Prediction** corresponds to the expected rating to a given item. In the learning phase your model assigns ratings to the items the user has not seen and those ratings are predictions. On the other hand, **recommendation** corresponds to the item itself (or the set of items) being recommended to the user.
