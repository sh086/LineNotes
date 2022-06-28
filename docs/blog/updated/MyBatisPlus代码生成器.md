# MyBatis-Plus代码生成器

​	　项目中的`controller`、`service`、`mapper`和 `xml` 以及 固定的业务代码 都可以由`Mybatis-Plus代码生成器`生成。

**参考资料：**

- [自定义freemarker输出模板生成简单接口](https://www.1024sou.com/article/342648.html)
- [MyBatis-Plus代码生成器文档](https://baomidou.com/pages/981406/)



## 引入依赖

​	　在`mybatis-plus`项目中，可以通过MyBatis-Plus代码生成器生成模板代码。首先，在`pom.xml`中引入`mybatis-plus-generator`依赖，注意，`MyBatis Plus`从`3.0.3`之后移除了代码生成器与模板引擎的默认依赖，所以需要手动添加模板引擎的依赖；另外，如果启用了`swagger`，还需要引入`swagger`依赖。

```xml{7-11}
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

<!--freemarker依赖-->
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.31</version>
</dependency>

<!--swagger依赖-->
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
```



## CodeGenerator

```java
// MyBatis-Plus代码生成器的配置结构
//1、配置数据源
FastAutoGenerator.create("url", "username", "password")
    //2、全局配置
    .globalConfig(...)
    //3、包配置
    .packageConfig(...)
    //4、策略配置
    .strategyConfig(...)
    //5、模板引擎配置
    .templateEngine(...)
    //6、执行
    .execute();
```



### DataSource

```java
/**
* 自定义配置 DataSource
*/
public DataSourceConfig.Builder createDataSource(String url,String username,String password) {
    return new DataSourceConfig.Builder(url, username, password)
        // MySqlTypeConvert 数据库类型转换器
        // 支持在数据库类型和生成的Java数据类型之间进行转换
        .typeConvert(new MySqlTypeConvert(){
            // 重写数据类型转换配置 MySqlTypeConvert
            @Override
            public IColumnType processTypeConvert(GlobalConfig config, String fieldType) {
                //  若数据库字段类型是double，则生成 BigDecimal
                if(fieldType.contains("double")){
                    return DbColumnType.BIG_DECIMAL;
                }
                return super.processTypeConvert(config, fieldType);
            }
        });
}
```



### GlobalConfig

```java
 // 2 全局配置
.globalConfig((scanner, builder) ->
    // builder.author("author") // 设置作者
    builder.author(scanner.apply("请输入作者名称？"))
    .enableSwagger() // 开启 swagger 模式
    .fileOverride() // 覆盖已生成文件
    .commentDate("yyyy-MM-dd hh:mm:ss") //注释日期
    // 定义生成的实体类中日期的类型 TIME_PACK=LocalDateTime; ONLY_DATE=Date;
    .dateType(DateType.TIME_PACK)
    .outputDir(javaPath) // 指定输出目录
    .disableOpenDir() // 禁止打开输出目录，默认打开
    .fileOverride() // 覆盖之前的文件
)
```



### PackageConfig

```java
// 3 包配置
.packageConfig(builder -> {
    builder.parent("com.shooter.springboot") // 设置父包名
        .moduleName("module") // 设置模块包名
        .entity("entity")   //pojo 实体类包名
        .service("service") //Service 包名
        .serviceImpl("service.impl") // ServiceImpl 包名
        .mapper("mapper")   //Mapper 包名
        .xml("mapper")  //Mapper XML 包名
        .controller("controller") //Controller 包名
        //.other("common") //自定义文件包名
        // 设置mapperXml生成路径
        .pathInfo(Collections.singletonMap(
            OutputFile.mapperXml,resourcePath+"/mapper"));
})
```



### StrategyConfig

```java
// 4 策略配置
.strategyConfig((scanner, builder) ->
    // builder.addInclude("tc_user","tc_sys") // 设置需要生成的具体表名
    // builder.addInclude(Collections.emptyList()) // 设置需要生成的表名
    // getTables()判断若输入是all,返回Collections.emptyList(),反之返回List<String>
	builder.addInclude(
        getTables(scanner.apply("请输入表名，多个英文逗号分隔？所有输入 all")))
		.addTablePrefix("tc_","tb_") // 设置过滤表前缀
		
         //Mapper 策略配置
		.mapperBuilder()
		.superClass(BaseMapper.class)   //设置父类
		.formatMapperFileName("%sMapper")   //格式化 mapper 文件名称
		.enableMapperAnnotation()       //开启 @Mapper 注解
		.formatXmlFileName("%sXml") //格式化 Xml 文件名称

		//service 策略配置
		.serviceBuilder()
        //格式化 service 接口文件名称，%s进行匹配表名，如 UserService
		.formatServiceFileName("%sService")
        //格式化 service 实现类文件名称，%s进行匹配表名，如 UserServiceImpl
		.formatServiceImplFileName("%sServiceImpl") 

		//实体类 策略配置
		.entityBuilder()
		.enableLombok() //开启 Lombok
		.idType(IdType.AUTO) //设置IdType注解
		.disableSerialVersionUID()  //不实现Serializable接口，不生产SerialVersionUID
		.logicDeleteColumnName("deleted")   //逻辑删除字段名
        //数据库表映射到实体的命名策略：下划线转驼峰命
		.naming(NamingStrategy.underline_to_camel) 
        //数据库表字段映射到实体的命名策略：下划线转驼峰命
		.columnNaming(NamingStrategy.underline_to_camel)
		.addTableFills(
			new Column("create_time", FieldFill.INSERT),
			new Column("modify_time", FieldFill.INSERT_UPDATE),
			new Column("update_time", FieldFill.INSERT_UPDATE)
		 ) //添加表字段填充
		.enableTableFieldAnnotation() // 开启生成实体时生成字段注解

		 // Controller策略配置
		 .controllerBuilder()
		 .enableHyphenStyle()
         //格式化 Controller 类文件名称，%s进行匹配表名，如 UserController
		 .formatFileName("%sController") 
		 .enableRestStyle()  //开启生成 @RestController 控制器
)
```



### TemplateEngine

```java
// 5 使用Freemarker引擎模板，默认的是Velocity引擎模板
.templateEngine(new FreemarkerTemplateEngine())
// .templateEngine(new VelocityTemplateEngine()) //默认
// .templateEngine(new BeetlTemplateEngine())

// 6 执行
.execute();
```



## 自定义模板文件

### entity.java.ftl



## 附录

​	　代码自动生成有`快速生成`和`交互式生成`两种方式。快速生成多用于初始化项目，交互式生成多用于新增表后自动生成模板代码。

### 交互式生成

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
                                .enableSwagger() // 开启 swagger 模式
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
                            .entity("entity")   //pojo 实体类包名
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
                                .logicDeleteColumnName("deleted")   //逻辑删除字段名
                                .naming(NamingStrategy.underline_to_camel)  //数据库表映射到实体的命名策略：下划线转驼峰命
                                .columnNaming(NamingStrategy.underline_to_camel)    //数据库表字段映射到实体的命名策略：下划线转驼峰命
                                .addTableFills(
                                        new Column("create_time", FieldFill.INSERT),
                                        new Column("modify_time", FieldFill.INSERT_UPDATE),
                                        new Column("update_time", FieldFill.INSERT_UPDATE)
                                )   //添加表字段填充，"create_time"字段自动填充为插入时间，"modify_time"字段自动填充为插入修改时间
                                .enableTableFieldAnnotation()       // 开启生成实体时生成字段注解

                                // Controller策略配置
                                .controllerBuilder()
                                .enableHyphenStyle() // 开启驼峰转连字符
                                .formatFileName("%sController") //格式化 Controller 类文件名称，%s进行匹配表名，如 UserController
                                .enableRestStyle()  //开启生成 @RestController 控制器
                )

                // 5 使用Freemarker引擎模板，默认的是Velocity引擎模板
                .templateEngine(new FreemarkerTemplateEngine())
                // .templateEngine(new VelocityTemplateEngine()) //默认
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
                        if ( fieldType.equals( "tinyint" ) ) {
                            return DbColumnType.BOOLEAN;
                        }
                        //将数据库中datetime转换成date
                        if ( fieldType.equals( "data" )) {
                            return DbColumnType.LOCAL_DATE_TIME;
                        }
                        return super.processTypeConvert(config, fieldType);
                    }
                });
    }
}
```

