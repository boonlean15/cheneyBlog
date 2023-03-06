# spring cloud gateway

## spring cloud gateway概述
**什么是spring cloud gateway**
> spring官方开发的网关，旨在为微服务架构提供简单，有效且统一的Api路由管理方式。基于filter还提供了，安全，监控，埋点，限流的功能

**出现原因**
> 网关提供api全托管服务，辅助企业管理大规模的api，降低管理成本和安全风险。包括：协议适配，协议转发，安全策略，防刷，流量和监控日志等。
* 网关的核心是filter和filter chain

**核心概念**
* 路由：网关最基础的部分，路由信息由一个ID，一个目的url，一组断言工厂，一组filter组成。如果断言为真，则说明请求的url和配置的路由匹配
* 断言：java8断言函数。gateway是spring的serverWebExchange，允许匹配request中的所有信息，如请求头和参数等。
* filter：标准的webfilter，gateway中filter分为两种类型，gateway filter和global filter。

## 工作原理
client -> httpWebHandlerAdapter -> DispatcherHandler -> RoutePredicateHandlerMapping -> lookupRoute -> 
filterWebHandler -> pre Filter -> proxy service -> post Filter

gateway client 发起请求 -> httpWebHandlerAdapter (组装网关上下文) -> DispatcherHandler (循环遍历mapping，获取handler)
->  RoutePredicateHandlerMapping(匹配路由信息，断言是否可用) -> lookupRoute -> filterWebHandler(创建过滤器链，调用过滤器) -> 
pre filter -> proxy service -> post filter

## 入门案例
**协议适配和协议转发是gateway最基础的功能**
> 配置依赖-> 添加入口程序 -> 通过代码或者yml配置 Path路由断言工厂实现url直接转发
```yml
spring:
  cloud:
    gateway:
      routes: #当访问http://localhost:8080/baidu,直接转发到https://www.baidu.com/
      - id: baidu_route
        uri: http://baidu.com:80/
        predicates:
        - Path=/baidu
      - id: remoteaddr_route
        uri: http://baidu.com
        predicates:
          - RemoteAddr=127.0.0.1
      - id: between_route
        uri: http://xujin.org
        predicates:
          - name: Between
            args:
              datetime1: 2018-03-15T00:02:48.513+08:00[Asia/Shanghai]
              datetime2: 2018-03-15T02:02:48.516+08:00[Asia/Shanghai]
```

## spring cloud gateway 路由断言
> gateway的路由匹配(routePredicateHandlerMapping)是以spring webflux的handler mapping为基础实现的。gateway也是由很多路由断言工参组成的
> 。request进来，gateway的路由断言工厂，根据配置的路由规则进行断言匹配。成功则进入下一步，失败则返回错误信息

**After路由断言工厂**
* after route predicate factory 取一个UTC时间格式的时间参数，请求进来的当前时间在配置的UTC时间之后，则匹配成功，否则失败

**before路由断言工厂**
* before跟after正好相反，判断的是时间是否在配置时间之前，是则路由匹配

**between路由断言工厂**
* between判断的是时间是否在配置的时间范围内，是则路由匹配
> after、before、between三个路由断言工厂可归为一类，以时间作为断言规则
```java
@SpringBootApplication
public class SCGatewayApplication {

  @Bean
  public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    //生成比当前时间早一个小时的UTC时间
    ZonedDateTime minusTime = LocalDateTime.now().minusHours(1).atZone(ZoneId.systemDefault());
    return builder.routes()
            .route("after_route", r -> r.after(minusTime)
                    .uri("http://baidu.com"))
            .build();
  }
  public static void main(String[] args) {
    SpringApplication.run(SCGatewayApplication.class, args);
  }
}
/**
 * 生成UTC时间
 */
public class UtcTimeUtil {

  public static void main(String[] args) {
    ZonedDateTime time=  ZonedDateTime.now();
    System.out.println("zonedDateTime:"+time);

    String  maxTime=ZonedDateTime.now().plusHours(1).format(DateTimeFormatter.ISO_ZONED_DATE_TIME);
    System.out.println("maxTime："+maxTime);

    String  minTime=ZonedDateTime.now().minusHours(1).format(DateTimeFormatter.ISO_ZONED_DATE_TIME);
    System.out.println("minTime:"+minTime);


    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    String str=time.format(formatter);
    System.out.println(str);
  }

}
```

