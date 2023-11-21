---
title: "Smart Pointers"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---

## When not to use smart pointer

Guideline:
- raw pointer with `new` expression is always bad.
- there are situation in modern C++ where raw pointers make perfect sense.

### when destruction of resources is potentially-throwing

Exception can't be thrown from deleter. Use classic RAII class with `noexcept(false)` public API and `noexcept(true)` dtor instead of smart pointer.

https://stackoverflow.com/questions/130117/if-you-shouldnt-throw-exceptions-in-a-destructor-how-do-you-handle-errors-in-i

RAII class should be kept simple: never own 2 resources in 1 class.
- [Microsoft guide mentioned this](https://docs.microsoft.com/en-us/cpp/cpp/how-to-design-for-exception-safety?view=msvc-170#keep-resource-classes-simple)
- (TODO: Bad things happends when RAII class wraps 2 resources?)

### Never use smart pointer to static memory

Ownership semantics doesn't make sense for static memory: no object owns them.

- Usually native reference is enough. This explicitizes the intention that lifetime is not a problem.
- Native reference as class data member requires reference initialization in `member-init-list`, prior to the constructor body can be executed. This can be a problem if certain computation is needed to determine which static object these references bind to. Consider named constructor idiom instead. `std:reference_wrapper` provides mutability, but cannot be empty, thus is not an option for lazy init.

## `unique_ptr`

To construct an instance of `unique_ptr`, use one of
- Ctor of `unique_ptr`, which allows custom deleter, but suffers from 1) redundant type spelling 2) unspecified order of argument evaluation
- `std::make_unique` (since c++14), which can't have custom deleter, but avoid ctor's defects by perferct-forwarding arguments to the resolved ctor.
- `std::make_unique_for_overwrite` (since c++20)

## deleter

Deleter must be an *FunctionObject* callable with a single argument `T*`.

Deleter is part of `unique_ptr`'s type parameter, which forbids ...

For custom deleter, (TODO: why)
- Captureless lambda as deleter incur no size penalty.
- Ordinary function as deleter increase the size of each `unique_ptr` instance to 2 pointer


## `shared_ptr`

TODO

### `std::make_shared`

### `shared_ptr` to `this`

### internals

## `weak_ptr`

- `weak_ptr` can't prevent the pointed resources being deleted as a result of all `shared_ptr`s being destructed.
- Conceptually `weak_ptr` is associated with the underlying resources, rather than a specific `shared_ptr` instance: 

    ```c++
    auto shared = std::make_shared<int>(42);
    auto weak = std::weak_ptr(shared);
    shared = std::make_shared<int>(99);
    if (weak.expired()) { // true
        std::puts("weak expired");
    }
    ```


To convert `weak_ptr` to a `shared_ptr`, use either of

|                                            | when `expired() == true`     |
|--------------------------------------------|------------------------------|
| `weak_ptr::lock()`                         | return an empty `shared_ptr` |
| `shared_ptr(const std::weak_ptr<T>&)` ctor | throws `std::bad_weak_ptr`   |



## `make_unique` and `make_shared`

