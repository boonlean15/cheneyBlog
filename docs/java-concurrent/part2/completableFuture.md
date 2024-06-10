# CompletableFuture
## 多线程优化性能
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/completableFuture/1.png" alt="png"> 

> 利用多线程优化性能，其实就是串行转并行，而串行转并行一定涉及到异步化。
- 异步化 多线程优化性能得以实施的基础
- 异步编程大火 优化性能是大厂的核心需求
- java1.8 提供了CompletableFuture来支持异步编程

## CompletableFuture 重写烧水泡茶
### CompletableFuture优势
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/completableFuture/2.png" alt="png"> 

- 无需手工维护线程 
  > 没有繁琐的手工维护线程的工作，给任务分配线程的工作也不需要我们关注
- 语义更清晰
  > 例如 f3 = f1.thenCombine(f2, ()->{}) 能够清晰地表述“任务 3 要等待任务 1 和任务 2 都完成后才能开始”
- 代码更简练并且专注于业务逻辑 
  > 几乎所有代码都是业务逻辑相关的
```java
//任务1：洗水壶->烧开水
CompletableFuture<Void> f1 = CompletableFuture.runAsync(()->{
  System.out.println("T1:洗水壶...");
  sleep(1, TimeUnit.SECONDS);
  System.out.println("T1:烧开水...");
  sleep(15, TimeUnit.SECONDS);
});
//任务2：洗茶壶->洗茶杯->拿茶叶
CompletableFuture<String> f2 = CompletableFuture.supplyAsync(()->{
  System.out.println("T2:洗茶壶...");
  sleep(1, TimeUnit.SECONDS);
  System.out.println("T2:洗茶杯...");
  sleep(2, TimeUnit.SECONDS);
  System.out.println("T2:拿茶叶...");
  sleep(1, TimeUnit.SECONDS);
  return "龙井";
});
//任务3：任务1和任务2完成后执行：泡茶
CompletableFuture<String> f3 = f1.thenCombine(f2, (__, tf)->{
    System.out.println("T1:拿到茶叶:" + tf);
    System.out.println("T1:泡茶...");
    return "上茶:" + tf;
  });
//等待任务3执行结果
System.out.println(f3.join());

void sleep(int t, TimeUnit u) {
  try {
    u.sleep(t);
  }catch(InterruptedException e){}
}
// 一次执行结果：
T1:洗水壶...
T2:洗茶壶...
T1:烧开水...
T2:洗茶杯...
T2:拿茶叶...
T1:拿到茶叶:龙井
T1:泡茶...
上茶:龙井
```

## 创建 CompletableFuture 对象
```java
//使用默认线程池
static CompletableFuture<Void> runAsync(Runnable runnable)
static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
//可以指定线程池  
static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)
static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)  
```
- 默认情况下 CompletableFuture 会使用公共的 ForkJoinPool 线程池
  > 这个线程池默认创建的线程数是 CPU 的核数（也可以通过 JVM option:-Djava.util.concurrent.ForkJoinPool.common.parallelism 来设置 ForkJoinPool 线程池的线程数）。
- 根据不同的业务类型创建不同的线程池，以避免互相干扰
  > 如果所有 CompletableFuture 共享一个线程池，那么一旦有任务执行一些很慢的 I/O 操作，就会导致线程池中所有线程都阻塞在 I/O 操作上，从而造成线程饥饿，进而影响整个系统的性能。
- 创建完 CompletableFuture 对象之后，会自动地异步执行 runnable.run() 方法或者 supplier.get() 方法
- CompletableFuture 类实现了 Future 接口
  > 一个异步操作，你需要关注两个问题：一个是异步操作什么时候结束，另一个是如何获取异步操作的执行结果
- CompletableFuture 类还实现了 CompletionStage 接口

## 理解CompletionStage接口
### 任务之间的时序关系
- 串行关系
- 并行关系
- 汇聚关系
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/completableFuture/3.png" alt="png"> 

