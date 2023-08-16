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

## 解码基于分隔符的协议和基于长度的协议

## 基于分隔符的协议

基于分隔符的消息协议使用定义的字符来标记消息或者消息段的开头或者结尾。例如：SMTP/POP3/IMAP/Telnet

- **DelimiterBasedFrameDecoder** 使用任何由用户提供的分隔符来提取帧的通用解码器
- **LineBasedFrameDecoder** 提取由行尾符\n \r\n分隔的帧的解码器。这个解码器比DelimitedBasedFrameDecoder更快

示例1:
```java
public class LineBasedHandlerInitializer extends ChannelInitializer<Channel>{
    @Override
    protected void initChannel(Channel ch) throws Exception{
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new LineBasedFrameDecoder(64*1024));//该LineBasedFrameDecoder将提取的帧转发给下一个ChannelInboundHandler
        pipeline.addLast(new FrameHandler());//添加FrameHandler以接收帧
    }

    public static final class FrameHandler extends SimpleChannelInboundHandler<ByteBuf>{
        @Override
        public void channelRead0(ChannelHandlerContext ctx,ByteBuf msg)throws Exception{//传入了单个帧的内容
            // Do something with the data extracted from the frame
        }
    }
}
```
> 如果使用除行尾符之外的分隔符分隔的帧，请以类似的方式使用DelimiterBasedFrameDecoder，将特定的分隔符序列指定到其构造函数即可

示例2：
```java
public class CmdHandlerInitializer extends ChannelInitializer<Channel> {
    final byte SPACE = (byte)' ';
    @Override
    protected void initChannel(Channel ch) throws Exception{
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new CmdDecoder(64*1024));//添加CmdDecoder以提取Cmd对象，并将它传递给下一个ChannelInboundHandler
        piepline.addLast(new CmdHandler());//添加CmdHandler以接收和处理Cmd对象
    }

    public static final class Cmd{
        private final Bytebuf name;
        private final Bytebuf args;
        get...set..
    }
    public static final class CmdDecoder extends LineBasedFrameDecoder{
        public CmdDecoder(int maxlength){
            super(maxLength);
        }

        @Override
        protected Object decode(ChannelHandlerContext ctx,Bytebuf buffer) throws Exception{
            Bytebuf frame = (Bytebuf) super.decode(ctx,buffer);//Bytebuf中提取由行尾符序列分隔的帧
            if(frame == null){
                return null;
            }
            int index = frame.indexOf(frame.readerIndex(),frame.writeIndex(),SPACE);//查找第一个空格字符的索引
            return new Cmd(frame.slice(frame.readerIndex(),index), frame.slice(index+1,frame.writeIndex()));
        }
    }

    public static final class CmdHandler extends SimpleChannelInboundHandler<Cmd>{
        @Override
        public void channelRead0(ChannelHandlerContext ctx,Cmd msg) throws Exception{
            //Do something with the commond 处理传经ChannelPipeline的Cmd对象
        }
    }
}
```

## 基于长度的协议
基于长度的协议通过将它的长度编码到帧的头部来定义帧

- FixedLengthFrameDecoder 提取在调用构造函数时指定的定长帧
- LengthFieldBasedFrameDecoder 根据编码进帧头部中的长度提取帧；该字段的偏移量以及长度在构造函数中指定

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/38.png" alt="png">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/39.png" alt="png">

示例：使用LengthFieldBasedFrameDecoder解码器基于长度的协议
```java
public class LengthBasedInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel ch) throws Exception{
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new LengthFieldBasedFrameDecoder(64*1024,0,8));//使用LengthFieldBasedFrameDecoder解码将帧长度编码到帧起始的前8个字节中的消息
        pipeline.addLast(new FrameHandler);//添加FrameHandler处理每个帧
    }

    public static final class FrameHandler extends SimpleChannelInboundHandler<ByteBuf>{
        @Override
        public void channelRead0(ChannelHandlerContext ctx,ByteBuf msg) throws Exception{
            //do something with the frame 处理帧的数据
        }
    }
}
```

通过指定协议帧的分隔符或长度(固定或可变长度)以定义字节流的结构的协议的编解码器，许多常见协议都落到这些分类之一中

## 写大型数据
NIO零拷贝特性：文件内容从文件系统移动到网络栈到复制过程，而不需要从内核空间复制到用户空间**使用零拷贝特性高效的传输文件**

FileRegion：通过支持零拷贝到文件传输的Channel来发送的文件区域

