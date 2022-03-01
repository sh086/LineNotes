# 支持访问多个URL路径前缀

​	　SpringBoot只允许设置一个`server.servlet.context-path`，为了支持多个URL路径前缀的访问，可以通过**过滤器Filter**修改请求url地址。

```shell
# 既可以支持含/api前缀的路径访问
http://127.0.0.1/api/user
# 也可以支持不含/api前缀的路径访问
http://127.0.0.1/user
```

**参考资料:**

- [SpringBoot 利用过滤器Filter修改请求url地址](https://www.cnblogs.com/hongdada/p/9046376.html)
- [如何修改请求的url地址](https://blog.csdn.net/silver9886/article/details/87625511)



## 支持/user访问

​	　首先，实现通过http://127.0.0.1:8080/user访问。

```java
import com.shooter.springboot.module.domain.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @GetMapping("/user")
    public User selectUser(){
        return User.builder().userName("小米").age(12).build();
    }
}
```

### 测试用例

​	　启动项目后，通过http://127.0.0.1:8080/user访问，可以得到如下结果：

```json
{"userName":"小米","age":12}
```



## 支持/api/user访问

### application.yml

​	　如果想在，访问路径前加入统一的前缀，只需要在`server.servlet.context-path`中配置即可，但是只能配置一个。

```yml
# 配置访问路径前缀
server:
  servlet:
    context-path: /
```



### 测试用例

​	　重新启动项目后，通过http://127.0.0.1:8080/api/user访问，仍可以得到如下结果，但是访问http://127.0.0.1:8080/user是失败的。

```json
{"userName":"小米","age":12}
```



## 同时支持两种访问地址

​	　为了同时支持两种访问地址，首先，要先将`server.servlet.context-path`的值 **清空** 或者 设置为  `/` ，然后，通过**过滤器Filter**修改请求url地址。

### UrlFilter

```java
import com.shooter.springboot.common.filter.UrlFilter;
import lombok.val;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Bean
    public FilterRegistrationBean registerFilter() {
        val registration = new FilterRegistrationBean();
        registration.setFilter(new UrlFilter());
        registration.addUrlPatterns("/*");
        registration.setName("UrlFilter");
        registration.setOrder(1);
        return registration;
    }
}
```



### FilterConfig

```java
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class UrlFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig)  {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
                                                               throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest)request;
        String path = httpRequest.getRequestURI();
        if(path.contains("/api/")){
            String newPath = path.replace("/api","");
            httpRequest.getRequestDispatcher(newPath).forward(request,response);
        } else {
            chain.doFilter(request,response);
        }
    }
```

### 测试用例

​	　重新启动项目后，可以通过http://127.0.0.1:8080/api/user 或者 http://127.0.0.1:8080/user 进行访问。

```json
/* 通过http://127.0.0.1:8080/api/user访问结果 */
{"userName":"小米","age":12}

/* 通过http://127.0.0.1:8080/user访问结果 */
{"userName":"小米","age":12}
```

