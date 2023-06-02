# 引导

> 学习如何引导客户端和服务端应用程序，包括无连接协议的应用程序。一些特殊情况，在服务器应用程序引导客户端Channel，使用ChannelInitializer处理引导过程中的多个Channelhandler的安装。设置channel的配置选项以及使用属性将信息附加到Channel。最后是关闭应用程序，最重要的是关闭EventLoopGroup

引导一个应用程序，是指对它进行配置，并使它运行起来的过程。

## Bootstrap

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/30.png" alt="png">

> bootstrap本意是用来支撑不同应用程序的功能的。服务器致力于用一个父Channel来接受来自客户端的连接，并创建Channel以用于他们之间的通信。客户端只需要一个单独的，没有父Channel的Channel来用于所有的网络交互。

- AbstractBootstrap实现cloneable的原因
> 可能需要创建多个具有类似配置或相同配置的channel，为了支持这种模式而又不需要为每个channel创建并配置一个新的引导类实例。这种方式只会创建引导类实例的EventLoopGroup的一个浅拷贝，所以后者将在所有克隆的channel实例之间共享。
- 类的声明
```java
public abstract class AbstractBootstrap<B extends AbstractBootstrap<B,C>,C extends Channel>{}
public class Bootstrap extends AbstractBootstrap<Bootstrap,Channel>{}
public class ServerBootstrap extends AbstractBootstrap<ServerBootstrap, ServerChannel>{}
```

## 引导客户端和无连接协议 Bootstrap
Bootstrap用于客户端或者使用了无连接协议的应用程序中，Bootstrap类部分方法如下：

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/31.png" alt="png">
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/32.png" alt="png">

### 引导客户端
- Bootstrap为客户端和无连接协议的应用程序创建Channel

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/33.png" alt="png">

### Channel和EventLoopGroup的兼容性

对于NIO和OIO来说，都有相应的EventLoopGroup和Channel实现，不能混用不同包/类型的EventLoopGroup和Channel

channel
--nio  NioEventLoopGroup
       NioDatagramChannel
       NioServerSocketChannel
       NioSocketChannel
--oio  OioEventLoopGroup
       OioDatagramChannel
       OioServerSocketChannel
       OioSocketChannel
       
## 引导服务器 ServerBootstrap

引导服务器的API比客户端的API多了childOption和childAttr、childHandler。child开头的方法，添加到由serverChannel创建的子channel -- childOption的这些方法，作用是简化设置应用到已被接受的子channel的channelConfig

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/34.png" alt="png">

## 从Channel引导客户端

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/35.png" alt="png">

编写netty应用的一般准则，尽可能的重用eventLoop，以减少线程创建所带来的开销

```java
public class BootstrapSharingEventLoopGroup {

    /**
     * 代码清单 8-5 引导服务器
     * */
    public void bootstrap() {
        //创建 ServerBootstrap 以创建 ServerSocketChannel，并绑定它
        ServerBootstrap bootstrap = new ServerBootstrap();
        //设置 EventLoopGroup，其将提供用以处理 Channel 事件的 EventLoop
        bootstrap.group(new NioEventLoopGroup(), new NioEventLoopGroup())
            //指定要使用的 Channel 实现
            .channel(NioServerSocketChannel.class)
            //设置用于处理已被接受的子 Channel 的 I/O 和数据的 ChannelInboundHandler
            .childHandler(
                new SimpleChannelInboundHandler<ByteBuf>() {
                    ChannelFuture connectFuture;
                    @Override
                    public void channelActive(ChannelHandlerContext ctx)
                        throws Exception {
                        //创建一个 Bootstrap 类的实例以连接到远程主机
                        Bootstrap bootstrap = new Bootstrap();
                        //指定 Channel 的实现
                        bootstrap.channel(NioSocketChannel.class).handler(
                            //为入站 I/O 设置 ChannelInboundHandler
                            new SimpleChannelInboundHandler<ByteBuf>() {
                                @Override
                                protected void channelRead0(
                                    ChannelHandlerContext ctx, ByteBuf in)
                                    throws Exception {
                                    System.out.println("Received data");
                                }
                            });
                        //使用与分配给已被接受的子Channel相同的EventLoop
                        bootstrap.group(ctx.channel().eventLoop());
                        connectFuture = bootstrap.connect(
                            //连接到远程节点
                            new InetSocketAddress("www.manning.com", 80));
                    }

                    @Override
                    protected void channelRead0(
                        ChannelHandlerContext channelHandlerContext,
                            ByteBuf byteBuf) throws Exception {
                        if (connectFuture.isDone()) {
                            //当连接完成时，执行一些数据操作（如代理）
                            // do something with the data
                        }
                    }
                });
        //通过配置好的 ServerBootstrap 绑定该 ServerSocketChannel
        ChannelFuture future = bootstrap.bind(new InetSocketAddress(8080));
        future.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture channelFuture)
                throws Exception {
                if (channelFuture.isSuccess()) {
                    System.out.println("Server bound");
                } else {
                    System.err.println("Bind attempt failed");
                    channelFuture.cause().printStackTrace();
                }
            }
        });
    }
}
```

