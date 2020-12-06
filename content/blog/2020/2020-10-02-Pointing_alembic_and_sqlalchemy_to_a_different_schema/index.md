---
layout: post
title: "Point Alembic and SQLAlchemy to a different schema"
category: Web Development
date: "2020-10-02T00:00:00"
tags: [alembic, sqlalchemy, migration, schema, public, python, flask]
image: featured.jpg
image_url: https://unsplash.com/photos/lRoX0shwjUQ
image_author: Jan Antonin Kolar
---

A while ago I developed a backend project that used a shared instance of Postgres. If you use Flask, as I did, probably your migration layer is dealt by Alembic and the ORM of choice is SQLAlchemy. Due to architectural constraints, the project used a different schema (_public_ was not available). **After the first migration, any change in the model was not identified by Alembic and all tables were generated again.**

## The scenario

In order to address a new database schema I specified table arguments in the models as illustrated by the example below.

```python
class User(db.Model):
    __tablename__ = "project_users"
    __table_args__ = ({"schema": "users"},)

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
```

However, that is just one thing that must be done. The other is to **properly configure Alembic to watch the new schema.**

## The solution

It was unclear to me what was happening but [this issue](https://stackoverflow.com/questions/26275041/alembic-sqlalchemy-does-not-detect-existing-tables) in StackOverflow clarified. To sum up:

(1) It is necessary to allow Alembic to scan all schemas in database. It is done by setting `EnvironmentContext.configure.include_schemas` in the configuration context. Thus, the database dialect (Postgres in this scenario) executes the query below to retrieve the schemas:

```sql
SELECT nspname FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' ORDER BY nspname
```

(2) The query above brings the schemas but we are interested in the one our application uses. By setting `EnvironmentContext.configure.include_object`, we can specify a callable responsible for filtering which database objects should be considered.

## Code Snippet

After running the init command, `migrations/env.py` is generated. Since it specifies the configuration object, we will need to modify it a little bit. The code bellow illustrates that.

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

- **Lines 21 and 55** set `include_schema=True`.
- **Lines 22 and 57** pass a callable `include_object` that corresponds to the function at 4th line.
- **Line 3** is our callable that specifies whether Alembic should consider or not the object in question. Pay attention that in the 5th line we check whether the object has a schema attribute. Finally lines 6 and 7 compare the schema wih the one configured in the SQLAlchemy models.
