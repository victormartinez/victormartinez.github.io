---
title: "Desenvolvimento Agêntico"
description: ""
maturidade: em-aberto   # em-aberto | revisada
atualizado: 2026-09-27
# ordem: 10        <- opcional: ordena entre as irmãs (sem ela, alfabética)
# publicado: false <- descomente para tirar esta nota do ar
---

## Contexto: o princípio do qual todo o resto decorre

Contexto é toda a informação que você envia para o modelo em uma conversa ou pedido para que ele entenda o que fazer e como responder. A questão principal é que essa informação é quebrada em tokens e possui uma quantidade limite até que você precise criar uma nova janela. O problema de engenharia em questão é otimizar a utilidade desses tokens em relação às restrições inerentes aos LLMs, a fim de alcançar consistentemente o resultado desejado.

**Contexto é o recurso escasso, e a qualidade cai conforme ele enche.** A Anthropic afirma que "conforme o número de tokens na janela de contexto aumenta, a capacidade do modelo de recuperar informação com precisão diminui". Daí surge a Engenharia de Contexto: conjunto de estratégias para manter no fluxo de inferência da LLM um conjunto ótimo de tokens visando obter a maior assertividade possível em relação ao que foi solicitado.

> **Context Rot**: Termo cunhado para descrever o fenômeno em que à medida que a quantidade de tokens aumenta na janela de contexto, existe um decréscimo na habilidade do modelo de lembrar informações.

### Compactação

Prática em que aplica-se uma sumarização do contexto atual e inicia-se uma nova janela com o resumo produzido. Isso permite continuar em uma tarefa de longo prazo ao ponto que reduz a degradação de performance.

No Claude Code o processo comprime os detalhes mais críticos, preservando decisões arquiteturais, bugs não resolvidos e detalhes de implementação enquanto descarta saídas redundantes de ferramentas e de mensagens.

**Dica**: Compactar é seguro quando existe para onde voltar. Se as regras do trabalho estão num plano ou numa SPEC em disco, e existe um jeito de verificar o resultado contra esse artefato, perder o meio da conversa não é fatal. Se o único lugar onde o objetivo existe é a janela de contexto, compactar é perder o objetivo.

Três controles que a maioria não usa:

| Controle | Para quê |
|---|---|
| `/clear` entre tarefas não relacionadas | o antídoto mais barato; reseta a janela inteira |
| `/compact <instruções>` | compactação dirigida, ex.: *"foque nas mudanças de API"* |
| Instruções de compactação no CLAUDE.md | garante que o crítico sobreviva, ex.: *"ao compactar, preserve a lista de arquivos modificados e os comandos de teste"* |

### Memória Agêntica

Técnica em que o agente regularmente escreve notas persistidas em uma memória que vive fora da janela de contexto. Essas notas são recuperadas dentro do contexto quando necessário. Por exemplo, seu agente poderia manter um arquivo NOTES.md colocando dentro dele o progresso de tarefas complexas e as dependências que sem ele seriam perdidas em meio a inúmeras _tool calls_.


### Arquitetura de Subagentes

Ao invés de um agente manter o estado relacionado a um projeto inteiro, sub-agentes especializados podem lidar com tarefas com janelas de contexto limpas. O agente principal coordena a execução de forma a receber desses sub-agentes apenas um resumo destilado do trabalho. Essa prática não só alcança uma clara separação de responsabilidades como também proporciona uma melhoria substancial do resultado quando comparado com resultados obtidos por apenas um agente em atividades complexas.




## 5. Spec-driven: o que sobrevive e o que envelheceu

O vídeo argumenta que o spec-driven clássico — spec → design → tasks atômicas, uma a uma, com gate a cada uma — **chegou ao limite para os modelos atuais**, e que a estrutura hoje mais atrapalha do que ajuda quando você tem um modelo bom. A proposta dele: fundir spec e design num plano só, deixar o modelo implementar do jeito que achar melhor, e cobrar no fim com um checklist forte, verificado por outro agente.

