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
