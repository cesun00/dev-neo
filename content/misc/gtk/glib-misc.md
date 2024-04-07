The main event loop
==============

`GSource` instances represent event source of all possible kinds.

A `GtkMainContext` instance is associated with multiple `GSource`s by calling `g_source_attach(source, context)`.

One creates a `GMainLoop` instance out of a `GtkMainContext`. Calling `g_main_loop_run()` on it will keep polling on all `GSource` s and dispatching control flow to correct handler.

## `GSource`

Each `GSource` instance consists of 4 functions, defined by `GSourceFuncs`. They will be frenquently queried by the main loop:

- `gboolean prepare     (GSource*, gint       *timeout_)`
- `gboolean check       (GSource*)`
- `gboolean dispatch    (GSource*, GSourceFunc callback, gpointer    user_data)`
- `void     finalize    (GSource*) `

Usually user won't implement their own `GSource` from scratch (i.e. calling `g_source_new` with configured `GSourceFuncs`).
Instead they uses the source type shipped with glib:

1. `g_idle_source_new(gbooelan oneshot)`     idle event logically happens when ever queried
2. `g_child_watch_source_new(GPid)`          child process event happends when specified pid report an event.
3. `g_timeout_source_new` / `g_timeout_source_new_seconds`  timeout event happends when specified milliseconds / seconds elapse.
4. `g_unix_fd_source_new`            when poll return for fd
5. `g_unix_signal_source_new`        `signalfd(2)` style UNIX signal handling.

Since glib structs are out of the GType/GObject infrastructure, we don't have subclass of `GSource` for different type of event source.
Instead, heterogeneous source types are all represented by `GSource` instance - i.e. all these free functions above return a pointer to `GSource*` structure.

More or less, this make `GSource` API a chimera, anyway.

Each `GSource` is assigned with priority of signed integer: 0 is the default, negatives are of higher priority, and positives are of lower.

## `GMainContext`

- There is a process-wide `GMainContext` instance maintained via a function-local static pointer `g_main_context_default()::default_main_context`, commonly referred to as the "global default `GMainContext`". Calling `g_main_context_default()` obtains this singleton.
- Each thread has its own stack of `GMainContext` instances maintained via a thread-local instance of `GPrivate` called `thread_context_stack` as static global in `gmain.c`. Stack of each thread is empty at the beginning. The top of the stack of each thread is known as the "thread default `GMainContext`" of that thread.
  - Calling `g_main_context_push_thread_default(GMainContext *)` pushes to the stack of the caller's thread;
  - Calling `g_main_context_pop_thread_default(GMainContext *)` verifies the argument is the stack top of the caller's thread, and pop if true. Otherwise no-op with a warning printed;
  - Calling `g_main_context_get_thread_default(void)` peeks the top of stack of the caller's thread without increasing the refcount, or return `NULL` if the stack is empty.
  - Calling `g_main_context_ref_thread_default(void)` peeks the top of stack of the caller's thread, **or return the global default `GMainContext` instance if the stack is empty**. Regardless which instance is selected, its `refcount++`.

The API above is designed to facilitate nested main loop, a pattern which is now [deprecated (at least by GTK4 developers)](https://docs.gtk.org/gtk4/migrating-3to4.html#stop-using-blocking-dialog-functions).

Many convenience function implicitly work with this instance.
Common ones are the `g_XXX_add[_full]()` convenience functions for the event source type mentioned above. e.g.

```c
// convenience function for g_timeout_source_new() + g_source_attach( /*g_main_context_default()*/ ) + g_source_set_callback()
guint g_timeout_add ( guint interval, GSourceFunc function, gpointer data )

// ditto, with finer control
guint g_timeout_add_full ( gint priority, guint interval, GSourceFunc function, gpointer data, GDestroyNotify notify )
```



## `GMainLoop`

A `GMainLoop` instance is simply
- a reference to a `GMainContext`, plus
- a boolean flag indicating whether loop should quit after the current iteration

It's main purpose to provide object-based API e.g. `g_main_loop_run()` whose business logics of repetitively calling iteration on `GtkMainContext` that really matter,

But still, this class isn't as useful as its name suggests.
GTK4 simply doesn't use this class, and calls `gtk_main_context_iterate()` in GTK4 code's own `while` loop.


Weak reference
============
