# EventLoop和线程模型

## 线程模型概述
> 线程模型指定了操作系统、框架、或应用程序的上下文的线程管理。线程模型确定了代码的执行方式。我们必须规避并发执行带来的副作用，所以理解所采用的并发模型的影响非常重要。

> 多核心和多CPU的计算机已经很普遍，大多数现代应用程序都利用了复杂的多线程并发处理技术以有效的利用系统资源。java5引入了线程池

### 基本的线程池化模式
- 从池的线程空闲列表中选择一个Thread，指派它运行一个已经提交的任务runable
- 任务完成时，将它返回给列表，使其可以重用

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/25.png" alt="png">

### 多线程处理是复杂的
> 虽然池化和重用线程相对于简单地为每个任务都创建和销毁线程是一种进步，但是它并不能消除由上下文切换所带来的开销，其将随着线程数量的增加很快变得明显，并且在高负载下愈演愈烈。此外，仅仅由于应用程序的整体复杂性或者并发需求，在项目的生命周期内也可能会出现其他和线程相关的问题。
简而言之，多线程处理是很复杂的

## EventLoop接口

### 事件循环
> 运行任务来处理在连接的生命周期内发生的事件是任何网络框架的基本功能。相应的编程上的构造通常被称为事件循环-netty使用eventLoop适配事件循环

- 事件循环的基本思想，事件循环中执行任务：
```java
while (!terminated) {
　List<Runnable> readyEvents = blockUntilEventsReady();　 //阻塞，直到有事件已经就绪可被运行
　 for (Runnable ev: readyEvents) {
　　　ev.run();　//循环遍历，并处理所有的事件
　 }
}
```
### EventLoop 概述
#### eventloop是协同设计的一部分，使用了两个基本API：并发和网络编程
- io.netty.util.concurrent 包构建在java.util.concurrent包上，以提供线程执行器
- io.netty.channel 为了与channel的事件进行交互，扩展这些接口
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/26.png" alt="png">

#### EventLoop 层次结构
- 一个EventLoop由一个不变的Thread驱动，同时任务(runable/callable)可以直接提交给EventLoop实现
- 配置和可用核心不同，可能创建多个EventLoop实例用以优化资源的使用，单个EvnetLoop可能被指派服务多个Channel
- 继承ScheduleExecutorService的同时，定义parent()方法返回当前EventLoop实现的实例所属的EventLoopGroup的引用
  ```java
    public interface EventLoop extends EventExecutor, EventLoopGroup {
    　　@Override
    　　EventLoopGroup parent();
    }
  ```
**事件/任务的执行顺序**
> 事件和任务是以先进先出（FIFO）的顺序执行的。这样可以通过保证字节内容总是按正确的顺序被处理，消除潜在的数据损坏的可能性

### Netty4中的I/O和事件处理
- IO操作触发的事件将流经ChannelPipeline，可以被ChannelHandler所拦截，并按需处理
- 事件的性质通常决定了它将被如何处理，可能数据传递到你的应用程序，可能进行逆向操作或其他一些操作
- **事件处理逻辑必须足够灵活和通用，Netty4中，所有的IO操作和事件都由分配给EventLoop的Thread处理**

### Netty3中的I/O操作
- 入站事件由IO操作的线程处理，出站事件由调用线程处理
- 调用线程需要保证当Channel.write等操作在多个线程被调用时的线程安全问题
- exceptionCause是入站事件，由出站事件引起的异常导致触发入站事件，入站事件由IO操作的线程处理，增加了上下文切换的开销

**同一个线程中处理某个给定的EventLoop中所产生的所有事件，提供了更加简单的执行体系，消除了在多个ChannelHandler中进行同步的需要(除了可能需要在多个Channel中共享的)**


## 任务调度

### JDK的任务调度API
java5之前使用Timer类，java5开始提供了线程池，可以通过线程池实现任务调度
```java
ScheduledExecutorService executor = Executors.newScheduledThreadPool(10); // 创建一个其线程池具有10 个线程的ScheduledExecutorService
ScheduledFuture<?> future = executor.schedule(
　　new Runnable() {
　　@Override
　　public void run() {
　　　　System.out.println("60 seconds later"); //该任务要打印的消息
　　}
}, 60, TimeUnit.SECONDS); //调度任务在从现在开始的60 秒之后执行
executor.shutdown(); //一旦调度任务执行完成，就关闭ScheduledExecutorService 以释放资源
```
#### 局限性
- 作为线程池管理的一部分，将会有额外的线程创建。
- 如果有大量任务被紧凑的调度，那么这将成为一个瓶颈

### 使用EventLoop调度任务
- Netty通过Channel的EventLoop实现任务调度解决了JDK任务调度的瓶颈
- Netty的EventLoop扩展了ScheduleExecutorService，所以它提供了JDK实现可用的所有方法
- 要想取消或者检查（被调度任务的）执行状态，可以使用每个异步操作所返回的ScheduledFuture

**EventLoop调度任务的用法**
```java
Channel ch = ...
ScheduledFuture<?> future = ch.eventLoop().scheduleAtFixedRate(//创建一个Runnable，以供调度稍后执行 
　　new Runnable() {
　　@Override
　　public void run() {
　　　　System.out.println("Run every 60 seconds");//这将一直运行，直到ScheduledFuture 被取消
　　}
}, 60, 60, TimeUnit.Seconds);//调度在60 秒之后，并且以后每间隔60 秒运行
future.cancel(false);//取消该任务，防止它再次运行
```

## 实现细节

### 线程管理
> Netty线程模型的卓越性能取决于对于当前执行的thread的身份的确定，确定它是否是分配给当前Channel以及它的EventLoop的那一个线程。**EventLoop负责处理一个Channel的整个生命周期内的所有事件**

- 每个EventLoop都有自己的任务队列，独立于其他EventLoop
- EventLoop确定线程thread的调度细节
   > 如果当前调用线程正是支撑EventLoop的线程，那么所提交的代码块将会被直接执行。否则，EventLoop将调度该任务以便稍后执行，并将它放入到内部队列中。当EventLoop下次处理它的事件时，它会执行队列中的那些任务/事件。这也就解释了任何的thread是如何与Channel直接交互而无需在ChannelHandler中进行额外的同步的。

**EventLoop调度任务的执行逻辑，也是Netty的线程模型的关键组成部分**
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/27.png" alt="png">

### EventLoop/线程的分配
#### 异步IO

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/28.png" alt="png">

> 一个EventLoop对应一个线程，一个EventLoop可以分配给多个channel，一个channel只对应跟一个EventLoop。另外，需要注意的是，EventLoop的分配方式对ThreadLocal的使用的影响。因为一个EventLoop通常会被用于支撑多个Channel，所以对于所有相关联的Channel来说，ThreadLocal都将是一样的

#### 同步IO

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/29.png" alt="png">

> 每个channel对应分配一个eventLoop，一个eventloop对应一个thread


