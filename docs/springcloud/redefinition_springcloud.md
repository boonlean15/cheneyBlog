# 重新定义springcloud

## 微服务与springcloud

    微服务是一种架构风格，能给软件应用开发带来很大的便利，但是微服务的实施和落地面临着很大的挑战，因此需要一套完整的微服务解决方案。

### 微服务架构概述

#### 应用架构的发展

1.单体应用
> 缺点：灵活度不足、降低系统的性能、系统启动慢、系统拓展性差

2.分布式架构
> 按照业务垂直切分，每个应用都是单体架构

3.面向服务的SOA架构
> 不同的业务建立不同的服务，服务之间互相调用。Dubbo是soa的典型实现：主要角色包含服务提供者和服务消费者

4.微服务架构
> soa架构继续发展的下一步，是一种架构风格。一个大型的业务系统，它的业务功能可以拆分成多个独立的微服务，各个服务之间是松耦合，通过各种远程协议进行同步/异步通信。各个微服务可以独立部署，扩容，升降级等。

5.服务网格

6.无服务架构

#### 微服务解决方案

1.基于springcloud的微服务解决方案 
> 技术选型中立，可随需搭配更换使用

2.基于Dubbo实现微服务解决方案 
> Dubbo+nacos+seta+其他



### springcloud与中间件
注册中心，配置中心，网关，负载均衡，熔断机制，链路监控等中间件。

#### 中间件
    操作系统之上，应用软件之下的中间层软件。
> 中间件向下屏蔽异构的硬件、软件、网络等计算资源，向上提供应用开发、运行、维护等全生命周期的统一的计算环境和管理，属于承上启下的中间层。

#### springcloud
    也是一个中间件，基于springboot开发，提供一套完整的微服务解决方案。

1.网关
> 统一接入服务、协议适配、流量管控、安全防护
> zuul对每个请求分配一个线程处理，根据参考数据，最多达到1000-2000qps，并发情况下，不建议使用，因此出现第二代网关gateway

### springcloud增强生态

1.springcloud分布式事务

> 分布式事务问题成为微服务落地最大的阻碍和最具挑战性的问题

2.springcloud与领域驱动


## Spring cloud eureka

基于REST的服务发现组件

### 服务发现概述

1.服务发现由来
> 跟软件开发的架构方式的演进有着密切关系
* 单体架构，调用其他服务的时候，通过api方式调用
* soa 服务拆分，服务之间互相调用，服务提供者和服务消费者通过配置多个服务实例的访问地址实现调用
* 微服务 docker容器化，服务不再固定部署在服务器上，ip变化频繁，此时服务注册中心的出现则变得迫切、其他的服务组件例如网关等都通过访问服务注册中心来获取服务实例列表，实现动态路由

2.服务发现技术选型
> 根据CAP选型，是AP还是CP，采用的语言是什么，比如eureka和nacos采用的是java语言，eureka是AP，zookeeper是CP

### eureka的核心类

* InstanceInfo 代表注册的服务实例
* LeaseInfo 服务实例的租约信息
* ServiceInstance 服务发现的实例信息的抽象接口，约定服务实例有哪些通用的信息
* InstanceStatus 服务实例的状态

### 服务的核心操作

* 服务注册 register
* 服务下线 cancel
* 服务租约 renew
* 服务剔除 evict
  
> LeaseManager和LookupService是eureka关于服务发现相关操作定义的接口类

* LeaseManager 
> 定义了服务实例的regist、cancel、renew、evict操作方法
* LookupService 
> 定义了eureka client从服务中心获取服务实例的查询方法

### eureka的设计理念

* 服务实例如何注册到服务中心
  > 服务启动的时候调用REST api的register方法注册服务实例信息
* 服务实例如何从服务中心剔除
  > 正常情况，服务实例关闭的时候，调用钩子方法或其他生命周期回调方法，删除自身服务实例信息。服务实例挂掉或异常情况，通过租约续租的方式，通过心跳证明服务实例存活，如租约逾期，服务中心删除服务实例信息。
* 服务实例一致性问题
  > 服务实例本身应该是个集群，服务实例注册信息如何在集群中保持一致。主要由下面：AP优于CP、peer to peer 架构、zone及region设计、self preservation设计

#### AP优于CP

