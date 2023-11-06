| `@Target`        | since | remarks | storage location |
|------------------|-------|---------|------------------|
| TYPE             |       |         |                  |
| FIELD            |       |         |                  |
| METHOD           |       |         |                  |
| PARAMETER        |       |         |                  |
| CONSTRUCTOR      |       |         |                  |
| LOCAL_VARIABLE   |       |         |                  |
| ANNOTATION_TYPE  |       |         |                  |
| PACKAGE          |       |         |                  |
| TYPE_PARAMETER   | 8     |         |                  |
| TYPE_USE         | 8     |         |                  |
| MODULE           | 9     |         |                  |
| RECORD_COMPONENT | 16    |         |                  |

```java
public enum ElementType {
    /** Class, interface (including annotation interface), enum, or record
     * declaration */
    TYPE,

    /** Field declaration (includes enum constants) */
    FIELD,

    /** Method declaration */
    METHOD,

    /** Formal parameter declaration */
    PARAMETER,

    /** Constructor declaration */
    CONSTRUCTOR,

    /** Local variable declaration */
    LOCAL_VARIABLE,

    /** Annotation interface declaration (Formerly known as an annotation type.) */
    ANNOTATION_TYPE,

    /** Package declaration */
