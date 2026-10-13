---
title: "Segurança no ciclo de vida da aplicação"
description: ""
maturidade: em-aberto   # em-aberto | revisada
atualizado: 2026-10-03
# ordem: 10        <- opcional: ordena entre as irmãs (sem ela, alfabética)
# publicado: false <- descomente para tirar esta nota do ar
---


## Padrões de Segurança

- NIST Secure Software Development Framework
- CIS Controls
- OWASP Application Security Verification Standard (ASVS)

Estratégia: a direção tomada para alcançar uma visão.
Roadmap: visualização do plano estratégico. Pode ser um guia para priorização do trabalho, alocando recursos e acompanhando dependências.

Sua estratégia e roadmap deveriam incluir milestones e checkpoints como: (i) control gate; (ii) critérios de break/build.

#### Documentação de Segurança
A documentação precisa considerar: framework usado, processos e práticas aplicadas de segurança, testes de segurança. Além disso, ela deveria incluir: objetivo, escopo, compliance, padrões e processos, owner do documento, aprovador do documento, data efetiva, última data de revisão.

#### Métricas de Segurança
Medem o quanto a cibersegurança da organização está alcançando e mantendo o compliance. Os principais KPIs são: nível de criticidade, tempo médio de remediação e complexidade.

É importante definir objetivos, KRs e medir esses resultados para que seja possível avaliar se a estratégia está funcionando ou não.

#### Desativação de Aplicações
É importante definir políticas de EOL (end of life), como: remoção de credenciais, remoção de configuração, cancelamento da licença, arquivamento, SLA, NIST 800-160v2r1 para descarte. Crie um documento relacionado ao descarte de dados, incluindo: retenção, destruição e dependências. O NIST SP800-88 cobre aspectos de segurança e sanitização de mídia.

#### Mecanismos de Report
Ajudam a menter os _stakeholders_ cientes dos riscos da missão da organização. Ajudam a apoiar decisões baseadas em risco em um nível organizacional. Esses mecanismos incluem: relatórios, dashboard e loops de feedback.

Nem todos os dados são os mesmos, você pode ter dados que ficam disponíveis publicamente enquanto que outros requerem controle de informações sensíveis.

#### IRM: Integrated Risk Management
Grupo de práticas e processos, apoiado por uma cultura _risk-aware_ e tecnologias, que melhora a tomada de decisão por meio de uma visão integrada de quão bem uma organização gerencia seu conjunto de riscos. Aqui é preciso fazer uma avaliação e análise de risco, ferramentas e uma matriz de probabilidade versus impacto.

Processo:
- Identifique os riscos
- Analise os riscos
- Ranqueie 
- Trate o risco
- Monitore e revise

O modelo SEI (Software Engineering Institute) de gestão contínua de risco sugere o modelo iterativo: identifique, analise, planeja, monitore, controle.

Uma fez feito todo o processo, você tem algumas opções para lidar com o risco: reduzir (implementando medidas), atribuir (contratando um seguro), aceitar (entender e conviver com ele) ou evitar (escolhendo não se envolver com aquela atividade).

#### Práticas de Operações de Segurança

- Processo de gestão de mudanças
- IRP (Incident Response Plan)
- Processo de Verification and Validation (V&V)
- Processo de Assessment and Authorization (A&A)
