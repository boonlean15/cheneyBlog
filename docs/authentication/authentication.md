# 认证

## 密码的发展历史

1. 最初的明文密码，一开始认为是安全的-因为它作为凭证存储在数据库存储区中，但随着sql注入的增多，容易被攻击者获取
2. 使用单向的hash加密存储，一开始：即使sql注入获取了加密后的密文，但无法在登陆时输入，获得了暂时的安全，随着攻击者采用存储彩虹表的方式，每次获取到hash密文后，从彩虹表中查询，以破解然后在登陆时输入查找到未单向加密的密码 
3. 为应对彩虹表，使用salt盐密码和明文密码一起存储，然后再通过hash加密，验证时通过hash密文和salt及明文一起对比。因为每个 salt 和密码组合的 hash 都是不同的。
4. 在现代，一秒可以进行数十亿次的hash计算，这样hash加密又变得不安全了。
5. 接着又鼓励使用自适应的单向函数工作因子，工作因子可以随着机器的变化而变化。从而解决了4中的安全问题。常用的自适应单向函数：bcrypt, PBKDF2, scrypt, and argon2.
6. spring security或其他框架都无法提升密码验证的效率，因为这个验证是资源密集化的。然后建议使用长期凭证换为短期凭证，短期凭证可以在不造成任何安全损失的情况下快速验证

## 认证



## 授权




## 框架 spring security
SpringSecurity 是一个提供身份验证、授权和防止常见攻击的框架。

### 入门案例
    1. 添加依赖
```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.2</version>
        <relativePath/>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- ... other dependency elements ... -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
    </dependencies>
```
    2. 创建启动类和测试用Controller
 ```java
@SpringBootApplication
public class CheneySecurityApplication {
    public static void main(String[] args) {
        SpringApplication.run(CheneySecurityApplication.class, args);
    }
}
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello(){
        return "hello";
    }
}
 ```


### 登陆校验流程
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/security/image-20211215094003288.png" alt="png">

前端                                        后端
-----1.携带用户名和密码访问登陆接口-->             2.和数据库中的用户名和密码进行校验
                                        -->   3.如果正确，使用用户名/用户ID，生成一个jwt
<-- 4.把jwt响应给前端
---5.登陆后访问其他请求需要在请求头中携带token-->  6.获取请求头中的token进行解析，获取userID
                                             7.根据用户ID获取用户信息，如果有权限则允许访问相关的资源
<------9.响应信息----                            8.访问目标资源，响应给前端

> JWT (全称：Json Web Token)是一个开放标准(RFC 7519)，它定义了一种紧凑的、自包含的方式，用于作为 JSON 对象在各方之间安全地传输信息。该信息可以被验证和信任，因为它是数字签名的。

### spring security大致流程
#### security 原理
SpringSecurity的原理其实就是一个过滤器链，内部包含了提供各种功能的过滤器。这里我们可以看看入门案例中的过滤器。

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/security/image-20211214144425527.png" alt="png">

#### 认证流程详解

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/security/image-20211214151515385.png" alt="png">

请求 --> UsernamePasswordAuthenticationFilter(用户名密码认证校验过滤器) --> ExceptionTranslationFilter(异常AccessDeniedException和AuthenticationException处理过滤器) --> FilterSecurityInterceptor(权限校验过滤器)

- **断点调试查看过滤器链**
  > main方法处添加返回值ConfigurableApplicationContext-> 然后断点，在断点窗口点击Evaluate-> 通过run.getBean(DefaultSecurityFilterChain.class) 回车，查看filters过滤器链

- 采用自己的验证方式，不使用内存校验
  1. 自定义登陆接口 调用ProviderManager的方法进行认证，认证通过生成jwt，把用户信息存到redis
  2. 自定义UserDetailService 实现查询数据库校验用户
  3. 校验： 自定义jwt过滤器， 获取token，解析token获取userId，从redis中获取用户信息，存入SecurityContextHolder



























