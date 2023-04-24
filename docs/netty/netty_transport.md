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

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/markdown/selector_flow.png" alt="png"> 

## OIO--阻塞I/O

## Epoll--用于Linux的本地非阻塞I/O

## Local--用于JVM内部通信的local传输

## Embedded传输--用于测试自己的ChannelHandler实现

## 传输示例
