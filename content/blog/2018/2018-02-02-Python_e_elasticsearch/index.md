---
layout: post
title: "Python + Elasticsearch"
category: Web Development
tags: [elasticsearch, python]
date: "2018-02-02T00:00:00"
image: featured.png
language: pt
---

Então você tem muitos documentos e precisa buscar com rapidez, certo? Ou você tem muitos dados e precisa processar e extrair métricas. De qualquer jeito, Elasticsearch (ES) pode ser um poderoso motor para ajudá-lo a indexar, buscar e extrair métricas dos seu armazenamento orientado a documentos. Este post é bem direto e pretende apresentar como usar a linguagem Python para interagir com o motor e indexar, retornar e buscar documentos.

A comunidade python desenvolveu dois projetos bem conhecidos: [elasticsearch-py](http://elasticsearch-py.readthedocs.io/) e [elasticsearch-dsl](http://elasticsearch-dsl.readthedocs.io/). Enquanto o primeiro provê algumas ferramentas para interagir com ES e, na minha humilde opinião, para ter um controle mais granular das ações, o último foi criado para ajudá-lo com a busca e a persistência.

## Conexão

A primeira questão é: como eu conector com o ES? Ao usar `elasticsearch-dsl` você pode criar uma conexão _default_ que será usada globalmente:

```python
connections.create_connection(hosts=['localhost'])
```

Entretando, você pode querer usar um cliente e ter um controle mais granual. Ao usar o `elasticsearch-py` você consegue isso:

```python
from elasticsearch import Elasticsearch

client = Elasticsearch(hosts, http_auth=(username, password), **kwargs)
```

Execute `client.indices.get_alias("*")` para retornar os índices existentes e checar se está propriamente configurado.

## Persistência

Armazenar documentos é fácil pois `elasticsearch-dsl` provê `DocType` – uma classe que cuida de mapear sua classe python para documentos JSON. Ao invés de preocupar-se com estruturas JSON, vamos criar um documento que armazena o o acesso de um usuário a uma página específica:

```python
from elasticsearch_dsl import DocType, Integer, Date, Keyword


class UserHit(DocType):
    page = Keyword()
    datetime = Date()
    user_id = Integer()
    environment = Keyword()
```

Preste atenção aos campos que escolhemos: Integer, Date, Keyword. Eles serão mapeados para o motor do Elasticsearch, o que significa que você pode usar algumas features específicas. Por exemplo, o campo datetime pode ser usado para buscar um intervalo de datas ou agregar os dados por minutos, horas, dias, meses. Outro detalhe é o campo `environment`: é uma solução para integrar o ES com diferentes ambientes (homologação, desenvolvimento e produção). Dessa forma você não corre o risco de misturar dados falsos com os de produção.

**Atualizado em 4 de Fev:**: Uma outra estratégia é criar índices concatenados com o ambiente de produção. Ao utilizar uma variável de ambiente sua aplicação pode criar diferentes índices (e.g. myindex-2018.02.01-production, myindex-2018.02.01-staging, myindex-2018.02.01-development). Obrigado pela contribuição, Robson Peixoto.

Uma vez que você criou a classe, a indexação se torna fácil:

```python
user_hit = UserHit(
    page='product-list',
    datetime=datetime.now(),
    user_id=10,
    environment='production'
)

UserHit.init(using=client, index=index_name)

# Indexed can be True or False depending on the operation success
indexed = user_hit.save(using=client, index='myindex-2018.02.01')
```

Você tem que ser atento a duas questões: (i) antes de usar o documento você precisa garantir que o mapeamento no Elasticsearch está criado e é por isso que nós temos que usar o método `init` na linha 8; (ii) o retorno da operação uma vez que o método `.save` pode retornar ou `True` ou `False`.

## Buscar

Como buscar os documentos? O trecho de código abaixo ilustra um exemplo simples.

```python
from elasticsearch_dsl import Search
from elasticsearch import ElasticsearchException


search = (Search(using=client, index='myindex-2018.02.01')
          .sort('datetime')
          .query('match', page='product-list')
          .query('match', user_id=12)
          .query('match', environment='production'))

count = search.count()
search = search[0:count]

response = search.execute()
if not response.success():
    raise ElasticsearchException('Fail to get the hits')

return response.hits
```

É importante mencionar que o ES traz apenas _10 resultados por padrão e é por isso que precisamos das linhas 11 e 12_ .

## Filtrando Resultados

```python
search = (Search(using=client, index='myindex-2018.02.01')
          .sort('datetime')
          .query('match', page='product-list')
          .query('match', user_id=12)
          .query('match', environment='production'))

search = search.filter('range', datetime={'gte': from_datetime, 'lte': to_datetime, 'time_zone': time_zone_delta})

count = search.count()
print(count)

search = search[0:count]

response = search.execute()
print(response.hits)
```

Você acabou de buscar, mas agora quer filtrar os resultados por um intervalo de data. A linha 7 faz o truque.

## Agregando

Você pode gerar métricas baseadas em data, por exemplo. A linha 12 diz para o ES agrugar os dados por intervalos de 30 minutos.

```python
from elasticsearch_dsl import Search
from elasticsearch import ElasticsearchException


search = (Search(using=client, index='myindex-2018.02.01')
          .sort('datetime')
          .query('match', page='product-list')
          .query('match', user_id=12)
          .query('match', environment='production'))

search = search.filter('range', datetime={'gte': from_datetime, 'lte': to_datetime, 'time_zone': time_zone_delta})
search.aggs.bucket('datetime', 'date_histogram', field='datetime', interval='30m')

count = search.count()
search = search[0:count]

res = search.execute()
if not response.success():
    raise ElasticsearchException('Fail to get the hits')

return res.aggs['datetime']['buckets']
```
