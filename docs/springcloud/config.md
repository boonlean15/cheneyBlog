# spring cloud config

## spring cloud config概述和入门
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

## conig实战

## GIT配置

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

## springcloud config 关系型数据库配置
**关系型数据库配置中心实现 mysql**
* **原理** config-client请求config-server，config-server访问mysql数据库获取配置，返回给config-client

**非关系型数据库配置中心实现 mongoDB**
* **原理** config-client请求config-server，config-server访问mongoDB获取配置，返回给config-client
> @EnableMongoConfigServer **db做了界面化的配置和管理，提交配置成功到db时，调用config-server到刷新接口，即可实现git到webHook一样的提交绑定功能**

## springcloud config使用技能
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
## Springcloud config 功能扩展
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

## 高可用部分
* 客户端高可用 - 主要体现在客户端缓存本地文件，当服务端不可用时，仍然可以使用本地配置
* 服务端高可用 - 主要是config server 集群，和ribbon负载均衡体现服务端高可用

## spring cloud config 和 Apollo的使用
* 主要是Apollo使用了eureka作为注册中心，使得两者可以无缝衔接
* Apollo有Admin service，config service两个都是多实例、无状态部署，然后在eureka上套了一层meta server
* config service服务对象上apollo客户端，admin service服务对象上apollo portal管理界面
* client通过meta server获取config service服务列表(ip+port)，然后通过ip+port进行访问，同时client端会进行loadbalance，错误重试
* portal通过meta server获取admin service服务列表(ip+port)，然后通过ip+port访问，同时portal端会loadbalance和错误重试
