# SpringBoot整合MyBatisPlus

​    　[Mybatis Plus](https://baomidou.com/)是MyBatis的增强工具，具有无侵入、损耗小、强大的 CRUD 操作、支持 Lambda 形式调用、支持主键自动生成、支持 ActiveRecord 模式、支持自定义全局通用操作、内置代码生成器、内置分页插件、分页插件支持多种数据库、内置性能分析插件、内置全局拦截插件等特性。



## 快速开始

### 引入依赖

​	　首先，新建一个 [Spring Boot 工程](https://start.spring.io/) ，并引入`mybatis-plus` 和 `mysql` 依赖。注意，引入 `MyBatis-Plus` 之后请不要再次引入 `MyBatis` 以及 `MyBatis-Spring`，以避免因版本差异导致的问题。

```xml
<!--MyBatis-Plus依赖-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.1</version>
</dependency>
<!--MySql依赖-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```



### 配置

​	　首先，在`application.yml`中添加`spring.datasource`配置。

```yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://IP:3306/database?characterEncoding=utf8&useSSL=false
    username: root
    password: 密码
```

​	　然后，需要在`Spring Boot 启动类`中中添加 `@MapperScan` 注解，扫描 Mapper 文件夹。

```java{1}
@MapperScan("com.shooter.springboot.module.mapper")
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```



### 编码

​	　首先，新建`User`实体类。

```java
@Data
@TableName("user")
public class User  {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```

​	　然后，编写 `Mapper` 包下的 `UserMapper`接口。

```java
public interface UserMapper extends BaseMapper<User> {

}
```



## 单元测试

```java
@SpringBootTest
public class UserMapperTest {

    @Resource
    private UserMapper userMapper;

    @Test
    public void testSelect() {
        List<User> userList = userMapper.selectList(null);
        userList.forEach(System.out::println);
    }
}
```

​	　测试用例执行结果如下，表明`Mybatis`已经整合成功了。

```text
User(id=1, name=Jone, age=18, email=test1@baomidou.com)
```



## 附录

### 完整pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>com.shooter</groupId>
    <artifactId>spring-boot-start</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>spring-boot-start</name>
    <description>Demo project for Spring Boot</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.1</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <!-- project config -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!--SpringBoot Start-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!--SpringBoot End-->

        <!--Mybatis Start-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.4.3.4</version>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-generator</artifactId>
            <version>3.5.1</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!--Mybatis End-->

        <!--Common Start-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--Common End-->

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