* CAP理论
  * Consistency 数据一致性 对数据更新操作成功之后，要求副本之间数据保持一致性
  * Availability 可用性 客户端对集群进行读写操作，请求能够正常响应
  * Partition Tolerance 分区容错性 通信故障时，集群被分割为多个分区，集群仍然可用
    > 分布式系统，网络条件不可控，网络分区不可避免，系统必须具备分区容错性
    > > zookeeper采用“CP”，默认非强一致性，实例同步过半数时，则返回。如采用强一致性，则需要访问到服务实例时，sync操作同步信息。但无法保证availability

    > > Eureka网络分区不可用不可避免，选择拥抱服务实例不可用的问题，实现AP。服务注册中心保留可用及过期数据，比丢失数据来的好。

#### peer to peer 架构
  * 主从复制 master-slave模式，主节点负责写操作，从节点从主节点复制更新数据。主节点的写操作压力是系统的瓶颈，但从节点可分担读操作
  * peer to peer 对等复制，任何副本都可以接受写操作，每个副本之间进行数据更新。数据同步和数据冲突处理是一个棘手的问题
    > eureka采用peer to peer
    * 客户端
      * 优先选择相同分区的server，没有则采用defaultZone
      * 可用和不可用server列表，可用server列表每隔一段时间刷新，避免访问顺序造成的server压力
    * 服务端
      * server本身也是client，启动时，register并syncUp操作同步数据
      * header_replication标识时复制操作，避免server之间复制死循环
      * lastDirtyTime 对比，如果大于，server数据之间冲突，要求重新register、如果小于，如果是peer节点的复制，则要求其同步自己的最新数据
      * heartbeat心跳，服务实例的renewLease操作，如发现数据不一致，要求重新register

#### zone和region
   * eureka基于amazon开发，region代表区域。region下有多个availabilityZone，每个zone下可以有多个server服务实例
   * region之间不会进行复制，zone下的server服务实例是peer节点，构成复制
   * ribbon支持zoneAffinity，客户端路由或网关路由时，优先选择与自身实例在同一个zone的服务实例

#### self preservation
   * 心跳保持租约，server通过实例数计算每分钟应该收到的心跳数
   * 最近一分钟的心跳数如果小于或等于指定阈值，则关闭租约失效剔除，以保护注册信息


## Feign

### 概述

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

### Feign基础功能

**FeignClient注解剖析**
* name FeignClient名称，结合Ribbon，作为服务名称
* url 一般用于调试，可手动指定地址
* decode404 404时进行decode解码
* configuration feign配置类，可指定decoder，encoder，LoggerLevel，contract
* fallback fallback容错处理，需实现FeignClient接口
* fallbackFactory fallback工厂，接口通用容错处理逻辑，减少重复代码
* path feignclient统一前缀

#### Feign开启Gzip压缩

> 属性文件配置 application.yml文件配置开启Gzip压缩、返回需修改为ResponseEntity<byte[]>

#### Feign支持属性文件配置

* > 单个指定特定名称的feignClient配置、通过application.yml文件进行配置、feign.client.config.feignName...connectTimeout...readTimeout等
* 作用于所有FeignClient 两种方式，配置类或配置文件
  * EnableFeignClients的defaultConfiguration属性指定配置类
  * 通过配置文件application.yml配置，feign.client.config.default...connectTimeout...readTimeout等
  * feign.client.default-to-properties=false指定优先级

#### FeignClient日志开启

1. 配置文件application.yml配置日志级别、logging.level:类全路径包名：debug
2. 启动类注入Logger.Level Bean/ 或添加@Configuration 配置日志Bean

#### Feign超时设置

feign的调用分两层、Ribbon、Hystrix(高版本默认关闭)

1. Ribbon
   > ribbon.ReadTimeout: 50000、ribbon.ConnectTimeout:50000
2. Hystrix
   > feign.hyxtrix.enabled: true、hystrix.command.default.excution.isolation.thread.timeoutInMilliseconds:50000

### Feign实战

#### Feign默认Client替换

**缺点**
1. 默认使用JDk的UrlConnection
2. 没有连接池，每个地址保持一个长连接persistence connection
**优化**
1. HttpClient替换默认Client
   > 连接池设置、超时时间设置，实现服务调用调优
2. OkHttp替换默认client
   > 连接池设置、超时时间设置，实现服务调用调优

#### Feign的Post和get多参数传递

Feign没有实现SpringMVC的全部功能，不支持GET方法传递POJO参数

