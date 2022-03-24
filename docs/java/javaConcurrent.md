# 并发

操作系统将CPU的时间片分配给每一个进程，给人一种并行处理的感觉。并发执行的进程数不是由CPU数目制约的
- 进程：例如一个应用程序，进程有独立的自己的一整套变量。例如：浏览器是一个进程，qq是一个进程
- 线程：一个多线程的程序，线程共享进程的变量。例如，浏览器可以同时下载多个图片，qq可以聊天同时发送文件

## 1.什么是线程
hread.sleep();暂停当前线程
> Thread  static void sleep(long millis)
>> 休眠指定的毫秒数  参数mills 休眠的毫秒数

### 使用线程

1. 实现Runable，由于Runable只有一个run方法，可以直接使用lambda表达式，Runable r = () -> {task code};
2. Thread t = new Thread(r); 把runable放到Thread
3. t.start();　　Thread.start();方法将创建一个执行run方法的新线程
4. 一直给任务创建线程，付出的代价太大，应该使用线程池
- Thread  
   - Thread(Runable target)
   > 构造一个新的线程，用于调用给定目标的run方法
   - void start()
   > 启动这个线程，将引发调用run方法。这个方法将立即返回，并且新线程将并发执行
   - void run()
   > 调用关联Runable的run方法
- Runable
   - void run()
   > 必须覆盖这个方法，并在这个方法提供所要执行的任务指令

通过继承Thread的方式，然后new一个Thread子类，调用start方法，这种方法不再推荐

## 2.中断线程

### 1.线程终止

当run方法体的最后一行代码执行完毕，并经由return语句返回，或者方法中出现异常未捕获

### 2.没有可以强制线程终止的方法
interrupt方法可以用来请求终止线程

### interrupt：改变线程的中断状态

1. Thread.currentThread.isInterrupt可以获取中断状态
2. 线程被阻塞，无法检测中断状态，如果在一个阻塞的线程中调用interrupt，阻塞调用(如：Thread.sleep)将会被Interrupt Exception异常中断，`sleep的时候调用interrupt，Interrupt Exception`
3. **中断只是引起线程的注意，线程可以决定何时响应中断**
4. 一些重要的线程，会处理完中断异常后继续执行，普遍的情况(大部分线程的情况)：线程把中断作为终止的请求，然后终止线程
5. 中断异常出现时，一般Thread.currentTread.interrupt();设置中断状态。或者直接throws InterruptException
6. 普遍的情况：`中断调用后，线程终止`
>下面的方法，Thread.sleep被中断异常打断，try catch了，然后继续执行，即特殊的重要线程这么使用
       
```java
    @Test
    public void testInterrupt() {
        Runnable r = () -> {
          for(int i = 0; i < 100000; i++){
              log.info("i ----- " + i);
              if(i == 10){
                  try {
                      Thread.sleep(10000);
                  } catch (InterruptedException e) {
                      e.printStackTrace();
                      log.info("线程中断异常");
                  }
              }
          }
        };
        Thread thread = new Thread(r);
        thread.start();
        thread.interrupt();
    }
```    
- Thread
   - void interrupt()
   > 向线程发送中断请求。线程的中断状态将被设置为true。如果目前该线程被一个sleep调用阻塞，那么，Interrupt Exception异常将被抛出
   - static boolean interrupted()
   > 测试当前线程（正在执行这一命令的线程）是否被中断。注意，这是一个静态方法，这一调用会产生副作用，它将当前线程的中断状态重置为false
   - boolean isInterrupted
   > 测试线程是否被终止。不像静态的中断方法，这一调用不改变线程的中断状态
   - static Thread currentThread()
   > 返回代表当前执行线程的Thread对象

## 3.线程状态  

线程可以有如下6种状态：

- new 新创建
- Runable 可运行
- blocked 被阻塞
- waiting 等待
- time waiting 计时等待
- terminate 被终止

获取线程的状态：可通过getState方法获取

1. **new 新创建** 　　new Thread(r) ，还未运行线程中的代码
2. **runable 可运行**   t.start 一旦调用，线程处于可运行状态。可运行状态的线程，可能运行中，可能没有运行，取决于操作系统给线程提供运行的时间 
   > 抢占式调度系统给每一个线程一个时间片来执行任务，时间片时间用完，剥夺该线程的运行权，多处理器同理。手机部分协同处理系统只有调用yield的时候，线程失去运行权限 
3. **blocked 被阻塞**   当线程获取一个内部的对象锁时，锁被其他线程持有，进入阻塞状态。当所有其他线程释放该锁，并且线程调度器允许它持有锁的时候，才转为非阻塞状态
4. **waiting 等待**  当线程等待另一个线程通知调度器一个条件时，它自己进入等待状态。调用Object.wait/Thread.join或者等待java.util.concurrent库中的Lock或Condition时。被阻塞和等待状态有很大不同
5. **time waiting 计时等待**   有些方法有超时参数，调用它们后进入计时等待。直到时间满或者接收到适当的通知。
   >Thread.sleep,Object.await,Thread.join,Lock.tryLock,Condition.await计时版方法
6. **terminate 被终止**　　run方法正常退出死亡/ 因为未捕获异常终止run方法死亡  可以调用stop方法杀死线程，但已经过时，不建议使用。

