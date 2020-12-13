---
layout: post
title: "Kubernetes: my personal cheat sheet"
categories: [DevOps]
tags: [kubernetes, devops, cheat, sheet, commands, k8s]
image: /assets/images/highlights/kubernetes_cheatsheet.png
on_post: false
toc: true
featured: false
---

If your infrastructure is comprised of a Kubernetes cluster you probably have a set of commands at hand for common tasks. Google doc provides a handy [Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) that you should have a look. However, in this post I will share some commands that I use/have used.

## Gcloud Commands

* Get credentials: `gcloud container clusters get-credentials <CLUSTER-NAME> --zone <ZONE> --project <PROJECT-ID>`
* Get images you have uploaded: `gcloud container images list-tags gcr.io/<project-id>/<image-name> [--limit <N>]`
* Get the last image on your registry: `gcloud container images list-tags gcr.io/<project-id>/<image-name> --limit 1 | tail -1 | awk '{print $2}'`

## Basic commands

* Check the current cluster context (better to use [kubectx](https://github.com/ahmetb/kubectx/)): `kubectl config current-context`
* Did you start any job? Better to check: `kubectl get jobs,pods [-n <NAMESPACE> | --all-namespaces | -o wide]`
* How many nodes in the cluster? `kubectl get nodes [-o wide]`
* Get resources: `kubectl get all,svc,deploy,configmaps,secrets,ingress,hpa [-n <NAMESPACE> | --all-namespaces]`
* What namespaces does your cluster have? `kubectl get namespaces`
* Export a deployment (useful to debug the yaml): `kubectl get deploy <NAME> -o yaml --export`
* Get your Ingress managed certificate: `kubectl describe managedcertificate [-n <NAMESPACE>]`
* Port forward: `kubectl port-forward [-n <NAMESPACE>] svc/<SERVICE-NAME> <LOCAL-PORT>:<REMOTE-PORT>`
* Suspend CronJob: `kubectl patch cronjobs <cronjob-name> -p '{"spec" : {"suspend" : true }}' [-n <NAMESPACE>]`

*Hint:* prefix your commands with `watch` to keep an eye on the output. For instance, if you have deployed a new image, check the progress by running `watch kubectl get pods [-n namespace]`.

## Deploy

* Check all deployments: `kubectl get deployments --all-namespaces`
* Creating or deleting a deploy is quite easy: `kubectl [apply|delete] -f <FOLDER-OR-FILE>`
* Scaling it as well: `kubectl scale deploy <DEPLOY-NAME> [-n <NAMESPACE>] --replicas=<N>`
* Rollback a deployment: `kubectl rollout undo deployment/<DEPLOY-NAME> [-n <NAMESPACE>]`
* Delete evicted pods: `kubectl [-n <NAMESPACE>] delete pods --field-selector=status.phase=Failed`
* Delete all pods: `kubectl delete --all pods [-n <NAMESPACE>]`
* Restart pods: `kubectl rollout restart deployment <DEPLOY-NAME> [-n <NAMESPACE>]`

*Hints:* 
1. ~~Never use~~ Avoid to use `scale deploy` command because you will end up differing from the yaml files and it will be a mess to determine the diff between the cluster and the yaml files. It is OK to use it in an emergency scenario but remember to update the deploy or the HPA file(s). In a normal scenario, keep your yamls updated and apply them to change the cluster state.
1. Setting `--replicas=0` is a nice way to stop the service for a period of time since you do not delete the deployment (but consider the advice previously).

## Troubleshooting

* Get an overview of the deployment: ` kubectl describe deploy <DEPLOY-NAME> [-n <NAMESPACE>] `
* Get an overview of the pod: `kubectl describe pod <POD-NAME> [-n <NAMESPACE>] `
* Check logs: `kubectl logs -f <POD-NAME> [-n <NAMESPACE>] [--tail=<N>]`
* Check logs of a previous container: `kubectl logs <POD-NAME> -c <CONTAINER-NAME> --previous`
* Check logs of all containers matching a label: `kubectl logs -f -l <KEY>=<VALUE> --all-containers`
* Get an interactive shell: `kubectl exec -it <POD-NAME> [-n <NAMESPACE>] -- /bin/bash`
* Get memory and cpu stats of your:
** Nodes: `kubectl top nodes`
** Node: `kubectl top node <NODE-NAME>`
** Pod: `kubectl top pod <POD-NAME> [-n <NAMESPACE>]`


## Scheduling/Migration

* Mark a node unschedulable: `kubectl cordon <NODE-NAME>`
* Mark a node schedulable: `kubectl uncordon <NODE-NAME>`

## Helm

* Solve error due to incompatible versions client: `helm init --upgrade`
* List helm deployments: `helm ls`
* Delete a helm deploy: `helm delete <NAME> --purge`
* Install a chart: `helm install <CHART-NAME> --name <YOUR-DEPLOY-NAME> -f <YAML-FILE> [--namespace <NAMESPACE>]`
* Update a chart: `helm upgrade <NAME> <CHART> -f <YAML-FILE>`


That's all folks. As I use more commands I update this post.

---

