Final type combos
==============

## `G_DECLARE_FINAL_TYPE()`

1. DECLARED `foo_bar_get_type(void)`
   - `G_DEFINE_TYPE` in .c file will provide the implementation
   - By convention, users are expected to `#define FOO_TYPE_BAR foo_bar_get_type()`
2. typedef
   1. imcomplete `struct _FooBar` to `FooBar`; expecting user to define `struct _FooBar` later.
   2. a complete anonymous struct to `FooBarClass`. The struct holds only a `ParentObjectClass` field.
3. DEFINED
   1. `FooBar* FOO_BAR(gpointer)` pointer-to-instance casting function
   2. `gboolean FOO_IS_BAR(gpointer)` pointer-to-instance runtime type check

Plus, instance struct & class struct internal typedefs and freeing functions implementation.
Note the mixed snake and camel and the difference between `clear` (pointer) vs `cleanup`(pointer-to-pointer):

1. new typedef available:
   1. `FooBar_autoptr` & `FooBarClass_autoptr`
   2. `FooBar_listautoptr` & `FooBarClass_listautoptr`
   3. `FooBar_slistautoptr` & `FooBarClass_slistautoptr`
   4. `FooBar_queueautoptr` & `FooBarClass_queueautoptr`
2. DEFINE freeing functions:
   1. `static inline glib_autoptr_clear_FooBar(FooBar*)` & `static inline glib_autoptr_clear_FooBarClass(FooBarClass*)`
   2. `static inline glib_autoptr_cleanup_FooBar(FooBar**)` & `static inline glib_autoptr_cleanup_FooBarClass(FooBarClass**)`.
   3. `static inline glib_listautoptr_cleanup_FooBar(GList **)` & `static inline glib_listautoptr_cleanup_FooBarClass(GList **)`
   4. `static inline glib_slistautoptr_cleanup_FooBar(GSList **)` & `static inline glib_slistautoptr_cleanup_FooBarClass(GSList **)`
   5. `static inline glib_queueautoptr_cleanup_FooBar(GQueue **)` & `static inline glib_queueautoptr_cleanup_FooBarClass(GQueue **)`

## `G_DEFINE_TYPE()`

1. DECLARED `foo_bar_init(FooBar *)` and `foo_bar_class_init(FooBarClass *)`
   - will be registered as `instance_init` and `class_init` by `foo_bar_get_type`. User must implement these 2 later.
2. DEFINED `static GType foo_bar_get_type(void)`
   - with utility functions `foo_bar_get_type_once(void)` and `foo_bar_class_intern_init()` implementations
   - with auxillary translation-unit-local variable `FooBar_private_offset`
3. `static gpointer foo_bar_parent_class = ((void *) 0)`;

Derivable type combos
===============

Use `G_DECLARE_DERIVABLE_TYPE` in header file, with one of the follows in .c file:
1. `G_DEFINE_ABSTRACT_TYPE`, for abstract type (i.e. non-instantiable type, only intended to become base)
2. `G_DEFINE_TYPE_WITH_PRIVATE`, for instantiable type.

## `G_DECLARE_DERIVABLE_TYPE`

1. DECLARED `foo_bar_get_type(void)`
   - `G_DEFINE_ABSTRACT_TYPE` or `G_DEFINE_TYPE_WITH_PRIVATE` in .c file will provide the implementation
   - By convention, users are expected to `#define FOO_TYPE_BAR foo_bar_get_type()`
2. typedef
   1. **complete** `struct _FooBar` to `FooBar`; 
      - The struct holds only a `ParentInstance` field. To associate more fields with instance struct of derivable types, use `G_DEFINE_TYPE_WITH_PRIVATE` in .c file.
   2. incomplete `struct _FooBarClass` to `FooBarClass`;
3. DEFINED
   1. `FooBar* FOO_BAR(gpointer)` pointer-to-instance & `FooBarClass* FOO_BAR_CLASS(gpointer)` pointer-to-class casting function
   2. `gboolean FOO_IS_BAR(gpointer)` pointer-to-instance & `gboolean FOO_IS_BAR_CLASS(gpointer)` pointer-to-class runtime type check
   3. `TNumberClass* T_NUMBER_GET_CLASS(gpointer)` get class from instance

## `G_DEFINE_ABSTRACT_TYPE`

1. DECLARED `foo_bar_init(FooBar *)` and `foo_bar_class_init(FooBarClass *)`
   - will be registered as `instance_init` and `class_init` by `foo_bar_get_type`. User must implement these 2 later.
2. DEFINED `static GType foo_bar_get_type(void)`
   - with utility functions `foo_bar_get_type_once(void)` and `foo_bar_class_intern_init()` implementations
   - with auxillary translation-unit-local variable `FooBar_private_offset`
3. `static gpointer foo_bar_parent_class = ((void *) 0)`;

## `G_DEFINE_TYPE_WITH_PRIVATE`

Almost identical to `G_DEFINE_TYPE`, but additionally:
1. defined a static global gint `FooBar_private_offset`
2. and also initialize it (done by `G_ADD_PRIVATE` as snippet)
   
   ```c
   FooBar_private_offset = g_type_add_instance_private(
      g_define_type_id,
      sizeof(FooBarPrivate)
   );
   ```

3. **!important** DEFINED a static function `gpointer foo_bar_get_instance_private(FooBar*)` to retrieve private instance from public instance.

interface and implementation combo
=============

## `G_DECLARE_INTERFACE`

1. DECLARED `GType t_comparable_get_type(void);`;
   - will be later implemented by `G_DEFINE_INTERFACE` in .c file.
2. DEFINED:
   1. `TComparable* T_COMPARABLE(gpointer)` casting function
   2. `gboolean T_IS_COMPARABLE(gpointer)` type check function
   3. `TComparableInterface* T_COMPARABLE_GET_IFACE(gpointer)` TODO
3. typedef
   1. `struct _TComparable` to `TComparable`
   2. `struct _TComparableInterface` to `TComparableInterface`

## `G_DEFINE_INTERFACE`

1. DECLARED `void t_comparable_default_init(TComparableInterface *)`; User must provide implementation later.
2. DEFINED `GType t_comparable_get_type(void)`; which register `TComparable` type and use `t_comparable_default_init` as class_init function.
