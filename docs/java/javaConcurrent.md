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

- - join方法：当调用join方法时，调用的线程对象进入等待状态。`线程A中调用线程B的join方法时，线程A会挂起，直到线程B执行完毕后，才会继续执行线程A。`
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

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent4.jpg" alt="jpg">

对Bank.java文件进行反编译，javap -c -v Bank，代码行account[0] += amount;被转换成如下：

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent5.jpg" alt="jpg">

图解竞争条件过程：

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent6.jpg" alt="jpg">


### 3.锁对象　ReentrantLock

java提供了两种机制解决并发访问的问题
- synchronized关键字，自动提供了一个锁以及相关的条件
- java5.0 引入了ReentrantLock类
- `使用锁对象，就不能使用带资源的try语句`**(带资源的try语句自动关闭资源, catch和finally语句在自动close后调用，带资源的try语句的首部希望声明一个新变量）**

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent7.jpg" alt="jpg">


使用锁对象修改的竞争条件例子如下：

```java
    public void transfer(int from, int to, double amount) throws InterruptedException
   {
      bankLock.lock();
      try
      {
         while (accounts[from] < amount)
            sufficientFunds.await();
         System.out.print(Thread.currentThread());
         accounts[from] -= amount;
         System.out.printf(" %10.2f from %d to %d", amount, from, to);
         accounts[to] += amount;
         System.out.printf(" Total Balance: %10.2f%n", getTotalBalance());
         sufficientFunds.signalAll();
      }
      finally
      {
         bankLock.unlock();
      }
   }

```
>修改后的例子，如果第一个线程执行transfer的时候被剥夺执行权，锁未释放，第二个线程执行需要获得锁，在调用Lock方法时被阻塞，需要等待第一个线程执行完transfer方法释放锁后才被激活

可重入锁（线程可以重复获取锁），可重入锁会有一个hold count 计数器，如果一个线程获取了两次，第二次获取count会加+1，unlock的时候，count -1，要留心临界区代码，如果发生异常了，finally会释放锁，如果此时共享对象被改变，可能会使得对象在一个受损的状态。

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent8.jpg" alt="jpg">

**如果线程调度器选择忽略掉一个线程，即使使用了公平锁，那么该线程虽然等待了很长时间，但仍然不会获得执行权。**

### 4.条件对象 Condition
- 调用condition的await方法时，进入等待并放弃锁对象

当一个线程获得锁对象时，需要同时满足某一个条件时，才能执行时，应该考虑使用条件对象。
> 例如：银行转账的例子，需要账号金额大于转账金额时，才可以使用。如果金额小于转账金额，需要等待其他线程转入，达到条件方可执行

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent9.jpg" alt="jpg">


signal()方法，随机唤醒一个等待的线程，如果该线程检测条件，没达到要求，那么它继续阻塞，就陷入了死循环

```java
public class Bank
{
   private final double[] accounts;
   private Lock bankLock;
   private Condition sufficientFunds;

   public Bank(int n, double initialBalance)
   {
      accounts = new double[n];
      Arrays.fill(accounts, initialBalance);
      bankLock = new ReentrantLock();
      sufficientFunds = bankLock.newCondition();
   }

   public void transfer(int from, int to, double amount) throws InterruptedException
   {
      bankLock.lock();
      try
      {
         while (accounts[from] < amount)
            sufficientFunds.await();
         System.out.print(Thread.currentThread());
         accounts[from] -= amount;
         System.out.printf(" %10.2f from %d to %d", amount, from, to);
         accounts[to] += amount;
         System.out.printf(" Total Balance: %10.2f%n", getTotalBalance());
         sufficientFunds.signalAll();
      }
      finally
      {
         bankLock.unlock();
      }
   }

   public double getTotalBalance()
   {
      bankLock.lock();
      try
      {
         double sum = 0;

         for (double a : accounts)
            sum += a;

         return sum;
      }
      finally
      {
         bankLock.unlock();
      }
   }

   public int size()
   {
      return accounts.length;
   }
}
```

### 5.synchronized关键字

每个对象有一个内部锁，该内部锁有一个内部条件，synchronized关键字就是使用了该内部锁和内部条件，wait和notifyAll，notify，等价于锁对象的条件的await和signalAll和signal

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent10.jpg" alt="jpg">


#### 内部锁和条件存在的局限性：
- 不能中断正在获取锁的线程
- 锁仅有单一条件，不够
- 视图获得锁不能设置超时
  
#### Lock、Condition、synchronized，使用推荐：
- 能不使用尽量不使用，采用java.util.concurrent包机制实现，会为你处理所有的加锁
- 需要使用的地方，能用synchronized的，可以用，代码简洁 
- 特别需要用到Lock/Condition的才使用

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent11.jpg" alt="jpg">

### 6.同步阻塞 synchronized(obj){}

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent12.jpg" alt="jpg">

obj的创建仅仅是用来使用每个java对象持有的锁。客户端锁是非常脆弱的，通常不建议使用

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent13.jpg" alt="jpg">


### 7.监视器概念 Monitor 管程

#### 管程：

1. 管程，只包含私有域的类
2. 每个管程类对象有一个相关的锁
3. 使用该锁对所有方法进行加锁
4. 该锁可以有任意多个相关条件
   
>JAVA设计者采用了不是很精确的方式采用管程的概念。java的每一个对象有一个内部锁和内部条件。synchronized关键字修饰的方法，就类似一个管程方法。通过调用wait，notifyAll，notify方法来访问条件变量
>>每一个条件变量管理一个独立的线程集。

#### java对象有3个方面不同于观察monitor

1. 域不要求是private
2. 方法不要求必须是synchronized
3. 内部锁对客户是可用的

### 8.Volatile域 

对共享变量只赋值，不完成其他操作。可以使用volatile

volatile关键字为实例域的同步访问提供了一种免锁机制，编译器和虚拟机会知道该域是会被另一个线程并发更新的。

注意：volatile关键字不能提供原子性，也就是public void filpDone(){done = !done}//not atomic 不能确保翻转域中的值

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent14.jpg" alt="jpg">

### 9.final关键字

使用final可以安全的访问共享域，当然，对引用的操作仍然需要使用同步

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent15.jpg" alt="jpg">


### 10.原子性 Atomic

volatile域，赋值，不能完成操作。java.util.concurrent.atomic包定义了很多可以完成原子操作的类

1. AtomicInteger提供了incrementAndGet和decrementAndGet，完成新增1和减去1的操作。
2. 如果是更复杂的更新，则需要使用compareAndSet：如果其他线程也在更新，那么compareAndSet操作不会完成并返回false
3. 编码，需要循环.

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent16.jpg" alt="jpg">

> 可以用lambda表达式替换，largest.updateAndGet(x -> Math.max(x, observed)); //x代表atomicLong的初始化值或者后面设置的值

4. 其他方法：getAndUpdate，getAndAccumulate，返回原值

其他类也拥有这些方法：

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent17.jpg" alt="jpg">


#### LongAdder，LongAccumulate：

- 大量线程访问相同原子值，性能降低。
- LongAdder有多个变量(加数)，当有新线程增加，会自动提供新的加数。当所有工作完成后，才需要总和的值的情况会很高效。
- LongAccumulate把LongAdder推广到了任意的累加操作。需要提供操作和初始化值
- DoubleAdder、DoubleAccumulate，操作的是double值

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent18.jpg" alt="jpg">

示例：
```java
    @Test
    public void testLongAdder(){
        final AtomicLong atomicLong = new AtomicLong(20);
        long l = atomicLong.updateAndGet(x -> {
            log.info("x ---- " + x);
            return Math.max(x, 40L);
        });
        log.info("l ---- " + l);
        final LongAdder longAdder = new LongAdder();
        long l1 = longAdder.longValue();
        log.info("l1 ---- " + l1);
        longAdder.add(10L);
        longAdder.increment();
        long l2 = longAdder.longValue();
        log.info("l2 ---- " + l2);

        LongAccumulator longAccumulator = new LongAccumulator(Long::min, 10);
        long l3 = longAccumulator.get();
        longAccumulator.accumulate(20);
        long l4 = longAccumulator.get();
        log.info("l3 ---- " + l3);
        log.info("l4 ---- " + l4);
    }
```

### 11.死锁
**条件不满足或者signal单个线程，所有线程阻塞**

锁和条件不能解决多线程的所有问题：

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent19.jpg" alt="jpg">

#### 常见的死锁现象：

1. 如上，线程都不满足条件时都进入阻塞状态，出现死锁
2. 锁和条件同时存在时，调用的signal而不是signalAll，被signal唤醒的线程不满足条件，那么会进入阻塞，出现死锁

> java中，没有可以避免或者打破死锁现象。必须仔细设计程序，避免出现死锁。

### 12.线程局部变量 ThreadLocal

ThreadLocal辅助类，为各自线程提供各自的实例。ThreadLocal<T>

```java
    @Test
    public void testThreadLocal(){
        final ThreadLocal<SimpleDateFormat> dateFormatThreadLocal = ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
        String format = dateFormatThreadLocal.get().format(new Date());
        log.info("format ---- " + format);
    }
```

ThreadLocalRandom类，为Random的便利类

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent20.jpg" alt="jpg">

### 13.锁测试与超时

线程在调用Lock方法获取另一个线程的锁时，很可能发生阻塞。

Lock方法不能被中断。如果一个线程等待获取锁时被中断，中断线程在获得锁之前处于阻塞状态。如果出现死锁，那么lock方法将无法终止。

tryLock允许中断，抛出中断异常，可打破死锁。

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent21.jpg" alt="jpg">


### 14.读写锁 ReentrantReadWriteLock

读写锁分开，对读锁允许共享访问，对写锁添加锁

>**针对很多线程从一个数据结构读取数据，但很少线程从中写数据，非常有用**

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent22.jpg" alt="jpg">

### 15.弃用stop和suspend方法

- stop：停止线程，包括run方法，导致对象行为被破坏，比如钱已转出，未转入，然后被stop终止
- 中断：被中断的线程，在安全的时候停止
- suspend：在同一个时间分配线或者说是线程调用了suspend挂起一个持有锁的线程，那么锁在恢复之前不可用，然后同时获取挂起线程需要的锁，进入死锁。


##  6.阻塞队列

### 生产者消费者模式  ：
1. 生产者往队列里put元素，然后消费者从队列里poll元素
2. 如果生产赶不上消费，消费者等待生产者生产，阻塞
3. 如果消费赶不上生产，生产等待消费者消费，阻塞


<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent23.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent24.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent25.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent26.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent27.jpg" alt="jpg">


## 7.线程安全的集合

集合返回弱一致性(weakly consistent) 的迭代器。这意味着迭代器不一定能反映出它 们被构造之后的所有的修改， 但是， 它们不会将同一个值返回两次， 也不会拋出 Concurrent ModificationException 异常。

> 注释: 与之形成对照的是， 集合如果在迭代器构造之后发生改变， java.util 包中的迭代器 将抛出一个 ConcurrentModificationException 异常。

### 1.高效的映射、集、和队列 

- ConcurrentHashMap、
- ConcurrentSkipListMap、
- ConcurrentSkipListSet、
- ConcurrentLinkedQueue、
- 集合大小超过20亿的，提供了mappingCount方法返回Long类型的获取Size大小 
- 集合如果在迭代器构造之后发现变化，迭代器会抛出ConcurrentModificationException、
- 默认16个写者线程，超过会阻塞

### 2.映射条目的原子更新


比如ConcurrentHashMap<String, Long>，修改其中的value值，虽然并发包下的集合不会跟非并发包一样破坏集合的结构，
但是修改value的时候，如果说并发，那么值不一定会设置成功。
- 使用相应的：map.putlfAbsent(word, new LongAdder());
- putIfAbsent、compute、computeIfAbsent、merge、进行原子更新

###  3.并发散列映射的批操作

search、搜索，搜索符合条件的值，符合条件的返回，过滤null的　　　
```java 
String result = map.search(threshold, (k, v) -> v > 1000 ? k : null);
```
forEach、遍历，可以提供消费Consumer，或者添加转换transfer再使用consumer
```java
map.forEach(threshold,(k, v) -> k + " -> " + v，// Transformer
    System.out::println); // Consumer        
```
reduce、归约 需要提供一个累加函数，Long::sum,Long::max等
```java
Integer maxlength = map.reduceKeys(threshold, String::length,//Transformer
Integer::max); // Accumulator
```

### 4.并发集视图

没有大线程安全的集，可以使用ConcurrentHashMap获取他的keySet视图
- 只能操作删除(对应的value也会被删除)，不能添加，因为没有value值可以添加。
- 新增的替代方法，map.keySet(1L);可以添加，然后没有value时，默认添加1L；


### 5.写数组的拷贝

CopyOnWriteArrayList、CopyOnWriteArraySet

### 6. 并行数组算法

静态 Arrays.parallelSort 方法可以对 一个基本类型值或对象的数组排序

最后还有一个 parallelPrefix 方法， 它会用对应一个给定结合操作的前缀的累加结果替换 各个数组元素


### 7.较早的线程安全集合

 Vector 和 Hashtable

 使用Collections同步包装器(synchronization wrapper) 变成线程安全的:

 ```java
List<E> synchArrayList = Collections,synchronizedList(new ArrayList<E>()); 
Map<K, V> synchHashMap = Col1ections.synchronizedMap(new HashMap<K, V>0);
 ```

结果集合的方法使用锁加以保护， 提供了线程安全访问。

1.最好还是使用java.util.concurrent包下的并发集合，因为如果另一个线程对集合进行修改时，进行迭代，　　

```java
synchronized (synchHashMap)
{
Iterator<K> iter = synchHashMap.keySet().iterator();
while (iter.hasNextO) . . }
```

> 　如果在 迭代过程中， 别的线程修改集合， 迭代器会失效， 抛出 ConcurrentModificationException 异 常。 同步仍然是需要的， 因此并发的修改可以被可靠地检测出来。


## 8.Callable和Future

### Callable

runable类似：Callable 接口是一个参数化的类型， 只有一 个方法 call

```java
public interface Ca11able<V> {
    V  call() throws Exception;
}
```

### Future

Future 保存异步计算的结果

```java
public interface Future<V>{
    V get() throws ...;//调用被阻塞
    V get(long timeout, TimeUnit unit) throws ...;//调用超时，抛出异常
    void cancel(boolean mayInterrupt);  //取消该计算
    boolean isCancelled();//是否取消
    boolean isDone();//是否完成
}
```

### FutureTask

FutureTask 包装器是一种非常便利的机制， 可将 Callable 转换成 Future 和 Runnable, 它 同时实现二者的接口。

```java
Callable<Integer> nyComputation = . . .;
FutureTask<Integer> task = new FutureTask<Integer>(myConiputation); 
Thread t = new Thread(task); // it's a Runnable
t.start();
Integer result = task.getO;// it's a Future
```

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent28.jpg" alt="jpg">


##  9.执行器Executor

构建一个新的线程是有一定代价的， 因为涉及与操作系统的交互。 如果程序中创建了大 量的生命期很短的线程， 应该使用线程池(thread pool )。

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent29.jpg" alt="jpg">



### 1.线程池　

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent30.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent31.jpg" alt="jpg">

### 2.预定执行

Executors 类的 newScheduledThreadPool 和 newSingleThreadScheduledExecutor 方法将返回实现了 ScheduledExecutorService 接口的对象。


<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent32.jpg" alt="jpg">


### 3.控制任务组

执行器有更有实际意义的原因， 控制一组相关任务。例如， 可以在执行器中使用 shutdownNow 方法取消所有的任务

#### invokeAny
方法提交所有对象到一个 Callable 对象的集合中， 并返回某个已经完成了的 任务的结果。

#### invokeAll
方法提交所有对象到一个 Callable 对象的集合中， 并返回一个 Future 对象的列 表， 代表所有任务的解决方案。

#### ExecutorCompletionService
管理 Future 对象的阻塞队列， 其中包含已经提交的 任务的执行结果 (当这些结果成为可用时 。)

```java
ExecutorCompletionService<T> service = new ExecutorCompletionService<>(executor): 
for (Callable<T> task : tasks) 
service.submit(task);
for (int i = 0; i < tasks.size();i++) 
processFurther(service.take().get());
```

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent33.jpg" alt="jpg">


### 4.Fork-join框架

Java SE 7 中新引入了 fork-join 框架， 专门用来 支持后一类应用。假设有一个处理任务， 它可以很自然地分解为子任务

```java
if (problemSize < threshold)
solve problem directly
else
break problem into subproblems recursively solve each subproblem combine the results
}
```

要采用框架可用的一种方式完成这种递归计算， 需要提供一个扩展 RecursiveTaskO 的 类(如果计算会生成一个类型为 T 的结果)或者提供一个扩展 RecursiveAction 的类(如果不生成任何结果 )。再覆盖 compute 方法来生成并调用子任务， 然后合并其结果　

```java
class Counter extends RecursiveTask<Integer> {
    protected Integer compute()
    {
        if (to - from < THRESHOLD) {
            solve problem directly 
        }else{
            int mid = (from + to) / 2;
            Counter first = new Counter(va1ues, from, mid, filter); 
            Counter second = new Counter(va1ues, mid, to, filter); 
            invokeAll(first, second):
            return first.joinO + second.joinO;
        } 
    }
}
```

### 5.可完成Future

从概念上讲， CompletableFuture 是一个简单 API, 不过有很多不同方法来组合可完成future

**组合Future执行顺序**


## 10.同步器

帮助人们管理相互合作的线程集的类

### 1.信号量 Semaphore

1. 一个信号量管理许多的许可证。信号量仅维持一个计数。线程要通过信号量，需要acquire请求许可。
2. 许可数据固定，由此限制了通过的线程数量。
3. 许可并非由获得许可的线程释放。任何线程都可以释放许可

### 2.倒计时门拴CountDownLatch

- 让一个线程集等到值为0时，可以通过门拴继续执行。
- CountDownLatch是一次性的。不可复用　　

### 3.障栅

当一个线 程完成了它的那部分任务后， 我们让它运行到障栅处。一旦所有的线程都到达了这个障栅， 障栅就撤销， 线程就可以继续运行。　　

```java
CyclicBarrier barrier = new CydicBarrier(nthreads);
public void runO {
doWorkO; bamer.awaitO;
...
}
```

`如果任何一个在障栅上等待的线程离开了障栅， 那么障栅就被破坏了`


> 可以提供一个可选的障栅动作(barrier action), 当所有线程到达障栅的时候就会执行这
一动作。

```java
Runnable barrierAction =
CyclicBarrier barrier = new Cyc1icBarrier(nthreads, barrierAction);
```

**障栅被称为是循环的(cyclic), 因为可以在所有等待线程被释放后被重用**

### 4.交换器

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/concurrent34.jpg" alt="jpg">

--- 