**Isto é a tese dele, não é fato verificado.** O benchmark que a sustenta é próprio, feito sobre a ferramenta da própria empresa. Está declarado abertamente no vídeo, e o código é aberto — mas continua sendo parte interessada medindo a si mesma.

O que dá para separar com segurança:

| Elemento do spec-driven | Status | Fundamento |
|---|---|---|
| Spec escrita antes, em arquivo, fora da janela | **Sólido** | é o "para onde voltar" que torna a compactação sobrevivível; a documentação recomenda spec autossuficiente em arquivo e sessão nova para executar |
| Declarar o que está **fora** de escopo | **Sólido** | prescrito explicitamente na documentação |
| Regras de domínio verificáveis (`given/when/then`) | **Sólido** | é o que permite a verificação final existir |
| Checklist de aceitação verificado por outro agente | **Sólido** | é o padrão de lista de features com status pass/fail do harness da Anthropic |
| Tasks atômicas com gate uma a uma | **Condicional** | é *babysitting*: caro e lento. Justifica-se com modelos que pulam etapas; atrapalha modelos que não pulam |
| Plano que já contém o código a ser escrito | **Contestado** | o vídeo desaconselha, e eu concordo: dê direção e valide depois. Quem implementa deveria saber implementar |
| Spec como **fonte da verdade** do sistema | **Opinião** | o autor diz que não se consolidou, por causa de *drift* entre spec e código. Argumento plausível, não verificado |

O critério operacional que sai disso, e que vale mais que a taxonomia: **a quantidade de estrutura que vale a pena impor é inversamente proporcional à capacidade do modelo de seguir instruções longas sem pular etapas.** Modelo que pula, estruture. Modelo que não pula, dê direção e cobre no fim.

> **Corolário incômodo:** isso significa que seu harness tem prazo de validade. Parte do que você escreve hoje para compensar limitação de modelo vira peso morto na próxima geração. Ver §7.

---

## 6. Paralelismo

**Worktrees** resolvem o problema real: são branches com cópia de trabalho própria, então duas sessões editam sem colidir. Enquanto uma verifica, outra implementa. É o ganho mais imediato de throughput disponível hoje.

Outros padrões documentados:

- **Writer/Reviewer** em sessões separadas — *"um contexto novo melhora a revisão de código porque o Claude não fica enviesado pelo código que acabou de escrever"*. Mesmo fundamento da §4.1, aplicado sem nenhuma ferramenta especial.
- **Fan out** via modo não interativo (`claude -p`) sobre uma lista de arquivos, para migrações grandes.
- **Orquestração multiagente** quando o problema exige mais que isso — ver [workflows.md](workflows.md) para os seis padrões e [workflows-escala-e-custo.md](workflows-escala-e-custo.md) para quando o custo se justifica.

---

## 7. O harness apodrece

A seção que quase nenhum material sobre o assunto tem, e que o vídeo levanta corretamente: **como saber que uma instrução sua virou peso morto?**

Modelos melhoram. Instrução escrita para compensar limitação de um modelo de 2025 é ruído puro num modelo de 2026 — e ruído que você paga em toda janela e que compete pela atenção com as regras que ainda importam.

Rotina de manutenção:

1. **Nível barato, mecânico:** os comandos citados ainda existem? Os arquivos linkados ainda estão lá? As estruturas descritas ainda são essas?
2. **Nível caro, sensível ao modelo:** rode uma avaliação das suas skills e regras **com o modelo que você realmente usa**, perguntando o que é redundante. O resultado muda conforme o modelo muda.
3. **Poda devagar.** Remova pouco por vez e observe se o comportamento muda. Se não mudou, estava sobrando.

No Claude Code, `/doctor` propõe cortes num CLAUDE.md versionado, sugerindo o que é dedutível do código.

