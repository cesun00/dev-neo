---
title: "Go Language Memo / Features"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

## `package main` can't be import by other packages

If you use the `flag` package to parse CLI arguments in `package main`, you may want to save the result as a global struct; 

This can be a problem because `main` can't be imported, thus the global struct can't be accessed by other package.

https://stackoverflow.com/questions/44420826/access-main-package-from-other-package

## 10 things you (probably) don't know about Go

https://talks.golang.org/2012/10things.slide#1


## short variable declaration shadowing

short variable declaration is still variable declaration; 
It shadows variable of the same name in outer scope.

```go
func wsHandlerFunc(w http.ResponseWriter, r *http.Request) {
    c,err := upgrader.Upgrade(w,r,nil)
    if err != nil {panic(err)}

    for {
        _,msg,err := c.ReadMessage()
        if err != nil {break}
        fmt.Printf("clieng msg: %s\n", msg)
    }
    fmt.Printf("%T\n",err) // ALWAYS <nil> !
}
```

```go
func wsHandlerFunc(w http.ResponseWriter, r *http.Request) {
    c,err := upgrader.Upgrade(w,r,nil)
    if err != nil {panic(err)}

    for {
        var msg []byte
        _,msg,err = c.ReadMessage()
        if err != nil {break}
        fmt.Printf("clieng msg: %s\n", msg)
    }
    fmt.Printf("%T\n",err) // *websocket.CloseError
}
```

## err

Any type that has a `Error() string` method implements the `error` interface.

Can be extended to be more informational:

```go
type PathError struct {
    Op   string
    Path string
    Err  error
}
```

New err handling in Go 1.13 (September 3, 2019)
https://blog.golang.org/go1.13-errors

https://stackoverflow.com/questions/18771569/avoid-checking-if-error-is-nil-repetition

## enum in Golang: const + iota

Golang doesn't have an `enum` keyword.
Enum in Golang is implemented with a special keyword `iota` within a `const` block:

```go
// A FileMode represents a file's mode and permission bits.
// The bits have the same definition on all systems, so that
// information about files can be moved from one system
// to another portably. Not all bits apply to all systems.
// The only required bit is ModeDir for directories.
type FileMode uint32

// The defined file mode bits are the most significant bits of the FileMode.
// The nine least-significant bits are the standard Unix rwxrwxrwx permissions.
// The values of these bits should be considered part of the public API and
// may be used in wire protocols or disk representations: they must not be
// changed, although new bits might be added.
const (
	// The single letters are the abbreviations
	// used by the String method's formatting.
	ModeDir        FileMode = 1 << (32 - 1 - iota) // d: is a directory
	ModeAppend                                     // a: append-only
	ModeExclusive                                  // l: exclusive use
	ModeTemporary                                  // T: temporary file; Plan 9 only
	ModeSymlink                                    // L: symbolic link
	ModeDevice                                     // D: device file
	ModeNamedPipe                                  // p: named pipe (FIFO)
	ModeSocket                                     // S: Unix domain socket
	ModeSetuid                                     // u: setuid
	ModeSetgid                                     // g: setgid
	ModeCharDevice                                 // c: Unix character device, when ModeDevice is set
	ModeSticky                                     // t: sticky
	ModeIrregular                                  // ?: non-regular file; nothing else is known about this file

	// Mask for the type bits. For regular files, none will be set.
	ModeType = ModeDir | ModeSymlink | ModeNamedPipe | ModeSocket | ModeDevice | ModeCharDevice | ModeIrregular

	ModePerm FileMode = 0777 // Unix permission bits
)
```

## 2-return variants of assignment 

There are 3 circumstances where the left-hand side of the assignment operator `=` can have 2 names:

1. map membership test
2. type assertion
3. channel close confirm

Search `the special form` in the specification.

## Limited Liskov Substitution

In Golang, only interface type can enjoy the Liskov substitution.

One struct type can has the fields of another struct type, and the methods... (embeded pointer?)

Type assertion is only permitted on an interface type. It's like a cast, but only for interface.
it might be easy to be confused with (type) "Conversions":

```go
package main

import "fmt"

type op string // not assignable, thus conversion is legal via the second clause: "ignoring struct tags (see below), x's type and T have identical underlying types."

func main() {
        var x string = "hello"
        // y := x.(op) // invalid type assertion: x.(op) (non-interface type string on left)
        y := op(x)
	fmt.Println("Hello, playground",y)
}
```


```go
package main

import (
	"fmt"
)

type A struct {}

func (a *A) foo() string {return "42"}

func (a A) goo() string {return "goooooo!"}

type B struct {A}

// any B value is a Gooler now
// any *B value is both a Fooler and a Gooler

type Fooler interface {
    foo() string
}

type Gooler interface {
    goo() string
}

func myFuncNeedFooler(f Fooler) {
   fmt.Println(f.foo())
}

func myFuncNeedGooler(g Gooler) {
   fmt.Println(g.goo())
}

func main() {
	x:= B{}
	myFuncNeedFooler(&x)
    //myFuncNeedFooler(x)
	myFuncNeedGooler(x)
	myFuncNeedGooler(&x)
}
```

```go
package main

import (
	"fmt"
)

type A struct {foo,zoo,too int}

type B struct {
    A
    bar string
}

func main() {
   x := B{}
   fmt.Println(x.A) // {0 0 0} - access through "A" as a whole
}
```


## Reference types 
