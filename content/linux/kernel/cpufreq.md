---
title: "CPU Frequency Control"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

https://www.kernel.org/doc/html/v5.8/admin-guide/pm/cpufreq.html

The "cpufreq" subsystem manages the cpu frequency scaling.

It consists of three layers of code:

1. the core - a general framework for governors and drivers to be implemented.
2. scaling governors - algorithms that estimate required CPU capacity and send request to driver to adjust p-state.
    > "As a rule, each governor implements one, possibly parametrized, scaling algorithm"
3. scaling drivers - talk to hardware; provide a unified API to governor algorithm

**IMPORTANT: only one driver can registered at a time, and it's expected to handle all CPUs available.**

The most important data type in cpufreq: `struct cpufreq_policy`

A `struct cpufreq_policy` instance describe:

1. A set of CPUs (potentially only 1) that share the same p-state (i.e. limited by the hardware design and can't use different p-state)
2. Scaling parameter that are supported by the hardware, like min and max cpu frequency, and available p-states
