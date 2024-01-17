# 基于SpringBoot+Vue开发的Web应用进行双向Https部署

<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/others/1.jpg" alt="png"> 

> 客户端到Nginx采用双向Https访问，客户端选择数字证书进行登录，由Nginx配置双向Https认证，Nginx可以自动解析数字证书，并且我们可以拿到Nginx解析数字证书后的信息，获取到Nginx中的DN值后，放入请求头中，当Nginx反向代理请求Web应用时，就可以将数字证书中的用户信息数据DN传递给Web应用，应用拿到后就可以进行登录。
> > 在此过程中，为了安全起见，Nginx到Web应用的请求采用的是单向Https。

## 后端开启https

### 制作证书

- 生成密钥cmp.p12、制作证书采用jdk自带keytool工具创建.示例1:
```shell
keytool -genkey -alias myhttps -keyalg RSA -keysize 2048 -validity 36500 -keystore  "D:/tmp/ssl/myhttps.keystore"

命令：keytool -genkey -alias testhttps -keyalg RSA -keysize 2048 -validity 36500 -keystore  "D:/tmp/ssl/testhttps.keystore"

命令解释:
• -genkey 表示要创建一个新的密钥。 

• -alias 表示 keystore 的别名。 

• -keyalg 表示使用的加密算法是 RSA。

• -keysize 表示密钥的长度．。

• -keystore 表示生成的密钥存放位直。 

• -validity 表示密钥的有效时间，单位为天。
```  

- **制作证书，示例2:**
```shell
keytool -genkeypair -alias demo -keypass 123456@key -keyalg RSA -keysize 1024 -validity 365 -keystore D:/demo.jks -storepass 123456@store
您的名字与姓氏是什么?
  [Unknown]:  lihz
您的组织单位名称是什么?
  [Unknown]:  org
您的组织名称是什么?
  [Unknown]:  org
您所在的城市或区域名称是什么?
  [Unknown]:  wuhan
您所在的省/市/自治区名称是什么?
  [Unknown]:  hubei
该单位的双字母国家/地区代码是什么?
  [Unknown]:  CN
CN=lihz, OU=org, O=org, L=wuhan, ST=hubei, C=CN是否正确?
  [否]:  y
Warning:
JKS 密钥库使用专用格式。建议使用 "keytool -importkeystore -srckeystore D:/demo.jks -destkeystore D:/demo.jks -deststoretype pkcs12" 迁移到行业标准格式 PKCS12。
```  
> 按照提示生成PKCS12格式证书

- keytool参数
```shell
keytool -help
密钥和证书管理工具

命令:

 -certreq            生成证书请求
 -changealias        更改条目的别名
 -delete             删除条目
 -exportcert         导出证书
 -genkeypair         生成密钥对
 -genseckey          生成密钥
 -gencert            根据证书请求生成证书
 -importcert         导入证书或证书链
 -importpass         导入口令
 -importkeystore     从其他密钥库导入一个或所有条目
 -keypasswd          更改条目的密钥口令
 -list               列出密钥库中的条目
 -printcert          打印证书内容
 -printcertreq       打印证书请求的内容
 -printcrl           打印 CRL 文件的内容
 -storepasswd        更改密钥库的存储口令


keytool -genkeypair -help
keytool -genkeypair [OPTION]...

生成密钥对

选项:

 -alias <alias>                  要处理的条目的别名
 -keyalg <keyalg>                密钥算法名称
 -keysize <keysize>              密钥位大小
 -sigalg <sigalg>                签名算法名称
 -destalias <destalias>          目标别名
 -dname <dname>                  唯一判别名
 -startdate <startdate>          证书有效期开始日期/时间
 -ext <value>                    X.509 扩展
 -validity <valDays>             有效天数
 -keypass <arg>                  密钥口令
 -keystore <keystore>            密钥库名称
 -storepass <arg>                密钥库口令
 -storetype <storetype>          密钥库类型
 -providername <providername>    提供方名称
 -providerclass <providerclass>  提供方类名
 -providerarg <arg>              提供方参数
 -providerpath <pathlist>        提供方类路径
 -v                              详细输出
 -protected                      通过受保护的机制的口令
```

- 导出证书
```shell
#导出证书
keytool -export -alias demo -keystore D:/demo.jks -rfc -file D:/demo.cer -storepass 123456@store
存储在文件 <D:/demo.cer> 中的证书

Warning:
JKS 密钥库使用专用格式。建议使用 "keytool -importkeystore -srckeystore D:/demo.jks -destkeystore D:/demo.jks -deststoretype pkcs12" 迁移到行业标准格式 PKCS12。

# .cer 转换成 .crt  (方式1)
keytool -printcert -rfc -file D:/demo.cer > D:/demo.crt 

#可以使用openssl 工具转换，一般linux操作系统上都有，windows没有。
openssl  x509 -inform PEM -in D:/demo.cer -out D:/demo.crt 
```

