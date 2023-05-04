# ChannelHandler和ChannelPipeline
> 主要内容：channelHandler API和ChannelPipeline API、检测资源泄露、异常处理


## ChannelHandler

### Channel的生命周期
- Channel生命周期状态
   - ChannelUnregistered Channel已创建，未注册到EventLoop
   - ChannelRegistered Channel已创建，已注册到EventLoop
   - ChannelActive 活动状态，可以接受和发送数据
   - ChannelInactive Channel没有连接到远程节点

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/10.png" alt="png"> 

### ChannelHandler生命周期

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/11.png" alt="png"> 


## ChannelInBoundHandler
> **处理入站数据和各种状态变化**

ChannelInboundHandler的生命周期方法。这些方法将会在数据被接收时或者与其对应的Channel状态发生改变时被调用

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/12.png" alt="png"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/13.png" alt="png">

Netty为此提供了一个实用方法ReferenceCount-Util.release()显式地释放与池化的ByteBuf实例相关的内存

```java
@Sharable
public class DiscardHandler extends ChannelInboundHandlerAdapter {//扩展了Channel-InboundHandler-Adapter
　　@Override
　　public void channelRead(ChannelHandlerContext ctx, Object msg){  //  丢弃已接收的消息
　　　　ReferenceCountUtil.release(msg);　
　　}
}
```
**SimpleChannelInboundHandler会自动释放资源，不应该存储指向任何消息的引用供将来使用**


## ChannelOutBoundHandler
> **处理出站数据并允许拦截所有的操作**

> ChannelOutboundHandler的一个强大的功能是可以按需推迟操作或者事件，这使得可以通过一些复杂的方法来处理请求。例如，如果到远程节点的写入被暂停了，那么你可以推迟冲刷操作并在稍后继续

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/14.png" alt="png">


## ChannelHandler适配器
ChannelHandlerAdapter提供了实用方法isSharable()。如果其对应的实现被标注为Sharable，那么这个方法将返回true，表示它可以被添加到多个ChannelPipeline中
```java
   public boolean isSharable() {
        Class<?> clazz = this.getClass();
        Map<Class<?>, Boolean> cache = InternalThreadLocalMap.get().handlerSharableCache();
        Boolean sharable = (Boolean)cache.get(clazz);
        if (sharable == null) {
            sharable = clazz.isAnnotationPresent(Sharable.class);
            cache.put(clazz, sharable);
        }

        return sharable;
    }
```
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/15.png" alt="png">


## 资源管理
> 使用channelRead或write处理数据时，需要确保没有资源泄漏，Netty使用引用计数处理池化的ByteBuf，使用完ByteBuf后调整引用计数是非常重要的

**Netty提供ResourceLeakDetector用于检测**
> 可通过java -Dio.netty.leakDetectionLevel=ADVANCED 设置检测级别

```java
@Sharable
public class DiscardOutboundHandler
　　extends ChannelOutboundHandlerAdapter {//扩展了ChannelOutboundHandlerAdapter
　　@Override
　　public void write(ChannelHandlerContext ctx,
　　　　Object msg, ChannelPromise promise) {
　　　　ReferenceCountUtil.release(msg);　//通过使用R eferenceCountUtil.realse(...)方法释放资源
　　　　promise.setSuccess();　//通知ChannelPromise数据已经被处理了
　　}
}//要通知ChannelPromise。否则可能会出现Channel-FutureListener收不到某个消息已经被处理了的通知的情况
```

> 总之，如果一个消息被消费或者丢弃了，并且没有传递给ChannelPipeline中的下一个ChannelOutboundHandler，那么用户就有责任调用ReferenceCountUtil.release()。如果消息到达了实际的传输层，那么当它被写入时或者Channel关闭时，都将被自动释放。


## ChannelPipeline
> 新创建的Channel都将会被分配一个新的ChannelPipeline。这项关联是永久性的；Channel既不能附加另外一个ChannelPipeline，也不能分离其当前的。在Netty组件的生命周期中，这是一项固定的操作，不需要开发人员的任何干预

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/16.png" alt="png">

### 修改ChannelPipeline
> ChannelHandler可以添加，删除和替换其他ChannelHandler来修改ChannelPipeline，并且可移除自己

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/17.png" alt="png">

- ChannelHandler的执行和阻塞
    > “通常ChannelPipeline中的每一个ChannelHandler都是通过它的EventLoop（I/O线程）来处理传递给它的事件的。所以至关重要的是不要阻塞这个线程，因为这会对整体的I/O处理产生负面的影响。

   > 但有时可能需要与那些使用阻塞API的遗留代码进行交互。对于这种情况，ChannelPipeline有一些接受一个EventExecutorGroup的add()方法。如果一个事件被传递给一个自定义的EventExecutor- Group，它将被包含在这个EventExecutorGroup中的某个EventExecutor所处理，从而被从该Channel本身的EventLoop中移除。对于这种用例，Netty提供了一个叫DefaultEventExecutor- Group的默认实现。

### 触发事件
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/18.png" alt="png">
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/19.png" alt="png">

总结一下：
- ChannelPipeline保存了与Channel相关联的ChannelHandler；
- ChannelPipeline可以根据需要，通过添加或者删除ChannelHandler来动态地修改
- ChannelPipeline有着丰富的API用以被调用，以响应入站和出站事件


