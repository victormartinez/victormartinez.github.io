---
layout: post
title: Criando scripts de linha de comando à prova de balas
category: Misc
tags: [command, line, scripts]
date: 2019-05-18T00:00:00
image: featured.jpg
image_author: Chris Ried
image_url: https://unsplash.com/photos/ieic5Tq8YMk

---

A vida de um desenvolvedor back-end envolve a criação de alguns scripts para serem executados no ambiente de produção. Por exemplo, você pode precisar atualizar muitos registros de uma vez, acionar eventos ou corrigir um bug específico. _O que eles têm em comum?_ Se não forem projetados corretamente, podem causar um efeito colateral muito ruim na aplicação, arruinar a experiência do usuário, etc.

No cenário do mundo real, algumas mudanças são ~praticamente~ impossíveis de reverter:

1. Acionar e-mails / notificações / mensagens / SMSs para clientes
2. Fornecer, acidentalmente, um desconto a um usuário (ou muitos)
3. Atualizar de registros sem backup

Como desenvolvedores, precisamos não apenas verificar novamente nossos scripts, mas também fazer o nosso melhor para minimizar / evitar possíveis efeitos colaterais (especialmente se algo inesperado acontecer). Algumas semanas atrás, durante uma sessão pair programming, [Elias](https://etandel.xyz) e eu criamos um crítico [comando Django](https://docs.djangoproject.com/en/2.2/howto/custom-management-command/) responsável por alterar registros em muitas tabelas de acordo com uma lógica de negócios. À medida que mergulhávamos nas partes intrínsecas do script, percebemos o quão perigoso isso poderia ser e tomamos alguns cuidados que são compartilhados neste post.

## Barras de progresso são fantásticas!

Executar um script que leva muito tempo para ser concluído é desesperador. Você fica confuso porque não sabe o que está acontecendo: (i) ainda está funcionando? (ii) a conexão está desligada? É por isso que um senso de progresso é importante. Se você é um programador Python, alguns projetos como [tqdm](https://github.com/tqdm/tqdm) e [clint](https://github.com/kennethreitz/clint) podem ajudá-lo fornecendo maneiras de criar barras de progresso. De qualquer forma, se isso exigir muito esforço ou se sua linguagem de programação não ajudar você com isso, um simples indicador `<accomplished> / <total>` é um bom começo, pelo menos.

## Logging

Depois de executar um script, as coisas acontecem:

1. Você não tem certeza do que foi feito; Alguns dias depois, como você se lembra?
2. Você não terá 100% de certeza sobre os registros que foram atualizados;
3. Qualquer reversão exigirá um backup específico;

Além disso, pense no cenário em que seu script tem um bug inesperado ou os registros que você atualiza não estão consistentemente alinhados à lógica de negócios. _Quão fácil é reverter os efeitos colaterais?_

Toda dor acima mencionada pode ser atenuada se você simplesmente registrar as alterações. Você pode criar um arquivo simples que armazena: (i) a id dos registros que você atualizou; (ii) o valor da coluna anterior; (iii) o novo valor. Dessa forma, se algo inesperado acontecer, você pode facilmente analisar o log, obter os registros que alterou e definir os valores antigos de volta sem ter que carregar um backup.

## Auto-verificação

E se o seu script pudesse verificar inconsistências durante a execução? Pouco antes da conclusão, ele pode analisar o log e verificar se os novos registros são consistentes com a lógica de negócios.

Vamos supor, por exemplo, que você precise multiplicar o saldo de vários usuários por um fator. Como você é cauteloso, seu script produz o seguinte registro:

```
id; antigo; novo
10987; 10; 100
98011; 5; 50
87652; 3; 35
```

O último registro não está correto porque o novo saldo ultrapassa em 5 o valor esperado (30). Nesse caso, uma exceção pode ser lançada para reverter todas as alterações.

## Rollback

Especialmente ao lidar com registros de banco de dados, você deve garantir que uma política de tudo-ou-nada seja seguida: ou todas as alterações são persistidas ou nada é feito. Use uma transação de banco de dados para fazer isso, pois no caso de qualquer erro o rollback será executado.

```python
@transaction.atomic
def handle(self, *args, **kwargs):
    <your_code_goes_here>
```

## Dry-run

Sempre que possível, forneça uma opção `dry-run`. Dessa forma as alterações não são confirmadas e é possível verificar se há erros no tempo de execução. Se você usa o framework Django, por exemplo, seu comando pode reverter todas as mudanças se `dry-run` for passado como argumento:

```python
@transaction.atomic
def handle(self, *args, **kwargs):
    dry_run = kwargs['dry_run']
    if dry_run:
        transaction.set_rollback(True)
```

## Tmux

E se sua conexão for perdida durante a execução? Isso pode ser muito ruim, hein? É por isso que é recomendado usar um multiplexador de Terminal como o tmux (dá uma olhada neste [tutorial](https://www.hamvocke.com/blog/a-quick-and-easy-guide-to-tmux/)). É realmente útil porque você pode iniciar tarefas de longa execução em seu servidor remoto e mantê-las em execução mesmo que sua conexão seja perdida.

## Revisão de código

Cada código que vai para a produção deve ser revisado por outro programador. Os scripts não são exceção. Ponto final.
