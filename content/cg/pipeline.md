---
title: "GPU Pipeline"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

<!-- https://dev.opera.com/articles/introduction-to-webgl-part-1/ -->

GPU is a blackbox that takes the following as user input:
1. vertexes, as a list of triplets of 3D coordinates 
2. edges, as a list of indices into the vertexes list, 

1. the *vertex shader* is a piece of code that algorithmically assign a set of attributes to each vertex, including its RGB color, alpha, depth
2. 
3. the *rasterizer* 
4. the fragment shader 

    The fragment shader is called once for every pixel on each shape to be drawn, after the shape's vertices have been processed by the vertex shader

Each time a shape is rendered, the vertex shader is run for each vertex in the shape.
This happens at whatever framerate requested.


clip space: because Any data which extends outside of the clip space is clipped off and not rendered

     a triangle straddles the border of this space then it is chopped up into new triangles, and only the parts of the new triangles that are in clip space are kept.