**cookie路由断言工厂**
* 断言工厂会取两个参数，cookie名称对应的key和value，请求中携带的cookie和cookie断言工厂配置的一致，则匹配成功

**header路由断言工厂**
* 根据配置的路由header信息进行断言匹配路由

**Host路由断言工厂**
* 根据配置的路由Host信息进行断言匹配路由

**Method路由断言工厂**
* 根据配置的路由Method信息对请求方法是GET或者POST进行断言匹配路由

**query路由断言工厂**
* 根据配置的路由请求参数query进行断言匹配路由

**RemoteAddr路由断言工厂**
* 配置一个ipv4或ipv6网段的字符串或ip，请求的ip地址在网段内或ip相同，则匹配成功
> cookie、header、host，method、query可用归为一类，即与客户端的信息相关，要么是header(cookie)，要么是url里面的信息或方法类型，参数
```java
@SpringBootApplication
public class SpringCloudGatewayApplication {

  @Bean
  public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
            .route("header_route", r -> r.header("X-Request-Id", "xujin")
                    .uri("http://localhost:8071/test/head"))
            .build();
    return builder.routes()
            .route("cookie_route", r -> r.cookie("chocolate", "ch.p")
                    .uri("http://localhost:8071/test/cookie"))
            .build();
    return builder.routes()
            .route("host_route", r -> r.host("**.baidu.com:8080")
                    .uri("http://jd.com"))
            .build();
    return builder.routes()
            .route("method_route", r -> r.method("GET")
                    .uri("http://jd.com"))
            .build();
    return builder.routes()
            .route("query_route", r -> r.query("foo","baz")
                    .uri("http://baidu.com"))
            .build();
    return builder.routes()
            .route("remoteaddr_route", r -> r.remoteAddr("127.0.0.1")
                    .uri("http://baidu.com"))
            .build();
  }
  public static void main(String[] args) {
    SpringApplication.run(SpringCloudGatewayApplication.class, args);
  }
}
```

## spring cloud gateway 内置filter
> gateway内置了很多路由过滤器，可自己根据实际应用场景定制自己的路由过滤器工厂。路由过滤器允许以某种方式修改进来的http请求和http响应，主要作用于特定的
> 路由。gateway提供了很多过滤器工厂，有二十多种，主要可归类为，header、parameter、path、status、redirect、hytrix、rateLimiter

