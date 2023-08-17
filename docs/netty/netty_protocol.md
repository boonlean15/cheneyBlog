# 网络协议

## WebSocket

- 实时web的概念
- WebSocket协议
- 使用netty构建一个基于Websocket的聊天室服务器

### 概念

**硬实时服务质量**

> 保证计算结果将在指定的时间间隔内被递交

**实时web服务**

> 实时web利用技术和实践，使用户在信息的作者发布信息之后就能够立即收到信息，而不需要他们或者他们的软件周期性地检查信息源以获取更新。

**websocket简介**

> websocket是完全重新设计的协议，旨在为web上的双向数据传输问题提供一个切实可行的解决方案。使得客户端和服务器之间可以在任意时刻传输消息，因此，这也就要求它们异步地处理消息回执。

## webSocket示例应用程序

实现一个基于浏览器的聊天应用程序，多个用户之间可以进行相互通信。

应用程序逻辑：客户端发送一个消息，消息将被广播到所有的其他连接的客户端。

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/websocket/websocket-1.png" alt="png">

## 添加WebSocket支持

从标准HTTP/HTTPS协议切换到webSocket时，会使用一种称为升级握手的机制。webSocket应用程序始终以HTTP/HTTPS作为开始，升级动作发生的确切时刻特定于应用程序，可能在启动时，或访问特定的url之后。

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/websocket/websocket-2.png" alt="png">

## 处理HTTP请求

处理HTTP请求的组件HttpRequestHandler，提供index.html以及转发任何目标URI为/ws的请求

如果请求地址是/ws的URI，调用FullHttpRequest的retain方法保留请求消息，并通过fireChannelRead转发给下一个ChannelHandler
```java
public class HttpRequestHandler extends SimpleChannelInboundHandler<FullHttpRequest> {//拓展SimpleHandler以处理FullHttpRequest消息
    private final String wsUri;
    private static final File INDEX;

    static {
        URL location = HttpRequestHandler.class.getProtectionDomain().getCodeSource().getLocation();
        try{
            String path = location.toURI() + "index.html";
            path = !path.contains("file:") ? path : path.substring(5);
            INDEX = new File(path);
        }catch(URISyntaxException e){
            throw new IllegalStateException("unable to locate index.html", e);
        }
    }

    public HttpRequestHandler(String wsUri){
        this.wsUri = wsUri;
    }

    @Override
    public void channelRead0(ChannelHandlerContext ctx,FullHttpRequest request) throws Exception{
        //如果请求了websocket协议升级，则增加引用计数，并传递给下一个ChannelInboundHandler
        if(wsUri.equalsIgnoreCase(request.getUri())){
            ctx.fireChannelRead(request.retain());
        }else{
            //处理100Continue请求以符合HTTP1.1规范
            if(HttpHeaders.is100ContinueExpected(request)){
                send100Continue(ctx);
            }
            RandomAccessFile file = new RandomAccessFile(INDEX,"r");//读取index.html
            HttpResponse response = new DefaultHttpResponse(request.getProtocalVersion(),HttpResponseStatus.OK);
            response.headers().set(HttpHeaders.Names.CONTENT_TYPE,"text/html;charset=UTF-8");
            boolean keepAlive = HttpHeaders.isKeepAlive(request);
            //如果请求了keep-alive,则添加所需要的HTTP头信息
            if(keepAlive){
                response.headers().set(HttpHeaders.Names.CONTENT_LENGTH,file.length());
                response.headers().set(HttpHeaders.Names.CONNECTION,HttpHeaders.Values.KEEP_ALIVE);
            }
            //将HttpResponse写到客户端
            ctx.write(response);
            if(ctx.pipeline().get(SslHandler.class) == null){
                //将index.html写到客户端
                ctx.write(new DefaultFileRegion(file.getChannel(),0,file.length()));
            }else{
                ctx.write(new ChunkedNioFile(file.getChannel()));
            }
            //写LastHttpContent并冲刷到客户端
            ChannelFuture future = ctx.writeAndFlush(LastHttpContent.EMPTY_LAST_CONTENT);
            //如果没有请求keep-alive,则写操作完成后关闭channel
            if(!keepAlive){
                future.addListener(ChannelFutureListener.CLOSE);
            }
        }
    }

    private static void send100Continue(ChannelHandlerContext ctx){
        FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1,HttpResponseStatus.CONTINUE);
        ctx.writeAndFlush(response);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }

}
```

> websocket帧 websocket以帧的方式传输数据，每一帧代表消息的一部分，一个完整的消息可能包含许多帧

## 处理websocket帧

WebSocketFrame的类型
- BinaryWebSocketFrame 二进制数据
- TextWebSocketFrame 文本数据
- ContinuationWebSocketFrame 属于上一个Binary或Text的文本数据或二进制数据
- CloseWebSocketFrame 一个Close请求，包含一个关闭的状态码和关闭的原因
- PingWebSocketFrame 请求传输一个PongWebSocketFrame
- PongWebSocketFrame 作为一个PingWebSocketFrame的响应被发送
- WebSocketServerProtocolHandler 处理了所有委托管理的WebSocket帧类型以及升级握手本身。Clost/Ping/Pong三个控制帧


