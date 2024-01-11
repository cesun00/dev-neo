---
title: "GObject"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## Misc

Gobject is single-inherited.

To register a custom type `Bar` in project `Foo`, usually you need to define a `struct FooBar` and a `struct FooBarClass`. 

- The prior is known as the instance struct, which contains fields that actually make up the size of each instance of your type.
- The later is known as the class structs, which holds "member functions", i.e. pointers-to-functions.

Custom types that follow the above conventions are said to be "classed" type, i.e. the `struct *Class` is there.

## mechanics

Like C++, fields of base type become part of the derived type,
and member function of base type is callable from derived type instance.

To achieve these,
- `struct FooBase` must be the first fields of `struct FooDerived`, and
- `struct FooBaseClass` must be the first member of `struct FooDerivedClass`.

Further, we hope that `FooBase.fieldA` can be referred as `FooDerived.fieldA`,
just like in native OO languages. This is achieved by forcefully casting a `FooDerived *`  to `FooBase *` (i.e. pointer reinterpret).
Now a `FooDerived` instance can be used as a `FooBase` instance safely, due to base being the first member.

`GObject` and `GObjectClass` are the base instance / class struct of all classed type. To 

## HOWTO

## To register a new final GType:

1. In header: `G_DECLARE_FINAL_TYPE(FooBar, foo_bar, FOO, BAR, <base>)`, where `<base>` is name of the instance struct of the type to derive from, e.g. `GObject`.
2. In .c file: implement your instance struct `struct _FooBar`: put all field in a single structure in .c file, i.e. no divison into public / private field
3. In .c file: `G_DEFINE_TYPE(FooBar, foo_bar, <flag>)`, where `<flag>` ...
4. In .c file: implement
   1. `static void foo_bar_class_init(FooBarClass *)` and 
   2. `static void foo_bar_init(FooBar *)`


## To register a new derivable GType:

write public structure (in header file) + private structure (in .c file)

Use `G_DECLARE_DERIVABLE_TYPE` in header, and `G_DEFINE_TYPE_WITH_PRIVATE` in sources

## GType

Each `GType` is represented by `GtypeInfo` structure:

```c
typedef struct _GTypeInfo {
   // interface types, classed types, instantiated types
   guint16                class_size;

   GBaseInitFunc          base_init;
   GBaseFinalizeFunc      base_finalize;

   // classed types, instantiated types
   GClassInitFunc         class_init;
   GClassFinalizeFunc     class_finalize;
   gconstpointer          class_data;

   /* instantiated types */
   guint16                instance_size;
   guint16                n_preallocs;
   GInstanceInitFunc      instance_init;

   /* value handling */
   const GTypeValueTable *value_table;
} GTypeInfo;
```

To register a new type, use one of:
1. `g_type_register_static()`
2. `g_type_register_dynamic()`
3. `g_type_register_fundamental()`.
   - Register a new fundamental type like `TODO`, etc. It's not likely to be used by application developers.

## Macros Internals

For custom GType `Bar` of application `Foo`


Misc
1. If B inherits from A, is B's base_init 

GTypes
----------------
                    classed                 non-classed
instantiable        GOBJECT                 no such thing
non-instantiable    abstract/interface      fundamentals

G_TYPE_FUNDAMENTAL_SHIFT = 2
    
`G_TYPE_FUNDAMENTAL_MAX = 255<<GTFS = 255<<2`

at most 255 fundamental type.
a static array of length 255 of type `TypeNode*` is there to store info of fundamental types.
GType id greater than 255<<2 = 1020 is reserved for derived types.

-------------------------------
        G_TYPE_FLAG_
// GTypeFundamentalFlags
0       CLASSED
1       INSTANTIATABLE
2       DERIVABLE
3       DEEP_DERIVABLE
// GTypeFlags
4       ABSTRACT
5       VALUE_ABSTRACT
// unused
-------------------------------

