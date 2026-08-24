---
title: "O que a IA acelerou e o que encareceu"
date: 2026-08-24
description: "A conta completa de colocar IA num time de engenharia: onde o ganho foi real, onde o custo apareceu e o critério que ficou."
category: Engenharia
---

Numa terça, um dev do time abriu um PR de umas novecentas linhas antes do almoço. Feature inteira, testes junto, descrição bonitinha. Todo mundo achou ótimo.

O PR foi para produção na sexta. [CONFIRMAR: tamanho aproximado do PR e dias em fila no caso real]

Ninguém tinha travado nada. Não houve briga, não houve bug escandaloso, não houve discussão de arquitetura. O código simplesmente ficou parado esperando alguém com cabeça fresca o suficiente para ler novecentas linhas que outra pessoa não tinha escrito de verdade.

Foi ali que eu entendi que a gente estava medindo a coisa errada. A parte que ficou rápida era a parte que já era barata.

## O que acelerou

Vou começar pelo lado bom, porque ele existe e é grande.

O ganho apareceu inteiro no começo das coisas. A primeira versão de qualquer coisa. O teste chato que todo mundo empurra com a barriga. A migração mecânica de um formato para outro. O script que roda uma vez na vida e ninguém quer escrever. Aquele trecho de glue code entre dois serviços que não tem nenhuma decisão interessante dentro.

O caso mais claro foi uma migração de contratos entre dois serviços, dessas que ninguém defende em reunião e todo mundo adia. A estimativa antiga era de duas semanas de trabalho de uma pessoa. Saiu em dois dias, revisão incluída. [CONFIRMAR: estimativa e tempo real da migração no caso] O trabalho era mecânico, o critério de "está certo" era objetivo e existia teste para provar. Três condições que quase nunca aparecem juntas no resto do dia.

Também acelerou uma coisa que eu não esperava: entrar em código alheio. Chegar num módulo de quatro anos atrás e conseguir uma explicação decente em dois minutos, em vez de meia hora de leitura, mudou o custo de mexer em legado. Isso vale dinheiro e ninguém fala.

Nessas partes o ganho foi imediato e sem trade-off que eu tenha conseguido enxergar. Ninguém no time sentiu falta de digitar boilerplate. Ninguém pediu para voltar.

Se a história parasse aqui, seria propaganda.

## Onde a conta chegou

A conta chegou na review, e chegou rápido.

A matemática é chata de tão simples. A gente aumentou a vazão de uma etapa e manteve a capacidade da etapa seguinte. Mais código entrando na mesma banca de revisores dá fila. E fila muda o comportamento do revisor, não só o calendário dele.

Revisor com quatro PRs abertos começa a revisar por reconhecimento de padrão. Bate o olho, parece certo, aprova. E o erro que a IA produz melhor é exatamente esse: o que parece certo. Não é o `NullPointerException` óbvio. É o `retry` que ela colocou num lugar onde retry duplica cobrança. É a regra de negócio esquisita da sua empresa, aquela que só faz sentido por causa de um acordo de 2019, reescrita de um jeito lindo e errado.

Teve um segundo custo, mais sutil, que demorei mais para nomear: o autor parou de saber explicar o próprio PR. Perguntar "por que você fez desse jeito aqui?" e ouvir "foi assim que veio" é uma resposta nova no nosso ofício. Em revisão isso é um atrito. Às três da manhã, num incidente, isso é caro.

E teve um terceiro custo que eu ainda não sei medir, então vou só deixar registrado: gente júnior aprende escrevendo ou revisando? Se aprende escrevendo, a gente acabou de tirar do time o exercício que formava as pessoas. Eu não tenho dado nenhum sobre isso. Tenho desconforto, que não é a mesma coisa.

## O gargalo mudou de casa

O efeito mais útil da IA no time que eu liderei não foi velocidade. Foi diagnóstico.

