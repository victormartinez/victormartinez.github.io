---
title: "Arquitetura hexagonal"
description: "Portas, adaptadores e onde a regra de negócio mora."
maturidade: revisada
atualizado: 2026-08-28
---

A ideia central é simples: a regra de negócio não sabe que existe banco, fila, HTTP ou framework. Ela conversa com o mundo por **portas** (interfaces), e cada tecnologia entra por um **adaptador**.

## Portas

Uma porta é um contrato escrito do ponto de vista do domínio: `RepositorioDePedidos`, `NotificadorDeCliente`. O nome diz o que o domínio precisa, não como será feito.

## Adaptadores

Do lado de fora, cada adaptador implementa uma porta com uma tecnologia: Postgres, SQS, um cliente HTTP, um fake em memória para os testes.

> Dica: se o teste da regra de negócio precisa de banco de pé, tem uma porta faltando.

## O que ganha e o que custa

Ganha-se testabilidade e liberdade para trocar tecnologia. Custa-se camadas: em sistema pequeno, o hexágono pode ser mais código do que problema.