- - join方法：当调用join方法时，调用的线程对象进入等待状态
  > 如：调用的current线程是main主线程，进入了等待，时间到后，继续后面的log打印

```java
    public static void main(String[] args) throws InterruptedException {
        Runnable r = () -> {
            for(int i = 0; i < 1000; i++){
                log.info("i ----- " + i);
                if(i == 10){
                    try {
                        Thread.sleep(10000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        };
        Thread current = Thread.currentThread();
        String name = Thread.currentThread().getName();
        log.info("currentThread name --- " + name);
        Thread rThread = new Thread(r);
        rThread.start();
        log.info("rThread name start ---- " + rThread.getName());
        log.info("current thread name  ----- " + current.getName());
        current.join(5000);
        log.info("current thread join log ---- " + current.getName());
    }
```
```
JavaFirstTest ---- currentThread name --- main
JavaFirstTest ---- i ---- 0...
JavaFirstTest ---- i ---- 10
JavaFirstTest ---- current thread join log ---- main
```

### 线程状态的转换

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent1.jpg" alt="jpg">

- Thread
   - void join 
   > 等待终止指定的线程
   - void join(long millis)
   > 等待指定线程死亡，或者经过指定毫秒数
   - Thread.State getState() 
   > 得到线程的状态 NEW RUNNABLE BLOCKED WAITING TIMED_WAITING TERMINATED
   - void stop()
   > 停止该线程 --- 已经过时
   - void suspend（）
   > 暂停这一线程  --- 已经过时
   - void resume()
   > 恢复线程、仅在suspend方法之后调用 --- 已经过时

## 4.线程属性

### 1.线程优先级

- 每一个线程都有一个优先级，一个线程继承它父线程的优先级。线程调度器选择线程执行时，优先选择优先级别高的线程执行
- 可以通过setPriority设置线程的优先级别，minpriority为1，maxpriority为10，默认的normpriority为5.
- jvm运行在宿主机平台上时，会把优先级映射到宿主机的优先级。windows有7个级别，oracle提供的linux的jvm没有优先级，被忽略了。
- **不要将程序构建的正确性依赖于线程的优先级**

- Thread
   - void setpriority(int newPriority)
   > 设置线程优先级
   - static int Min_Priority
   > 线程的最小优先级 为1
   - NORMAL 为5 
   - MAX 为10   
   - static void yield()
   > 导致当前执行线程处于让步状态。如果有其他可运行线程具有至少与此线程同样高的优先级，那么这些线程将被调用。这是一个静态方法

### 2.守护线程

t.setDaemon(true)设置为守护线程，作用是服务于其他线程，如果只剩下守护线程，jvm就退出了。计时线程是一个例子，发送计时器滴答信号给其他线程或者清空过时高速缓存项的线程。

守护线程不该访问文件或者数据库等固有资源，因为会在某一时刻就中断了。

- setDaemon方法必须在线程启动前调用
  
### 3.未捕获异常处理器

- 线程的run方法不能抛出任何受查异常
- 不需要任何catch子句来处理可以被传播的异常。在线程死亡之前，异常被传递到一个用于未捕获异常的处理器
- 该处理器必须实现Thread.UncatchExceptionHandler接口，它的unCatchException方法指定了处理的方式
- 可以设置线程的单独未捕获异常处理器，或者Thread.setDefaultUncatchExceptionHandler设置所有线程的默认处理器。如果没有指定处理器，则默认使用ThreadGroup线程组
- 引入了更好特性用于线程集合的操作，不要在自己的程序中使用线程组ThreadGroup
  
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent2.jpg" alt="jpg">

```java
    public static void main(String[] args) throws InterruptedException {
        Runnable r = () -> {
            for(int i = 0; i < 1000; i++){
                log.info("i ----- " + i);
                if(i == 10){
//                    try {
//                        Thread.sleep(10000);
//                    } catch (InterruptedException e) {
//                        e.printStackTrace();
//                    }
                   int j = i / 0;
                }
            }
        };
        MyThreadUnCatchHandler myThreadUnCatchHandler = new MyThreadUnCatchHandler();

        Thread current = Thread.currentThread();
        String name = Thread.currentThread().getName();
        log.info("currentThread name --- " + name);
        Thread rThread = new Thread(r);
        rThread.setUncaughtExceptionHandler(myThreadUnCatchHandler);

        log.info("rThread name start ---- " + rThread.getName());
        log.info("current thread name  ----- " + current.getName());

        rThread.start();
        current.join( 100);
        log.info("current thread join log ---- " + current.getName());

    }

    static class MyThreadUnCatchHandler implements Thread.UncaughtExceptionHandler{

        @Override
        public void uncaughtException(Thread t, Throwable e) {
            StackTraceElement[] stackTrace = t.getStackTrace();
            log.info("print exception log ----- " + Arrays.toString(stackTrace));
        }
    }
```    
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent3.jpg" alt="jpg">

## 5.同步

### 1.竞争条件

两个或者两个以上的线程，共享同一数据存取。如果同时对一个对象进行修改，可能产生讹误对象，这一情况称为竞争条件。

### 2.竞争条件详解

银行转账例子：竞争条件原因如下图



