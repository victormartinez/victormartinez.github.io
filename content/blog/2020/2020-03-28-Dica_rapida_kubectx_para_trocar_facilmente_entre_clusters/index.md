---
layout: post
title: "Dica rápida: kubectx para trocar facilmente entre clusters"
category: DevOps
tags: [kubernetes, devops, k8s, kubectx, cluster]
image: featured.png
date: "2020-03-28T00:00:00"
language: pt
---

Depentendo da sua empresa, manter mais de um cluster Kubernetes pode ser uma atividade comum. Entretando, digitar `kubectl config get-contexts` e `kubectl config use-context` para listar os contextos e trocar, respectivamente, (i) é chato, (ii) demanda esforço e (iii) não é intuitivo. Graças ao [kubectx](https://github.com/ahmetb/kubectx/) você pode facilmente trocar entre contextos.

Na [Onyo](http://onyo.com/), nós temos que trocar entre três clusters. Portanto, os comandos abaixo são comumente usados:

```
kubectx             : list the contexts
kubectx -           : switch to the previous context
kubectx <NAME>      : switch to context <NAME>
```

O README do _kubectx_ apresenta outros comandos que podem ser úteis para você:

```
kubectx -c, --current     : show the current context name
kubectx <NEW_NAME>=<NAME> : rename context <NAME> to <NEW_NAME>
kubectx <NEW_NAME>=.      : rename current-context to <NEW_NAME>
kubectx -d <NAME>         : delete context <NAME> ('.' for current-context)
                            (this command won't delete the user/cluster entry
                            that is used by the context)
kubectx -u, --unset       : unset the current context
```

**PS:** Se você tiver [fzf](https://github.com/junegunn/fzf) instalado você tem um maravilhoso menu interativo com busca fuzzy sempre que digitar `kubectx` ou `kubens`.

Por hoje é tudo, pessoal!
