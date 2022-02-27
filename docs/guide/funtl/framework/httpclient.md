---
sidebar: auto
---
# API通讯

## Apache HttpClient

​	　`HttpClient` 用来提供高效的、最新的、功能丰富的支持 HTTP 协议的客户端编程工具包，并且它支持 HTTP 协议最新的版本和建议。

### 引入Jar依赖

```xml
<!-- Apache Http Begin -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.5</version>
</dependency>
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>fluent-hc</artifactId>
    <version>4.5.5</version>
</dependency>
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpmime</artifactId>
    <version>4.5.5</version>
</dependency>
<!-- Apache Http End -->
```



### HttpClientUtils

```java
package com.myshop.commons.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.SneakyThrows;
import lombok.val;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class HttpClientUtils {

    private static CloseableHttpClient httpClient;
    private static final String CONNECTION = "keep-alive";
    private static final String USER_AGENT = "User-Agent";
    private static final String COOKIE = "Cookie";

    public static JSONArray post(String url,Object params,String cookie){
        val headerMap = new HashMap<String,String>();
        headerMap.put(COOKIE,cookie);
        return request(url,"post",headerMap,params, JSONArray.class);
    }

    public static JSONObject get(String url,String cookie){
        val headerMap = new HashMap<String,String>();
        headerMap.put(COOKIE,cookie);
        return request(url,"get",headerMap,null, JSONObject.class);
    }

    @SneakyThrows
    private static <T> T request(String url, String method,Map<String, String> headerMap, Object params,Class<T> responseClazz) {
        CloseableHttpResponse httpResponse = null;
        try {
            httpClient = HttpClients.createDefault();
            if("get".equals(method)){
                // 创建 HttpGet 请求
                HttpGet httpGet = new HttpGet(url);
                if(headerMap != null){
                    // 设置代理（模拟浏览器版本）
                    if(headerMap.containsKey(USER_AGENT)){
                        httpGet.setHeader(USER_AGENT, headerMap.get(USER_AGENT));
                    }
                    // 设置 Cookie
                    if(headerMap.containsKey(COOKIE)){
                        httpGet.setHeader(COOKIE, headerMap.get(COOKIE));
                    }
                }
                // 请求并获得响应结果
                httpResponse = httpClient.execute(httpGet);
            }else if("post".equals(method)){
                // 创建 HttpPost 请求
                HttpPost httpPost = new HttpPost(url);
                if(headerMap != null){
                    // 设置代理（模拟浏览器版本）
                    if(headerMap.containsKey(USER_AGENT)){
                        httpPost.setHeader(USER_AGENT, headerMap.get(USER_AGENT));
                    }
                    // 设置 Cookie
                    if(headerMap.containsKey(COOKIE)){
                        httpPost.setHeader(COOKIE, headerMap.get(COOKIE));
                    }
                }
                // 创建 HttpPost 参数
                val values = new ArrayList<BasicNameValuePair>();
                val maps = BeanUtils.objectToMap(params);
                for (val record : maps.entrySet()) {
                    val value = String.valueOf(record.getValue());
                    if(record.getValue() != null && StringUtils.isNotBlank(value)){
                        values.add(new BasicNameValuePair(record.getKey(), value));
                    }
                }
                // 设置 HttpPost 参数
                httpPost.setEntity(new UrlEncodedFormEntity(values, "UTF-8"));
                httpResponse = httpClient.execute(httpPost);
            }
            if(httpResponse != null){
                HttpEntity httpEntity = httpResponse.getEntity();
                // 输出请求结果
                return JacksonUtils.json2pojo(EntityUtils.toString(httpEntity),responseClazz);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 无论如何必须关闭连接
        finally {
            if (httpResponse != null) {
                try {
                    httpResponse.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            if (httpClient != null) {
                try {
                    httpClient.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }
}
```

### 使用示例

​	　在web项目启动后，获取到登录后请求路径中的`Cookie`，然后，新建测试类测试`API`接口。

