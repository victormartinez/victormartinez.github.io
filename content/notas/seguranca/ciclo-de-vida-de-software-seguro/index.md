---
title: "Conceitos e Princípios de Segurança de Software"
description: ""
maturidade: em-aberto   # em-aberto | revisada
atualizado: 2026-10-01
# ordem: 10        <- opcional: ordena entre as irmãs (sem ela, alfabética)
# publicado: false <- descomente para tirar esta nota do ar
---

A ideia é ter expertise para adotar práticas de segurança em todas as fases do ciclo de vida do desenvolvimento de software.

## Conceitos

```
* CIA: Confidencialidade, Integridade e Disponibilidade (Availability).
* Deterrent controls: ameaças
* Detective controls: attacks.
* Corrective controls: fix damage after exploited vulnerability or incident.
* Compensating controls: defense in depth; act when the primary set of security controls has failed.
```

### Confidencialidade
Envolve segurança e privacidade protegendo informações sensíveis de uma divulgação não autorizada. Garante que apenas usuários ou processos autorizados podem acessar a informação. É um tema comumente associado com máscara, hashing e criptografia como, por exemplo, mascarar algumas partes do SSN ou criptografar o disco.

### Integridade
Garante que a informação está completa, acurada e confiável; não está corrompida ou alterada de forma acidental ou maliciosa; a informação pode ser modificada ou destruída apenas por usuários ou processos autorizados. Alguns cenários envolvem o uso de hashing, check sums e assinaturas digitais.

### Disponibilidade
Garante que sistemas e informações estão disponíveis para usuários e processos autorizados quando necessário. Exemplos incluem unidades RAID, clusters de servidores e redundância de conexão com a internet. Alguns termos tem relação próxima com o tema: tolerância a falhas, redundância, replicação, clusterização, escalabilidade, resiliência.

### Autenticação
Processo de validar a identidade do usuário, dispositivo ou processo antes de conceder acesso a um recurso. Costuma ter relação com conceitos como credenciais, autenticação de multi-fatores (MFA), IAM (identity and access management), SSO (single sign-on), identidades federadas.

Geralmente usa-se três fatores nesse processo:

1. Algo que você conhece: uma senha, por exemplo;
2. Algo que você tem: um telefone, por exemplo;
3. Algo que você é: digital, retina e voz, por exemplo;

### Autorização
Controla o acesso a informações e objetos. Refere-se aos direitos, permissões e privilégios concedidos ao usuário, dispositivo ou processo. Decisões de autorização são dependentes de autenticação.

### Accountability
O ato de registrar os eventos de sistemas/aplicações/dispositivos se chama logging. Isso cria um histórico de eventos que são computados pela organização para propósitos de revisão, investigação, inspeção e resolução de problemas. Quando feito de forma correta cria registros imutáveis das ações tomadas.

Esse processo involve alguns desafios, como: impacto em performance, sobrecarga de informação, limitação de capacidade, proteção de interfaces de configuração, proteção de logs de auditoria.

### Non-repudiation
Refere-se a prova da origem da integridade de uma ação ou informação. Por exemplo, mesmo que uma pessoa diga que ela não foi responsável por uma ação você consegue atestar que a conta dela foi responsável pela ação. Esse conceito comumente está associado com assinaturas digitais e conceitos como PKI (public key infrastructure) e blockchain.

### Governança, risco e compliance (GRC)
Alinhamento entre TI, segurança e regras de negócio ao passo que riscos sejam gerenciados, padrões da indústria estejam em conformidade (e.g. PCI) e regulações governamentais estejam devidamente implementadas.

## Princípios de Design de Segurança

### Least Privilege
Use o controle de acessos para garantir que usuários e processos tenham apenas os privilégios que eles precisam e nada além disso.

Zero trust: não confie em nada, verifique tudo a todo momento; usuários/dispositivos/processos precisam ser continuamente autenticados e autorizados. Pense que estamos em contexto onde as pessoas estão distribuídas geograficamente, usando diversos dispositivos em horários variados. É preciso desconfiar, sempre.

### Separation of Duties (SoD)
Distribuição das funções chave do negócio para reduzir o risco de erro e fraude. Por exemplo, não existir o papel da pessoa que controla múltiplos processos permitindo a ela determinar os pontos de checagem, realizar as checagens e auditá-las. Ao dividir isso em múltiplas pessoas, com papéis diferentes, você reduz o risco de fraude.

Esse tema relaciona-se com temas como multi-party control, secret sharing e split knowledge.

### Defense in Depth
Ideia em que eu vou ter múltiplas camadas de controle de segurança que funcionam como camada:

- diversidade geográfica
- diversidade técnica
- sistemas distribuídos
- DMZs (zonas de segurança): trusted, semi-trusted, untrusted

### Resiliência
Manter sistemas essenciais em execução apesar dos desastres e disrupções. Relaciona-se com conceitos importantes: fail safe (e.g. cenários onde a vida humana é prioridade, em caso de falha a região automaticamente abre se houver queda de energia), fail secure (e.g. cofres que trancam automaticamente no caso da energia cair), no single point of failure (SPOF) e failover.

### Economy of mechanism
Vulnerabilidades aumentam à medida que o sistema se torna mais complexo. Pense sempre no princípio KISS (e.g. usar SSO para reduzir complexidade) e use ferramentas existentes/já validadas como vaults para senhas.

### Complete mediation
Autorização precisa ser verificada a todo momento. Ainda que você já esteja logado, ainda que você já seja confiável, eu vou checar a todo momento. Temas relacionados a esse conceito envolvem gestão de cookie, gestão de sessão, cache de credenciais e zero trust.

### Open design
A segurança de um sistema nunca deve depender do sigilo de seu algoritmo ou funcionamento.

Princípio de Kerckhoffs: um sistema criptográfico deve ser seguro mesmo que tudo nele, exceto a chave, seja de conhecimento público.

• Foco na chave: Apenas a chave secreta deve proteger a informação. Se alguém souber como o programa funciona, o sistema ainda deve ser seguro.
• Fim da obscuridade: Ocultar o código de um programa para tentar protegê-lo é uma falha conhecida como segurança por obscuridade.
• Transparência: Códigos públicos permitem que especialistas revisem e corrijam erros mais rápido

### Least common mechanism
Mecanismos compartilhados por mais de um usuário ou processo devem ser minimizados. Isso evita o vazamento de informações. Esse tema é sobre compartimentalização, isolamento e whitelist (allow/accept list).

### Psychological acceptability
Mecanismos de segurança devem ser transparentes e fáceis de usar. À medida que adicionamos camadas de segurança tendemos a adicionar mais fricção no sistema e isso traz problemas de uso para os usuários. Aqui vale considerar coisas como autenticação sem senha, CAPTCHA, layouts de tela, etc.

### Componente reuse
Use software existente para construir novo software: bibliotecas comuns, controles, APIs, objetos. Não reinvente a roda. Não venha construir algo que já existe disponível, confiável e bem documentado.
