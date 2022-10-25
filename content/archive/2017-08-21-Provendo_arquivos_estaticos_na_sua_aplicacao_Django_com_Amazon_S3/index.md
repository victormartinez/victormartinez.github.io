---
layout: post
title: Provendo arquivos estáticos na sua aplicação Django com Amazon S3
category: Web
date: 2017-08-21T00:00:00
tags: [aws, django, python, s3, storage]
image: featured.png
---

É sabido que Django não provê arquivos estáticos. Usar um middleware WSGI para endereçar essa questão não é o jeito correto de servir arquivos estáticos e, portanto, este post apresenta como você pode fazer isso usando a Amazon S3.

### Django backend storages

Django usa uma arquitetura de _backend storages_ para armazenar dados (_e.g._ [FileSystemStorage](https://docs.djangoproject.com/en/1.11/ref/files/storage/) é responsável por salvar arquivos no sistema de arquivos). Entretanto, você pode querer adotar uma abordagem diferente e, assim, implementar a [Storage Interface](https://docs.djangoproject.com/en/1.11/howto/custom-file-storage/) permite criar a sua própria estratégia. Um projeto chamado [django-storages](https://github.com/jschneier/django-storages) já pensou nesses problemas e implementou um armazenamento que envia os arquivos para a Amazon S3 com praticamennte zero esforço. Vamos usá-lo!

### Criando um bucket na Amazon S3

Acesse a Amazon S3, crie um bucket com dois diretórios dentro: _static_ e _media_. Neste exemplo assumiremos que a listagem dos objetos no S3 é pública.

**Nota:** Neste post nós falamos sobre diretórios mas é apenas uma abstração para facilitar o entendimento. A [documentação do S3](http://docs.aws.amazon.com/AmazonS3/latest/UG/FolderOperations.html) explica que _buckets_ e objetos são os recursos primários e que não existe a hierarquia que ocorre em um sistema de arquivos convencional.

### Instalação e requisitos

Você vai precisar instalar o [boto](https://github.com/boto/boto3) e o [django-storages](https://github.com/jschneier/django-storages). Como explicado anteriormente, _django-storages_ vai nos ajudar a enviar arquivos para a Amazon S3. Entretanto, nós precisamos instalar o _boto_ pois ele é responsável por conectar com os serviços da Amazon.

**Nota:** Este post usa [python-decouple](https://github.com/henriquebastos/python-decouple) para gerenciar o ambiente local. Se você não sabe como dê uma olhada neste [post](/pt/blog/2017/2017-08-15-Prepare_sua_aplicacao_Django_para_ser_disponibilizada_no_Heroku).

### Criando nosssos backends customizados

No nosso diretório de configuração nós vamos criar os backends responsáveis por lidar com a Amazon S3. Crie um arquivo chamado _s3util.py_ e adicione o conteúdo abaixo:

```python
from django.conf import settings
from storages.backends.s3boto import S3BotoStorage


class StaticStorage(S3BotoStorage):
    location = settings.STATICFILES_LOCATION


class MediaStorage(S3BotoStorage):
    location = settings.MEDIAFILES_LOCATION
```

- Linhas 1-2: Importa os módulos.
- Linhas 5-10: Representa nossos storages. O atributo `location` é configurado para armazenar a localização dos arquivos _static_ e _media_ definidos no arquivo _settings.py_.

### Configurando as variáveis da Amazon S3

Assumindo que você já tem um bucket disponível, vamos adicionar algumas variáveis ao arquivo _settings.py_.

```python
from decouple import config

# AWS
AWS_S3_SECURE_URLS = True
AWS_QUERYSTRING_AUTH = False
AWS_PRELOAD_METADATA = True
AWS_STORAGE_BUCKET_NAME = '<YOUR-BUCKET-NAME>'
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID', default='')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY', default='')

STATICFILES_STORAGE = config('STATICFILES_STORAGE', default='django.contrib.staticfiles.storage.StaticFilesStorage')
DEFAULT_FILE_STORAGE = config('DEFAULT_FILE_STORAGE', default='django.core.files.storage.FileSystemStorage')

STATIC_URL = config('STATIC_URL', default='/static/')
MEDIA_URL = config('MEDIA_URL', default='/media/')

AWS_HEADERS = {
    'x-amz-acl': 'public-read',
    'Cache-Control': 'public, max-age=31556926'
}

STATICFILES_LOCATION = 'static'
MEDIAFILES_LOCATION = 'media'
```

- Linha 1: Certifique-se de importar o módulo de configuração. Ele vai procurar as variáveis de ambiente ou um arquivo `.env`.
- Linha 4: Use urls com SSL para servir os objetos do S3.
- Linha 5: Nós não queremos gerar uma querystring de autenticação para o S3.
- Linha 6: Queremos fazer o pré-carregamento de metadados do S3.
- Linha 7: É necessário fornecer o nome do bucket.
- Linhas 8-9: `config` vai procurar pelas variáveis de ambiente ou por um arquivo `.env`. No ambiente local elas estarão em branco pois não enviaremos para o S3. Entretanto, em produção nós iremos configurar essas variáveis.
- Linhas 11-12: Essas variáveis irão explicitamente definir qual storage nosso projeto vai utilizar para armazenar os arquivos estáticos. No ambiente local será o backend comum (StaticFilesStorage e FileSystemStorage). Entretanto, em produção, iremos deixar configurado os backends responsáveis por enviar os arquivos para o S3.
- Linhas 14-15: Aponta para as URLs de arquivos estáticos e mídias. Em produção eles vão armazenar a URL da Amazon S3 que corresponde a cada tipo de arquivo.
- Linhas 17-20: Cabeçalhos AWS que explicitam a política de cache.
- Linhas 22-23: Variáveis que informam nosso backend onde encontrar os arquivos de mídia e estáticos. Elas são usadas no arquivo _s3utils.py_.

### Variáveis Locais

Em resumo, nossas variáveis locais vão acabar sendo:

```bash
AWS_S3_SECURE_URLS = True
AWS_QUERYSTRING_AUTH = False
AWS_PRELOAD_METADATA = True
AWS_STORAGE_BUCKET_NAME = 'BUCKET-NAME'
AWS_ACCESS_KEY_ID = ''
AWS_SECRET_ACCESS_KEY = ''

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

AWS_HEADERS = {
    'x-amz-acl': 'public-read',
    'Cache-Control': 'public, max-age=31556926'
}

STATICFILES_LOCATION = 'static'
MEDIAFILES_LOCATION = 'media'
```

### Variáveis de Produção

É necessário configurar as variáveis de produção:

```bash
heroku config:set AWS_ACCESS_KEY_ID='<YOUR-ACCESS-KEY>' -a <YOUR_APP>
heroku config:set AWS_SECRET_ACCESS_KEY='<YOUR-SECRET-KEY>' -a <YOUR_APP>
heroku config:set DEFAULT_FILE_STORAGE='config.s3util.MediaStorage' -a <YOUR_APP>
heroku config:set STATICFILES_STORAGE='config.s3util.StaticStorage' -a <YOUR_APP>
heroku config:set MEDIA_URL='https://s3.amazonaws.com/<YOUR-BUCKET-NAME>/media/' -a <YOUR_APP>
heroku config:set STATIC_URL='https://s3.amazonaws.com/<YOUR-BUCKET-NAME>/static/' -a <YOUR_APP>
```

**Nota:** Você pode passar múltiplas variáveis em apenas uma declaração:

```bash
heroku config:set AWS_ACCESS_KEY_ID='<YOUR-ACCESS-KEY>' AWS_SECRET_ACCESS_KEY='<YOUR-SECRET-KEY>' ... -a <YOUR_APP>
```

### Enviando arquivos para o S3

De agora em diante, toda vez que você disponibilizar seu projeto no Heroku ele vai enviar os arquivos para a Amazon S3. Isso vai acontecer pois o Heroku executa `$ python manage.py collectstatic` durante o pipeline de deploy e esse comando coleta os arquivos estáticos e salva-os. Nosso backend de produção salva no S3 todos os arquivos.

Se você não estiver usando Heroku certifique-se de executar `python manage.py collectstatic` em produção.

**Nota:** Um teste pode ser feito ao configurar as variáveis de produção no ambiente local. Dessa forma, se você executar o comando `collectstatic` ele irá enviar os arquivos para o S3. Apenas certifique-se de removê-las após testar.
