---
title: "Set up a development environment for GNOME software"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

In this article, we will be setting up an development environment for GNOME software in this article.
Such an environment is a good starting point if you want to become a contributor to the GNOME community,
or do source code analysis on GTK/GIO/GLIB-based software.

We will end up with a GNOME infrastructure in the form of shared objects that
1. are built from the latest git commits;
2. are debugging-friendly: rich in debugging information with un-optimized directives and variables
4. depend on each other instead of on any OS stock gnome library release.

## Building the Infrastructure

`meson` and `ninja` are required. GNOME used to support CMAKE
Another commonly missing dependency I find is the `packaging` python module [https://archlinux.org/packages/extra/any/python-packaging/].

### GLIB, GObject and GIO

Although the `glib`, `gobject` and `gio` libraries are released as separate shared objects, plus glib does not depend on the latter 2,
their codes are maintained in the same [GLib repository](https://gitlab.gnome.org/GNOME/glib), and thus must be built in the same trip.

### GTK

### GTKMM

