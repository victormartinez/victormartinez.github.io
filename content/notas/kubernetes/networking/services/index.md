---
title: "Services"
description: "ClusterIP, NodePort e LoadBalancer: quando usar cada um."
maturidade: revisada
atualizado: 2026-08-01
---

Service é um IP estável na frente de um conjunto de pods que muda o tempo todo.

## ClusterIP

O padrão. Só é alcançável de dentro do cluster. É o que a maioria dos serviços internos precisa.

## NodePort

Abre a mesma porta em todos os nós. Útil para teste; em produção, quase sempre há algo melhor.

## LoadBalancer

Pede um balanceador externo ao provedor. Cada Service desse tipo custa um IP público — para HTTP, prefira um Ingress na frente de vários ClusterIP.

Ver os endpoints reais atrás de um Service:

```bash
kubectl get endpoints <SERVICE-NAME> [-n <NAMESPACE>]
```
