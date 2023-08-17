The idea of `WEB-INF/` directory:

https://stackoverflow.com/questions/19786142/what-is-web-inf-used-for-in-a-java-ee-web-application


For the following structure

```
src
    main
        java/
            JoseServlet.java
        webapp/
            WEB-INF/
                web.xml
                hello.jsp
            index.jsp
```

`index.jsp` can be accessed directly by url, since tomcat provide the fallback `JspServlet` capturing all`*.jsp` request for you.

There is no way `hello.jsp` can be accessed directly by `hostname/contextpath/.../hello.jsp`.
But `hello.jsp` can be referred and forwarded to from any Servlet:

```java
@WebServlet("/jose")
public class JoseServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("LOGGING");
        req.getRequestDispatcher("/WEB-INF/hello.jsp").forward(req, resp);
    }
}
```