---
layout: post
title: Acelerando seu onboarding
category: Carreira
date: 2023-01-17T00:00:00
tags: [carreira, manual, escrita, onboarding]
image: featured.jpeg
image_url: https://unsplash.com/photos/5uUErSi29js
image_author: Denny Ryanto

---
*TLDR;* diminua a fricção no seu onboarding criando um Manual de Sobrevivência.

Por mais que você seja experiente entrar em uma empresa nova é sempre desconfortável. No novo local de trabalho você precisa conhecer novas pessoas, absorver uma nova cultura, estudar sobre um novo mercado de atuação e se familiarizar com a parte técnica (ferramentas, processos, tecnologias do dia-a-dia, etc). Além disso, se você for uma pessoa **ansiosa** e **excessivamente preocupada**, então os primeiros meses tendem a ser angustiantes devido a uma cobrança interna muito grande.

Ao longo dos anos adotei o hábito de criar um documento que anotava tudo que julgava necessário. Isso me ajudava tanto na parte emocional como técnica. Hoje compartilho com vocês como criar o seu **Manual de Sobrevivência (MS)**.

## O que?

O Manual de Sobrevivência é um documento que condenso tudo o que é preciso saber para exercer o meu trabalho no dia-a-dia. Como programador, por exemplo, eu preciso estar a par de como funciona o processo de deploy adotado pela empresa, quais comando são úteis no dia-a-dia, dicas de como debugar uma determinada aplicação, etc. Esse documento está em constante atualização e à medida que os meses passam eu adiciono novas informações.

## Por que?

Alguns motivos pelos quais é importante ter esse documento:

1. **Sua memória vai falhar:** No primeiro mês de trabalho é comum receber um montante de informações e provavelmente absorver pouca coisa. O MS ajuda a documentar o que é essencial saber e para times que não possuem documentação isso pode ser um pontapé para criar uma base de conhecimento para novos engenheiros.
2. **Autonomia:** No começo é natural termos ajuda de um ou mais colegas e a disponibilidade deles pode ser incerta. Ao criar esse doc você cria uma base de conhecimento para consultar sempre que precisar.
3. **Segurança Psicológica:** Por ainda estar em processo de aprendizagem, muitas vezes ficamos inseguros em executar um comando, fazer deploy ou seguir determinada prática. Documentar ajuda a endereçar aquela dúvida para quem fica inseguro: “será que eu estou fazendo do jeito certo?”.
4. **Aprendizagem:** Ao documentar você acelera o seu aprendizado. Simples assim.
5. **Dicas:** Por mais que a empresa possua tudo documentado, inevitavelmente você vai se deparar com comandos/fluxos/procedimentos facilitadores que não estão documentados. Pode ser aquele comando que seu colega usa constantemente ou mesmo um jeito mais fácil de fazer as coisas. Pescou no ar alguma dica? Anote!

## Como?

Agora que você já entendeu o objetivo e a motivação, é hora de criar o seu próprio manual:

1. Escolha uma ferramenta do seu gosto (*e.g.* Notion, Google Docs, Evernote, Notes, etc).
2. Nos primeiros meses, deixe-a aberta e anote tudo o que achar relevante.
3. Semanalmente revisite o documento para deixar mais sucinto e objetivo.
4. Dedique alguns minutos/horas semanais para organizar o documento em blocos que façam sentido.

## Um boilerplate para você seguir

A seção anterior é um pouco abstrata então resolvi colocar aqui um boilerplate para que você possa seguir. Meus Manuais de Sobrevivência não seguem um padrão específico mas todos possuem um conjunto de tópicos que me permitem consultar rapidamente um determinado assunto. Um bom começo pode ser o modelo abaixo.

```markdown
💻 Manual de Sobrevivência da Empresa XYZ

**Descrição da Empresa**
A XYZ é uma startup de tecnologia voltada para o agronegócio.
Por meio do seu marketplace web ela conecta pessoas interessados 
em comprar e vender (i) produtos, (ii) animais e (iii) terrenos.

**Descrição do Time**
O Time de Payment é responsável por manter e evoluir o fluxo de pagamento 
do cliente desde quando ele coloca um produto no carrinho até o momento em 
que a transação financeira é consolidada.

**Sistemas**
- Sistema 1: <responsabilidade_1>
- Sistema 2: <responsabilidade_2>
- Sistema 3: <responsabilidade_3>

**Sistema 1**
- Explicação
- Arquitetura
- Repositório

**Sistema 2**
- Explicação
- Arquitetura
- Repositório

**Sistema 3**
- Explicação
- Arquitetura
- Repositório

**Comandos Úteis**
- Logs da Aplicação: `kubectl logs -f svc/api-app`
- Acessar um POD: `kubectl exec -it <pod-name> -- /bin/bash`

**Passos para fazer o Deploy**
1. <Passo 1>
2. <Passo 2>
3. <Passo 3>
4. <Passo 4>

**Links Importantes**
1. <titulo_1>: <link_1>
2. <titulo_2>: <link_2>
3. <titulo_3>: <link_3>

**Como fazer rollback?**
...

```

## Estendendo o Boilerplate

O boilerplate acima foca no meu universo (programação) mas você adaptá-lo para a sua área. É apenas com começo e existem diversos tópicos que você pode adicionar:

- Quais métricas mais importantes para o meu negócio e/ou aplicação?
- Como investigar problemas de forma assertiva?
- Quais principais causas de erro no ambiente de produção e como endereçar?

O mais importante é que você comece o quanto antes. Tenho certeza que seu processo ficará muito mais fácil se você tomar a iniciativa de documentar o que achar necessário.
