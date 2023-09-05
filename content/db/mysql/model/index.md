---
title: "SQL ER Model"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- SQL
- mysql
- database
---

Entity-Relationship Model
-----------

Note for terminology: In the original research by Peter Chen, "entity" is an instance of an "entity-type". There, each entity-type corresponds to 1 table, each row in the table is an "entity", i.e. instance of entity-type. But for simplicity people now just use "entity" for "entity-type".

> Because the term entity-type is somewhat cumbersome, most people tend to use the term entity as a synonym for this term. <cite>-- [wikipedia](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model)</cite>

Below we use "entity" for "entity-type" and "an instance of entity" for "entity".

### Entity and Relationship

Entities can be thought of as "nouns", e.g. a computer (a physically existing thing) or a livehouse event (logically entity).

Relationship can be thought of as "verbs" between/among 2 or more entities, e.g. an artist performs multiple songs.

### Participation

The "participation" between **an entity** and **an relationship** describes whether **every** instance of the entities join the relationship.

![](./participation.jpg)

For example, each load record must correspond to a customer, i.e. `Loan` has **"total participation"** in the relationship `borrower`. But not all customer borrow loan, so `Customer` has **"partial participation"** in the relationship `borrower`.

