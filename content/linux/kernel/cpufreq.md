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
3. The scaling governor used for CPUs managed by this policy.

The cpufreq core keeps, FOR EACH CPU, a pointer to a `struct cpufreq_policy` instance.

A new instance of `struct cpufreq_policy` is created every time cpufreq core is informed to handle a new CPU.

After created, the pointer to this instance is passed to cpufreq's driver's `init()` to get the fields in the instance filled

Then, if the governor layer is respected, i.e. the scaling algorithm bulitin in the scaling driver is not used:
    `init()` of the default governor, determined by kernel configuration, will be invoked.
    `start()` of the governor will register CPU utilization update callbacks with the majestic CPU scheduler 
Otherwise, we are using the scaling algorithm directly provided by the driver.
    `setpolicy()` of the driver will be invoked, for each policy instance, to register those CPU utilization update callbacks to CPU scheduler.


In `/sys/devices/system/cpu/cpufreq/policyX/`, entries prefixed by `cpuinfo_` describe hardware attribute or ability, e.g.
- cpuinfo_cur_freq      Current actual cpu speed acquired from the hardware
- cpuinfo_max_freq      The maximum frequency supported by the CPU; read only
- cpuinfo_min_freq      The minimum frequency supported by the CPU; read only

while entries prefixed by `scaling_` describe policy configuration, e.g.
- scaling_cur_freq      Kernel estimated current cpu frequency; Might be inaccurate.
- scaling_max_freq      The maximum frequency allowed by the policy; read-write
- scaling_min_freq      The minimum frequency allowed by the policy; read-write


For Intel Core Sandy Bridge (2nd gen core) and newer cpu, the scaling driver named `intel_pstate` is always used by the kernel.

On my arch linux the following builtin and external kernel module is found for `cpufreq`
```bash
[ced@ARCH3 ~]$ grep -i cpufreq /usr/lib/modules/5.8.10-arch1-1/modules.builtin
kernel/drivers/cpufreq/freq_table.ko
kernel/drivers/cpufreq/cpufreq_performance.ko
kernel/drivers/cpufreq/intel_pstate.ko
```

https://www.kernel.org/doc/html/v5.8/admin-guide/pm/intel_pstate.html

Since Skylake (6-th gen), a hardware implemented frequency scaling controller is builtin in the CPU, meaning that the kernel can now delegate the frequency scaling decision to the CPU itself. Intel's commercial name for this technology is "Speed Shift". Technically it's also known in the kernel community as HWP (Hardware Managed P-state).

For `intel_pstate` driver,
- Active mode mean the driver is bypassing the gorvernor layer, and directly talk to the scaling core & CPU scheduler.
    - HWP: ...
    - without HWP: ...
- Passive mean the gorvernor layer is there.


