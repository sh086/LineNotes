# Mybatis-Plus

​    　MyBatis-Plus（简称 MP）是一个 MyBatis的增强工具，在 MyBatis 的基础上**只做增强不做改变**，为 简化开发、提高效率而生。

​    　Mybatis Plus具有无侵入、损耗小、强大的 CRUD 操作、支持 Lambda 形式调用、支持主键自动生成、支持 ActiveRecord
模式、支持自定义全局通用操作、内置代码生成器、内置分页插件、分页插件支持多种数据库、内置性能分析插件、内置全局拦截插件等特性。

> [文档](https://baomidou.com/) | [GitHub](https://github.com/baomidou/mybatis-plus)

## 快速开始

​    　首先，新建一个 [Spring Boot 工程](https://start.spring.io/) ，并引入`mybatis-plus` 和 `mysql` 依赖。注意，引入 `MyBatis-Plus`
之后请不要再次引入 `MyBatis` 以及 `MyBatis-Spring`，以避免因版本差异导致的问题。

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

​    　接着，在`application.yml`中添加`spring.datasource`配置。

```yml
spring:
  # 配置数据源信息
  datasource:
    # 配置数据源类型
    type: com.zaxxer.hikari.HikariDataSource
    # 配置连接数据库信息
    driver-class-name: com.mysql.cj.jdbc.Driver
    # 配置连接信息
    url: jdbc:mysql://IP:3306/database?characterEncoding=utf8&useSSL=false
    username: root
    password: 密码
```

​    　然后，需要在`Spring Boot 启动类`中中添加 `@MapperScan` 注解，扫描 Mapper 文件夹。

或者 在实体类上加入@Mapper

```java{1}
@MapperScan("com.shooter.springboot.module.mapper")
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

​    　**至此，SpringBoot已经集成了MyBatis-Plus**。接下来继续编写测试程序，首先，新建`User`实体类。

```java
@Data
@Builder
@TableName("tc_user")
public class User  {
    private Long id;
    private String name;
    private Integer age;
}
```

​    　然后，编写 `Mapper` 包下的 `UserMapper`接口。

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {

}
```

此处加入@respon是为了防止UserMapper通关@Aud是注入时提示错误，好像不写也是可以正常操作的

​    　接着，编写`UserMapperTest`测试用例。

```java
@SpringBootTest
public class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testSelect() {
        List<User> userList = userMapper.selectList(null);
        userList.forEach(System.out::println);
    }
}
```

​    　测试用例执行结果如下，表明`Mybatis-Plus`已经整合成功了。

```text
User(id=1, name=小米, age=12)
```

## 核心功能

### 代码生成器

#### mybatis-plus-generator

​    　项目中的`controller`、`service`、`mapper`和 `xml` 以及 固定的业务代码 都可以由`Mybatis-Plus代码生成器`生成，参考[这里](https://baomidou.com/pages/981406/#%E6%95%B0%E6%8D%AE%E5%BA%93%E9%85%8D%E7%BD%AE-datasourceconfig)。

​    　首先，在`pom.xml`中引入`mybatis-plus-generator`依赖，注意，`MyBatis Plus`从`3.0.3`之后移除了代码生成器与模板引擎的默认依赖，所以需要**手动添加模板引擎的依赖**；另外，如果启用了`swagger`，还需要引入`swagger`依赖。

```xml
 <!--MybatisPlus Start-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.1</version>
</dependency>
<!--MybatisPlus End-->

<!--freemarker start-->
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.31</version>
</dependency>
<!--freemarker End-->

<!--swagger start-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
<!--swagger End-->
```

​    　代码自动生成有`快速生成`和`交互式生成`两种方式。快速生成多用于初始化项目，交互式生成多用于新增表后自动生成模板代码。这里建议使用

```java
package com.shooter.springboot;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.converts.MySqlTypeConvert;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.config.rules.IColumnType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import com.baomidou.mybatisplus.generator.fill.Column;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * MyBatis Plus 代码生成器
 */
@Slf4j
@SpringBootTest
public class CodeGeneratorTest {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    /**
     * 交互式生成
     */
    @Test
    public void codeGeneratorTurnTest() {
        val userDir = System.getProperty("user.dir").replace("\\","/");
        val javaPath = userDir + "/src/main/java";
        val resourcePath = userDir + "/src/main/resources";
        val freemarkerPath = resourcePath + "/templates/freemarker";

        // 1 配置数据源
        FastAutoGenerator.create(createDataSource(url,username,password))
                // 2 全局配置
                .globalConfig((scanner, builder) ->
                        builder.author(scanner.apply("请输入作者名称？"))
                                .enableSwagger() // 是否开启 swagger 模式
                                .fileOverride() // 覆盖已生成文件
                                .commentDate("yyyy-MM-dd hh:mm:ss") //注释日期
                                // 定义生成的实体类中日期的类型 TIME_PACK=LocalDateTime; ONLY_DATE=Date;
                                .dateType(DateType.TIME_PACK)
                                .outputDir(javaPath) // 指定输出目录
                                .disableOpenDir() // 禁止打开输出目录，默认打开
                                .fileOverride() // 覆盖之前的文件
                )
                // 3 包配置
                .packageConfig(builder -> {
                    builder.parent("com.shooter.springboot") // 设置父包名
                            .moduleName("module") // 设置模块包名
                            .entity("domain")   //pojo 实体类包名
                            .service("service") //Service 包名
                            .serviceImpl("service.impl") // ServiceImpl 包名
                            .mapper("mapper")   //Mapper 包名
                            .xml("mapper")  //Mapper XML 包名
                            .controller("controller") //Controller 包名
                            //.other("common") //自定义文件包名
                            // 设置mapperXml生成路径
                            .pathInfo(Collections.singletonMap(OutputFile.mapperXml,resourcePath+"/mapper"));
                })
                // 4 策略配置
                .strategyConfig((scanner, builder) ->
                        builder.addInclude(getTables(scanner.apply("请输入表名，多个英文逗号分隔？所有输入 all")))
                                .addTablePrefix("tc_","tb_") // 设置过滤表前缀
                                //Mapper 策略配置
                                .mapperBuilder()
                                .superClass(BaseMapper.class)   //设置父类
                                .formatMapperFileName("%sMapper")   //格式化 mapper 文件名称
                                .enableMapperAnnotation()       //开启 @Mapper 注解
                                .formatXmlFileName("%sXml") //格式化 Xml 文件名称

                                //service 策略配置
                                .serviceBuilder()
                                .formatServiceFileName("%sService") //格式化 service 接口文件名称，%s进行匹配表名，如 UserService
                                .formatServiceImplFileName("%sServiceImpl") //格式化 service 实现类文件名称，%s进行匹配表名，如 UserServiceImpl

                                //实体类 策略配置
                                .entityBuilder()
                                .enableLombok() //开启 Lombok
                                .idType(IdType.AUTO) //设置IdType注解
                                .disableSerialVersionUID()  //不实现 Serializable 接口，不生产 SerialVersionUID
                                //.logicDeleteColumnName("delete_flag")   //逻辑删除字段名
                                .logicDeletePropertyName("deleteFlag")   //逻辑删除属性名
                                .naming(NamingStrategy.underline_to_camel)  //数据库表映射到实体的命名策略：下划线转驼峰命
                                .columnNaming(NamingStrategy.underline_to_camel)    //数据库表字段映射到实体的命名策略：下划线转驼峰命
                                .addTableFills(
                                        new Column("create_time", FieldFill.INSERT),
                                        new Column("modify_time", FieldFill.INSERT_UPDATE),
                                        new Column("update_time", FieldFill.INSERT_UPDATE)
                                )   //添加表字段填充，"create_time"字段自动填充为插入时间，"modify_time"字段自动填充为插入修改时间
                                //.enableTableFieldAnnotation()       // 开启生成实体时生成字段注解

                                // Controller策略配置
                                .controllerBuilder()
                                .enableHyphenStyle() // 开启驼峰转连字符
                                .formatFileName("%sController") //格式化 Controller 类文件名称，%s进行匹配表名，如 UserController
                                .enableRestStyle()  //开启生成 @RestController 控制器
                )

                // 5 使用Velocity引擎模板，可选模板引擎 Beetl 或 Freemarker
                .templateEngine(new FreemarkerTemplateEngine())
                // .templateEngine(new BeetlTemplateEngine())

                // 6 执行
                .execute();
    }

    // 处理 all 情况
    protected static List<String> getTables(String tables) {
        return "all".equals(tables) ? Collections.emptyList() : Arrays.asList(tables.split(","));
    }

    /**
     * 自定义配置 DataSource
     */
    public DataSourceConfig.Builder createDataSource(String url, String username, String password) {
        return new DataSourceConfig.Builder(url, username, password)
                // 重写数据类型转换配置 MySqlTypeConvert
                .typeConvert(new MySqlTypeConvert(){
                    // 重写数据类型转换配置 MySqlTypeConvert
                    @Override
                    public IColumnType processTypeConvert(GlobalConfig config, String fieldType) {
                        //  若数据库字段类型是double，则返回 DbColumnType.DOUBLE
                        if(fieldType.equals("double")){
                            return DbColumnType.BIG_DECIMAL;
                        }
                        //tinyint转换成Boolean
                        if (fieldType.equals( "tinyint" ) ) {
                            return DbColumnType.BOOLEAN;
                        }
                        //将数据库中datetime转换成date
                        if (fieldType.equals( "data" )) {
                            return DbColumnType.LOCAL_DATE_TIME;
                        }
                        return super.processTypeConvert(config, fieldType);
                    }
                });
    }
}
```

#### MybatisX

### CRUD 接口

#### Mapper CRUD

MyBatis-Plus中的基本CRUD在内置的BaseMapper中都已得到了实现，我们可以直接使用，接口如 下：

- 通用 CRUD 封装[BaseMapper (opens new window)](https://gitee.com/baomidou/mybatis-plus/blob/3.0/mybatis-plus-core/src/main/java/com/baomidou/mybatisplus/core/mapper/BaseMapper.java)接口，为 `Mybatis-Plus` 启动时自动解析实体表关系映射转换为 `Mybatis` 内部对象注入容器

#### Service CRUD

通用 Service CRUD 封装IService接口，进一步封装 CRUD 采用 get 查询单行 remove 删除 list 查询集合 page 分页 前缀命名方式区分 Mapper 层避免混淆

建议如果存在自定义通用 Service 方法的可能，请创建自己的 IBaseService 继承 Mybatis-Plus 提供的

​    　Mybatis-Plus提供了[Service CRUD 接口] 和 Mapper CRUD 接口

### 条件构造器

## 扩展

### 主键策略

### 字段类型处理器

### 逻辑删除

### 通用枚举

### 自动填充功能

### SQL注入器

### 执行SQL分析打印

#### 配置日志输出

​    　在`application.yml`中配置MyBatis日志的输出。

```yml
mybatis-plus:
  configuration:
    # 配置MyBatis日志
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

​    　配置完成后，在再次执行CRUD语句，即可打印出MyBatis日志。

```shell
==>  Preparing: SELECT id,name,age FROM tc_user
==> Parameters: 
<==    Columns: id, name, age
<==        Row: 1, 小米, 12
<==      Total: 1
```

### 多数据源

## 插件

### 乐观锁插件

## 附录

1、MybatisPlus数据库连接配置

（1）驱动类`driver-class-name`

​    　**SpringBoot 2.0**内置`jdbc5驱动`，驱动类需使用 `com.mysql.jdbc.Driver`；**SpringBoot 2.1及以上**内置`jdbc8驱动`，驱动类需使用`com.mysql.cj.jdbc.Driver`。

（2）连接地址url

​    　连接MySQL8.0版本时，必须在 url 或 数据库 中配置`serverTimezone`值，否则提示SQLException异常。

```yml
# MySQL5.7版本的url：
url: jdbc:mysql://localhost:3306/database?characterEncoding=utf-8&useSSL=false
# MySQL8.0版本的url：
url: jdbc:mysql://localhost:3306/database?serverTimezone=GMT%2B8&characterEncoding=utf-8&useSSL=false
```

为MyBatis-Plus在实现插入数据时，会默认基于雪花算法的策略生成id

默认是id为主键，id默认使用雪花算法生产唯一主键

设置自动递增，数据库也需要同步设置

id如果设值了，以设定的值为准，否则是统一的，默认雪花算法生产

非主键默认使用驼峰转换，可以通过@tableFiled指定属性名，解决属性名和字段名不一致问题

默认每个条件使用and连接，可以使用or()来指定使用or来连接

分页第一个参数必须是page

使用@Repostitory标识Mapper为一个持久化注解，使得通过@AutoWrite不报错

@EnumValue将注解所标识的属性的值存储的数据库中
