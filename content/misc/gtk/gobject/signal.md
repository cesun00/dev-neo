Signal
===========

GType ships a simple pub-sub mechanism called signal. 

All GTypes can have signal associated with it. You don't need `GObject` or its subclass to enjoy this feature.

## declare acceptable signal name

Each class (type) `T` , during initialization, declare the "signals" (simply a name string) that **instances of `T`** can handle via `g_signal_new*()` family.
- All of them eventually calls `g_signal_newv()`,

## register signal handler
2. Party A registers one or more callbacks, known as "signal handler", for the signal **on a specific instance of `T`** via `g_signal_connect*()` family.

## emit signal

3. Party B "emits" the signal **on a specific instance of `T`** via `g_signal_emit*()` family, which invokes all currently registered signal handlers **in the same thread**.


Names of signals that a given type `T` can handle are mantained

Action
==============

Be aware that any instances of any type can have signals and signal handlers associated with it.

Such unbounded freedom of using signals facilitates the following  (arguably not well-documented) pattern: 
- party A registers type `T`, declare signal `S` on it, **and** connect a signal handler `SH` to a well-known instance `t` of `T`.
