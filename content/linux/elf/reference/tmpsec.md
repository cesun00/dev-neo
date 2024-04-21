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
3. are usually adjacent in an ELF file.

### .dynstr & .dynsym

## .dynamic

If an ELF file participates in dynamic linking, its PHT will have an item of type `PT_DYNAMIC` which locates a segment containing only 1 section, 
the `.dynamic` section.

The kernel and dynamic linker will not inspect the SHT (nor the ELF header other than the entry point and PHT location, you can break the ELF file header in any other way and still make an executable work)and is not aware of any information about sections at run time.
It obtain all its required information from `.dynamic`.
The `.dynamic` section (and its dedicated segment) is meant to be the dynamic-linker-oriented index page of this ELF file.

Consider this section the index page for dynamic linker.  
This is the first place `ld.so` should go first for any information.

<!-- This section and its dedicated segment will be inspected by the `ld.so` at run time. -->

This section contains very much information, as this is the only approach to provide information to the dynamic linker.
everything necessary for the dynamic linker to work, including
Among others, this section gives to the `ld.so`:
1. where is `.strtab`, for library names and SONAME indexes
2. what other shared objects are required by this file
3. where is `.dynsym` and (offset and size of `.dynstr`) , for symbols import / export
4. `.rela.dyn` and `.relr.dyn`, relocation table, offset, total size, and entry size.
5. misc
  - where to find `.init` / `.fini` / `.init_arrray` / `fini_array` section
  - the SONAME of this ELF file

`.dynamic` section always resides in that dedicated segment, and contains a list of the following structures:

```c
/* Dynamic section entry.  */