- 证书格式转换
```shell
#查看PEM编码证书
openssl x509 -in cert.pem -text -noout
openssl x509 -in cert.cer -text -noout
openssl x509 -in cert.crt -text -noout

#查看DER编码证书
openssl x509 -in certificate.der -inform der -text -noout

#转换证书格式
#转换可以将一种类型的编码证书存入另一种。（即PEM到DER转换）
#PEM到DER
openssl x509 -in cert.crt -outform der -out cert.der
#DER到PEM
openssl x509 -in cert.crt -inform der -outform pem -out cert.pem

#PEM -> DER -> JKS的转换(无私钥情况下转换pem格式证书为jks格式)
#pem文件 转换为 der文件
openssl x509 -outform der -in cert.pem -out cert.der
#der文件 转换为 jks文件
keytool -import -keystore cert.jks -file cert.der

#PKCS12证书
keytool -importkeystore -srckeystore D:/demo.jks -destkeystore D:/demo.jks -deststoretype pkcs12 -srcstorepass 123456@store -deststorepass 123456@store2  -srckeypass 123456@key -destkeypass 123456@key2 -srcalias demo  -destalias demo2
警告: PKCS12 密钥库不支持其他存储和密钥口令。正在忽略用户指定的-destkeypass值。
Warning:
已将 "D:/demo.jks" 迁移到 Non JKS/JCEKS。将 JKS 密钥库作为 "D:/demo.jks.old" 进行了备份。

#查看证书信息
keytool -list -v -keystore  D:/demo.jks -storepass 123456@store2
密钥库类型: jks
密钥库提供方: SUN

您的密钥库包含 1 个条目

别名: demo2
创建日期: 2022-5-23
条目类型: PrivateKeyEntry
证书链长度: 1
证书[1]:
所有者: CN=lihz, OU=org, O=org, L=wuhan, ST=hubei, C=CN
发布者: CN=lihz, OU=org, O=org, L=wuhan, ST=hubei, C=CN
序列号: 5e39fbc9
有效期为 Mon May 23 10:43:46 CST 2022 至 Tue May 23 10:43:46 CST 2023
证书指纹:
         MD5:  4E:1F:2D:FE:6F:A7:45:3C:F8:BD:94:67:85:5E:0E:3A
         SHA1: CC:97:DB:29:4E:10:0B:6F:A5:CB:32:69:7B:3A:43:23:B2:C1:AE:68
         SHA256: 04:F3:CD:A7:7B:65:2F:F2:D8:68:30:7C:33:03:CE:04:3D:A9:C4:3F:63:D7:3B:9F:5B:8A:DB:17:72:2E:E8:B2
签名算法名称: SHA256withRSA
主体公共密钥算法: 1024 位 RSA 密钥
版本: 3

扩展:

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: B2 28 51 3E A2 9B 93 5A   71 76 A6 7B 19 6B 5A 49  .(Q>...Zqv...kZI
0010: FD AC CB 6A                                        ...j
]
]
*******************************************
*******************************************
```

- 证书格式
```shell
.DER 扩展名
用于二进制DER编码证书

.PEM 扩展名
用于不同类型的X.509v3文件，是以“ - BEGIN …”前缀的ASCII（Base64）数据

.CRT 扩展名
CRT扩展用于证书。 证书可以被编码为二进制DER或ASCII PEM。 CER和CRT扩展几乎是同义词。 最常见的于Unix 或类Unix系统

.CER 扩展名
.crt的替代形式

.KEY 扩展名

KEY扩展名用于公钥和私钥PKCS＃8。 键可以被编码为二进制DER或ASCII PEM
```

### springboot开启https
> 项目使用的PKCS12类型证书，步骤：使用示例2创建证书、然后导出证书、项目配置application.yml文件。
- 在application.properties或者application.yml中进行配置
```yml
server:
  port: 9987
  non-ssl-port: 8089
  # 用于 非ssl请求 强制转成 ssl 请求
  # 当使用 访问地址：http://127.0.0.1:8089/hello 访问时 后台会 将请求 转换成 https://127.0.0.1:9987/hello
  #  servlet:
  #    context-path: /ssl-service
  ssl:
    key-store: classpath:xxx.p12  #类路径下的自签证书
    key-alias: cmp # 证书别名
    key-store-password: WSX #证书密码
    key-store-type: PKCS12 # 证书类型
    enabled: true  # 开启证书验证
```  
> 配置了如上属性后，默认开启了https，此时配置文件中的server.port配置的端口为https请求的端口

