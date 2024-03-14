## .shstrtab

String table of strings used in the SHT, i.e. section names.

This section is not supposed to be stripped in any type of ELF file (relocatables, executables, shared objects).
Removing this section is not possible without hacking - `objcopy` and `strip` won't do.

A corrupted `.shstrtab` in a `.o` file won't prevent it from being linked into an executable or SO, but 
some sections / segments may be incorrectly merged, 
since Section names of a relocatable is important to the linker
Section names are significant in that special section, identified by their name, 
e.g. `.text`, are significant when the linker is merging `.text`.

## symbols

ELF has 2 symbol tables. The primary reason for needing  2  is because the dynamic one must be readable by the `ld.so` thus must go into a `LOAD` segment, and the static one does not.

ELF spec allows all 4 types to have 1 or both.
But usually:
- a reloctable (`.o`) contains only `.symtab`
- an executable contains none
- an shared object `.so` contains only `.dynsym`

### .symtab & .strtab

The static symbol table. &  string table of strings used in `.symtab`, i.e. symbol names.
- it mainly contain many symbols unnecessary for dynamic linking (won't be read by `ld.so`)
-

These 2 sections 
1. always appears in an `.o` file (relocatables), and 
2. will be `strip`-ed by default, regardless of the ELF file type.
