---
title: "Cache and Bit Interleaving Access"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

> Given a zero-ified array, if one thread is setting all odd bits and another thread is setting all
> even bits, what will the resulting memory be look like?

<!--more-->

This interesting question came to my mind during the last days of my college.



I then went to work in the backend Java industry, with this question unsolved but emerged in my mind from time to time.
I once asked some of my colleagues, among them several senior Java engineers worked for more than 10 years,
and they either showed no interest in figuring out, or were just reluctant to say they didn't know.

But the question is there. 

Let's first make the question more well-defined. We will be using POSIX threads running on a real SMP processor, instead of a time-slicing single-core one. odd bits and even bits are defined w.r.t  the least significant bit is indexed as 0.