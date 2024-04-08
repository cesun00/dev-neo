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

