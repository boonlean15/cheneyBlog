# Feign

## 概述

> 声明式的Web Service客户端，http的方式实现远程方法调用，服务无感知调用过程

**特性**
* 可拔插的FeignClient注解，JAX-RS注解
* HTTP编码器和解码器
* 支持hystrix和fallback
* 支持ribbon负载均衡
* 支持http请求响应压缩

**原理**
* EnableFeignClients启动FeignClient注解扫描
* FeignClient添加到IOC容器
* JDK动态代理->RequestTemplate(一个方法一个RequestTemplate，RequestTemplate封装了http请求的全部信息)->Request->Client->Load BalanceClient->结合ribbon负载均衡发起服务调用

## Feign基础功能

**FeignClient注解剖析**
* name FeignClient名称，结合Ribbon，作为服务名称
* url 一般用于调试，可手动指定地址
* decode404 404时进行decode解码
* configuration feign配置类，可指定decoder，encoder，LoggerLevel，contract
* fallback fallback容错处理，需实现FeignClient接口
* fallbackFactory fallback工厂，接口通用容错处理逻辑，减少重复代码
* path feignclient统一前缀

## Feign开启Gzip压缩

> 属性文件配置 application.yml文件配置开启Gzip压缩、返回需修改为ResponseEntity<byte[]>

## Feign支持属性文件配置

* > 单个指定特定名称的feignClient配置、通过application.yml文件进行配置、feign.client.config.feignName...connectTimeout...readTimeout等
* 作用于所有FeignClient 两种方式，配置类或配置文件
  * EnableFeignClients的defaultConfiguration属性指定配置类
  * 通过配置文件application.yml配置，feign.client.config.default...connectTimeout...readTimeout等
  * feign.client.default-to-properties=false指定优先级

## FeignClient日志开启

1. 配置文件application.yml配置日志级别、logging.level:类全路径包名：debug
2. 启动类注入Logger.Level Bean/ 或添加@Configuration 配置日志Bean

## Feign超时设置

feign的调用分两层、Ribbon、Hystrix(高版本默认关闭)

1. Ribbon
   > ribbon.ReadTimeout: 50000、ribbon.ConnectTimeout:50000
2. Hystrix
   > feign.hyxtrix.enabled: true、hystrix.command.default.excution.isolation.thread.timeoutInMilliseconds:50000

## Feign实战

## Feign默认Client替换

**缺点**
1. 默认使用JDk的UrlConnection
2. 没有连接池，每个地址保持一个长连接persistence connection
**优化**
1. HttpClient替换默认Client
   > 连接池设置、超时时间设置，实现服务调用调优
2. OkHttp替换默认client
   > 连接池设置、超时时间设置，实现服务调用调优

## Feign的Post和get多参数传递

Feign没有实现SpringMVC的全部功能，不支持GET方法传递POJO参数

**解决方案**
* POJO拆成一个个参数放在方法参数
* 方法参数变成Map传递
* Get @RequestBody 但违反restful
* **最佳实践** 实现Feign的RequestInterceptor，在发起请求前对参数进行转换

## Feign文件上传

1. feign-form实现文件上传
2. @RequestPart 传递file
3. @RequestMapping produces和consumes参数必填

## 解决Feign首次请求失败

**出现原因** 
1. feign结合了ribbon和hystrix
2. Hystrix默认超时时间是1s
3. Bean装配和懒加载，feign首次请求耗时

**解决方式**
1. 改变Hystrix超时时间
2. 禁用Hystrix超时时间
3. 使用feign时关闭Hystrix(不建议)

## Feign返回图片流处理方式
* Feign返回图片一般时byte[]
* Controller不能直接返回byte[]，修改为返回response

## Feign调用传递Token

**出现原因**
1. 外部请求到A服务，feign可以拿到token
2. A服务调用B服务，feign的tokent丢失

**解决方法**
> 通过Feign的RequestInterceptor，把A的token放到RequestTemplate

## venus-cloud-feign设计与使用

**主要解决了什么问题**
1. 解决SpringMVC不支持继承Feign接口方法上的注解
2. 解决Feign的Get方法不支持传递POJO问题
