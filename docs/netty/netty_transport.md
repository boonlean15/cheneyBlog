# Netty 传输 Channel
netty所提供的广泛功能只依赖于少量接口

**Netty提供了一套API，阻塞和非阻塞传输都是一套代码**
> 相对比jdk的oio传输和nio传输，jdk的两套代码截然不同

## 传输API
**传输API的和核心是Channel接口**

每个channel都会被分配一个ChannelPipeline和ChannelConfig
> ChannelConfig包含了该Channel的所有配置，如果是特有的配置，则可能实现ChannelConfig的子类型、ChannelPipeline管理所有的ChannelHandler

**Netty的Channel实现是线程安全的**
> 可以保存一个Channel的引用，然后多个线程使用它。但需要注意的是：**消息将会被保证按顺序发送**

### ChannelPipeline
> channelpipeline持有所有应用于入站和出站数据以及事件的ChannelHandler实例

**ChannelHandler的典型用途**
> ChannelHandler实现了应用程序用于状态变化以及数据处理的逻辑
- 数据从一种格式转换为另一种格式
- 提供异常的通知
- 提供Channel变为活动和非活动的通知
- 提供当Channel注册到EventLoop和从EventLoop注销的通知
- 提供有关用户自定义事件的通知

## 内置的传输
netty内置了可开箱即用的传输，因为不是所有传输都支持所有协议

### netty提供的传输
- NIO  io.netty.channel.socket.nio 使用java.nio.channels包做基础--基于选择器的方式
- OIO  io.netty.channel.socket.oio 使用java.net包做基础--使用阻塞流
- Epoll io.netty.channel.epoll 由JNI驱动的epoll和非阻塞IO。支持只有在Linux上可用的多种特性，如SO_REUSEPORT，比NIO传输更快，而且是瓦全非阻塞的
- Local io.netty.channel.local 可以在VM内部通过管道进行通信的本地传输
- Embedded io.netty.channel.embedded Embedded传输，允许使用ChannelHandler而又不需要一个真正的基于网络的传输。在测试ChannelHandler实现时非常有用

## NIO--非阻塞I/O
- 基于JDK的NIO，介绍了JDK的NIO的实现原理Selector和对应的位模式以及流程
> 选择器Selector相当于一个注册表，可请求在Channel状态发生变化时得到通知。**选择器运行在一个检查状态变化并 对其做出相应响应的线程上，程序作出响应后，选择器被重置，并重复这个过程**
- 位模式
  - 新的Channel已被接受并且就绪  OP_ACCEPT 请求在接受新连接并创建Channel时获得通知
  - Channel连接已经完成 OP_CONNECT 请求在建立一个连接时获得通知
  - Channel有已经就绪的可供读取的数据 OP_READ 请求当数据已经就绪，可以从Channel中读取时获得通知
  - Channel可用于写数据 OP_WRITE 请求当可以向Channel写更多数据时获得通知 处理了套接字缓冲区被完全填满时的情况，通常发生在发送速度比远程节点处理速度更快的时候
- 零拷贝
   - 只有在NIO和Epoll传输时才可用的特性
   - 使你可以快速高效地将数据从文件系统移动到网络接口，而不需要将其从内核空间复制到用户空间 例如：FTP和HTTP协议中可显著提升性能
   - 并非所有操作系统都支持这一特性，例如：实现了数据加密和压缩文件的文件系统不可用。
   - 传输已被加密的文件则不是问题

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/selector_flow.jpg" alt="png"> 

## Epoll--用于Linux的本地非阻塞I/O
- Netty的NIO基于java提供的异步/非阻塞网络编程的通用抽象。保证了netty的NIO可以在任何平台使用，
- Linux的epoll：一个高度可拓展的I/O事件通知特性，比select和poll系统调用更好的性能，Linux JDK NIO API使用了epoll调用
- Netty为Linux提供了一组NIO API，以和它本身的设计更加一致的方式使用epoll，更加轻量的方式使用中断。
- 高负载下的性能优于JDK的NIO实现

> 传输语义跟selector图一样，使用的话只需要吧NIO改为Epoll即可，如EpollEventLoopGroup、EpollServerSocketChannel

## OIO--阻塞I/O
> 通过常规传输API使用，建立在java.net之上，不是异步的。
> java.net的服务器例子，通过new线程来处理每一个新连接

- Netty使用和用于异步传输相同的API来支持OIO
  > Netty利用了SO_TIMEOUT这个socket标志，它指定了等待一个I/O操作完成的最大毫秒数。如果操作在指定时间间隔内没有完成，则抛出一个SocketTimeoutException。Netty捕获这个异常并继续处理循环。在EventLoop的下一次运行时，再次尝试。
- 实际上也是类似Netty这样的异步框架能够支持OIO的唯一方式

  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/1.png" alt="png"> 


## Local--用于JVM内部通信的local传输
> Netty提供了一个Local传输，用于在同一个JVM中运行的客户端和服务器程序之间的异步通信。
- 不能够和其他传输实现进行互操作，客户端希望连接到使用了这个传输到服务器时页必须使用它
  > 和服务器channel相关联的SocketAddress并没有绑定物理网络地址；相反，只要服务器还在运行，就存储在注册表里，在channel关闭时注销。
- 除了上面的限制，使用方式和其他传输一摸一样

## Embedded传输--用于测试自己的ChannelHandler实现
> Netty提供了一种额外的传输，使得你可以将一组ChannelHandler作为帮助类嵌入到其他的ChannelHandler内部。**可以拓展一个ChannelHandler的功能，又不需要修改其内部代码**
- Embedded传输的关键是Channel实现的EmbeddedHandler

## 传输的用例
- 传输和其所支持的协议
   - 传输-------------TCP-----UDP-----SCTP------UDT
   - NIO--------------是------是-------是--------是
   - Epoll(Linux)------是------是-------否--------否
   - OIO--------------是------是-------是--------是
- RFC 2960 www.ietf.org/rfc/rfc2960.txt
- SCTP 流控制传输协议
- UDT 实现了基于UDP协议的可靠传输，https://zh.wikipedia.org/zh-cn/UDT

### 应用程序最佳传输
- 非阻塞代码库或一个常规的起点   NIO(或在Linux上使用epoll)
- 阻塞代码库    OIO
- 同一个JVM内部     Local
- 测试ChannelHandler的实现    Embedded