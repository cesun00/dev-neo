https://stackoverflow.com/questions/36293911/what-is-annotationannotationtype-good-for


```java
  if (extraConfig[0].annotationType().equals(PackInteger.class)) {

        }

//vs

      if (extraConfig[0].getClass().equals(PackInteger.class)) { 
        // lint: Condition 'extraConfig[0].getClass().equals(PackInteger.class)' is always 'false' 
            
        }


//vs 
a instanceof MyAnnotation
```