---
title: "Pluggable Authentication Modules (PAM)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

> Linux-PAM (Pluggable Authentication Modules for Linux) is a suite of shared libraries that enable the
> local system administrator to choose how applications authenticate users.

> In other words, without (rewriting and) recompiling a PAM-aware application, it is possible to switch
> between the authentication mechanism(s) it uses. Indeed, one may entirely upgrade the local authentication
> system without touching the applications themselves.

## Overview & Politics stuff

The Open Software Foundation (OSF) was a non-profit industry consortium for standardization of unix-like OS.
OSF was found in 1988 and later became *The Open Group*. TOG works with IEEE people and created POSIX.

"PAM" was meant to be a standard spec by OSF, but the reception of this standardization is frustrating.
The only active implementation now is the Linux-PAM project.

The essence of *authentication* is to trust a user's claim about who he is, among all accounts known by the system.

Historically, if an application wants to authenticate a linux user, it must:
1. ask the confronting human for a pair of login and password
2. hash the password as described in `man 3 crypt`
3. parse `/etc/shadow` to find a matching `(uid, hashed password)` pair; which means application code must have read permission on `/etc/shadow`.

The problems:
1. All applications wanting to authenticate someone repeat the hashing and text parsing code.
2. Granting access to the shadow file is dangerous.
3. Application code and *authentication mechanism* is tightly coupled: it requires re-compilation if one day the application wants to
    - switch to a totally different asymmetric crypto based auth method based on `${HOME}/.ssh/authorized_keys`; or
    - authenticate against some other `/etc/foo` registry with a different syntax, or against a SQL table / mongodb collection; i.e. we don't even authenticate *linux user* anymore, it could be user account of some online business system.

PAM is designed to provide such flexibility:
1. Admin can change the "authentication mechanism" of an PAM-used app on the fly by modifying PAM config files, without even restarting the app's process.


With the ones found in upper directories overrides the ones of the same name found in lower directories:
- `/etc/pam.conf`: the configuration file
- `/etc/pam.d`: if this directory is present, the `/etc/pam.conf` file is ignored.
- `/usr/lib/pam.d`: the Linux-PAM vendor configuration directory. Files in /etc/pam.d override files with the
same name in this directory.
- If enabled, `<vendordir>/pam.d/*`; where `vendordir` is an optional directory specified at build time: `./configure --enable-vendordir=<vendordir>`



## lib calls

```
pam_getenvlist
pam_sm_authenticate
pam_acct_mgmt
pam_get_item
pam_sm_chauthtok
pam_authenticate
pam_get_user
pam_sm_close_session
pam_chauthtok
pam_info
pam_sm_open_session
pam_close_session
pam_misc_drop_env
pam_sm_setcred
pam_conv
pam_misc_paste_env
pam_start
pam_end
pam_misc_setenv
pam_strerror
pam_error
pam_open_session
pam_syslog
pam_fail_delay
pam_prompt
pam_verror
pam_get_authtok
pam_putenv
pam_vinfo
pam_get_authtok_noverify
pam_setcred
pam_vprompt
pam_get_authtok_verify
pam_set_data
pam_vsyslog
pam_get_data
pam_set_item
pam_xauth_data
pam_getenv
pam_sm_acct_mgmt
```


## modules

```
pam.8.gz                    pam_listfile.8.gz          pam_stress.8.gz
pam_access.8.gz             pam_localuser.8.gz         pam_succeed_if.8.gz
pam_canonicalize_user.8.gz  pam_loginuid.8.gz          pam_systemd.8.gz
pam_cifscreds.8.gz          pam_mail.8.gz              pam_systemd_home.8.gz
pam_debug.8.gz              pam_mkhomedir.8.gz         pam_systemd_loadkey.8.gz
pam_deny.8.gz               pam_motd.8.gz              pam_time.8.gz
pam_echo.8.gz               pam_namespace.8.gz         pam_timestamp.8.gz
