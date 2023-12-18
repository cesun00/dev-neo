---
title: "Introduction to C++20 Concept"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Concept
- Programming Language
---

Prior to C++20, type parameters in a template definition are introduced with `template<typename T> ...`, where `T` can bind to any existing type as long as the resulting code compiles. There is no way for a client programmer, upon seeing the template definition in a header file, to know what types can be used as arguments to the template other than reading the document.
 
*Concepts* is a C++20 feature that restricts, at the language level, the set of types that can be used as a type argument to a template.
It allows the template author to better communicate the template interface to the clients.
Some authors also call concepts the static interfaces of C++.

Static checks are enforced by the compiler at compile time. During an instantiation, templates that fail to satisfy the required concept will cause it to be discarded in the template overload resolution; this behavior makes concepts a better syntax to implement SFINAE.

<!-- When the instantiation  -->
<!-- It's known as a *substitution failure* if the type argument `T` causes syntax error in the resulting instantiation. -->
<!-- property a type must exhibit in order to be acceptable  --
<!---->

## Syntax

The definition of a concept must appear at the namespace level:

```c++
template < template-parameter-list >
concept concept-name = constraint-expression;
```

The `constexpr` `ConceptName<...>` produces a `bool` directly. Unlike type traits, no `::value` is needed. It can be used in
- `type-constraint`, i.e. 1 of the following 3 syntaxes
- `id-expression`, e.g. (TODO)
- `static_assert`

3 equivalent syntaxes to apply concept restriction on the template arguments:

```c++
// #1 "requires-clause after template-parameter-list"
template<typename BaseType, typename DerivedType> requires std::derived_from<DerivedType, BaseType>
void foo() { }

// #2 "trailing-require-clause", useful when member function itself is not templated, but has type constraint on class template argument.
template<typename BaseType, typename DerivedType>
void foo() requires std::derived_from<DerivedType, BaseType> { }

template<typename T>
struct Foo {
    void bar() requires std::integral<T> {/**/}
}

// ditto, but demonstrating trailing-return-type must precede trailing-require-clause
template<typename T> 
auto foo() -> void requires MyConcept<T> { }

// #3 "type-contraint in template-parameter-list"
// Note how this syntax omits the first argument of the concept's template-parameter-list, comparing with #1 and #2
template<std::derived_from<Base> DerivedType>
void foo() { }
```

When these syntaxes are mixed, constraints on each parameter are considered logically AND-ed.

## Vocabularies

- predicate "is statisfied by": a concept is satisfied by a sequence of template argument when it evaluates to true. This is almost a syntactic check.
- predicate "is modeled by": A sequence Args of template arguments is said to model a concept C if Args satisfies C ([temp.constr.decl]) **and meets all semantic requirements** (if any) given in the specification of C. `[res.on.requirements]`

https://stackoverflow.com/questions/62581829/satisfied-and-modeled-concept

## Concept is a better way of acheving SFINAE

```c++
#include <cstdio>
#include <type_traits>

template<typename T, std::enable_if_t<(sizeof(T) > 4), bool> = true>
void foo(T t) {
    std::puts("sfinae sizeof(T) > 4");
}

template<typename T, std::enable_if_t<(sizeof(T) <= 4), bool> = true>
void foo(T t) {
    std::puts("sfinae sizeof(T) <= 4");
}

template<typename T>
requires ( sizeof(T) > 4 )
void bar(T t) {
    std::puts("concept sizeof(T) > 4");
}

template<typename T>
requires ( sizeof(T) <= 4 )
void bar(T t) {
    std::puts("concept sizeof(T) <= 4");
}

int main() {
    foo(4);     // sfinae sizeof(T) <= 4
    foo(4.0);   // sfinae sizeof(T) > 4
    bar(4);     // concept sizeof(T) <= 4
    bar(4.0);   // concept sizeof(T) > 4
}
```

## constrained (non-template) function

https://stackoverflow.com/questions/57078643/what-is-the-point-of-a-constraint-expression-on-a-non-templated-function

n4820 (one of c++20 revisions) once allowed constrained non-template free functions.
n4860 (c++20 final draft) forbade this, making `requires-clause` on non-templates only valid for member function of class template when applying constraints:

```c++
void foo() requires true {} // gcc12 -std=c++20 @ error: constraints on a non-templated function

template<typename T>
struct Bar {
    void foo() requires (sizeof(T) > 4) {}  // ok
    void foo() requires true {}             // ok
};
```

In above example, `Bar` is unconstrained class template. It's valid to instantiate `Bar` with whatever type `T` without causing errors.
But program is ill-formed if a call to member function with unsatisified constraint is encountered, due to *overloads resolution producing empty result*.
Program is well-defined as long as no one call functions whose constraint is unsatisfied.

**THE POINT IS**:
1. Instantiating a class template with a `T` dissatisfying type-constraints of its member function is NOT an template instantiation error.
2. This is very different from other usage where unsatisfied type-constraint usually prohibits the instantiation of template as a whole.
3. Member functions with unsatisfied constraints are still members of the class template instantiation.

