---
title: "C++ Metaprogramming"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

Metaprogramming in C++ refer to the exercise of writting bool `constexpr` evaluated by the client compiler, such that correct template instantiation is eventually instantiated.

## check if `T` is not const or volatile

```c++
std::same_as<T, std::remove_cv_t<T>>
```

## Use `std::addressof` to take address of object

Work against overloaded `operator&`.

## Use `std::to_address` to get the address value of (smart / raw) pointers

```c++
#include <type_traits>
#include <memory>
#include <cstdio>

int main () {
    // std::toaddress
    // 1) work for both smart and raw pointer
    auto int_up = std::make_unique<int>(42);
    int *int_p = new int{22};
    std::printf("%p\n", std::to_address(int_up));
    std::printf("%p\n", std::to_address(int_p));

    // 2) avoid the trap of std::addressof(*ptr)
    int *wild_int_p = int_p + 10000000; // pointer arithmetic is well-defined behavior
    //std::printf("%p\n", std::addressof(*wild_int_p)); // undefined behavior
    std::printf("%p\n", std::to_address(wild_int_p)); // ok

    delete int_p;
}
```
https://stackoverflow.com/questions/56493697/specific-use-case-of-to-address


## type traits (C++11)

Named requirement and concept are contracts on acceptable types of template arguments. Sometimes multiple types are acceptable, but depending on certain properties those type have, the template may branch and generate (instantiates into) different C++ code. Those properties are called *type traits* by the standard. `<type_traits>` header provide functionalities to query these traits, as well as ,at compile time.

```c++
// find a starter demo
```

There are indeed situations where concepts and type traits are equivalent, especially in static assertion. This sometimes causes confusions.

```c++
template<typename T, typename G>
void foo() {
    if (static_assert(std::is_same<T,G>::value)) {} // from <type_traits>
    // is equivalent to
    if (static_assert(std::same_as<T,G>)) {}   // from <concepts>
}
```

ref: https://www.reddit.com/r/cpp_questions/comments/rhtr6v/concepts_vs_typetraits_in_situations_where_theyre/


### class type

- `class` + `struct` (`std::is_class<T>::value == true`)
- `union` (`std::is_union<T>::value = true`)

Or template instantiation of these. `std::is_class<T>::value` gives `false` for union. Bruh we are running out of nouns.

### scalar type

Every type except array and [class type](#class-type).

### aggregate type

Capture the idea of native array and simple data class whose construction cannot fail.

Specifically:
1. native array (of any type)
2. class (`class`, `struct`, or `union`) with
    1. no (potentially inherited) user-declared ctor,
    2. no private / protected instance member, (static ones are okay - they won't be part of the instance memory anyway)
    3. no (potentially inherited) virtual functions, and
    4. no `virtual` / `protected` / `private` base class
