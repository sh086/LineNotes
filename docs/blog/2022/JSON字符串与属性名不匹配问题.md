# JSON字符串与属性名不匹配问题



## @JsonProperty

​	　首先，引入`pom.xml`依赖。

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>版本号</version>
</dependency>
```

​	　接着，使用`@JsonProperty`注解

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
	@JsonProperty("JsonPropertyName")
	private String name;
}
```

​	　测试用例如下：

```java
//将实体类转换成字符串
val jsonStr = new ObjectMapper().writeValueAsString(user)
//将字符串转换成实体类
val user = new ObjectMapper().readValue(jsonStr, User.class)
```



## @JSONField

​	　首先，引入`pom.xml`依赖。

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>版本号</version
</dependency>
```

​	　接着，使用`@JSONField`注解

```java
import com.alibaba.fastjson.annotation.JSONField;

public class User {
	@JSONField(name="JSONFieldName")
	private String name;
}
```

​	　测试用例如下：

```java
//将实体类转换成字符串
val jsonStr = JSON.toJSONString(user);
//将字符串转换成实体类
val user = JSON.parseObject(str, User.class);
```



## getter和setter

```java
public class User {
    
	private String name;

    // 一定要是public
    public String getJsonPropertyName(){
        return name;
    }

    // 一定要是public
    public void setJsonPropertyName(String jsonPropertyName){
        this.name = jsonPropertyName;
    }
}
```

​	　测试用例如下:

```java
//将实体类转换成字符串
val jsonStr = JSON.toJSONString(user);
//将字符串转换成实体类
val user = JSON.parseObject(str, User.class);
```