- springboot兼容http方式开启https
> 以下可配置为http、https共同使用，实现思路是监听http请求转发到https请求
```java
package com.bisp.common.config;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @ClassName TomcatConfig
 * @Description TODO
 * @Author yzx
 * @Date 2022/11/24 10:59
 **/
@Configuration
public class TomcatConfig {
    /**获取配置端口*/
    @Value("${server.port}")
    private Integer httpPort;

    @Bean
    public ServletWebServerFactory servletContainer() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory(){
            @Override
            protected void postProcessContext(Context context) {
                SecurityConstraint constraint = new SecurityConstraint();
                constraint.setUserConstraint("CONFIDENTIAL");
                SecurityCollection collection = new SecurityCollection();
                collection.addPattern("/*");
                constraint.addCollection(collection);
                context.addConstraint(constraint);
            }
        };
        factory.addAdditionalTomcatConnectors(tomcatConnector());
        return factory;
    }

    private Connector tomcatConnector() {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setScheme("http");
        //http端口号，可以自行指定（不能和其它已经使用的端口重复，否则会报错）
        //设置http的监听端口为80端口，这样访问的时候也可以不用带上端口号
        connector.setPort(9090);
        connector.setSecure(false);
        //监听到的http的端口号后转向到https的端口号，可以自行指定
        connector.setRedirectPort(httpPort);
        return connector;
    }

}
```

### Postman使用 - 如果需要使用postman则导出证书使用
```shell
Postman的证书
Postman会对证书进行验证，只有正规机构颁发的证书才能验证通过，如果是自签的证书，则需要关闭验证 SSL certificate verification 。

Postman增加客户端证书涉及3个文件和一个密码：

.pfx 同时包含了公钥信息和私钥信息（cer只包含公钥信息）

.cer 为客户端密钥库的公钥

.key 为客户端密钥库的私钥

Passphrase 为密钥库的密码。创建证书时设置的密码，-keypass 参数。
```

## 基于NGINX实现双向HTTPS

> vue开启https方式存在问题，由于证书不能在本地主机上工作，所有证书只能在域名上工作。推荐使用nginx添加ssl

- 制作证书
```shell
C:\nginx-1.16.1\ssl>openssl genrsa -des3 -out server.key 2048  创建服务器私钥
Generating RSA private key, 2048 bit long modulus (2 primes)
...............+++++
.........................................................................+++++
e is 65537 (0x010001)
Enter pass phrase for server.key:
Verifying - Enter pass phrase for server.key:
 
C:\nginx-1.16.1\ssl>openssl req -new -key server.key -out server.csr  创建CSR证书请求文件
Enter pass phrase for server.key:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:CN
State or Province Name (full name) [Some-State]:Shanghai
Locality Name (eg, city) []:Shanghai
Organization Name (eg, company) [Internet Widgits Pty Ltd]:XXXXX
Organizational Unit Name (eg, section) []:Software
Common Name (e.g. server FQDN or YOUR name) []:YYYY
Email Address []:
 
Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
 
C:\nginx-1.16.1\ssl>copy server.key server.key.orig  备份有秘密的私钥文件
已复制         1 个文件。
 
C:\nginx-1.16.1\ssl>openssl rsa -in server.key -out server.key  去掉私钥文件的密码
Enter pass phrase for server.key:
writing RSA key
 
C:\nginx-1.16.1\ssl>openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt    使用服务器私钥签署服务器公钥证书
Signature ok
subject=C = CN, ST = Shanghai, L = Shanghai, O = Intel, OU = Software, CN = server1
Getting Private key
```

- 部署自签证书到nginx服务器
> Nginx的配置是最关键的，首先，需要将Vue生成的静态资源交给Nginx处理。其次，需要将Nginx配置成双向Https认证，客户端的证书交给Nginx认证并解析

```shell
# 二级路由跳转、接口代理、https信任自签证书
server {
        server_name localhost;
        listen 443 ssl; # 监听443端口, 开启ssl(必须)
        root /usr/share/nginx/html;
        
        #ssl
        # 引用ssl证书(必须,如果放在nginx/conf/ssl下可以用相对路径,其他位置必须用绝对路径)
        ssl_certificate /etc/nginx/cert/server.crt;
        ssl_certificate_key /etc/nginx/cert/server.key;
        # 协议优化(可选,优化https协议,增强安全性)
        ssl_session_cache  shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;

        #gzip
        gzip on; #启动
        gzip_buffers 32 4K;
        gzip_comp_level 6; #压缩级别，1-10，数字越大压缩的越好
        gzip_min_length 100; #不压缩临界值，大于100的才压缩，一般不用改
        gzip_types application/javascript text/css text/xml;
        gzip_disable "MSIE [1-6]\."; # IE6对Gzip不友好，对Gzip
        gzip_vary on;

        client_max_body_size  500m;
        location / {
                try_files $uri $uri/ @router;
                index  index.html index.htm ;
        }

        location @router{
                rewrite ^.*$ /index.html last;
        }

        # 当遇到/api （也就是我们的接口）对其进行反向代理
        location ~^/xxx {
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_pass   https://${API_PATH};
        }

        location ~^/cmp-xxx {
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_pass   http://${MINIO_PATH};
        }

}
```
参考：
正式证书：[基于NGINX实现双向HTTPS部署并实现数字证书登录](https://www.freesion.com/article/49521570591/)
[自签名证书](https://www.cnblogs.com/lasding/p/16924679.html)
[springboot开启https](https://blog.csdn.net/weixin_41463944/article/details/131604251)
[springboot使用https协议](https://blog.csdn.net/demon7552003/article/details/125631771)