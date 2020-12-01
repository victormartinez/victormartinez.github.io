---
layout: post
title: "Creating bulletproof command-line scripts"
category: Misc
tags: [command, line, scripts]
date: "2019-05-18T00:00:00"
image: featured.jpg
image_author: Chris Ried
image_url: https://unsplash.com/photos/ieic5Tq8YMk
---

The life of a backend developer involves creating some scripts to be executed in the production environment. For instance, you might need to update many records at once, trigger events or fix a specific bug. _What do they have in common?_ If not designed properly, they can cause a very bad side-effect on your application, ruin the user experience, etc.

In the real-world scenario some changes are ~pratically~ impossible to revert:

1. Triggering emails/notifications/messages/SMSs to customers
2. Accidentally giving an offer to a user
3. Updating records without a backup

As developers we need not only to double check our scripts but also do our best to minimize/avoid possible side-effects (especially if something unexpected happen). Some weeks ago, during a pair programming session, [Elias](https://etandel.xyz) and I created a critical [Django command](https://docs.djangoproject.com/en/2.2/howto/custom-management-commands/) responsible for changing records on many tables according to a business logic. As we dove into the instrinsic parts of the script, we realised how dangerous that could be and took some precautions shared in this post.

## Progress Bars are awesome!

Running a script that takes too much time to complete is nerve-racking. You get confused because you do not know what is happening: (i) is it still running? (ii) is the connection down? That's why a sense of progress is important. If you are a python programmer some projects like [tqdm](https://github.com/tqdm/tqdm) and [clint](https://github.com/kennethreitz/clint) can help you by providing ways to create progress bars. Anyway, if that is too much effort or your programming language does not help you with that, a simple `<accomplished>/<total>` indicator is a good start, at least.

## Logging

After running a script, things happen:

1. You are not sure what was done; Some days later, how do you recall?
2. You won't be 100% sure about the records that were updated;
3. Any rollback will require an specific backup;

Besides, think of the scenario in which your script has an unexpected bug or the records you update are not consistent aligned to the business logic. _How easy is it to revert the side effects?_

All the pain aforementioned can be attenuated if you simply log the changes. You can create a simple file that stores: (i) the id of the records you updated; (ii) the previous column value; (iii) the new value. That way, if something unexpected happens you can easily parse the log, obtain the records you changed and set the old values back without having to load a backup.

## Self-check

What if your script could check for inconsistencies during the execution? Just before the completion, it could parse the log and check whether the new records are consistent to the business logic.

Let's suppose, for instance, you need to multiply the balance of several users by a factor. As you are cautious, your script produces the following log:

```
id;old;new
10987;10;100
98011;5;50
87652;3;35
```

The last record is not correct because the new balance exceeds by 5 the expected value (30). In that case, an Exception can be thrown in order to rollback all the changes.

## Rollback

Especially when handling database records, you must ensure that an all-or-nothing policy will be followed: either all changes are persisted or nothing is done. Use a database transaction to accomplish that because in the event of any error the rollback will be performed.

```python
@transaction.atomic
def handle(self, *args, **kwargs):
    <your_code_goes_here>
```

## Dry-run

As often as possible provide a `dry-run` option. That way the changes are not commited and it is possible to check for errors in the execution time. If you use Django framework, for example, your command can rollback all the changes if `dry-run` is passed as argument:

```python
@transaction.atomic
def handle(self, *args, **kwargs):
    dry_run = kwargs['dry_run']
    if dry_run:
        transaction.set_rollback(True)
```

## Tmux

What if your connection gets lost during the execution? That can be really bad, huh? That's why it is recommended to use a Terminal multiplexer like tmux (check this [tutorial](https://www.hamvocke.com/blog/a-quick-and-easy-guide-to-tmux/)). It is really useful because you can start long-running tasks on your remote server and keep them running even though your connection is lost.

## Code Review

Every code going to production should be reviewed by other programmer. Scripts are no exception. Period.
