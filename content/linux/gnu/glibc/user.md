---
title: "GLIBC UNIX User Admin APIs"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

POSIX / glibc API for consulting the system user registry. On modern Linux PC desktop this is usually the `/etc/passwd` file, but really that depends on the PAM module used, e.g. might be a database TCP connection or something.

Another example is android's C runtime implementation "bionic", which has certain numerically smaller UID (< `AID_APP_START`) predefined and hardcoded as compile time constants, while allowing numerically larger UID to be added as the system operates.

https://android.googlesource.com/platform/system/core/+/refs/heads/master/libcutils/include/private/android_filesystem_config.h

```c
#define AID_APP_START 10000 /* first app user */
```


```c
// pwd.h
struct passwd {
    char   *pw_name;       /* username */
    char   *pw_passwd;     /* user password */
    uid_t   pw_uid;        /* user ID */
    gid_t   pw_gid;        /* group ID */
    char   *pw_gecos;      /* user information */
    char   *pw_dir;        /* home directory */
    char   *pw_shell;      /* shell program */
};
```

### System user registry lookup: `getpwnam`, `getpwuid`

```c
struct passwd *getpwnam(const char *name);  // get passwd by user name
struct passwd *getpwuid(uid_t uid);         // get passwd by uid
```

Both has a `_r`-suffixed re-entrant version.

### System user registry traversal: `getpwent` / `setpwend` / `endpwend`

Globally stateful triplet; Cursor initially points at one-prior-start position (TODO: for newly created process? The behavior across fork? exec?)

- `getpwent`: get the next `passwd*`, or `NULL` if the end is reached.
- `setpwend`: rewind cursor to the one-prior-start position.
- `endpwend`: close whatever resources used for reading the user registry.