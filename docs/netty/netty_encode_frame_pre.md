# 预置的ChannelHandler和编解码器

- 通过ssl/tls保护netty应用程序
- 构建基于netty的http/https应用程序
- 处理空闲的连接和超时
- 解码基于分隔符的协议和基于长度的协议
- 写大型数据

> netty内置了很多编解码器和处理器，减少了繁琐的事务上花费的时间和精力

## 通过ssl/tls保护netty应用程序

ssl/tls层叠在其他协议之上，用以实现数据安全。为了支持ssl/tls，java
提供了javax.net.ssl包，它的SSLContext和SSLEngine类使得实现解密和加密相当简单直接。

**netty通过SslHandler的ChannelHandler实现利用了这个API，其中SslHandler在内部使用SSLEngine完成实际工作**

[ssl/tls/http/https/ca等概念](https://wangsong.blog.csdn.net/article/details/129724866?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-129724866-blog-128256538.235%5Ev38%5Epc_relevant_anti_vip_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-129724866-blog-128256538.235%5Ev38%5Epc_relevant_anti_vip_base&utm_relevant_index=5)

### SslHandler

**SslHandler数据流**

> SslHandler拦截加密入站数据 -> 通过SslHandler解密 -> INBOUD入站端 -> 原始的出站数据 -> 通过SslHandler加密 -> OUTBOUND出站端

示例：
```java
public class SslChannelInitializer extends ChannelInitializer<Channel>{
　　private final SslContext context; 
　　private final boolean startTls;

　　public SslChannelInitializer(SslContext context, boolean startTls) {　 // 如果设置为true，第一个写入的消息将不会被加密（客户端应该设置为true） 传入要使用的SslContext
　　　　this.context = context;
　　　　this.startTls = startTls;
　　}

　　@Override
　　protected void initChannel(Channel ch) throws Exception {
　　　　SSLEngine engine = context.newEngine(ch.alloc());   // 对于每个SslHandler 实例，都使用Channel 的ByteBufAllocator 从SslContext 获取一个新的SSLEngine
　　　　ch.pipeline().addFirst("ssl",
　　　　　　new SslHandler(engine, startTls));   // 将SslHandler 作为第一个ChannelHandler 添加到ChannelPipeline 中 
　　}
}
//通过配置修改它的行为
setHandshakeTimeout(long,TimeUnit);//设置和获取超时时间，超时之后，握手ChannelFuture将会被通知失败
setHandshakeTimeoutMillis(long);
getHandshakeTimeoutMillis();

setCloseNotifyTimeout(long,TimeUnit);//设置和获取超时时间，超时之后，将会触发一个关闭通知并关闭连接。将会通知该ChannelFuture失败
setCloseNotifyTimeoutMillis(long);
getCloseNotifyTimeoutMillis();
//握手完成后通知
handshakeFuture();//返回一个握手完成后得到通知的CHannelFuture。如果握手前已经完成，则返回一个包含了先前的握手结果的ChannelFutrue

close();//发送close_notify以请求关闭并销毁底层的SslEngine
close(ChannelPromise);
close(ChannelHandlerContext,ChannelPromise);

```

## 构建基于Netty的Http/Https应用程序

## Http编码器 解码器 编解码器

### http请求和响应组成部分

- 所有类型的http消息(FullHttpRequest、LastHttpContent、HttpRequest、HttpContent)都实现了HttpObject接口
- 请求行-请求头-空行-请求体
> 第一部分包含http头部信息，httpcontent包含了数据，后面可能还跟着一个或多个Httpcontent，LastHttpContent标记Http请求的结束，可能还包含尾随的Http头部信息

----------------------FullHttpRequest-----------------------
---HttpRequest---HttpContent---HttpContent---LasthttpContent

----------------------FullHttpResponse-----------------------
---HttpResponse---HttpContent---HttpContent---LasthttpContent

- 处理和生成这些消息的Http编、解码器

### 将正确的ChannelHandler添加到ChannelPipeline中，实现支持Http
```java
HttpRequestEncoder//将HttpRequest、HttpContent、LastHttpContent消息编码为字节
HttpResponseEncoder//将HttpResponse、HttpContent、LastHttpContent消息编码为字节
HttpRequestDecoder、HttpResponseDecoder//则为解码   

public class HttpPipelineInitializer extends ChannelInitializer<Channel>{
    private final boolean client;
    public HttpPipelineInitializer(boolean client){
        this.client = client;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        if(client){//客户端，添加HttpResponseDecoder处理来自服务器的响应、以此类推
            pipeline.addLast("decoder", new HttpResponseDecoder());
            pipeline.addLast("encoder", new HttpRequestEncoder());
        } else {
            pipeline.addLast("decoder", new HttpRequestDecoder());
            pipeline.addLast("encoder", new HttpResponseEncoder())
        }
    }
}
```

## 聚合Http消息

ChannelHandler添加到ChannelPipeline后，便可处理不同类型的HttpObject消息了。由于Http消息由多部分组成，需要聚合他们形成完整的消息。

### Http聚合器

- 将多个消息部分合并为FullHttpRequest、FullHttpResponse

```java
public class HttpAggregatorInitializer extends ChannelInitializer<Channel> {
    private final boolean isClient;
    public HttpAggregatorInitializer(boolean isClient){
        this.isClient = isClient;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        if(isClient){//添加HttpClientCodec
            pipeline.addLast("codec", new HttpClientCodec());
        } else {//添加HttpServerCodec
            pipeline.addLast("codec", new HttpServerCodec());
        }
        pipeline.addLast("aggregator", new HttpObjectAggregator(512 * 1024));//将最大消息大小为512Kb的HttpObjectAggregator添加到ChannelPipeline
    }
}
```

## Http压缩

使用Http时，建议开启压缩以尽可能减少传输数据的大小。Netty为压缩和解压提供了ChannelHandler实现，它们同时支持gzip和deflate编码
**服务器没有义务压缩它所发送的数据**

- 示例：
```java
public class HttpCompressionInitializer extends ChannelInitializer<Channel> {
    private final boolean isClient;
    public HttpCompressionInitializer(boolean isClient){
        this.isClient = isClient;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        if(isClient) {
            pipeline.addLast("codec", new HttpClientCodec());
            pipelien.addLast("decompressor", new HttpContentDecompressor());//添加解压器、处理来自服务器的压缩内容
        } else {
            pipeline.addLast("codec", new HttpServerCodec());
            pipeline.addLast("compressor", new HttpContentCompressor());//添加压缩器、压缩数据(如果客户端支持它)
        }
    }
}
```

## 使用Https

- 启用Https只需要将SslHandler添加到ChannelPipeline的ChannelHandler组合中

```java
public cliass HttpsCodecInitializer extends ChannelInitializer<Channel> {
    private final SslContext context;
    private final boolean isClient;

    public HttpsCodecInitializer(SslContext context, boolean isClient){
        this.context = context;
        this.isClient = isClient;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        SSLEngine engine = context.newEngine(ch.alloc());
        pipeline.addFirst("ssl", new SslHandler(engine));//将SslHandler添加到ChannelPipeline中以使用Https
        if(isClient){
            pipeline.addLast("codec", new HttpClientCodec());
        } else {
            pipeline.addLast("codec", new HttpServerCodec());
        }
    }
}
```

**这些代码例子，说明netty的架构方式如何将代码重用变为杠杆作用的。只需添加一个ChannelHandler到Pipeline中，就提供了一项新功能**

## WebSocket
http 请求/响应模式的交互序列

> webSocket提供了“在一个单个的TCP连接上提供双向的通信，为网页和远程服务器之间的双向通信提供了一种替代Http轮询的方案”

- 应用程序实现对webSocket支持 通过将适当的客户端和服务器WebSocket ChannelHandler添加到ChannelPipeline中

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/37.png" alt="png">

- WebSocketFrame类型
   - BinaryWebsocketFrame 数据帧：二进制数据
   - TextWebSocketFrame 数据帧： 文本数据
   - ContinuationWebSocketFrame 数据帧： 属于上一个BinaryWebSocketFrame或TextWebSocketFrame的文本或者二进制数据
   - CloseWebSocketFrame 控制帧：一个Close请求、关闭的状态码以及关闭的原因
   - PingWebSocketFrame 控制帧： 请求一个PongWebSocketFrame
   - PongWebSocketFrame 控制帧： 对PingWebSocketFrame请求的响应

- 示例
```java
/**
 * WebSocketServerProtocolHandler这个类处理协议升级握手，以及三种控制帧
 */
public class WebSocketServerInitializer extends ChannelInitializer<Channel>{
    @Override
    protected void initChannel(Channel ch) throws Exception {
        ch.pipeline().addLast(
            new HttpServerCodec(),
            new HttpObjectAggregator(65536),//为握手提供聚合的HttpRequest 
            new WebSocketServerProtocolHandler("/websocket"), //如果被请求的端点是/websocket，则处理该升级握手
            new TextFrameHandler(), //处理
            new BinaryFrameHandler(), 
            new ContinuationFrameHandler());
    }
}
```
## 空闲的连接和超时

- IdleStateHandler 当空闲时间太长时，触发IdleStateEvent事件。然后，通过在ChannelInboundHandler中重写userEventTriggered()方法来处理该事件
- ReadTimeoutHandler 指定时间内没收到入站数据，则抛出ReadTimeoutException并关闭对应的Channel。可以重写你的ChannelHandler中的exceptionCaught()方法来检测该异常
- WriteTimeoutHandler 对应的出站数据写出

```java
public class IdleStateHandlerInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel ch) throws Exception{
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new IdleStateHandler(0,0,60,TimeUnit.SECONDS));//IdleStateHandler将在被触发时发送一个IdleStateEvent事件
        pipeline.addLast(new HeartbeatHandler());//添加心跳Handler
    }
    public static final class HeartbeatHandler extends ChannelInboundHandlerAdapter{//实现userEventTriggered()方法以发送心跳消息
        private static final ByteBuf HEARTBEAT_SEQUENCE = Unpooled.unreleasableBuffer(Unpooled.copiedBuffer("HEARTBEAT", CharsetUtil.ISO_8859_1));

        @Override
        public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception{
            if(evt instanceof IdleStateEvent){
                ctx.writeAndFlush(HEARTBEAT_SEQUENCE.duplicate()).addListener(ChannelFutureListener.CLOSE_ON_FAILURE);
            } else {
                super.userEventTriggered(ctx,evt);//非IdleStateEvent事件，传递给下一个
            }
        }
    }
}
```
以上，连接超过60s没有入站或出站数据，那么IdleStateHandler触发IdleStateEvent事件调用fireUserEventTriggered方法。HeartbeatHandler实现了userEventTriggered方法，检测到IdleState事件，发送心跳消息，并添加发送操作失败时关闭该连接的ChannelFutureListener


