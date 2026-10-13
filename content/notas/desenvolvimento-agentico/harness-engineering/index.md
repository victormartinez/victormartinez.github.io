---
title: "Harness Engineering"
description: ""
maturidade: em-aberto   # em-aberto | revisada
atualizado: 2026-09-27
# ordem: 10        <- opcional: ordena entre as irmãs (sem ela, alfabética)
# publicado: false <- descomente para tirar esta nota do ar
---

Um _harness_ é todo o ecossistema ao redor de um modelo de linguagem (LLM) que o transforma em um agente funcional e confiável. Hoje esse ecossistema é composto pelas ferramentas como Claude Code e Cursor mas também envolve o que você constrói em volta, como Guias e Sensores.

| Categoria | O que é | Exemplos |
|---|---|---|
| **Guias** — dizem para onde ir | instruções e estrutura | CLAUDE.md/AGENTS.md, skills, e **a própria arquitetura do código** |
| **Sensores** — dizem se chegou | sinais determinísticos | testes, lint, type check, CI, hooks, automação de browser |

O insight: **a estrutura do código é parte do harness.** Se o agente entende o código sem que você explique, você não precisa escrever a explicação. Uma boa arquitetura passa a ter um retorno que antes não tinha: menos tokens, menos erro, menos instrução.

### CLAUDE.md / AGENTS.md
São arquivos em formato Markdown colocados na raiz de um repositório de código para orientar os agentes. Devem conter comandos exatos de execução, regras claras de arquitetura e critérios objetivos de término de tarefas, evitando prosa excessiva ou orientações vagas.

| ✅ Entra | ❌ Não entra |
|---|---|
| Comandos que ele não teria como adivinhar | Qualquer coisa dedutível lendo o código |
| Estilo que **diverge** do padrão da linguagem | Convenções padrão que o modelo já conhece |
| Estratégia de teste e runner preferido | Documentação de API (aponte o link) |
| Etiqueta do repositório (branch, PR) | Informação que muda com frequência |
| Decisões de arquitetura do projeto | Descrição arquivo a arquivo do codebase |
| Peculiaridades do ambiente (env vars) | Obviedades tipo "escreva código limpo" |

**Atenção**: se o agente insiste em ignorar uma regra sua, o arquivo provavelmente está longo demais e a regra se perdeu no ruído. A documentação é explícita: um CLAUDE.md inchado faz o modelo ignorar metade dele. Enfatizar tudo é não enfatizar nada.

> Você vai se deparar com o cenário em que uma instrução nesses arquivos vai ter exemplos suficientes no código. Quando isso acontecer, essa instrução pode ser removida do arquivo uma vez que ela é dedutível do código.

### Skills: conhecimento sob demanda, em três níveis

Confirmado na documentação, com precisão maior que a do vídeo:

| Nível | O que é | Quando carrega |
|---|---|---|
| 1 | `name` + `description` do frontmatter | **sempre**, no system prompt |
| 2 | corpo do `SKILL.md` | quando o modelo julga relevante |
| 3 | arquivos referenciados pela skill | conforme ele navega |

Isso é **progressive disclosure**, e é o mecanismo que torna viável ter muitas skills instaladas: até ser acionada, uma skill ocupa apenas nome e descrição.

Consequências operacionais:

- **A `description` é a interface.** É o único texto que o modelo lê para decidir se carrega a skill. Descrição vaga = skill que nunca dispara, ou que dispara na hora errada.
- **Regra de partição:** o que vale **sempre** vai para CLAUDE.md; o que vale **às vezes** vira skill. A documentação diz isso literalmente.
- **Skill é código de terceiro rodando no seu sistema.** É um prompt injetado no seu agente. O alerta do vídeo sobre "skill lixo" é legítimo e merece o mesmo escrutínio de uma dependência.

> ⚖️ **Onde discordo do vídeo.** Ele afirma que *"skills tornaram agentes quase obsoletos"*. A documentação trata os dois como complementares, com distinção clara: **subagente = contexto isolado e conjunto próprio de ferramentas; skill = conhecimento carregado sob demanda no contexto atual.** Quando o problema é *"isso vai poluir minha janela"*, a resposta é subagente. Quando é *"não quero redigitar estas instruções"*, é skill. Ele tem razão que skills cobrem mais casos do que se imaginava; "obsoleto" é exagero.

### 2.3 Hooks: quando precisa ser garantido

A distinção que fecha a seção, e está na documentação: **instruções em CLAUDE.md são consultivas; hooks são determinísticos.** Se algo precisa acontecer toda vez, sem exceção, não escreva uma regra — escreva um hook.

---