```java
@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:spring-context.xml", "classpath:spring-context-druid.xml", "classpath:spring-context-mybatis.xml"})
public class HttpClientTest {

    @Test
    public  void testGet() {
        String url = "http://localhost:8080/content/page?draw=1&start=0&length=10";
        val result = HttpClientUtils.get(url,"JSESSIONID=1AA71FBF49919B7070B6D5DCBC87CD0F");
        val data = JacksonUtils.json2list(result.toJSONString(),"data", Content.class);
        log.info("Get请求结果：{}",data);
    }

    @Test
    public  void testPost() {
        String url = "http://localhost:8080/content/category/treeData";
        val modal = new ContentCategoryModal();
        modal.setParentId(30L);
        val result = HttpClientUtils.post(url,modal,"JSESSIONID=1AA71FBF49919B7070B6D5DCBC87CD0F");
        log.info("Post请求结果：{}",result.toString());
    }

}
```



## Jackson

​	　Jackson 是一个简单基于 Java 应用库，Jackson 可以轻松的将 Java 对象转换成 json 对象和 xml 文档，同样也可以将 json、xml 转换成 Java 对象。

### 引入Jar依赖

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.9.5</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.5</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-annotations</artifactId>
    <version>2.9.5</version>
</dependency>
```



###  Jackson 注解

​	　Jackson 类库包含了很多注解，可以让我们快速建立 Java 类与 JSON 之间的关系。

```
@JsonProperty：修改指定属性的 序列化和反序列化属性名 和 序列化时的顺序
@JsonIgnore：指定属性不会被 Jackson 序列化和反序列化
@JsonPropertyOrder：指定属性序列化时的顺序
@JsonRootName：指定 JSON 根属性的名称
@JsonIgnoreType：类注解，会排除所有指定类型的属性

@JsonIgnoreProperties：类注解
 用法一：在序列化为 JSON 时，会忽略 pro1 和 pro2 两个属性
	@JsonIgnoreProperties({"prop1", "prop2"}) 
 用法二：反序列化为 Java 类时，会忽略所有没有 Getter 和 Setter 的属性
	@JsonIgnoreProperties(ignoreUnknown=true)
```



### POJO类

​	　`POJO`是简单的`Java`对象，即原生对象，可分为如下几类：

```
VO：View Object 视图对象
DTO：Data Transfer Object 数据传输对象
Entity：实体类 数据库对象
domain：领域模型
```



### JacksonUtils

```java
package com.myshop.commons.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.val;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Jackson 工具类
 */

public class JacksonUtils {
    private final static ObjectMapper objectMapper = new ObjectMapper();

    public static ObjectMapper getInstance() {
        return objectMapper;
    }

    /**
     * 转换为 JSON 字符串
     *
     * @param obj
     * @return
     * @throws Exception
     */
    public static String obj2json(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    /**
     * 转换为 JSON 字符串，忽略空值
     *
     * @param obj
     * @return
     * @throws Exception
     */
    public static String obj2jsonIgnoreNull(Object obj) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        return mapper.writeValueAsString(obj);
    }

    /**
     * 转换为 JavaBean
     *
     * @param jsonString
     * @param clazz
     * @return
     * @throws Exception
     */
    public static <T> T json2pojo(String jsonString, Class<T> clazz) throws Exception {
        objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        return objectMapper.readValue(jsonString, clazz);
    }

