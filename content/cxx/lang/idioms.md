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

