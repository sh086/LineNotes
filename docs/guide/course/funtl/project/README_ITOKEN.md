---
sidebarDepth: 0
---

# Spring Cloud iToken

​	　iToken 项目以**区块链技术**和**自有代币**体系为底层，打造一个为加密货币社区服务的新生态，这个生态将最大化地降低交易成本，提供最有价值的内容资讯和社交体验，并且集成更多更有价值的工具。



> **Ref**：[讲义](https://www.funtl.com/zh/guide/Spring-Cloud-iToken.html) | [视频合辑](https://www.bilibili.com/video/av29882762) 



**参考资料：**

- [Spring Cloud NetFlix iToken 源码](https://gitlab.com/springclouditoken)
- <a href="../microservice/springcloudnetflix.html" target="_blank">Spring Cloud Netflix 笔记</a>
  

## 简介

​	　iToken 项目是基于 `Spring Boot` + `Spring Cloud Netflix` 的仿照[MyToken](https://mytokencap.com/)练习项目，开发前首先要进行[技术选型](#技术选型)和[服务端口规划](#服务端口规划)，并完成系统架构设计。

![img](https://www.funtl.com/assets/Lusifer2018072916110001.png)



## 开发环境搭建

​	　首先，在[GitLab](https://gitlab.com/)创建`springcloud-itoken`**项目组**，然后在项目组中新建私有的`Spring Cloud`项目，并将`springcloud-itoken`项目组中的项目拉取到本地。

```shell
# 需要新建私有的Spring Cloud项目
itoken-dependencies 	统一依赖管理
itoken-config			分布式配置中心
itoken-eureka			服务注册与发现
itoken-admin			分布式系统监控
itoken-zipkin			分布式链路追踪
itoken-zuul	    		分布式路由网关
```

​	　接着，初始化这六个项目，项目初始化配置参考<a href="./itoken-init.html" target="_blank">这里</a>。初始化完成后，依次启动项目，验证本地是否可以正常启动。然后，修改`respo`配置文件中的`localhost`为`项目部署IP`，准备将项目部署到远程服务器上。

​	　接下来，尝试着使用**手动**的方式，将项目部署到远程服务器上参考<a href="./itoken-manual-deploy.html" target="_blank">这里</a>。完成后，还需要通过`GitLab CI`的方式，将`itoken`项目**持续集成到远程服务器**上，参考<a href="./itoken-auto-deploy.html" target="_blank">这里</a>。

```
===============         =======================         ===================
|| 初始化项目 ||  ==>  || 手动部署到远程服务器 ||   ==>  || 持续集成与交付 ||
===============         =======================         ===================
```



## 附录

### 技术选型

（1）部署环境

```shell
# 部署环境
开发工具：Intellij IDEA
JDK：Oracle JDK 1.8.152
数据库：MySQL 5.7.22
部署环境：Docker 20.10.5
```



（2）自动化构建

```shell
# Devops
项目构建：Maven + Nexus
代码管理：Git + GitLab
镜像管理：Docker Registry
持续集成：GitLab
持续交付：Jenkins
容器编排：Kubernetes
```



（3）开发技术栈

```shell
# 开发技术栈
前端框架：Bootstrap + jQuery
前端模板：AdminLTE
页面引擎：Thymeleaf
核心框架：Spring Boot + Spring Cloud
ORM 框架：tk.mybatis 简化 MyBatis 开发
数据库连接池：Alibaba Druid
数据库缓存：Redis Sentinel
消息中间件：RabbitMQ
接口文档引擎：Swagger2 RESTful 风格 API 文档生成
全文检索引擎：ElasticSearch
分布式链路追踪：ZipKin
分布式文件系统：Alibaba FastDFS
分布式服务监控：Spring Boot Admin
分布式协调系统：Spring Cloud Eureka
分布式配置中心：Spring Cloud Config
分布式日志系统：ELK（ElasticSearch + Logstash + Kibana）
反向代理负载均衡：Nginx
```



（4）区块链六层模型

```shell
# 区块链六层模型（挖矿过程）
应用层   DApp（分布式应用程序）, 如：超级账本计划  以太坊（区块链操作系统）
合约层
激励层   通过代币激励(区块链有公有链、联盟链、私有链三种，私有链不需要代币)
共识层   工作量证明(难于计算，但易于验证的过程)
网络层   P2P组网
数据层   分布式去中心化的数据库存储、异地多活
```



### 服务端口规划

```
# Cloud
itoken-eureka	8761	服务注册与发现
itoken-config	8888	分布式配置中心
itoken-zipkin	9411	分布式链路追踪
itoken-zuul	    8769	分布式路由网关
itoken-admin	8084	分布式系统监控

# Service
itoken-service-admin	    8501	管理员服务提供者
itoken-service-redis	    8502	数据缓存服务提供者
itoken-service-sso	        8503	单点登录服务提供者
itoken-service-posts	    8504	文章服务提供者
itoken-service-upload	    8505	文件上传服务提供者
itoken-service-digiccy	    8506	数字货币服务提供者
itoken-service-collection	8507	数据采集服务提供者

# Web
itoken-web-admin	8601	管理员服务消费者
itoken-web-posts	8602	文章服务消费者
itoken-web-backend	8603	后台服务聚合
itoken-web-digiccy	8604	数字货币服务消费者
```
