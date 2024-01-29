---
title: "Shared Object Loading"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

1. The kernel upon receiving a `execve` syscalls first loads the ELF header into the memory to inspect the `e_entry` entrance point and
location and size of the PHT.
2. PHT is loaded into the memory (hopefully already done when loading the ELF header, since both structures reside at the beginning of an ELF file) to locate the `PH_DYNAMIC` segment.
3. The `Elf32_Dyn / Elf64_Dyn` array within that segment is inspected for the following information
   1. offset and size of `.strtab`, for string table of library names and SONAME;
   2. (`DT_NEEDED`) other shared objects this file depends on;
   3. offset of the dynamic symbol table (in section view's `.dynsym`), and offset and size of its companion string table (in section view's `.dynstr`), for symbols to import / export.
   4. (in section view's `.rela.dyn` and `.relr.dyn`), relocation table, offset, total size, and entry size 
   5. other ...TODO
4. `ld.so` preloads requested shared objects, specified as 
   1. `LD_PRELOAD` env var, if presented
   2. the `--preload` CLI option when invoking the dynamic linker directly.
   3. `/etc/ld.so.preload`, if exist
5. names of shared objects listed as `DT_NEEDED` are handled in the following way:

   - if the name starts with a slash (`/`), it's treated as an absolute path;
   - otherwise, if the name contains a slash (`/`), it's treated as a path relative to the current working directory;
   - otherwise (no slash), the shared object is searched in the following order, stop at the first one found:
      1. if `DT_RPATH` is present AND `DT_RUNPATH` is absent, the directory specified by `DT_RPATH`. The use of `DT_RPATH` field is deprecated.
      2. if not in "secure-execution" mode, directoies specified by env var `LD_LIBRARY_PATH`.
      3. if `DT_RUNPATH` is present, the directories specified by it.
      4. `/etc/ld.so.cache`, which maps unqualified soname to absolute FS path for all installed so libs.
      5. `/lib` or `/lib64`
      6. `/usr/lib` or `/usr/lib64`

   If the above procedure failed to locate an shared object, execution is abort.

5. ...
   
