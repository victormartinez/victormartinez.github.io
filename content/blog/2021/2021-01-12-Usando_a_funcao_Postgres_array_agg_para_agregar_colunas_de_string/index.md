---
layout: post
title: Usando a função Postgres::array_agg para agregar colunas de string
category: Databases
date: 2021-01-12T00:00:00
tags: [postgres, array, agg, function, sqlalchemy]
image: featured.png
language: pt
---

Graças a [@copquevictor](https://twitter.com/copquevictor) eu aprendi uma função de agregação muito útil do Posgres: **array_agg**. Para entendê-las, vamos supor que você tenha que notificar interessados em relatórios e sua query fornece como saída a tabela abaixo:

```markdown
| Report    | Email                  |
| --------- | ---------------------- |
| Report #1 | johndoe@gmail.com      |
| Report #1 | jack@gmail.com         |
| Report #2 | contact@lisadesign.com |
| Report #3 | harry@hogwarts.com     |
| Report #3 | anderson@gmail.com     |
```

Como você pode ver, nós temos uma relação Um-para-muitos: um relatório é de interesse de um ou mais emails. Você pode notificar os emails por meio (i) da iteração dos registros (um por um) **OU** (ii) você pode agrupar os emails por relatório. Para o segundo caso, não seria legal obter os resultados abaixo?

```
| Report    | Email                                    |
|-----------|------------------------------------------|
| Report #1 | [johndoe@gmail.com, jack@gmail.com]      |
| Report #2 | [contact@lisadesign.com]                 |
| Report #3 | [harry@hogwarts.com, anderson@gmail.com] |
```

Graças a **[array_agg](https://www.postgresql.org/docs/13/functions-aggregate.html)** isso pode ser realizado. Para nossa tabela fictícia, a query seria algo parecido com a query abaixo:

```sql
SELECT reports.id, array_agg(stakeholders.email) FROM reports
INNER JOIN stakeholders ON reports.id = stakeholders.report_id
GROUP BY reports.id;
```

Preste atenção que você **tem que fornecer a cláusula GROUP BY** a fim de agregar os emails.

```python
from sqlalchemy import String
from sqlalchemy.sql.functions import array_agg
from sqlalchemy.dialects.postgresql import ARRAY

from models import Stakeholder, Report

def execute():
    emails_agg = array_agg(Stakeholder.email, type_=ARRAY(String)).label(
        "emails"
    )
    return (
        db.session.query(Report, emails_agg)
        .join(Stakeholder)
        .group_by(Report.id)
        .all()
    )
```

Bem útil, não acha?

### Referências:

- [Stackoverflow: SQLAlchemy, PostgreSQL and array_agg: How to select items from array_agg?](https://stackoverflow.com/questions/23261944/sqlalchemy-postgresql-and-array-agg-how-to-select-items-from-array-agg)
