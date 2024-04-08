---
title: "Template Specialization"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
- template
---

*Specialization* allows a *complete different* template definition to be used when specific 1) template arguments, or 2) patterns of template arguments is provided.

1) is the case for both full and partial specialization
2) is more expressive, and is only the case for partial specialization.

Specialization embodies ad-hoc polymorphism of metaprogramming: the same template name (interface) works for different type by really having multiple templates definition. It resembles function overloads, and is the the metaprogramming counterpart of the latter in many ways.

## Full specialization

Full specialization allows a complete different template definition to be used when specific template arguments is provided.

All template types (function template / class template / variable template / etc.) can have full specialization.

Its syntax is landmarked by keyword `template` followed by an empty pair of `<>`, with exact template arguments upon which this specialization should be selected for, spelled after the unqualifed name of the primary template, in another pair of `<>`:

```c++
// function template - primary template
template <typename T, std::size_t N>
void foo() {
    std::printf("primary template - %s\n", __PRETTY_FUNCTION__);
}

// function template - full specialization
template <>
void foo<const int, 42>() {
    std::printf("full specialization - %s\n", __PRETTY_FUNCTION__);
}

int main() {
    foo<int, 42>();       // primary template - void foo() [with T = int; long unsigned int N = 42]
    foo<const int, 42>(); // full specialization - void foo() [with T = const int; long unsigned int N = 42]
}
```

## Partial Specialization (class template / variable template only)

Syntax:

```c++
template<partial-specialization-paramter-list>
class-key primary-template-name<template-argument-list> {
    // ...
}
```

where `template-argument-list` must contains at least 1 parameter from `partial-specialization-paramter-list`.
i.e. `template-argument-list` can't be already fully determined (that's the syntax for full specialization).

```c++
// class template - primary template
template <typename T, std::size_t N>
struct MyArray {
    int x = 42;
};

// class template - partial specialization
template <typename E>
struct MyArray<E, 42> {
    int y = 55;
};

// class template - full specialization
template <>
struct MyArray<int, 42> {
     int z = 121;
};

int main() {
    MyArray<double, 0> a;       // select primary template
    std::printf("%d\n", a.x);
    std::printf("%d\n", a.y);   // unknown y
    std::printf("%d\n", a.z);   // unknown z

    MyArray<std::string, 42> b; // select partial specialization <E,42>
    std::printf("%d\n", b.x);   // unknown x
    std::printf("%d\n", b.y);
    std::printf("%d\n", b.z);   // unknown z

    MyArray<int, 42> c;         // select full specialization<int,42>
    std::printf("%d\n", c.x);   // unknown x
    std::printf("%d\n", c.y);   // unknown y
    std::printf("%d\n", c.z);
}
```

The sole purpose of `partial-specialization-paramter-list` is to introduce template parameters (as valid placeholders) in this specialization. It won't change the template's interface to clients, e.g. won't allow you to pass less / more number of template argument upon instantiation whatsoever. Client must always respect the interface of primary template (i.e. number of / type-or-non-type-ness of template parameter), regardless of whether primary template or any specialization will be used.

## Ordering among specializatoins (specialization resolution)

When a class or variable template is instantiated, and there are partial specializations available, the compiler has to decide if the primary template is going to be used or one of its partial specializations. This process feels like function overloads resolution, and is known as (TODO)

## pattern-based specialization resolution

Partial specialization are more expressive, in that it allows a specialization to be selected due to arguments satisfying certain traits, or exhibits certain patterns, rather than being a specific concrete type, compared to full specialization:

```c++
// primary template
template<typename T>
struct Foo {
    Foo() {std::puts("Foo primary template");}
};

// partial specialization selected when T is a (possibly cv-qualified) pointer
template<typename E>
struct Foo<E*> {
    Foo() {std::puts("Foo partial specialization for pointer");}
}; 

// primary template
template<typename T, typename E>
struct Bar { int x; };

// partial specialization selected when T == E
template<typename G>
struct Bar<G,G> { int y; };

int main() {
    Foo<int> f0;            // Foo primary template
    Foo<int*> f1;           // Foo partial specialization for pointer
    Foo<const int*> f2;     // Foo partial specialization for pointer

    Bar<int,double> a;          // hits primary Bar
    std::printf("%d\n", a.x);
    std::printf("%d\n", a.y);   // error: struct Bar<int, double>’ has no member named ‘y’

    Bar<int, int> b;            // hits T = E specialization
    std::printf("%d\n", b.x);   // error: ‘struct Bar<int, int>’ has no member named ‘x’
    std::printf("%d\n", b.y);

    Bar<double, double> c;      // hits T = E specializatoin
    std::printf("%d\n", c.x);   // error: ‘struct Bar<double, double>’ has no member named ‘x’
    std::printf("%d\n", c.y);
}
```


Misc
===========

## Source order between specializations and instantiations

Specialization must be declared before the first (explicit or implicit) instantiation, in every translation unit.

```c++
template<class T> // primary template
void sort(std::vector<T>& v) { /*...*/ }

int main() {
    std::vector<int> dt{1,2,3};
    sort(dt);   // implicitly instantiate sort<int> from primary template
}

template<>
void sort(std::vector<int>& v); // error: declaration of specialization found too late
```