## 引导过程中添加多个ChannelHandler

- 引导过程中调用handler()/childHandler()方法添加单个的ChannelHandler
- 可根据需要，通过在ChannelPipeline中将它们链接在一起来部署尽可能多的ChannelHandler
- 引导过程中，通过ChannelInitializer，设置添加多个ChannelHandler

```java
final class ChannelInitializerImpl extends ChannelInitializer { //用以设置ChannelPipeline 的自定义ChannelInitializerImpl 实现
　　@Override
　　protected void initChannel(Channel ch) throws Exception { //将所需的ChannelHandler添加到ChannelPipeline
　　　　ChannelPipeline pipeline = ch.pipeline();
　　　　pipeline.addLast(new HttpClientCodec());
　　　　pipeline.addLast(new HttpObjectAggregator(Integer.MAX_VALUE));
　　}
}
```

## 使用Netty的ChannelOption和属性Attr
- option方法将ChannelOption应用到引导，将会自动应用到引导所创建的所有Channel
- 可用ChannelOption包括了底层连接的详细信息，如keep-alive或者超时属性以及缓冲区设置

使用ChannelOption配置Channel，使用属性存储整型值
```java
public class BootstrapClientWithOptionsAndAttrs {

    /**
     * 代码清单 8-7 使用属性值
     * */
    public void bootstrap() {
        //创建一个 AttributeKey 以标识该属性
        final AttributeKey<Integer> id = AttributeKey.newInstance("ID");
        //创建一个 Bootstrap 类的实例以创建客户端 Channel 并连接它们
        Bootstrap bootstrap = new Bootstrap();
        //设置 EventLoopGroup，其提供了用以处理 Channel 事件的 EventLoop
        bootstrap.group(new NioEventLoopGroup())
            //指定 Channel 的实现
            .channel(NioSocketChannel.class)
            .handler(
                //设置用以处理 Channel 的 I/O 以及数据的 ChannelInboundHandler
                new SimpleChannelInboundHandler<ByteBuf>() {
                    @Override
                    public void channelRegistered(ChannelHandlerContext ctx)
                        throws Exception {
                        //使用 AttributeKey 检索属性以及它的值
                        Integer idValue = ctx.channel().attr(id).get();
                        // do something with the idValue
                    }

                    @Override
                    protected void channelRead0(
                        ChannelHandlerContext channelHandlerContext,
                        ByteBuf byteBuf) throws Exception {
                        System.out.println("Received data");
                    }
                }
            );
        //设置 ChannelOption，其将在 connect()或者bind()方法被调用时被设置到已经创建的 Channel 上
        bootstrap.option(ChannelOption.SO_KEEPALIVE, true)
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000);
        //存储该 id 属性
        bootstrap.attr(id, 123456);
        //使用配置好的 Bootstrap 实例连接到远程主机
        ChannelFuture future = bootstrap.connect(
            new InetSocketAddress("www.manning.com", 80));
        future.syncUninterruptibly();
    }
}
```

## 引导DatagramChannel

- Bootstrap也可以被用于无连接的协议。唯一区别，不再调用connect()方法，而是bind()方法
```java
public class BootstrapDatagramChannel {

    /**
     * 代码清单 8-8 使用 Bootstrap 和 DatagramChannel
     */
    public void bootstrap() {
        //创建一个 Bootstrap 的实例以创建和绑定新的数据报 Channel
        Bootstrap bootstrap = new Bootstrap();
        //设置 EventLoopGroup，其提供了用以处理 Channel 事件的 EventLoop
        bootstrap.group(new OioEventLoopGroup()).channel(
            //指定 Channel 的实现
            OioDatagramChannel.class).handler(
            //设置用以处理 Channel 的 I/O 以及数据的 ChannelInboundHandler
            new SimpleChannelInboundHandler<DatagramPacket>() {
                @Override
                public void channelRead0(ChannelHandlerContext ctx,
                    DatagramPacket msg) throws Exception {
                    // Do something with the packet
                }
            }
        );
        //调用 bind() 方法，因为该协议是无连接的
        ChannelFuture future = bootstrap.bind(new InetSocketAddress(0));
        future.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture channelFuture)
               throws Exception {
               if (channelFuture.isSuccess()) {
                   System.out.println("Channel bound");
               } else {
                   System.err.println("Bind attempt failed");
                   channelFuture.cause().printStackTrace();
               }
            }
        });
    }
}
```

## 关闭

- 需要关闭EventLoopGroup，他将处理任何挂起的事件和任务，随后释放所有活动的线程。
- EventLoopGroup.shutdownGracefully()方法：返回一个Future
- 异步方法，需要阻塞等待直到它完成\或者Future中注册一个监听器以在关闭完成时获得通知
