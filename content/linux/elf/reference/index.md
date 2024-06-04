---
title: "Memorandum: ELF File Format"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- ELF
- Linux
- Unix
---

This article gives an overview of the ELF binary file format.

<!--more-->

## Overview

There are 4 types of ELF files (defined by `e_type` enum below), all sharing the same ELF layout in the following diagram,
with the exception that *ELF Relocatables* (`ET_REL`, i.e. `.o` files) don't have the program header table:

{{<figure src="./elf.drawio.svg" caption="ELF layout overview.">}}

The ELF specification:
- mandates that the ELF header must appear at the beginning of the file.
- allows arbitrary ordering and file offset of the PHT, SHT, and sections, although all known assemblers & linkers put the PHT (if present) immediately after the ELF header, and SHT before the end of the file.

## Data Types

The ELF specification defines 2 variants of ELF files, *ELF32* and *ELF64*, for delivering programs targeting 32-bit word-length CPU (e.g. protected mode x86/x86-64, ARM, etc) and 64-bit CPU (e.g. 64-bit mode x86-64, ARM64, etc).
ELF32 and ELF64 share most structure definitions and differ only by the size of pointers and file offset being 32 or 64 bits.

For most Linux distros, ELF-related structures are defined in the `/usr/include/elf.h` (from glibc).

Regardless of ELF32 or 64:
- `ELF*_Half` are 16-bit unsigned integers
- `ELF*_Word/ ELF*_Sword` are 32-bit unsigned / signed integers
- `ELF*_Xword/ ELF*_Sxword` are 64-bit unsigned / signed integers

```c
/* Type for a 16-bit quantity.  */
typedef uint16_t Elf32_Half;
typedef uint16_t Elf64_Half;

/* Types for signed and unsigned 32-bit quantities.  */
typedef uint32_t Elf32_Word;
typedef	int32_t  Elf32_Sword;
typedef uint32_t Elf64_Word;
typedef	int32_t  Elf64_Sword;

/* Types for signed and unsigned 64-bit quantities.  */
typedef uint64_t Elf32_Xword;
typedef	int64_t  Elf32_Sxword;
typedef uint64_t Elf64_Xword;
typedef	int64_t  Elf64_Sxword;

/* Type of addresses.  */
typedef uint32_t Elf32_Addr;
typedef uint64_t Elf64_Addr;

/* Type of file offsets.  */
typedef uint32_t Elf32_Off;
typedef uint64_t Elf64_Off;

/* Type for section indices, which are 16-bit quantities.  */
typedef uint16_t Elf32_Section;
typedef uint16_t Elf64_Section;

/* Type for version symbol information.  */
typedef Elf32_Half Elf32_Versym;
typedef Elf64_Half Elf64_Versym;
```

## ELF (File) Header

The ELF header contains the offset of the section header table (SHT) and program header table (PHT) (if present) in the file,
which in turn contains program headers and section headers that locate each section and segment.

The ELF header is defined as:

```c {tabWidth=8}
#define EI_NIDENT (16)

typedef struct
{
  unsigned char	e_ident[EI_NIDENT];	/* Magic number and other info */
  Elf32_Half	e_type;			/* Object file type */
  Elf32_Half	e_machine;		/* Architecture */
  Elf32_Word	e_version;		/* Object file version */
  Elf32_Addr	e_entry;		/* Entry point virtual address */
  Elf32_Off	e_phoff;		/* Program header table file offset */
  Elf32_Off	e_shoff;		/* Section header table file offset */
  Elf32_Word	e_flags;		/* Processor-specific flags */
  Elf32_Half	e_ehsize;		/* ELF header size in bytes */
  Elf32_Half	e_phentsize;		/* Program header table entry size */
  Elf32_Half	e_phnum;		/* Program header table entry count */
  Elf32_Half	e_shentsize;		/* Section header table entry size */
  Elf32_Half	e_shnum;		/* Section header table entry count */
  Elf32_Half	e_shstrndx;		/* Section header string table index */
} Elf32_Ehdr;

typedef struct
{
  unsigned char	e_ident[EI_NIDENT];	/* Magic number and other info */
  Elf64_Half	e_type;			/* Object file type */
  Elf64_Half	e_machine;		/* Architecture */
  Elf64_Word	e_version;		/* Object file version */
  Elf64_Addr	e_entry;		/* Entry point virtual address */
  Elf64_Off	e_phoff;		/* Program header table file offset */
  Elf64_Off	e_shoff;		/* Section header table file offset */
  Elf64_Word	e_flags;		/* Processor-specific flags */
  Elf64_Half	e_ehsize;		/* ELF header size in bytes */
  Elf64_Half	e_phentsize;		/* Program header table entry size */
  Elf64_Half	e_phnum;		/* Program header table entry count */
  Elf64_Half	e_shentsize;		/* Section header table entry size */
  Elf64_Half	e_shnum;		/* Section header table entry count */
  Elf64_Half	e_shstrndx;		/* Section header string table index */
} Elf64_Ehdr;

```