    /**
     * 字符串转换为 Map<String, Object>
     *
     * @param jsonString
     * @return
     * @throws Exception
     */
    public static <T> Map<String, Object> json2map(String jsonString) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        return mapper.readValue(jsonString, Map.class);
    }

    /**
     * 字符串转换为 Map<String, T>
     */
    public static <T> Map<String, T> json2map(String jsonString, Class<T> clazz) throws Exception {
        Map<String, Map<String, Object>> map = objectMapper.readValue(jsonString, new TypeReference<Map<String, T>>() {
        });
        Map<String, T> result = new HashMap<String, T>();
        for (Map.Entry<String, Map<String, Object>> entry : map.entrySet()) {
            result.put(entry.getKey(), map2pojo(entry.getValue(), clazz));
        }
        return result;
    }

    /**
     * 深度转换 JSON 成 Map
     *
     * @param json
     * @return
     */
    public static Map<String, Object> json2mapDeeply(String json) throws Exception {
        return json2MapRecursion(json, objectMapper);
    }

    /**
     * 把 JSON 解析成 List，如果 List 内部的元素存在 jsonString，继续解析
     *
     * @param json
     * @param mapper 解析工具
     * @return
     * @throws Exception
     */
    private static List<Object> json2ListRecursion(String json, ObjectMapper mapper) throws Exception {
        if (json == null) {
            return null;
        }

        List<Object> list = mapper.readValue(json, List.class);

        for (Object obj : list) {
            if (obj != null && obj instanceof String) {
                String str = (String) obj;
                if (str.startsWith("[")) {
                    obj = json2ListRecursion(str, mapper);
                } else if (obj.toString().startsWith("{")) {
                    obj = json2MapRecursion(str, mapper);
                }
            }
        }

        return list;
    }

    /**
     * 把 JSON 解析成 Map，如果 Map 内部的 Value 存在 jsonString，继续解析
     *
     * @param json
     * @param mapper
     * @return
     * @throws Exception
     */
    private static Map<String, Object> json2MapRecursion(String json, ObjectMapper mapper) throws Exception {
        if (json == null) {
            return null;
        }

        Map<String, Object> map = mapper.readValue(json, Map.class);

        for (Map.Entry<String, Object> entry : map.entrySet()) {
            Object obj = entry.getValue();
            if (obj != null && obj instanceof String) {
                String str = ((String) obj);

                if (str.startsWith("[")) {
                    List<?> list = json2ListRecursion(str, mapper);
                    map.put(entry.getKey(), list);
                } else if (str.startsWith("{")) {
                    Map<String, Object> mapRecursion = json2MapRecursion(str, mapper);
                    map.put(entry.getKey(), mapRecursion);
                }
            }
        }

        return map;
    }

    /**
     * 将 JSON 数组转换为集合
     *
     * @param jsonArrayStr
     * @param clazz
     * @return
     * @throws Exception
     */
    @SneakyThrows
    public static <T> List<T> json2list(String jsonArrayStr, Class<T> clazz)  {
        JavaType javaType = getCollectionType(ArrayList.class, clazz);
        List<T> list = (List<T>) objectMapper.readValue(jsonArrayStr, javaType);
        return list;
    }

    /**
     * 转换为 JavaBean
     */
    @SneakyThrows
    public static <T> List<T> json2list(String jsonString,String pathNode,Class<T> clazz) {
        val objectMapper = getInstance();
        val jsonNode = objectMapper.readTree(jsonString);
        val dataNode = jsonNode.findPath(pathNode);
        if(dataNode != null){
            return json2list(dataNode.toString(),clazz);
        }
        return null;
    }


    /**
     * 获取泛型的 Collection Type
     *
     * @param collectionClass 泛型的Collection
     * @param elementClasses  元素类
     * @return JavaType Java类型
     * @since 1.0
     */
    public static JavaType getCollectionType(Class<?> collectionClass, Class<?>... elementClasses) {
        return objectMapper.getTypeFactory().constructParametricType(collectionClass, elementClasses);
    }

    /**
     * 将 Map 转换为 JavaBean
     *
     * @param map
     * @param clazz
     * @return
     */
    public static <T> T map2pojo(Map map, Class<T> clazz) {
        return objectMapper.convertValue(map, clazz);
    }

    /**
     * 将 Map 转换为 JSON
     *
     * @param map
     * @return
     */
    public static String mapToJson(Map map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    /**
     * 将 JSON 对象转换为 JavaBean
     *
     * @param obj
     * @param clazz
     * @return
     */
    public static <T> T obj2pojo(Object obj, Class<T> clazz) {
        return objectMapper.convertValue(obj, clazz);
    }
}
```



### 使用示例

```java
//获取jsonStr字符串中data节点的数据，并反射到Content.class上
@Test
public  void testJSON() {
    String jsonStr = "{\"data\":[{ \"categoryId\":1,\"categoryName\":\"分类名称\",\"title\":\"标题\"}]}";
    //获取jsonStr字符串中data节点的数据，并反射到Content.class上
    val data = JacksonUtils.json2list(jsonStr,"data", Content.class);
    log.info("JSON：{}",data);
}
```



## RESTful API

### 请求方式

​	　可以通过 GET、 POST、 PUT、 PATCH、 DELETE 等方式对服务端的资源进行操作。

（1）请求方式

```
GET：用于查询资源，但超长（1k）的 GET URL 建议使用 POST 方法来替代
POST：用于创建资源
PUT：用于更新服务端的资源的全部信息
PATCH：用于更新服务端的资源的部分信息
DELETE：用于删除服务端的资源
```

（2）幂等性

​	　HTTP 幂等方法，是指**一次和多次请求某一个资源对于资源本身应该具有同样的结果**。

```
HTTP GET 方法：幂等方法，只是查询数据，可能会每次得到不同的返回内容，但不会对资源本身产生影响，因此满足幂等性
HTTP POST 方法：非幂等方法，因为调用多次，都将产生新的资源
HTTP PUT 方法：幂等方法，采用更新后的实体来更新服务器资源，多次调用，只会产生一次影响，因此满足幂等性
HTTP PATCH 方法：非幂等方法，采用修改资源的指令来更新服务器资源，所以不是幂等的
HTTP DELETE 方法：幂等方法，调用一次和多次对资源产生影响是相同的，所以也满足幂等性
```



### 资源路径

​	　ESTful API 的设计以资源为核心，每一个 URI 代表一种资源。URI 不能包含动词，只能是名词和少量的形容词。命名名词的时候，要使用**小写、数字及下划线**来区分多个单词，且不论资源是单个还是多个，名词要以复数进行命名。另外，当一个资源变化难以使用标准的 RESTful API 来命名，可以考虑使用一些特殊的 actions 命名。

```
【GET】  /v1/users/{user_id} 								//查询单个用户资源
【GET】  /v1/users/                                         //查询全部用户资源
【POST】 /v1/users/{user_id}/roles/{role_id}			 	//添加用户的角色
【PUT】  /v1/users/{user_id}						 		//更新用户
【PUT】  /v1/users/{user_id}/password/actions/modify 		//密码修改，非标准 RESTful API 
```

​	　为了解决这个版本不兼容问题，在设计 RESTful API 的一种实用的做法是使用版本号。一般情况下，我们会在 url 中保留版本号，并同时兼容多个版本。



（1）GET请求

```
【GET】 /v1/users?[&keyword=xxx][&enable=1][&offset=0][&limit=20] 获取用户列表
功能说明：获取用户列表
请求方式：GET
请求参数：（中括号[]必填 尖括号选填<>）
- keyword: 模糊查找的关键字。[选填]
- enable: 启用状态[1-启用 2-禁用]。[选填]
- offset: 获取位置偏移，从 0 开始。[选填]
- limit: 每次获取返回的条数，缺省为 20 条，最大不超过 100。 [选填]
```



（2）POST请求

```
【POST】 /v1/users                             // 创建用户信息
功能说明：创建用户
请求方式：POST
请求内容：
{
    "username": "lusifer",             // 必填, 用户名称, max 10
    "realname": "鲁斯菲尔",             // 必填, 用户名称, max 10
    "password": "123456",              // 必填, 用户密码, max 32
    "email": "topsale@vip.qq.com",     // 选填, 电子邮箱, max 32
    "weixin": "Lusifer",               // 选填，微信账号, max 32
    "sex": 1                           // 必填, 用户性别[1-男 2-女 99-未知]
}
```



### 响应内容

（1）错误代码

```
- 200	请求成功
- 201	创建成功
- 400	错误的请求
- 401	未验证
- 403	授权受限
- 404	无法找到
- 409	资源冲突
- 500	服务器内部错误
- 504	网关错误
```

（2）成功响应

```
如果是列表数据，则返回一个封装的结构体。
HTTP/1.1 200 OK
{
    "count":100,
    "items":[
        {
            "id" : "01234567-89ab-cdef-0123-456789abcdef",
            "name" : "example",
            "created_time": 1496676420000,
            "updated_time": 1496676420000,
            ...
        },
        ...
    ]
}

如果是单条数据，则返回一个对象的 JSON 字符串。
HTTP/1.1 200 OK
{
    "id" : "01234567-89ab-cdef-0123-456789abcdef",
    "name" : "example",
    "created_time": 1496676420000,
    "updated_time": 1496676420000,
    ...
}
```

（3）失败响应

```
HTTP/1.1 403 UC/AUTH_DENIED
Content-Type: application/json
{
    "code": "INVALID_ARGUMENT",
    "message": "{error message}",
    "cause": "{cause message}",
    "request_id": "01234567-89ab-cdef-0123-456789abcdef",
    "host_id": "{server identity}",
    "server_time": "2014-01-01T12:00:00Z"
}
```