## Primary template and its specializations can be very different animals


Unlike inheritance, a specialization doesn't get any piece of code from its primary template. The only thing they share is the same interface (name and template parameter list) to client.

If code sharing is intended, user must manually factor out the common code and use other mechanisms, (TODO: find an example from authoritative code)

The primary template is even not required to have definition in order to allow specialization. A declaration would suffice.

```c++
template <typename Type>
class Foo;

template <>
class Foo<int> { };

int main(int argc, char *argv[]) 
{
    Foo<int> f; // Fine, Foo<int> exists
    Foo<char> fc; // Error, incomplete type
    return 0;
}
```

This is a technique to prevent primary template from being instantiated, thus force specialization to be hit.

https://stackoverflow.com/questions/7064039/how-to-prevent-non-specialized-template-instantiation


## The extensional nature of template specialization

Specialization has an extensional nature: everyone can specialize a primary template as long as the definition of the primary template appears earlier in the same translation unit. This means you can specialize templates from included library header and even standard library header, and totally changes its definition:

```c++
// full specialization of std::vector
template<>
class std::vector<int> {
public:
    int bar;
};


// partial specialization of std::pair
template<typename T>
class std::pair<int, T> {
public:
    std::string_view value{"pair can be whatever I want"};
};

int main() {
    using std::cout;
    using std::endl;

    std::vector<int> ff;
    cout << ff.bar << endl;
    cout << sizeof(ff) << endl;     // 4
    // cout<< ff.size() << endl;    // error: no member named 'size' in 'std::vector<int>'
    std::pair<int,double> my_pair;
    cout << my_pair.value << endl;
}
```

Such mechanics is frequently used in metaprogramming as compile-time user callback: library author simply use `library_namespace::query<T>` when coding `library_namespace::great_algorithm<T>` templates, and expects the user to provided a proper specialization of `query` on whatever same `T` they try to instantiate `great_algorithm` with. Templates like `query` exists sorely to let user specialize them, and the primary template can be as simple as no-op, or only works for a very limited range of types, or even incomplete (i.e. only declaration).

Good exmaple being class template `std::hash<T>` used by hash-based associative containers i.e. `unordered_map` and `unordered_set`.
Objects of an instantiation of this template is expected to provide an `operator()` as non-static member function and return a `std::size_t` hash value.
Specification leave the definition of its primary template unspecified, and only requires vendors to provide specialization for certain common types.
Apparently different `T` requires different ways of computing hash, and primary template can't do much on that.
In gcc stdlibc++, the primary template only works for enumeration, and causes SFINAE if instantiated with non-enum `T`.
If user want to use a custom type as key for unordered map or set, they must provide specialization of `std::hash` on that type.

side note: `std::hash` is not a function template, because function template can't be partially specialized as far as C++23.
`std::hash` must support partial specialization so that people can have things like specialization for all pointer type `template<typename T> class std::hash<T*>`.
Making it a class template which provides an `operator()` is simply a workaround against that.



## as a way of saying if-else in metaprogramming

`is_void<T>` is equivalent of saying:

```c++
metafunction is_void(typename T) {
    if (T  == void) {
    return true;
} else {
    return false;
}
```

## as a way of externally associating traits with type in metaprogramming

We hope to associate certain type definition with `MyType`:

```c++
// approach #1 (intrusive)
class MyType1 {
    public:
        using foo_type = int;
        // or arbitraryly complicated type manipulation.
        // Usually MyType itself is a business class template MyType<T>, and rhs of foo_type is parameterized on T
};

// approach #2 (non intrusive)
class MyType2 {

};

// Awkawrdly a class template because T-parameterized `using` or `typedef`
// type reansoning "expression" can't exist on their own, thus must be class member.
template<typename T>
struct QueryFooType; // prevent instantiation of primary template

template<>
struct QueryFooType<MyType2> {
    using foo_type = int;
};

// Since c++14 you can alias the QueryFooType<T>::foo_type via the following *type alias template*.
//
// std type traits library does exactly the same, provides class template for traits query with companion alias helpers.
//
// But still there is no way to get rid of the awkward usage of class template.
// It would be nice if we have something like "type alias template specialization", which would eliminate the need for traits query class templates:
//  
//      // "primary type alias template"
//      template<typename T>
//      using query_foo_type_cool;
//      
//      // "type alias template full specialization"
//      template<>
//      using query_foo_type_cool<MyType2> = int;
//      
//      // "type alias template partial specialization"
//      template<typename E>
//      using query_foo_type_cool<GenericMyType<E>> = /* T-parameterized type reasoning */;
// 
// But so far, spec says no.
//
template<typename T>
using query_foo_type_t = typename QueryFooType<T>::foo_type;
//                          ^ keyword `typename` is mandatory (the dependent name rule)

int main() {
    MyType1::foo_type a;
    // is equivalent to
    query_foo_type_t<MyType2> b;
    // is library's sugar to
    QueryFooType<MyType2>::foo_type c;
}
```