---

## 8. Antipadrões

Os cinco primeiros vêm da documentação; os dois últimos, do vídeo.

| Antipadrão | Sintoma | Correção |
|---|---|---|
| **Sessão entulho** | uma tarefa, depois outra sem relação, depois volta pra primeira | `/clear` entre tarefas não relacionadas |
| **Corrigir em loop** | terceira correção do mesmo erro | após duas falhas, `/clear` e reescreva o prompt inicial incorporando o que aprendeu |
| **CLAUDE.md inchado** | ele ignora regras que estão lá | pode sem dó; o que ele já faz certo sem a instrução, delete |
| **Confiar sem verificar** | implementação plausível que não trata os casos de borda | se você não consegue verificar, não faça merge |
| **Exploração infinita** | "investiga isso" sem escopo, trezentos arquivos lidos | escope, ou delegue a subagente |
| **Deixar quem implementou dar a nota** | "tudo funcionando!" e não está | verificador em contexto separado (§4) |
| **Estruturar demais um modelo bom** | task por task, gate por gate, lento e caro sem ganho | ajuste a estrutura ao modelo (§5) |

---

## 9. Divergências: onde o vídeo não bate com a documentação

| Afirmação do vídeo | Status | O que a fonte diz |
|---|---|---|
| A compactação *"joga tudo fora, não escolhe"*, só reinjeta regras e skills | **Errado** | A compactação é seletiva: resume o que mais importa — padrões de código, estado de arquivos, decisões-chave — e descarta o redundante, como saídas de ferramenta já consumidas. Há ainda `/compact <instruções>` e instruções de compactação no CLAUDE.md. Você perde informação, mas não indiscriminadamente |
| ~40% da janela é seguro, 60% aceitável, acima disso a qualidade cai | **Não verificado** | A degradação com o preenchimento é documentada; **nenhum limiar percentual é**. Heurística pessoal do autor |
| *"A cada 100.000 tokens a mais, a qualidade cai"*, citando um paper | **Não verificado** | O fenômeno é real e documentado; a taxa específica não foi confirmada e a fonte não é identificável a partir do vídeo |
| *"Skills tornaram agentes quase obsoletos"* | **Exagero** | São complementares. Subagente = contexto isolado + ferramentas próprias. Skill = conhecimento sob demanda no contexto atual. A escolha depende de qual dos dois problemas você tem |
| TLC Spec Driven supera todos os outros frameworks | **Parte interessada** | Benchmark próprio sobre ferramenta própria, declarado no vídeo. Código aberto e resultados publicados, mas não é avaliação independente |
| Comparações entre Grok 4.6 Fast, Composer 2.5 e Opus para planejar/implementar | **Datado por construção** | Nome e versão de modelo é a informação de menor vida útil em qualquer material sobre IA. O raciocínio (modelo caro para planejar, barato para implementar) sobrevive; a tabela de modelos, não |
| *"Teste de mutação é uma das coisas mais efetivas para testes com IA"* | **Não verificado** | O próprio autor hedge com "dizem que". Não encontrei fonte de primeira mão |
| Spec-driven chegou ao limite; a indústria vai para boards como fonte da verdade | **Opinião** | Leitura de mercado do autor, apresentada como tal. Plausível e não verificada |

---

## 10. Se você for aplicar só três coisas

1. **Dê ao agente uma verificação que ele mesmo rode.** É a diferença entre uma sessão que você assiste e uma da qual você pode sair. Sem isso, "parece pronto" é o único sinal disponível, e você vira o loop de verificação.
2. **Separe pesquisa de implementação por uma fronteira de contexto.** Pesquise amplo, salve num artefato em disco, implemente em janela limpa. O artefato é o que sobrevive à compactação.
3. **Não deixe quem escreveu dar a nota.** Contexto novo, critério explícito, evidência anexada — e instruído a apontar só o que afeta corretude.
