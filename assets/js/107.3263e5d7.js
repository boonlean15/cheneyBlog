(window.webpackJsonp=window.webpackJsonp||[]).push([[107],{392:function(e,v,l){"use strict";l.r(v);var _=l(14),t=Object(_.a)({},(function(){var e=this,v=e._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[v("h1",{attrs:{id:"ribbon"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ribbon"}},[e._v("#")]),e._v(" Ribbon")]),e._v(" "),v("p",[e._v("负载均衡 利用特定方式将流量分摊到多个操作单元")]),e._v(" "),v("p",[v("strong",[e._v("分类")])]),e._v(" "),v("ul",[v("li",[e._v("软负载 Nginx")]),e._v(" "),v("li",[e._v("硬负载 F5")]),e._v(" "),v("li",[e._v("服务端负载 典型实现:Nginx")]),e._v(" "),v("li",[e._v("客户端负载 典型实现:Ribbon")])]),e._v(" "),v("blockquote",[v("p",[e._v("Ribbon默认使用轮询方式访问源服务")])]),e._v(" "),v("h2",{attrs:{id:"实战"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#实战"}},[e._v("#")]),e._v(" 实战")]),e._v(" "),v("p",[v("strong",[e._v("Ribbon负载均衡策略与自定义配置")])]),e._v(" "),v("ul",[v("li",[v("p",[e._v("全局策略设置-添加Config并设置bean-RandomRule")])]),e._v(" "),v("li",[v("p",[e._v("基于注解的策略设置")]),e._v(" "),v("blockquote",[v("p",[e._v("TestConfiguration 类创建并注入 bean设置策略-@Configuration @AvoidScan -- IClientConfig")])]),e._v(" "),v("blockquote",[v("p",[e._v("@RibbonClient-@ComponentScan 单源服务生效，需设置@AvoidScan避免全局生效")])]),e._v(" "),v("blockquote",[v("p",[e._v("@RibbonClients 可设置多个源服务策略")])])]),e._v(" "),v("li",[v("p",[e._v("基于配置文件")]),e._v(" "),v("blockquote",[v("p",[e._v("client-a：ribbon：NFLoadBalancerRuleClassName")])])])]),e._v(" "),v("p",[v("strong",[e._v("Ribbon超时与重试")])]),e._v(" "),v("ul",[v("li",[e._v("配置文件配置")])]),e._v(" "),v("p",[v("strong",[e._v("Ribbon饥饿加载")])]),e._v(" "),v("ul",[v("li",[e._v("配置文件配置")])]),e._v(" "),v("p",[v("strong",[e._v("利用配置文件自定义 Ribbon客户端")])]),e._v(" "),v("ul",[v("li",[e._v("利用Ribbon实现类，也可以自实现\n"),v("blockquote",[v("p",[e._v("client-a：ribbon：NFLoadBalancerRuleClassName")])])])]),e._v(" "),v("p",[v("strong",[e._v("Ribbon脱离Eureka使用")])]),e._v(" "),v("blockquote",[v("p",[e._v("如果Eureka是一个供许多人共同使用的公共注册中心，容易产生服务侵入性问题")])]),e._v(" "),v("h2",{attrs:{id:"核心工作原理"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#核心工作原理"}},[e._v("#")]),e._v(" 核心工作原理")]),e._v(" "),v("p",[v("strong",[e._v("核心接口")])]),e._v(" "),v("ul",[v("li",[e._v("IClientConfig")]),e._v(" "),v("li",[e._v("IRule")]),e._v(" "),v("li",[e._v("IPing")]),e._v(" "),v("li",[e._v("ServerList"),v("Server")],1),e._v(" "),v("li",[e._v("ServerListFilter"),v("Server")],1),e._v(" "),v("li",[e._v("ILoadBalancer")]),e._v(" "),v("li",[e._v("ServerListUpdater")])]),e._v(" "),v("p",[v("strong",[e._v("工作原理涉及到几个主要类和注解")])]),e._v(" "),v("ul",[v("li",[e._v("RestTempalte")]),e._v(" "),v("li",[e._v("@LoadBalanced")]),e._v(" "),v("li",[e._v("LoadBalancerClient")]),e._v(" "),v("li",[v("ul",[v("li",[e._v("execute()")])])]),e._v(" "),v("li",[v("ul",[v("li",[e._v("reconstructURI()")])])]),e._v(" "),v("li",[e._v("ServiceInstanceChooser")]),e._v(" "),v("li",[v("ul",[v("li",[e._v("chose(service)")])])])]),e._v(" "),v("p",[v("strong",[e._v("重点类")]),e._v(" "),v("strong",[e._v("LoadBalancerAutoConfiguration")])]),e._v(" "),v("ul",[v("li",[e._v("必须有RestTemplate")]),e._v(" "),v("li",[e._v("必须初始化LoadBalancerClient")]),e._v(" "),v("li",[e._v("LoadBalancerRequestFactory->LoadBalancerRequest")]),e._v(" "),v("li",[e._v("LoadBalancerInterceptorConfig->LoadBalancerInterceptor、->RestTemplateCustomizer")]),e._v(" "),v("li",[e._v("LoadBalancerInterceptor-拦截每次请求进行绑定到Ribbon负载均衡生命周期")]),e._v(" "),v("li",[e._v("RestTemplateCustomizer为每个RestTemplate绑定LoadBalancerInterceptor")]),e._v(" "),v("li",[e._v("LoadBalancerInterceptor.execute()方法")]),e._v(" "),v("li",[e._v("LoadBalancerClient-唯一实现类RibbonLoadBalancerClient->getServer（）-> choseServer（）-> rule.chose()方法，获取服务实现负载策略选择\n"),v("strong",[e._v("总结")])])]),e._v(" "),v("blockquote",[v("p",[e._v("Interceptor拦截请求->然后LoadBalancerClient选择服务->由rule.chose（）根据策略选择对应的服务")])]),e._v(" "),v("p",[v("strong",[e._v("负载均衡策略源码导读")])]),e._v(" "),v("ul",[v("li",[e._v("IRule")]),e._v(" "),v("li",[v("ul",[v("li",[e._v("choose(Object key)")])])]),e._v(" "),v("li",[v("ul",[v("li",[e._v("setLoadBalancer(ILoadBalancer ib)")])])]),e._v(" "),v("li",[v("ul",[v("li",[e._v("getLoadBalancer()")])])])])])}),[],!1,null,null,null);v.default=t.exports}}]);