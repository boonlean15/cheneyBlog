# work-thread模式
> work-tread模式类似：现实世界里工人的工作模式，有任务来了，则工作，没有任务了，则闲聊一下等待任务。
## work-thread本质是线程池模式
### 线程池的优点
- 避免重复创建、销毁线程
- 限制创建线程的上限等
- 避免Thread-Per-Message模式高并发下的OOM

### echo服务的线程池实现
```java
ExecutorService es = Executors .newFixedThreadPool(500);
final ServerSocketChannel ssc = ServerSocketChannel.open().bind( new InetSocketAddress(8080));
//处理请求
try { 
    while (true) { 
    // 接收请求 
        SocketChannel sc = ssc.accept(); 
        // 将请求处理任务提交给线程池 
        es.execute(() -> { 
            try { 
                // 读Socket 
                ByteBuffer rb = ByteBuffer .allocateDirect(1024); 
                sc.read(rb); 
                //模拟处理请求 
                Thread.sleep(2000); 
                // 写Socket 
                ByteBuffer wb = (ByteBuffer)rb.flip(); 
                sc.write(wb); 
                // 关闭Socket 
                sc.close(); 
            }catch(Exception e){ 
                throw new UncheckedIOException(e); 
            } 
        }); 
    }
} 
finally { 
    ssc.close(); 
    es.shutdown();
}
```

## 正确地创建线程池
- 用创建有界的队列来接收任务 (避免无限制地接收任务导致 OOM)
- 创建线程池时，清晰地指明拒绝策略 (结合具体的业务场景来制定)
- 给线程赋予一个业务相关的名字 (便于调试和诊断问题)

```java
ExecutorService es = new ThreadPoolExecutor(
  50, 500,
  60L, TimeUnit.SECONDS,
  //注意要创建有界队列
  new LinkedBlockingQueue<Runnable>(2000),
  //建议根据业务需求实现ThreadFactory
  r->{
    return new Thread(r, "echo-"+ r.hashCode());
  },
  //建议根据业务需求实现RejectedExecutionHandler
  new ThreadPoolExecutor.CallerRunsPolicy());
```

## 避免线程死锁
> 提交到相同线程池的任务不是相互独立的，而是有依赖关系的，那么就有可能导致线程死锁
```java
//L1、L2阶段共用的线程池
ExecutorService es = Executors.newFixedThreadPool(2);
//L1阶段的闭锁    
CountDownLatch l1=new CountDownLatch(2);
for (int i=0; i<2; i++){
  System.out.println("L1");
  //执行L1阶段任务
  es.execute(()->{
    //L2阶段的闭锁 
    CountDownLatch l2=new CountDownLatch(2);
    //执行L2阶段子任务
    for (int j=0; j<2; j++){
      es.execute(()->{
        System.out.println("L2");
        l2.countDown();
      });
    }
    //等待L2阶段任务执行完
    l2.await();
    l1.countDown();
  });
}
//等着L1阶段任务执行完
l1.await();
System.out.println("end");
```
- 为不同的任务创建不同的线程池
- 提交到相同线程池中的任务一定是相互独立的，否则就一定要慎重

## 总结
- 解决并发编程里的分工问题，最好的办法是和现实世界做对比
- 对比现实世界构建编程领域的模型，能够让模型更容易理解
- Thread-Per-Message 模式，类似于现实世界里的委托他人办理
- Worker Thread 模式则类似于车间里工人的工作模式
- 正确创建线程池、如何避免线程死锁问题，还需要注意前面我们曾经提到的 ThreadLocal 内存泄露问题
- 同时对于提交到线程池的任务，还要做好异常处理，避免异常的任务从眼前溜走