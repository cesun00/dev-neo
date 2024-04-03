---
title: "Memorandum on C++ Specification"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

## Named Requirements

Pre-C++20 versions lack the syntatic expressiveness to put explicit restriction on type template argument.
A template parameter takes whatever arguments provided, and the compiler doesn't complain until the instantiation makes an ill-formed program (including `static_assert` failure), i.e. compile-time duck typing.

When standard text needs to describe certain contract on template arguments with user programmer,
the word *named requirement* is coined to refer to such contract. Examples are
- `std::find_if` can be instantiated with whatever (deduced) type argument, but you get an ill-formed instantiation unless
    1. the first and second argument

Since C++20,
- Most named requirements turn into corresponding concept implementations, e.g. `std::input_iterator` replaces the named requirement `InputIterator`.
    - The legacy named requirement are renamed to have the prefix `Cpp17` by spec (e.g. `Cpp17InputIterator`) or `Legacy` (e.g. `LegacyInputIterator`) by some author.
- Some named requirements are kept, and may never be implemented precisely as a concept.
    - Named requirement can describe any behavioral contract of user's program, thus is far more expressive than current concept. e.g. `c++20 § 26.6.2.3` mandates type `G` satisfies the named requirement *Uniform random bit generator* iff. `operator()` invocation on `G`'s instance `g` return unsigned integer in uniform distribution. There is indeed a C++20 concept `std::uniform_random_bit_generator`, but its spec-fixed implementation put only basis restrictions, e.g. ask `G::min()`, `G::max()`, and `g.operator()` to exist. Essentially it's impossible to determine the random distribution at compile time. Same reasoning for named requirement *LegacyRandomAccessIterator* which requires satisfying iterator to be able to move arbitrary distance in constant time.

TODO: Named requirement becomes concept and *Semantic requirements* of concept.

## one-definition-rule (ODR)

odr-used is a property of a (an)
- variable
- structured binding
- `*this`
- virtual member function
- function
- non-placement allocation or deallocation function for a class
- an assignment operator function in a class
- constructor for a class
- destructor for a class
- local entity (in a declarative region)

that is used in an expression in such a way that requires it to have exactly 1 definition across the whole program.

### `one-declaration-rule` is not a thing

The compiler must allow an entity to be declared multiple times, as long as they don't [conflict](https://en.cppreference.com/w/cpp/language/conflicting_declarations) with each other.

Forcing one-declaration-rule would be too strict for the language. First, there is need to use back reference:

```c++
// can't define self-containing linked list without back reference
struct node;

struct node {
    node *next;
};
```

Also, multiple inclusions of the same header file will declare the same entity twice, and the C++ spec doesn't want to force the use of header guard at language level.