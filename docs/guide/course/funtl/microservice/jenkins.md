---
sidebar: auto
---

# Jenkins

​	　Jenkins 是一个开源软件项目，是基于 Java 开发的一种持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能。



**参考资料：**

- [Jenkisn官网](https://www.jenkins.io/)
- [Jenkins插件](https://plugins.jenkins.io/)



## 快速开始

### Jenkins Dokcer

​	　首先，编写`docker-compose.yml` 配置文件。

```yaml
version: '3.1'
services:
  jenkins:
    restart: always
    image: jenkinsci/jenkins
    container_name: jenkins
    ports:
      # 发布端口
      - 8080:8080
      # 基于 JNLP 的 Jenkins 代理通过 TCP 端口 50000 与 Jenkins master 进行通信
      - 50000:50000
    environment:
      TZ: Asia/Shanghai
    volumes:
      - ./data:/var/jenkins_home
```

​	　若安装过程中会出现 `Docker 数据卷` 权限问题，用以下命令解决：

```text
chown -R 1000 /usr/local/docker/jenkins/data
```

​	　Jenkins 第一次启动时需要输入一个初始密码用以解锁安装流程，使用 `docker logs jenkins` 即可方便的查看到初始密码。



### 配置Jenkins

（1）配置 JDK & Maven

​	　首先，将上传 JDK 和 Maven 的 tar 包到服务器（容器数据卷目录），并解压到Jenkins数据卷目录下。

```
./data/jdk1.8.0_152
./data/apache-maven-3.5.3
```

​	　然后，进入`Manage Jenkins` -> `Global Tool Configuration`，配置`JAVA_HOM`路径，然后，点击保存。

![Lusifer_20181029023809](./images/Lusifer_20181029023809.png)

​	　接着，配置 `MAVEN_HOME`路径，然后，点击保存。

![Lusifer_20181029024653](./images/Lusifer_20181029024653.png)



（2）配置本地化（显示中文）

​	　首先，安装 `Locale` 插件，安装成功后，在`Manage Jenkins` -> `Configure System` -> `Locale`选择中文即可。

![Lusifer_20181029033127](./images/Lusifer_20181029033127.png)



（3）安装插件

```shell
# 安装动态参数插件，支持按版本构建
Extended Choice Parameter
# 持续部署必备插件
Publish over SSH
```



## 持续交付实战





## 附录
