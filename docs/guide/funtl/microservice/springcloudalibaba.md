---
sidebar: auto
---

# Spring Cloud Alibaba

​	　Spring Cloud Alibaba是微服务一站式开发的**全新生态解决方案**，方便开发者通过 Spring Cloud 编程模型轻松使用**阿里开源组件**来开发分布式应用服务。

**参考资料：**

- [Spring Cloud Alibaba GitHub](https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md)
- [RocketMQ Example](https://github.com/alibaba/spring-cloud-alibaba/blob/master/spring-cloud-alibaba-examples/rocketmq-example/readme-zh.md)
- [Spring Cloud 版本说明](https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E#%E6%AF%95%E4%B8%9A%E7%89%88%E6%9C%AC%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8)



## 简介

​	　Spring Cloud Alibaba为我们提供了**服务限流降级**、**服务注册与发现**、**分布式配置管理**、**消息驱动能力**、**阿里云对象存储**、**分布式任务调度**等功能。


![image-20211206001945069](./images/image-20211206001945069.png)

## 统一的依赖管理

​	　首先，新建统一的依赖管理`springcloud-alibaba-dependencies`。

```xml{9,25,26,30-45}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.6.RELEASE</version>
    </parent>

    <groupId>com.shooter.funtl</groupId>
    <artifactId>springcloud-alibaba-dependencies</artifactId>
    <name>springcloud-alibaba-dependencies</name>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <properties>
        <!-- Environment Settings -->
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>

        <!-- Spring Settings -->
        <spring-cloud.version>Finchley.SR2</spring-cloud.version>
        <spring-cloud-alibaba.version>0.2.2.RELEASE</spring-cloud-alibaba.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <!-- Compiler 插件, 设定 JDK 版本 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <showWarnings>true</showWarnings>
                </configuration>
            </plugin>

            <!-- 打包 jar 文件时，配置 manifest 文件，加入 lib 包的 jar 依赖 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <configuration>
                    <archive>
                        <addMavenDescriptor>false</addMavenDescriptor>
                    </archive>
                </configuration>
                <executions>
                    <execution>
                        <configuration>
                            <archive>
                                <manifest>
                                    <!-- Add directory entries -->
                                    <addDefaultImplementationEntries>true</addDefaultImplementationEntries>
                                    <addDefaultSpecificationEntries>true</addDefaultSpecificationEntries>
                                    <addClasspath>true</addClasspath>
                                </manifest>
                            </archive>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <!-- resource -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
            </plugin>

            <!-- install -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-install-plugin</artifactId>
            </plugin>

            <!-- clean -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-clean-plugin</artifactId>
            </plugin>

            <!-- ant -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-antrun-plugin</artifactId>
            </plugin>

            <!-- dependency -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
            </plugin>
        </plugins>

        <pluginManagement>
            <plugins>
                <!-- Java Document Generate -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-javadoc-plugin</artifactId>
                    <executions>
                        <execution>
                            <phase>prepare-package</phase>
                            <goals>
                                <goal>jar</goal>
                            </goals>
                        </execution>
                    </executions>
                </plugin>

                <!-- YUI Compressor (CSS/JS压缩) -->
                <plugin>
                    <groupId>net.alchim31.maven</groupId>
                    <artifactId>yuicompressor-maven-plugin</artifactId>
                    <version>1.5.1</version>
                    <executions>
                        <execution>
                            <phase>prepare-package</phase>
                            <goals>
                                <goal>compress</goal>
                            </goals>
                        </execution>
                    </executions>
                    <configuration>
                        <encoding>UTF-8</encoding>
                        <jswarn>false</jswarn>
                        <nosuffix>true</nosuffix>
                        <linebreakpos>30000</linebreakpos>
                        <force>true</force>
                        <includes>
                            <include>**/*.js</include>
                            <include>**/*.css</include>
                        </includes>
                        <excludes>
                            <exclude>**/*.min.js</exclude>
                            <exclude>**/*.min.css</exclude>
                        </excludes>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>

        <!-- 资源文件配置 -->
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <excludes>
                    <exclude>**/*.java</exclude>
                </excludes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
            </resource>
        </resources>
    </build>

    <repositories>
        <repository>
            <id>aliyun-repos</id>
            <name>Aliyun Repository</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>

        <repository>
            <id>sonatype-repos</id>
            <name>Sonatype Repository</name>
            <url>https://oss.sonatype.org/content/groups/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
        <repository>
            <id>sonatype-repos-s</id>
            <name>Sonatype Repository</name>
            <url>https://oss.sonatype.org/content/repositories/snapshots</url>
            <releases>
                <enabled>false</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>

        <repository>
            <id>spring-snapshots</id>
            <name>Spring Snapshots</name>
            <url>https://repo.spring.io/snapshot</url>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
        <repository>
            <id>spring-milestones</id>
            <name>Spring Milestones</name>
            <url>https://repo.spring.io/milestone</url>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>

    <pluginRepositories>
        <pluginRepository>
            <id>aliyun-repos</id>
            <name>Aliyun Repository</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </pluginRepository>
    </pluginRepositories>
</project>
```



## 服务注册与发现

​	　Spring Cloud Alibaba 使用 `Nacos` 作为**服务注册与发现**服务器，实现动态服务发现、服务配置、服务元数据及流量管理。

​	　[Nacos](https://nacos.io/zh-cn/)是一个**独立的服务**，不由开发者开发和维护；通过**端点检查**来判断服务是否在线；消费者可以通过**服务名**向Nacos获取`服务提供者的IP`和`端口`；`Nacos`实现了**高可用**，而`Fegin`实现了负载均衡。



（1）使用官网推荐的方式安装

​	　首先，[下载](https://github.com/alibaba/nacos/releases)安装包，下载完成后，上传到部署目录，解压启动即可。

```shell
# 解压
unzip nacos-server-2.0.3.zip
cd nacos/bin 
# 启动服务
sh startup.sh -m standalone
```

（2）从代码开始构建并运行 Nacos

```shell
# 下载源码
git clone https://github.com/alibaba/nacos.git
# 安装到本地仓库
cd nacos/
# 使用 release-nacos 参数安装(-P 多环境配置)
mvn -Prelease-nacos clean install -U
# 进入启动目录
cd distribution/target/nacos-server-0.7.0/nacos/bin
# 启动服务
./startup.sh -m standalone
```

​	　打开 `http://101.43.15.250:8848/nacos`，输入默认账号密码为 `nacos/nacos` 即可访问。

![image-20211203041506093](./images/image-20211203041506093.png)



## 服务提供者

​	　首先，创建一个工程名为 `springcloud-alibaba-provider` 的服务提供者项目。

```xml{35-38}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.shooter.funtl</groupId>
        <artifactId>springcloud-alibaba-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../springcloud-alibaba-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>springcloud-alibaba-provider</artifactId>
    <name>springcloud-alibaba-provider</name>
    <packaging>jar</packaging>

    <dependencies>
        <!-- Spring Boot Begin -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- Spring Boot End -->

        <!-- Spring Cloud Begin -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!-- Spring Cloud End -->
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>
                        com.shooter.funtl.springcloud.alibaba.provider.NacosProviderApplication
                    </mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

​	　通过 `@EnableDiscoveryClient` 注解表明是一个 `Nacos` 客户端，该注解是 `Spring Cloud` 提供的原生注解。

```java{8}
package com.shooter.funtl.springcloud.alibaba.provider;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NacosProviderApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosProviderApplication.class, args);
    }
}
```

​	　在`resources`目录下新建`bootstrap.yaml`，并进行如下配置。

```yaml
spring:
  application:
    name: nacos-provider
  cloud:
    nacos:
      discovery:
        # Nacos Server 启动监听的ip地址和端口
        server-addr: 101.43.15.250:8848

server:
  port: 8081
```

​	　最后，新建`IndexController`控制器。

```java
package com.shooter.funtl.springcloud.alibaba.provider.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {

    @Value("${server.port}")
    private String port;

    @GetMapping(value = "/{message}")
    public String index(@PathVariable String message) {
        return String.format("Service Provider port is : %s from %s", port,message);
    }
}
```

​	　至此，服务提供者已经配置完成。[启动](http://localhost:8001/college/guide/course/funtl/framework/idea.html#jar部署)两个`springcloud-alibaba-provider`实例，再次刷新`Nacos`，即可看见服务已经注册成功了。

![image-20211203044842280](./images/image-20211203044842280.png)

​	　浏览器中访问`8081`和`8082`端口，就可以获取请求结果了。

```shell
- http://localhost:8081/hi  访问服务实例1
- http://localhost:8082/hi  访问服务实例2
# EndPoint 显示subscribe（服务订阅者）和 NacosDiscoveryProperties（基础配置）信息
- http://localhost:8081/actuator/nacos-discovery
```



## 服务消费者

### Consumer

​	　首先，创建一个工程名为 `springcloud-alibaba-consumer ` 的服务提供者项目。服务消费者第一种实现方式，是通过 `LoadBalanceClient` 和 `RestTemplate` 实现的。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.shooter.funtl</groupId>
        <artifactId>springcloud-alibaba-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../springcloud-alibaba-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>springcloud-alibaba-consumer</artifactId>
    <name>springcloud-alibaba-consumer</name>
    <packaging>jar</packaging>

    <dependencies>
        <!-- Spring Boot Begin -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- Spring Boot End -->

        <!-- Spring Cloud Begin -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!-- Spring Cloud End -->
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>
                        com.shooter.funtl.springcloud.alibaba.consumer.NacosConsumerApplication
                    </mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

​	　然后，通过`@EnableDiscoveryClient`注解表明这是一个`Nacos`客户端。

```java{8}
package com.shooter.funtl.springcloud.alibaba.consumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NacosConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosConsumerApplication.class, args);
    }
}
```

​	　然后，在`resources`目录下新建`bootstrap.yaml`，并进行如下配置。

```yaml
spring:
  application:
    name: nacos-consumer
  cloud:
    nacos:
      discovery:
        server-addr: 101.43.15.250:8848

