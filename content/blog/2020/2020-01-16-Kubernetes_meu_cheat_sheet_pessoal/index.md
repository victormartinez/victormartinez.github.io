---
layout: post
title: "Kubernetes: meu cheat sheet pessoal"
category: DevOps
tags: [kubernetes, devops, cheat, sheet, commands, k8s]
image: featured.png
date: 2020-01-16T00:00:00
language: pt
---

Se sua infraestrutura é composta por um cluster Kubernetes, você provavelmente tem um conjunto de comandos em mãos para tarefas comuns. A documentação do Google fornece um [cheat sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) útil que você deve dar uma olhada. Porém, neste post irei compartilhar alguns comandos que uso / tenho usado.

## Comandos Gcloud

- Obter credenciais: `gcloud container clusters get-credentials <CLUSTER-NAME> --zone <ZONE> --project <PROJECT-ID>`
- Obter imagens que você fez upload: `gcloud container images list-tags gcr.io/<project-id>/<image-name> [--limit <N>]`
- Obter a última imagem do registry: `gcloud container images list-tags gcr.io/<project-id>/<image-name> --limit 1 | tail -1 | awk '{print $2}'`

## Comandos Básicos

- Verifique o contexto atual (melhor usar [kubectx](https://github.com/ahmetb/kubectx/)): `kubectl config current-context`
- Você iniciou algum job? Melhor verificar: `kubectl get jobs,pods [-n <NAMESPACE> | --all-namespaces | -o wide]`
- Quantos nós no cluster? `kubectl get nodes [-o wide]`
- Liste os recursos: `kubectl get all,svc,deploy,configmaps,secrets,ingress,hpa [-n <NAMESPACE> | --all-namespaces]`
- Quais namespaces seu cluster tem? `kubectl get namespaces`
- Exporte um deployment (útil para debugar o yaml): `kubectl get deploy <NAME> -o yaml --export`
- Obtenha o Managed Certificate: `kubectl describe managedcertificate [-n <NAMESPACE>]`
- Faça encaminhamento de porta: `kubectl port-forward [-n <NAMESPACE>] svc/<SERVICE-NAME> <LOCAL-PORT>:<REMOTE-PORT>`
- Suspenda um CronJob: `kubectl patch cronjobs <cronjob-name> -p '{"spec" : {"suspend" : true }}' [-n <NAMESPACE>]`
- Crie um job a partir de um Cronjob: `kubectl create job --from=cronjob/<YOUR-CRONJOB-NAME> <GIVE-A-NAME>`

_Dica:_ prefixes seus comandos com `watch` para ficar de olho no output. Por exemplo, se você fez deploy de uma nova imagem, verifique o progresso com o comando `watch kubectl get pods [-n namespace]`.

## Deploy

- Liste todos os deployments: `kubectl get deployments --all-namespaces`
- Criar ou deletar um deploy é fácil: `kubectl [apply|delete] -f <FOLDER-OR-FILE>`
- Escale: `kubectl scale deploy <DEPLOY-NAME> [-n <NAMESPACE>] --replicas=<N>`
- Faça rollback de um deploy: `kubectl rollout undo deployment/<DEPLOY-NAME> [-n <NAMESPACE>]`
- Delete evicted pods: `kubectl [-n <NAMESPACE>] delete pods --field-selector=status.phase=Failed`
- Delete todos os pods: `kubectl delete --all pods [-n <NAMESPACE>]`
- Restart nos pods: `kubectl rollout restart deployment <DEPLOY-NAME> [-n <NAMESPACE>]`

Dicas:\_

1. ~~Nunca use~~ Evite usar o comando `scale deploy` pois você vai acabar criando uma diferença entre os arquivos yaml files e o que está aplicado no cluster, tornando uma bagunça descobrir o que está correto. Tudo bem usar em um cenário de emergência mas lembre-se de sempre atualizar o arquivo yaml ou os arquivos de HPA. No cenário normal, mantenha seus arquivos yaml atualizados e aplique-os para mudar o estado do cluster.
1. Configurando `--replicas=0` é uma boa forma de parar o serviço por um período de tempo uma vez que você não deleta o deployment (mas releia a dica anterior).

## Solução de problemas

- Tenha uma visão geral dos deployments: `kubectl describe deploy <DEPLOY-NAME> [-n <NAMESPACE>]`
- Tenha uma visão geral do pod: `kubectl describe pod <POD-NAME> [-n <NAMESPACE>] `
- Verifique os logs: `kubectl logs -f <POD-NAME> [-n <NAMESPACE>] [--tail=<N>]`
- Verifique os logs de um container anterior: `kubectl logs <POD-NAME> -c <CONTAINER-NAME> --previous`
- Verifique os logs de todos os containers que possuem uma label: `kubectl logs -f -l <KEY>=<VALUE> --all-containers`
- Obtenha uma shell interativo: `kubectl exec -it <POD-NAME> [-n <NAMESPACE>] -- /bin/bash`
- Obtenha as métricas de memória e cpu memory:
  ** Todos os nós: `kubectl top nodes`
  ** Um nó: `kubectl top node <NODE-NAME>`
  \*\* Pod: `kubectl top pod <POD-NAME> [-n <NAMESPACE>]`

## Escalonamento / Migração

- Marque um nó não-escalável: `kubectl cordon <NODE-NAME>`
- Marque um nó escalável: `kubectl uncordon <NODE-NAME>`

## Helm

- Solucione o erro devido a versões incompatíveis de client: `helm init --upgrade`
- Liste os deployments do Helm: `helm ls`
- Delete um deploy do helm: `helm delete <NAME> --purge`
- Instale um chart: `helm install <CHART-NAME> --name <YOUR-DEPLOY-NAME> -f <YAML-FILE> [--namespace <NAMESPACE>]`
- Atualize um chart: `helm upgrade <NAME> <CHART> -f <YAML-FILE>`

Isso é tudo, pessoal! À medida que eu utilizar mais comandos eu atualizo este post.
