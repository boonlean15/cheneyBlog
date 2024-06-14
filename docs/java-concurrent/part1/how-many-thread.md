# 创建多少线程合适
多线程使用简单，但创建多少线程合适，例如tomcat线程，jdbc连接数多少合适
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/how-many-thread/1.png" alt="png">

## 为什么使用多线程
- 延迟
- 吞吐量
同等条件下，延迟越低，吞吐量越大。提升性能就是降低延迟，提高吞吐量

## 多线程应用场景
- 优化算法 (算法层面)
- 将硬件性能发挥到极致 (并发编程层面)，提升性能本质是提升硬件的利用率(提升cpu利用率，提升IO利用率)
> 操作系统解决硬件的利用率问题，大部分情况是面向单个对象解决的，而我们需要提升cpu和I/O设备的综合利用率。操作系统提供了方案：多线程

示例：
> 如何利用多线程来提升 CPU 和 I/O 设备的利用率？假设程序按照 CPU 计算和 I/O 操作交叉执行的方式运行，而且 CPU 计算和 I/O 操作的耗时是 1:1。
> > 如下图所示，如果只有一个线程，执行 CPU 计算的时候，I/O 设备空闲；执行 I/O 操作的时候，CPU 空闲，所以 CPU 的利用率和 I/O 设备的利用率都是 50%。
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/how-many-thread/2.png" alt="png">
> 如果有两个线程，如下图所示，当线程 A 执行 CPU 计算的时候，线程 B 执行 I/O 操作；当线程 A 执行 I/O 操作的时候，线程 B 执行 CPU 计算，这样 CPU 的利用率和 I/O 设备的利用率就都达到了 100%。
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/how-many-thread/3.png" alt="png">

**如果 CPU 和 I/O 设备的利用率都很低，那么可以尝试通过增加线程来提高吞吐量。**
- 纯cpu计算，单核时代，多线程会降低性能，因为多了线程切换。多核时代，多线程可以提升性能，因为分工后，可以降低响应时间，
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/how-many-thread/4.png" alt="png">

## 创建多少线程合适
### CPU密集型
- 只有cpu计算的程序，线程数=cpu核心数,可以是cpu利用率达到百分百
- 只有cpu计算的程序，(线程数=cpu核心数+1)，+1可以在当线程因为偶尔的内存页失效或其他原因导致阻塞时，另外这个线程可以顶上
### IO密集型
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/how-many-thread/5.png" alt="png">

- 线程数=1+IO耗时/CPU耗时 单核
- 线程数=cpu核心数*(1+IO耗时/CPU耗时)

## 总结
- 多少线程数合适：核心原则是将硬件的性能提升到极致
- 理论上的最佳公式，公式背后的目标其实就是将硬件的性能发挥到极致。
- IO耗时和CPU耗时是动态变化的，所以工程上，我们要估算这个参数，然后做各种不同场景下的压测来验证我们的估计。
- 最佳线程数的设置积累了一些经验值，认为对于 I/O 密集型应用，最佳线程数应该为：2 * CPU 的核数 + 1 (工作中都是按照逻辑核数来的，理论值和经验值只是提供个指导，实际上还是要靠压测！！！) 
