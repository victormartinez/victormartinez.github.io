---
layout: post
title: "Quick tip: kubectx for easy switch between clusters"
category: DevOps
tags: [kubernetes, devops, k8s, kubectx, cluster]
image: featured.png
date: "2020-03-28T00:00:00"
language: en
---

Depending on your company, maintaining more than one Kubernetes cluster can be quite usual. However, typing `kubectl config get-contexts` and `kubectl config use-context` to list the contexts and switch, respectively, (i) is boring, (ii) demands effort and (iii) is not intuitive. Thanks to [kubectx](https://github.com/ahmetb/kubectx/) you can easily switch between contexts.

At [Onyo](http://onyo.com/), we have to switch among three clusters. Therefore, the commands below are often used:

```
kubectx             : list the contexts
kubectx -           : switch to the previous context
kubectx <NAME>      : switch to context <NAME>
```

The _kubectx_ README presents other commands that can be helpful to you:

```
kubectx -c, --current     : show the current context name
kubectx <NEW_NAME>=<NAME> : rename context <NAME> to <NEW_NAME>
kubectx <NEW_NAME>=.      : rename current-context to <NEW_NAME>
kubectx -d <NAME>         : delete context <NAME> ('.' for current-context)
                            (this command won't delete the user/cluster entry
                            that is used by the context)
kubectx -u, --unset       : unset the current context
```

**PS:** If you have [fzf](https://github.com/junegunn/fzf) installed you get a wonderful interactive menu with fuzzy searching by typing `kubectx` or `kubens`.

That's all folks!
