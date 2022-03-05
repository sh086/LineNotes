# SpringBoot注解

## @Builder

​	　可以通过`@Builder`注解，使用构建者模式简化配置代码，优点是简洁，缺点是扩展性很差。

**参考资料：**

- [详解@Builder用法](https://blog.csdn.net/u012846445/article/details/109715515)



### @Builder注解

​	　若`CodeGenerator`配置类，有很多属性需要进行配置，建议采用**构建者模式简化配置代码**。

```java{7}
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class User {

    private String name;

    @Singular
    private List<String> p;

}
```



### 源码分析

​	　首先，创建一个名为 `CodeGeneratorBuilder`的内部静态类，包含目标类中的**所有的属性**和未初始化的 final 字段、一个无参的**默认构造函数**、可以根据设置的值进行创建实体对象的`build()方法` 以及 方法名与该参数名相同的  `setter 方法`并且返回值是构建器本身（便于链式调用）。

```java{14-39}
public class CodeGenerator {
    private String datasource;
    private String packageConfig;
    private String strategyConfig;

    public void execute() {
        System.out.println(this.datasource + "." + this.packageConfig + "." + this.strategyConfig);
    }

    public static CodeGenerator.CodeGeneratorBuilder builder() {
        return new CodeGenerator.CodeGeneratorBuilder();
    }

    public static class CodeGeneratorBuilder {
        private String datasource;
        private String packageConfig;
        private String strategyConfig;

        CodeGeneratorBuilder() {
        }

        public CodeGenerator.CodeGeneratorBuilder datasource(final String datasource) {
            this.datasource = datasource;
            return this;
        }

        public CodeGenerator.CodeGeneratorBuilder packageConfig(final String packageConfig) {
            this.packageConfig = packageConfig;
            return this;
        }

        public CodeGenerator.CodeGeneratorBuilder strategyConfig(final String strategyConfig) {
            this.strategyConfig = strategyConfig;
            return this;
        }

        public CodeGenerator build() {
            return new CodeGenerator(this.datasource, this.packageConfig, this.strategyConfig);
        }
    }
}
```



### 测试用例

```java{6,7}
@SpringBootTest
public class CodeGeneratorTest {
    @Test
    public void testBuilder(){
        // 实例化CodeGenerator对象并执行execute方法
        CodeGenerator.builder().datasource("mysql").packageConfig("com.shooter")
                .strategyConfig("驼峰命名").build().execute();
    }
}
```

输出结果：

```shell
mysql.com.shooter.驼峰命名
```

