## `display`

The `display` property determines both
- the outer display type, i.e how this element participates in the document flow; and 
- the inner display type, i.e. how children of this element is arranged.

Formally, a `display` set the following 

```
<display>:  <display-outside>
            <display-inside>
            <display-listitem>
```

However, `display` is not a shorthand property for others.

| display value | outer display type | inner display type |
|---------------|--------------------|--------------------|
| (default)     | block              | flow               |