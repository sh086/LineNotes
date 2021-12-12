---
sidebarDepth: 0
---
# 微服务解决复杂问题

​	　**微服务**的最大进步在于改变了我们的工作方式，敏捷软件开发技术、应用迁移云端、DevOps文化、持续集成与持续部署（CI/CD）和容器应用都使用了微服务来革新应用开发与交付，微服务发展趋势是向**标准化微服务框架**发展。

​	　**云计算服务**可以为微服务、大数据提供运维技术支持，云计算可以分为基础设施即服务（IaaS）、平台即服务（PaaS）、软件即服务（SaaS）、区块链即服务（BaaS）。



> **Ref**：[讲义](https://www.funtl.com/zh/guide/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%A7%A3%E5%86%B3%E5%A4%8D%E6%9D%82%E9%97%AE%E9%A2%98.html) | [视频合辑](https://www.bilibili.com/video/av29384041) | <a href="./introduce.html" target="_blank">微服务简介</a>



<hr>

**指南：**

<table>
    <tr>
        <td rowspan="3" colspan="1" align="center"><b>云计算服务</b></td>    
        <td rowspan="1">Iass</td>
        <td align="center"><a href="./linux.html" target="_blank">Linux</a></td> 
		<td  colspan="2" align="center"><a href="./docker.html" target="_blank">Docker</a></td>
        <td colspan="3" align="center">
            <a href="./compose.html" target="_blank">Docke Compose</a>
        </td>
    </tr>
    <tr>
    	<td>PaaS</td>
        <td align="center"><a href="./gitlab.html" target="_blank">GitLab</a></td>
        <td  colspan="1" align="center">
           <a href="./nexus.html" target="_blank">Nexus</a></td>  
        </td> 
        <td  colspan="1" align="center">
           <a href="./registry.html" target="_blank">Registry</a></td> 
        </td> 
        <td  colspan="2" align="center">
           <a href="./gitlabci.html" target="_blank">GitLab CI</a></td>
        </td>
        <td  colspan="1" align="center">
           <a href="./jenkins.html" target="_blank">Jenkins</a></td>
        </td>
    </tr>
    <tr>
    	<td>SaaS</td>
        <td ><a href="./registry.html" target="_blank">RabbitMQ</a></td> 
        <td colspan="1" align="center">
           <a href="./registry.html" target="_blank">Niginx</a></td>
    	</td>
    	<td colspan="1" align="center">
           <a href="./registry.html" target="_blank">Redis</a></td>
    	</td>
    	<td  colspan="1" align="center">
           <a href="./registry.html" target="_blank">Solr</a>
        </td> 
        <td  colspan="1" align="center">
           <a href="./registry.html" target="_blank">FastDFS</a>
        </td> 
        <td  colspan="1" align="center">
           <a href="./elk.html" target="_blank">ELK</a>
        </td> 
    </tr>
    <tr>
    	<td rowspan="6"  colspan="1" align="center"><b>微服务1.0</b></td>
    	<td rowspan="3">Main</td> 
    	<td rowspan="4" align="center">
    	    <a href="./springboot.html" target="_blank">SpringBoot</a>
    	</td>
    	<td colspan="4" align="center">
    	    <a href="./springcloudnetflix.html" target="_blank">Spring Cloud Netflix</a>
    	</td>
    	<td  rowspan="4" align="center">
    	    <a href="./devops.html">VueJs</a>
    	</td> 
    </tr>
    <tr>
    	<td  colspan="2" align="center">
    	    <a href="./dubbo.html" target="_blank">Apache Dubbo</a>
    	</td> 
    	<td colspan=2 align="center">
    	   <a href="./zookeeper.html" target="_blank">Zookeeper</a>
        </td> 
    </tr>
    <tr>
    	<td colspan="4" align="center">
    	    <a href="./springcloudalibaba.html" target="_blank">Spring Cloud Alibaba</a>
    	</td>
    </tr>
    <tr>
    	<td >Non</td> 
    	<td colspan="4" align="center">
    	    <a href="./springcloudalibabadubbo.html" target="_blank">Spring Cloud Alibaba Dubbo</a>
    	</td>
    </tr>
</table>


**实战：**

- [Spring Cloud iToken项目实战](../project/README_ITOKEN.html)
- [Spring Cloud For MyShop](../project/itoken-netflix.html)

