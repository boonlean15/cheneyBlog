# 高性能队列Disruptor
ArrayBlockingQueue和LinkedBlockingQueue队列是基于ReentrantLock实现的有界队列，高并发场景下，锁的效率不高。

Disruptor是一款高性能的有界内存队列，应用广泛：Log4j2，spring messaging，HBase，Storm等

## Disruptor的高效原因
- 内存分配更加合理，使用RingBuffer数据结构，数组元素在初始化时一次性全部创建，提升缓存命中率；对象循环利用，避免频繁GC
- 能避免伪共享，提升缓存命中率
- 采用无锁算法，避免频繁加锁、解锁的性能消耗
- 支持批量消费，消费者可以无锁方式消费多个消息

## Disruptor使用示例
- Disruptor生产者生产的对象，称为Event，必须自定义Event对象
- 构建Disruptor对象除了要指定队列的大小，还要传入一个EventFactory
- 消费Disruptor中的Event通过handleEventsWith方法注册一个事件处理器，发布Event通过publishEvent方法

```xml
<!-- https://mvnrepository.com/artifact/com.lmax/disruptor -->
<dependency>
    <groupId>com.lmax</groupId>
    <artifactId>disruptor</artifactId>
    <version>4.0.0</version>
</dependency>
```
```java
package com.cheney.concurrentcase;

import com.lmax.disruptor.RingBuffer;
import com.lmax.disruptor.dsl.Disruptor;
import com.lmax.disruptor.util.DaemonThreadFactory;
import java.nio.ByteBuffer;

public class DisruptorDemo {
    public static void main(String[] args) {
        //指定RingBuffer大小,
        //必须是2的N次方
        int bufferSize = 1024;
        //构建Disruptor
        Disruptor<LongEvent> disruptor = new Disruptor<>(LongEvent::new,bufferSize,DaemonThreadFactory.INSTANCE);
        //注册事件处理器
        disruptor.handleEventsWith((event, sequence, endOfBatch) -> System.out.println("E: "+event));
        //启动Disruptor
        disruptor.start();
        //获取RingBuffer
        RingBuffer<LongEvent> ringBuffer = disruptor.getRingBuffer();
        //生产Event
        ByteBuffer bb = ByteBuffer.allocate(8);
        for (long l = 0; true; l++){
            bb.putLong(0, l);
            //生产者生产消息
            ringBuffer.publishEvent((event, sequence, buffer) -> event.set(buffer.getLong(0)), bb);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

## RingBuffer如何提升性能
### 程序局部性原理
程序局部性原理指的是在一段时间内程序的执行会限制在一个局部范围内
- 时间局部性 
  > 程序中某条指令一旦被执行，不久之后这条指令很可能再次被执行;如果某条数据被访问，不久之后，这条数据很可能再次被访问
- 空间局部性
  > 指某块内存一旦被访问，不久之后，这块内存附近的内存也很可能被访问
- CPU缓存利用了程序局部性原理
  > CPU 从内存中加载数据 X 时，会将数据 X 缓存在高速缓存 Cache 中，实际上 CPU 缓存 X 的同时，还缓存了 X 周围的数据，因为根据程序具备局部性原理，X 周围的数据也很有可能被访问。

  > 从另外一个角度来看，如果程序能够很好地体现出局部性原理，也就能更好地利用 CPU 的缓存，从而提升程序的性能。

### ArrayBlockingQueue和Disruptor初始化元素对比
- ArrayBlockingQueue添加元素,添加元素是生产者线程创建的.添加元素的时间是离散的，put元素的地址大概率也是分散的
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/31.png" alt="png">

- Disruptor初始化时是一次性添加的，元素的内存地址大概率是连续的
  - 除此之外，在 Disruptor 中，生产者线程通过 publishEvent() 发布 Event 的时候，并不是创建一个新的 Event，而是通过 event.set() 方法修改 Event， 也就是说 RingBuffer 创建的 Event 是可以循环利用的，这样还能避免频繁创建、删除 Event 导致的频繁 GC 问题。
  - 具体来说 Disruptor 的原理就是想初始化所有的内容 当我们发布*内容*时，并不是new而是event.set(), 并且初始化位置上所有的Event对象是 重复使用的，避免创建、删除频繁GC
  - 核心就是减少创建、销毁对象的开销，并通过预创建空间达到内存连续存储，以此来减少cpu cache读取内存的次数。空间一早就创建好了，只是将内容写进空间。

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/32.png" alt="png">

```java
for (int i=0; i<bufferSize; i++){
  //entries[]就是RingBuffer内部的数组
  //eventFactory就是前面示例代码中传入的LongEvent::new
  entries[BUFFER_PAD + i] 
    = eventFactory.newInstance();
}
```
  > RingBuffer提升性能：数组中所有元素内存地址连续，根据程序局部性原理，当消费第一个元素1时，元素周围的其他元素也被加载进CPU缓存Cache中。
  > 程序局部性原理，当消费元素1时，元素1周围的其他元素也很可能被消费，由于已经加载到CPU缓存Cache中了，所以不需要再从内存中加载元素，大大提升了性能。

### CPU 内部 Cache
Cache内部是按照缓存行管理的，缓存行大小通常是64个字节；CPU从内存中加载数据X，会把X后面的64-Size字节的数据也同时加载到Cache中

### 伪共享
示例：
<img width="800" height="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/33.png" alt="png">

> 假设线程 A 运行在 CPU-1 上，执行入队操作，入队操作会修改 putIndex，而修改 putIndex 会导致其所在的所有核上的缓存行均失效；
> 此时假设运行在 CPU-2 上的线程执行出队操作，出队操作需要读取 takeIndex，由于 takeIndex 所在的缓存行已经失效，所以 CPU-2 必须从内存中重新读取。
> 入队操作本不会修改 takeIndex，但是由于 takeIndex 和 putIndex 共享的是一个缓存行，就导致出队操作不能很好地利用 Cache，这其实就是伪共享

> putIndex和其他变量被读取进缓存（在不同的CPU核上的同一缓存行，没有修改的话在不同的CPU核上是一致的），同一缓存行的其中一个变量修改都会使全部的（不同的CPU核的）缓存行失效

**伪共享指的是由于共享缓存行导致缓存无效的场景。**


### 避免伪共享
- 方案很简单，每个变量独占一个缓存行、不共享缓存行就可以了，具体技术是缓存行填充。
    > 比如想让 takeIndex 独占一个缓存行，可以在 takeIndex 的前后各填充 56 个字节，这样就一定能保证 takeIndex 独占一个缓存行。
    > 下面的示例代码出自 Disruptor，Sequence 对象中的 value 属性就能避免伪共享，因为这个属性前后都填充了 56 个字节。
    > Disruptor 中很多对象，例如 RingBuffer、RingBuffer 内部的数组都用到了这种填充技术来避免伪共享
```java
//前：填充56字节
class LhsPadding{
    long p1, p2, p3, p4, p5, p6, p7;
}
class Value extends LhsPadding{
    volatile long value;
}
//后：填充56字节
class RhsPadding extends Value{
    long p9, p10, p11, p12, p13, p14, p15;
}
class Sequence extends RhsPadding{
  //省略实现
}
```