server:
  port: 9091
```

​	　接下来，新建 `NacosConsumerConfiguration`配置类注入 `RestTemplate`。

```java
package com.shooter.funtl.springcloud.alibaba.consumer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class NacosConsumerConfiguration {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

​	　最后，新建`IndexController`控制器。

```java
package com.shooter.funtl.springcloud.alibaba.consumer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class IndexController {

    @Autowired
    private LoadBalancerClient loadBalancerClient;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping(value = "")
    public String echo() {
        //使用 LoadBalanceClient 和 RestTemplate 结合的方式来访问
        ServiceInstance serviceInstance = loadBalancerClient.choose("nacos-provider");
        String url = String.format("http://%s:%s/%s",
                  serviceInstance.getHost(), serviceInstance.getPort(),"Consumer");
        return restTemplate.getForObject(url, String.class);
    }
}
```

​	　至此，服务消费者已经配置完成了，启动项目，在浏览器上多次访问 `http://127.0.0.1:9091/`，请求成功则表示已经成功**实现了负载均衡功能，来访问不同端口的实例**。

```
This Service Provider port is : 8081 from Consumer
This Service Provider port is : 8082 from Consumer
```

​	　另外，也可在Nacos查看到`nacos-consumer`信息，或 访问 [这里](http://localhost:9091/actuator/nacos-discovery)查看服务消费者的**服务端点**信息。

![image-20211203052030092](./images/image-20211203052030092.png)





### Feign

​	　首先，创建一个工程名为 `springcloud-alibaba-feign` 的服务提供者项目。

```xml{39-42}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.shooter.funtl</groupId>
        <artifactId>springcloud-alibaba-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../springcloud-alibaba-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>springcloud-alibaba-feign</artifactId>
    <name>springcloud-alibaba-feign</name>
    <packaging>jar</packaging>

    <dependencies>
        <!-- Spring Boot Begin -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- Spring Boot End -->

        <!-- Spring Cloud Begin -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <!-- Spring Cloud End -->
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>
                        com.shooter.funtl.springcloud.alibaba.feign.NacosConsumerFeignApplication
                    </mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

​	　通过 `@EnableFeignClients` 注解开启 `Feign` 功能

```java{10}
package com.shooter.funtl.springcloud.alibaba.feign;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class NacosConsumerFeignApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosConsumerFeignApplication.class, args);
    }
}
```

​	　在`resources`目录下新建`bootstrap.yaml`，并进行如下配置。

```yaml
spring:
  application:
    name: nacos-consumer-feign
  cloud:
    nacos:
      discovery:
        server-addr: 101.43.15.250:8848

