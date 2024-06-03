# executor 线程池
> 创建线程需要调用操作系统内核的API，然后操作系统要为线程分配一系列的资源，线程是一个重量级的对象，应该避免频繁的创建和销毁

> 线程池和其他池化资源不同，不能通过acquire/release方式获取资源和释放资源

## 线程池是一种生产者-消费者模式
- 线程池使用方是生产者，线程池本身是消费者
```java
//简化的线程池，仅用来说明工作原理
class MyThreadPool{
  //利用阻塞队列实现生产者-消费者模式
  BlockingQueue<Runnable> workQueue;
  //保存内部工作线程
  List<WorkerThread> threads = new ArrayList<>();
  // 构造方法
  MyThreadPool(int poolSize, 
    BlockingQueue<Runnable> workQueue){
    this.workQueue = workQueue;
    // 创建工作线程
    for(int idx=0; idx<poolSize; idx++){
      WorkerThread work = new WorkerThread();
      work.start();
      threads.add(work);
    }
  }
  // 提交任务
  void execute(Runnable command){
    workQueue.put(command);
  }
  // 工作线程负责消费任务，并执行任务
  class WorkerThread extends Thread{
    public void run() {
      //循环取任务并执行
      while(true){ ①
        Runnable task = workQueue.take();
        task.run();
      } 
    }
  }  
}

/** 下面是使用示例 **/
// 创建有界阻塞队列
BlockingQueue<Runnable> workQueue = new LinkedBlockingQueue<>(2);
// 创建线程池  
MyThreadPool pool = new MyThreadPool(10, workQueue);
// 提交任务  
pool.execute(()->{
    System.out.println("hello");
});
```
## Java 中的线程池
```java
ThreadPoolExecutor(
  int corePoolSize, 
  int maximumPoolSize,
  long keepAliveTime,
  TimeUnit unit,
  BlockingQueue<Runnable> workQueue,
  ThreadFactory threadFactory,
  RejectedExecutionHandler handler) 
```
类比做项目
- corePoolSize 线程池保有的最小线程数
  > 项目很闲，但是也不能把人都撤了，至少要留 corePoolSize 个人坚守阵地
- maximumPoolSize 线程池创建的最大线程数
  > 项目很忙时，就需要加人，但是也不能无限制地加，最多就加到 maximumPoolSize 个人,当项目闲下来时，就要撤人了，最多能撤到 corePoolSize 个人
- keepAliveTime & unit 一个线程如果在一段时间内，都没有执行任务，说明很闲，keepAliveTime 和 unit 就是用来定义这个“一段时间”的参数
  > 如果一个线程空闲了keepAliveTime & unit这么久，而且线程池的线程数大于 corePoolSize ，那么这个空闲的线程就要被回收了。
- workQueue 工作队列
- threadFactory 自定义如何创建线程
  > 例如你可以给线程指定一个有意义的名字。
- handler 自定义任务的拒绝策略 
  > 如果线程池中所有的线程都在忙碌，并且工作队列也满了（前提是工作队列是有界队列），那么此时提交任务，线程池就会拒绝接收。至于拒绝的策略，你可以通过 handler 这个参数来指定

## ThreadPoolExecutor 提供的4种拒绝策略
- CallerRunsPolicy：提交任务的线程自己去执行该任务
- AbortPolicy：默认的拒绝策略，会 throws RejectedExecutionException
- DiscardPolicy：直接丢弃任务，没有任何异常抛出
- DiscardOldestPolicy：丢弃最老的任务，其实就是把最早进入工作队列的任务丢弃，然后把新任务加入到工作队列
> Java 在 1.6 版本还增加了 allowCoreThreadTimeOut(boolean value) 方法，它可以让所有线程都支持超时，这意味着如果项目很闲，就会将项目组的成员都撤走

## 使用线程池注意事项
- 不建议使用 Executors
  > Executors 提供的很多方法默认使用的都是无界的 LinkedBlockingQueue，高负载情境下，无界队列很容易导致 OOM，而 OOM 会导致所有请求都无法处理，这是致命问题。所以强烈建议使用有界队列
- 默认拒绝策略要慎重使用
  > 使用有界队列，当任务过多时，线程池会触发执行拒绝策略，线程池默认的拒绝策略会 throw RejectedExecutionException 这是个运行时异常,对于运行时异常编译器并不强制 catch 它，所以开发人员很容易忽略.
  > 如果线程池处理的任务非常重要，建议自定义自己的拒绝策略；并且在实际工作中，自定义的拒绝策略往往和降级策略配合使用。
- 注意异常处理的问题
  > ThreadPoolExecutor 对象的 execute() 方法提交任务时，如果任务在执行的过程中出现运行时异常，会导致执行任务的线程终止；不过，最致命的是任务虽然异常了，但是你却获取不到任何通知，这会让你误以为任务都执行得很正常
  
  > 最稳妥和简单的方案还是捕获所有异常并按需处理
```java
try {
  //业务逻辑
} catch (RuntimeException x) {
  //按需处理
} catch (Throwable x) {
  //按需处理
} 
```
- 给线程赋予一个有意义的名字
```java
public class ReNameThreadFactory implements ThreadFactory {
    /**
     * 线程池编号（static修饰）(容器里面所有线程池的数量)
     */
    private static final AtomicInteger POOLNUMBER = new AtomicInteger(1);
    /**
     * 线程编号(当前线程池线程的数量)
     */
    private final AtomicInteger threadNumber = new AtomicInteger(1);
    /**
     * 线程组
     */
    private final ThreadGroup group;
    /**
     * 业务名称前缀
     */
    private final String namePrefix;
    /**
     * 重写线程名称（获取线程池编号，线程编号，线程组）
     *
     * @param prefix 你需要指定的业务名称
     */
    public ReNameThreadFactory(@NonNull String prefix) {
        SecurityManager s = System.getSecurityManager();
        group = (s != null) ? s.getThreadGroup() : Thread.currentThread().getThreadGroup();
        //组装线程前缀
        namePrefix = prefix + "-poolNumber:" + POOLNUMBER.getAndIncrement() + "-threadNumber:";
    }
    @Override
    public Thread newThread(Runnable r) {
        Thread t = new Thread(group, r,
                //方便dump的时候排查（重写线程名称）
                namePrefix + threadNumber.getAndIncrement(),
                0);
        if (t.isDaemon()) {
            t.setDaemon(false);
        }
        if (t.getPriority() != Thread.NORM_PRIORITY) {
            t.setPriority(Thread.NORM_PRIORITY);
        }
        return t;
    }
}
```

