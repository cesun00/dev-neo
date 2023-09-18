A *hierarchy* is a division of all processes on the system into groups.
A hierarchy created by mounting a `tmpfs` on an arbitrary mounting point, then creating subdirectories as mounting point and mount `cgroup` VFS instances representing different controller:

```sh
ROOTDIR=cgroup1_root_1
mkdir $ROOTDIR
mount -t tmpfs dummy $ROOTDIR
# mounting cgroup VFS instances for different controllers by passing different -o argument
mkdir cpuset
mount -t cgroup -o cpuset dummy ./cpuset
```

Within this cgroup VFS for `cpuset` controller, you can start organize the processes into cgroups:

```sh
cd cpuset
mkdir foo_group     # kernel populates foo_group/* files
echo $$ > foo_group/tasks        # moving the shell into this `foo_group` cgroup
```

