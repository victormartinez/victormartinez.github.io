---
title: "Networking no Kubernetes"
description: "Como o tráfego chega no pod: CNI, Service, Ingress."
maturidade: em-aberto
atualizado: 2026-09-20
---

Nota em construção. O objetivo é fechar o caminho completo de uma requisição, da borda até o container.

## O caminho de uma requisição

Cliente → DNS → LoadBalancer → Ingress → Service → Endpoint → Pod. Cada salto tem um objeto do Kubernetes e um lugar para dar errado.

## CNI

O plugin de rede dá IP para cada pod e garante que qualquer pod fale com qualquer pod sem NAT. No GKE o padrão é o dataplane do próprio Google; em cluster próprio, Calico ou Cilium.

> Dica: quando dois pods no mesmo nó não se enxergam, o problema quase sempre é NetworkPolicy, não CNI.

## Ingress

Um só ponto de entrada HTTP para vários Services. O controller (nginx, GCE) é quem de fato abre a porta.
