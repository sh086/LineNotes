# SpringBoot整合MybatisPlus

​	　MyBatis-Plus（简称 MP）是MyBatis的增强工具，具有无侵入、损耗小、强大的 CRUD 操作、支持 Lambda 形式调用、支持主键自动生成、支持 ActiveRecord 模式、支持自定义全局通用操作、内置代码生成器、内置分页插件、分页插件支持多种数据库、内置性能分析插件、内置全局拦截插件等特性。



**参考资料:**

- [Mybatis Plus GitHub](https://github.com/baomidou/mybatis-plus)
- [Mybatis Plus 官网](https://baomidou.com/)
- [Mybatis Plus Samples Quickstart](https://github.com/baomidou/mybatis-plus-samples/tree/master/mybatis-plus-sample-quickstart)



## 快速开始

### pom.xml

​	　首先，新建一个`Spring Boot`项目，并添加如下依赖。

```xml
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
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

​	　接着引入`mybatis-plus` 和 `mysql` 依赖。注意，引入 `MyBatis-Plus` 之后请不要再次引入 `MyBatis` 以及 `MyBatis-Spring`，以避免因版本差异导致的问题。

```xml{4}
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.3.4</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

### application.yml

​	　在`application.yml`中添加`spring.datasource`和`mybatis-plus`配置。

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://IP:3306/database?characterEncoding=utf8&useSSL=true
    username: 用户名密码
    password: 密码

mybatis-plus:
  # Mapper扫描
  mapper-locations: classpath:/mapper/*Mapper.xml
  #实体扫描，多个package用逗号或者分号分隔
  typeAliasesPackage: com.shooter.quickstart.*.entity
  # 全局配置
  global-config:
    #主键类型  0:"数据库ID自增", 1:"用户输入ID",2:"全局唯一ID (数字类型唯一ID)", 3:"全局唯一ID UUID";
    id-type: 0
    #字段策略 0:"忽略判断",1:"非 NULL 判断"),2:"非空判断"
    field-strategy: 2
    #驼峰下划线转换
    db-column-underline: true
    #刷新mapper 调试神器
    refresh-mapper: true
    #数据库大写下划线转换
    #capital-mode: true
  configuration:
    map-underscore-to-camel-case: true
    cache-enabled: false
    #配置JdbcTypeForNull
    jdbc-type-for-null: 'null'
```



### Application

​	　需要在在`Application`中配置 `MapperScan` 注解。

```java{2}
@SpringBootApplication
@MapperScan("com.shooter.quickstart.mybatisplus.mapper")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### SpringBootTest

​	　接下来，完成一个简单的用户查询功能，验证`MybatisPlus`是否已经整合成功了。首先，新建`User`实体类。

```java{7}
package com.shooter.quickstart.mybatisplus.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("tb_user")
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```

​	　然后，新建`UserMapper`数据处理层。

```java{6}
package com.shooter.quickstart.mybatisplus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shooter.quickstart.mybatisplus.entity.User;

public interface UserMapper extends BaseMapper<User> {

}
```

​	　编写测试用例`QuickStartTest`测试。

```java
package com.shooter.quickstart.mybatisplus;

import com.shooter.quickstart.mybatisplus.entity.User;
import com.shooter.quickstart.mybatisplus.mapper.UserMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import javax.annotation.Resource;
import java.util.List;

@SpringBootTest
public class QuickStartTest {

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

```
User(id=1, name=小米, age=12, email=ui@qq.com)
```



## 代码自动生成

​	　项目中的`controller`、`service`、`mapper`和`xml`都可以由`MybatisPlus`生成。首先，在`pom.xml`中引入`mybatis-plus-generator`依赖。

```xml{4}
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.1</version>
</dependency>
```

​	　另外，`MyBatis Plus` 从 `3.0.3` 之后移除了代码生成器与模板引擎的默认依赖，需要手动添加相关依赖。

```xml
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.31</version>
</dependency>
```



### CodeGenerator

​	　代码自动生成有`快速生成`和`交互式生成`两种方式。快速生成多用于初始化项目，交互式生成多用于新增表后自动生成模板代码。

（1）快速生成

```java
package com.shooter.quickstart.mybatisplus.mybatis;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import com.baomidou.mybatisplus.generator.fill.Column;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.Collections;

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
     * 快速生成
     */
    @Test
    public void quickGeneratorTest() {

        val javaPath = System.getProperty("user.dir") + "/src/main/java";
        val resourcePath = System.getProperty("user.dir") + "/src/main/resources";
        FastAutoGenerator.create(url,username,password)
                .globalConfig(builder -> {
                    builder.author("author") // 设置作者
                            .fileOverride() // 覆盖已生成文件
                            .outputDir(javaPath) // 指定输出目录
                            .disableOpenDir().fileOverride();
                })
                .packageConfig(builder -> {
                    builder.parent("com.shooter.quickstart") // 设置父包名
                            .moduleName("mybatisplus") // 设置父包模块名
                            .pathInfo(Collections.singletonMap(OutputFile.mapperXml,
                                    resourcePath+"/mapper")); // 设置mapperXml生成路径
                })
                .strategyConfig(builder -> {
                    builder.addInclude("tb_user") // 设置需要生成的表名
                            .addTablePrefix("t_", "c_") // 设置过滤表前缀
                            .controllerBuilder().enableRestStyle().enableHyphenStyle()
                            .entityBuilder().enableLombok().addTableFills(
                            new Column("create_time", FieldFill.INSERT),
                            new Column("update_time", FieldFill.INSERT_UPDATE)
                    );
                })

                // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .templateEngine(new FreemarkerTemplateEngine())
                .execute();
    }
}
```



（2）交互生成

```java
package com.shooter.quickstart.mybatisplus.mybatis;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
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
        val javaPath = System.getProperty("user.dir") + "/src/main/java";
        val resourcePath = System.getProperty("user.dir") + "/src/main/resources";

        FastAutoGenerator.create(url,username,password)
                // 全局配置
                .globalConfig((scanner, builder) -> builder.author(scanner.apply("请输入作者名称？"))
                        .fileOverride().outputDir(javaPath).disableOpenDir())
                // 包配置
                .packageConfig(builder -> {
                    builder.parent("com.shooter.quickstart") // 设置父包名
                            .moduleName("mybatisplus") // 设置父包模块名
                            .pathInfo(Collections.singletonMap(OutputFile.mapperXml,
                                    resourcePath+"/mapper")); // 设置mapperXml生成路径
                })
                // 策略配置
                .strategyConfig((scanner, builder) -> builder.addInclude(getTables(scanner.apply("请输入表名，多个英文逗号分隔？所有输入 all")))
                        .controllerBuilder().enableRestStyle().enableHyphenStyle()
                        .entityBuilder().enableLombok().addTableFills(
                                new Column("create_time", FieldFill.INSERT),
                                new Column("update_time", FieldFill.INSERT_UPDATE)
                        ).build())
                // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .templateEngine(new FreemarkerTemplateEngine())
                .execute();
    }

    // 处理 all 情况
    protected static List<String> getTables(String tables) {
        return "all".equals(tables) ? Collections.emptyList() : Arrays.asList(tables.split(","));
    }
}
```



### MySqlTypeConvert

​	　MybatisPlus支持在生成代码的时候，自定义`MySqlTypeConvert`，在数据库类型和生成的Java数据类型之间进行转换。如下若数据库字段类型是`double`，生成的类型改为`BigDecimal`。

```java
/**
* 自定义配置 DataSource
*/
public DataSourceConfig.Builder createDataSource(String url,String username,String password) {
    return new DataSourceConfig.Builder(url, username, password)
        // 重写数据类型转换配置 MySqlTypeConvert
        .typeConvert(new MySqlTypeConvert(){
            // 重写数据类型转换配置 MySqlTypeConvert
            @Override
            public IColumnType processTypeConvert(GlobalConfig config, String fieldType) {
                //  若数据库字段类型是double，则返回 DbColumnType.DOUBLE
                if(fieldType.contains("double")){
                    return DbColumnType.BIG_DECIMAL;
                }
                return super.processTypeConvert(config, fieldType);
            }
        });
}
```

​	　自定义规则完成后，即可按照如下示例引用，重新生成实体类即可。

```java
FastAutoGenerator.create(createDataSource(url,username,password));
```

​	　自定义`MySqlTypeConvert`执行效果如下。

```java
// 配置前，代码自动生成效果
private Double money;

