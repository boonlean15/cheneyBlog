# Ribbon
负载均衡 利用特定方式将流量分摊到多个操作单元

**分类**
* 软负载 Nginx
* 硬负载 F5
* 服务端负载 典型实现:Nginx
* 客户端负载 典型实现:Ribbon

> Ribbon默认使用轮询方式访问源服务

## 实战

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

## 核心工作原理

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
