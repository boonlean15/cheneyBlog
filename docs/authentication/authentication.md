# 认证

## 密码的发展历史

1. 最初的明文密码，一开始认为是安全的-因为它作为凭证存储在数据库存储区中，但随着sql注入的增多，容易被攻击者获取
2. 使用单向的hash加密存储，一开始：即使sql注入获取了加密后的密文，但无法在登陆时输入，获得了暂时的安全，随着攻击者采用存储彩虹表的方式，每次获取到hash密文后，从彩虹表中查询，以破解然后在登陆时输入查找到未单向加密的密码 
3. 为应对彩虹表，使用salt盐密码和明文密码一起存储，然后再通过hash加密，验证时通过hash密文和salt及明文一起对比。因为每个 salt 和密码组合的 hash 都是不同的。
4. 在现代，一秒可以进行数十亿次的hash计算，这样hash加密又变得不安全了。
5. 接着又鼓励使用自适应的单向函数工作因子，工作因子可以随着机器的变化而变化。从而解决了4中的安全问题。常用的自适应单向函数：bcrypt, PBKDF2, scrypt, and argon2.
6. spring security或其他框架都无法提升密码验证的效率，因为这个验证是资源密集化的。然后建议使用长期凭证换为短期凭证，短期凭证可以在不造成任何安全损失的情况下快速验证

## TLS、SSL、CA 证书、公钥、私钥
## HTTP 的问题
HTTP 协议是超文本传输协、HTTP 协议有一个缺陷那就是它是通过明文传输数据的，用户通过 HTTP 协议传输的内容很容易被恶意拦截，并且黑客可以伪装成服务端，向用户传送错误的信息，并且能轻易获取用户的隐私信息，而这些操作用户是完全无感知的。

## HTTPS
HTTPS 超文本传输安全协议、通过计算机网络进行安全通讯的传输协议。HTTPS 本质上还是由 HTTP 进行通信，只是在 HTTP 协议和 TCP 层之间增加了一个 SSL 的安全传输协议。

通过 HTTPS，客户端可以确认服务端的身份，保证数据在传输过程中不被篡改、

**当我们在自己的浏览器上与某一个网站建立 HTTPS 连接的时候，满足如下情况可以表示这个服务端可以被信任：**
- 首先我们的操作系统中安装了正确且受信任的证书
- 浏览器本身正确实现了 HTTPS
- 被访问的网站提供了一个证书，这个证书是由一个操作系统所信任的证书颁发机构签发的，操作系统所信任的证书颁发机构一般都预装在操作系统中，通过第一步的方式可以查看。
- 被访问的网站所提供的证书被成功认证

## TLS/SSL
SSL/TLS 是一种密码通信方案、SSL/TLS 涉及到了密码学中的对称加密、非对称加密、数字签名等等

- SSL 全称是 Secure Socket Layer，中文译作安全套接层
- TLS 全称是 Transport Layer Security，中文译作传输层安全。是 IETF 在 SSL3.0 基础上设计的协议
- TLS 先后迭代了 TLS 1.0、TLS 1.1、TLS 1.2 和 TLS 1.3，目前被广泛使用的是 TLS 1.2 版本

## 对称加密
加密密钥和解密密钥是同一个，当浏览器和服务端需要进行通信的时候，约定好一个密钥，然后使用这个密钥对发送的消息进行加密，对方收到消息之后再使用相同的密钥对消息进行解密

## 非对称加密
不对称加密是有一个密钥对公钥和私钥、客户端首先使用公钥对消息进行加密，服务端收到之后，再通过私钥对消息进行解密

## 对称加密和非对称加密结合

- 服务端会生成一个非对称加密的密钥对，私钥自己保存，公钥发送给客户端
- 客户端拿到这个公钥之后，再生成一个对称加密的密钥、然后把对称加密的密钥通过公钥进行加密，加密之后发送给服务端，服务端通过私钥进行解密
- 这样客户端和服务端就可以通过对称加密进行通信了

## CA证书
服务端要通过明文传输的方式把公钥发送给客户端，这个过程还是不安全的

数字证书是一个包含了目标网站各种信息如网站域名、证书有效期、签发机构、用于生成对称密钥的公钥、上级证书签发的签名等的文件，通过数字证书我们可以确认一个用户或者服务站点的身份。

- 实际场景中的数字证书是一系列的，形成了一个信任链，信任链的最顶端是 CA
- CA 是 Certificate Authority 的简写，它是一个负责发放和管理数字的证书的第三方权威机构
- CA 自己给自己颁发的用自己的私钥签名的证书称为根证书，根证书的私钥安全性至关重要，根证书的私钥都是被保存在离线计算机中，有严格的操作规章
- 一个用户想要获取一个证书，首先自己得有一个密钥对，私钥自己留着，公钥以及其他信息发送给 CA，向 CA 提出申请，CA 判明用户的身份之后，会将这个公钥和用户的身份信息绑定，并且为绑定后的信息进行签名（签名是通过 CA 根证书的私钥进行的），最后将签名后的证书发给申请者
- 一个用户想要鉴定一个证书的真伪，就通过 CA 的公钥对证书上的数字签名进行验证，验证通过，就认为这个这个证书是有效的。

## 单向https和双向https
**单向https**
首先建立链接  -> 验证服务端身份 -> 用服务端公钥加密得到后期通信用的密钥 -> 服务端用私钥解密，拿到密钥 - ->  双方使用密钥通信

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/security/singlehttps.png" alt="png">

**双向https**
首先建立连接 -> 验证服务端身份->验证客户端身份->客户端发送加密方案->服务端用客户端公钥加密，选择方案->客户端拿到方案，用服务端公钥加密密文->服务端解密，拿到密文->双方使用密文通信

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/security/doublehttps.png" alt="png">

## springboot+nginx配置https
其中springboot是单向https，nginx是双向https，vue的资源是客户端，nginx需要实现双向https


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



























