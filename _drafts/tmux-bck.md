---
layout: post
title: "The basics of Tmux to help your worklife"
categories: [Tools]
tags: [tooling, tmux, terminal, multiplexer]
image: ''
on_post: false
toc: true
featured: true
---

In the [last post](_posts/2019-05-18-Creating_bulletproof_command_line_scripts.md) I wrote some guidelines regarding the creation of command line scripts among which [Tmux](http://tmux.github.io/) is an important part of that. In this post I intend to provide an easy-to-follow introduction about the topic.

*Conventions:*


## Introduction
> tmux is a terminal multiplexer. It lets you switch easily between several programs in one terminal, detach them (they keep running in the background) and reattach them to a different terminal. - [Tmux Wiki](https://github.com/tmux/tmux/wiki)

If you have [installed]() Tmux properly, a simple `tmux --help` on your terminal will prompt its usage:

![Tmux help](/assets/images/posts/tmux_help.png "Running tmux --help displays its usage")






## Sessions



## Basic Session

$ tmux new -s basic
$ PREFIX t    (time)
$ tmux list-sessions
$ tmux ls
$ tmux attach
$ tmux new-session -s basic
$ tmux new -s second_session -d
$ tmux kill-session -t 0

 
## Window
> -s means SESSION
> -n means NAME

$ tmux new -s windows -n shell

$ PREFIX c (Create new window)

windows: 1 windows
windows: 2 windows

$ PREFIX , (rename window)

$ PREFIX n (go to Next window)
$ PREFIX p (go to Previous window)

$ PREFIX <NUMBER> (go to window)

$ PREFIX w (windows)
$ PREFIX & (closes the current window after confirmation)


## Panes

$ PREFIX % (split vertical PANE)
$ PREFIX " (split horizontal PANE)
$ PREFIX <ARROW> (move)

$ PREFIX x (kill pane)
$ PREFIX spacebar (even-horizontal, even-vertical, main-horizontal, main-vertical, tiled)

$ PREFIX 0 (cycles through open panes)

$ PREFIX q (show pane numbers)

## Command Mode

$ PREFIX :  (command)

```
new-window -n console
```

```
new-window -n processes "top"
```
