---
layout: post
title: "Prepare sua aplicação Django para ser disponibilizada no Heroku"
category: Web Development
date: "2017-08-15T00:00:00"
tags: [deploy, django, heroku, paas, python]
image: featured.png
language: pt
---

É bem animador construir nossos próprios projectos e vê-los funcionar em produção, certo? Alguns desenvolvedores podem pensar que fazer o deploy de uma aplicação Django é um pesadelo. Neste post eu vou mostrar como preparar sua aplicação para ter diferentes configurações e efetuar o deploy no Heroku.

**Requisitos:** Você precisa instalar o [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) e o **GIT**.

## Heroku

[Heroku](http://www.heroku.com) é o PaaS que vai disponibilizar nosso projeto. Acesse o [dashboard](https://dashboard.heroku.com/apps) e crie uma nova aplicação.

Um vez criada sua aplicação no Heroku, é necessário usar o terminal para configurar as credencials. Nós precisamos do Heroku CLI para acessar as configurações do app (dê uma olhada na [docs](https://devcenter.heroku.com/articles/heroku-cli) para instalar propriamente).

Após a instalação você pode efetuar o login:

```bash
heroku login
heroku addons:create heroku-postgresql:<your-plan-name> -a <your-application-name>
```

Mais tarde usaremos o Postgres. Heroku nos ajuda a provisionar um banco de dados Postgres com um comando. É bem fácil e você pode aprender sobre isso na [docs](https://devcenter.heroku.com/articles/heroku-postgresql#provisioning-heroku-postgres).

**Dica:** O comando `$ heroku apps` é bem útil e nos permite listar os apps que temos.

## Preparando nossa aplicação

Quando se trata de gerenciar os ambientes local e de produção eu gosto de usar o [python decouple](https://github.com/henriquebastos/python-decouple) pois ele permite utilizar variáveis de ambiente e, com isso, ter diferentes configurações. Além dele, eu uso o [dj_database_url](https://github.com/kennethreitz/dj-database-url) para tornar simples o uso de diferentes bancos de dados com apenas uma única string de configuração.

1\. Primeiro, crie dois arquivos: _.env_ e _.env-sample_. O primeiro será usado no nosso ambiente local e deve ser ignorado pelo GIT. O segundo funciona como um template:

```bash
SECRET_KEY=YOUR_KEY_GOES_HERE
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost,.herokuapp.com
```

2\. Abra seu _settings.py_, importe os módulos que iremos usar e use a configuração abaixo:

```python
from decouple import config, Csv
from dj_database_url import parse as dburl

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default=[], cast=Csv())

DEFAULT_DBURL = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')
DATABASES = {
    'default': config('DATABASE_URL', default=DEFAULT_DBURL, cast=dburl)
}
```

As primeiras duas linhas importam o módulo enquanto as outras apenas carregam os valores usando a biblioteca python-decouple. O parâmetro `cast` é obrigatório pois Python vai tratar o conteúdo do arquivo `.env` como string e é importante converter o valor para o tipo de dado correto.

Preste atenção às variáveis `DEFAULT_DBURL` e `DATABASES`. A primeira usa o Sqlite no ambiente local mas no Heroku nós iremos configurá-la para armazenar a URL de configuração do Postgres.

## Subindo para o Heroku

Nós criamos nossa aplicação no Heroku, adicionamos um banco de dados Postgres e configuramos o projeto para aceitar diferentes strings de configuração. Agora é hora de disponibilizar nossa aplicação!

###### Certifique-se de que seu arquivo requirements.txt contém todas as dependências

Ele deve ter, ao menos: _dj-database-url_, _gunicorn_, _psycopg2_, _python-decouple_ e _pytz_. Esse arquivo é extremamente importante pois o Heroku olha para ele a fim de instalar as dependências.

###### Crie um arquivo Procfile no diretório raiz

```bash
web: gunicorn <app>.wsgi --log-file -
```

O Procfile (sim, sem qualquer extensão) informa ao Heroku como executar a aplicação. Atente que **<app>** deve ser substituído pelo diretório que está o seu arquivo **wsgi**. Execute o comando localmente para certificar-se de que está correto.

###### Crie um arquivo runtime.txt no diretório raiz

```
python-3.6.1
```

O arquivo vai dizer ao Heroku qual versão do python nosso projeto usa.

###### Configure suas variáveis de ambiente de produção

Lembra-se que nosso **settings.py** carrega os dados do arquivo **.env**? Bem, **python-decouple** respeita a precedência das variáveis de ambiente em relação aos arquivos **config**. Portanto, se existir alguma variável de ambiente em produção a diretiva _config_ não irá olhar para o arquivo .env.

Para cada chave no arquivo _.env_ nós iremos usar o _Heroku CLI_ para configurar a variável de ambiente em produção. Nós precisamos configurar quatro variáveis: **SECRET_KEY**, **DEBUG**, **ALLOWED_HOSTS** e **DATABASE_URL**. Abra o terminar e execute:

```bash
heroku config:set SECRET_KEY='<YOUR_SECRE_KEY>' -a <YOUR_APP>
heroku config:set DEBUG=False -a <YOUR_APP>
heroku config:set ALLOWED_HOSTS=127.0.0.1,localhost,.herokuapp.com -a <YOUR_APP>
heroku config:set DATABASE_URL='<YOUR_DATABASE_URL>' -a <YOUR_APP>
```

**Notas:**

1. SECRET_KEY é cercado por aspas simples pois precisamos explicitamente definí-la como uma string para o Heroku;
1. Substitua <YOUR_APP> pelo nome da sua aplicação;
1. A string _.herokuapp.com_ deve estar dentro de _ALLOWED_HOSTS_, caso contrário o Django não será executado no Heroku.

**Como encontrar DATABASE_URL?** Acesse o dashboard > Resources > Heroku Postgres Database. Uma nova aba irá abrir e permitirá você verificar _DATABASE CREDENTIALS_.

###### Disponibilize seu app

No dashboard do Heroku irá conter instruções de como disponibilizar seu app. Com o git você pode fazê-lo facilmente:

```bash
heroku git:remote -a <YOUR_APP_NAME>
git push heroku master
```

## Solução de Problemas

Se você encontrar quaisquer problemas, apenas cheque o terminal pois o Heroku apresenta de forma expressiva mensagens que podem te ajudar. Por exemplo, durante o deploy eu fui apresentado a seguinte mensagem:

```
remote:        django.core.exceptions.ImproperlyConfigured: You're using the staticfiles app without having set the STATIC_ROOT setting to a filesystem path.
remote:
remote:  !     Error while running '$ python manage.py collectstatic --noinput'.
remote:        See traceback above for details.
remote:
```

Ao checá-la percebi que havia esquecido de configurar _STATIC ROOT variable in \_settings.py_ e instalar o middleware WSGI para prover os arquivos estáticos.

**Nota:** Django não foi pensado para prover arquivos estáticos. Use a Amazon S3 (ou equivalente) para fazer isso em projetos "reais".

Isso é tudo, pessoal!
