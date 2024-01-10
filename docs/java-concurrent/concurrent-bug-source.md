# 并发编程bug源头 - 可见性、原子性、有序性
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/studyjava.jpg" alt="png"> 

## 缓存导致的可见性问题
### 可见性
**可见性**一个线程对共享变量的操作，另一个线程可以立即看到，称为可见性
### 单核、多核CPU操作变量情况
- 单核
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/concurrentbugsource1.jpg" alt="png"> 

- 多核
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/concurrentbugsource2.jpg" alt="png"> 

> 我们假设线程 A 和线程 B 同时开始执行，那么第一次都会将 count=0 读到各自的 CPU 缓存里，执行完 count+=1 之后，各自 CPU 缓存里的值都是 1，同时写入内存后，我们会发现内存中是 1，而不是我们期望的 2。**表明，每一次操作，都会把结果写回内存中**


## 线程切换带来的原子性问题
### 原子性
**原子性**我们把一个或者多个操作在 CPU 执行的过程中不被中断的特性称为原子性

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/concurrentbugsource3.jpg" alt="png"> 

### 相关概念
- **时间片**
> 操作系统允许某个进程执行一小段时间，例如 50 毫秒，过了 50 毫秒操作系统就会重新选择一个进程来执行（我们称为“任务切换”），这个 50 毫秒称为“时间片”。
- **寄存器**
> cpu计算结果存储的地方
- **缓存**
> 为了协调内存速率加入的中间存储单元、CPU缓存使用的硬件和内存不同，读写速度更快但是成本更高。
- **线程的上下文**
> 每个线程都有自己的一组CPU寄存器，称之为线程的上下文，该上下文反映了线程上次运行该线程的CPU寄存器的状态。**jvm 程序计数器**
- **硬件原子性**
> 硬件支持 & 多核原子操作：软件级别的原子操作是依赖于硬件支持的。 在x86体系中，CPU提供了HLOCK pin引线，允许CPU在执行某一个指令(仅仅是一个指令)时拉低HLOCK pin引线的电位，直到这个指令执行完毕才放开。从而锁住了总线，如此在同一总线的CPU就暂时无法通过总线访问内存了，这样就保证了多核处理器的原子性。


### cpu和IO磁盘情况区别
- **cpu任务切换**
> 当持有CPU的进程进行IO读取的时候，会把当前CPU的使用权让出去（因为这个时候需要把IO读取到的内容加载到内存，CPU其实是在休眠状态），待内容读取进内存，操作系统再把休眠的进程唤醒，唤醒了之后再申请获取CPU的使用权，这个进程就得以继续工作。
>
> 早期操作系统，任务切换指进程切换(进程不共享内存空间、线程共享进程的内存空间)、现代操作系统，任务切换指线程切换，最新概念：协程
- **磁盘驱动**
> **磁盘驱动**不会像CPU一样切换进程任务，而是执行完一个之后再执行另一个，轮着来。**队列和堆栈是操作系统里面使用率比较高的数据结构**
- **高级语言里一条语句往往需要多条 CPU 指令完成**
> 例如：count += 1;需要3条指令。1:将count加载到寄存器 2：在寄存器中将count + 1 3：将结果写入内存
- **任务切换发生时机**
> 操作系统做任务切换，可以发生在任何一条 CPU 指令执行完，是的，是 CPU 指令，而不是高级语言里的一条语句

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/4.jpg" alt="png"> 


