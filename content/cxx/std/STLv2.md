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

<!-- BEGIN TODO - this concept is still a myth to me. -->

<!-- // ============= -->
- Every `viewable_range` is `range`.
- There is no subset or superset relationship between `viewable_range` and `view`.
  - There can be `viewable_range` that is not a `view`. There can be `view` that is not a `viewable_range`.

A `view` is a reference to a subsequence of a `range`.
Due to its referencing nature, 


<!-- -- `ref_view(rvalue expression of type range)` always dangle --  -->

<!-- // ============ -->

As a library author, when your function takes a `view`-constrained parameter, there are some cases you know it will NEVER dangle:

```c++
template<std::ranges::view T>
void foo(T t) {}
```

<!-- 1. -->

```c++
using ref_view_vector_int_t = std::ranges::ref_view<std::vector<int>>;
if constexpr (std::ranges::view<ref_view_vector_int_t>) {     // true
    std::puts("ref_view<std::vector<int>> satisfies view");
}

// sizeof(std::ranges::ref_view<vec>) = 8
std::printf("sizeof(std::ranges::ref_view<vec>) = %lu\n", 
    sizeof(std::ranges::ref_view<ref_view_vector_int_t>));
```

> The viewable_­range concept specifies the requirements of a range type that can be converted to a view safely.
> <cite>[[range.refinements]](https://eel.is/c++draft/range.refinements) </cite>


It's mandatory implementation roughly states that a range further satisfies `viewable_range` if either:
1. it's simply a view, e.g. `std::string_view`, or
2. it's an lvalue reference (even when its reference-removed type is not a view), e.g. `std::vector<int>&`, or
3. it's a movable object type (i.e. not reference type), e.g. `std::vector<int>`

<!-- -- END TODO -->



## view / range factories

These are pairs of (class template `X` , variable template `x`),
where instantiations of `x<T>` is a variable of type `X<T>` which models `view<T>` (thus `range<T>`):

| class template `X<T>`          | variable template `x<T>`       | `X<T>` satisfies `view` and semantically ...                                                                          |
|--------------------------------|--------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| ranges::empty_view             | views::empty                   | an empty `view` with no elements                                                                                      |
| ranges::single_view            | views::single (CPO)            | a `view` that contains a single element of a specified value                                                          |
| ranges::iota_view              | views::iota (CPO)              | a `view` consisting of a sequence generated by repeatedly incrementing an initial value                               |
| ranges::basic_istream_view     | views::istream (CPO)           | a `view` consisting of the elements obtained by successive application of `operator>>` on the associated input stream |
| ranges::repeat_view            | views::repeat (CPO)            | a `view` consisting of a generated sequence by repeatedly producing the same value                                    |
| ranges::cartesian_product_view | views::cartesian_product (CPO) | a `view` consisting of tuples of results calculated by the n-ary cartesian product of the adapted views               |

Range adaptors
=============

- A *range adaptor closure object*  is a function object whose `operator()` accepts a single parameter of `viewable_range` and returns a `view`.
  - such object must also provide `operator|`s in order for view pipelining to work.
- A *range adaptor object*          is a function object whose `operator()` accepts a `viewable_range` as its first parameter and returns a `view`.
  - such object must also provide an second `operator()` to specialize itself into a RACO.

## RAO (Range Adaptor Object)

Specification requires RAO to provide a second `operator()` to "specialize" itself into an RACO, by fixing arguments other than the range to operate on.
It's result can then used in the view pipelining.

In libstdc++, all RAO class inherit from a CRTP base `T : public __adaptor::_RangeAdaptor<T>` which provide this second `operator()`.

```c++
std::vector<int> dt{1,2,3};
auto square = [](const int &x){return x*x;};

std::views::transform(range, square);   // use RAO views::transform directly
auto square_transform = std::views::transform(square);      // call the second operator() to bind an argument
square_transform(dt);                   // use RACO generated from RAO
```

## RACO (Range Adaptor Closure Object)

Given an `R r` modeling `viewable_range` and a RACO `C c`,
specification requires `r | c` (`operator|(r, c)` or `r.operator|(c)`) to be equivalent to `c(r)` (i.e. `c.operator()(r)`).

Given an `R r` modeling `viewable_range`, and 2 RACO `C1 c1` and `C2 c2`, 
specification requires `r | c1 | c2` is equivalent to `r | (c1 | c2)`.

i.e. RACO must have 2 `operator|`, one takes `viewable_range` and the other takes another RACO.

In libstdc++, all RACO class inherit from `_RangeAdaptorClosure` which provides these 2 `operator|` implementations.

## pipelining

i.e. for an RAO `D d`, this means the following expression are equivalent:

```c++
d(r, arg...)
d(arg...)(r)
r | d(arg...)
```


`operator|` of RACO return another `view` (and also `viewable_range`), thus a source viewable_range and RACOs can be pipelined as:

```c++
// source_range | RACO1 | RACO2 | RACO3 | ...
std::vector<int>{1,2,3} | std::views::transform([](const int &x){return x*x;}) | std::views::reverse
```

As far as C++20, there is no way for user to define their own range adaptor object, and only those provided by the standard library are available.

https://stackoverflow.com/questions/64649664/how-you-create-your-own-views-that-interact-with-existing-views-with-operator

These are pairs of (range adaptor object `c`, class template `A<T>`).
For `R r` modelling `viewable_range`, calling `c(r, args...)` will delegate to constructor `A<decltype(r), decltype(args)...>(range, args...)`,
i.e. `c(r, ...)` returns an instance of `A<R, ... >`.

Note that `decltype(c)` is an implementation detail.
e.g. in GNU's libstdc++, RAO `views::transform` is of type `struct _Transform : __adaptor::_RangeAdaptor<_Transform>`.

| range adaptor object `c`  | view implementation `A<R>`      | return a `view` on the original `range` ...                                       |
|---------------------------|---------------------------------|-----------------------------------------------------------------------------------|
| views::transform          | ranges::transform_view          | applies a transformation function to each element                                 |
| views::reverse            | ranges::reverse_view            | reverse. Original range must be bidirectional.                                    |
| views::take               | ranges::take_view               | take first `N` elements                                                           |
| views::take_while         | ranges::take_while_view         | take first few elements until predicate returns false                             |
| views::drop               | ranges::drop_view               | skip first `N` elements                                                           |
| views::drop_while         | ranges::drop_while_view         | skip first few elements until predicate returns false                             |
| views::filter             | ranges::filter_view             | elements satisfies a predicate                                                    |
| views::join_with          | ranges::join_with_view          | `[a,b,c]` to `[a,x,b,x,c,x]`                                                      |
| views::split              | ranges::split_view              | `[a,x,b,x,c,x]` to  `[a,b,c]`                                                     |
| views::lazy_split         | ranges::lazy_split_view         | ditto but split lazily, losing properties of the original view e.g. random access |
| views::keys               | ranges::keys_view               | `[[k1,v1],[k2,v2]]` to `[k1,k2]`                                                  |
| views::values             | ranges::values_view             | `[[k1,v1],[k2,v2]]` to `[v1,v2]`                                                  |
| views::elements           | ranges::elements_view           | `[[1,2,3],[a,b,c]]` to `[1,a]` or `[2,b]`,or `[3,c]`                              |
| views::zip                | ranges::zip_view                | `[[1,2,3],[a,b,c]]` to `[[1,a],[2,b],[3,c]]`                                      |
| views::zip_transform      | ranges::zip_transform_view      | `[[1,2,3],[a,b,c]]` to `[f(1,a),f(2,b),f(3,c)]`                                   |
| views::adjacent           | ranges::adjacent_view           | `[1,2,3,4]` to `[[1,2],[2,3],[3,4]]`                                              |
| views::adjacent_transform | ranges::adjacent_transform_view | `[1,2,3,4]` to `[f(1,2),f(2,3),f(3,4)]`                                           |
| views::join               | ranges::join_view               | `[[1,2,3],[a,b,c]]` to `[1,2,3,a,b,c]`                                            |
| views::common             | ranges::common_view             | to `common_range`                                                                 |
| views::slide              | ranges::slide_view              | TODO                                                                              |
| views::stride             | ranges::stride_view             | TODO                                                                              |
| views::chunk              | ranges::chunk_view              | TODO                                                                              |
| views::chunk_by           | ranges::chunk_by_view           | TODO                                                                              |
| views::as_const           | ranges::as_const_view           | TODO                                                                              |
| views::as_rvalue          | ranges::as_rvalue_view          | TODO                                                                              |
| views:all                 | n/a (only alias `views::all_t`) | a view that includes all elements of a range. Spec reserves `A`'s name for        |
|                           |                                 | future change, only alias `decltype<viwes:all(r,...)>` to `views::all_t`          |
| - user constructed -      | ranges::ref_view                | a view of the elements of some other range                                        |
| - user constructed -      | ranges::owning_view             | a view with unique ownership of some range                                        |
| - user constructed -      | views::counted                  | creates a subrange from an iterator and a count                                   |



companion concepts (type constraints)
=============

```c++
// For object t of type T, T satisfies ... if
ranges::borrowed_range          // specifies that a type is a range and iterators obtained from an expression of it can be safely returned without danger of dangling
ranges::sized_range             // specifies that a range knows its size in constant time
ranges::input_range             // specifies a range whose iterator type satisfies input_iterator
ranges::output_range            // specifies a range whose iterator type satisfies output_iterator
ranges::forward_range           // specifies a range whose iterator type satisfies forward_iterator
ranges::bidirectional_range     // specifies a range whose iterator type satisfies bidirectional_iterator
ranges::random_access_range     // specifies a range whose iterator type satisfies random_access_iterator
ranges::contiguous_range        // specifies a range whose iterator type satisfies contiguous_iterator
ranges::common_range            // specifies that a range has identical iterator and sentinel types
ranges::constant_range          // specifies that a range has read-only elements
```

utility function templates
===============

Due to TAD, call to these function templates feels just like function.

```c++
ranges::begin       // returns an iterator to the beginning of a range
ranges::end         // returns a sentinel indicating the end of a range
ranges::cbegin      // returns an iterator to the beginning of a read-only range
ranges::cend        // returns a sentinel indicating the end of a read-only range
ranges::rbegin      // returns a reverse iterator to a range
ranges::rend        // returns a reverse end iterator to a range
ranges::crbegin     // returns a reverse iterator to a read-only range
ranges::crend       // returns a reverse end iterator to a read-only range
ranges::size        // returns an integer equal to the size of a range
ranges::ssize       // returns a signed integer equal to the size of a range
ranges::empty       // checks whether a range is empty
ranges::data        // obtains a pointer to the beginning of a contiguous range
ranges::cdata       // obtains a pointer to the beginning of a read-only contiguous range
```

type traits (meta programming helper)
================

```c++
// foobar2000
template <class T>
using iterator_t = decltype(ranges::begin(std::declval<T&>()));

// foobar2000
template <ranges::range R>
using const_iterator_t = std::const_iterator<ranges::iterator_t<R>>;

// foobar2000
template <ranges::range R>
using sentinel_t = decltype(ranges::end(std::declval<R&>()));

// foobar2000
template <ranges::sized_range R>
using range_size_t = decltype(ranges::size(std::declval<R&>()));

// foobar2000
template <ranges::range R>
using range_difference_t = std::iter_difference_t<ranges::iterator_t<R>>;

// foobar2000
template <ranges::range R>
using range_value_t = std::iter_value_t<ranges::iterator_t<R>>;

// foobar2000
template <ranges::range R>
using range_reference_t = std::iter_reference_t<ranges::iterator_t<R>>;

// foobar2000
template <ranges::range R>
using range_const_reference_t = std::iter_const_reference_t<ranges::iterator_t<R>>;

// foobar2000
template <ranges::range R>
using range_rvalue_reference_t = std::iter_rvalue_reference_t<ranges::iterator_t<R>>;
```