**解决方案**
* POJO拆成一个个参数放在方法参数
* 方法参数变成Map传递
* Get @RequestBody 但违反restful
* **最佳实践** 实现Feign的RequestInterceptor，在发起请求前对参数进行转换

#### Feign文件上传

1. feign-form实现文件上传
2. @RequestPart 传递file
3. @RequestMapping produces和consumes参数必填

#### 解决Feign首次请求失败

**出现原因** 
1. feign结合了ribbon和hystrix
2. Hystrix默认超时时间是1s
3. Bean装配和懒加载，feign首次请求耗时

**解决方式**
1. 改变Hystrix超时时间
2. 禁用Hystrix超时时间
3. 使用feign时关闭Hystrix(不建议)

#### Feign返回图片流处理方式
* Feign返回图片一般时byte[]
* Controller不能直接返回byte[]，修改为返回response

#### Feign调用传递Token

**出现原因**
1. 外部请求到A服务，feign可以拿到token
2. A服务调用B服务，feign的tokent丢失

**解决方法**
> 通过Feign的RequestInterceptor，把A的token放到RequestTemplate

### venus-cloud-feign设计与使用

**主要解决了什么问题**
1. 解决SpringMVC不支持继承Feign接口方法上的注解
2. 解决Feign的Get方法不支持传递POJO问题

## Ribbon
负载均衡 利用特定方式将流量分摊到多个操作单元

**分类**
* 软负载 Nginx
* 硬负载 F5
* 服务端负载 典型实现:Nginx
* 客户端负载 典型实现:Ribbon

> Ribbon默认使用轮询方式访问源服务

### 实战

**Ribbon负载均衡策略与自定义配置**
* 全局策略设置-添加Config并设置bean-RandomRule
* 基于注解的策略设置
  > TestConfiguration 类创建并注入 bean设置策略-@Configuration @AvoidScan -- IClientConfig

  > @RibbonClient-@ComponentScan 单源服务生效，需设置@AvoidScan避免全局生效

  > @RibbonClients 可设置多个源服务策略
* 基于配置文件
  > client-a：ribbon：NFLoadBalancerRuleClassName

**Ribbon超时与重试**
* 配置文件配置

**Ribbon饥饿加载**
* 配置文件配置

**利用配置文件自定义 Ribbon客户端**
* 利用Ribbon实现类，也可以自实现
  > client-a：ribbon：NFLoadBalancerRuleClassName

**Ribbon脱离Eureka使用**
> 如果Eureka是一个供许多人共同使用的公共注册中心，容易产生服务侵入性问题

### 核心工作原理

**核心接口**
* IClientConfig
* IRule
* IPing
* ServerList<Server>
* ServerListFilter<Server>
* ILoadBalancer
* ServerListUpdater
  
**工作原理涉及到几个主要类和注解**
* RestTempalte 
* @LoadBalanced
* LoadBalancerClient
* * execute()
* * reconstructURI()
* ServiceInstanceChooser
* * chose(service)

**重点类** **LoadBalancerAutoConfiguration**
* 必须有RestTemplate
* 必须初始化LoadBalancerClient
* LoadBalancerRequestFactory->LoadBalancerRequest
* LoadBalancerInterceptorConfig->LoadBalancerInterceptor、->RestTemplateCustomizer
* LoadBalancerInterceptor-拦截每次请求进行绑定到Ribbon负载均衡生命周期
* RestTemplateCustomizer为每个RestTemplate绑定LoadBalancerInterceptor
* LoadBalancerInterceptor.execute()方法
* LoadBalancerClient-唯一实现类RibbonLoadBalancerClient->getServer（）-> choseServer（）-> rule.chose()方法，获取服务实现负载策略选择
**总结**
> Interceptor拦截请求->然后LoadBalancerClient选择服务->由rule.chose（）根据策略选择对应的服务

**负载均衡策略源码导读**
* IRule
* * choose(Object key)
* * setLoadBalancer(ILoadBalancer ib)
* * getLoadBalancer()

## spring cloud config

### spring cloud config概述和入门
> 一个集中化外部配置的分布式系统，不依赖于注册中心，可单独使用。支持多种方式存储配置信息：jdbc、native、git、svn、默认git

**git版工作原理**
> client发起请求，server向git remote拉取配置到本地仓库，然后再返回给客户端client。好处是即使git remote 不可用，本地仍然有配置信息，保证server端可用。

