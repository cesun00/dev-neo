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

