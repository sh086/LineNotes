---
sidebar: auto
---

# 微服务实战之iToken

​	　iToken 项目是基于 `Spring Boot` + `Spring Cloud Netflix` 的仿照[MyToken](https://mytokencap.com/)练习项目，开发前首先要进行**技术选型**和**服务规划**，并完成系统架构设计。

> **Ref**：[讲义](https://www.funtl.com/zh/guide/Spring-Cloud-iToken.html) | [视频合辑](https://www.bilibili.com/video/av29882762) | <a href="../microservice/springcloudnetflix.html" target="_blank">Spring Cloud Netflix笔记</a>



**开发步骤：**

- 第一步：系统详细设计
- <a href="./itoken-netfilx-init.html" target="_blank">第二步：项目初始化</a>
- <a href="../microservice/gitlabci.html#手动部署" target="_blank">第三步：部署持续集成</a>
- 第四步：正式开发



## 快速开始

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

​	　接着，初始化这六个项目，项目初始化配置参考<a href="./itoken-netfilx-init.html" target="_blank">这里</a>。初始化完成后，依次启动项目，验证本地是否可以正常启动。然后，修改`respo`配置文件中的`localhost`为`项目部署IP`，尝试着使用**手动**的方式，将项目部署到远程服务器上。

​	　至此，手动部署已经成功了，接下来，通过`GitLab CI`的方式，将`itoken`项目**持续集成到远程服务器**上，参考<a href="../microservice/gitlabci.html#手动部署" target="_blank">这里</a>，此处不再赘述。

```
===============         =======================         ===================
|| 初始化项目 ||  ==>  || 手动部署到远程服务器 ||   ==>  || 持续集成与交付 ||
===============         =======================         ===================
```

