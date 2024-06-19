---
title: "Function Template"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
- C++
- Programming Language
- template
---

Canonically, a function template ...

{{<columns>}}

### ... is declared by 

```c++
template<typename T>
void foo(T);
```

C++20 allows a function declaration to have placeholder type (i.e. `auto`) or constrained placeholder type (i.e. constrained `auto`)
as an equivalent syntax of function template declaration with type parameter:

