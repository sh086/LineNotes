---
sidebar: auto
---

# Spring Cloud iToken



## 管理员服务



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
itoken-web-backend	8603	后台服务聚合（vuejs）
itoken-web-digiccy	8604	数字货币服务消费者
```
