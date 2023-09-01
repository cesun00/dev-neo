---
title: "C++ Idioms Collections"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
---

Some C++ Idioms collected. Use this article as a cheetsheet.

<!--more-->

## Erase-remove idiom

In contiguous storage, delete items that satisfy a given predicate.

```cpp
#include <algorithm>
#include <vector>
#include <iostream>
#include <sstream>

void pvec(const std::vector<int> &v) {
	std::stringstream ss;
	ss<< '{';
	for(size_t i = 0; i < v.size(); ++i)
	{
		if(i != 0)
			ss << ", ";
		ss << v[i];
	}
	ss<<'}';
	std::cout<< ss.str() << std::endl;
}

int main() {
	std::vector<int> v{1,4,7,2,1,6,5,1,0,9,1,2,3,8};
	// by simple value:
	std::vector<int> a(v);
	pvec(a);
	a.erase(std::remove(a.begin(),a.end(),1), a.end());
	pvec(a);
	// by predicate:
	std::vector<int> b(v);
	pvec(b);
	b.erase(std::remove_if(b.begin(),b.end(),
				[](const auto &e) { return e<5;}));
	pvec(b);
}
```

## M&M (mutable mutex) idiom

## copy-and-move idiom

## copy-and-swap idiom (deprecated)

## Pimpl

Proxy pattern with a no-op delegation to an internal pointer / reference.

Purpose:
- 
- Pimpl as re-compilation firewall



## Double `snprintf`

*Deprcated since C++20:* use `std::format`.

Use `snprintf` with `nullptr` as first argument to verify the validity of `format` string.

```c++
template<typename ... Args>
std::string format(const std::string &format, Args ... args) {
	int size_s = std::snprintf(nullptr, 0, format.c_str(), args ...) + 1; // Extra space for '\0'
	assert((size_s > 0) && "ill-formed format string.");
	std::vector<char> buf(static_cast<unsigned long>(size_s));
	std::snprintf(buf.data(), buf.size(), format.c_str(), args ...);
	return {buf.cbegin(), buf.cend() - 1}; // We don't want the '\0' inside
}
```