### `e_ident[]`: The ELF Identification

The first 16 bytes of the ELF header (i.e. also the first 16 bytes of an ELF file)
are critical metadata about this ELF file.

{{<content/elf-sections/neo/e_ident>}}
    

### `e_type`

```c
/* Legal values for e_type (object file type).  */

#define ET_NONE		0		/* unknown file type */
#define ET_REL		1		/* Relocatable file */
#define ET_EXEC		2		/* Executable file */
#define ET_DYN		3		/* Shared object file */
#define ET_CORE		4		/* Core file */
#define	ET_NUM		5		/* Number of defined types */

#define ET_LOOS		0xfe00		/* OS-specific range start */
#define ET_HIOS		0xfeff		/* OS-specific range end */
#define ET_LOPROC	0xff00		/* Processor-specific range start */
#define ET_HIPROC	0xffff		/* Processor-specific range end */
```

- Interpretation of value in `[ET_LOOS, ET_HIOS]` are subjected to different `EI_OSABI`
- Interpretation of value in `[ET_LOPROC, ET_HIPROC]` are subjected to different `e_machine`

### `e_machine`

Target CPU ISA (instruction set architecture). Some examples are:

```c
/* Legal values for e_machine (architecture).  */

#define EM_NONE		 0	/* No machine */
#define EM_SPARC	 2	/* SUN SPARC */
#define EM_386		 3	/* Intel 80386 */

#define EM_ARM		40	/* ARM */

#define EM_X86_64	62	/* AMD x86-64 architecture */

#define EM_BPF		247	/* Linux BPF -- in-kernel virtual machine */
#define EM_CSKY		252     /* C-SKY */

#define EM_NUM		253
```

### `e_version`

The same as `e_ident[EI_VERSION]`, must be `EV_CURRENT=1`.

### `e_entry`

- For executable, `e_entry` holds memory address of the first instruction where the process start executing. Kernel will set the `PC` register to `e_entry` after loading is finished.
- Otherwise, this field must hold 0.

### `e_flags`

processor-specific flags associated with the file.
Semantics are upto the interpretation of `e_machine`.
Linux AMD64 doesn't use this field, and usually holds 0.

e.g. some valid value for ARM CPUs are :

```c
#define EF_ARM_RELEXEC		0x01
#define EF_ARM_HASENTRY		0x02
#define EF_ARM_INTERWORK	0x04
#define EF_ARM_APCS_26		0x08
#define EF_ARM_APCS_FLOAT	0x10
#define EF_ARM_PIC		0x20
```

while some valid value for Intel Itanium are:

```c
#define EF_IA_64_ABI64		0x00000010	/* 64-bit ABI */
```

Section Header Table (SHT) & Sections
-----------------

Sections define the link-time view of an ELF file.
A linker doesn't care about PHT or segments, which is discussed latter.

An ELF file is divided into *sections*. Adjacent sections are combined into *segments*.
The *section header table* describes the *section view* of an ELF file useful for the linker,
while the *program header table* describes the *segment view* useful for the kernel loader and dynamic linker.