**config入门案例**
* 添加依赖
* 添加配置文件配置地址
* client端访问server获取地址：需要配置一个属性类存储配置信息

**手动刷新**
* 需要添加配置，放开csrf安全校验，然后访问/actutor/refresh，实现手动刷新  

**结合bus实现自动刷新**
* rabbitMQ作为消息中间件
* bus实现update配置文件后，通知server端，然后server端发布消息给client
* client重新发送请求访问server获取配置，实现自动刷新

### conig实战

#### GIT配置

**服务端GIT配置**
* git中uri占位符 
* * 例如：
  > spring.cloud.config.server.git.uri: https://github.com/boolean/{application}

  > client端配置spring.cloud.config.name: spring-cloud-config
  获取server端配置端时候，name会对应到server到uri配置到application上，访问的是spring-cloud-config的仓库，仓库和配置文件要同名，因为会搜索spring-cloud-config.yml文件

**模式匹配和多个存储库**
* 通过修改application.yml文件配置repos：最好通过上网搜索参考案例进行实战

**路径搜索占位符**
* 用到了searchPaths参数，这里可以通过通配符匹配
* * 比如：search-paths：SC-CONFIG，SC-*，会匹配SC-CONFIG，或SC-开头的多个路径
* * search-paths：* {application} * ，这样可以通过不同是项目匹配不同的路径

#### springcloud config 关系型数据库配置
**关系型数据库配置中心实现 mysql**
* **原理** config-client请求config-server，config-server访问mysql数据库获取配置，返回给config-client

**非关系型数据库配置中心实现 mongoDB**
* **原理** config-client请求config-server，config-server访问mongoDB获取配置，返回给config-client
> @EnableMongoConfigServer **db做了界面化的配置和管理，提交配置成功到db时，调用config-server到刷新接口，即可实现git到webHook一样的提交绑定功能**

#### springcloud config使用技能
**本地参数覆盖远程参数**
``` yml
spring:
    cloud:
        config:
            allowOverride: true
            overrideNone: true
            overrideSystemProperties: false
# allowOverride标识overrideSystemProperties属性是否启用，默认true，设置false意味着禁止用户配置
# overrideNone当allowOverride为true时，设置overrideNone为true，外部的配置优先级低，而且不能覆盖任何属性源，默认false
# overrideSystemProperties标识外部配置是否能覆盖本地配置系统属性，默认true
```
#### Springcloud config 功能扩展
**客户端自动刷新**
* 主要是客户端添加自动刷新依赖部分和客户端自动刷新代码
``` java
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.autoconfigure.RefreshAutoConfiguration;
import org.springframework.cloud.endpoint.RefreshEndpoint;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.ScheduledAnnotationBeanPostProcessor;
import org.springframework.scheduling.annotation.SchedulingConfiguration;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.IntervalTask;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

/**
 * @author: zzf
 * @date: 2018/6/11
 * @time: 00:49
 * @description : 自动刷新配置的方法
 */
@ConditionalOnClass(RefreshEndpoint.class)
@ConditionalOnProperty("spring.cloud.config.refreshInterval")
@AutoConfigureAfter(RefreshAutoConfiguration.class)
@Configuration
public class ConfigClientRefreshAutoConfiguration implements SchedulingConfigurer {

    private static final Log logger = LogFactory.getLog(ConfigClientRefreshAutoConfiguration.class);

    /**
     * 间隔刷新时间
     */
    @Value("${spring.cloud.config.refreshInterval}")
    private long refreshInterval;

    /**
     * 刷新的端点
     */
    @Autowired
    private RefreshEndpoint refreshEndpoint;


    @Override
    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar) {

        final long interval = getRefreshIntervalInMilliseconds();

        logger.info(String.format("Scheduling config refresh task with %s second delay", refreshInterval));
        scheduledTaskRegistrar.addFixedDelayTask(new IntervalTask(new Runnable() {
            @Override
            public void run() {
                refreshEndpoint.refresh();
            }
        }, interval, interval));
    }

    /**
     * 以毫秒为单位返回刷新间隔。.
     * @return
     */
    private long getRefreshIntervalInMilliseconds() {

        return refreshInterval * 1000;
    }

    /**
     * 如果没有在上下文中注册，则启用调度程序。
     */
    @ConditionalOnMissingBean(ScheduledAnnotationBeanPostProcessor.class)
    @EnableScheduling
    @Configuration
    protected static class EnableSchedulingConfigProperties {

    }
}
```
``` yml
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.sc.book.config.ConfigClientRefreshAutoConfiguration
```