* AddRequestHeader过滤器工厂 对匹配上的请求加上header
* AddRequestParameter 对匹配上的请求加上param
* RewritePath过滤器 替换zuul的stripPrefix功能，去掉前缀
* AddResponseHeader 网关返回的响应添加header
* StripPrefix过滤器 对请求url前缀进行处理 StripPrefixGatewayFilterFactory
```java
@SpringBootApplication
public class SpringCloudGatewayApplication {

	@Bean
	public RouteLocator testRouteLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("add_request_header_route", r ->
						r.path("/test").filters(f -> f.addRequestHeader("X-Request-Acme", "ValueB"))
								.uri("http://localhost:8071/test/head"))
				.build();
        return builder.routes()
                .route("add_request_parameter_route", r ->
                        r.path("/addRequestParameter").filters(f -> f.addRequestParameter("example", "ValueB"))
                                .uri("http://localhost:8071/test/addRequestParameter"))
                .build();
        return builder.routes()
                .route("rewritepath_route", r ->
                        r.path("/foo/**").filters(f -> f.rewritePath("/foo/(?<segment>.*)","/$\\{segment}"))
                                .uri("http://www.baidu.com"))
                .build();//访问http://localhost:8080/foo/cache/sethelp/help.html
      // 相当于把前缀去掉，直接访问http://www.baidu.com/cache/sethelp/help.html
        return builder.routes()
                .route("add_request_header_route", r ->
                        r.path("/test").filters(f -> f.addResponseHeader("X-Response-Foo", "Bar"))
                                .uri("http://www.baidu.com"))
                .build();
	}
	public static void main(String[] args) {
		SpringApplication.run(SpringCloudGatewayApplication.class, args);
	}
}
```
* PrefixPathGatewayFilterFactory 用于增加前缀
```yml
spring:
  cloud:
    gateway:
      routes:
      - id: baidu_route
        uri: http://www.baidu.com
        predicates:
        - Path=/baidu/test/**
        filters:
        - StripPrefix=2
```
* **Retry过滤器 出现异常或网络抖动，对请求进行重试**
```java
@SpringBootApplication
public class CH1736GatewayApplication {

	@Bean
	public RouteLocator retryRouteLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("retry_route", r -> r.path("/test/retry")
						.filters(f ->f.retry(config -> config.setRetries(2).setStatuses(HttpStatus.INTERNAL_SERVER_ERROR)))
						.uri("http://localhost:8071/retry?key=abc&count=2"))
				.build();
	}

	public static void main(String[] args) {
		SpringApplication.run(CH1736GatewayApplication.class, args);
	}
	//service的方法测试
    @GetMapping("/retry")
    public String testRetryByException(@RequestParam("key") String key, @RequestParam(name = "count") int count) {
      AtomicInteger num = map.computeIfAbsent(key, s -> new AtomicInteger());
      //对请求或重试次数计数
      int i = num.incrementAndGet();
      log.warn("重试次数: "+i);
      //计数i小于重试次数2抛出异常，让Spring Cloud Gateway进行重试
      if (i < count) {
        throw new RuntimeException("Deal with failure, please try again!");
      }
      //当重试两次时候，清空计数，返回重试两次成功
      map.clear();
      return "重试"+count+"次成功！";
    }
}
```
* hystrix过滤器 服务降级，友好提示
> 例子：当访问的服务不可用，gateway通过hystrix返回了友好提示信息
```java
@RestController
public class FallbackController {

  @GetMapping("/fallback")
  public String fallback() {
    return "Spring Cloud Gateway Fallback！";
  }
  //服务的方法
  @GetMapping("/test/Hystrix")
  public String index(@RequestParam("isSleep") boolean isSleep) throws InterruptedException {
    log.info("issleep is " + isSleep);
    //isSleep为true开始睡眠，睡眠时间大于Gateway中的fallback设置的时间
    if (isSleep) {
      TimeUnit.MINUTES.sleep(10);
    }
    return "No Sleep";
  }
}
```
```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: prefix_route
        uri: http://localhost:8071/test/Hystrix?isSleep=true
        predicates:
        - Path=/test/Hystrix
        filters:
        - name: Hystrix # Hystrix Filter的名称
          args: # Hystrix配置参数
            name: fallbackcmd #HystrixCommand的名字
            fallbackUri: forward:/fallback #fallback对应的uri
```

## spring cloud gateway基于服务发现的路由规则
**gateway的服务发现路由概述**
> gateway考虑从zuul迁移到gateway到兼容性和迁移成本。服务发现路由规则和zuul类似，访问方式：http://http://Gateway_Host:Gateway_Port/大写的serviceId/**

**在不同注册中心下差异如下**
*  eureka 大写的serviceId 可通过配置使用小写的serviceId：
> spring.cloud.gateway.discovery.locator.lowerCaseServiceId = true
*  zookeeper 小写的serviceId
*  consul 小写的serviceId

