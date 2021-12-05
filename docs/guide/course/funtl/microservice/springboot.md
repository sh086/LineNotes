---
sidebar: auto
---

# SpringBoot

​	　Spring Boot 是 **新一代 JavaEE 开发标准**，具有 **约定优于配置** 、**开箱即用**的特性，使用很少的 Spring 配置即可快速创建一个准生产级别的基于 Spring 框架的项目。



**参考资料：**

- [Starter POM](https://docs.spring.io/spring-boot/docs/2.0.2.RELEASE/reference/html/using-boot-build-systems.html#using-boot-starter)



## 简介

​	　Spring 是开发 JAVA 应用程序的**轻量级开源框架**，可以降低企业应用开发的复杂性问题。Spring的发展阶段如下：

```
Spring 1.x 时代 : 通过 xml 文件配置 bean,需要频繁的在 java 类和 xml 配置文件中切换
Spring 2.x 时代 : 应用的基本配置用xml、业务开发用注解 对Bean进行注入, 简化了项目的开发
Spring 3.x 时代 : 使用 Java 配置的方式对Bean进行注入（Spring Boot）
Spring 5.x 时代 : 提供了完整的端到端响应式编程的支持（Spring WebFlux）
```

​	　`Spring WebFlux`**响应式Web框架**代表着 Java 正式迎来了响应式异步编程的时代。

```
    Spring MVC(传统)                Spring WebFlux
--------------------------------------------------------
  MVC Controller      ====>      Reactive Controller
--------------------------------------------------------
HttpServletRequest    ---->    ServerHttpRequest(非阻塞)
HttpServletResponse   ---->    ServerHttpResponse(非阻塞)
```



## 快速开始

​	　通过`Spring Initializr`新建 `Spring Boot`项目，并选择 `Spring Boot RELEASE版本`及 `Web 开发所需的依赖`。新建的`SpringBoot`项目目录如下：

```shell
src
----main
------java
--------com.shooter.moudle
----------Application                 # 程序入口
------resources                       # 资源文件目录
--------static                        # 静态资源文件目录
--------templates                     # 模板资源文件目录
--------application.yml               # Spring Boot 的配置文件
----test                              # 测试目录    
------java
------resources
pomx.xml                              # Maven 依赖管理配置文件    
.gitignore                            # Git 过滤配置文件
```

​	　接着，新建一个`IndexController`。

```java
package com.shooter.funtl.springboot.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {
    @GetMapping(value = "")
    public String sayHi() {
        return "Hello Spring Boot";
    }
}
```

​	　最后，启动 `Application` 的 `main()` 方法，浏览器访问 `http://localhost:8080` 。



## SpringBoot注解

### @SpringBootApplication

```java
// 数据源的自动配置
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
```



### @Configuration

​	　@Configuration用于定义配置类，定义的配置类可以替换xml文件，一般和@Bean注解联合使用。

```java
// @Configuration注解主要标注在某个类上，相当于xml配置文件中的<beans>
@Configuration
public class MockConfiguration{
    // @Bean注解主要标注在某个方法上，相当于xml配置文件中的<bean>
 	@Bean
 	public MockService mockService(){
    	return new MockServiceImpl();
  	}
}
```



### @SpringBootTest

​	　在`HttpTests`中新建单元测试用例，用于测试 `http://localhost:8080`是否可以正常访问。

```java
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class HttpTests {

    @LocalServerPort
    private int port;
    @Autowired
    private TestRestTemplate template;

    @Test
    @SneakyThrows
    public void contextLoads() {
        URL base = new URL("http://localhost:" + port + "/");
        val response = template.getForEntity(base.toString(), String.class);
        assertThat(response.getBody(), equalTo("Hello Spring Boot"));
    }
}
```



## Thymeleaf

​	　Spring Boot 中推荐使用 Thymeleaf 作为模板引擎，Thymeleaf模板引擎具有**开箱即用**的特性，既可让美工在浏览器查看页面的静态效果，也可以让开发者在服务器查看带数据的动态页面效果。

​	　Thymeleaf在 HTML 标签里增加额外的属性来达到`模板 + 数据`的展示方式。浏览器解释 HTML时会忽略未定义的标签属性，所以 Thymeleaf 模板可以静态地运行；当有数据返回到页面时，Thymeleaf 标签会动态地替换掉静态内容，使页面动态显示。

```html
<!--
- Thymeleaf 模板
- 有网络：显示API返回的word
- 无网络：显示默认的word
-->
<p th:text="${word}">前端默认值</p>
```



### 整合Thymeleaf

​	　首先，引入`Thymeleaf`所需的依赖。

```xml
<!---SpringBoot整合Thymeleaf-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<!---允许使用非严格的 HTML 语法-->
<dependency>
    <groupId>net.sourceforge.nekohtml</groupId>
    <artifactId>nekohtml</artifactId>
    <version>1.9.22</version>
</dependency>
```

​	　然后，在`application-yml`中配置`Thymeleaf`。其中，`LEGACYHTML5`表示使用**非严格HTML语法**，建议配置； `HTML`表示使用严格HTML语法。

```yaml
spring:
  thymeleaf:
    cache: false       # 开发时关闭缓存,不然没法看到实时页面
    mode: LEGACYHTML5  # 使用非严格HTML语法
    encoding: UTF-8
    servlet:
      content-type: text/html
```

​	　接着，修改`IndexController`中的登录请求。

```java
@Controller
public class IndexController {
    @GetMapping(value = "")
    public String index(Model model) {
        model.addAttribute("word","Hello SpringBoot Thymeleaf");
        return "index";
    }
}
```

​	　最后，在`templates`目录下新建`index.html`欢迎页面。

```html{3,9}
<!DOCTYPE html>
<!---引入 thymeleaf 引擎，支持th:*语法-->
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Hello</title>
</head>
<body>
     <p th:text="${word}"></p>
</body>
</html>
```

​	　至此，再次访问`http://127.0.0.1:8080/`即可看到修改后的页面。



### Thymeleaf模板

​	　首先定义一个` footer.html` 代码片段。

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
    <body>
         <!--方式一：可以使用 th:fragment 选取模块-->
         <div th:fragment="section-one">section-one</div>
         <!--方式二：可以通过 CSS选择器 选取模块-->
         <div id="section-two">section-two</div>
    </body>
</html>
```

​	　可以通过 `th:include` 或者 `th:replace` 属性引用到页面上。

```html
<!--th:include方式，引入子模块的 children，依然保留父模块的 tag-->
<div th:include="footer :: section-one"></div>   ===>  <div>section-one</div>

<!--th:replace方式，引入子模块的所有，不保留父模块的 tag-->
<div th:replace="footer :: #section-two"></div>  ===>  <footer>section-two</footer>
```

​	　特别的，也可以指定引用的是整个页面，还是仅引入页面中的某个模块。

```shell
# templatename 和 domselector 的写法都支持表达式写法
templatename::domselector                      # 引入模板页面中的某个模块
templatename                                   # 引入整个模板页面
::domselector 或者 this::domselector            # 引入自身模板的模块
```

​	

## MyBatis

### 整合MyBatis

​	　首先，引入`MyBatis`所需的依赖。

```xml
<!--Spring Boot Druid--->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.10</version>
</dependency>
<!--MySQL 8--->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
<!--tk.mybatis--->
<dependency>
    <groupId>tk.mybatis</groupId>
    <artifactId>mapper-spring-boot-starter</artifactId>
    <version>2.0.2</version>
</dependency>
<!--PageHelper--->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.5</version>
</dependency>
```

​	　接着，在 `application.yml` 中进行`datasource`和`mybatis`配置。

```yaml
spring:
  datasource:
    druid:
      url: jdbc:mysql://IP:3306/myshop?useUnicode=true&characterEncoding=utf-8&useSSL=false
      username: root
      password: 密码
      initial-size: 1
      min-idle: 1
      max-active: 20
      test-on-borrow: true
      # MySQL 8.x: com.mysql.cj.jdbc.Driver
      # MySQL 5.x: com.mysql.jdbc.Driver
      driver-class-name: com.mysql.cj.jdbc.Driver

mybatis:
  type-aliases-package: com.shooter.funtl.springboot.entity
  mapper-locations: classpath:mapper/*.xml
```

​	　然后，创建一个通用的父级接口。

```java
package com.shooter.funtl.springboot.common.mybatis;
import tk.mybatis.mapper.common.Mapper;
import tk.mybatis.mapper.common.MySqlMapper;

/**
 * 通用的父级接口
 * 特别注意，该接口不能被扫描到，否则会出错
 */
public interface BaseMapper<T> extends Mapper<T>, MySqlMapper<T> {
}
```



### 自动完成代码

​	　可以使用 MyBatis 的 Maven 插件自动生成代码。首先，在 `pom.xml` 文件中增加 `mybatis-generator-maven-plugin` 插件。

```xml{10}
<build>
    <plugins>
        <plugin>
            <groupId>org.mybatis.generator</groupId>
            <artifactId>mybatis-generator-maven-plugin</artifactId>
            <version>1.3.5</version>
            <configuration>
                <!---自动生成所需的配置文件路径--->
                <configurationFile>
                    src/main/resources/config/generator/generatorConfig.xml
                </configurationFile>
                <overwrite>true</overwrite>
                <verbose>true</verbose>
            </configuration>
            <dependencies>
                <dependency>
                    <groupId>mysql</groupId>
                    <artifactId>mysql-connector-java</artifactId>
                    <version>${mysql.version}</version>
                </dependency>
                <dependency>
                    <groupId>tk.mybatis</groupId>
                    <artifactId>mapper</artifactId>
                    <version>3.4.4</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

​	　接着，在 `resources/config/generator/` 目录下创建 `generatorConfig.xml` 配置文件。

```xml{9,25,53,65,67,60}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<!-- 配置生成器 -->
<generatorConfiguration>
    <!-- 引入数据库连接配置 -->
    <properties resource="./config/jdbc.properties"/>

    <context id="Mysql" targetRuntime="MyBatis3Simple" defaultModelType="flat">
        <!-- 生成的Java文件的编码 -->
        <property name="javaFileEncoding" value="UTF-8"/>
        <!-- 格式化java代码 -->
        <property name="javaFormatter" value="org.mybatis.generator.api.dom.DefaultJavaFormatter"/>
        <!-- 格式化XML代码 -->
        <property name="xmlFormatter" value="org.mybatis.generator.api.dom.DefaultXmlFormatter"/>

        <!-- beginningDelimiter和endingDelimiter：指明数据库的用于标记数据库对象名的符号，比如ORACLE就是双引号，MYSQL默认是`反引号； -->
        <property name="beginningDelimiter" value="`"/>
        <property name="endingDelimiter" value="`"/>

        <!-- 配置 tk.mybatis 插件 -->
        <plugin type="tk.mybatis.mapper.generator.MapperPlugin">
            <property name="mappers" value="com.shooter.funtl.springboot.common.mybatis.BaseMapper"/>
        </plugin>

        <!-- 配置数据库连接 -->
        <jdbcConnection
                driverClass="${jdbc.driverClass}"
                connectionURL="${jdbc.connectionURL}"
                userId="${jdbc.username}"
                password="${jdbc.password}">
        </jdbcConnection>

        <!-- java类型处理器
            用于处理DB中的类型到Java中的类型，默认使用JavaTypeResolverDefaultImpl；
            注意一点，默认会先尝试使用Integer，Long，Short等来对应DECIMAL和 NUMERIC数据类型；
        -->
        <javaTypeResolver type="org.mybatis.generator.internal.types.JavaTypeResolverDefaultImpl">
            <!--
                true：使用BigDecimal对应DECIMAL和 NUMERIC数据类型
                false：默认,
                    scale>0;length>18：使用BigDecimal;
                    scale=0;length[10,18]：使用Long；
                    scale=0;length[5,9]：使用Integer；
                    scale=0;length<5：使用Short；
             -->
            <property name="forceBigDecimals" value="false"/>
        </javaTypeResolver>

        <!-- 配置实体类存放路径 -->
        <javaModelGenerator targetPackage="com.shooter.funtl.springboot.entity" targetProject="src/main/java"/>

        <!-- 配置 XML 存放路径 -->
        <sqlMapGenerator targetPackage="mapper" targetProject="src/main/resources"/>

        <!-- 配置 DAO 存放路径 -->
        <javaClientGenerator
                targetPackage="com.shooter.funtl.springboot.mapper"
                targetProject="src/main/java"
                type="XMLMAPPER"/>

        <!-- 配置需要指定生成的数据库和表，% 代表所有表 -->
        <table catalog="${jdbc.database}" tableName="%">
            <!-- 取消catelog Mysql不支持 -->
            <property name="ignoreQualifiersAtRuntime" value="true"/>
            <!-- mysql 配置 -->
            <generatedKey column="id" sqlStatement="Mysql" identity="true"/>
        </table>
    </context>
</generatorConfiguration>
```

​	　然后，在 `resources/config` 目录下创建 `jdbc.properties` 数据源配置。

```properties
# MySQL 8.x: com.mysql.cj.jdbc.Driver
# MySQL 5.x: com.mysql.jdbc.Driver
jdbc.driverClass= com.mysql.cj.jdbc.Driver
jdbc.connectionURL=jdbc:mysql://IP:3306/myshop?useUnicode=true&characterEncoding=utf-8&useSSL=false
jdbc.username=root
jdbc.password=密码
jdbc.database=myshop
```

​	　最后，执行Maven插件自动生成通用代码，命令执行完成后，重新reload项目，发现entity、mapper目录下已经有了自动生成的代码了。

```shell
mvn mybatis-generator:generate
```



### MyBatis操作数据库

​	　首先，需要使用 `@MapperScan` 注解来指定 Mapper 接口的路径。

```java{1,4}
import tk.mybatis.spring.annotation.MapperScan;

@SpringBootApplication
@MapperScan(basePackages = "com.shooter.funtl.springboot.mapper")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

​	　然后，编写测试类。

```java
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.shooter.funtl.springboot.entity.TcUser;
import com.shooter.funtl.springboot.mapper.TcUserMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;
import tk.mybatis.mapper.entity.Example;
import java.util.Date;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
@Rollback
public class MyBatisTests {

    /**
     * 注入数据查询接口
     */
    @Autowired
    private TcUserMapper tbUserMapper;

    /**
     * 测试插入数据
     */
    @Test
    public void testInsert() {
        // 构造一条测试数据
        TcUser tbUser = new TcUser();
        tbUser.setName("小黄");
        tbUser.setAge(12);
        tbUser.setCreateTime(new Date());

        // 插入数据
        tbUserMapper.insert(tbUser);
    }

    /**
     * 测试删除数据
     */
    @Test
    public void testDelete() {
        // 构造条件，等同于 DELETE from tb_user WHERE username = 'Lusifer'
        Example example = new Example(TcUser.class);
        example.createCriteria().andEqualTo("username", "Lusifer");

        // 删除数据
        tbUserMapper.deleteByExample(example);
    }

    /**
     * 测试修改数据
     */
    @Test
    public void testUpdate() {
        // 构造条件
        Example example = new Example(TcUser.class);
        example.createCriteria().andEqualTo("username", "Lusifer");

        // 构造一条测试数据
        TcUser tbUser = new TcUser();
        tbUser.setName("小蓝");
        tbUser.setAge(89);
        tbUser.setCreateTime(new Date());

        // 修改数据
        tbUserMapper.updateByExample(tbUser, example);
    }

    /**
     * 测试查询集合
     */
    @Test
    public void testSelect() {
        List<TcUser> tbUsers = tbUserMapper.selectAll();
        for (TcUser tbUser : tbUsers) {
            System.out.println(tbUser.getName());
        }
    }

    /**
     * 测试分页查询
     */
    @Test
    public void testPage() {
        // PageHelper 使用非常简单，只需要设置页码和每页显示笔数即可
        PageHelper.startPage(0, 2);

        // 设置分页查询条件
        Example example = new Example(TcUser.class);
        PageInfo<TcUser> pageInfo = new PageInfo<>(tbUserMapper.selectByExample(example));

        // 获取查询结果
        List<TcUser> tbUsers = pageInfo.getList();
        for (TcUser tbUser : tbUsers) {
            System.out.println(tbUser.getName());
        }
    }
}
```



## 附录

### pom.xml

​	　 `pom.xml`是Spring Boot的项目管理和依赖配置文件。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.shooter.funtl</groupId>
    <artifactId>springboot</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>springboot</name>
    <description>Demo project for Spring Boot</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.6.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!--SpringBoot START-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!--SpringBoot END-->

        <!--Thymeleaf START-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>net.sourceforge.nekohtml</groupId>
            <artifactId>nekohtml</artifactId>
            <version>1.9.22</version>
        </dependency>
        <!--Thymeleaf END-->

        <!--Mybatis START-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.10</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>tk.mybatis</groupId>
            <artifactId>mapper-spring-boot-starter</artifactId>
            <version>2.0.2</version>
        </dependency>
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.2.5</version>
        </dependency>
        <!--Mybatis END-->

        <!--Utils START-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--Utils END-->

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.3.5</version>
                <configuration>
                    <configurationFile>src/main/resources/config/generator/generatorConfig.xml</configurationFile>
                    <overwrite>true</overwrite>
                    <verbose>true</verbose>
                </configuration>
                <dependencies>
                    <dependency>
                        <groupId>mysql</groupId>
                        <artifactId>mysql-connector-java</artifactId>
                        <version>${mysql.version}</version>
                    </dependency>
                    <dependency>
                        <groupId>tk.mybatis</groupId>
                        <artifactId>mapper</artifactId>
                        <version>3.4.4</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
        
         <!-- 资源文件配置 -->
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <excludes>
                    <exclude>**/*.java</exclude>
                </excludes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
            </resource>
        </resources>
        
    </build>

</project>
```



### application.yml

（1）全局的配置文件生效顺序

​	　若存在全局的配置文件不生效的情况，建议改成`bootstrap.properties`尝试一下。

```properties
# Spring Boot全局的配置文件生效顺序
bootstrap.properties（最高优先级，建议使用）
bootstrap.yml
application.properties
application.yml
```



（2）YML配置示例

​	　常用的是`YML`语法，参见[这里](https://docs.spring.io/spring-boot/docs/2.0.2.RELEASE/reference/html/common-application-properties.html)。

```yaml
server:
  port: 8080                # 默认的启动端口为 8080 修改为 9090
  servlet:
    context-path: /         # 默认的访问路径为  /

# 默认情况下，Spring Boot 使用 Logback 作为日志框架
logging:
  file:
    name: ./logs/log..log
  level:
    root: info
    org.mybatis: info
    org.springframework: info
    org.springframework.jdbc: info
    com.shooter.funtl.springboot: debug

spring:
  datasource:
    druid:
      url: jdbc:mysql://IP:3306/myshop?useUnicode=true&characterEncoding=utf-8&useSSL=false
      username: root
      password: 密码
      initial-size: 1
      min-idle: 1
      max-active: 20
      test-on-borrow: true
      # MySQL 8.x: com.mysql.cj.jdbc.Driver
      # MySQL 5.x: com.mysql.jdbc.Driver
      driver-class-name: com.mysql.cj.jdbc.Driver
  thymeleaf:
    cache: false       # 开发时关闭缓存,不然没法看到实时页面
    mode: LEGACYHTML5  # 使用非严格HTML5
    encoding: UTF-8
    servlet:
      content-type: text/html

mybatis:
  type-aliases-package: com.shooter.funtl.springboot.entity
  mapper-locations: classpath:mapper/*.xml
```



### banner

​	　可以在`src/main/resources` 目录下新建一个 `banner.txt`，来自定义`Spring Boot`默认的启动图案。

```shell
# 常用属性设置
${AnsiColor.BRIGHT_RED}           # 设置控制台中输出内容的颜色
${spring-boot.version}            # Spring Boot 的版本号,如2.2.6.RELEASE
${spring-boot.formatted-version}  # 格式化后的 ${spring-boot.version}
${application.version}            # 用来获取 MANIFEST.MF 文件中的版本号
${application.formatted-version}  # 格式化后的 ${application.version} 版本信息

////////////////////////////////////////////////////////////////////
//                          _ooOoo_                               //
//                         o8888888o                              //
//                         88" . "88                              //
//                         (| ^_^ |)                              //
//                         O\  =  /O                              //
//                      ____/`---'\____                           //
//                    .'  \\|     |//  `.                         //
//                   /  \\|||  :  |||//  \                        //
//                  /  _||||| -:- |||||-  \                       //
//                  |   | \\\  -  /// |   |                       //
//                  | \_|  ''\---/''  |   |                       //
//                  \  .-\__  `-`  ___/-. /                       //
//                ___`. .'  /--.--\  `. . ___                     //
//              ."" '<  `.___\_<|>_/___.'  >'"".                  //
//            | | :  `- \`.;`\ _ /`;.`/ - ` : | |                 //
//            \  \ `-.   \_ __\ /__ _/   .-` /  /                 //
//      ========`-.____`-.___\_____/___.-`____.-'========         //
//                           `=---='                              //
//      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        //
//            佛祖保佑       永不宕机     永无BUG                  //
////////////////////////////////////////////////////////////////////
```

