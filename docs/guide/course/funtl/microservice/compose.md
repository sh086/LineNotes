---
sidebar: auto
---

# Docker Compose

## 简介

​	　**Dockerfile 模板文件可以很方便的定义一个单独的应用容器**，但是，为了满足**快速的部署分布式应用**的需求，引入了Docker Compose。

​	　Docker Compose通过 `docker-compose.yml` 模板文件（YAML 格式），可以**定义和运行一组相关联的应用容器为一个项目**，实现对 Docker **容器集群**的快速部署。`Compose` 的默认管理对象是项目，通过子命令对项目 (project)中的一组容器(service)进行便捷地**生命周期管理**。

​	　`Compose` 项目由 Python 编写，实现上**调用了 Docker 服务提供的 API 来对容器进行管理**。因此，只要所操作的平台支持 Docker API，就可以在其上利用 `Compose` 来进行编排管理。



**参考资料：**

- [官方 GitHub Release](https://github.com/docker/compose/releases) 



## 快速开始

### 安装Compose

​	　`	　Docker for Mac` 、`Docker for Windows` 自带 `docker-compose` 二进制文件，安装 Docker 之后可以直接使用。在Linux本地环境下安装Compose，建议采用从 [官方 GitHub Release](https://github.com/docker/compose/releases) 处直接下载编译好的二进制文件。

（1）方法一，直接下载编译好的二进制文件，适用于Linux - `x86_64` 架构 本地环境安装。

```shell
# 安装
sudo curl -L https://github.com/docker/compose/releases/download/2.1.1\
	/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 查看compose版本
docker-compose --version

# 卸载
sudo rm /usr/local/bin/docker-compose
```



（2）方法二，通过 Python 的包管理工具 pip 进行安装，适用于Linux - `ARM`架构 本地环境安装。

```shell
# 安装
sudo pip install -U docker-compose # 将 Compose 当作一个 Python 应用来从 pip 源中安装
# 卸载
sudo pip uninstall docker-compose
```



（3） 方法三，bash 补全命令，不破坏系统环境，更适合云计算场景

```shell
curl -L https://raw.githubusercontent.com/docker/compose/1.8.0\
	/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
```



docker rm $(docker ps -aq)

docker rmi $(docker image ls -q)

### Hello World

（1）新建文件夹，在该目录中编写 `app.py` 文件

```python
from flask import Flask
from redis import Redis
import socket

app = Flask(__name__)
redis = Redis(host='redis', port=6379)

@app.route('/')
def hello():
    count = redis.incr('hits')
    return 'Hello World! 该页面已被 {} 访问 {} 次。\n'.format(socket.gethostname(),count)

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=80, debug=True)
```



（2）编写 `Dockerfile` 文件

```dockerfile
FROM python:3.6-alpine
ADD . /app
WORKDIR /app
RUN pip install redis flask
EXPOSE 80
CMD ["python", "app.py"]
```



（3）编写 `docker-compose.yml` 文件

```yaml
version: '3'
services:
  web:
    build: .
    ports:
     - "8080:80"
  redis:
    image: "redis:alpine"
```



（3）运行 compose 项目

```shell
# 后台启动
docker-compose up -d 

# 此时访问本地 8080 端口，每次刷新页面，计数就会加 1
curl 127.0.0.1:8080 
Hello World! 该页面已被 ea1040c0df9b 访问 1 次。
```



## Compose命令

​	　Compose命令**默认命令对象将是项目**，即项目中所有的服务都会受到命令影响；也可以指定命令对象为**项目中的服务或者容器**。特别的，**Compose命令必须在包含模板文件的目录中运行**。

```shell
# 语法格式
docker-compose [-f=<arg>...] [options] [COMMAND] [ARGS...]

# 命令选项说明
-f, --file: FILE 指定使用的 Compose 模板文件，默认为 docker-compose.yml，可以多次指定
-p, --project-name: NAME 指定项目名称，默认将使用所在目录名称作为项目名
--x-networking: 使用 Docker 的可拔插网络后端特性
--x-network-driver: DRIVER 指定网络后端的驱动，默认为 bridge
--verbose: 输出更多调试信息
-v, --version: 打印版本并退出

# 查看具体某个命令的使用格式
docker-compose [COMMAND] --help 
docker-compose help [COMMAND]
```



### 容器命令

（1）UP命令

​	　UP命令，可以自动**构建缺失的镜像**、**重新创建并启动相关服务**，并默认以`目录名称_服务名称`作为容器名称。若镜像已存在，需要**通过`build`命令重新构建镜像**；若服务容器已经存在，UP命令会尝试停止容器，然后重新创建（保留装入的卷），以保证新启动的服务匹配 `docker-compose.yml` 文件的最新内容。

```shell
# 语法格式
docker-compose up [options] [SERVICE...]

# 参数说明
-d : 在后台运行服务容器
--no-color : 不使用颜色来区分不同的服务的控制台输出
--no-deps :  不启动服务所链接的容器
--force-recreate : 强制重新创建容器，不能与 --no-recreate 同时使用
--no-recreate : 如果容器已经存在了，则不重新创建，不能与 --force-recreate 同时使用
--no-build : 不自动构建缺失的服务镜像
--build :  在启动容器前构建服务镜像
-t, --timeout : TIMEOUT 停止容器时候的超时（默认为 10 秒）

# 示例
docker-compose up	 	# 前台运行
docker-compose up -d 	# 后台运行
# 运行的容器不会被停止并重新创建，仅启动处于停止状态的容器
docker-compose up --no-recreate
# 重新创建某一个服务，并后台停止旧服务，不会影响到其所依赖的服务
docker-compose up --no-deps -d <SERVICE_NAME>
# 在启动容器之前先重新构建镜像
docker-compose up --build
# 在运行web前，先重新构建web镜像
docker-compose up --build web
```



（2）查询容器信息命令

```shell
# 列出项目中目前的所有容器
# 语法格式
docker-compose ps [options] [SERVICE...]
# 示例
docker-compose ps 		# 显示所有容器信息
docker-compose ps web 	# 只显示web容器信息
docker-compose ps -q 	# 只显示容器的ID信息

# 查看各个服务容器内运行的进程
# 语法格式
docker-compose top [options] [SERVICE...]
# 示例
docker-compose top 		# 显示所有容器内进程信息
docker-compose top web 	# 只显示web容器内进程信息

# 查看服务容器日志
# 语法格式
docker-compose logs [options] [SERVICE...]
# 示例
docker-compose logs	--no-color 	# 关闭颜色

# 进入指定的容器
# 语法格式
docker-compose exec [options] SERVICE COMMAND [ARGS...]
# 示例
docker-compose exec nginx bash
docker-compose exec web sh
```



（3）暂停、停止、重启、删除容器命令

```shell
# 暂停一个容器
docker-compose pause [SERVICE...]
# 恢复处于暂停状态中的服务
docker-compose unpause [SERVICE...]

# 停止一个正在运行的容器，但不删除它
docker-compose stop
# 启动已经存在，但处于停止状态的服务容器
docker-compose start
# 重启项目中的服务
docker-compose restart

# 停止并移除 up 命令所启动的容
docker-compose down
# 通过发送 SIGKILL 信号来强制停止服务容器
docker-compose kill web

# 删除所有（停止状态的）服务容器
docker-compose rm [options] [SERVICE...]
# 参数说明
-f, --force : 强制直接删除，包括非停止状态的容器。一般尽量不要使用该选项
-v : 删除容器所挂载的数据卷
```



（4）RUN命令

​	　RUN命令，用于在在指定服务上执行一个命令，**给定命令将会覆盖原有的自动运行命令**。

```shell
# 语法格式
docker-compose run [options] [-p PORT...] [-e KEY=VAL...] SERVICE [COMMAND] [ARGS...]

# 启动一个 ubuntu 服务容器，并执行 ping docker.com 命令
docker-compose run web ping docker.com
# 运行结果
Creating dockercompose_web_run ... done
PING docker.com (3.217.79.149): 56 data bytes
```



### 镜像命令

（1）build命令

```shell
# 方案一，使用带有 --build 参数的up命令 （建议）
# 语法格式
docker-compose up --build [SERVICE...]
# 示例
docker-compose up --build 		# 在启动容器之前先重新构建镜像
docker-compose up --build web	# 在运行web前，先重新构建web镜像

# 方案二，采用build命令构建 （不建议）
# 语法格式
docker-compose build [options] [SERVICE...]
# 参数说明
--force-rm 删除构建过程中的临时容器。
--no-cache 构建镜像过程中不使用 cache（这将加长构建过程）
--pull 始终尝试通过 pull 来获取更新版本的镜像
# 示例
docker-compose build # 构建（重新构建）项目中的服务容器
docker-compose build web # 构建（重新构建）web容器
docker-compose build --no-cache web # 不带缓存的构建
```



（2）镜像管理命令

```shell
# 列出 Compose 文件中包含的镜像
docker-compose images

# 拉取服务依赖的镜像
docker-compose pull [options] [SERVICE...]
# 参数说明
--ignore-pull-failures 忽略拉取镜像过程中的错误

# 推送服务依赖的镜像到 Docker 镜像仓库
docker-compose push
```



### 负载均衡命令

​	　`SCALE`命令，用于指定**服务运行的容器个数**。当指定数目多于该服务当前实际运行容器，将新创建并启动容器；反之，将停止容器。

```shell
# 方案一，使用带有 --scale 标志的up命令 （建议）
# 语法格式
docker-compose up --scale [SERVICE=NUM...]
# 示例
docker-compose up --scale web=3 -d

# 方案二：使用scale命令（不推荐,已弃用）
# 语法格式
docker-compose [options] [SERVICE=NUM...] 
# 示例
docker-compose scale web=2 -d
```

​	　另外，因为是水平拓展和负载均衡，所有，**不能将宿主机与容器端口进行绑定**，应该统一交于**负载均衡器（HAProxy）**进行负载均衡。但是要注意，**应用必须以指定`port`启动**，不能以随机端口启动；`haproxy`必须挂载到数据卷上，否则会启动失败。

```yaml{9-16}
version: '3'
services:
  web:
    build: .
    
  redis:
    image: "redis:alpine"
        
  lib: 
    image: dockercloud/haproxy 
    links: 
      - web 
    ports: 
      - 8080:80
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock 
```

​	　运行三次`curl 127.0.0.1:8080`，每次的web都不一样，实现了负载均衡。

```shell
Hello World! 该页面已被 cfbdfd80f041 访问 10 次。
Hello World! 该页面已被 a129b9f9812a 访问 11 次。
Hello World! 该页面已被 3751442cefd4 访问 12 次。
```



## 模板文件

​	　Docker Compose默认的模板文件名称为 `docker-compose.yml`，格式为 YAML 格式。



### 常用指令说明

（1）镜像构建指令

​	　image 指令，用于指定服务的镜像名称或镜像 ID。如果镜像在本地不存在，`Compose` 将会尝试拉取这个镜像。

```yaml
image: ubuntu
image: orchardup/postgresql
image: a4bc65fd
```

​	　build指令（需要 Dockerfile），用于**指定 `Dockerfile` 所在文件夹的路径**以及**构建参数**，路径可以是绝对路径，也可以是相对 `docker-compose.yml` 文件的路径。

```yaml
# 简单配置
webapp:
    build: ./dir # 指定 Dockerfile 所在文件夹的路径

# 完整配置
webapp:
    build:
      context: ./dir # 指定 Dockerfile 所在文件夹的路径
      dockerfile: Dockerfile-alternate # 指令指定 Dockerfile 文件名
      args: # 指定构建镜像时的变量
        buildno: 1
      cache_from: # 指定构建镜像的缓存
        - alpine:latest
        - corp/web_app:3.14
```



（2）端口指令

​	　ports指令，用于**暴露容器端口给宿主机**。 `YAML` 会自动解析 `xx:yy` 这种数字格式为 `60 进制`，若容器端口小于 60 并且没放到引号里，可能会得到错误结果。为避免出现这种问题，建议**数字串都采用引号包括起来的字符串格式**。

```yaml
ports:
 - "3000" 					# 仅仅指定容器的端口（宿主将会随机选择端口）
 - "8000:8000" 				# 宿主端口：容器端口 (HOST:CONTAINER)格式
 - "127.0.0.1:8001:8001"
```

​	　expose指令，**仅暴露内部端口**，不映射到宿主机，只被连接的服务访问。

```yaml
expose:
 - "3000"
 - "8000"
```



（3）volumes指令

​	　volumes指令，用于指定数据卷所挂载路径设置，支持相对路径。

```yaml
volumes:
 - /var/lib/mysql 
 - cache/:/tmp/cache 		  # 设置宿主机路径（HOST:CONTAINER）
 - ~/configs:/etc/configs/:ro # 访问模式（HOST:CONTAINER:ro）
```



（4）环境变量指令

​	　environment指令，用于设置环境变量。只给定名称的变量会自动获取运行 Compose 主机上对应变量的值，可以用来防止泄露不必要的数据。

```yaml
# 对象格式
environment:
  RACK_ENV: development
  SESSION_SECRET:

# 数字格式
environment:
  - RACK_ENV=development
  - SESSION_SECRET
```

​	　env_file指令，用于从文件中获取环境变量，可以为单独的文件路径或列表。

```yaml
env_file: .env

env_file:
  - ./common.env
  - ./apps/web.env
  - /opt/secrets.env
```

​	　环境变量文件，若有变量名称与 `environment` 指令冲突，以`environment`指令为准。

```shell
PROG_ENV=development
```



（5）command指令

​	　command指令，用于覆盖容器启动后默认执行的命令。

```yaml
command: echo "hello world"
```



（6）logging指令

​	　logging指令，用于配置日志选项，目前支持三种日志驱动类型。

```yaml
logging:
  driver: syslog # json-file，syslog，none
  options:
    syslog-address: "tcp://192.168.0.42:123"
    max-size: "200k" # 配置日志驱动的相关参数
    max-file: "10"  # 配置日志驱动的相关参数
```



### 读取变量

​	　Compose 模板文件支持动态**读取主机的系统环境变量**和**当前目录下的 `.env` 文件中的变量**。下面的 Compose 文件将从**运行它的环境中**读取变量 `${MONGO_VERSION}` 的值，并写入执行的指令中。

```yaml
version: "3"
services:

db:
  image: "mongo:${MONGO_VERSION}"
```

​	　设定运行环境一，执行 如下命令， 则会启动一个 `mongo:3.2` 镜像的容器；

```shell
MONGO_VERSION=3.2 docker-compose up
```

​	　设定运行环境二，在当前目录新建 `.env` 文件并写入以下内容，执行 `docker-compose up` 则会启动一个 `mongo:3.6` 镜像的容器。

```shell
MONGO_VERSION=3.6
```



### YAML配置文件语言

​	　YAML 是一种通用的数据串行化格式，专门用来写配置文件的语言，是 JSON 的超集。YAML 基本语法规则有：大小写敏感；使用缩进表示层级关系；**缩进时不允许使用Tab键**，只允许使用空格；缩进的空格数目不重要，只要**相同层级的元素左侧对齐**即可；# 表示注释，从这个字符一直到行尾，都会被解析器忽略。

​	　YAML 支持的数据结构有三种，**对象**是使用冒号结构表示的键值对的集合；数组是一组按次序排列的值，若数据结构的子成员是一个数组，则可以在该项下面缩进一个空格；**纯量**是最基本的、不可再分的值。对象和数组可以结合使用，形成**复合结构**

```yaml
# 对象/映射/哈希/字典
animal: pets

# 数组/序列/列表
- Cat

# 纯量
字符串、布尔值、整数、浮点数、Null、时间、日期

# 复合结构
languages:
 - Ruby
websites:
 YAML: yaml.org 
```

​	　如果变量名称或者值中用到 `true|false，yes|no` 等表达 [布尔](http://yaml.org/type/bool.html) 含义的词汇，最好放到引号里，避免 YAML 自动解析某些内容为对应的布尔语义。这些特定词汇，包括：

```bash
y|Y|yes|Yes|YES|n|N|no|No|NO|true|True|TRUE|false|False|FALSE|on|On|ON|off|Off|OFF
```

​	　 `YAML` 会自动解析 `xx:yy` 这种数字格式为 `60 进制`，若容器端口小于 60 并且没放到引号里，可能会得到错误结果。为避免出现这种问题，建议**数字串都采用引号包括起来的字符串格式**。



## Compose实战

### Tomcat模板

```yml
version: '3.1'
services:
  tomcat:
    restart: always
    image: tomcat
    container_name: tomcat
    ports:
      - 8080:8080
    volumes:
      - /usr/local/docker/tomcat/webapps/ROOT:/usr/local/tomcat/webapps/ROOT
    environment:
      TZ: Asia/Shanghai
```



### MySQL模板

（1）部署MySQL5

```yml
version: '3.1'
services:
  mysql:
    restart: always
    image: mysql:5.7.22
    container_name: mysql
    ports:
      - 3306:3306
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123456
    command:
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
      --max_allowed_packet=128M
      --sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO"
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

​	　特别的，Compose默认的数据卷放在`/var/lib/docker/volumes`目录下。

```shell
# 默认数据卷mysql-data路径
/var/lib/docker/volumes/mysql_mysql-data
```



（2）部署MySQL8

```yml
version: '3.1'
services:
  db:
    image: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 123456
    command:
      --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
      --lower_case_table_names=1
    ports:
      - 3306:3306
    volumes:
      - ./data:/var/lib/mysql
```