**服务路由规则案例**
* eureak 注册中心 简单的作为注册中心
* gateway 网关 配置spring.cloud.gateway.discovery.locator.enable=true 配置与服务发现组件一起使用，lowerCaseServiceId小写服务名
* consumer 消费者 通过feign调用provider的接口
* provider 服务提供者 提供controller接口供调用

## gateway filter 和 global filter
**gateway filter**
> 从web filter中复制过来，相当于一个filter过滤器，可对访问的url过滤，进行切面处理

**global filter**
> 是一个全局filter，作用于所有的路由

**gateway filter 和 global filter的区别**
> 路由范围：global filter作用于全局，gateway filter作用于单个或一组路由上。
> 源码：gateway filter继承ShortcutConfigurable，global filter没有任何继承

**自定义Gateway Filter**
1. 创建自定义的Gateway Filter CustomGatewayFilter 实现自GatewayFilter和Ordered，重写filter()方法
2. 把CustomGatewayFilter注入bean实现配置到路由上
```java
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder){
return builder.routes().route(r -> r.path("/test").filters(f -> f.filter(new CustomGatewayFilter()))
    .uri("http://localhost:8071/customFilter?name=cheney")
    .order(0)
    .id("custom_filter")).build();
}
```

**自定义global filter**
* 创建自定义的GolbalFilter AuthSignatureFilter 实现自GolbalFilter和Ordered，重写filter方法。需要添加注解@Component即可，此全局FIlter生效

## Gateway实战

## Gateway权重路由
当灰度发布时，比如实现金丝雀测试
```yml
spring:
  application:
    name: ch18-3-gateway
  cloud:
    gateway:
      routes:
      - id: service1_v1
        uri: http://localhost:8081/v1
        predicates:
        - Path=/test
        - Weight=service1, 95
      - id: service1_v2
        uri: http://localhost:8081/v2
        predicates:
        - Path=/test
        - Weight=service1, 5
```
## gateway使用https
> 当全站需要https安全时，网关需要支持https。(常规的做法是nginx配置SSL证书)
* 只需要将生成的https证书放到gateway的类路径下即可
1. 生成ssl证书，并放到gateway项目的resource目录下
2. 配置yml文件
```yaml 
server:
  ssl:
    key-alias: spring
    enabled: true
    key-password: spring
    key-store: classpath:selfsigned.jks
    key-store-type: JKS
    key-store-provider: SUN
    key-store-password: spring
```
3. LoadBalancerClientFilter的filter方法的loadbalance对http请求进行封装，如gateway进来的是https，则用https封装，是http则用http封装，并且为预留修改的接口。
4. 自定义HttpsToHttpFilter，实现自globalFilter，实现把Https转为http
```java
@Component
public class HttpsToHttpFilter implements GlobalFilter, Ordered {

    private static final int HTTPS_TO_HTTP_FILTER_ORDER = 10099;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        URI originalUri = exchange.getRequest().getURI();
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpRequest.Builder mutate = request.mutate();
        String forwardedUri = request.getURI().toString();
        if (forwardedUri != null && forwardedUri.startsWith("https")) {
            try {
                URI mutatedUri = new URI("http",
                        originalUri.getUserInfo(),
                        originalUri.getHost(),
                        originalUri.getPort(),
                        originalUri.getPath(),
                        originalUri.getQuery(),
                        originalUri.getFragment());
                mutate.uri(mutatedUri);
            } catch (Exception e) {
                throw new IllegalStateException(e.getMessage(), e);
            }
        }
        ServerHttpRequest build = mutate.build();
        return chain.filter(exchange.mutate().request(build).build());
    }

    /**
     * 由于LoadBalancerClientFilter的order是10100，
     * 要在LoadBalancerClientFilter执行之前将Https修改为Http，需要设置
     * order为10099
     * @return
     */
    @Override
    public int getOrder() {
        return HTTPS_TO_HTTP_FILTER_ORDER;
    }
}
```

