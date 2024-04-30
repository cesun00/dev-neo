---
title: "STLv2"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- C++ STL
---

## infrastructures

### Core concept `ranges::range`

`T` satisfies `range` if `ranges:begin(t)` and `ranges::end(t)` compiles, where `t` is lvalue expression of type `T`.

e.g. Both `vector<int>` and `vector<int>&` satisfies `range`.

### Core concept `ranges::view`

*Every `view` is `range`.*

`view` captures a **non-reference type** `T` that satisfies `range`,
plus its copy ctor (if exist), copy= (if exist), move ctor (must exist), move= (must exist) all work in `O(1)`.
e.g. `std::string_view` satisfies `view`, but `std::string_view &` does not.

```c++
template<class T>
concept view = ranges::range<T> && std::movable<T> && ranges::enable_view<T>;

template<class T>
inline constexpr bool enable_view = std::derived_from<T, view_base> || /*is-derived-from-view-interface*/<T>;

struct view_base { }; // marker empty base
```

Variable template `enable_view` capture the semantic requirement about constant time complexity.
Making `enable_view<T>` evaluates to `true` is a promise from the author of `T` to clients about the constant complexity of copying / moving `T`.
This can be done by
- using primary template and having `T` publicly inherit from `view_base` or `view_interface`, as new view-satisfying classes should do; or
- providing full specialization `template<> bool constexpr enable_view<T> = true`. This is useful when migrating old class hierarchy to STLv2 system. e.g. `std::string_view`

    ```c++
    // libstdc++ <string_view>

    // Opt-in to view concept
    template<typename _CharT, typename _Traits>
    inline constexpr bool
    enable_view<basic_string_view<_CharT, _Traits>> = true;
    ```

Spec uses `/*is-derived-from-view-interface*/<T>` to avoid the introduction of such concept, and give freedom to implementators.
It evaluates to `true` if `T` have `view_interface<U>` as the only public base for a fixed `U`.
i.e. `class T : public view_interface<X>, public view_interface<Y>` is not allowed.


`ranges::view_interface<D>` is a helper CRTP base for classes that are meant to satisfies `ranges::view` concept.
With the help of type-constraint based SFINAE, derived class will have *viable* public member functions inherited if it satisfies certain concepts.

For instance `d` of `class D : public ranges::view_interface<D>`, denote
- `std::ranges::iterator_t<D>` (which normally delegates to `decltype(d.begin())`) as `D`'s *iterator type*
- `std::ranges::sentinel_t<D>` (which normally delegates to `decltype(d.end())`) as `D`'s *sentinel type*

This means `D` always needs to provide `begin()` and `end()` member functions,
otherwise argument substitution into these type alias templates are ill-formed,
and it will inherit from an empty `view_interface` base.

| member function ... | return                       | viable if ...                                                                                 |
|---------------------|------------------------------|-----------------------------------------------------------------------------------------------|
| empty               | emptyness test               | `D` satisfies `sized_range` or `forward_range`                                                |
| operator bool       | non-emptyness test           | `ranges::empty(d)` compiles                                                                   |
| data                | raw pointer to first element | iterator type of `D` satisfies `contiguous_iterator`                                          |
| size                | number of elements           | `D` satisfies `forward_range` and its sentinel and iterator type satisfy `sized_sentinel_for` |
| front               | reference to first element   | `D` satisfies `forward_range`.                                                                |
| back                | reference to last element    | `D` satisfies `bidirectional_range` and `common_range`.                                       |
| operator[]          | reference to nth element     | `D` satisfies `random_access_range`.                                                          |

```c++
//                      V    use public inheritance
class MyStringView : public std::ranges::view_interface<MyStringView> {};
```

## core concept `ranges::viewable_range`

A very funny observation is that `std::vector<int>` satisfies `range`, but is expensive to copy, so it doesn't satisifes `view`.
On the other hand `std::vector<int>&` is cheap to copy, and satisfies `range` as well - it's almost a `view` - except that
`view` concept requires `std::movable` which requires object type, thus all reference types are ruled out.

But it doesn't rule out man-made reference - `reference_wrapper`-alike pimpl wrapper for `range`.

Class template `ranges::ref_view` does exactly that:
hold a pointer/reference to a `range` and delegate calls (e.g. `begin()`, `end()`) to the referenced object.

For whatever `T` that satisfies `range`, `ranges::ref_view<T>` satisfies `view`.
It's instances are small thus cheap to move. For x86_64 libstdc++ it's always size of a pointer, i.e. 8 byte.

Due to the referencing nature of `ref_view`, and the referencing nature of all `view`, its usage is vulnerable to dangling when the underlying range destructs first.
It's programmer's responsibility to guarantee that a `view` does not outlive its underlying (`view` or non-`view`) `range`.

`ref_view` ctor takes any `range`, apparently when the argument is an rvalue expression, it dangles immediately:

