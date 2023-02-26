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






