**gateway集成swagger**
1. 添加依赖
2. 编写swaggerProvider，以获取SwaggerResource，因为Swagger不支持WebFlux项目
3. 创建Swagger-Resource端点 因为没有在Gateway配置SwaggerConfig，但是运行Swagger-Ui需要依赖一些接口
4. 创建SwaggerHeaderFilter，因为Gateway转发的时候，没有把X- Forward-Prefix的header添加到Reques上，需要用这个Filter添加这个Header
5. 配置Gateway路由信息
```yml
spring:
  application:
    name: sc-gateway
  cloud:
      gateway:
        locator:
          enabled: true
        routes:
        - id: sc-service
          uri: lb://sc-service
          predicates:
          - Path=/admin/**
          filters:
          - GwSwaggerHeaderFilter
          - StripPrefix=1
```
6. 然后service工程，则正常的添加依赖，并且配置SwaggerConfig，和Swagger相关Api

## Gateway限流

### 自定义过滤器实现限流 - Bucket4J
1. 添加依赖
   ```yml
   <dependencies>
        <!-- Spring Cloud Gateway的依赖-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <!-- Bucket4j限流依赖-->
        <dependency>
            <groupId>com.github.vladimir-bukhtoyarov</groupId>
            <artifactId>bucket4j-core</artifactId>
            <version>4.0.0</version>
        </dependency>
    </dependencies>
   ```
2. 自定义过滤器对特定资源进行限流
```java
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 自定义过滤器进行限流
 * @author xujin
 */
public class GatewayRateLimitFilterByIp implements GatewayFilter, Ordered {

    private final Logger log = LoggerFactory.getLogger(GatewayRateLimitFilterByIp.class);

    /**
     * 单机网关限流用一个ConcurrentHashMap来存储 bucket，
     * 如果是分布式集群限流的话，可以采用 Redis等分布式解决方案
     */
    private static final Map<String, Bucket> LOCAL_CACHE = new ConcurrentHashMap<>();

    /**
     * 桶的最大容量，即能装载 Token 的最大数量
     */
    int capacity;
    /**
     * 每次 Token 补充量
     */
    int refillTokens;
    /**
     *补充 Token 的时间间隔
     */
    Duration refillDuration;

    public GatewayRateLimitFilterByIp() {
    }

    public GatewayRateLimitFilterByIp(int capacity, int refillTokens, Duration refillDuration) {
        this.capacity = capacity;
        this.refillTokens = refillTokens;
        this.refillDuration = refillDuration;
    }

    private Bucket createNewBucket() {
        Refill refill = Refill.of(refillTokens, refillDuration);
        Bandwidth limit = Bandwidth.classic(capacity, refill);
        return Bucket4j.builder().addLimit(limit).build();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String ip = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
        Bucket bucket = LOCAL_CACHE.computeIfAbsent(ip, k -> createNewBucket());
        log.debug("IP:{} ,令牌通可用的Token数量:{} " ,ip,bucket.getAvailableTokens());
        if (bucket.tryConsume(1)) {
            return chain.filter(exchange);
        } else {
           //当可用的令牌书为0是，进行限流返回429状态码
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -1000;
    }
}
```
3. java流式api的方式配置路由规则
```java
@SpringBootApplication
public class GatewayApplication {
    @Bean
    public RouteLocator customerRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route(r -> r.path("/test/rateLimit")
                        .filters(f -> f.filter(new GatewayRateLimitFilterByIp(10,1,Duration.ofSeconds(1))))
                        .uri("http://localhost:8000/hello/rateLimit")
                        .id("rateLimit_route")
                ).build();
    }
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

### Gateway内置工厂过滤器实现限流 RequestRateLimiterGatewayFilterFactory
使用名为request_rate_limiter.lua lua脚本实现限流
1. 添加依赖
```yml
<dependencies>
    <!-- Spring Cloud Gateway的依赖-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
    </dependency>