server:
  port: 9092
```

​	　通过 `@FeignClient("服务名")` 注解来指定调用哪个服务。

```java{8}
package com.shooter.funtl.springcloud.alibaba.feign.service;

import com.shooter.funtl.springcloud.alibaba.feign.config.SentinelServiceFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "nacos-provider")
public interface IndexService {

    @GetMapping("/{message}")
    String hi(@PathVariable("message")String message);
}
```

​	　在`IndexController`中测试负载均衡是否生效。

```java
package com.shooter.funtl.springcloud.alibaba.feign.controller;

import com.shooter.funtl.springcloud.alibaba.feign.service.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {

    @Autowired
    private IndexService indexService;

    @GetMapping(value = "")
    public String echo() {
        return indexService.hi("Feign");
    }
}
```

​	　至此，`Feign`已经配置完成了，启动项目，在浏览器上多次访问 `http://127.0.0.1:9092/`，请求成功则表示已经成功**实现了负载均衡功能，来访问不同端口的实例**。

```
This Service Provider port is : 8081 from Feign
This Service Provider port is : 8082 from Feign
```

​	　另外，也可在Nacos查看到`nacos-consumer-feign`信息，或 访问 [这里](http://localhost:9092/actuator/nacos-discovery)查看服务消费者的服务端点信息。

![image-20211203054345373](./images/image-20211203054345373.png)



## 路由网关

​	　Spring Cloud Gateway 是 Spring 官方基于 Spring 5.0等技术开发的网关，不仅提供统一的路由方式，并且基于 `Filter链`的方式提供了网关基本的功能，例如：安全，监控/埋点，和限流等。

​	　客户端向 `Spring Cloud Gateway` 发出请求。然后在 `Gateway Handler Mapping` 中找到与请求相匹配的路由，将其发送到 `Gateway Web Handler`。`Handler` 再通过指定的过滤器链来将请求发送到我们实际的服务执行业务逻辑，然后返回。

​	　Spring Cloud Gateway 不使用 Web 作为服务器，而是 **使用 WebFlux 作为服务器**，Gateway 项目已经依赖了 `starter-webflux`，所以这里 **千万不要依赖 `starter-web`**。另外，由于过滤器等功能依然需要 Servlet 支持，故这里还需要依赖 `javax.servlet:javax.servlet-api`。



### 统一访问接口

​	　首先，创建一个工程名为 `springcloud-gateway ` 的服务提供者项目。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.shooter.funtl</groupId>
        <artifactId>springcloud-alibaba-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../springcloud-alibaba-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>springcloud-gateway</artifactId>
    <name>springcloud-gateway</name>
    <packaging>jar</packaging>

    <dependencies>
        <!-- Spring Boot Begin -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- Spring Boot End -->

        <!-- Spring Cloud Begin -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <!-- Spring Cloud End -->

        <!-- Commons Begin -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
        </dependency>
        <!-- Commons Begin -->
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>
                        com.shooter.funtl.springcloud.gateway.GatewayApplication
                    </mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

​	　新建`GatewayApplication`启动类。

```java
package com.shooter.funtl.springcloud.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

​	　在`resources`目录下新建`bootstrap.yaml`，并进行如下配置。

```yml{11-29}
spring:
  application:
    # 应用名称
    name: spring-gateway
  cloud:
    # 使用 Naoos 作为服务注册发现
    nacos:
      discovery:
        server-addr: 101.43.15.250:8848
    # 路由网关配置
    gateway:
      # 设置与服务注册发现组件结合，这样可以采用服务名的路由策略
      discovery:
        locator:
          enabled: true
      # 配置路由规则
      routes:
        # 采用自定义路由 ID（有固定用法，不同的 id 有不同的功能
        - id: NACOS-CONSUMER
          # 采用LoadBalanceClient方式请求，以 lb:// 开头，后面的是注册在Nacos上的服务名
          uri: lb://nacos-consumer
          # 主要作用是匹配用户的请求，有很多种用法
          predicates:
            - Path=/nacos-consumer/**
            # Method 方法谓词，这里是匹配 GET 和 POST 请求
            - Method=GET,POST
        - id: NACOS-CONSUMER-FEIGN
          uri: lb://nacos-consumer-feign
          predicates:
            - Path=/nacos-consumer-feign/**
            - Method=GET,POST

server:
  port: 9000

# 配置日志级别，方别调试
logging:
  level:
    org.springframework.cloud.gateway: info
```

​	　至此，`Spring Cloud Gateway` 的路由功能已经配置完成，通过`http://路由网关IP:路由网关Port/服务名/方式`即可访问。

```shell
# 转发到consumer服务
- http://localhost:9000/nacos-consumer/ 
# 转发到feign服务
- http://localhost:9000/nacos-consumer-feign/
```



### 服务过滤功能

​	　全局过滤器作用于所有的路由，不需要单独配置，我们可以用它来实现很多统一化处理的业务需求，比如权限认证，IP 访问限制等等。

​	　实现全局过滤器，只需要实现 `GlobalFilter`, `Ordered` 接口，并在类上增加 `@Component` 注解，就可以使用过滤功能了。

```java{20,21,23}
package com.shooter.funtl.springcloud.gateway.filters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import java.util.Map;

/**
 * 鉴权过滤器
 */
@Component
public class AuthFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest().getQueryParams().getFirst("token");

        if (token == null || token.isEmpty()) {
            ServerHttpResponse response = exchange.getResponse();

            // 封装错误信息
            Map<String, Object> responseData = Maps.newHashMap();
            responseData.put("code", HttpStatus.UNAUTHORIZED.value());
            responseData.put("message", "非法请求");
            responseData.put("cause", "Token is empty");

            try {
                // 将信息转换为 JSON
                ObjectMapper objectMapper = new ObjectMapper();
                byte[] data = objectMapper.writeValueAsBytes(responseData);

                // 输出错误信息到页面
                DataBuffer buffer = response.bufferFactory().wrap(data);
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                response.getHeaders().add(
                	"Content-Type", "application/json;charset=UTF-8");
                return response.writeWith(Mono.just(buffer));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        return chain.filter(exchange);
    }

    /**
     * 设置过滤器的执行顺序,数字越小，优先级越高
     */
    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
```

​	　重启`Spring Cloud Gateway` 服务，再次访问`http://localhost:9000/nacos-consumer/`，提示如下：

```json
{"code":401,"cause":"Token is empty","message":"非法请求"}
```

​	　加入`token`后，如，`http://localhost:9000/nacos-consumer/?token=token`，即可正常访问。



## 熔断器

​	　Sentinel是阿里提供的熔断器组件，以**流量**为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。具有**丰富的应用场景** 、**完备的实时监控** 、**广泛的开源生态**、**完善的 SPI 扩展点**等特征。



### 使用熔断器防止服务雪崩

​	　在 `Feign` 中使用 `Sentinel` ，首先需要引入依赖。

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

​	　`Sentinel` 适配了 `Feign` 组件，但默认是关闭的，需要在配置文件中配置打开它。

```yaml
feign:
  sentinel:
    enabled: true
```

​	　然后，创建熔断器类`SentinelServiceFallback.java`，并实现对应的 `Feign` 接口。

```java
package com.shooter.funtl.springcloud.alibaba.feign.config;

import com.shooter.funtl.springcloud.alibaba.feign.service.IndexService;
import org.springframework.stereotype.Component;

@Component
public class SentinelServiceFallback implements IndexService {

    @Override
    public String hi(String message) {
        return "请检查网络,稍后再试!";
    }
}
```

​	　接着，在`Feign` 项目中的 `Service` ，增加 `fallback` 指定类。

```java{7}
package com.shooter.funtl.springcloud.alibaba.feign.service;

import com.shooter.funtl.springcloud.alibaba.feign.config.SentinelServiceFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "nacos-provider", fallback = SentinelServiceFallback.class)
public interface IndexService {

    @GetMapping("/{message}")
    String hi(@PathVariable("message")String message);
}
```

​	　至此，熔断器已经配置完毕，关闭所有的服务提供者，访问`http://localhost:9092/`展示熔断提示。

```
请检查网络,稍后再试!
```



### 仪表盘监控

​	　`Sentinel 控制台`提供一个轻量级的控制台，它提供机器发现、单机资源实时监控、集群资源汇总，以及规则管理的功能。您只需要对应用进行简单的配置，就可以使用这些功能。特别的，集群资源汇总仅支持 `500 台`以下的应用集群，有大概 `1 - 2` 秒的延时。

​	　可以从[这里](https://github.com/alibaba/Sentinel/releases/tag/1.8.2)下载`Jar包` 或者直接拉取代码构建，然后运行 `Sentinel` 即可 。

```shell{8-11}
# 下载源码(建议下载已编译包)
git clone https://github.com/alibaba/Sentinel.git
# 编译打包
mvn clean package
# 进入部署目录
cd sentinel-dashboard\target
# 启动应用
nohup java -Dserver.port=8080 \
     -Dcsp.sentinel.dashboard.server=localhost:8080 \
     -Dproject.name=sentinel-dashboard \
     -jar sentinel-dashboard*.jar > log.file 2>&1 &
```

​	　访问`127.0.0.1:8080`进入页面，输入默认用户名密码`sentinel/sentinel`即可进入。若未能不展示监听自身的`sentinel-dashboard`面板，请检查`启动port`和`监听server端口`是否一致。

![image-20211203161806946](./images/image-20211203161806946.png)

​	　至此，`Sentinel 控制台`已经部署成功了。其中，`QPS`指的是**每秒处理的事务数量**（并发量）。接下来，还需要在`feign`项目中，配置`Http Server 端口`和`Sentinel 控制台`地址。

```yaml
spring:
  cloud:
    # 使用 Sentinel 作为熔断器
    sentinel:
      transport:
        # 在应用对应的机器上启动一个 Http Server 与 Sentinel 控制台 做交互
        port: 8719
        # Sentinel 控制台地址
        dashboard: localhost:8080
```

​	　`Sentinel 控制台`是作为**客户端**，不断向 `Http Server`请求`feign`服务的信息。所以，需要在应用对应的机器上启动一个 `Http Server` 与 `Sentinel 控制台`做交互。如 `Sentinel控制台`添加了 1 个限流规则，会把规则数据 `push` 给这个 `Http Server` 接收，`Http Server` 再将规则注册到 `Sentinel` 中。

​	　关闭所有的服务提供者，访问`http://localhost:9092/`，不断刷新，触发多次熔断。然后，再次刷新`Sentinel`面板 ，即可看到`nacos-consumer-feign`服务已被`Sentinel` 监控。

![image-20211203162337979](./images/image-20211203162337979.png)

​	　注意，`Sentinel 控制台`作为**客户端**，是必须要访问到应用上的 `Http Serve`r才能获取监控信息的。若将`Sentinel 控制台`部署到公网，`Http Server`部署到本地，这种`Sentinel` 是获取不到改用该应用的监控数据的。

​	　至此，`Sentinel`控制台已经部署完成了，但是`Sentinel控制台`的**实时监控数据**，默认仅存储 `5 分钟`以内的数据。



## 分布式服务配置

​	　在分布式系统中，由于服务数量巨多，为了方便**服务配置文件统一管理**，**实时更新**，所以需要分布式配置中心组件。

​	　`Spring Cloud Alibaba Nacos Config` 提供用于存储配置和其他元数据的 `key/value` 存储，为分布式系统中的外部化配置提供服务器端和客户端支持。

### Nacos Config Start

​	　首先，在Nacos中进入`配置关联->配置列表`，然后点击`加号`，新建配置文件，以服务提供者为例。特别的，**Data ID 的默认扩展名为 `.properties` ，若想使用 YAML 配置，此处必须指明是 `.yaml`**。

![image-20211205131711703](./images/image-20211205131711703.png)

​	　点击发布按钮，成功后，即可在`配置列表`中，看到刚才创建的配置项。

![image-20211205131758631](./images/image-20211205131758631.png)

​	　接下来，在 `springcloud-alibaba-provider` 服务提供者项目中增加依赖。

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

​	　创建名为 `bootstrap.properties` 的配置文件并删除之前创建的 `application.yaml` 配置文件。

```properties
# 这里的应用名对应 Nacos Config 中的 Data ID，实际应用名称以配置中心的配置为准
spring.application.name=nacos-provider-config
# 指定查找名为 nacos-provider-config.yaml 的配置文件
spring.cloud.nacos.config.file-extension=yaml
# Nacos Server 的地址
spring.cloud.nacos.config.server-addr=101.43.15.250:8848
```

​	　启动 `springcloud-alibaba-provider`，访问`http://localhost:8081/hi`，若可以正常访问`8081`端口，则表明配置成功。

```
Service Provider port is : 8081 from hi
```



### 配置动态更新

​	　Nacos Config 支持**配置的动态更新**，可以使用 `spring.cloud.nacos.config.refresh.enabled=false` 来关闭动态刷新。

​	　首先，修改服务端配置，增加一个 `user.name` 的属性。

![image-20211205132142802](./images/image-20211205132142802.png)

​	　然后，新增一个请求方法，测试配置更新效果。

```java
// 注入配置文件上下文
@Autowired
private ConfigurableApplicationContext applicationContext;

// 从上下文中读取配置
@GetMapping(value = "/hello")
public String sayHi() {
    return "Hello " + applicationContext.getEnvironment().getProperty("user.name");
}
```

​	　项目启动后，访问`http://localhost:8081/hello`，请求结果如下：

```
Hello suhe
```

​	　接着，在Nacos修改服务端配置中的`user.name`为`shooter`，再次刷新浏览器，请求结果如下：

```
Hello shooter
```



### Nacos Config Profile

​	　 Spring 为我们提供了 `Profile` 功能，可以在启动的时候添加一个虚拟机参数，激活自己环境所要用的 `Profile` 。

```shell{3}
java -jar \
     springcloud-alibaba-nacos-provider-1.0.0-SNAPSHOT.jar \
     --spring.profiles.active=prod
```

​	　 首先，在Nacos中新增一个名为 `nacos-provider-config-prod.yaml` 的配置。

![image-20211205135640184](./images/image-20211205135640184.png)

​	　 然后，在`springcloud-alibaba-provider`项目中新增一个` bootstrap-prod.properties` 的配置文件。

```properties{1}
spring.profiles.active=prod
spring.application.name=nacos-provider-config
spring.cloud.nacos.config.file-extension=yaml
spring.cloud.nacos.config.server-addr=127.0.0.1:8848
```

​	　 接着，在IDEA中设置需要激活的配置。

![image-20211205135824111](./images/image-20211205135824111.png)

​	　 配置完成后，启动项目，访问`http://localhost:8082/hi`，请求结果如下，表明`prod`配置已经生效了。

```
Service Provider port is : 8082 from hi
```



## 服务链路追踪

​	　 Apache SkyWalking 提供了分布式追踪、服务网格遥测分析、度量聚合和可视化一体化解决方案。具有多种监控手段，语言探针和服务网格(Service Mesh)；多语言自动探针；轻量高效，不需要大数据；模块化，UI、存储、集群管理多种机制可选；支持告警；优秀的可视化方案等功能特性。



### SkyWalking Start

​	　编辑`docker-compose.yml`文件，并执行命令`docker-compose up -d`启动项目。

```yaml{34}
version: '3.3'
services:
  elasticsearch:
    image: elasticsearch:7.10.1
    container_name: elasticsearch
    restart: always
    ports:
      - 9200:9200
    environment:
      discovery.type: single-node #单例模式
      ES_JAVA_OPTS: "-Xms1048m -Xmx1048m" #堆内存大小
      TZ: Asia/Shanghai
    # volumes:
       # - ./es7/logs:/usr/share/elasticsearch/logs
       # - ./es7/data:/usr/share/elasticsearch/data
       # - ./es7/config/es.yml:/usr/share/elasticsearch/config/elasticsearch.yml
    ulimits:
      memlock:
        soft: -1
        hard: -1
  
  skywalking-oap:
    image: apache/skywalking-oap-server:8.3.0-es7
    container_name: skywalking-oap
    depends_on:
      - elasticsearch
    links:
      - elasticsearch
    restart: always
    ports:
      - 11800:11800
      - 12800:12800
    environment:
      SW_STORAGE: elasticsearch7  # 指定ES版本
      SW_STORAGE_ES_CLUSTER_NODES: elasticsearch:9200
      TZ: Asia/Shanghai
    #volumes:
      #- ./config/alarm-settings.yml:/skywalking/config/alarm-settings.yml
  
  skywalking-ui:
    image: apache/skywalking-ui:8.3.0
    container_name: skywalking-ui
    depends_on:
      - skywalking-oap
    links:
      - skywalking-oap
    restart: always
    ports:
      - 8080:8080
    environment:
      SW_OAP_ADDRESS: skywalking-oap:12800
      TZ: Asia/Shanghai
```

​	　**稍等一会，等项目全部启动完成后**，执行`curl http://localhost:9200`命令，若输出如下信息，则表明`elasticsearch`启动成功。

```json
{
  "name" : "f19884382a5c",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "Y_GZveGsR_WOoO9d9doHmg",
  "version" : {
    "number" : "7.10.1",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "1c34507e66d7db1211f66f3513706fdf548736aa",
    "build_date" : "2020-12-05T01:00:33.671820Z",
    "build_snapshot" : false,
    "lucene_version" : "8.7.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

​	　访问`http://101.43.15.250:8080/`，即可看到`skywalking-ui`页面了。

![image-20211205145920482](./images/image-20211205145920482.png)



​	　至此，`SkyWalking Server`已经部署完成了。接下来需要通过`java agent` 服务器探针，进行应用接入。

​	　首先，下载[skywalking-apm-es7-8.0.1](https://www.apache.org/dyn/closer.cgi/skywalking/8.0.1/apache-skywalking-apm-es7-8.0.1.tar.gz)并解压，然后，新建`springcloud-external-skywalking`项目，并将 `agent` 整个目录拷贝进来。其他`agent`版本参考[这里](https://skywalking.apache.org/downloads/#SkyWalkingJavaAgent)，但是要注意`agent`版本要小于等于`skywalking-oap`版本。



（1）IDEA启动方式

​	　以 `springcloud-alibaba-provider` 项目为例，修改IDEA中项目的 `VM` 运行参数（去掉注释）。

```shell
# 用于指定探针路径(请换成完整路径)
-javaagent:/path/agent/skywalking-agent.jar
# 用于重写 agent/config/agent.config 配置文件中的服务名
-Dskywalking.agent.service_name=nacos-provider
# 用于重写 agent/config/agent.config 配置文件中的服务地址
-Dskywalking.collector.backend_service=101.43.15.250:11800
```

（2）Java启动方式

```shell
java -javaagent:/path/agent/skywalking-agent.jar \
    -Dskywalking.agent.service_name=nacos-provider \
    -Dskywalking.collector.backend_service=101.43.15.250:11800 \
    -jar app.jar
```

（3）Dockerfile启动

```dockerfile
FROM openjdk:8-jre
WORKDIR /app
COPY project-1.0.0.jar .
ENTRYPOINT ["java",\
      "-javaagent:/path/agent/skywalking-agent.jar",\
      "-Dskywalking.agent.service_name=nacos-provider", \
      "-Dskywalking.collector.backend_service=101.43.15.250:11800", \
      "-jar", "app.jar"]
EXPOSE 8080
```

​	　启动成功后，访问之前写好的接口 `http://localhost:8082/echo/hi` 之后，再刷新 `SkyWalking Web UI`，发现 `Service` 与 `Endpoint` 已经成功检测到了。

![image-20211205160302218](./images/image-20211205160302218.png)



### Maven Assembly

​	　`Assembly` 插件目的是提供一个把工程依赖元素、模块、网站文档等其他文件存放到单个归档文件里，此处以将 SkyWalking 探针打包为 `tar.gz` 为例。

​	　后期持续集成时，可将`agent.tar.gz`推送到`Nexus`中。当构建 Docker 镜像时，`Dockerfile`通过执行`ADD命令`下载解压即可。

​	　首先，在`springcloud-external-skywalking`项目中新建`pom.xml`。

```xml{15-41}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.shooter.funtl</groupId>
    <artifactId>springcloud-external-skywalking</artifactId>
    <name>springcloud-external-skywalking</name>
    <version>1.0.1</version>
    <packaging>jar</packaging>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <executions>
                    <!-- 配置执行器 -->
                    <execution>
                        <id>make-assembly</id>
                        <!-- 绑定到 package 生命周期阶段上 -->
                        <phase>package</phase>
                        <goals>
                            <!-- 只运行一次 -->
                            <goal>single</goal>
                        </goals>
                        <configuration>
                            <finalName>skywalking</finalName>
                            <descriptors>
                                <!-- 配置描述文件路径 -->
                                <descriptor>
                                	src/main/resources/assembly.xml
                                </descriptor>
                            </descriptors>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

​	　接着，创建 `src/main/resources/assembly.xml` 配置文件。

```xml
<assembly>
    <id>6.0.0-Beta</id>
    <formats>
        <!-- 打包的文件格式，支持 zip、tar.gz、tar.bz2、jar、dir、war -->
        <format>tar.gz</format>
    </formats>
    <!-- tar.gz 压缩包下是否生成和项目名相同的根目录，有需要请设置成 true -->
    <includeBaseDirectory>false</includeBaseDirectory>
    <dependencySets>
        <dependencySet>
            <!-- 是否把本项目添加到依赖文件夹下，有需要请设置成 true -->
            <useProjectArtifact>false</useProjectArtifact>
            <outputDirectory>lib</outputDirectory>
            <!-- 将 scope 为 runtime 的依赖包打包 -->
            <scope>runtime</scope>
        </dependencySet>
    </dependencySets>
    <fileSets>
        <fileSet>
            <!-- 设置需要打包的文件路径 -->
            <directory>agent</directory>
            <!-- 打包后的输出路径,默认当前目录 -->
            <outputDirectory></outputDirectory>
        </fileSet>
    </fileSets>
</assembly>
```

​	　最后，在执行Maven打包命令，将`agent`打包到本地仓库，后期在持续集成时，应该打包至Nexus仓库。

```shell
# 进入打包米兰
cd springcloud-external-skywalking
# 执行打包命令
# 在本地仓库目录下创建名为 springcloud-external-skywalking-1.0.1.jar 的压缩包
mvn clean install
```



## 异步通讯

​	　`Apache Alibaba RocketMQ` 是一个消息中间件。消息生产者负责创建消息并发送到 `RocketMQ` 服务器，RocketMQ 服务器会将消息持久化到磁盘，消息消费者从 `RocketMQ` 服务器拉取消息并提交给应用消费。

### RocketMQ Docker

​	　首先，编辑`docker-compose.yml`文件。**注意：启动 RocketMQ Server + Broker + Console 至少需要 2G 内存**。然后，开启`9876`端口（生产者推送到broker）和`10911`端口（rmqconsole和broker交互）防火墙。

```yaml
version: '3.5'
services:
  rmqnamesrv:
    image: foxiswho/rocketmq:server
    container_name: rmqnamesrv
    ports:
      - 9876:9876
    volumes:
      - ./data/logs:/opt/logs
      - ./data/store:/opt/store
    networks:
        rmq:
          aliases:
            - rmqnamesrv

  rmqbroker:
    image: foxiswho/rocketmq:broker
    container_name: rmqbroker
    ports:
      - 10909:10909
      - 10911:10911
    volumes:
      - ./data/logs:/opt/logs
      - ./data/store:/opt/store
      - ./data/brokerconf/broker.conf:/etc/rocketmq/broker.conf
    environment:
        NAMESRV_ADDR: "rmqnamesrv:9876"
        JAVA_OPTS: " -Duser.home=/opt"
        JAVA_OPT_EXT: "-server -Xms128m -Xmx128m -Xmn128m"
    command: mqbroker -c /etc/rocketmq/broker.conf
    depends_on:
      - rmqnamesrv
    networks:
      rmq:
        aliases:
          - rmqbroker

  rmqconsole:
    image: styletang/rocketmq-console-ng
    container_name: rmqconsole
    ports:
      - 8080:8080
    environment:
        JAVA_OPTS: "-Drocketmq.namesrv.addr=rmqnamesrv:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false"
    depends_on:
      - rmqnamesrv
    networks:
      rmq:
        aliases:
          - rmqconsole

networks:
  rmq:
    name: rmq
    driver: bridg
```

​	　然后，在`./data/brokerconf/`新建`broker.conf` 配置文件。

```shell{32}
 # Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.


# 所属集群名字
brokerClusterName=DefaultCluster

# broker 名字，注意此处不同的配置文件填写的不一样，如果在 broker-a.properties 使用: broker-a,
# 在 broker-b.properties 使用: broker-b
brokerName=broker-a

# 0 表示 Master，> 0 表示 Slave
brokerId=0

# nameServer地址，分号分割
# namesrvAddr=rocketmq-nameserver1:9876;rocketmq-nameserver2:9876

# 启动IP,如果 docker 报 com.alibaba.rocketmq.remoting.exception.RemotingConnectException: connect to <192.168.0.120:10909> failed
# 解决方式1 加上一句 producer.setVipChannelEnabled(false);，解决方式2 brokerIP1 设置宿主机IP，不要使用docker 内部IP
brokerIP1=101.43.15.250

# 在发送消息时，自动创建服务器不存在的topic，默认创建的队列数
defaultTopicQueueNums=4

# 是否允许 Broker 自动创建 Topic，建议线下开启，线上关闭 ！！！这里仔细看是 false，false，false
autoCreateTopicEnable=true

# 是否允许 Broker 自动创建订阅组，建议线下开启，线上关闭
autoCreateSubscriptionGroup=true

# Broker 对外服务的监听端口
listenPort=10911

# 删除文件时间点，默认凌晨4点
deleteWhen=04

# 文件保留时间，默认48小时
fileReservedTime=120

# commitLog 每个文件的大小默认1G
mapedFileSizeCommitLog=1073741824

# ConsumeQueue 每个文件默认存 30W 条，根据业务情况调整
mapedFileSizeConsumeQueue=300000

# destroyMapedFileIntervalForcibly=120000
# redeleteHangedFileInterval=120000
# 检测物理文件磁盘空间
diskMaxUsedSpaceRatio=88
# 存储路径
# storePathRootDir=/home/ztztdata/rocketmq-all-4.1.0-incubating/store
# commitLog 存储路径
# storePathCommitLog=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/commitlog
# 消费队列存储
# storePathConsumeQueue=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/consumequeue
# 消息索引存储路径
# storePathIndex=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/index
# checkpoint 文件存储路径
# storeCheckpoint=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/checkpoint
# abort 文件存储路径
# abortFile=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/abort
# 限制的消息大小
maxMessageSize=65536

# flushCommitLogLeastPages=4
# flushConsumeQueueLeastPages=2
# flushCommitLogThoroughInterval=10000
# flushConsumeQueueThoroughInterval=60000

# Broker 的角色
# - ASYNC_MASTER 异步复制Master
# - SYNC_MASTER 同步双写Master
# - SLAVE
brokerRole=ASYNC_MASTER

# 刷盘方式
# - ASYNC_FLUSH 异步刷盘
# - SYNC_FLUSH 同步刷盘
flushDiskType=ASYNC_FLUSH

# 发消息线程池数量
# sendMessageThreadPoolNums=128
# 拉消息线程池数量
# pullMessageThreadPoolNums=128
```

​	　执行`docker-compose up -d` 启动`RocketMQ`，再访问`http://101.43.15.250:8080/#/`。

![image-20211205204959136](./images/image-20211205204959136.png)



### RocketMQ Provider

​	　首先，新建`springcloud-alibaba-rocketmq-provider`项目，然后，添加`spring-cloud-starter-stream-rocketmq`依赖。

​	　`Spring Cloud Stream` 是一个用于构建基于消息的微服务应用框架。它基于 Spring Boot 来创建具有生产级别的单机 Spring 应用，并且使用 `Spring Integration` 与 `Broker` 进行连接。

```xml{35-38}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.shooter.funtl</groupId>
        <artifactId>springcloud-alibaba-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../springcloud-alibaba-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>springcloud-alibaba-rocketmq-provider</artifactId>
    <name>springcloud-alibaba-rocketmq-provider</name>
    <packaging>jar</packaging>

    <dependencies>
        <!-- Spring Boot Begin -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- Spring Boot End -->

        <!-- Spring Cloud Begin -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-stream-rocketmq</artifactId>
        </dependency>
        <!-- Spring Cloud End -->
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>
                        com.shooter.funtl.springcloud.alibaba.rocketmq.provider.RocketMQProviderApplication
                    </mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

​	　然后，新建`RocketMQProviderApplication`启动类。

```java{9}
package com.shooter.funtl.springcloud.alibaba.rocketmq.provider;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Source;

@SpringBootApplication
@EnableBinding({ Source.class })
public class RocketMQProviderApplication {
    public static void main(String[] args) {
        SpringApplication.run(RocketMQProviderApplication.class, args);
    }
}
```

​	　接着，新增`application.properties`配置文件。

```properties{3,5,6}
spring.application.name=rocketmq-provider
# RocketMQ的Broker地址
spring.cloud.stream.rocketmq.binder.name-server=101.43.15.250:9876
# 定义name为output的binding
spring.cloud.stream.bindings.output.destination=test-topic
spring.cloud.stream.bindings.output.content-type=application/json
# 起点端口
server.port=9093
```

​	　然后，编写`ProviderService`用于推送消息。

```java{15}
package com.shooter.funtl.springcloud.alibaba.rocketmq.provider.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class ProviderService {

    @Autowired
    private MessageChannel output;

    public void send(String message) {
        output.send(MessageBuilder.withPayload(message).build());
    }
}
```

​	　最后，表现`IndexController`控制器。

```java
package com.shooter.funtl.springcloud.alibaba.rocketmq.provider.controller;

import com.shooter.funtl.springcloud.alibaba.rocketmq.provider.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController{

    @Autowired
    private ProviderService providerService;

    @GetMapping(value = "/send")
    public void send() {
        providerService.send("Hello RocketMQ");
    }
}
```

​	　至此，消费者已经配置完毕，启动项目，并访问`http://localhost:9093/send`将消息推送到MQ中。

​	　刷新`http://101.43.15.250:8080/#/message`，在 RocketMQ 控制台的 `消息` 列表中选择 `test-topic` 主题，看到刚才发送的消息。

![image-20211205210544982](./images/image-20211205210544982.png)



### RocketMQ Consumer

​	　首先，新建`springcloud-alibaba-rocketmq-consumer`项目。其中`pom.xml`配置和`RocketMQ Provider`一样。然后，新建`RocketMQConsumerApplication`启动类。

```java{9}
package com.shooter.funtl.springcloud.alibaba.rocketmq.consumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Sink;

@SpringBootApplication
@EnableBinding({Sink.class})
public class RocketMQConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(RocketMQConsumerApplication.class, args);
    }
}
```

​	　接着，编写`ConsumerReceive`用于推送消息。

```java{11}
package com.shooter.funtl.springcloud.alibaba.rocketmq.consumer.service;

import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.stereotype.Service;

@Service
public class ConsumerReceive {

    @StreamListener("input")
    public void receiveInput(String message) {
        System.out.println("Receive input: " + message);
    }
}
```

​	　最后，新增`application.properties`配置文件。

```properties
spring.application.name=rocketmq-consumer
# RocketMQ的Broker地址
spring.cloud.stream.rocketmq.binder.name-server=101.43.15.250:9876
spring.cloud.stream.bindings.input.destination=test-topic
spring.cloud.stream.bindings.input.content-type=application/json
spring.cloud.stream.bindings.input.group=test-group
# 起点端口
server.port=9094
```

​	　启动项目，控制台中打印如下信息，表明消费者消费完成。

```
Receive input: Hello RocketMQ
```



### RocketMQ Binding

​	　在实际生产中，我们需要发布和订阅的消息可能不止一种 Topic ，故此时就需要使用自定义 Binding 来帮我们实现多 Topic 的发布和订阅功能。

（1）生产者

​	　自定义 Output 接口，代码如下：

```java
public interface MySource {
    @Output("output1")
    MessageChannel output1();

    @Output("output2")
    MessageChannel output2();
}
```

​	　发布消息的案例代码如下：

```java
@Autowired
private MySource source;

public void send(String msg) throws Exception {
    source.output1().send(MessageBuilder.withPayload(msg).build());
}
```

​	　生产者`application.properties`配置。

```properties
spring.application.name=rocketmq-provider
spring.cloud.stream.rocketmq.binder.namesrv-addr=101.43.15.250:9876
# output1
spring.cloud.stream.bindings.output1.destination=test-topic1
spring.cloud.stream.bindings.output1.content-type=application/json
# output2
spring.cloud.stream.bindings.output2.destination=test-topic2
spring.cloud.stream.bindings.output2.content-type=application/json
```



（2）消费者

​	　自定义 `Input` 接口，代码如下：

```java
public interface MySink {
    @Input("input1")
    SubscribableChannel input1();

    @Input("input2")
    SubscribableChannel input2();

    @Input("input3")
    SubscribableChannel input3();

    @Input("input4")
    SubscribableChannel input4();
}
```

​	　接收消息的案例代码如下：

```java
@StreamListener("input1")
public void receiveInput1(String receiveMsg) {
    System.out.println("input1 receive: " + receiveMsg);
}
```

​	　消费者`application.properties`配置。

```properties
spring.application.name=rocketmq-consumer
spring.cloud.stream.rocketmq.binder.namesrv-addr=101.43.15.250:9876
spring.cloud.stream.rocketmq.bindings.input.consumer.orderly=true
# input1
spring.cloud.stream.bindings.input1.destination=test-topic1
spring.cloud.stream.bindings.input1.content-type=text/plain
spring.cloud.stream.bindings.input1.group=test-group
spring.cloud.stream.bindings.input1.consumer.maxAttempts=1
# input2
spring.cloud.stream.bindings.input2.destination=test-topic1
spring.cloud.stream.bindings.input2.content-type=text/plain
spring.cloud.stream.bindings.input2.group=test-group
spring.cloud.stream.bindings.input2.consumer.maxAttempts=1
# input3
spring.cloud.stream.bindings.input3.destination=test-topic2
spring.cloud.stream.bindings.input3.content-type=text/plain
spring.cloud.stream.bindings.input3.group=test-group
spring.cloud.stream.bindings.input3.consumer.maxAttempts=1
```



（3）Application

​	　配置 `Input` 和 `Output` 的 `Binding` 信息并配合 `@EnableBinding` 注解使其生效。

```java
@SpringBootApplication
@EnableBinding({ MySource.class, MySink.class })
public class RocketMQApplication {
	public static void main(String[] args) {
		SpringApplication.run(RocketMQApplication.class, args);
	}
}
```





## 附录

### SkyWalking Download

​	　首先，[下载](https://skywalking.apache.org/downloads/)官方编译过的服务端版本，如 `v8.3.0` 版。下载完成后解压缩，进入 `apache-skywalking-apm-incubating/config` 目录并修改 `application.yml` 配置文件。

![Lusifer_20190114030006](./images/Lusifer_20190114030006.png)

​	　修改完配置后，进入 `apache-skywalking-apm-incubating\bin` 目录，运行 `startup.bat` 启动服务端，并可以通过浏览器访问 `http://localhost:8080` 访问`SkyWalking`。

​	　然后，还需要通过`Java Agent` 服务器探针，进行应用接入，探针文件在 `apache-skywalking-apm-incubating/agent` 目录下。

### Nacos配置说明

（1）Nacos服务注册地址为内网IP

​	　应用在Nacos注册的地址默认是Docker内局域网IP，可以通过如下方式选择固定Ip注册。

```shell
# 如果选择固定Ip注册可以配置
spring.cloud.nacos.discovery.ip = 10.200.11.11
spring.cloud.nacos.discovery.port = 8080
```

