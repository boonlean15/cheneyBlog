# 使用UDP广播事件

## UDP

- Tcp
  > 管理两个网络端点之间的连接的建立，连接生命周期内有序和可靠的消息传输，最后，连接有序的终止
- udp
  > 无连接协议，没有持久化的概念，每个消息(一个数据报)都是一个单独的传输单元
**udp没有纠错机制，每个节点确认他们接收到的包，没有被确认的包将会被发送方重新发送**

## UDP广播

**单播**
> 发送消息给一个唯一的地址所标识的单一的网络目的地。面向连接和无连接协议都支持这种模式

### UDP额外传输模式
**多播**传输到一个预定义的主机组
**广播**传输到网络(或子网)上的所有主机

## UDP示例应用程序概述

- 打开一个文件，每一行作为一个消息广播到一个指定端口
- 在指定的端口启动一个监听程序，便可创建一个事件监听器来接收消息（不安全，路由器阻止广播消息）

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/udp/1.png" alt="png">

## 定义消息POJO LogEvent

```java
public final class LogEvent{
    public static final byte SEPARATOR = (byte) ':';
    private final InetSocketAddress source;//发送logevent 源InetSOcketAddress
    private final String logfile;//日志文件名称
    private final String msg;//消息内容
    private final long received;//接收logEvent的时间
    //用于传出消息的构造函数
    public LogEvent(String logfile,String msg){
        this(null,-1,logfile,msg);
    }
    //用于传入消息的构造函数
    public LogEvent(InetSocketAddress source, long received,String logfile,String msg){
        this.source = source;
        this.logfile = logfile;
        this.msg = msg;
        this.received = received;
    }

    public InetSocketAddress getSource(){
        return source;
    }

    public String getLogfile(){
        return logfile;
    }

    public String getMsg(){
        return msg;
    }

    public long getReceivedTimestamp(){
        return received;
    }
}
```

## 编写广播者

**广播者中使用的Netty的UDP相关类**

- interface AddressEnvelope<M,A extends SocketAddress> extends ReferenceCounted 定义一个消息，器包装另一个消息并带有发送者或接受者地址。M是消息类型，A是地址类型
- class DefaultAddressEnvelope AddressEnvelope的默认实现
- class DatagramPacket extends DefaultAddressEnvelope<ByteBuf，InetSocketAddress> implement ByteBufHolder 拓展DefaultAddressEnvelope以使用ByteBuf作为消息数据容器
- interface DataframChannel extends Channel 拓展netty的Channel以支持UDP的多播组管理
- class NioDatagramChannel extends AbstractNioMessageChannel implements DatagramCHannel 能够发送和接收AddressEnvelope消息的Channel类型

### 自定义MessageToMessageEncoder

```java
public class LogEventEncoder extends MessageToMessageEncoder<LogEvent> {
    private final InetSocketAddress remoteAddress;

    //LogEventEncoder 创建了即将被发送到指定的 InetSocketAddress 的 DatagramPacket 消息
    public LogEventEncoder(InetSocketAddress remoteAddress) {
        this.remoteAddress = remoteAddress;
    }

    @Override
    protected void encode(ChannelHandlerContext channelHandlerContext,
        LogEvent logEvent, List<Object> out) throws Exception {
        byte[] file = logEvent.getLogfile().getBytes(CharsetUtil.UTF_8);
        byte[] msg = logEvent.getMsg().getBytes(CharsetUtil.UTF_8);
        ByteBuf buf = channelHandlerContext.alloc()
            .buffer(file.length + msg.length + 1);
        //将文件名写入到 ByteBuf 中
        buf.writeBytes(file);
        //添加一个 SEPARATOR
        buf.writeByte(LogEvent.SEPARATOR);
        //将日志消息写入 ByteBuf 中
        buf.writeBytes(msg);
        //将一个拥有数据和目的地地址的新 DatagramPacket 添加到出站的消息列表中
        out.add(new DatagramPacket(buf, remoteAddress));
    }
}
```

### 引导服务器

