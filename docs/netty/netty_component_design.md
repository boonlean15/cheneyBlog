# netty组件和设计

## Channel、 EventLoop、ChannelFuture

### channel
  > 输入输出的一个通道channel
- 基本的IO操作依赖于网络传输所提供的原语 bind()、connect()、read()、write()
- 基于java的网络编程中，基本构造是class socket
- 使用netty提供的channel，降低了直接使用socker的复杂度
  - netty有很多预定义的channel：Embeddedchannel、LocalServerChannel、NioSocketChannel

### EventLoop
  > 定义了Netty的核心抽象，处理连接的生命周期中所发生的事件
- 一个EventLoopGroup 包含一个或多个EventLoop
- 一个EventLoop的生命周期内只与一个Thread绑定
- 所有由EventLoop处理的IO事件都将在它专有的Thread上被处理
- 一个channel在它的生命周期内只注册于一个EventLoop
- 一个EventLoop可以被分配给一个或多个Channel
   > 一个channel的io事件是相同的Thread执行的，消除了同步的需要

### ChannelFuture
  > netty的io操作都是异步的，可以看作是将来要执行的操作的结果的占位符，和java的Future类似
- 不能保证它什么时候被执行，但一定会被执行。此外，属于同一个channel的操作，保证它们以被调用的顺序被执行

## ChannelHandler、 ChannelPipeline

### ChannelHandler
  > 处理入站和出站数据的应用程序逻辑的容器。专门用于几乎任何类型的动作，如数据格式转换，处理异常等
- 举例：比如经常实现的一个子接口ChannelInboundHandler，用于处理入站数据和事件
- 应用程序的逻辑通常驻留在一个或多个ChannelInboundHandler中

### ChannelPipeline
  > channelPipeline为channelhandler链提供了容器，并定义了用于在该链上传播入站和出站事件流的API

  > channelHandler是处理往来ChannelPipeline事件或数据的任何代码的通用容器

#### ChannelHandler安装到ChannelPipeline的过程如下：
- 一个ChannelInitializer的实现被注册到ServerBootstrap中
- 当ChannelInitializer.initChannel被调用，ChannelInitializer将在ChannelPipeline中安装一组自定义的ChannelHandler
- ChannelInitializer将它自己从ChannelPipeline中移除

### ChannelHandler链特点
- ChannelHandler是专门用于处理往来ChannelPipeline链的，，从它的实现ChannelInboundHandlerAdapter和ChannelOutboundHandlerAdapter可以看出
- Inbound类型和Outbound类型可以被添加到ChannelHandler链中，但是netty可以识别它，以保证入站数据只在Inbound之间传播，出站数据只在Outbound传播
- 入站流向和出站流向-顺序 (channelHandler的顺序是按被添加到ChannelPipeline的顺序决定的)
- **可以通过作为参数传递到每个方法的ChannelHandlerContext，事件可以被传递到ChannelHandler链的下一个ChannelHandler中，默认实现是传递给下一个ChannelHandler**
```java   
@Skip
public void channelActive(ChannelHandlerContext ctx) throws Exception {
    ctx.fireChannelActive();
}
```
### ChannelHandlerContext
   > ChannelHandler添加到channelPipeline时，会分配一个ChannelHandlerContext，代表ChannelHandler和ChannelPipeline之间的绑定。**它可以获取底层的Channel**

### **Netty中发送消息的方式**
- 直接写到channel 从Pipeline的尾部开始流动
- 写到ChannelHandlerContext 从ChannelPipeline的下一个Handler开始流动
  
## 编码器、解码器
> 网络的传输都是字节，所以需要编码器和解码器，比如我们java程序，需要的是一个java对象，那么编码器和解码器的作用便是把对象编码为字节，字节解码为java对象

### 编码器命名规则
> 类似于ByteToMessageDecoder、MessageToByteEncode，还有专为Google的protocol 的ProtobufDecoder，ProtobufEncoder

### netty内置的编解码器
> 跟ChannelHandler适配器一样，编码解码器也有预定义的一些适配器。并且继承了ChannelInboundHandler或ChannelOutboundHandler

### 数据流流经编码器或解码器流向
> channelRead0方法已经被重写 -> 每个从入站数据读取的消息，都会调用此方法 -> 调用预置编码器的decode方法 -> 转发给channelpipeline的下一个ChannelHandler

出站消息则是入站消息的反方向

## SimpleChannelInboundHandler
> 最常见的情况是继承它，然后重写channelRead0方法，自定义业务处理逻辑。除了要求不阻塞当前IO线程

## 引导
> 为应用程序的网络层配置提供了容器

### ServerBootstrap
- 将一个进程绑定到指定端口
- 服务端使用
- 2个EventLoopGroup 一个用于服务器自身绑定到某个本地端口的正在监听到套接字、另外一个用于传入客户端连的channel
- 与ServerChannel相关联的EventLoopGroup将分配一个负责为传入连接请求创建Channel的EventLoop。一旦连接被建立，第二个EventLoopGroup就会给它的Channel分配EventLoop

### Bootstrap
- 将一个进程连接到另一个运行在指定主机的指定端口的进程
- 客户端使用
- 1个EventLoopGroup




