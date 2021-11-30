---
sidebar: auto
---

# Spring Cloud iToken

​	　iToken 项目以**区块链技术**和**自有代币**体系为底层，打造一个为加密货币社区服务的新生态，这个生态将最大化地降低交易成本，提供最有价值的内容资讯和社交体验，并且集成更多更有价值的工具。



> **Ref**：[讲义](https://www.funtl.com/zh/guide/Spring-Cloud-iToken.html) | [视频合辑](https://www.bilibili.com/video/av29882762) 



**参考资料：**

- [Spring Cloud iToken 源码](https://gitlab.com/springclouditoken)
- <a href="../microservice/springcloudnetflix.html" target="_blank">Spring Cloud Netflix 笔记</a>



## 简介

​	　iToken 项目是基于 `Spring Boot` + `Spring Cloud Netflix` 的仿照[MyToken](https://mytokencap.com/)练习项目，开发前首先要进行[技术选型](#技术选型)和[服务端口规划](#服务端口规划)，并完成系统架构设计。

![img](https://www.funtl.com/assets/Lusifer2018072916110001.png)



## v1.0 开发环境搭建

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

​	　接下来，以`itoken-dependencies`、`itoken-config`和`itoken-eureka`项目为例，尝试着使用**手动**的方式，将项目部署到远程服务器上。完成后，还需要通过`GitLab CI`的方式，将`itoken`项目**持续集成到远程服务器**上，参考<a href="../microservice/cicd.html#gitlab-ci" target="_blank">这里</a>。



### itoken-dependencies

​	　首先，需要将`itoken-dependencies`项目**打包到Nexus私服**，在`pom.xml`中新增如下配置，参考<a href="../microservice/nexus.html#打包项目到私服" target="_blank">这里</a>进行配置。

```xml
<!--打包项目到私服-->
<distributionManagement>
     <repository>
         <id>nexus-releases</id>
         <name>Nexus Release Repository</name>
         <url>http://101.43.15.250:8081/repository/maven-releases/</url>
     </repository>
     <snapshotRepository>
         <id>nexus-snapshots</id>
         <name>Nexus Snapshot Repository</name>
         <url>http://101.43.15.250:8081/repository/maven-snapshots/</url>
     </snapshotRepository>
</distributionManagement>
```

​	　然后，**本地**先执行`cd itoken-dependencies`，再使用`mvn deploy`打包，即可将`itoken-dependencies`项目打包到远程仓库中。

![image-20211129130914741](./images/image-20211129130914741.png)



### itoken-config

​	　首先，在`itoken-config`项目中的`pom.xml`中新增如下配置，用于从`Nexus Repository`下载`itoken-dependencies`等依赖，参考<a href="../microservice/nexus.html#配置代理仓库" target="_blank">这里</a>进行配置，修改完成后将变更提交到Git仓库。特别的，**`itoken`所有的项目都需要这样改动，后面的项目不在赘述**。

```xml
<!--依赖管理-->
<repositories>
    <repository>
        <id>nexus</id>
        <name>Nexus Repository</name>
        <url>http://101.43.15.250:8081/repository/maven-public/</url>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
        <releases>
            <enabled>true</enabled>
        </releases>
    </repository>
</repositories>
```

​	　接下来，在远程服务器上运行如下命令，并将生成的秘钥增加到GitLab中的`用户头像`->`设置`->`SSH 密钥`中即可。

```shell
# 生成密钥
ssh-keygen -t rsa -C "your_email@example.com"
# 查看密钥
cat /root/.ssh/id_rsa.pub
```

​	　然后，参考<a href="../framework/maven.html#linux安装" target="_blank">这里</a>安装`JDK`和`Maven`环境。接着将`itoken-config`项目都`clone`到远程服务器上，并打包、运行`itoken-config`项目。

```shell
# 新建itoken项目目录
mkdir -p /usr/local/docker/itoken
# 进入itoken项目
cd /usr/local/docker/itoken

# 安装Git命令
yum -y install git
# 克隆itoken-config目录
git clone git@gitlab.com:springclouditoken/itoken-config.git

# 打包itoken-config项目
mvn clean package 

# 进入target目录
cd target
# 新建部署目录
mkdir docker
# 移动jar包到部署目录
mv itoken-config-1.0.0-SNAPSHOT.jar docker
# 进入部署目录
cd docker

# 在docker目录下，编写Dockerfile
vi Dockerfile

FROM openjdk:8-jre
WORKDIR /app
COPY itoken-config-1.0.0-SNAPSHOT.jar .
CMD java -jar itoken-config-1.0.0-SNAPSHOT.jar
EXPOSE 8888

# 构建镜像
docker build -t sh086/itoken-config .
```

​	　编写`itoken-config`项目的`docker-compose.yml`文件，再运行`docker-compose up -d`命令启动项目。

```yaml
version: '3.1'
services:
  itoken-config:
    image: sh086/itoken-config
    restart: always
    container_name: itoken_config
    ports:
      - 8888:8888
```

​	　访问`http://101.43.15.250:8888/itoken-admin/dev/main`，若可以获取配置，则表明`itoken-config`项目已经成功部署了。

![image-20211129201115526](./images/image-20211129201115526.png)



### itoken-eureka

​	　由于Eureka采用**集群**部署，所以要先增加`itoken-eureka-dev.yml`配置文件的`defaultZone`节点，完成后提交变更到GitLab。

```yaml{14}
server:
  port: 8761

eureka:
  instance:
    hostname: host
  client:
    # 表示是否将自己注册到Eureka，因为要构建集群环境，需要将自己注册到集群，所以应该开启
    registerWithEureka: true
    # 表示是否从Eureka获取注册信息，如果是单一节点，不需要同步其他Eureka节点，则可以设置为false
    # 但如是Eureka集群，则应该设置为 true
    fetchRegistry: true
    serviceUrl:
      defaultZone: http://${eureka.instance.hostname}:8761/eureka/,http://${eureka.instance.hostname}:8762/eureka/
```

​	　然后，先在`itoken-eureka`项目的`pom.xml`新增`Nexus Repository`配置并提交Git，再根据如下步骤完成`eureka`镜像定制。

```shell
# 进入itoken目录
cd /usr/local/docker/itoken
# 拉取代码
git clone git@gitlab.com:springclouditoken/itoken-eureka.git
# 进入itoken-eureka项目
cd itoken-eureka
# 打包
mvn clean package

# 进入打包目录
cd target
# 新建部署目录
mkdir docker
# 移动jar包到部署目录
mv itoken-eureka-1.0.0-SNAPSHOT.jar docker
# 进入部署目录
cd docker

# 在docker目录下，编写Dockerfile
vi Dockerfile

FROM openjdk:8-jre
WORKDIR /app
COPY itoken-eureka-1.0.0-SNAPSHOT.jar .
CMD java -jar itoken-eureka-1.0.0-SNAPSHOT.jar
EXPOSE 8761

# 构建镜像
docker build -t sh086/itoken-eureka .
```

​	　接下来，编写`itoken-eureka`项目的`docker-compose.yml`文件。

```yaml
version: '3.1'
services:
  itoken-eureka-1:
    image: sh086/itoken-eureka
    restart: always
    container_name: itoken-eureka-1
    ports:
      - 8761:8761  
      
  itoken-eureka-2:
    image: sh086/itoken-eureka
    restart: always
    container_name: itoken-eureka-2
    ports:
      - 8762:8761
```

​	　最后，启动`itoken-eureka`项目，启动成功后，访问`8761`端口或者`8762`端口，都可正常访问Eureka。特别的，由于Eureka是集群模式，故端口展示的都是`8761`。

![image-20211130002107774](./images/image-20211130002107774.png)



## v2.1 管理员服务

### itoken-common-service

### itoken-service-admin

测试包在这里

### TDD测试驱动

### itoken-web-admin

### Nginx架设CDN

cnd内容分发网络



## v2.2 数据缓存服务



## v2.3 单点登录服务



## v2.4 代码重构



## v3.1 文章服务



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

