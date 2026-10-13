---
title: "Fluxo de Trabalho RPI"
description: ""
maturidade: revisada   # em-aberto | revisada
atualizado: 2026-09-27
# ordem: 10        <- opcional: ordena entre as irmãs (sem ela, alfabética)
# publicado: false <- descomente para tirar esta nota do ar
---

É um ciclo de vida de engenharia estruturado e orientado a agentes, projetado para impedir que assistentes de codificação de IA gerem "código de má qualidade" especulativo, impondo resultados verificados e baseados em evidências.

RPI é um acrônimo para `research` - `plan` - `implement` mas que trouxe depois o `verify` como forma de forçar os agentes a priorizarem fatos verificados.

### Research (explorar - pesquisar)

Fase de abrir o leque: leitura ampla, links, referências, busca no codebase. É aqui que a janela grande é útil e o ruído é aceitável.

**Delegue a exploração a subagentes.** Eles rodam em contexto próprio e devolvem um resumo condensado. O trabalho pesado de leitura acontece fora da sua janela; só a conclusão entra.

**Atenção**: É o antídoto do antipadrão da *exploração infinita* que pede para o agente "investiga isso aí" sem escopo e vê o agente ler trezentos arquivos dentro da sua janela principal.

### Plan (planejar)

Plan mode separa exploração de execução. Iterar sobre um plano é muito mais barato que iterar sobre código já escrito. Corrigir uma spec custa tokens; corrigir uma implementação custa tokens, retrabalho e revisão.


> Plan mode tem overhead. Para tarefas de escopo claro e correção pequena, peça direto. **Se você consegue descrever o diff em uma frase, pule o planejamento.**

Planejar compensa quando você está incerto da abordagem, quando a mudança cruza vários arquivos, ou quando você não conhece o código que vai mexer.

**Deixe o agente te entrevistar.** Prática recomendada na documentação e ecoada no vídeo: em vez de escrever a spec, peça para ser entrevistado — uma pergunta por vez, porque uma pergunta frequentemente depende da resposta anterior. O agente pergunta o que você não pensou: casos de borda, trade-offs, UI/UX.

**O que faz uma spec boa** (formulação da documentação): ela é autossuficiente — nomeia os arquivos e interfaces envolvidos, declara o que está fora de escopo, e termina com um passo de verificação ponta a ponta que prova que a feature funciona. O formato `given/when/then` serve bem: regra de domínio escrita assim é regra verificável depois.

### Implement

Terminado o plano, **abra uma sessão nova para implementar.** A janela do planejamento está cheia de exploração que não serve mais — e pior, serve de distração. Construir ali é começar a implementação perto da compactação.

### Verificação

Essa é a parte que quase todo mundo pula. Existe uma tendência do agente, principalmente para tarefas longas, de marcar uma entrega como completa sem testar adequadamente. O remédio é claro: separar o agente implementador do agente que revisa. Um revisor em **contexto novo** vê apenas o diff e os critérios que você deu, não o raciocínio que produziu a mudança, e por isso o agente que faz o trabalho não é o que dá a nota.

Se a **se a missão do agente é implementar, ele vai otimizar para implementar — e vai declarar pronto.** Não é desonestidade; é o objetivo dele.

#### Quatro níveis de trava, do mais barato ao mais forte

| Nível | Mecanismo | Custo de setup | Quando usar |
|---|---|---|---|
| 1 | Pedir no próprio prompt: *"rode os testes e itere até passar"* | zero | qualquer tarefa, hoje |
| 2 | `/goal` — um avaliador separado re-checa a cada turno até a condição resolver | baixo | sessão inteira com critério objetivo |
| 3 | **Stop hook** — script que bloqueia o fim do turno até passar | médio | o que não pode escapar nunca |
| 4 | **Subagente adversarial** ou workflow — modelo novo tenta refutar o resultado | médio | antes de considerar pronto |

O nível 1 funciona em qualquer lugar. Os níveis 2 e 3 são o que permite uma execução não assistida terminar certa sem você olhando.

#### Evidência, não afirmação

Exija a saída do teste, o comando rodado e o que ele retornou, o screenshot do resultado. **Revisar evidência é mais rápido que refazer a verificação** — e funciona para sessões que você não acompanhou.

Para front-end, dê ao agente um alvo visual e a capacidade de tirar screenshot e comparar. *"Implemente este design, tire um screenshot do resultado, compare com o original, liste as diferenças e corrija."*

> Use automações de browser, como Playwright, para validar se a entrega foi feita corretamente. Contudo, vale pontuar que teste end-to-end é caro, lento e frágil de manter. Você pode estipular estratégias para validar enquanto desenvolve, mas não necessariamente precisa fazer parte do pipeline.

#### Atenção os problemas encontrados

Um revisor instruído a achar problemas **vai achar** — inclusive quando o trabalho está correto, porque foi isso que você pediu. Perseguir todo achado leva a over-engineering: camadas de abstração desnecessárias, código defensivo, testes para casos impossíveis.

O contrapeso: **instrua o revisor a apontar apenas o que afeta corretude ou os requisitos declarados**, e trate o resto como opcional.
