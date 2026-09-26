---
title: "Kubernetes na prática"
description: "Comandos de kubectl, gcloud e Helm que uso no dia a dia com Kubernetes."
maturidade: revisada
atualizado: 2026-09-12
---

Se sua infraestrutura é composta por um cluster Kubernetes, você provavelmente tem um conjunto de comandos em mãos para tarefas comuns. A documentação do Google fornece um [cheat sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) útil que você deve dar uma olhada. Porém, aqui estão alguns comandos que uso / tenho usado.

## Gcloud

Obter credenciais:

```bash
gcloud container clusters get-credentials <CLUSTER-NAME> --zone <ZONE> --project <PROJECT-ID>
```

Obter imagens que você fez upload:

```bash
gcloud container images list-tags gcr.io/<project-id>/<image-name> [--limit <N>]
```

Obter a última imagem do registry:

```bash
gcloud container images list-tags gcr.io/<project-id>/<image-name> --limit 1 | tail -1 | awk '{print $2}'
```

## Básicos

Verifique o contexto atual (melhor usar [kubectx](https://github.com/ahmetb/kubectx/)):

```bash
kubectl config current-context
```

Você iniciou algum job? Melhor verificar:

```bash
kubectl get jobs,pods [-n <NAMESPACE> | --all-namespaces | -o wide]
```

Quantos nós no cluster?

```bash
kubectl get nodes [-o wide]
```

Liste os recursos:

```bash
kubectl get all,svc,deploy,configmaps,secrets,ingress,hpa [-n <NAMESPACE> | --all-namespaces]
```

Faça encaminhamento de porta:

```bash
kubectl port-forward [-n <NAMESPACE>] svc/<SERVICE-NAME> <LOCAL-PORT>:<REMOTE-PORT>
```

Crie um job a partir de um Cronjob:

```bash
kubectl create job --from=cronjob/<YOUR-CRONJOB-NAME> <GIVE-A-NAME>
```

> Dica: prefixe seus comandos com `watch` para ficar de olho no output. Por exemplo, se você fez deploy de uma nova imagem, verifique o progresso com `watch kubectl get pods [-n namespace]`.

## Deploy

Liste todos os deployments:

```bash
kubectl get deployments --all-namespaces
```

Criar ou deletar um deploy é fácil:

```bash
kubectl [apply|delete] -f <FOLDER-OR-FILE>
```

Escale:

```bash
kubectl scale deploy <DEPLOY-NAME> [-n <NAMESPACE>] --replicas=<N>
```

Faça rollback de um deploy:

```bash
kubectl rollout undo deployment/<DEPLOY-NAME> [-n <NAMESPACE>]
```

Restart nos pods:

```bash
kubectl rollout restart deployment <DEPLOY-NAME> [-n <NAMESPACE>]
```

> Dica: evite usar o comando `scale deploy` pois você vai acabar criando uma diferença entre os arquivos yaml e o que está aplicado no cluster. Tudo bem usar em um cenário de emergência mas lembre-se de sempre atualizar o arquivo yaml ou os arquivos de HPA.

## Solução de problemas

Tenha uma visão geral do pod:

```bash
kubectl describe pod <POD-NAME> [-n <NAMESPACE>]
```

Verifique os logs:

```bash
kubectl logs -f <POD-NAME> [-n <NAMESPACE>] [--tail=<N>]
```

Verifique os logs de um container anterior:

```bash
kubectl logs <POD-NAME> -c <CONTAINER-NAME> --previous
```

Obtenha uma shell interativo:

```bash
kubectl exec -it <POD-NAME> [-n <NAMESPACE>] -- /bin/bash
```

Métricas de memória e cpu de um pod:

```bash
kubectl top pod <POD-NAME> [-n <NAMESPACE>]
```

## Escalonamento

Marque um nó não-escalável:

```bash
kubectl cordon <NODE-NAME>
```

Marque um nó escalável:

```bash
kubectl uncordon <NODE-NAME>
```

## Helm

Liste os deployments do Helm:

```bash
helm ls
```

Instale um chart:

```bash
helm install <CHART-NAME> --name <YOUR-DEPLOY-NAME> -f <YAML-FILE> [--namespace <NAMESPACE>]
```

Atualize um chart:

```bash
helm upgrade <NAME> <CHART> -f <YAML-FILE>
```

Isso é tudo, pessoal! À medida que eu utilizar mais comandos eu atualizo esta nota.
