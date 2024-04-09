

## Free functions

Free functions are Go functions registered in the `funcmap` when executing the template.
<!-- TODO: see go template func map registering article for details -->
They are not associated with a go data object, and thus can be used without the context dot (`.`).

To use a free function, simply type its full name:

```go
{{range (collections.Slice "foo" "bar")}}
    {{.}}
{{end}}
```

Some free function has a simple alias name for convenience.
For example, the above code can be written as 

```go
{{range (slice "foo" "bar")}}
    {{.}}
{{end}}
```