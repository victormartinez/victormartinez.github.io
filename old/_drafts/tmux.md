---
layout: post
title: "Tmux in 5 minutes"
categories: [Tools]
tags: [tooling, tmux, terminal, multiplexer]
image: 'assets/images/highlights/tmux.png'
on_post: true
toc: true
featured: true
---

In the [last post](_posts/2019-05-18-Creating_bulletproof_command_line_scripts.md) I wrote some guidelines regarding the creation of command line scripts among which [Tmux](http://tmux.github.io/) is an important part of that. In this post I intend to provide an easy-to-follow introduction about the topic.

## Introduction
> tmux is a terminal multiplexer. It lets you switch easily between several programs in one terminal, detach them (they keep running in the background) and reattach them to a different terminal. - [Tmux Wiki](https://github.com/tmux/tmux/wiki)

If you have installed Tmux properly, a simple `tmux --help` on your terminal will prompt its usage:

![Tmux help](/assets/images/posts/tmux_help.png "Running tmux --help displays its usage")


## Commands you should know
I hate tutorials that presents lots of commands to memorize. Tip: get proficient with a few and, after that, learn a few more.

*With regard to sessions:*

1. Create a new session: `$ tmux new -s <name>`
1. List sessions: `$ tmux ls`
1. Attach to a session: `$ tmux attach`
1. Kill a session: `$ tmux kill-session -t <number-or-name>`

*Once you are attached to a session:*

1. Dettach: `PREFIX d`
1. Kill the whole session: `CTRL + d`
1. Kill the pane: `PREFIX x`
1. Split verical pane: `PREFIX %`
1. Split horizontal pane: `PREFIX "`
1. Navigate through panes: `PREFIX o`
1. Create a new window: `PREFIX c`

*Now that you have a new window:*

1. Go to next window: `PREFIX n`
1. Go to prev window: `PREFIX p`
1. Go to a window: `PREFIX <NUMBER>`
