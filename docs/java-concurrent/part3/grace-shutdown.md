# 优雅的终止线程
## 两阶段终止模式
- 线程 T1 向线程 T2发送终止指令
- 线程 T2响应终止指令 
- Java 线程进入终止状态的前提是线程进入 RUNNABLE 状态，而实际上线程也可能处在休眠状态

### interrupt() 
- interrupt() 方法，它可以将休眠状态的线程转换到 RUNNABLE 状态
### 响应终止指令
- RUNNABLE 状态转换到终止状态，优雅的方式是让 Java 线程自己执行完 run() 方法
  > 一般我们采用的方法是设置一个标志位，然后线程会在合适的时机检查这个标志位，如果发现符合终止条件，则自动退出 run() 方法。这个过程其实就是我们前面提到的第二阶段：响应终止指令。

## 两阶段终止模式终止监控操作
- start() 方法会启动一个新的线程 rptThread 来执行监控数据采集和回传的功能
- stop() 方法需要优雅地终止线程 rptThread

```java
class Proxy {
  boolean started = false;
  //采集线程
  Thread rptThread;
  //启动采集功能
  synchronized void start(){
    //不允许同时启动多个采集线程
    if (started) {
      return;
    }
    started = true;
    rptThread = new Thread(()->{
      while (!Thread.currentThread().isInterrupted()){
        //省略采集、回传实现
        report();
        //每隔两秒钟采集、回传一次数据
        try {
          Thread.sleep(2000);
        } catch (InterruptedException e){
          //重新设置线程中断状态
          Thread.currentThread().interrupt();
        }
      }
      //执行到此处说明线程马上终止
      started = false;
    });
    rptThread.start();
  }
  //终止采集功能
  synchronized void stop(){
    rptThread.interrupt();
  }
}
```

## 正确的终止线程
- 原因在于我们很可能在线程的 run() 方法中调用第三方类库提供的方法
- 没有办法保证第三方类库正确处理了线程的中断异常
- 第三方类库在捕获到 Thread.sleep() 方法抛出的中断异常后，没有重新设置线程的中断状态，那么就会导致线程不能够正常终止

```java
/**
 * 无论是否正确处理了线程的中断异常，都不会影响线程优雅地终止
*/
class Proxy {
  //线程终止标志位
  volatile boolean terminated = false;
  boolean started = false;
  //采集线程
  Thread rptThread;
  //启动采集功能
  synchronized void start(){
    //不允许同时启动多个采集线程
    if (started) {
      return;
    }
    started = true;
    terminated = false;
    rptThread = new Thread(()->{
      while (!terminated){
        //省略采集、回传实现
        report();
        //每隔两秒钟采集、回传一次数据
        try {
          Thread.sleep(2000);
        } catch (InterruptedException e){
          //重新设置线程中断状态
          Thread.currentThread().interrupt();
        }
      }
      //执行到此处说明线程马上终止
      started = false;
    });
    rptThread.start();
  }
  //终止采集功能
  synchronized void stop(){
    //设置中断标志位
    terminated = true;
    //中断线程rptThread
    rptThread.interrupt();
  }
}
```

## 优雅地终止线程池
Java 领域用的最多的还是线程池，而不是手动地创建线程
- shutdown()
- shutdownNow()
> 前者只影响阻塞队列接收任务，后者范围扩大到线程池中所有的任务。

### shutdown()
> shutdown() 方法是一种很保守的关闭线程池的方法。线程池执行 shutdown() 后，就会拒绝接收新的任务，但是会等待线程池中正在执行的任务和已经进入阻塞队列的任务都执行完之后才最终关闭线程池。

### shutdownNow()
> 相对就激进一些了，线程池执行 shutdownNow() 后，会拒绝接收新的任务，同时还会中断线程池中正在执行的任务，已经进入阻塞队列的任务也被剥夺了执行的机会，不过这些被剥夺执行机会的任务会作为 shutdownNow() 方法的返回值返回。因为 shutdownNow() 方法会中断正在执行的线程，所以提交到线程池的任务，如果需要优雅地结束，就需要正确地处理线程中断

- 《Java 并发编程实战》这本书第 7 章《取消与关闭》的“shutdownNow 的局限性”一节中，提到一种将已提交但尚未开始执行的任务以及已经取消的正在执行的任务保存起来，以便后续重新执行的方案