---
sidebar: auto
---
# Docker Registry

​	　Registry是**Docker镜像管理平台**。官方的 Docker Hub 是公共镜像管理平台，虽然也能实现私有镜像管理，但是，若不希望将私有镜像放到公网当中，就需要在内网搭建Docker Registry私服，来存储和管理自己的镜像。



**参考资料：**

- <a href="./docker.html#docker仓库" target="_blank">Docker仓库笔记</a>
- [Docker Hub官网](https://hub.docker.com/)



## 快速开始

​	　通过Docker 来可以安装和运行 Registry，安装成功后就可以使用 docker 命令行工具对 registry 做各种操作了。建议也同步安装 `Docker Registry WebUI`。首先，编辑`docker-compose.yml`文件。

```yaml
version: '3.1'
services:
  # 安装Docker Registry
  registry:
    image: registry
    restart: always
    container_name: registry
    ports:
      - 5000:5000
    volumes:
      - /usr/local/docker/registry/data:/var/lib/registry
  
  # 安装Docker Registry WebUI
  # 常用的有docker-registry-frontend和docker-registry-web
  frontend:
    image: konradkleine/docker-registry-frontend:v2
    ports:
      - 8080:80
    volumes:
      - ./certs/frontend.crt:/etc/apache2/server.crt:ro
      - ./certs/frontend.key:/etc/apache2/server.key:ro
    environment:
      - ENV_DOCKER_REGISTRY_HOST=127.0.0.1      # Registry部署IP
      - ENV_DOCKER_REGISTRY_PORT=5000           # Registry部署PORT
```

​	　接着，运行启动命令`docker-compose up -d`启动。Docker Registry私服支持**浏览器访问**和**终端访问**。

```shell
# 浏览器访问Registry
http://101.43.15.250:5000/v2/
# 终端访问Registry
curl http://192.168.75.133:5000/v2/
# 浏览器访问WebUI
http://192.168.75.133:8080
```



## 使用Docker私服

### 配置私服地址

​	　若内网地址作为私有仓库地址（非127.0.0.1本地地址），Docker 是默认不允许以非 `HTTPS` 方式推送镜像，可以通过 Docker 的配置选项来取消这个限制。可以在**配置Docker加速器的文件中**新增配置来取消这个限制。

```json{5-7}
{
  "registry-mirrors": [
    "https://registry.docker-cn.com"
  ],
  "insecure-registries": [
    "192.168.75.133:5000" # 此处为Registry部署IP和port
  ]
}
```

​	　配置完成后，重启Docker。

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

​	　最后，通过`docker info`命令检查客户端配置是否生效。

```shell
Insecure Registries:
 192.168.75.133:5000 # 表明生效
```



### 上传镜像到私服

​	　以 ubuntu 为例，将测试镜像上传到Docker私服。

（1）上传自定义镜像

```shell
# 标记本地镜像并指向目标仓库
# 方式一：在构建的时候标记 (建议) 
docker build -t 192.168.75.133:5000/ubuntu .

# 方式二：通过tag标记已有版本号
# ip:port/ubuntu 默认最新版 <==>  ip:port/ubuntu:latest 
docker tag ubuntu 192.168.75.133:5000/ubuntu

# 上传标记的镜像
docker push 192.168.75.133:5000/ubuntu
```



（2）拉取自定义镜像

```shell
# 查看仓库中的镜像
curl 192.168.75.133:5000/v2/_catalog
# 查看指定镜像
curl 192.168.75.133:5000/v2/ubuntu/tags/list

# 拉取镜像
docker pull 192.168.75.133:5000/ubuntu
```

