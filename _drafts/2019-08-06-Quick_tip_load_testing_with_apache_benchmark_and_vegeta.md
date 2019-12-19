---
layout: post
title: "Quick Tip: Load testing with Apache Benchmark and Vegeta"
categories: [Tools]
tags: [apache, benchmark, ab, vegeta, load, testing, tool]
image: assets/images/highlights/apache_bench_and_vegeta.png
on_post: false
toc: true
featured: true
---

TL;DR: Check out the [Apache HTTP server benchmarking tool](https://httpd.apache.org/docs/2.4/programs/ab.html) and [Vegeta](https://github.com/tsenart/vegeta) to run a load testing that involves HTTP server.

This week we developed a promising-yet-database-consuming feature. Concerned about the consequences of running heavy queries during the peak time, we ran a load test that simulated a typical user interaction. The idea was to make many requests to the REST API - which is the entry point for our customers - and check the application and database performances. **But, how to do that?**

We got to know two interesting tools: [Apache HTTP server benchmarking tool](https://httpd.apache.org/docs/2.4/programs/ab.html) and [Vegeta](https://github.com/tsenart/vegeta).

## Apache AB
A typical example example is presented below.

```bash
ab -T application/json -c 1000 -n 1000 -H 'Content-Type: application/json' -H 'Authorization: Basic dGFsaWJlcnRpNiMGVmMzA1' -m GET https://api.mydomain.com
```

* -T indicates the Content Type
* -c represents the number of multiple requests to perform at a time
* -n number of requets to perform for the benchmarking session
* -H allows me to add headers to the request
* -m Http Method


## Vegeta
Check