</dependencies>
```
2. gateway相关限流配置
```yml
spring:
  application:
    name: ch18-6-1-gateway
  redis:
      host: localhost
      port: 6379
  cloud:
    gateway:
      routes:
        - id: rateLimit_route
          uri: http://localhost:8000/hello/rateLimit
          order: 0
          predicates:
            - Path=/test/rateLimit
          filters:
            #filter名称必须是RequestRateLimiter
            - name: RequestRateLimiter
              args:
                #使用SpEL按名称引用bean
                key-resolver: "#{@remoteAddrKeyResolver}"
                #允许用户每秒处理多少个请求
                redis-rate-limiter.replenishRate: 1
                #令牌桶的容量，允许在一秒钟内完成的最大请求数
                redis-rate-limiter.burstCapacity: 5
```
3. 编写key-resolver对应的remoteAddrKeyResolver
```java
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public class RemoteAddrKeyResolver implements KeyResolver {
    public static final String BEAN_NAME = "remoteAddrKeyResolver";

    @Override
    public Mono<String> resolve(ServerWebExchange exchange) {
        return Mono.just(exchange.getRequest().getRemoteAddress().getAddress().getHostAddress());
    }
}
```
4. key对应的解析器配置加载到spring容器
```java
@SpringBootApplication
public class GatewayApplication {
    @Bean(name = RemoteAddrKeyResolver.BEAN_NAME)
    public RemoteAddrKeyResolver remoteAddrKeyResolver() {
        return new RemoteAddrKeyResolver();
    }
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

### 基于CPU使用率进行限流
1. 添加依赖
```yml
<dependencies>
    <!-- Spring Cloud Gateway的依赖-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
```
2. 自定义过滤器并开启基于CPU使用情况的限流
```java
/**
 * 根据CPU的使用情况限流
 * @author: xujin
 **/
@Component
public class GatewayRateLimitFilterByCpu implements GatewayFilter, Ordered {

    private final Logger log = LoggerFactory.getLogger(GatewayRateLimitFilterByCpu.class);

    @Autowired
    private MetricsEndpoint metricsEndpoint;

    private static final String METRIC_NAME = "system.cpu.usage";

    private static final double MAX_USAGE = 0.50D;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        //获取网关所在机器的CPU使用情况
        Double systemCpuUsage = metricsEndpoint.metric(METRIC_NAME, null)
                .getMeasurements()
                .stream()
                .filter(Objects::nonNull)
                .findFirst()
                .map(MetricsEndpoint.Sample::getValue)
                .filter(Double::isFinite)
                .orElse(0.0D);

        boolean isOpenRateLimit = systemCpuUsage >MAX_USAGE;
        log.debug("system.cpu.usage: {}, isOpenRateLimit:{} ",systemCpuUsage , isOpenRateLimit);
        if (isOpenRateLimit) {
            //当CPU的使用超过设置的最大阀值开启限流
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return exchange.getResponse().setComplete();
        } else {
            return chain.filter(exchange);
        }
    }
    @Override
    public int getOrder() {
        return 0;
    }
}
```
3. java流式api配置作用于某个路由
```java
@SpringBootApplication
public class GatewayApplication {

    @Autowired
    private GatewayRateLimitFilterByCpu gatewayRateLimitFilterByCpu;

    @Bean
    public RouteLocator customerRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route(r -> r.path("/test/rateLimit")
                        .filters(f -> f.filter(gatewayRateLimitFilterByCpu))
                        .uri("http://localhost:8000/hello/rateLimit")
                        .id("rateLimit_route")
                ).build();
    }
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

## gateway动态路由

* 单机版动态路由
  1. 根据springcloud gateway的路由模型定义数据传输模型，创建GatewayFilterDefinition、GatewayPredicateDefinition、GatewayRouteDefinition
     > 主要属性，filter和predicate是name和规则args，route是id，uri，order和filter、predicate的集合，即路由断言集合配置、路由过滤器集合配置
  2. 编写动态路由实现类，实现自ApplicationEventPublisherWare接口，注入RouteDefinitionWriter和设置publisher
     > 添加，删除，更新的方法，通过RouteDefinitionWriter添加、更新、删除。添加和更新比删除多了个publisher.publish发布订阅
  3. 添加对应的RestController提供接口，供调用
* 集群版动态路由
  > RouteDefinitionWriter的实现类是InMemoryRouteDefinitionRepository，RouteDefinitionRepository继承了RouteDefinitionWriter。
  > 可以通过两种方式实现集群下动态路由：RouteDefinitionWriter和RouteDefinitionRepository。
  > **推荐实现RouteDefinitionRepository接口，从数据库或者配置中心获取路由进行动态配置**
  1. 示例：通过nacos配置中心获取路由，然后动态配置。这里是实现自ApplicationRunner，在项目启动时进行了路由配置
```java
@Component
@Slf4j
public class NacosGatewayConfigListener implements ApplicationRunner {
    @Autowired
    private DynamicRouteServiceImpl dynamicRouteServiceImpl;
    private static final String configName = "gateway-config.yml";
    @Autowired
    private NacosConfigManager nacosConfigManager;
    @Override
    public void run(ApplicationArguments args) throws Exception {
        //添加信息到路由
        log.info("准备添加路由------------》");
        ConfigService configService = nacosConfigManager.getConfigService();
        String nacosGroup = nacosConfigManager.getNacosConfigProperties().getGroup();
        String config = configService.getConfig(configName, nacosGroup, 5000);
        List<GatewayRouteDefinition>  arr = JSONArray.parseArray(config, GatewayRouteDefinition.class);
        List<GatewayRouteDefinition>  arrUpdate = new ArrayList<>();
        for(GatewayRouteDefinition item : arr){
            if(item.getStatus().intValue()!=4){
                RouteDefinition route = assembleRouteDefinition(item);
                dynamicRouteServiceImpl.add(route);
                item.setStatus(3);
                arrUpdate.add(item);
            }
        }
        dynamicRouteServiceImpl.refreshRoute();
        configService.publishConfig(configName, nacosGroup,JSONArray.toJSONString(arrUpdate));
        log.info("添加路由完毕-------------》");
        //注册监听
        configService.addListener(configName, nacosGroup, new Listener() {
            @Override
            public void receiveConfigInfo(String configInfo) {
                List<GatewayRouteDefinition>  arr = JSONArray.parseArray(configInfo, GatewayRouteDefinition.class);
                Boolean isUpate =false;
                List<GatewayRouteDefinition>  arrUpdate = new ArrayList<>();
                for(GatewayRouteDefinition item : arr){
                    if(item.getStatus()==1){
                        //新增
                        RouteDefinition route = assembleRouteDefinition(item);
                        dynamicRouteServiceImpl.add(route);
                        item.setStatus(3);
                        isUpate =true;
                    }else if(item.getStatus()==2){
                        //修改
                        RouteDefinition route = assembleRouteDefinition(item);
                        dynamicRouteServiceImpl.update(route);
                        item.setStatus(3);
                        isUpate =true;
                    }else if(item.getStatus()==4){
                        //删除
                        dynamicRouteServiceImpl.delete(item.getId());
                        isUpate =true;
                    }

                    if(item.getStatus()!=4){
                        arrUpdate.add(item);
                    }
                }
                try {
                    if(isUpate){
                        dynamicRouteServiceImpl.refreshRoute();
                        configService.publishConfig(configName, nacosGroup,JSONArray.toJSONString(arrUpdate));
                    }
                } catch (NacosException e) {
                    log.error("",e);
                }
            }
            @Override
            public Executor getExecutor() {
                return null;
            }
        });
    }
}
```  

## Gateway 源码

### Gateway的处理流程
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/springcloud/gateway-process.jpg" alt="jpg">
* 2.0版本 流程见图
  > HttpWebHandlerAdapter -> DispatcherHandler -> RoutePredicateHandlerMapping -> FilteringWebHandler
  * HttpWebHandlerAdapter： 组装网关上下文
  * DispatcherHandler： 分发处理器，分发请求到对应的处理器
  * RoutePredicateHandlerMapping： 路由断言处理器，路由的查找，返回对应的WebHandler
  * FilteringWebHandler：创建过滤器链，调用filter处理请求
  
* 4.0版本 流程
  > Gateway HandlerMapping -> Gateway Web Handler -> FilteringWebHandler
  * GatewayHandlerMapping: 路由断言，路由查找，返回对应的WebHandler
  * GatewayWebHandler: 创建过滤器链，调用filter处理请求

### Gateway中的ServerWebExchange分析
> zuul或Gateway或自研网关中间件，都会对request和response进行组装，转换为网关运行的上下文。Gateway的网关上下文是ServerWebExchange。
> 遇到问题无法解决时，了解Gateway执行的生命周期相当重要，特别是了解从哪个入口开始处理。

* 入口HttpServerRequest和HttpServerResponse转换
  > Gateway的请求入口在ReactorHttpHandlerAdapter#apply方法中，把接收到的HttpServerRequest和HttpServerResponse包装转换为
  > ReactorServerHttpRequest和ReactorServerHttpResponse
* 构建Gateway的上下文ServerWebExchange
  > 在HttpWebHandlerAdapter中#Handle方法，通过creatExchange方法将ServerHttpRequest和ServerHttpResponse构建成网关上下文
  > ServerWebExchange。WebHandlerDecorator的getDelegate方法通过委托的方式获取一系列需要处理的WebHandler。

### DispatcherHandler源码分析
> DispatcherHandler实现了WebHandler和ApplicationContextAware接口，http请求的中央分发处理器。把请求分发给已经注册的处理器程序。
1. 校验HandlerMapping
2. 遍历Mapping获取Mapping对应的Handler(找到gateway对应的RoutePredicateHandlerMapping)，
   并通过RoutePredicateHandlerMapping获取Handler(FilteringWebHandler)
3. 通过Handler对应的HandlerAdapter对Handler进行调用(Gateway使用SimpleHandlerAdapter)，即FilteringWebHandler
   和SimpleHandlerAdapter对应   
 
### RoutePredicateHandlerMapping源码分析
1. 执行顺序是先通过路由定位器获取全部路由
2. 然后通过路由断言过滤掉不符合的路由信息
3. 之后将路由信息设置到网关上下文中
4. 最后返回Gateway的WebHandler， 即FilteringWebHandler

> GatewayWebFluxEndpoint提供HTTP api，不需要经过网关，是通过RequestMappingHandlerMapping进行请求匹配处理，它的执行顺序在
> RoutePredicateHandlerMapping之前执行，所以设置RoutePredicateHandlerMapping的order为0.

### FilteringWebHandler源码分析
1. 构建一个包含全局过滤器的集合
2. 获取上下文中的路由信息，将路由信息里面的过滤器添加到集合中
3. 对过滤器进行排序
4. 通过过滤器集合组装Filter链并调用Gateway的默认Filter链
5. 通过过滤器处理请求并转发到代理服务中

### 执行Filter源码分析
1. 执行进去Filter链，在FilteringWebHandler的最后，通过过滤器处理请求并转发到代理服务中。进入了filter方法
2. 执行filter链，通过点击在FilteringWebHandler的最后的filter方法，查看执行filter链逻辑
3. GatewayFilter委托给GlobalFilter执行，FilteringWebHandler#GatewayFitlerAdapter的代码中可看到，
   GatewayFilter交给了GlobalFilter去执行