Quando a etapa de escrever encolhe, tudo que estava escondido atrás dela aparece de uma vez. A fila de review. O ambiente de homologação que duas squads disputam. O deploy que depende de uma pessoa específica estar acordada. O requisito que chega pela metade e volta para o produto três vezes antes de virar código.

A gente achava que o problema era capacidade. Não era. Era espera. Quando finalmente parei para olhar quanto tempo uma tarefa passava parada versus quanto tempo ela passava sendo trabalhada, o desequilíbrio era constrangedor: a maior parte do lead time era fila, não trabalho. [CONFIRMAR: proporção medida entre tempo parado e tempo trabalhado no caso real]

A IA não criou nada disso. Ela só tirou a desculpa. Enquanto escrever era lento, dava para dizer que o time era pequeno. Depois, não deu mais.

Esse número, aliás, é o único que eu recomendo alguém medir antes de discutir ferramenta. Não é difícil: pega dez tarefas fechadas no mês passado e marca, em cada uma, quanto tempo ela ficou esperando alguém. Uma tarde de trabalho chato. O resultado costuma encerrar a discussão sozinho.

É por isso que eu fico desconfiado quando alguém me diz que adotou IA e o lead time não mexeu um milímetro. Não mexeu porque nunca foi digitar o problema. A ferramenta funcionou perfeitamente e aumentou o estoque na frente do gargalo, que é a definição de trabalho desperdiçado.

## O que a gente mudou

Nada do que funcionou foi ferramenta. Foi processo, e foi sem graça:

- **PR menor, com escopo declarado.** Se a IA escreve mais rápido, o PR encolhe em vez de crescer. Novecentas linhas viram três PRs de trezentas, e os três sobem antes de o primeiro grandão ser lido.
- **A descrição diz o que veio da IA e o que a pessoa mudou.** Não é polícia nem vergonha. É contexto para o revisor saber onde apertar. Muda a review de "está bonito?" para "isso aqui alguém pensou?".
- **Tempo de review protegido na agenda, tratado como entrega.** Enquanto revisar for o que se faz nas frestas do dia, a fila volta em duas semanas.
- **A regra do "você revisaria isso sozinho?".** Se a pessoa não consegue julgar a saída, não economizou tempo. Adiou o custo, com juros.

O que não funcionou: métrica de adoção. Medir quantos por cento do código veio de IA é um número que não decide nada e faz todo mundo jogar para a plateia. A gente parou.

## O que eu não sei

Minha amostra é pequena: um time, um produto, um contexto. Produto com regra de negócio densa, base legada relevante, gente experiente na maioria. Se o seu time é de cinco pessoas num produto novo sem usuário, quase nada disso se aplica do mesmo jeito.

Não sei qual é o custo de manutenção, daqui a dois anos, do código que a gente aceitou porque parecia certo numa sexta às seis. Suspeito que exista. Não tenho como provar.

Não sei o efeito real na formação de gente pleno. Já disse acima e repito porque é a parte que mais me incomoda.

E não sei responder se compensa. Depende do que trava no seu funil. Se trava em escrever, compensa muito e rápido. Se trava em decidir, em revisar, em aprovar ou em subir, você vai comprar velocidade para a etapa errada e ainda vai achar que o problema é falta de disciplina do time.

## O critério que ficou

No fim, o que sobrou cabe em duas ideias.

Use IA de verdade no que você conseguiria revisar sozinho. Onde o time tem repertório de sobra, solta a rédea. Onde o erro é caro e silencioso, IA com dupla humana, sempre.

E antes de escolher qualquer ferramenta, responda uma pergunta que não tem nada de tecnológico: onde o trabalho fica parado aqui? Se a resposta for review, ambiente ou aprovação, escrever mais rápido não vai te ajudar. Vai só deixar a fila mais bonita.

Essa é a conta que eu paguei. Estou genuinamente curioso sobre a sua: onde a IA cobrou o preço no seu time, e você conseguiu ver isso a tempo?