###  CompletableStage 描述任务之间的时序关系
f1.thenCombine(f2, ()->{}) 描述的是一种汇聚关系
- AND聚合关系 需要等待所有任务执行完毕
- OR聚合关系 只要其中一个任务执行完毕即可执行当前任务
- 描述异常处理

## 描述串行关系
```java
CompletionStage<R> thenApply(fn);
CompletionStage<R> thenApplyAsync(fn);
CompletionStage<Void> thenAccept(consumer);
CompletionStage<Void> thenAcceptAsync(consumer);
CompletionStage<Void> thenRun(action);
CompletionStage<Void> thenRunAsync(action);
CompletionStage<R> thenCompose(fn);
CompletionStage<R> thenComposeAsync(fn);
```
- Async 代表的是异步执行 fn、consumer 或者 action
- thenApply 
  > fn 的类型是接口 Function,相关的方法是 R apply(T t),既能接收参数也支持返回值，thenApply 系列方法返回的是CompletionStage<R>
- thenAccept 
  > 参数 consumer 的类型是接口Consumer,相关的方法是 void accept(T t),支持参数，但却不支持回值,thenAccept 系列方法返回的是CompletionStage<Void>
- thenRun
  > action 的参数是 Runnable,action 既不能接收参数也不支持返回值，所以 thenRun 系列方法返回的也是CompletionStage<Void>
- thenCompose
  > 方法会新创建出一个子流程，最终结果和 thenApply 系列是相同的。
### 示例
```java
CompletableFuture<String> f0 = 
  CompletableFuture.supplyAsync(
    () -> "Hello World")      //①
  .thenApply(s -> s + " QQ")  //②
  .thenApply(String::toUpperCase);//③
System.out.println(f0.join());
//输出结果
HELLO WORLD QQ
```
## 描述AND聚合关系
```java
CompletionStage<R> thenCombine(other, fn);
CompletionStage<R> thenCombineAsync(other, fn);
CompletionStage<Void> thenAcceptBoth(other, consumer);
CompletionStage<Void> thenAcceptBothAsync(other, consumer);
CompletionStage<Void> runAfterBoth(other, action);
CompletionStage<Void> runAfterBothAsync(other, action);
```
- thenCombine
- thenAcceptBoth
- runAfterBoth
> 接口的区别也是源自 fn、consumer、action 这三个核心参数不同
## 描述OR聚合关系
```java
CompletionStage applyToEither(other, fn);
CompletionStage applyToEitherAsync(other, fn);
CompletionStage acceptEither(other, consumer);
CompletionStage acceptEitherAsync(other, consumer);
CompletionStage runAfterEither(other, action);
CompletionStage runAfterEitherAsync(other, action);
```
- applyToEither
- acceptEither
- runAfterEither
> 区别也是源自 fn、consumer、action 这三个核心参数不同。

```java
CompletableFuture<String> f1 = 
  CompletableFuture.supplyAsync(()->{
    int t = getRandom(5, 10);
    sleep(t, TimeUnit.SECONDS);
    return String.valueOf(t);
});
CompletableFuture<String> f2 = 
  CompletableFuture.supplyAsync(()->{
    int t = getRandom(5, 10);
    sleep(t, TimeUnit.SECONDS);
    return String.valueOf(t);
});
CompletableFuture<String> f3 = 
  f1.applyToEither(f2,s -> s);
System.out.println(f3.join());
```
## 描述异常处理
```java
CompletionStage exceptionally(fn);  //类似try catch
CompletionStage<R> whenComplete(consumer);//类似try finally
CompletionStage<R> whenCompleteAsync(consumer);
CompletionStage<R> handle(fn);//类似try finally
CompletionStage<R> handleAsync(fn);
```
- whenComplete() 和 handle() 的区别在于 whenComplete() 不支持返回结果，而 handle() 是支持返回结果的
```java
CompletableFuture<Integer> 
  f0 = CompletableFuture
    .supplyAsync(()->(7/0))
    .thenApply(r->r*10)
    .exceptionally(e->0);
System.out.println(f0.join());
```