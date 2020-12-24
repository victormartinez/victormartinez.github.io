---
layout: post
title: Do Jekyll para o Gatsby
category: Web Development
date: 2020-12-24T00:00:00
tags: [gatsby, javascript, react]
image: featured.png
language: pt
---

Durante os útlimos meses eu tenho estudado desenvolvimento front-end e um dos primeiros projetos para praticar foi migrar meu site do [Jekyll](https://jekyllrb.com/) para o [Gatsby](https://www.gatsbyjs.com/). Só por isso eu já achei a migração vantajosa mas acabei descobrindo outros benefícios à medida que eu desenvolvia as funcionalidades do site.

## Requisitos

Eu acredito que a melhor ferramenta para manter um site é o Wordpress. Porém, quem escolhe geradores de sites estáticos não quer se preocupar com: (i) hospedagem; (ii) banco de dados; (iii) manutenção de plugins / terceiros.

Além disso, no meu caso, eu queria usar o [Github Pages](https://pages.github.com/) pela praticidade da ferramenta e por me permitir focar mais no texto do que com a gestão do blog.

## Vantagens

Para mim, algumas vantagens ficaram bem claras:

1. **Praticar desenvolvimento front-end**

   Neste site eu tive contato com React, Styled Components, HTML, CSS, Vanilla Javascript, Media Queries (e responsividade) e GraphQL.

   Aqui cabe o _disclaimer_: um desenvolvedor não front-ender pode sentir dificuldade pois é necessário entender (ainda que minimamente) de diversas tecnologias que talvez em outra ferramenta esteja presente de forma transparente.

2. **Plugins poderosos**

   O Gatsby tem [plugins](https://www.gatsbyjs.com/plugins) muito poderosos que permitem trabalhar com: PWA, Internacionalização, Otimização de Imagens, Performance, e um muito mais!

3. **Build separado do Github Pages**

   Como o Github Pages faz o build do seu site criado com Jekyll, por questões de segurança ele não aceita alguns plugins e, com isso, você fica um pouco limitado. Isso não acontece com o Gatsby porque você executa o build e só disponibiliza a pasta `public` para o Github Pages. Assim, como o output é apenas HTML, CSS e Javascript, seu site dificilmente terá alguma incompatibilidade com o Github.

4. **Internacionalização**

   Com o Jekyll eu tive muita dificuldade em criar um blog que suportasse dois idiomas até que desisti da ideia. Com o Gatsby, encontrei plugins e materiais que me ajudaram bastante no processo e, hoje, finalmente, tenho um site com dois idiomas.

5. **Alta possibilidade de customização**

   Como o Gatsby utiliza React, você pode criar seus próprios componentes. Por exemplo, criei um componente que exibe um alerta caso a postagem seja muito antiga.

6. **Aplicabilidade no mercado**

   Eu confesso que não me sentia motivado a estudar como o Jekyll funcionava pois não via aplicabilidade prática no mercado. Já o Gatsby, por ser mais recentes, te coloca em contato com diversas tecnologias utilizadas no mercado (vide o primeiro item desta listagem).

7. **Performance**

   É nítida a preocupação que o Gatsby tem com performance. Isso vai desde fazer o prefetch das páginas enquanto o usuário navega até o uso de plugins que otimizam imagens para a web.

E aí, o que achou do site? Críticas e sugestões são bem-vindas!
