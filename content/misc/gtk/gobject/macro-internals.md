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