```java
public class LogEventBroadcaster {
    private final EventLoopGroup group;
    private final Bootstrap bootstrap;
    private final File file;

    public LogEventBroadcaster(InetSocketAddress address, File file) {
        group = new NioEventLoopGroup();
        bootstrap = new Bootstrap();
        //引导该 NioDatagramChannel（无连接的）
        bootstrap.group(group).channel(NioDatagramChannel.class)
             //设置 SO_BROADCAST 套接字选项
             .option(ChannelOption.SO_BROADCAST, true)
             .handler(new LogEventEncoder(address));
        this.file = file;
    }

    public void run() throws Exception {
        //绑定 Channel
        Channel ch = bootstrap.bind(0).sync().channel();
        long pointer = 0;
        //启动主处理循环
        for (;;) {
            long len = file.length();
            if (len < pointer) {
                // file was reset
                //如果有必要，将文件指针设置到该文件的最后一个字节
                pointer = len;
            } else if (len > pointer) {
                // Content was added
                RandomAccessFile raf = new RandomAccessFile(file, "r");
                //设置当前的文件指针，以确保没有任何的旧日志被发送
                raf.seek(pointer);
                String line;
                while ((line = raf.readLine()) != null) {
                    //对于每个日志条目，写入一个 LogEvent 到 Channel 中
                    ch.writeAndFlush(new LogEvent(null, -1,
                    file.getAbsolutePath(), line));
                }
                //存储其在文件中的当前位置
                pointer = raf.getFilePointer();
                raf.close();
            }
            try {
                //休眠 1 秒，如果被中断，则退出循环；否则重新处理它
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.interrupted();
                break;
            }
        }
    }

    public void stop() {
        group.shutdownGracefully();
    }

    public static void main(String[] args) throws Exception {
        if (args.length != 2) {
            throw new IllegalArgumentException();
        }
        //创建并启动一个新的 LogEventBroadcaster 的实例
        LogEventBroadcaster broadcaster = new LogEventBroadcaster(
                new InetSocketAddress("255.255.255.255",
                    Integer.parseInt(args[0])), new File(args[1]));
        try {
            broadcaster.run();
        }
        finally {
            broadcaster.stop();
        }
    }
}
```

## 编写监听者

### 解码器LogEventDecoder

```java
public class LogEventDecoder extends MessageToMessageDecoder<DatagramPacket> {

    @Override
    protected void decode(ChannelHandlerContext ctx,
        DatagramPacket datagramPacket, List<Object> out)
        throws Exception {
        //获取对 DatagramPacket 中的数据（ByteBuf）的引用
        ByteBuf data = datagramPacket.content();
        //获取该 SEPARATOR 的索引
        int idx = data.indexOf(0, data.readableBytes(),
            LogEvent.SEPARATOR);
        //提取文件名
        String filename = data.slice(0, idx)
            .toString(CharsetUtil.UTF_8);
        //提取日志消息
        String logMsg = data.slice(idx + 1,
            data.readableBytes()).toString(CharsetUtil.UTF_8);
        //构建一个新的 LogEvent 对象，并且将它添加到（已经解码的消息的）列表中
        LogEvent event = new LogEvent(datagramPacket.sender(),
            System.currentTimeMillis(), filename, logMsg);
        out.add(event);
    }
}
```

### LogEventHandler控制台输入接收到的消息

```java
public class LogEventHandler
    extends SimpleChannelInboundHandler<LogEvent> {

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,
        Throwable cause) throws Exception {
        //当异常发生时，打印栈跟踪信息，并关闭对应的 Channel
        cause.printStackTrace();
        ctx.close();
    }

    @Override
    public void channelRead0(ChannelHandlerContext ctx,
        LogEvent event) throws Exception {
        //创建 StringBuilder，并且构建输出的字符串
        StringBuilder builder = new StringBuilder();
        builder.append(event.getReceivedTimestamp());
        builder.append(" [");
        builder.append(event.getSource().toString());
        builder.append("] [");
        builder.append(event.getLogfile());
        builder.append("] : ");
        builder.append(event.getMsg());
        //打印 LogEvent 的数据
        System.out.println(builder.toString());
    }
}
```

### 引导监听者

```java
public class LogEventMonitor {
    private final EventLoopGroup group;
    private final Bootstrap bootstrap;

    public LogEventMonitor(InetSocketAddress address) {
        group = new NioEventLoopGroup();
        bootstrap = new Bootstrap();
        //引导该 NioDatagramChannel
        bootstrap.group(group)
            .channel(NioDatagramChannel.class)
            //设置套接字选项 SO_BROADCAST
            .option(ChannelOption.SO_BROADCAST, true)
            .handler( new ChannelInitializer<Channel>() {
                @Override
                protected void initChannel(Channel channel)
                    throws Exception {
                    ChannelPipeline pipeline = channel.pipeline();
                    //将 LogEventDecoder 和 LogEventHandler 添加到 ChannelPipeline 中
                    pipeline.addLast(new LogEventDecoder());
                    pipeline.addLast(new LogEventHandler());
                }
            } )
            .localAddress(address);
    }

    public Channel bind() {
        //绑定 Channel。注意，DatagramChannel 是无连接的
        return bootstrap.bind().syncUninterruptibly().channel();
    }

    public void stop() {
        group.shutdownGracefully();
    }

    public static void main(String[] args) throws Exception {
        if (args.length != 1) {
            throw new IllegalArgumentException(
            "Usage: LogEventMonitor <port>");
        }
        //构造一个新的 LogEventMonitor
        LogEventMonitor monitor = new LogEventMonitor(
            new InetSocketAddress(Integer.parseInt(args[0])));
        try {
            Channel channel = monitor.bind();
            System.out.println("LogEventMonitor running");
            channel.closeFuture().sync();
        } finally {
            monitor.stop();
        }
    }
}
```