```java
public class TextWebSocketFrameHandler extends SimpleChannelInboundHandler<TextWebSocketFrame>{
    private final ChannelGroup group;

    public TextWebSocketFrameHandler(ChannelGroup group){
        this.group = group;
    }

    //重写userEventTriggered方法以处理自定义事件
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx,Object evt) throws Exception{
        if(evt == WebSocketServerProtocolHandler.ServerHandshakeStateEvent.HANDSHAKE_COMPLETE){
            //如果该事件表示握手成功，则移除HttpRequestHandler，因为不会接受到任何Http消息了
            ctx.pipeline().remove(HttpRequestHandler.class);
            //通知所有连接的websocket客户端新的客户端连接上了
            group.writeAndFlush(new TextWebSocketFrame("CLient"+ctx.channel() + "joined"));
            //新的websocket channel添加到group中，以接收所有的消息
            group.add(ctx.channel());
        } else {
            super.userEventTriggered(ctx,evt);    
        }
    }

    @Override
    public void channelRead0(ChannelHandlerContext ctx,TextWebSocketFrame msg) throws Exception{
        //增加消息的引用计数，并写到ChannelGroup中所有连接的客户端
        group.writeAndFlush(msg.retain());
    }
}
```

## 初始化ChannelPipeline

```java
public class ChatServerInitializer extends ChannelInitializer<Channel> {
    private final ChannelGroup group;

    public ChatServerInitializer(ChannelGroup group){
        this.group = group;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new HttpServerCodec());
        pipeline.addLast(new ChunkedWriteHandler());
        pipeline.addLast(new HttpObjectAggregator(64 * 1024));
        pipeline.addLast(new HttpRequestHandler("/ws"));
        pipeline.addLast(new WebSocketServerProtocolHandler("/ws"));
        pipeline.addLast(new TextWebSocketFrameHandler(group));
    }
}
```

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/websocket/websocket-3.png" alt="png">

> 协议升级之后，HttpRequestdecoder替换为WebSocketFrameDecoder，HttpResponseEncoder替换为WebSocketFrameEncoder。为了性能最大化，不需要的ChannelHandler将移除。**Netty支持4个版本的WebSocket协议，每个都有自己的实现类，根据客户端支持的版本，自动选择正确版本的WebSocketFrameDecoder和WebSocketFrameEncoder**

## 引导
引导服务器，安装ChatServerInitializer

```java
public class ChatServer{
    //创建DefaultChannelGroup，其将保存所有已经连接的WebSocket Channel
    private final ChannelGroup channelGroup = new DefaultChannelGroup(ImmediateEventExecutor.INSTANCE);
    private final EventLoopGroup group = new NioEventLoopGroup();
    private Channel channel;

    public ChannelFuture start(InetSocketAddress address) {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(group).channel(NioServerSocketChannel.class).childHandler(createInitializer(channelGroup));
        ChannelFuture future = bootstrap.bind(address);
        future.syncUninterruptibly();
        channel = future.channel();
        return future;
    }

    protected ChannelInitializer<Channel> createInitializer(ChannelGroup group){
        return new ChatServerInitializer(group);
    }

    public void destory(){
        if(channel != null){
            channel.close();
        }
        channelGroup.close();
        group.shutdownGracefully();
    }


    public static void main(String[] args) throws Exception{
        if(args.length != 1){
            System.out.println("Please give port as argument");
            System.exit(1);
        }

        int port = Integer.parseInt(args[0]);
        final ChatServer endpoint = new ChatServer();
        ChannelFuture future = endpoint.start(new InetSocketAddress(port));
        Runtime.getRuntime().addShutdownHook(new Thread(){
            @Override
            public void run(){
                endpoint.destory();
            }
        });
        future.channel().closeFuture().syncUninterruptibly();
    }
}
```

## 添加SslHandler

```java
public class SecureChatServerInitializer extends ChatServerInitializer {
    private final SslContext context;

    public SecureChatServerInitializer(ChannelGroup group,
                                       SslContext context) {
        super(group);
        this.context = context;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        //调用父类的 initChannel() 方法
        super.initChannel(ch);
        SSLEngine engine = context.newEngine(ch.alloc());
        engine.setUseClientMode(false);
        //将 SslHandler 添加到 ChannelPipeline 中
        ch.pipeline().addFirst(new SslHandler(engine));
    }
}
```

```java
public class SecureChatServer extends ChatServer {
    private final SslContext context;

    public SecureChatServer(SslContext context) {
        this.context = context;
    }

    @Override
    protected ChannelInitializer<Channel> createInitializer(
            ChannelGroup group) {
        //返回之前创建的 SecureChatServerInitializer 以启用加密
        return new SecureChatServerInitializer(group, context);
    }

    public static void main(String[] args) throws Exception {
//        if (args.length != 1) {
//            System.err.println("Please give port as argument");
//            System.exit(1);
//        }
//        int port = Integer.parseInt(args[0]);

        SelfSignedCertificate cert = new SelfSignedCertificate();
        SslContext context = SslContext.newServerContext(
                cert.certificate(), cert.privateKey());
        final SecureChatServer endpoint = new SecureChatServer(context);
        ChannelFuture future = endpoint.start(new InetSocketAddress(9999));
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                endpoint.destroy();
            }
        });
        future.channel().closeFuture().syncUninterruptibly();
    }
}
```



