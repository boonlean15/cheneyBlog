# CompletionService
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/completableService/1.png" alt="png"> 

批量提交异步任务,需要获取多个任务中先执行完任务的结果。或者需要完成Forking Cluster集群功能
## 概述
- CompletableService把线程池Executor和阻塞队列BlockingQueue结合起来，能够让批量执行异步任务的管理更简单。
- 让异步任务执行结果有序化，先执行完的先进阻塞队列，先完先入
- 需要自己创建线程池，线程池隔离性能避免当有IO重任务时拖垮整个系统

## 创建CompletionService
```java
ExecutorCompletionService(Executor executor);
ExecutorCompletionService(Executor executor, BlockingQueue> completionQueue);
//不传completionQueue的情况下，默认使用无界的LinkedBlockingQueue
```

## CompletableService接口
```java
Future<V> submit(Callable<V> task);
Future<V> submit(Runnable task, V result);
Future<V> take() throws InterruptedException;
Future<V> poll();
Future<V> poll(long timeout, TimeUnit unit) throws InterruptedException;
```

## CompletableService实现询价系统
```java
ExecutorService executor = Executors.newFixedThreadPool(3);
CompletionService<Integer> service = new ExecutorCompletionService<>(executor);
service.submit(() -> getPriceByS1());
service.submit(() -> getPriceByS2());
service.submit(() -> getPriceByS3());
// 将询价结果异步保存到数据库
for(int i=1; i <= 3; i++){
    Integer r = service.take().get();
    executor.execute(()->save(r));
}
```

## CompletableService实现Forking Cluster
```java
// 创建线程池
ExecutorService executor = Executors.newFixedThreadPool(3);
// 创建CompletionService
CompletionService<Integer> cs = new ExecutorCompletionService<>(executor);
// 用于保存Future对象
List<Future<Integer>> futures = new ArrayList<>(3);
//提交异步任务，并保存future到futures 
futures.add(cs.submit(()->geocoderByS1()));
futures.add(cs.submit(()->geocoderByS2()));
futures.add(cs.submit(()->geocoderByS3()));
// 获取最快返回的任务执行结果
Integer r = 0;
try {
  // 只要有一个成功返回，则break
  for (int i = 0; i < 3; ++i) {
    r = cs.take().get();
    //简单地通过判空来检查是否成功返回
    if (r != null) {
      break;
    }
  }
} finally {
  //取消所有任务
  for(Future<Integer> f : futures)
    f.cancel(true);
}
// 返回结果
return r;
```