Formal reasoning: all member function named `foo` of instantiation of `Bar` joins the *set of candidates functions* of overloads resolution when resolving a `.foo()` call to `Bar<T>` instances. But those whose type-constraint is not satisfied is droped when turning the *set of candidates functions* into *set of viable functions*.

https://en.cppreference.com/w/cpp/language/overload_resolution#Viable_functions

To client, member functions with unsatisfied constraints behaves as if it's is removed / disabled.
https://stackoverflow.com/questions/26633239/c-templates-conditionally-enabled-member-function

This is a technique - member function's equivalence for SFINAE - since SFINAE only works for free function template - used by library authors to provide certain member function only when user's argument type satisfies certain constraints:

```c++
// empty() : Returns whether the derived view is empty. Provided if it satisfies sized_range or forward_range.
template<typename _Derived>
requires is_class_v<_Derived> && same_as<_Derived, remove_cv_t<_Derived>>
class view_interface {
    constexpr bool empty() noexcept(noexcept(_S_empty(_M_derived())))
    requires forward_range<_Derived>
    { return _S_empty(_M_derived()); }

    constexpr bool empty() const noexcept(noexcept(_S_empty(_M_derived())))
    requires forward_range<const _Derived>
    { return _S_empty(_M_derived()); }
}
```

This is not SFINAE, as there is no "substitution failure". Substitution succeeds and the class template is instantiated.

## type-constraint induced SFINAE

```c++
// n4860 temp.inst.17

template<typename T> concept C = sizeof(T) > 2;
template<typename T> concept D = C<T> && sizeof(T) > 4;

template<typename T> struct S {
  S() requires C<T> { }         // #1
  S() requires D<T> { }         // #2
};

S<char> s1;                     // error: no matching constructor (generation of implicit default ctor suppressed)
S<char[8]> s2;                  // OK, calls #2 (goverened by the partial ordering of constraints)
```

Constructor #1 and #2 are always members of any instantiation, thus the generation of implicit default ctor is suppressed.
<!--
1. 
2.  

-->


## ad-hoc constraint idiom (double requires)

For the ones with `requires` only (i.e. #1 and #2), a pattern named by some author *ad-hoc constraint* or *requires requires* exists:

```c++
// ad-hoc constraint, note keyword used twice
template<typename T>
requires requires (T x) { x + x; }
T add(T a, T b)
{ return a + b; }

template<typename T>
T add2(T a, T b) requires requires (T x) { x + x; }
{ return a + b; }

// constraint logical operators work fine
template<typename T>
requires requires (T x) { x + x; } && std::convertible_to<T,int>
T addIntAlike(T a, T b) 
{ return static_cast<int>(a) + static_cast<int>(b); }

// NOT A THING
// template<requires (T x) { x + x; } T>
// T add3(T a, T b) { return a + b; }

int main() {
    std::printf("%d\n", add(42,2));     // 44
    std::printf("%d\n", add2(42,2));    // 44
    std::printf("%f\n", addIntAlike(42.2,2.4)); // 44.000000
}
```

ref: https://stackoverflow.com/questions/54200988/why-do-we-require-requires-requires


## Be careful what the constrained `T` is deduced to when universal reference deduction is involved

Type constraint is contract to client. By seeing

```c++
template<C T>
void foo(T t);
```

client knows he should pass an object whose type satisfies `C`. e.g.

```c++
vector<int> dt{/**/};
foo(dt); // is a valid instantiation iff. vector satisfies C
```

Problem happens when `T` is not deduced to the identical type client's object have. This only happens when universal reference is involved:

```c++
template<C T>
void foo2(T&& t);
```

If client pass an rvalue expression argument:

```c++
foo2(get_a_vector());
```

Things are fine: `T` is still deduced to `vector<int>`, and compiler checks whether `vector<int>` satisfies `C`.

If client pass an lvalue expression argument:

```c++
vector<int> dt{/**/};
foo2(dt);
```

`T` is now deduced to `vector<int>&`, and all of a sudden the constraint `C` is not on `vector<int>` anymore but on `vector<int>&`, a lvalue reference type.

Client has to at least look into the template source and at least basic understand of universal reference and TAD to know the difference?

## `constexpr` as concept component

It's a common practice to use `constexpr` variable template to compose concept, without introducing a new sub-concept:

```c++
template<class T>
inline constexpr bool enable_view = std::derived_from<T, view_base> || /*is-derived-from-view-interface*/<T>;

template<class T>
concept view = ranges::range<T> && std::movable<T> && ranges::enable_view<T>;
```

`enable_view<T>` is evaluated at compile-time to produce a `bool`, so it can be used in `constraint-expression` to compose a concept.
At the same time, specification made sure no one can abuse `enable_view` as a concept.

## Customization Point Object (CPO)

A CPO is an function object `t` (i.e. has `operator()`) whose class `T` has `constexpr` ctor and dtor, and serves the following purpose:gh
1. applies type constraint on its argument via `requires-clause` on its `operator()`
2. delegate real business to corresponding implementation, e.g. member function of `t`.

A good example is `ranges::begin(t)` which
1. normally delegates to `t.begin()`
<!-- 2.  -->
