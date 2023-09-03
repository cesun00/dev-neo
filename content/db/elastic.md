---
title: "Elastic Search (MISC)"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- elk
- elastic
---

Glossary
---------
- node: a physical deployment of Elasticsearch on a single machine (or docker/VM deplyment)
- shard: a part of data consists of an logical index; You can have multiple shards, each belongs to different index, deployed on a single node.


## Excerpt

It’s often useful to index the same field in different ways for different purposes. For example, you might want to index a string field as both a text field for full-text search and as a keyword field for sorting or aggregating your data. Or, you might choose to use more than one language analyzer to process the contents of a string field that contains user input.

The analysis chain that is applied to a full-text field during indexing is also used at search time. When you query a full-text field, the query text undergoes the same analysis before the terms are looked up in the index.

## sharding

There are two types of shards: primaries and replicas. Each document in an index belongs to one primary shard. A replica shard is a copy of a primary shard. Replicas provide redundant copies of your data to protect against hardware failure and increase capacity to serve read requests like searching or retrieving a document.


