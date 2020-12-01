---
layout: post
title: "Python + Elasticsearch"
category: Web Development
tags: [elasticsearch, python]
date: "2018-02-02T00:00:00"
image: featured.png
last_modified_at: "2018-02-04"
---

So you got lots of documents and need fast querying, huh? Or you have tons of data and need to process and extract metrics. Either way, Elasticsearch (ES) can be a powerful engine to help you index, query and extract metrics from its document-driven storage. This post is very straightforward and intends to show how to use python to interact with the engine and index/retrieve/query documents.

The python community has develop two well known projects: [elasticsearch-py](http://elasticsearch-py.readthedocs.io/) and [elasticsearch-dsl](http://elasticsearch-dsl.readthedocs.io/). While the former provides some tools to interact with ES and, IMHO, a more granular control over the actions, the latter was built to help you with the search and persistence. Let’s check that.

## Connecting

The first question is: how do I connect to ES? By using `elasticsearch-dsl` you can create a default connection that will be used globally:

```python
connections.create_connection(hosts=['localhost'])
```

However, you might want to use a client and have a more granular control. By using `elasticsearch-py` you can achieve that:

```python
from elasticsearch import Elasticsearch

client = Elasticsearch(hosts, http_auth=(username, password), **kwargs)
```

Execute `client.indices.get_alias("*")` to retrieve the existent indexes and check it is properly configured.

## Persisting

Storing our documents is easy because `elasticsearch-dsl` provides DocType – a class that takes care of mapping your python class to JSON documents. Instead of worrying about JSON structures, let’s create a document that stores the user hit to a specific page:

```python
from elasticsearch_dsl import DocType, Integer, Date, Keyword


class UserHit(DocType):
    page = Keyword()
    datetime = Date()
    user_id = Integer()
    environment = Keyword()
```

Pay attention to the fields we chose: Integer, Date, Keyword. They will be mapped to Elasticsearch engine which means that you can use specific features. For example, the datetime field can be used to search a date range or aggregate data by minute,hour, day, month. Another detail is the `environment` field: it a solution to integrate ES with diferent environments: staging, development and production. That way, you do not take the risk of mixing fake data to production data.

**Updated on Feb 4th **: There is another strategy to not mess with production data: create indexes concatenated with the app environment. By using an env var, your application can create different indexes (e.g. myindex-2018.02.01-production, myindex-2018.02.01-staging, myindex-2018.02.01-development). Thanks for the contribution Robson Peixoto.

Once you create the class indexing becomes easy:

```python
user_hit = UserHit(
    page='product-list',
    datetime=datetime.now(),
    user_id=10,
    environment='production'
)

UserHit.init(using=client, index=index_name)

# Indexed can be True or False depending on the operation success
indexed = user_hit.save(using=client, index='myindex-2018.02.01')
```

You must be attentive to two issues: (i) before using the document you must ensure the mappings in Elasticsearch are created and that’s why we have to use the `init` method in line 8; (ii) the return of the operation once the `.save` method can return either `True` or `False`.

## Querying

How to query the documents? The snippet below illustrates a simple example.

```python
from elasticsearch_dsl import Search
from elasticsearch import ElasticsearchException


search = (Search(using=client, index='myindex-2018.02.01')
          .sort('datetime')
          .query('match', page='product-list')
          .query('match', user_id=12)
          .query('match', environment='production'))

count = search.count()
search = search[0:count]

response = search.execute()
if not response.success():
    raise ElasticsearchException('Fail to get the hits')

return response.hits
```

It is important to mention that ES brings only _10 results by default and that’s why we need the lines 11 and 12_.

## Filtering

```python
search = (Search(using=client, index='myindex-2018.02.01')
          .sort('datetime')
          .query('match', page='product-list')
          .query('match', user_id=12)
          .query('match', environment='production'))

search = search.filter('range', datetime={'gte': from_datetime, 'lte': to_datetime, 'time_zone': time_zone_delta})

count = search.count()
print(count)

search = search[0:count]

response = search.execute()
print(response.hits)
```

You have just queried, but now you want to filter the results by a date range. The 7th line does the trick.

## Aggregating

You can generate metrics based on date, for example. The 12th line tells ES to group the data by intervals of 30 minutes.

```python
from elasticsearch_dsl import Search
from elasticsearch import ElasticsearchException


search = (Search(using=client, index='myindex-2018.02.01')
          .sort('datetime')
          .query('match', page='product-list')
          .query('match', user_id=12)
          .query('match', environment='production'))

search = search.filter('range', datetime={'gte': from_datetime, 'lte': to_datetime, 'time_zone': time_zone_delta})
search.aggs.bucket('datetime', 'date_histogram', field='datetime', interval='30m')

count = search.count()
search = search[0:count]

res = search.execute()
if not response.success():
    raise ElasticsearchException('Fail to get the hits')

return res.aggs['datetime']['buckets']
```

Note: This post was intentionally written to be straightforward. Sometimes getting everything up and running decreases the learning curve. As the development goes you may have some questions that can be addressed in the [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/), [elasticsearch-py docs](http://elasticsearch-py.readthedocs.io/) and [elasticsearch-dsl docs](http://elasticsearch-dsl.readthedocs.io/)
