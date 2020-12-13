---
layout: post
title: "Lessons on migrating legacy infrastructure"
categories: [DevOps]
tags: [aws, devops, infrastructure, legacy]
---

I am part of a backend squad in a promising startup based in São Paulo. There are only two _backenders_ and sometimes it is necessary to wear different hats to get things done. Recently we have migrated our AWS infrastructure from São Paulo to North Virginia and I share the lessons learned in this post. Hope they get helpful if you face a similar situation.

## Scenario
Our infrastructure was comprised of AWS solutions located in São Paulo (SP). Moving to North Virginia (NV) reduced our cost by 50% and that is a big deal for a startup.

Once the startup works with order ahead any downtime during the day (especially in lunch time) is a disaster. Three weeks ago São Paulo was on holiday and we took that window to migrate from SP to NV during the dawn from Thursday to Friday. It is important to keep in mind that our infrastructure was not built on code and many things happened to be manually configured.

Fortunately, our stack is very nice to work with: Django, Celery, Falcon and RabbitMQ on some EC2 instances. Luckily our database instance is a Postgres running in Amazon RDS and we use Cloudflare as DNS solution. With regard to the deployment it is done by some fabric files executed by a Jenkins server.

## Migration Process
The migration process occurred without major errors. We took the day to setup the data center in NV (Security Groups, Load Balancer, VPC, Subnets, etc) and the dawn got booked for migrating the apps. The first action was to stop the services and ensure nothing was running. After that, we moved the smallest app and, with the app running, ensured the infrastructure had no issues to be addressed. Finally, app after app was moved to the new data center and we checked the applications’ healthchecks were OK. By the end we turned on the services and pointed our deployment to the new data center which, by the way, worked like a charm. *However, something got wrong on Friday!*


#### Troubleshooting
On Friday everything seemed perfect, after all we had tested the endpoints and services in the dawn. However, extra machines were being scaled up and down during the lunch time (our precious period of day). Debugging was not revealing the problem and a check on New Relic showed the CPU and Memory of the machines were fine. By exclusion, the team hypothesized the healthchecker in the Load Balancer was not configured correctly and a change on that fixed the issue and confirmed the hypothesis. The rest of the day ran really stable but just to prepare us for Monday: *the same problem happened in a harder scale: the ups and downs were happening on a very busy day.*

We thought everything was fine but on Monday approximately 50% of the orders were being canceled and the company was losing money. We had fixed the Load Balancer healthcheck and that was not an issue any longer. However, one thing was different from Friday: New Relic showed all machines had CPU and Memory topped. A ssh revealed high memory swap and background processes on fire. We scaled up many machines to hold on the situation while we discussed the possible root cause. It took hours to come up with the root cause but we solved.

#### Solution
The problem was *latency!* Really! Our users live in São Paulo and our previous data center was located there. Moving to NV increased the latency and required more processing power which we had not foreseen. Increasing the machine processing and memory fixed the issues once and for all. Since then, we have not witnessed any problem.

## Lessons Learned
Definitely many lessons were learned and I want to share the most important ones.

#### Inventory
List all projects necessary to be migrated. Simply don’t trust on your memory otherwise you might left important project(s) out of the process. All companies have that small project that works fine and no one remembers.

#### Pair Programming
Two heads are better than one. Regardless of your experience, mistakes can be avoided by having someone near by.

#### Keep a log
Create a textfile or markdown with all steps you took. During the process you might no recall for things you had done. Keeping a log refresh your mind and can be reviewed later on to double check for mistakes.

#### Set up in advance
Everything that does not imply on a downtime should be configured and tested previously. That way you save time and effort. For example, creating VPCs, Security Groups, Subnets, RDS instances, etc.

#### Migrate the smallest first
Start the migration from the smallest project you have. Select those with less requirements and communication requirements. For instance, we first migrated a microservice that works like a proxy. Not having to setup database and/or external requirements validates the infrastructure is working in an early stage.

#### Use a switch button, if you have
Our deploy was configured to work on São Paulo datacenter. By changing one line we could point to North Virginia and saved us from dealing with a more detailed deployment migration.

#### Be prepared for performance issues
Moving to North Virginia brought us an increase of latency. You might solve that in the application layer (by optimizing resources) or in the infrastructure you use. In our case we had to change the EC2 instances to a better configuration which decreased our savings from 50% to 30% (still valid).

#### Test as much as you can
After doing all hard work test as much as you can. I advise you to create scripts for that and to use a Heavy Load (such as [Apache Bench](https://httpd.apache.org/docs/2.4/programs/ab.html)) to test the infrastructure under some stress.
