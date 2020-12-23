---
layout: post
title: "Dicas para desafios técnicos"
category: Career
tags: [career, technical, coding, challenges]
date: "2019-04-28T00:00:00"
image: featured.jpg
image_author: Fabian Grohs
image_url: https://unsplash.com/photos/dMUt0X3f59Q
language: pt
---

É comum que engenheiros / programadores / desenvolvedores de software enfrentem um desafio técnico / de codificação nos processos de recrutamento. O desafio consiste em tarefas de programação projetadas para avaliar candidatos, principalmente, em relação às hard skills (por exemplo, habilidade de programação, arquitetura de software, etc.) Normalmente, o processo é composto por três fases: (i) especificação; (ii) desenvolvimento; (iii) revisão. Existem idiossincrasias e dicas para cada um deles.

Depois de passar por desafios de codificação e, principalmente, avaliar alguns deles na [Onyo](www.onyo.com), decidi escrever este post e compartilhar algumas lições que aprendi.

## Especificação

O candidato recebe um e-mail ou documento especificando o escopo do desafio. Geralmente são listados os requisitos, restrições e o que fazer / não fazer. Se você for um desenvolvedor back-end, por exemplo, pode ser solicitado desenvolver uma API REST / GraphQL, um SaaS ou uma integração com um terceiro. **O segredo do sucesso é estar muito atento ao que você precisa fazer. O planejamento é vital.**

### Leia atentamente as especificações

Não assuma nada a respeito do que você tem que fazer. Reserve um tempo para ler cada linha do documento e preste atenção **aos requisitos**.

### Planeje a execução

Em primeiro lugar, diferencie o que é **obrigatório** do que é **bom / extra**. Além disso, pense em quais bibliotecas você vai usar e como vai arquitetar seu código. É importante traçar um plano em relação aos seus resultados e estabelecer etapas / fases que serão iteradas, por exemplo: (i) montagem do projeto; (ii) CRUD; (iii) lógica de negócios 1; (iv) lógica de negócios 2; e assim por diante. Dessa forma, você reduz o risco de não realizar um projeto em execução.

### Alguma dúvida? Pergunte!

A especificação não deve ter ambigüidades, mas nem sempre é assim. Sinta-se à vontade para questionar qualquer coisa que você não tenha entendido.

### Não tenha medo de negociar o prazo

Os prazos são complicados em qualquer processo de recrutamento porque diversos fatores podem influenciar a rapidez com que se desenvolve a solução: (i) a sua proficiência na linguagem de progração / plataforma / etc; (ii) se você já está empregado e o fará em seu tempo livre; (iii) seu conhecimento sobre o domínio do problema. Se a empresa estabelece o prazo, não tenha medo de expor seu contexto e negociar o prazo.

## Desenvolvimento

Depois de ler a especificação e planejar a execução, é hora de colocar a mão na massa. Existem muitas dicas para ficar de olho.

### KISS (Keep it simple, stupid!)

Evite tanto quanto possível o excesso de engenharia e abstrações desnecessárias. Seu código deve ser fácil de seguir. Problemas difíceis geralmente exigem soluções simples.

### Docs (README)

É obrigatório um bom README. Certifique-se de explicitar: (i) como executar o código; (ii) como usar ou interagir com ele; (iii) como executar os testes; (iv) onde você disponibilizou (se você fez deploy em algum lugar).

### Commits

Use frases significativaas para seus commits. O revisor verificará seus commits para analisar como você concebeu a solução.

### Use boas práticas

- Favorecer abstrações que fizerem sentido
- Don't Repeat Yourself (DRY)
- Siga os princípios de SOLID
- Composição sobre herança
- Modularização
- Coesão
- etc.

As boas práticas podem ser resumidas em:

1. Separe as responsabilidades em diferentes componentes
2. Não espalhe a lógica de negócios
3. Use as convenções de sua linguagem de programação
4. Nomeie as coisas corretamente (classes, variáveis, etc)
5. Use comentários apenas em partes críticas
6. Evite engenharia excessiva e abstrações desnecessárias

### Nomenclatura

**Certifique-se de que seu código seja semântico.** Classes, variáveis, funções, métodos devem ser nomeados corretamente de forma que o leitor compreenda facilmente o propósito.

### Testes

Escreva pelo menos testes de unidade e disponibilize-os para execução a qualquer momento. Atingir uma alta porcentagem de cobertura de código pode ser difícil. Portanto, certifique-se de cobrir pelo menos as partes críticas de seu desafio.

### Tenha cuidado com o trabalho extra

Alguns candidatos decidem impressionar os recrutadores implementando funcionalidades extras. Tenha cuidado com isso porque você pode arriscar seu desafio ao não concluir o que importa: a solução de acordo com a especificação.

### Faça funcionar, teste e refatore

Não gaste muito esforço em fazer a melhor solução no início. Em vez disso, (1) crie uma solução simples, (2) teste e (3) refatore.

## Revisão

Finalmente, é hora de revisar seu código. Nesta fase a empresa pode te pedir (ou não) para apresentar a solução. Em qualquer caso, seu código será revisado e é importante que você **esteja aberto a críticas construtivas e ter em mente as decisões técnicas que você tomou.**

### Seja humilde

Independentemente da sua posição (estagiário, júnior, pleno ou sênior) **ser humilde é o comportamento mais inteligente que você pode adotar**. Sua solução: (i) pode ter falhas; (ii) não cobrir alguns aspectos; (ii) pode ser melhorada; (iv) não estar preparada para uma situação específica. **Tudo bem!** Aceite as críticas construtivas e tenha em mente que programação é um caminho de aprendizado constante.

### Não finja

Não finja saber algo que você realmente não sabe, porque você pode ser questionado sobre coisas que não será capaz de responder e criar uma atmosfera de desconfiança.

### A comunicação é importante

Você ganha pontos dependendo da forma como apresenta a solução. Uma boa abordagem é dar uma visão geral da solução e, depois disso, entrar nos detalhes do que é importante (por exemplo, lógica de negócios). Durante esse momento, explique sobre as decisões técnicas que você tomou.

### Questões importantes para manter em mente

Muitas perguntas podem ser feitas na revisão: O que poderia ser melhorado? O que você faria de diferente? A sua solução é escalável? O que você não gostou em relação à sua implementação?

É bom estar preparado para eles e refletir sobre o que você poderia fazer melhor.
