---
title: "Linux keyboard input"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article explain how keyboard events are emits from hardware and delivered to userspace applications.

<!-- more -->

## Overview

1. Keyboard hareware sends *scancode* to kernel.
2. Kernel translates scancode to *keycode*.
3. *keyboard layout* defines the mapping from `(keycode, modifiers...)` tuple to *keysym*, which is either a printable character, or an action to carry out (e.g. volumn up /down/reboot).
4. *character set* (or charset) assigns each keysym symbol a specific number.

- key composition: in some language, typing 2 keys on the keyboard should produce a single accented letter.

## Models

### IBM PC keyboard

Keyboard's emission of scancode has a chaotic history due to the lack of standardization in the early days. Different PC and/or keyboard manufacturers, to different extends, invented their own scancode usage, and more or less become / affect the later standard.

A notable product line is keyboards under the name "Model F", packaged with IBM PC as a whole from 1981–1985.

### IBM Personal Computer (model 5150, abbr. IBM PC)