示例：适用于文件内容的直接传输，不包括应用程序对数据的任何处理
```java
FileInputStream in = new FileInputStream(file);//创建一个FileInputStream
FileRegion region = new DefaultFileRegion(in.getChannel(),0,file.length());//以该文件的完整长度创建一个新的DefaultFileRegion
channel.writeAndFlush(region).addListener(new ChannelFutureListener(){
    @Override
    public void operationComplete(ChannelFuture future) throws Exception {
        if(!future.isSuccess()){
            Throwable cause = future.cause();//处理失败
            //do something
        }
    }
});
```

- ChunkedWriteHandler 支持异步写大型数据流，而不会导致大量内存消耗。需要将数据从文件系统复制到用户内存时使用
- interface ChunkedInput<B>,其中类型参数B是readChunk()方法返回的类型。代表将由ChunkedWriteHandler处理的不定长度的数据流
    - ChunkedFile 从文件中逐块获取数据，当你的平台不支持零拷贝或你需要转换数据时使用
    - ChunkedNioFile 和ChunkedFile类似，只是它使用了FileChannel
    - ChunkedStream 从InputStream中逐块传输内容
    - ChunkedNioStream 从ReadableByteChannel中逐块传输内容


**ChunkedStream用法**
```java
public class ChunkedWriteHandlerInitializer extends ChannelInitializer<Channel> {
    private final File file;
    private final SslContext sslCtx;
    public ChunkedWriteHandlerInitializer(File file, SslContext sslCtx){
        this.file = file;
        this.sslCtx = sslCtx;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception{
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new SslHandler(sslCtx.newEngine(ch.alloc())));//将SslHandler添加到ChannelPipeline中
        pipeline.addLast(new ChunkedWriteHandler());//添加ChunkedWritehandler以处理作为ChunkedInput传入的数据
        pipeline.addLast(new WriteStreamHandler());//一旦连接建立，writeStreamHandler就开始写文件数据
    }

    public final class WriteStreamHandler extends ChannelInboundHandlerAdapter {

        @Override
        public void channelActive(ChannelHandlerContext ctx) throws Exception{
            //当连接建立时，channelActive方法将使用ChunkedInput写文件数据
            super.channelActive(ctx);
            ctx.writeAndFlush(new ChunkedStream(new FileInputStream(file)));
        }
    }
}
```

## 序列化数据

## JDK序列化

- CompatibleObjectDecoder 和使用JDK序列化的非基于Netty的远程节点进行互操作的解码器
- ObjectEncoder 构建于JDK序列化之上的使用自定义的序列化来编码的编码器；当没有其他的外部依赖时，它提供了速度上的改进。否则其他的序列化实现更加可取

## JBoss Marshalling进行序列化

比JDK序列化最多块3倍，而且更加紧凑

Netty提供的编解码器
    - CompatibleMarshallingDecoder/CompatibleMarshallingEncoder 与只使用JDK序列化的远程节点兼容
    - MarshallingDecoder/MarshallingEncoder 适用于使用JBossMarshalling的节点，这些类必须一起使用

```java
public class MarshallingInitializer extends ChannelInitialzer<Channel> {
    private final MarshallerProvider marshallerProvider;
    private final UnmarshallerProvider unmarshallerProvider;
    public MarshallingInitializer(UnmarshallerProvider unmarshallerProvider,MarshallerProvider marshallerProvider){
        this.marshallerProvider = marshallerProvider;
        this.unmarshallerProvider = unmarshallerProvider;
    }

    @Override
    protected void initChannel(Channel channel) throws Exception{
        ChannelPipeline pipeline = channel.pipeline();
        pipeline.addLast(new MarshallingDecoder(unmarshallerProvider));//添加MarshallingDecoder以将ByteBuf转换为POJO
        pipeline.addLast(newMarshallingEncoder(marshallerProvider));//添加MarshallingEncoder以将POJO转换为ByteBuf
        pipeline.addLast(new ObjectHandler());//添加objectHandler以处理普通实现了Serializable接口的POJO
    }

    public static final class ObjectHandler extends SimpleChannelInboundHandler<Serializable> {
        @Override
        public void channelRead0(ChannelHandlerContext channelHandlerContext,Serializable serializable) throws Exception {
            //DO something
        }
    }
}
```

## Protocol Buffers序列化

netty提供的Protobuf编解码器
- ProtobufDecoder/ProtobufEncoder 使用protobuf对消息进行编码/解码
- ProtobufVarint32FrameDecoder 根据消息中的google protocol Buffers的Base 128 Varints 整型长度字段值动态地分割所接收到的ByteBuf
- ProtobufVarint32LengthFieldPrepender 向ByteBuf前追加一个google protocol Buffers 的base 128 varints整型的长度字段值


> Netty提供的编解码器以及各种ChannelHandler可以被组合和拓展，以实现非常广泛的处理方案。
