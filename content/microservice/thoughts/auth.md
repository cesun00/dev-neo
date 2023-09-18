---
title: "Auth"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

We will first give a quick recap of the essence of authentication in the context of web services.
Then a few techniques will be discussed in chronological order.




The most straightforward intuition of authentication comes from the idea of receipt.
We want something that really hard to fake or forge, such that whenever we see it, we known the holder of that thing
is trustworth.

The most intuitive implementation would be a large number, which by its nature is very hard to guess.
Essentailly we are sampling from a large sample space such that the hardness of hit the correct one 
by randomly guessing would be extremely large.g