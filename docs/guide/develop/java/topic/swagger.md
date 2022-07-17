# Swagger文档

​​​​    　​[Swagger]([https://swagger.io/](https://swagger.io/))是用于对 API 信息进行完整描述的规范，主要有`Swagger 2.0`、`OpenAPI 3.0`两种，`Swagger文档`指的是**符合 Swagger规范的文件**。通过[Swagger-Editor](https://editor.swagger.io/)来编写`yaml文件`或` json 文件`格式的`Swagger文档`，然后使用`Swagger-ui`进行渲染以便提供美观的 API 文档界面。[SpringFox](https://springfox.github.io/springfox/)是基于Spring实现的Swagger规范。

**参考资料：**

- [SpringBoot集成Swagger3](https://blog.csdn.net/FxxYSHOOO/article/details/118340125)

## 快速开始

​    　首先，在`pom.xml`中引入`Swagger3`依赖。

```xml
<dependency>
      <groupId>io.springfox</groupId>
      <artifactId>springfox-boot-starter</artifactId>
      <version>3.0.0</version>
 </dependency>
```

​    　生产环境需要关闭`Swagger文档`的显示，需要在`application-prod.yml`生产配置中加入如下配置。

```properties
# 在生产环境关闭Swagger文档（true启用 false 关闭）
springfox.documentation.swagger-ui.enabled=false
```

​    　然后，通过`@EnableOpenApi`注解即可启用`Swagger3`。接着，重写启动SpringBoot项目后并访问[这里](http://127.0.0.1:8080/swagger-ui/#/)，就可以看到API 文档了。

```java
@EnableOpenApi
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## Swagger配置

### 最佳实践配置

​    　新建SwaggerConfig，并配置 **基本信息** 以及 在**生产环境禁用Swagger**。特别注意，配置文件必须要分`dev`、`test`、`prod`环境哦。

```java
import org.springframework.http.HttpMethod;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.RequestParameterBuilder;
import springfox.documentation.builders.ResponseBuilder;
import springfox.documentation.oas.annotations.EnableOpenApi;
import springfox.documentation.schema.ScalarType;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import java.util.ArrayList;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;

@EnableOpenApi
@SpringBootConfiguration
public class SwaggerConfig {
    /**
     * 配置文档生成最佳实践
     */
    @Bean
    public Docket createDocket() {
        // OAS_30表示Swagger3
        return new Docket(DocumentationType.OAS_30)
                // 配置基本信息
                .apiInfo(apiInfo())
                .select()
                // 指定扫描的包，包含子包
                .apis(RequestHandlerSelectors.basePackage("com.shooter.springboot"))
                // 指定扫描类上的注解，可以配置@RestController等
                .apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))
                // 指定扫描方法上的注解，可以配置PostMapping、RequestMapping、GetMapping、ApiOperation等
                .apis(RequestHandlerSelectors.withMethodAnnotation(Operation.class))
                .build()
                // 全局参数构建
                .globalRequestParameters(getGlobalRequestParameters())
                // 通用响应信息
                .globalResponses(HttpMethod.GET, getGlobalResponseMessage())
                .globalResponses(HttpMethod.POST, getGlobalResponseMessage())
                .globalResponses(HttpMethod.DELETE, getGlobalResponseMessage())
                .globalResponses(HttpMethod.PUT, getGlobalResponseMessage());
    }

    /**
     * 创建该API的基本信息
     */
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                // Swagger接口文档标题
                .title("Swagger3接口文档")
                // Swagger接口文档描述
                .description("前后端分离的接口文档")
                .termsOfServiceUrl("TermsOfServiceUrl")
                // 配置作者信息
                .contact(new Contact("管理员","www.admin.com","admin@qq.com"))
                .version("1.0")
                .build();
    }

    /**
     * 生成全局通用参数
     * */
    private List<RequestParameter> getGlobalRequestParameters() {
        List<RequestParameter> parameters = new ArrayList<>();
        parameters.add(new RequestParameterBuilder()
                .name("token")
                .description("请求Token")
                .in(ParameterType.QUERY)
                .query(q -> q.model(m -> m.scalarModel(ScalarType.STRING)))
                .required(true)
                .build());
        return parameters;
    }

    /**
     * 生成通用响应信息
     * */
    private List<Response> getGlobalResponseMessage() {
        List<Response> responseList = new ArrayList<>();
        responseList.add(new ResponseBuilder().code("404").description("找不到资源").build());
        responseList.add(new ResponseBuilder().code("401").description("权限拒绝").build());
        return responseList;
    }
}


```



### 指定扫描路径

​    　Swagger支持使用正则表达式来自定义扫描路径。

```java
// 示例一：or 关系
// 扫描/users/下以 select开头 或 get开头 的方法
.paths(
    PathSelectors.regex("/users/select.*")
       .or(PathSelectors.regex("/users/get."))
)

// 示例二: and 关系
// 扫描/users/下以 select开头 和 Name结尾 的方法
.paths(PathSelectors.regex("/users/select.*"))
.paths(PathSelectors.regex("/users/.*Name"))

// 示例三: negate 关系
// 扫描/users/下 不以select开头 的方法
.paths(PathSelectors.regex("/users/select.*").negate())

// 扫描路径设置 (any 全部 none不扫描)
.paths(PathSelectors.any())
```



### 自定义扫描注解

​    　首先，新建自定义注解。

```java
/**
 * 自定义Swagger注解
 * @author suhe
 *
 * @Target
 *    value : 注解的作用目标
 *    - ElementType.TYPE 接口、类、枚举、注解
 *    - ElementType.FIELD 字段、枚举的常量
 *    - ElementType.METHOD 方法
 *
 * @Retention
 *    value:用于定义具体生效的标记
 *    - RetentionPolicy.RUNTIME 运行时有效
 *    - RetentionPolicy.SOURCE 源码中有效
 *    - RetentionPolicy.CLASS 字节码中有效
 * */
@Target(value = {ElementType.METHOD,ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface MySwaggerAnnotation {

    // 自定义注解中的属性
    String value() default "";

}
```

​    　然后，在`SwaggerConfig`配置后即可使用。使用`@MySwaggerAnnotation`注解的方法不会被Swagger扫描到，作用类似与`@ApiIgnore`注解。

```java
 // 使用自定义注解
.apis(RequestHandlerSelectors.withMethodAnnotation(MySwaggerAnnotation.class).negate())
```

### API配置分组



### 生产环境配置

​    　生产环境需要关闭`Swagger文档`的显示。方法一是不启用`swagger-ui`，效果是无法访问；方法二是生产环境禁用Swagger，效果是Swagger可以访问，但是不能读取文档。

（1）在生产配置文件中关闭`swagger-ui`

```properties
# 在生产环境关闭Swagger文档（true启用 false 关闭）
springfox.documentation.swagger-ui.enabled=false
```

（2）通过`enable()`方法禁用访问

```java
@Bean
public Docket createDocket(Environment environment) {
   // 设置需要显示的swagger环境
   Profiles profiles = Profiles.of("dev","test");
   // 判断是否测试或者开发环境环境
   // 注意此处必须要用spring.profiles.active的配置哦
   boolean isDev = environment.acceptsProfiles(profiles);

   return new Docket(DocumentationType.OAS_30)
          // 只有测试环境才可以启用是否启用Swagger，生产环境需要禁用
          .enable(isDev);
}
```

## Swagger注解

### 方法作用说明

（1）`@Api`注解

```java
/**
 * @Api用于请求类上，表示对类的说明
 * tags = 说明该类的作用，多个作用可以用{}集合
 * value = UI上看不到，无需配置
*/
@RestController
@RequestMapping(value = "/users")
@Api(tags = "用户的增删改查")
public class UserController {}
```

（2）`@ApiOperation`注解

```java
/**
 * @ApiOperation用于请求方法上，说明方法的用途
 * tags = 方法的作用说明
 * notes = 方法的备注说明
*/
@GetMapping
@ApiOperation(value = "获取所有用户列表",notes = "无分页查询")
public List<User> selectAll(){
    return userService.list();
}
```

（3）`@ApiIgnore`注解

```java
/**
 * @ApiIgnore用于请求方法上，不生成API文档
*/
@GetMapping
@ApiIgnore
public List<User> selectAll(){
    return userService.list();
}
```

### 请求参数注解

（1）`@ApiImplicitParam`注解

```java
/**
* @ApiImplicitParam用于请求方法上，表述一个参数说明
* api :localhost:8099/users/selectByName?username=xxx
* name = 参数名
* value = 参数描述
* required = 参数是否必传（true/false）
* paramType = 请求参数传入方式
*       query -> 通过@RequestParam获取
*       header -> 通过@RequestHeader获取
*       path -> 通过@PathVariable获取
*       form、div-> 不常用
* dataType = 参数类型，默认string
* defaultValue = 参数默认值
*/
@GetMapping("/selectByName")
@ApiImplicitParam(paramType = "query",name= "username" ,value = "用户名")
@ApiOperation(value = "通过用户名模糊搜索用户信息", notes="返回用户信息")
public List<User> selectByName(String username){
   val queryWrapper = new LambdaQueryWrapper<User>();
   queryWrapper.like(User::getName,username);
   return userService.list(queryWrapper);
}
```

（2）`@ApiImplicitParams`注解

```java
/**
* @ApiImplicitParams用于请求方法上，表述一组参数说明
* api :localhost:8080/users/selectByNameAndAge?username=xxx&&age=12
* value = {@ApiImplicitParam说明列表}
*/
@GetMapping("/selectByNameAndAge")
@ApiImplicitParams(value = {
      @ApiImplicitParam(paramType = "query",name= "username" ,value = "用户名"),
      @ApiImplicitParam(paramType = "query",name= "age" ,value = "年龄",dataType = "int"),
})
@ApiOperation(value = "通过用户名、年龄精确查询用户信息", notes="返回用户信息")
public User selectByNameAndAge(@RequestParam String username,@RequestParam Integer age){
   val queryWrapper = new LambdaQueryWrapper<User>();
   queryWrapper.eq(User::getName,username);
   queryWrapper.eq(User::getAge,age);
   return userService.getOne(queryWrapper);
}
```

### 实体类注解

```java
/*
* @ApiModel：描述一个Model的信息
* @ApiModelProperty：描述一个model的属性
*    value = 属性名称
*    required = 是否必须
*    hidden = 是否隐藏
*/
@ApiModel(value = "User对象", description = "")
public class User {

    @ApiModelProperty("编号")
    private Integer id;

    @ApiModelProperty("姓名")
    private String name;

    @ApiModelProperty("年龄")
    private Integer age;

    @ApiModelProperty("密码")
    private String passwd;

    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;
}
```

### 响应参数注解

```java
/**
* @ApiResponses：用于表示一组响应
* @ApiResponse：用在@ApiResponses中，一般用于表达一个错误的响应信息
*    code：响应代码，如400
*    message：响应信息，如“参数填写错误”
*    response：抛出异常的类
*/
@PostMapping
@ApiModelProperty(value="新增用户",notes = "新增用户信息")
@ApiResponses({
    @ApiResponse(code = 400,message = "请求参数错误"),
    @ApiResponse(code = 404,message = "请求路径错误")
})
public Boolean saveUser(@RequestBody User user){
    return userService.save(user);
}
```

## 附录

### Swagger安装中的问题

1、SpringBoot2.6以上集成Swagger3

​​ 　特别注意，在 `springboot 2.6.x`和`springboot2.7.x`中，不支持`swagger3`的折衷配置，需要新增如下配置解决，后面可以考虑升级到`springboot3.x`或降低版本。

```yaml
spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
```

2、SpringBoot集成Swagger2，需要引入如下依赖

```xml
<!--springfox-swagger2是基于Spring实现的swagger规范-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>

<!--springfox-swagger-ui是对swagger-ui的封装，使其可以使用Spring 的服务-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```



### Swagger测试实例
