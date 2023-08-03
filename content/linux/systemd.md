

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
e.g. `/sys/fs/cgroup/system.slice/NetworkManager.service` is the cgroup holding the processes of gnome's NetworkManager.

## Critical Units

## `default.target`

The target to reach on each boot. Usually `[Install].aliases`-ed of `multi-user.target` or `graphical.target`, but it's the admin's discretion to make whatever it is.

### logind

`systemd-logind.service` is *wanted* by `multi-user.target`:

```sh
# ls /usr/lib/systemd/system/multi-user.target.wants/
dbus.service  systemd-ask-password-wall.path  systemd-user-sessions.service
getty.target  systemd-logind.service
```

Unit file `/usr/lib/systemd/system/systemd-logind.service` defines the service. It will start the binary:

```ini
# ...
ExecStart=/usr/lib/systemd/systemd-logind
```


## The boot target

systemd boot to the first target found in:

1. Kernel parameter `systemd.unit=<target name>`
2. Symlink of `/etc/systemd/system/default.target`

    Admin should change this link if changing the boot target is desired.

3. Symlink of `/usr/lib/systemd/system/default.target`

    Distro vendor provide this link, and modification is not recommended.

```sh
# query computed boot target
systemctl get-default
# change or create /etc/systemd/system/default.target
systemctl set-default <target name>
```

## auto-generated unit

1. For each mount point `/foo/bar` defined in `/etc/fstab`, a `foo-bar.mount` unit will be generated, with the exception of the root fs becoming `-.mount`.
2. For each device (?), . e.g. `sys-devices-pci0000:00-0000:00:01.1-0000:01:00.0-nvme-nvme0-nvme0n1-nvme0n1p5.device` is partition for my root fs, and
`sys-devices-pci0000:00-0000:00:01.2-0000:02:00.0-0000:03:05.0-0000:06:00.0-net-enp6s0.device` and `sys-subsystem-net-devices-enp6s0.device` are for the ethernet NIC.

## Compatibility with SysVinit

1. systemd can parse initrc scripts as an alternative config file format.
2. The old `init` is now symlink to the `systemd` executable:

    ```sh
    # ls -hl `which init`
    lrwxrwxrwx 1 root root 22 Apr 29 03:36 /usr/bin/init -> ../lib/systemd/systemd
    ```
3. Modern distros may choose not to provide the `telinit` symlink to `systemd`.
4. Several old executables / scripts from SysVinit is now symlink to `systemctl`:

    ```sh
    # find -L /usr/bin -samefile `which systemctl` -exec ls -l {} +
    lrwxrwxrwx 1 root root      9 Apr 29 03:36 /usr/bin/halt -> systemctl
    lrwxrwxrwx 1 root root      9 Apr 29 03:36 /usr/bin/poweroff -> systemctl
    lrwxrwxrwx 1 root root      9 Apr 29 03:36 /usr/bin/reboot -> systemctl
    lrwxrwxrwx 1 root root      9 Apr 29 03:36 /usr/bin/shutdown -> systemctl
    -rwxr-xr-x 1 root root 272768 Apr 29 03:36 /usr/bin/systemctl
    ```
5. SysVinit runlevels that held a defined meaning (i.e., 0, 1, 3, 5, and 6) have a 1:1 mapping with a specific systemd target, but user-defined runlevels 2 and 4 don't have a corresponding systemd target.

## Unit file disovery & precedence

Unit files are searched orderly in a list of paths determined at compilation time. To change it you need to change `src/core/systemd.pc.in::systemd_system_unit_path` and hack into `src/basic/path-lookup.c::lookup_paths_init()`.

`man 5 systemd.unit $ UNIT FILE LOAD PATH` is hardcoded, but is generally faithful for distros that aren't heavily modified.

To dump the exact paths from a running instance, use

```sh
# for pid 1
systemd-analyze --system unit-paths
# for systemd user instance of current login user
systemd-analyze --user unit-paths

# or equivalently
# for pid 1
systemctl show --property=UnitPath | tr ' ' '\n'
# for systemd user instance of current login user
systemctl --user show --property=UnitPath | tr ' ' '\n'
```

Conventionally, for the system instance, 2 main locations are:
- `/usr/lib/systemd/system/`: units provided by distro vendor and later installed packages, used by the system instance.
- `/etc/systemd/system/`: units authored by the system admin, used by the system instance.

For the user instance, are:
- `~/.config/systemd/user/`: units authored by current user, and used by the user instance of current user.
- `/usr/lib/systemd/user/`: units provided by distro vendor and later installed packages, may be used by the systemd user instance of all users. 
- `/etc/systemd/user/`: units authored by the system admin, may be used by the systemd user instance of all users. 

## unit file naming

file name of unit files must conform to the pattern `prefix[@].suffix`:

- prefix is `[a-zA-Z0-9]` plus `[:-_.\]`; i.e multiple dot-separated segments is allowed, e.g. `dbus-org.freedesktop.network1.service`.
- presence of `@` makes it a *unit template file*.
- suffix must be one of `service|socket|target|device|mount|automount|timer|swap|path|slice|scope`, corresponding to 11 unit types, and determines which type the unit belongs to.


## misc

### unit template

The argument (a.k.a instance name) is refered by `%i` in unit files.

### Drop-in Directory


All `*.conf` inside `foo.service.d/` directory will be merged into `foo.service` (or become, if no such file exist).

> This is useful to alter or add configuration settings for a unit, without having to modify / parse existing unit files.

### Dependency Aux Directory

For `foo.service`,
- all symlinks in `foo.service.wants` are treated as `Wants=`
- all symlinks in `foo.service.requires` are treated as `Requires=`

> This functionality is useful to hook units into the start-up of other units, without having to modify their unit files.

> The preferred way to create symlinks in the .wants/ or .requires/ directory of a unit file is by embedding the dependency in `[Install]` section of the target unit, and creating the symlink in the file system with `systemctl enable | preset`.


## Writing Unit File

### Common Configs

`[Unit]` and `[Install]` sections are common for of all 11 types of units.


#### `[Unit]` notable options

- `Alias=foo,bar`

    space-separated list of alias name. Upon `systemctl enable`, 

- `Wants=`, `WantedBy=`

    "Start"

    space-separated list of weak dependencies on other units.

    Weak dependencies should start if the configuring unit starts. But if any weak dependencies failed to start, 

- `Requires=`, `RequiredBy=`

    "What must already be running if the current unit is to be started."
