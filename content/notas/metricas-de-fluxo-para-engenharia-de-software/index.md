---
title: "Métricas de Fluxo para Engenharia de Software"
description: ""
maturidade: em-aberto   # em-aberto | revisada
atualizado: 2026-10-03
# ordem: 10        <- opcional: ordena entre as irmãs (sem ela, alfabética)
# publicado: false <- descomente para tirar esta nota do ar
---

Métricas servem para ser um reflexo da nossa realidade e não uma representação de um cenário ideal ou desejável. Medimos para analisar e compreender profundamente o sistema de trabalho, identificar oportunidades de melhoria e apoiar na tomada de decisões com base em dados.

Dentro do universo de gestão de times de tecnologia, podemos falar de quatros pilares e seus respectivos indicadores, vide imagem.

![Infográfico com fundo escuro liso apresentando quatro pilares de métricas de engenharia de software em formato de lista. Cada pilar tem um rótulo verde menta, um título em destaque, um texto de apoio e uma ilustração minimalista de blocos Lego à direita. 1. Eficácia: lista métricas como Taxas de Aquisição, LTV e NPS, acompanhada de blocos empilhados subindo como um gráfico. 2. Qualidade / Excelência Técnica: lista métricas como Índice de Refação e Cobertura de Testes, ao lado de blocos que lembram uma estrutura de análise ou código sendo inspecionado. 3. Eficiência / Performance: lista Lead Time, Cycle Time, entre outros, com uma ilustração de blocos empurrados sobre uma esteira com um relógio. 4. Cultura: lista Turnover, Squad Health Check, entre outros, acompanhada de pequenos avatares de Lego reunidos em círculo ao redor de uma mesa. Marca de água vcrmartinez.com no canto inferior direito.](./pilares.jpg)

⚠️ **Atenção:** Elas **NÃO** existem (e não devem ser usadas) para medir indivíduos, comparar equipes ou estimular vaidade! Individualizar as métricas desencadeia comportamentos individualistas. **Comportamentos individualistas repelem a colaboração**.


## Por quê?



![Imagem isométrica com fundo escuro liso, sem grades, representando três níveis de gestão de software através de ilhas de blocos Lego conectadas por setas. No topo, o rótulo "03 NÍVEL ESTRATÉGICO" acompanha uma pequena plataforma verde menta onde avatares de Lego analisam gráficos. No centro, o rótulo "02 NÍVEL TÁTICO" aponta para plataformas intermediárias com quadros kanban coordenando fluxos de trabalho (Flow X e Flow Y). Na base, o rótulo "01 NÍVEL OPERACIONAL" mostra três grandes plataformas cinza e verde correspondentes a diferentes times (Team 1, Team Z, Team 3), com vários avatares de Lego focados em computadores e quadros de tarefas diárias. Marca d'água vcrmartinez.com no canto inferior direito.](./flight.jpg)

## Fluxo Upstream e Downstream

- Upstream → Característica de alta incerteza. Obtém opções, avalia, refina e fatia.
- Downstream → Característica de baixa incerteza. Converte opções, materializa os compromissos.

![Infográfico sobre fundo escuro ilustrando o fluxo de valor de desenvolvimento de software através de blocos de montar (estilo Lego) em perspetiva isométrica. À esquerda, o texto categoriza o processo em '01 FLUXO UPSTREAM' (com o foco em 'EFICÁCIA') e '02 FLUXO DOWNSTREAM' (com o foco em 'EFICIÊNCIA'). O centro da imagem exibe uma linha do tempo visual construída com blocos roxos e cinzentos. O fluxo começa no 'Ponto de Solicitação', avança pelas etapas de Backlog, Análise de Negócios e Análise Técnica, e chega ao 'Ponto de Compromisso'. A partir daí, inicia o Downstream com as etapas Para Dev, Em Dev, Code Review, Testes e Para Deploy, até chegar a 'Em Produção' e, finalmente, ao 'Ponto de Entrega' (representado por uma caixa de blocos). Pequenos blocos com ícones de relógios e figuras a simular pessoas intercalam as fases, representando respetivamente os tempos de espera e os tempos de trabalho. No rodapé, encontra-se a marca de água vcrmartinez.com](./fluxos-up-down.jpg)

Observe que toda vez que existe um **Handoff** (troca de mão), existe uma fila de espera. A ideia é mapear as filas de espera.

- **Request Point** → Ponto de Solicitação (identificada a demanda para ser feita).
- **Commitment Point** → Demanda deixa de ser uma possibilidade e passa a ser um compromisso. Entrou para o time.
- **Delivery Point** → Em produção.

### Modelagem Demandas

As métricas devem considerar o item que representa algo potencialmente entregável ao cliente final! E não as pequenas partes dele (tarefas). Essas apenas representam a forma como você estrutura, divide e organiza seu trabalho internamente, mas para o seu cliente, é absolutamente irrelevante.

Caso queira visualizar as pequenas partes do seu entregável considere utilizar checklists ou sub-itens. Sempre existirá variabilidade no tamanho dos itens dentro do contexto em que trabalhamos. Mas conseguimos evitar os extremos!

Um framework para conseguir criar cards adequados é o **INVEST**:

1. **I**ndependent
2. **N**egotiable
3. **V**aluable
4. **E**stimable
5. **S**mall
6. **T**estable

### Anatomia de um Card

- Código e Título
- Descrição detalhada. Escreva informações suficientes para guiar o desenvolvimento e validação da demanda. Explore checklists para atividades necessárias, critérios de aceite, evidências de Definition of Ready (DoR) e critérios de Definition of Done (DoD).
- Datas como Request Date, Commitment Date, Fixed Delivery Date e Delivery Date ajudam na gestão da demanda e a gerar métricas posteriormente.
- Pessoa responsável por executar
- Tipo do card (user story, bug, technical debt, incident, etc)
- Link com o Épico
- Link com outros cards que a demanda depende.
- Classe de Serviço (Expedite, Intangible, Standard, Delivery Fixed Date)
- Idade da Demanda desde o ponto de compromisso até o momento atual (aging).
- Flag para sinalizar bloqueio. Aqui também vale registrar informações adicionais como motivo do bloqueio, tempo de bloqueio e até um contador para contabilizar quantas vezes sofreu bloqueio.

![Infográfico isométrico estilo bloco de montar, detalhando a anatomia de um card de issue ágil sobre um fundo escuro e sólido. No centro, um card digital de issue digital exibe dados de exemplo como ID da issue (XPTO-123), título ('Título da demanda'), breve descrição, datas críticas de solicitação e entrega, links de conexão com épicos e dependências, e metadados de estado com ícones e envelhecimento ('Aging: 16 dias'). Uma bandeira vermelha está no topo. Quatro pilares explicativos dispostos ao redor apontam para diferentes seções: '01 IDENTIFICAÇÃO E RESUMO' aponta para o ID e título; '02 DATAS E PRAZOS' aponta para a seção de datas; '03 CONEXÕES E DEPENDÊNCIAS' aponta para os links de épico e dependências; e '04 ESTADO E ATRIBUTOS' aponta para os ícones e metadados de estado e envelhecimento. O texto usa tipografia editorial em cores Giz e Névoa sobre fundo escuro, com rótulos em Menta. Marca d'água discreta 'vcrmartinez.com' no rodapé. O tom é sóbrio e técnico, sem elementos infantis.](./anatomia-card.jpg)
