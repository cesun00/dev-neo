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

The storage of a single topic is partitioned (i.e. sharded) into multiple broker server instances.
Such design allows client applications to both read and write the data from/to many brokers at the same time.

Think about each partition of a topic as a FIFO buffer (i.e. a queue).
When a new event is published to a topic, it is actually appended to one of the topic's partitions.
Events with the same *event key* (e.g., a customer or vehicle ID) are written to the same partition, and Kafka guarantees that any consumer of a given partition (of a fixed topic) will always read that partition's events in exactly the same order as they were written.

## Replica

Every topic can be replicated.
Each partition of a replicated topic has 2 or more copies among different broker instances; availability improved.

A common production setting is a replication factor of 3, i.e., there will always be three copies of your data. This replication is performed at the level of topic-partitions.

## Run Kafka

Get Kafka from https://kafka.apache.org/downloads.
There is a Scala runtime embedded in each release, whose version doesn't matter in all cases even if you are a Scala programmer and have Scala dev kits installed on your computer.

Broker instances in a Kafka cluster need a registration center to discover each other and communicate configurations.
Kafka supports using either ZooKeeper or KRaft for that.

### Standalone

