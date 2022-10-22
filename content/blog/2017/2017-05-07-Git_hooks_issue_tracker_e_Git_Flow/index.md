---
layout: post
title: Git hooks, issue tracker e Git Flow
category: Git
date: 2017-05-07T00:00:00
tags: [git, gitflow, hooks]
image: featured.png

---

Na [Agilize](https://www.agilize.com.br/) o fluxo comum de trabalho do desenvolvedor envolve o uso do Jira para gerenciamento das tarefas, Git & Git Flow para versionamento de código, Slack para comunicação e ferramentas como IDE, Editor de Texto e Terminal. Basicamente, a sprint é mantida no Jira com cards que descrevem as funcionalidades, bugs, spikes e chores seguindo algumas convenções do SCRUM e, então, o programador atribui um card para si.

Durante o fluxo de desenvolvimento existe uma convenção de que **commits devem ter o código do card que o programador está trabalhando**. Após alguns commits a convenção se torna chata de manter (pois você tem que digitar o código do card a todo momento). Existe uma forma de automatizar isso com Git Hooks.

## Git Hooks

Git permite executir um script toda vez que um evento acontecer no repositório. Por exemplo, é possível configurar o editor de texto com uma mensagem de template que deve ser preenchida. Este [tutorial](https://www.atlassian.com/git/tutorials/git-hooks) explica o poder do Git Hooks e disponibiliza um trecho de código que será customizado neste post para endereçar nossas necessidades.

Dentro do nosso repositório existe um diretório _.git/hooks_ que contém alguns scripts de exemplo que podem ser usados como playground. Eles terminam com _.sample_ para não serem interpretados pelo Git.

Crie um arquivo chamado _prepare-commit-msg_ que vai conter o código abaixo para automatizar a mensagem de commit.

```bash
#!/usr/bin/env python3
import sys, os, re
from subprocess import check_output

# Setup
branch_regex = r'.+/(AGZ-\d+).*'

# Collect the parameters
commit_msg_filepath = sys.argv[1]

# Figure out which branch we're on
branch = check_output(['git', 'symbolic-ref', '--short', 'HEAD']).strip()

# Populate the commit message with the issue #, if there is one
issue_match = re.match(branch_regex, branch.decode('utf-8'), re.M|re.I)
if issue_match:
    issue_code = issue_match.group(1)
    with open(commit_msg_filepath, 'r+') as f:
        content = f.read()
        f.seek(0, 0)
        f.write("%s %s" % (issue_code, content))
```

Depois de executar _git commit_ o arquivo acima será executado para popular a mensagem de commit e, então, permitir-nos adotar o template nos nossos commits. O script é chamado com três argumentos:

1. Nome do arquivo
1. O nome de um arquivo temporário que vai conter a mensagem
1. O tipo do commit
1. O hash SHA1 do commit

Na Agilize o código do card segue a regex na linha 6. Como usamos o [gitflow](http://nvie.com/posts/a-successful-git-branching-model/) para gerenciar as branches, elas sempre seguirão alguns padrões como _feature/AGZ-1256_, _hotfix/AGZ-981_, _release/AGZ-453_. Portanto, commits não são criados nas branch master ou dev. Devido a isso, a variável na linha 6 define a regex que irá usar o nome da branch para criar nossa mensagem de commit. Se você quiser aplicar isso para a sua empresa basta atualizar a regex (veja a linha 17).

As linhas 15 e 16 checam se a branch atual não é master / dev e contém o código do card. As linhas finais apenas criam a mensagem com o código.

**Obs:**

Ao fazer commit o cursor geralmente começa no início da linha mas você pode fazer com que o cursor comece imediatamente depois da mensagem de template. Apenas adicione o trecho de código abaixo ao seu arquivo _.bashrc_.

```bash
export GIT_EDITOR="vim -c'startinsert|norm! ggA'"
```

#### Referências

1. [Git hooks](https://www.atlassian.com/git/tutorials/git-hooks)
1. [Open git commit editor to specific cursor location](http://stackoverflow.com/questions/41232722/open-git-commit-editor-to-specific-cursor-location)
