---
sidebar: auto
---
# Nexus

​	　Nexus是一个强大的Maven**依赖管理平台**，极大地简化了内部仓库的维护和外部仓库的访问。通过Nexus可以完全控制访问和部署在你所维护仓库中的每个Artifact。

## 快速开始

​	　通过Docker 来安装和运行 Nexus，首先，编辑`docker-compose.yml`文件。

```yaml
version: '3.1'
services:
  nexus:
    restart: always
    image: sonatype/nexus3
    container_name: nexus
    ports:
      - 8081:8081
    volumes:
      - /usr/local/docker/nexus/data:/nexus-data
```

​	　接着，运行启动命令`docker compose up -d`，启动时如果出现权限问题可以赋予数据卷目录可读可写的权限。

```shell
chmod 777 /usr/local/docker/nexus/data
```



## Maven仓库

​	　**代理仓库**（Proxy Repository）是指第三方仓库，如：`maven-central`、`nuget.org-proxy`。

```shell
# 版本策略（Version Policy）
Release: 正式版本
Snapshot: 快照版本
Mixed: 混合模式
# 布局策略（Layout Policy）
Strict：严格
Permissive：宽松
```

​	　**宿主仓库**（Hosted Repository）是指存储本地上传的组件和资源的，如：`maven-releases`、`maven-snapshots`、`nuget-hosted`。

```shell
# 部署策略（Deployment Policy）
Allow Redeploy：允许重新部署
Disable Redeploy：禁止重新部署
Read-Only：只读
```

​	　**仓库组**（Repository Group）通常包含了多个代理仓库和宿主仓库，在项目中**只要引入仓库组就可以下载到代理仓库和宿主仓库中的包**，如：`maven-public`、`nuget-group`。



## 使用 Maven 私服

### 配置代理仓库

​	　当下载公共依赖时，若本地仓库没有，则会先在Maven私服中查询，若还是没有，Maven私服会从Maven中央仓库中下载更新，这样在下次再次下载时，可以大大加快依赖的下载速度。

![image-20211119003712111](./images/image-20211119003712111.png)

​	　只需要在`pom.xml`中新增Maven私服的配置即可。特别的，`maven-public`公共仓库是发行仓库和快照仓库的映射，从这里可以下载所有类型的依赖。

```xml
<!--依赖管理-->
<repositories>
    <repository>
        <id>nexus</id>
        <name>Nexus Repository</name>
        <url>http://127.0.0.1:8081/repository/maven-public/</url>
        <snapshots>
            <!--是否启用快照下载依赖-->
            <enabled>true</enabled>
        </snapshots>
        <releases>
            <!--是否启用releases下载依赖-->
            <enabled>true</enabled>
        </releases>
    </repository>
</repositories>

<!--插件管理-->
<pluginRepositories>
    <pluginRepository>
        <id>nexus</id>
        <name>Nexus Plugin Repository</name>
        <url>http://127.0.0.1:8081/repository/maven-public/</url>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
        <releases>
            <enabled>true</enabled>
        </releases>
    </pluginRepository>
</pluginRepositories>
```



### 打包项目到私服

​	　首先，在`apache-maven-3.6.1\conf\settings.xml` 配置文件的`servers` 节点下，添加 Nexus 认证信息。

```xml
<!--用于发布 Release 版本-->
<server>
  <id>nexus-releases</id>
  <username>admin</username>
  <password>admin123</password>
</server>
<!--用于发布 Snapshot  版本-->
<server>
  <id>nexus-snapshots</id>
  <username>admin</username>
  <password>admin123</password>
</server>
```

​	　接着，在 `pom.xml` 中添加如下配置。特别的，ID 名称必须要与 `settings.xml` 中 Servers 配置的 ID 名称保持一致。

​	　若项目版本号中有 `SNAPSHOT` 标识的，则会发布到 `Nexus Snapshots Repository`, 否则发布到 `Nexus Release Repository`，并根据 ID 去匹配授权账号。

```xml
<distributionManagement>  
  <repository>  
    <!-- 使用nexus-releases配置的用户名密码登录（授权）--->
    <id>nexus-releases</id>  
    <name>Nexus Release Repository</name>  
    <url>http://127.0.0.1:8081/repository/maven-releases/</url>  
  </repository>  
  <snapshotRepository>  
     <!-- 使用nexus-snapshots配置的用户名密码登录（授权）--->
    <id>nexus-snapshots</id>  
    <name>Nexus Snapshot Repository</name>  
    <url>http://127.0.0.1:8081/repository/maven-snapshots/</url>  
  </snapshotRepository>  
</distributionManagement> 
```

​	　最后，执行如下命令部署到仓库。

```shell
mvn deploy
```



### 管理第三方依赖

​	　建议在上传第三方 JAR 包时，创建单独的第三方 JAR 包管理仓库`maven-3rd`，便于管理有维护。

```shell
# 如第三方JAR包：aliyun-sdk-oss-2.2.3.jar
mvn deploy:deploy-file 
  -DgroupId=com.google.code.kaptcha
  -DartifactId=kaptcha
  -Dversion=2.3
  -Dpackaging=jar 
  -Dfile=./libs/kaptcha-2.3.jar
  -Durl=http://127.0.0.1:8081/repository/maven-3rd/ 
  -DrepositoryId=nexus-releases # 使用nexus-releases配置的用户名密码登录nexus（授权）
```

