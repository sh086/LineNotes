---
sidebar: auto
---
# Spring事务管理

**参考资料：**

- [脏读、不可重复读和幻读](https://blog.csdn.net/qq_35433593/article/details/86094028)
- [不可重复读和幻读的区别](https://www.cnblogs.com/itcomputer/articles/5133254.html)



​	　事务原本是数据库中的概念，但为了能够使用事务的特性来管理具体的业务，需要将事务提升到业务层。在 Spring 中通常可以通过以下三种方式来实现对事务的管理：

```
- 使用 Spring 的事务代理工厂管理事务（已过时）
- 使用 Spring 的事务注解管理事务
- 使用 AspectJ 的 AOP 配置管理事务
```

​	　注意，对于已经交于Spring事务管理的方法，发生异常时，不能自己再`try catch`了，应该同一交于Spring事务处理，否则事务会失效。



## Spring事务简介

​	　Spring 的事务管理API主要分为**事务管理器接口**（ `PlatformTransactionManager` ）用于完成事务的提交、回滚，及获取事务的状态信息；以及**事务定义接口** （`TransactionDefinition` ）用于定义**事务隔离级别**、**事务传播行为**、**事务默认超时时限**，及对它们的操作。Spring事务默认回滚方式是**发生运行时异常回滚**。



### 事务隔离级别

​	　并发读写时，**多个事务**操作**同一个**数据项或者数据列表时，可能会出现如下现象：

```
脏读：一个事务读取了另外一个事务未提交的数据
不可重复读：一个事务读取了其他事务已提交的（更新、删除）某一数据项，导致前后两次查询数据不一致（读异常，锁行解决）
幻读：一个事务读取了其他事务已提交的（新增、删除）结果集，导致读到之前没有出现过的数据（写异常，锁表解决）
```

​	　为了解决上面可能出现的问题，Spring提供了四种事务的隔离级别，**隔离程度越强，事务的执行效率越低**。Spring事务默认采用`DB`的事务隔离级别，MySql 默认为 `REPEATABLE_READ`；Oracle和 Sql Server默认为：`READ_COMMITTED`；

（1）`READ_UNCOMMITTED`（读未提交）

​	　未解决任何并发问题。最低的事务隔离级别，一个事务还没提交时，它做的变更就能被别的事务看到。

（2）`READ_COMMITTED`（读已提交）

​	　解决脏读的发生，但是可能会出现不可重复读与幻读。一个事物**提交后**，数据变更才能被另外一个事务读取。

（3）`REPEATABLE_READ`（可重复读）

​	　解决脏读、不可重复读的发生，但是可能会出现幻读。多次读取同一范围的数据会返回第一次查询的快照，即使其他事务对该数据做了更新修改，事务在执行期间看到的数据前后必须是一致的。但如果这个事务在读取某个范围内的记录时，其他事务又在该范围内插入了新的记录，当之前的事务再次读取该范围的记录时，会产生幻行，即读到之前没有出现过的数据(新增或删除），这就是幻读。

（4）`SERIALIZABLE`（串行化）

​	　不存在并发问题。`写`会加`写锁`，`读`会加`读锁`，当出现读写锁冲突的时候，后访问的事务必须等前一个事务执行完成，才能继续执行，事务 `100%` 隔离，可避免脏读、不可重复读、幻读的发生。但是，执行效率十分低下。



### 事务传播行为

​	　将**不同事务中的方法在相互调用时**，执行期间事务的维护情况，称为事务传播行为。事务传播行为是加在方法上的，具体分为如下七种，Spring 默认的事务传播行为`REQUIRED`。

```
- REQUIRED：指定的方法必须在事务内执行。若当前存在事务，就加入到当前事务中；若当前没有事务，则创建一个新事务。
- SUPPORTS：指定的方法支持当前事务，但若当前没有事务，也可以以非事务方式执行。
- MANDATORY：指定的方法必须在当前事务内执行，若当前没有事务，则直接抛出异常。
- REQUIRES_NEW：总是新建一个事务，若当前存在事务，就将当前事务挂起，直到新事务执行完毕。
- NOT_SUPPORTED：指定的方法不能在事务环境中执行，若当前存在事务，就将当前事务挂起。
- NEVER：指定的方法不能在事务环境下执行，若当前存在事务，就直接抛出异常。
- NESTED：指定的方法必须在事务内执行。若当前存在事务，则在嵌套事务内执行；若当前没有事务，则创建一个新事务。
```



## AOP配置管理事务

​	　`AspectJ` 主要是使用 `XML` 配置顾问方式自动为每个符合`切入点`表达式的类生成事务代理。

### 引入Jar包

​	　首先，需要在`pom`中引入依赖。

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
    <version>4.3.17.RELEASE</version>
</dependency>
```



### spring-context.xml

​	　接着，在`spring-context.xml`中配置事务管理器。

```xml
 <!-- 配置事务管理器 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>

<!-- 配置事务通知 -->
<tx:advice id="myAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="save*" propagation="REQUIRED"/>
        <tx:method name="insert*" propagation="REQUIRED"/>
    </tx:attributes>
</tx:advice>

<!-- 配置顾问和切入点 -->
<aop:config>
    <!-- 设置切入点是com.shooter.funtl.module.service.*下的所有以save、insert开头的方法 -->
    <aop:pointcut id="myPointcut" expression="execution(* com.shooter.funtl.module.service.*.*(..))" />
    <aop:advisor advice-ref="myAdvice" pointcut-ref="myPointcut" />
</aop:config>
```





### 测试运行

​	　首先，在`com.shooter.funtl.module.service.impl`目录下新建以**insert或者save开头**的测试方法。特别的，抽象服务类`TransactionService`必须存在，若直接在测试类实例化`TransactionServiceImpl`，会测试失败。

```java
package com.shooter.funtl.module.service;
public interface TransactionService {
     void saveTransaction ();
}
```

​	　然后，在`com.shooter.funtl.module.service.impl`目录下实现这个方法。

```java
package com.shooter.funtl.module.service.impl;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private ContentCategoryDao contentCategoryDao;
    @Autowired
    private ContentDao contentDao;

    @Override
    public void saveTransaction () {
        ContentCategory category = new ContentCategory();
        category.setId(1L);
        category.setName("测试事务分类");

        Content content = new Content();
        content.setCategoryId(category.getId());
        content.setTitle("测试事务内容");

        contentCategoryDao.insert(category);
        contentDao.insert(content);
    }
}
```

​	　最后，编写测试类。 首先，在`tb_content`表中设置`title`字段长度为`200`，可正常插入；然后，设置`title`字段长度为`4`，可触发事务回滚，实现`tb_content`插入出错，`tb_content_category`也不能提交。

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:spring-context.xml", "classpath:spring-context-druid.xml", "classpath:spring-context-mybatis.xml"})
public class SpringContextTest {

    @Autowired
    private TransactionService transactionService;

    @Test
    public void testSpringTransaction () {
        transactionService.saveTransaction();
    }
}
```



## Spring注解管理事务

### spring-context.xml

​	　首先，在`spring-context.xml`中开启事务注解驱动。

```xml
<!-- 配置事务管理器 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>

<!-- 开启事务注解驱动 -->
<tx:annotation-driven transaction-manager="transactionManager" />
```



### @Transactional

​	　若 `@Transaction` 注解在类上，则表示该类上所有的方法均将在执行时织入事务；若`@Transactional` 注解在方法上，则只能用于 `public` 方法上， Spring 会忽略掉所有非 `public` 方法上的 `@Transaction` 注解。`@Transactional` 的所有可选属性如下。

```
- propagation：用于设置事务传播属性。该属性类型为 Propagation 枚举，默认值为 `Propagation.REQUIRED`。
- isolation：用于设置事务的隔离级别。该属性类型为 Isolation 枚举 ，默认值为 `Isolation.DEFAULT`。
- readOnly：用于设置该方法对数据库的操作是否是只读的。该属性为 boolean，默认值为 `false`。
- timeout：用于设置本操作与数据库连接的超时时限。单位为秒，类型为 int，默认值为 -1，即没有时限。
- rollbackFor：指定需要回滚的异常类。类型为 `Class[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
- rollbackForClassName：指定需要回滚的异常类类名。类型为 `String[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
- noRollbackFor：指定不需要回滚的异常类。类型为 `Class[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
- noRollbackForClassName： 指定不需要回滚的异常类类名。类型为 `String[]`，默认值为空数组。当然，若只有一个异常类时，可以不使用数组。
```



### 测试运行

​	　使用 `@Transaction` 注解到需要开启事务的类或者方法上即可。

```java{2}
@Override
@Transactional
public void saveTransaction () {
    ContentCategory category = new ContentCategory();
    category.setId(1L);
    category.setName("测试事务分类");

    Content content = new Content();
    content.setCategoryId(category.getId());
    // 首先，设置title字段长度为200，可正常插入
    // 然后，设置title字段长度为4触发事务回滚
    content.setTitle("测试事务内容");

    contentCategoryDao.insert(category);
    contentDao.insert(content);
}
```