**客户端回退功能**
* 出现网络中断时，配置服务器因维护而关闭时，使用。客户端适配器将**缓存**本地文件系统的计算属性
> client访问server获取配置，缓存到本地文件系统，然后当server端不可用时，client端会使用本地的文件作为回退文件。也是客户端高可用的一部分

**客户端的安全认证机制JWT**
* 配置中心不是任何人知道地址就可以访问的，安全对于敏感数据很重要

#### 高可用部分
* 客户端高可用 - 主要体现在客户端缓存本地文件，当服务端不可用时，仍然可以使用本地配置
* 服务端高可用 - 主要是config server 集群，和ribbon负载均衡体现服务端高可用

#### spring cloud config 和 Apollo的使用
* 主要是Apollo使用了eureka作为注册中心，是的两者可以无缝衔接
* Apollo有Admin service，config service两个都是多实例、无状态部署，然后在eureka上套了一层meta server
* config service服务对象上apollo客户端，admin service服务对象上apollo portal管理界面
* client通过meta server获取config service服务列表(ip+port)，然后通过ip+port进行访问，同时client端会进行loadbalance，错误重试
* portal通过meta server获取admin service服务列表(ip+port)，然后通过ip+port访问，同时portal端会loadbalance和错误重试

## spring cloud 认证和鉴权

### 微服务安全与权限
**权限问题一直是核心问题之一**
> 服务拆分后，服务之间调用的认证和授权都需要进行重新的考虑。

* 流程
> 发送请求-> 负载均衡软件 -> 微服务网关 -> 网关进行用户认证 -> 携带用户本身信息到后台微服务 -> 微服务进行相关鉴权

### spring cloud 认证和鉴权方案
**单体应用的常用方案**
> 固定的认证和鉴权的包，包含很多认证和鉴权的类。服务端session保存，返回sessionId,客户端通过cookie保存，后续请求顺利进行

**微服务下SSO单点登录方案**
> 用户 -> 发起请求 -> 访问服务 -> 服务访问认证服务auth server。微服务下，服务拆分为多个微小服务，每个服务都要访问auth server，
> 带来非常大的网络开销和性能损耗。

**分布式session和网关结合方案**
> start -> 网关 gateway sso -> sessionId redis -> microservice 从redis中获取用户的数据
* 方便做扩展，保证高可用方案。实现起来有一定复杂度

**客户端token和网关结合方案** 
> start -> 网关 gateway token -> 携带token访问服务 -> microservice 进行具体的接口和url验证
* 涉及用户大量数据存放，token不适合保存。token的注销有一定的麻烦，需要在网关层注销token。

**浏览器cookie与网关结合方案**
> 和上面方法类似，用户信息是存在cookie中，通过网关解析cookie获取用户信息。适合老系统改造

**网关与token和服务间鉴权结合**
> start -> 网关认证 -> 传递用户信息到header -> microservice接收header并解析 -> 查看是否有调用此微服务或某个url
> 的权限， 鉴权 -> 服务内部发出请求，拦截，用户信息保存到 header -> 被调用方服务获取header解析和鉴权

### spring cloud 认证和鉴权案例
**网关与token和服务间鉴权结合案例**
* spring-cloud-gateway项目
  * 引入jwt依赖
  * 增加jwt生成和验证解析的方法 根据用户名生成jwt，验证的时候传入jwt
  * 全局过滤器globalFilter，对jwt token解析校验转换成系统内部token，并把路由的服务名也放入header，方便后续服务鉴权
