---
title: "Color Theory and Color Spaces"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
tags:
- colorspace
- design
---

Color is like probability theory. Everything feels natural until you can't convince yourself.
There are more biology and math in the organization of color in software palette than you think.

<!--more-->

Cone cells in vertebrates' eyes are sensitive to electromagnetic waves of a certain wavelength range.
A human's eye has 6 to 7 million cone cells, 
There are 3 types of them, namely type L, M, and S, which got their names from long, medium, and short wavelength.  

{{<figure src="./Cone-fundamentals-with-srgb-spectrum.svg" caption="Response strength of 3 cone cell types by wavelength.">}}

- L cone cells respond to all wavelengths from 400nm to 700nm but are most sensitive to 564–580 nm. (red)
- M cone cells respond to wavelengths from 400nm to 650nm but are most sensitive to 534–545 nm. (green)
- S cone cells respond to wavelengths from 400nm to 550nm but are most sensitive to 420–440 nm. (blue)

The brain synthesizes a color depending on which cone cells are sending signals and their strength.
For a fixed wavelength, the strength of the signal sent by a given type of cone cell is proportional to the intensity (amplitude) of that electromagnetic wave.

The ratio of M and L cones varies greatly among different people with regular vision (e.g. values of 75.8% L with 20.0% M versus 50.6% L with 44.2% M in two male subjects). Only around 2% of cone cells are S cells.

The corresponding wavelength of these 3 types of cone cells defines the range of visible light for humans.
These boundaries are not sharply defined and may vary per individual. Under optimal conditions these limits of human perception can extend to 310 nm (ultraviolet) and 1100 nm (near infrared).

<!-- The most red color you can obtain on most computer system (i.e. `#FF0000`) have an approximate wavelength of 611.37 nm. -->

## Color Mixing

When a laser (light beam with a single wavelength) gets reflected by a surface, its wavelength doesn't change.

When a 650nm beam and a 540nm beam get reflected at the same spot on a surface, they are reflected 
individually without interference. They don't turn into a single laser beam of average wavelength nor experience other conversions.

Human's eye upon seeing such a light of mixed wavelength have its 

<!-- This holds for the sunlight, which is EM wave of mixed wavelength. -->


A few fact checks:
1. when a laser 

The aforementioned color-forming neural mechanism 

## Magenta isn't real

Flower with magenta pedal 

## Color Space

A color is human's visual interpretation of 

A color space is a mapping from a coordinate (usually 3-dimensional) to a .

The set of all col

### SRGB (Standard RGB)

### HSL (Hue, Saturation, Lightness)

HSL is more easy to interpret in terms of human's feeling.

Hue is a color 

Saturation determines how vivid. When saturation is 0, All hue becomes grey .

### HSV a.k.a HSB (Hue, Saturation,  Value / Brightness)

## Generating Uniform Gradient Is More Useful than You Think

Given 2 colors, we are curious about generating a few average colors between them, where 

This is useful in many sceinarios:
1. 