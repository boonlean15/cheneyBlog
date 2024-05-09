# Condition Dubbo如何用管程实现异步转同步
Condition实现了管程模型中的条件变量，由于内置的管程模型只有一个条件变量，但实际可能需要多个条件变量。例如阻塞队列的实现，则需要2个

## Condition的使用
```java
public class BlockedQueue<T>{
  final Lock lock = new ReentrantLock();
  // 条件变量：队列不满  
  final Condition notFull = lock.newCondition();
  // 条件变量：队列不空  
  final Condition notEmpty = lock.newCondition();
  // 入队
  void enq(T x) {
    lock.lock();
    try {
      while (队列已满){
        // 等待队列不满
        notFull.await();
      }  
      // 入队操作...
      inQueue();
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
      // 出队操作...
      outQueue();
      //出队后，通知可入队
      notFull.signal();
    }finally {
      lock.unlock();
    }  
  }
}
```
- 方法调用的区别
- Lock 和 Condition 实现的管程，线程等待和通知需要调用 await()、signal()、signalAll()
- synchronized 实现的管程调用的是wait()、notify()、notifyAll()

## 同步和异步
通俗点来讲就是调用方是否需要等待结果，如果需要等待结果，就是同步；如果不需要等待结果，就是异步。

同步，是 Java 代码默认的处理方式。如果你想让你的程序支持异步，可以通过下面两种方式来实现
- 调用方创建一个子线程，在子线程中执行方法调用，这种调用我们称为异步调用；
- 方法实现的时候，创建一个新的线程执行主要逻辑，主线程直接 return，这种方法我们一般称为异步方法。

## Dubbo如何用管程实现异步转同步
TCP 协议本身就是异步的，工作中经常用到的 RPC 调用，在 TCP 协议层面，发送完 RPC 请求后，线程是不会等待 RPC 的响应结果的。

- RPC 框架 Dubbo 就给我们做了异步转同步的事情
```java
DemoService service = 初始化部分省略
String message = 
  service.sayHello("dubbo");
System.out.println(message);
```
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/condition/1.png" alt="png"> 

> 根据调用栈信息，Dubbo 异步转同步的功能应该是通过 DefaultFuture 这个类实现的；DubboInvoker 的 108 行调用了 DefaultFuture.get()
> 这一行先调用了 request(inv, timeout) 方法，这个方法其实就是发送 RPC 请求，之后通过调用 get() 方法等待 RPC 返回结果。
```java
public class DubboInvoker{
  Result doInvoke(Invocation inv){
    // 下面这行就是源码中108行
    // 为了便于展示，做了修改
    return currentClient 
      .request(inv, timeout)
      .get();
  }
}
```
Dubbo实现
```java
// 创建锁与条件变量
private final Lock lock = new ReentrantLock();
private final Condition done = lock.newCondition();

// 调用方通过该方法等待结果
Object get(int timeout){
  long start = System.nanoTime();
  lock.lock();
  try {
  while (!isDone()) {
    done.await(timeout);
      long cur=System.nanoTime();
    if (isDone() || 
          cur-start > timeout){
      break;
    }
  }
  } finally {
  lock.unlock();
  }
  if (!isDone()) {
  throw new TimeoutException();
  }
  return returnFromResponse();
}
// RPC结果是否已经返回
boolean isDone() {
  return response != null;
}
// RPC结果返回时调用该方法   
private void doReceived(Response res) {
  lock.lock();
  try {
    response = res;
    if (done != null) {
      done.signal();
    }
  } finally {
    lock.unlock();
  }
}
```
> 调用 get() 方法等待 RPC 返回结果，调用 lock() 获取锁，在 finally 里面调用 unlock() 释放锁；获取锁后，通过经典的在循环中调用 await() 方法来实现等待。

> 当 RPC 结果返回时，会调用 doReceived() 方法，调用 lock() 获取锁，在 finally 里面调用 unlock() 释放锁，获取锁后通过调用 signal() 来通知调用线程，结果已经返回，不用继续等待了。