```java
public class JwtUtil {
	    public static final String SECRET = "qazwsx123444$#%#()*&& asdaswwi1235 ?;!@#kmmmpom in***xx**&";
	    public static final String TOKEN_PREFIX = "Bearer";
	    public static final String HEADER_AUTH = "Authorization";

	    public static String generateToken(String user) {
	        HashMap<String, Object> map = new HashMap<>();
	        map.put("id", new Random().nextInt());
	        map.put("user", user);
	        String jwt = Jwts.builder()
    			  .setSubject("user info").setClaims(map)
    			  .signWith(SignatureAlgorithm.HS512, SECRET)
    			  .compact();
	        String finalJwt = TOKEN_PREFIX + " " +jwt;
	        return finalJwt;
	    }

	    public static Map<String,String> validateToken(String token) {
	        if (token != null) {
	        	HashMap<String, String> map = new HashMap<String, String>();
	            Map<String,Object> body = Jwts.parser()
	                    .setSigningKey(SECRET)
	                    .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
	                    .getBody();
	            String id =  String.valueOf(body.get("id"));
	            String user = (String) (body.get("user"));
	            map.put("id", id);
	            map.put("user", user);
	            if(StringUtils.isEmpty(user)) {
					throw new PermissionException("user is error, please check");
	            }
	            return map;
	        } else {
	        	throw new PermissionException("token is error, please check");
	        }
	    }
	    
}

```
```java
@Component
public class AuthFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    	Route gatewayUrl = exchange.getRequiredAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
    	URI uri = gatewayUrl.getUri();
    	ServerHttpRequest request = (ServerHttpRequest)exchange.getRequest();
    	HttpHeaders header = request.getHeaders();
    	String token = header.getFirst(JwtUtil.HEADER_AUTH);
    	Map<String,String> userMap = JwtUtil.validateToken(token);
    	ServerHttpRequest.Builder mutate = request.mutate();
    	if(userMap.get("user").equals("admin") || userMap.get("user").equals("spring") || userMap.get("user").equals("cloud")) {
    		mutate.header("x-user-id", userMap.get("id"));
        	mutate.header("x-user-name", userMap.get("user"));
        	mutate.header("x-user-serviceName", uri.getHost());
    	}else {
    		throw new PermissionException("user not exist, please check");
    	}
    	ServerHttpRequest buildReuqest =  mutate.build();
         return chain.filter(exchange.mutate().request(buildReuqest).build());
    }
}
```
```java
public class PermissionException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	public PermissionException(String msg) {
        super(msg);
    }
}
```
* core-service 项目
  * 服务拦截器 进入控制器之前进行校验
    * 增加core工程，提供拦截器，用于微服务之间调用的鉴权
    * 增加restTemplate拦截器，用于调用时传递上下文
  * 增加上下文持有对象
  * 把拦截器添加到程序
```java
public class UserContextInterceptor extends HandlerInterceptorAdapter {

    private static final Logger log = LoggerFactory.getLogger(UserContextInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse respone, Object arg2) throws Exception {
        User user = getUser(request);
        UserPermissionUtil.permission(user);
        if (!UserPermissionUtil.verify(user, request)) {
            respone.setHeader("Content-Type", "application/json");
            String jsonstr = JSON.toJSONString("no permisson access service, please check");
            respone.getWriter().write(jsonstr);
            respone.getWriter().flush();
            respone.getWriter().close();
            throw new PermissionException("no permisson access service, please check");
        }
        UserContextHolder.set(user);
        return true;
    }
}
```
```java
public class RestTemplateUserContextInterceptor implements ClientHttpRequestInterceptor {

	@Override
	public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution)
			throws IOException {
		User user = UserContextHolder.currentUser();
		request.getHeaders().add("x-user-id",user.getUserId());
		request.getHeaders().add("x-user-name",user.getUserName());
		request.getHeaders().add("x-user-serviceName",request.getURI().getHost());
		return execution.execute(request, body);
	}
}
```
```java
public class UserContextHolder {
	public static ThreadLocal<User> context = new ThreadLocal<User>();
	public static User currentUser() {
		return context.get();
	}
	public static void set(User user) {
		context.set(user);
	}
	public static void shutdown() {
		context.remove();
	}
}
```
```java
@Configuration
@EnableWebMvc
public class CommonConfiguration extends WebMvcConfigurerAdapter{
	
	/**
	 * 请求拦截器
	 */
	@Override
    public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new UserContextInterceptor());	
    }
	
	/***
	 * RestTemplate 拦截器，在发送请求前设置鉴权的用户上下文信息
	 * @return
	 */
	@LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add(new RestTemplateUserContextInterceptor());
        return restTemplate;
    }
   
}
```
* provider-service服务提供方
  * 增加核心工程依赖 
  * 增加数据接口供客户调用
    
* client-service客户端工程
  * 添加核心工程依赖 
  * 增加接口调用其他服务接口

