// 配置后，代码自动生成效果
private BigDecimal money;
```



### 测试用例

​	　代码自动生成完成后，可以通过如下测试用例测试生成的代码是否正确。

```java
package com.shooter.quickstart.mybatisplus;

import com.shooter.quickstart.mybatisplus.entity.TbUser;
import com.shooter.quickstart.mybatisplus.mapper.TbUserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import javax.annotation.Resource;
import java.util.List;

@SpringBootTest
public class QuickStartTest {

    @Resource
    private TbUserMapper userMapper;

    @Test
    public void testSelect() {
        List<TbUser> userList = userMapper.selectList(null);
        userList.forEach(System.out::println);
    }
}
```



## Mybatsi拓展

### MetaObjectHadler

​	　`MybatisPlus`可以通过`MetaObjectHandler`接口，自动填充创建时间更新时间。

```java
package com.shooter.quickstart.mybatisplus.common.mybatis;

import lombok.val;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class MetaObjectHandler implements com.baomidou.mybatisplus.core.handlers.MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        val now = LocalDateTime.now();
        insertIfHasProperty(metaObject, "createTime", now, false);
        insertIfHasProperty(metaObject, "updateTime", now, false);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        val now = LocalDateTime.now();
        insertIfHasProperty(metaObject, "updateTime", now, true);
    }

    private void insertIfHasProperty(MetaObject metaObject, String fieldName, Object fieldVal, boolean override) {
        Object oldValue = getFieldValByName(fieldName, metaObject);
        if (override || oldValue == null) {
            setFieldValByName(fieldName, fieldVal, metaObject);
        }
    }
}
```

​	　特别的，`User类`的`createTime`和`updateTime`要通过`fill = FieldFill.INSERT`声明执行时机。

```java
@TableField(fill = FieldFill.INSERT)
private LocalDateTime createTime;
    
