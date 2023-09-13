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
- party B expects `SH` to be invoked as long as it knows `t` the signal name `S` (a runtime string).

This is essentially a simple service locator pattern: a fancy way of calling certain function without known its symbol name at compile-time.
- It's very useful for app programmer to expose application's ability to the gnome DE ecosystem, e.g. provide media play controls to dashboard, or perform certain task when notification popup is clicked.
- Note how it's the type author who also connect signal handler for client, compare to the classic callback pattern, where type author only declare signal, and expect client to connect handler to it.

The take-away is, it doesn't even matter any more what the instance or its GType is.
It's whatever instance holding the signal handlers, that's all.

`GAction` is such an interface, whose implementation must:
1. support the signal name `"activate"` via `g_signal_new*("activate", ...)`
   - as an interface, `GAction` cannot itself declare signal
2. install the "four pieces of information" properties: namely:
   1. `"name"` string for a identifier for the action
   2. `"enabled"` boolean indicating whether the action is dead
   3. `"parameter-type"` the `GVariantType` of parameter
   4. `"state"` and `"state-type"`
3. override vfunc `GActionInterface::activate`, to which the free function `g_action_activate()` delegates properly.
   - within that overridden vfunc, signal `"activate"` must be emitted, so that signal handlers are invoked.

The most widely-used impl is `GSimpleAction`.

Group of `GAction`
---------------

Almost always, you want expose a group of (implementation of) `GAction` in a structural way, rather than talking about a single instance of `GAction`.

There are 2 types for such purpose, both being interface as well: 
- `GActionMap` (newer)
- `GActionGroup`

### `GActionMap` interface

`GActionMap` represent a map from action name to the `GAction` object itself.
It is a simple interface of 4 operations whose only concern is to perform fast CRUD on collection of `GAction`s by their name:

`g_action_map_...`:
- `add_action`
- `add_action_entries`
- `lookup_action`
- `remove_action`

The API feels like a set though, e.g. `g_action_map_add_action( GActionMap* action_map, GAction* action)` does take a name for the key.
The name is maintained within `GAction` as mentioned above, and queried via `g_action_get_name` upon its addition.

### `GActionGroup` interface

`GActionGroup` focus on invoking actions within the group, 


`GApplication` as `GActionGroup` / `GActionMap`
---------------

Personally I consider this an abuse of inheritance - 



Scope of actions
--------------------

Gtk associates an `GActionGroup` with a widget via one of:

``` c