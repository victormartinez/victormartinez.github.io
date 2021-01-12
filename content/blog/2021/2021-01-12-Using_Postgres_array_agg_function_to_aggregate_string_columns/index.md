---
layout: post
title: Using Postgres::array_agg function to aggregate string columns
category: Databases
date: 2021-01-12T00:00:00
tags: [postgres, array, agg, function, sqlalchemy]
image: featured.png
image_url: https://unsplash.com/photos/QJbyG6O0ick
image_author: Nam Anh
language: en
---

Thanks to [@copquevictor](https://twitter.com/copquevictor) I learned a very handy Postgres aggregate function: **array_agg**. To understand it, suppose you have to notify stakeholders of reports and your query outputs the table below:

```markdown
| Report    | Email                  |
| --------- | ---------------------- |
| Report #1 | johndoe@gmail.com      |
| Report #1 | jack@gmail.com         |
| Report #2 | contact@lisadesign.com |
| Report #3 | harry@hogwarts.com     |
| Report #3 | anderson@gmail.com     |
```

As you can see, we have a One-to-Many relationship: one report is of interest of one or more emails. You can notify the emails by (i) iterating over the rows (one by one) **OR** (ii) you can group the emails by the report. For the second case, wouldn't it be nice to obtain the result below?

```
| Report    | Email                                    |
|-----------|------------------------------------------|
| Report #1 | [johndoe@gmail.com, jack@gmail.com]      |
| Report #2 | [contact@lisadesign.com]                 |
| Report #3 | [harry@hogwarts.com, anderson@gmail.com] |
```

Thanks **[array_agg](https://www.postgresql.org/docs/13/functions-aggregate.html)** that can be accomplished. For our fictional table, the query would be something like the query below:

```sql
SELECT reports.id, array_agg(stakeholders.email) FROM reports
INNER JOIN stakeholders ON reports.id = stakeholders.report_id
GROUP BY reports.id;
```

Pay attention that you **must provide a GROUP BY** clause in order to aggregate the emails.

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

Pretty handy, right?

### References:

- [Stackoverflow: SQLAlchemy, PostgreSQL and array_agg: How to select items from array_agg?](https://stackoverflow.com/questions/23261944/sqlalchemy-postgresql-and-array-agg-how-to-select-items-from-array-agg)