@TableField(fill = FieldFill.INSERT_UPDATE)
private LocalDateTime updateTime;
```

​	　编写测试用例，新增User数据，但不设置`createTime`和`updateTime`。

```java
@Test
public void testInsert() {
    TbUser user = new TbUser();
    user.setAge(21);
    user.setMoney(21.00);
    user.setName("小黄");
    user.setEmail("wer@qq.com");
    userMapper.insert(user);
}
```

​	　测试用例执行完成后，即可在`tb_user`表中查看新增数据。

```
3	小黄	21	wer@qq.com	21.00	2021-12-09 15:49:34	2021-12-09 15:49:34
```



## 附录

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.1</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.shooter.quickstart</groupId>
    <artifactId>mybatis-plus-quickstart</artifactId>
    <name>mybatis-plus-quickstart</name>
    <version>0.0.1</version>

    <properties>
        <!-- project config -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
        <!-- dependencies version -->
        <mybatisplus.version>3.4.3.4</mybatisplus.version>
        <mybatisplus-generator.version>3.5.1</mybatisplus-generator.version>
        <freemarker.version>2.3.31</freemarker.version>
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
            <version>${mybatisplus.version}</version>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-generator</artifactId>
            <version>${mybatisplus-generator.version}</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.freemarker</groupId>
            <artifactId>freemarker</artifactId>
            <version>${freemarker.version}</version>
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



### CodeGeneratorTest

```java
package com.shooter.quickstart.mybatisplus.mybatis;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
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
        val javaPath = System.getProperty("user.dir") + "/src/main/java";
        val resourcePath = System.getProperty("user.dir") + "/src/main/resources";

        FastAutoGenerator.create(url,username,password)
                // 全局配置
                .globalConfig((scanner, builder) -> builder.author(scanner.apply("请输入作者名称？"))
                        .fileOverride().outputDir(javaPath).disableOpenDir())
                // 包配置
                .packageConfig(builder -> {
                    builder.parent("com.shooter.quickstart") // 设置父包名
                            .moduleName("mybatisplus") // 设置父包模块名
                            .pathInfo(Collections.singletonMap(OutputFile.mapperXml,
                                    resourcePath+"/mapper")); // 设置mapperXml生成路径
                })
                // 策略配置
                .strategyConfig((scanner, builder) -> builder.addInclude(getTables(scanner.apply("请输入表名，多个英文逗号分隔？所有输入 all")))
                        .controllerBuilder().enableRestStyle().enableHyphenStyle()
                        .entityBuilder().enableLombok().addTableFills(
                                new Column("create_time", FieldFill.INSERT),
                                new Column("update_time", FieldFill.INSERT_UPDATE)
                        ).build())
                // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .templateEngine(new FreemarkerTemplateEngine())
                .execute();
    }

    // 处理 all 情况
    protected static List<String> getTables(String tables) {
        return "all".equals(tables) ? Collections.emptyList() : Arrays.asList(tables.split(","));
    }
}
```

