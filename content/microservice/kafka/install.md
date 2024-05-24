---
title: "Kafka Deployment"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

The Kafka server is written in Scala, runs on JVM, and is distributed as a collection of JARs.

Kafka releases contains Scala runtimes, so a user don't need to 


Conceptually, an event has a key, value, timestamp, and optional metadata headers.

- A producer publish (write) events to a topic.
- A consumer subscribes to a topic to (read and process) these events.

Topics in Kafka are always multi-producer and multi-subscriber: a topic can have
- zero, one, or many producers that write events to it, as well as
- zero, one, or many consumers that subscribe to these events.

Eevents are not deleted after consumption

## Partition (Sharding)

