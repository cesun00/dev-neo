---
title: "Go Template Revisited"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article is a paraphrase of the [`text/template` package documentation](https://pkg.go.dev/text/template#pkg-overview)
since I find its narration structure chaotic and unintuitive.
New users of the Go template system may find this article easier to begin with.

The idea of all template systems is to replace placeholders in a large chunk of text with corresponding
values determined at run time.

## template file

A go template file (usually with extension `.gotmpl` or simply `.html`) is a text file consisting of actions and non-action text.

Rendering (or say executing) a template file with a group of runtime data produces a result output,
which can be sent TODO.

Non-action text is copied to the output verbatim.

An action is one of the following constructs:

```
{{/* a comment */}}
{{- /* a comment with white space trimmed from preceding and following text */ -}}
