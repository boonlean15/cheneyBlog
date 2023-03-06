# spring cloud 认证和鉴权

## 微服务安全与权限
**权限问题一直是核心问题之一**
> 服务拆分后，服务之间调用的认证和授权都需要进行重新的考虑。

* 流程
> 发送请求-> 负载均衡软件 -> 微服务网关 -> 网关进行用户认证 -> 携带用户本身信息到后台微服务 -> 微服务进行相关鉴权

## spring cloud 认证和鉴权方案
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

## spring cloud 认证和鉴权案例
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
