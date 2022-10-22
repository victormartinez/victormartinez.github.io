---
layout: post
title: "Configure o Alembic e o SQLAlchemy para um schema diferente"
category: Web Development
date: "2020-10-02T00:00:00"
tags: [alembic, sqlalchemy, migration, schema, public, python, flask]
image: featured.jpg
image_url: https://unsplash.com/photos/lRoX0shwjUQ
image_author: Jan Antonin Kolar

---

Há algum tempo, desenvolvi um projeto de back-end que usava uma instância compartilhada do Postgres. Se você usar o Flask, como eu fiz, provavelmente sua camada de migração é tratada pelo Alembic e o ORM de escolha sendo o SQLAlchemy. Devido a restrições da arquitetura, o projeto usou um esquema diferente (_public_ não estava disponível). **Após a primeira migração, qualquer alteração no modelo não foi identificada pelo Alembic e todas as tabelas foram geradas novamente.**

## O Cenário

Para lidar com um novo schema de banco de dados, especifiquei os argumentos nos models, conforme ilustrado pelo exemplo abaixo.

```python
class User(db.Model):
    __tablename__ = "project_users"
    __table_args__ = ({"schema": "users"},)

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
```

No entanto, isso é apenas uma coisa que deve ser feita. A outra é **configurar corretamente o Alembic apontar para o novo esquema.**

## A solução

Não estava claro para mim o que estava acontecendo mas [esta thread](https://stackoverflow.com/questions/26275041/alembic-sqlalchemy-does-not-detect-existing-tables) no StackOverflow tornou claro. Em resumo:

(1) É necessário permitir ao Alembic escanear todos os schemas do banco de dados. Isso é feito através da configuração `EnvironmentContext.configure.include_schemas`. Assim, o dialeto de banco de dados (Postgres neste cenário) executa a query abaixo para obter todos os schemas:

```sql
SELECT nspname FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' ORDER BY nspname
```

(2) A query acima retorna os schemas mas nós estamos interessados apenas naquele que nossa aplicação usa. Ao configurar `EnvironmentContext.configure.include_object`, nós podemos especificar um _callable_ responsável por filtrar quais objetos do banco de dados devem ser considerados.

## Trecho de código

Após executar o comando de init, `migrations/env.py` é gerado. Uma vez que ele especifica o objeto de configuração, nós vamos precisar modificá-lo um pouco. O trecho de código abaixo ilustra isso.

```python
# ...

def include_object(object, name, type_, reflected, compare_to):
    if hasattr(object, "schema"):
        return object.schema == target_metadata.schema
    return object.table.schema == target_metadata.schema

def run_migrations_offline():
    """Run migrations in 'offline' mode.
    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.
    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True,
        version_table_schema=target_metadata.schema,
        include_schemas=True,
        include_object=include_object,
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode.
    In this scenario we need to create an Engine
    and associate a connection with the context.
    """

    # this callback is used to prevent an auto-migration from being generated
    # when there are no changes to the schema
    # reference: http://alembic.zzzcomputing.com/en/latest/cookbook.html
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            version_table_schema=target_metadata.schema,
            include_schemas=True,
            process_revision_directives=process_revision_directives,
            include_object=include_object,
            **current_app.extensions['migrate'].configure_args
        )

        with context.begin_transaction():
            context.run_migrations()

# ...
```

- **Linhas 21 e 55** configuram `include_schema=True`.
- **Linhas 22 e 57** passam o _callable_ `include_object` que corresponde a função da 4ª linha.
- **Linha 3** corresponde ao nosso _callable_ que especifica se o Alembic deve considerar ou não o objeto em questão. Preste atenção que na 5ª linha nós verificamos se o objeto tem um atributo `schema`. Finalmente, as linhas 6 e 7 comparam o schema com aquele configurado nos models do SQLAlchemy.
