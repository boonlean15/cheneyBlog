# 管程

## 概述
- 概念
> 管程：管理共享变量以及操作共享变量的过程，让他们支持并发

> java领域：管理类的成员变量和成员方法，让类是线程安全的
> > java1.5之前仅仅提供了synchronized、wait、notify、notifyAll

- 信号量等价于管程
> 管程可以实现信号量，信号量可以实现管程，管程更容易使用，java因此采用它

## 管程解决互斥的方式
- 例子：实现一个线程安全的队列
> 实现方式: 把共享变量和共享变量的操作过程封装起来。提供入队和出队的方法

<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/monitor/1.png" alt="png">

> 线程 A 和线程 B 如果想访问共享变量 queue，只能通过调用管程提供的 enq()、deq() 方法来实现；enq()、deq() 保证互斥性，只允许一个线程进入管程。

## 管程解决同步的方式
- MESA模型示意图
<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/monitor/2.png" alt="png">
- 1.共享变量和操作共享变量的过程被封装起来，同一时刻，只允许一个线程进入管程，类似挂号等待分诊
- 2.每个条件变量对应有一个等待队列(条件变量 A 和条件变量 B 分别都有自己的等待队列)，当线程条件不满足时，wait等待。类似需要检查报告，病人去做检查
- 3.当条件满足时，notify、notifyAll、唤醒通知线程，线程重新进入要进入管程区域的等待队列。类似病人检查完，需要重新分诊
- 4.当允许进入管程区域时，此时再次跟医生看病
> 阻塞队列和等待队列是不同的

```java
public class BlockedQueue<T>{
  final Lock lock =
    new ReentrantLock();
  // 条件变量：队列不满  
  final Condition notFull =
    lock.newCondition();
  // 条件变量：队列不空  
  final Condition notEmpty =
    lock.newCondition();

  // 入队
  void enq(T x) {
    lock.lock();
    try {
      while (队列已满){
        // 等待队列不满 
        notFull.await();
      }  
      // 省略入队操作...
      //入队后,通知可出队
      notEmpty.signal();
    }finally {
      lock.unlock();
    }
  }
  // 出队
  void deq(){
    lock.lock();
    try {
      while (队列已空){
        // 等待队列不空
        notEmpty.await();
      }
      // 省略出队操作...
      //出队后，通知可入队
      notFull.signal();
    }finally {
      lock.unlock();
    }  
  }
}
```
> await等价wait，single等价notify，singleAll等价notifyAll

## Hasen、Hoare、Mesa模型类比
- Hasen模型，当条件满足时，通知的代码需要放在最后，即当线程A通知线程B时，线程A已经执行结束
- Hoare模型，线程A通知线程B后，立刻阻塞，然后等待线程B执行结束，线程B执行结束后通知线程A，线程A再次执行
- Mesa模型，线程A通知线程B后线程A还会继续执行，线程B进入等待进入管程区域的队列。副作用，线程A再次进入管程区域时，可能条件是曾经满足。因此有wait范式代码
```java
while(条件不满足){
    wait();
}
```

## notify何时使用
- 所有线程的等待条件都相同时
- 被唤醒后，所有线程执行相同的操作
- 只需要唤醒一个线程

## 总结
管程是一个解决并发问题的万能钥匙，理论上所有的并发问题都可以用管程解决。java语言内置管程对mesa模型进行精简
<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/monitor/3.png" alt="png">

Mesa模型里，wait方法增加了参数，代表当等待足够时间后，去到等待进入管程区域的队列。避免条件不满足时，傻等