This section explains how SHT works, and gives an introduction to various special sections.
See [ELF segments](#segments) for details on the segment view and program headers.

### Section Header Table

The SHT is a list of items each known as a section header.
A section header provides metadata about a section.
The location and size of the SHT within an ELF file can be determined by inspecting [the ELF header](#TODO):
- the offset of the SHT into an ELF file is given in `e_shoff`
- the size of each section header (in bytes) is given in `e_shentsize`
- The number of section headers in the SHT is given in `e_shnum`

The first section header in SHT must be full zero. *(with one exception for AMD64 when the `number of program headers >= 0xffff` (an outrageous number). Search for `PN_XNUM` [here](https://refspecs.linuxfoundation.org/elf/x86_64-abi-0.99.pdf) for details)*

The structure of each section header is defined as:

```c {tabWidth=8}
typedef struct
{
  Elf64_Word	sh_name;		/* Section name (string tbl index into .shstrtab) */
  Elf64_Word	sh_type;		/* Section type */
  Elf64_Xword	sh_flags;		/* Section flags */

  Elf64_Addr	sh_addr;		/* Section virtual addr at execution */
                          // ELF compiled for AMD64 should not use this field.

  Elf64_Off	sh_offset;		/* Section file offset */
  Elf64_Xword	sh_size;		/* Section size in bytes */

  Elf64_Word	sh_link;		/* Link to another section */
  Elf64_Word	sh_info;		/* Additional section information */

  Elf64_Xword	sh_addralign;		/* Section alignment */
  Elf64_Xword	sh_entsize;		/* Entry size if section holds table */
} Elf64_Shdr;
```

Most fields should be axiomatic, others are explained below.

{{<card "info">}}

**Not all mix-and-match of the values of these fields makes sense.**

The specification dictates a few special sections .

Usage of these special sections are very pervasive, to the extend that a compiler-

can only have fixed `sh_type`

Mainstream assemblers and linkers always create the same collection of sections with stereotyped patterns of types and flags.

The design of `sh_type` and `sh_flags` has become rather meaningless due to the fact that  Such patterns have become a , to the extent that
not all mix-and-match of `sh_type` and `sh_type` are meaningful, or some `sh_type` and `sh_flags` are only permitted for a section
that has a specific special name.

For example, ELF specification leaves it unspecified what if an `SH_SYMTAB` section is not named `.symtab`.

{{</card>}}

#### `sh_type` - section type

The type of data held in this section.
Lower values have standard, platform-independent semantics - see below.
- values in the range `0x60000000 ~ 0x6fffffff` are OS-specific
- values in the range `0x70000000 ~ 0x7fffffff` are processor-specific.
- values in the range `0x80000000 ~ 0x8fffffff` are reserved for applications and won't be used by the specification.

#### `sh_flags` - section attributes

This field is a collection of bit flags, OR-ed together, each known as an *attribute* of this section.
Its type is `Word` (i.e. 32 bits) for ELF32, but `Xword` (i.e. 64 bits) for ELF64.
The difference in bit length is not a problem, since only less than a dozen of flags are currently defined.
Lower bits have standard defined semantics, while the most significant 12 bits are OS-specific and processor-specific.


| `sh_flags`                      | semantics                                  | set example | unset example |
|---------------------------------|--------------------------------------------|-------------|---------------|
| `SHF_WRITE (1 << 0)`            | Writable                                   | `.data`     | `.rodata`     |
| `SHF_ALLOC (1 << 1)`            | Occupies memory during execution           | --TODO--    | --TODO--      |
| `SHF_EXECINSTR (1 << 2)`        | Executable                                 | --TODO--    | --TODO--      |
| `SHF_MERGE (1 << 4)`            | Might be merged                            | --TODO--    | --TODO--      |
| `SHF_STRINGS (1 << 5)`          | Contains nul-terminated strings            | --TODO--    | --TODO--      |
| `SHF_INFO_LINK (1 << 6)`        | `sh_info` contains SHT index               | --TODO--    | --TODO--      |
| `SHF_LINK_ORDER (1 << 7)`       | Preserve order after combining             | --TODO--    | --TODO--      |
| `SHF_OS_NONCONFORMING (1 << 8)` | Non-standard OS specific handling required | --TODO--    | --TODO--      |
| `SHF_GROUP (1 << 9)`            | Section is member of a group.              | --TODO--    | --TODO--      |
| `SHF_TLS (1 << 10)`             | Section hold thread-local data.            | --TODO--    | --TODO--      |
| `SHF_COMPRESSED (1 << 11)`      | Section with compressed data.              | --TODO--    | --TODO--      |





### Special




### `sh_offset` & `sh_size` - section's in-file location
