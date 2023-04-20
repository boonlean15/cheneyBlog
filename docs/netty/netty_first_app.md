# netty的第一个应用示例
- ChannelHandle和业务逻辑
- 引导服务器
  > 通过ChannelHandler处理业务逻辑，达到把应用程序的业务逻辑和网络层解耦

## 服务端
- EchoServerHandler 继承    ChannelInboundHandlerAdapter 用于处理业务逻辑
- NioEventLoopGroup NIO传输的轮训组
- ServerBootstrap 服务端引导
- NioServerSocketChannel  设置channel
- 添加handler到childHandler链中
- b.bind().sync() 绑定服务器，并等待绑定完成
- 阻塞等到服务器channel关闭
- 关闭eventLoopGroup，释放资源
```java
    public void start() throws InterruptedException {
        final EchoServerHandler serverHandler = new EchoServerHandler();
        EventLoopGroup group = new NioEventLoopGroup();
        //NIO loop

        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(group).channel(NioServerSocketChannel.class).localAddress(new InetSocketAddress(port))
                    .childHandler(new ChannelInitializer() {
                        @Override
                        protected void initChannel(Channel channel) {
                            channel.pipeline().addLast(serverHandler);
                        }
                    });

            ChannelFuture f = b.bind().sync();
            f.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            group.shutdownGracefully().sync();
        }
    }
```

## 客户端
- ChannelHandler处理业务逻辑
- 引导客户端服务器

```java
    public void start() throws InterruptedException {
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            Bootstrap b = new Bootstrap();
            b.group(group).channel(NioSocketChannel.class).remoteAddress(new InetSocketAddress(host, port)).handler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel socketChannel) throws Exception {
                    socketChannel.pipeline().addLast(new EchoClientHandler());
                }
            });
            ChannelFuture sync = b.connect().sync();
            sync.channel().closeFuture().sync();
        }finally {
            group.shutdownGracefully().sync();
        }
    }
```
