# CountDownLatch、CyclicBarrier
## CountDownLatch 实现线程等待
```java
Executor executor = Executors.newFixedThreadPool(2);// 创建2个线程的线程池
while(存在未对账订单){
  CountDownLatch latch = new CountDownLatch(2);// 计数器初始化为2
  executor.execute(()-> {
    pos = getPOrders();// 查询未对账订单
    latch.countDown();
  });
  executor.execute(()-> {
    dos = getDOrders();// 查询派送单
    latch.countDown();
  });
  latch.await();// 等待两个查询操作结束
  diff = check(pos, dos);// 执行对账操作
  save(diff);// 差异写入差异库
}
```

## CyclicBarrier 实现线程同步
- CyclicBarrier 的计数器有自动重置的功能，当减到 0 的时候，会自动重置你设置的初始值
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/cyclicBarrier/1.png" alt="png"> 

> 类似生产者消费者模式，由于示例是对账，采用2个队列的方式，这样可以从订单队列获取一个数据，从派送单队列获取一个数据，然后执行对账操作，这样数据一定不会乱

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/cyclicBarrier/2.png" alt="png"> 
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/cyclicBarrier/3.png" alt="png"> 

```java
// 订单队列
Vector<P> pos;
// 派送单队列
Vector<D> dos;
// 执行回调的线程池 
Executor executor = Executors.newFixedThreadPool(1);
final CyclicBarrier barrier =new CyclicBarrier(2, ()->{
    executor.execute(()->check());
  });
void check(){
  P p = pos.remove(0);
  D d = dos.remove(0);
  diff = check(p, d);  // 执行对账操作
  save(diff);  // 差异写入差异库
}
void checkAll(){
  Thread T1 = new Thread(()->{
    while(存在未对账订单){  // 循环查询订单库
      pos.add(getPOrders());      // 查询订单库
      barrier.await();      // 等待
    }
  });
  T1.start();  
  Thread T2 = new Thread(()->{
    while(存在未对账订单){  // 循环查询运单库
      dos.add(getDOrders());      // 查询运单库
      barrier.await();      // 等待
    }
  });
  T2.start();
}
```
> 回调函数使用线程池去执行的目的是真正实现并行，线程池执行达到了异步的效果。
- CyclicBarrier源码可知performed by the last thread entering the barrier（由进入屏障的最后一个线程执行），如果不开启线程执行，则校验和保存数据操作则变成串行了
## 总结
CountDownLatch 和 CyclicBarrier 是 Java 并发包提供的两个非常易用的线程同步工具类
### 区别
- CountDownLatch 主要用来解决一个线程等待多个线程的场景，可以类比旅游团团长要等待所有的游客到齐才能去下一个景点；
- CyclicBarrier 是一组线程之间互相等待，更像是几个驴友之间不离不弃。
- CountDownLatch 的计数器是不能循环利用的，也就是说一旦计数器减到 0，再有线程调用 await()，该线程会直接通过
- CyclicBarrier 的计数器是可以循环利用的，而且具备自动重置的功能，一旦计数器减到 0 会自动重置到你设置的初始值。除此之外，CyclicBarrier 还可以设置回调函数，可以说是功能丰富。

出现问题：
如果生产者比较快，消费者比较慢，生产者通知的时候，消费者还在对账，这个时候会怎么处理？会不会导致消费者错失通知，导致队列满了，但是消费者却没有收到通知。
所以这时候回调函数中应该只把数据分别取出来，然后分发给其他线程处理。而不是取完后还在本线程处理。
也就是把取数和处理，两步分开。