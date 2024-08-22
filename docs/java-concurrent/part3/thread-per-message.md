# Thread-Per-Message模式：最简单实用的分工方法
每个任务分配一个线程执行
## Thread Thread-Per-Message模式
- Thread实现的ThreadPerMessage支持不了高并发，高并发下很容易就OOM了
- Thread的创建是重量级的，跟操作系统的线程是一一对应的
  - Java 中的线程是一个重量级的对象，创建成本很高
  - 一方面创建线程比较耗时
  - 另一方面线程占用的内存也比较大
```java
public class ThreadPerMessageDemo{
    final SocketServerChannel ssc = ServerSocketChannel.open().bind(new InetSocketAddress(8080));
    try{
        while(true){
            SocketChannel sc = ssc.accept();
            try{
                new Thread(() -> {
                    // 读Socket 
                    ByteBuffer rb = ByteBuffer .allocateDirect(1024);
                    sc.read(rb);
                    //模拟处理请求 
                    Thread.sleep(2000);
                    // 写Socket 
                    ByteBuffer wb = (ByteBuffer)rb.flip();
                    sc.write(wb);
                    // 关闭Socket sc.close();
                }).start();
            }catch(Exception e){
                throw new UncheckedIOException(e);
            }
        }
    }finally{
        ssc.close;
    }
}
```

## Fiber实现Thread-Per-Message
> 轻量级的线程，创建的成本很低，基本上和创建一个普通对象的成本相似；并且创建的速度和内存占用相比操作系统线程至少有一个数量级的提升，所以基于轻量级线程实现 Thread-Per-Message 模式就完全没有问题了。
- 在 20000 并发下，该程序依然能够良好运行。同等条件下，Thread 实现的 echo 程序 512 并发都抗不过去，直接就 OOM 了
- 轻量级线程，java19发布的版本成为虚拟线程，也类似与go的协程
- Fiber 实现的 echo 程序的进程信息，你可以看到该进程仅仅创建了 16（不同 CPU 核数结果会不同）个操作系统线程

```java
//把 new Thread(()->{...}).start() 换成 Fiber.schedule(()->{}) 就可以了
public class ThreadPerMessageDemo{
    final SocketServerChannel ssc = ServerSocketChannel.open().bind(new InetSocketAddress(8080));
    try{
        while(true){
            SocketChannel sc = ssc.accept();
            try{
                Fiber.schedule(() -> {
                    // 读Socket 
                    ByteBuffer rb = ByteBuffer .allocateDirect(1024);
                    sc.read(rb);
                    //模拟处理请求 
                    Thread.sleep(2000);
                    // 写Socket 
                    ByteBuffer wb = (ByteBuffer)rb.flip();
                    sc.write(wb);
                    // 关闭Socket sc.close();
                });
            }catch(Exception e){
                throw new UncheckedIOException(e);
            }
        }
    }finally{
        ssc.close;
    }
}
```

## 拓展
- tomcat的Thread-Per-Message模式是采用线程池方式实现的
- Go中的称做协程
- Kotlin 支持协程, 并且实现了完善的调度策略, 可以考虑使用 Kotlin 作为替代方案
- 解决高并发思路
 - 引入线程池控制创建线程的大小，通过压测得到比较合理的线程数量配置
 - 需要在请求端增加一个限流模块，自我保护