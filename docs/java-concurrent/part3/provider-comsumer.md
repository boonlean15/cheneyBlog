# 生产者-消费者模式
生产者线程生产任务，并将任务添加到任务队列中，而消费者线程从任务队列中获取任务并执行

## 解耦
- 生产者和消费者没有任何依赖关系
- 彼此之间的通信只能通过任务队列
> 生产者 - 消费者模式是一个不错的解耦方案.
> 解耦对于大型系统的设计非常重要，而解耦的一个关键就是组件之间的依赖关系和通信方式必须受限

## 支持异步/平衡生产者和消费者的速度差异
- 生产者线程只需要将任务添加到任务队列而无需等待任务被消费者线程执行完
- 任务的生产和消费是异步的，这是与传统的方法之间调用的本质区别，传统的方法之间调用是同步的

## 增加任务队列的原因
> 异步化处理最简单的方式就是创建一个新的线程去处理，那中间增加一个“任务队列”究竟有什么用呢？

> 我们假设生产者的速率很慢，而消费者的速率很高，比如是 1:3，如果生产者有 3 个线程，采用创建新的线程的方式，那么会创建 3 个子线程，而采用生产者 - 消费者模式，消费线程只需要 1 个就可以了。Java 语言里，Java 线程和操作系统线程是一一对应的，线程创建得太多，会增加上下文切换的成本，所以 Java 线程不是越多越好，适量即可。
- **用于平衡生产者和消费者的速度差异**
- **而生产者 - 消费者模式恰好能支持你用适量的线程**

## 批量执行以提升性能
要在数据库里 INSERT 1000 条数据
- 第一种方案是用 1000 个线程并发执行，每个线程 INSERT 一条数据
- 第二种方案是用 1 个线程，执行一个批量的 SQL，一次性把 1000 条数据 INSERT 进去
- 第二种方案效率更高，其实这样的应用场景就是我们上面提到的批量执行场景
> 将原来直接 INSERT 数据到数据库的线程作为生产者线程，生产者线程只需将数据添加到任务队列，然后消费者线程负责将任务从任务队列中批量取出并批量执行

```java
/**
 * pollTasks 首先采用阻塞方式，是因为如果任务队列中没有任务，这样的方式能够避免无谓的循环
 */
//任务队列
BlockingQueue<Task> bq=new
  LinkedBlockingQueue<>(2000);
//启动5个消费者线程
//执行批量任务  
void start() {
  ExecutorService es=executors
    .newFixedThreadPool(5);
  for (int i=0; i<5; i++) {
    es.execute(()->{
      try {
        while (true) {
          //获取批量任务
          List<Task> ts=pollTasks();
          //执行批量任务
          execTasks(ts);
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    });
  }
}
//从任务队列中获取批量任务
List<Task> pollTasks() 
    throws InterruptedException{
  List<Task> ts=new LinkedList<>();
  //阻塞式获取一条任务
  Task t = bq.take();
  while (t != null) {
    ts.add(t);
    //非阻塞式获取一条任务
    t = bq.poll();
  }
  return ts;
}
//批量执行任务
execTasks(List<Task> ts) {
  //省略具体代码无数
}
```

## 支持分阶段提交以提升性能
> 利用生产者 - 消费者模式还可以轻松地支持一种分阶段提交的应用场景。我们知道写文件如果同步刷盘性能会很慢，所以对于不是很重要的数据，我们往往采用异步刷盘的方式。我曾经参与过一个项目，其中的日志组件是自己实现的，采用的就是异步刷盘方式，刷盘的时机是
- 调用 info()和error() 方法的线程是生产者
- 真正将日志写入文件的是消费者线程

```java
/**
 * ERROR 级别的日志需要立即刷盘；
 * 数据积累到 500 条需要立即刷盘；
 * 存在未刷盘数据，且 5 秒钟内未曾刷盘，需要立即刷盘。
 */
class Logger {
  //任务队列  
  final BlockingQueue<LogMsg> bq
    = new BlockingQueue<>();
  //flush批量  
  static final int batchSize=500;
  //只需要一个线程写日志
  ExecutorService es = 
    Executors.newFixedThreadPool(1);
  //启动写日志线程
  void start(){
    File file=File.createTempFile(
      "foo", ".log");
    final FileWriter writer=
      new FileWriter(file);
    this.es.execute(()->{
      try {
        //未刷盘日志数量
        int curIdx = 0;
        long preFT=System.currentTimeMillis();
        while (true) {
          LogMsg log = bq.poll(
            5, TimeUnit.SECONDS);
          //写日志
          if (log != null) {
            writer.write(log.toString());
            ++curIdx;
          }
          //如果不存在未刷盘数据，则无需刷盘
          if (curIdx <= 0) {
            continue;
          }
          //根据规则刷盘
          if (log!=null && log.level==LEVEL.ERROR ||
              curIdx == batchSize ||
              System.currentTimeMillis()-preFT>5000){
            writer.flush();
            curIdx = 0;
            preFT=System.currentTimeMillis();
          }
        }
      }catch(Exception e){
        e.printStackTrace();
      } finally {
        try {
          writer.flush();
          writer.close();
        }catch(IOException e){
          e.printStackTrace();
        }
      }
    });  
  }
  //写INFO级别日志
  void info(String msg) {
    bq.put(new LogMsg(
      LEVEL.INFO, msg));
  }
  //写ERROR级别日志
  void error(String msg) {
    bq.put(new LogMsg(
      LEVEL.ERROR, msg));
  }
}
//日志级别
enum LEVEL {
  INFO, ERROR
}
class LogMsg {
  LEVEL level;
  String msg;
  //省略构造函数实现
  LogMsg(LEVEL lvl, String msg){}
  //省略toString()实现
  String toString(){}
}
```

> 在应用系统中，日志系统一般都是最后关闭的吧，因为它要为其他系统关闭提供写日志服务。所以日志系统关闭时需要把队列中所有日志都消费掉才能关闭。
可能需要在关闭日志系统时投入一个毒丸，表示没有新的日志写入。线程池在消费到毒丸时知道没有日志写入，将所有的日志刷盘，break循环体。