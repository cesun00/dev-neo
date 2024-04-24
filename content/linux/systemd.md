

## Overview


- unit: vertex in the dependency graph
- job: a request for state change to a unit; each unit has a job queue.
<!-- - transaction:  -->

11 types of units:

| unit type | man page               |                                                                                                                                  | Notable instance                                                                       |
|-----------|------------------------|----------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| Service   | `systemd.service(5)`   | - which start and control daemons and the processes they consist of.                                                             | privoxy.service                                                                        |
| Socket    | `systemd.socket(5)`    | Start another `.service` unit when certain socket has incoming traffic, i.e. `inetd` replacement                                 | `dbus.socket`                                                                          |
|           |                        | - which encapsulate local IPC or network sockets in the system, useful for socket-based activation.                              |                                                                                        |
|           |                        | - For details about socket units, see ... , for details on socket-based activation and other forms of activation, see daemon(7). |                                                                                        |
| Target    | `systemd.target(5)`    | `.target` solely exists to be pulled in as dependencies of other units. Serve as synchronization points during parallel boot-up. | `graphical.target`                                                                     |
| Device    | `systemd.device(5)`    | - expose kernel devices in systemd and may be used to implement device-based activation.                                         | `sys-devices-pci0000:00-0000:00:02.4-0000:04:00.0-nvme-nvme1-nvme1n1-nvme1n1p2.device` |
| Mount     | `systemd.mount(5)`     | Mount a (real or virtual) filesystem.                                                                                            | -.mount                                                                                |
| Automount | `systemd.automount(5)` | On-demand mounting: start a `.mount` unit when certain path is accessed. (parallelized boot-up)                                  | roc-sys-fs-binfmt_misc.automount                                                       |
| Timer     | `systemd.timer(5)`     | - are useful for triggering activation of other units based on timers.                                                           | fuck.timer                                                                             |
| Swap      | `systemd.swap(5)`      | - are very similar to mount units and encapsulate memory swap partitions or files of the operating system.                       | fuck.swap                                                                              |
| Path      | `systemd.path(5)`      | Watch certain FS path, and start other units when watched FS object change.                                                      |                                                                                        |
| Slice     | `systemd.slice(5)`     | - may be used to group units which manage system processes (such as service and scope units)                                     | system.slice                                                                           |
|           |                        | - in a hierarchical tree for resource management purposes.                                                                       |                                                                                        |
| Scope     | `systemd.scope(5)`     | - are similar to service units, but manage foreign processes instead of starting them as well.                                   | init.scope                                                                             |

## Unit lifecycle

### activeness

All types of systemd unit share these generic states (activeness):

```txt
    <----- deactivating <-----
    |                        |
inactive -> activating -> active
                |
                V
              failed
```

### loaded-ness

A unit are said to be "loaded into memory" or simply "loaded" if
- it's in *active* state
- it has an job queue
-
- some other loaded unit(s) depend on it

To the end user, this is rather a transparent (and weird and poor) design,
since not-yet-loaded unit will be loaded upon they are inspected e.g. by `systemctl status <not-yet-loaded unit>`, and immediately unloaded then, since it's not needed anymore.
This is why you always see `loaded` in the output of the above command.

*(Rant: Systmed people you're exposing a burdening internal concept that doesn't matter to end user and making schodinger's cat!)*

## Dependency & The workflow engine

- *requirement* dependency

    **UNORDERED** edge established via
    - `Requires=`,`RequiredBy=`
    - `Requisite=`, `RequisiteOf=`
    - `Wants=`, `WantedBy=`, and
    - `Conflicts=`, `ConflictedBy=`

- *ordering* dependency

    ordered edge established via `Before=` and `After=`

Unit file declare dependency on other units in its `[Install]` section.

Booting:
1. Start from `default.target`, compute the transitive closure following all directed edges formed by *forward requirement dependencies*.
2. 

Then systemd tries to parallelly start as much units as possible,
but repsect all the ordering dependencies.

> Also note that the majority of dependencies are implicitly created and maintained by systemd.
> In most cases, it should be unnecessary to declare additional dependencies manually, however it is possible to do this.

### Explicit Dependencies

### Implicit Dependencies

### Transaction

## CLI cheatsheet

### Edit vendor unit files

Many occasions admin may find it necessary to edit vanilla unit files provided by package vendors. Best practice suggested by systemd is to use the drop-in mechanism, and not touch the original unit file.

```sh
systemctl edit <unit name>

# Query vendor units which are extended by drop-in directories
systemd-delta
```

### Dump all known unit files

```
systemctl list-unit-files
```

### Dump all units in memory

regardless of whether the unit is from a unit file / an instantiated template / or programmatically generated.

```sh
# list active / jobs-pending / failed units
systemctl list-units <glob pattern>

# 
systemctl list-units --all <glob pattern>
```

### Print unit file by unit name

```sh
systemctl cat efi.mount
```

### list dependencies & dependants (i.e. reverse dependencies)

```sh
# list units that systemd-logind.service depends on
systemctl list-dependencies systemd-logind.service
# list units that depend on systemd-logind.service
systemctl list-dependencies systemd-logind.service --reverse
# Plot graph
systemd-analyze dot systemd-logind.service | dot -Tsvg > logind.svg
```

## cgroup interoperability

Systemd has moved away from cgroup v1. Only cgroupv2 behavior is discussed.

If a unit spawn a process (e.g. service `ExecStart=`), systemd fork-exec the process into a new cgroup named after that unit.

Processes spawned by each service unit live in their own cgroup named after the service unit.
