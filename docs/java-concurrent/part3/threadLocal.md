# ThreadLocal 线程本地存储
> 每个线程都拥有自己的变量，彼此之间不共享，也就没有并发问题

- 线程封闭，通过局部变量可以避免共享
- Immutability和Cow突破的是写操作
- ThreadLocal突破的是共享变量

## ThreadLocal使用方法
- 一个线程多次调用get方法，返回值相同
- 不同线程调用get方法，返回值不同
```java
/**
 * ThreadId 会为每个线程分配一个唯一的线程 Id
 */
static class ThreadId {
  static final AtomicLong 
  nextId=new AtomicLong(0);
  //定义ThreadLocal变量
  static final ThreadLocal<Long> 
  tl=ThreadLocal.withInitial(
    ()->nextId.getAndIncrement());
  //此方法会为每个线程分配一个唯一的Id
  static long get(){
    return tl.get();
  }
}
/**
 *  SafeDateFormat
 */
static class SafeDateFormat {
  //定义ThreadLocal变量
  static final ThreadLocal<DateFormat>
  tl=ThreadLocal.withInitial(
    ()-> new SimpleDateFormat(
      "yyyy-MM-dd HH:mm:ss"));
      
  static DateFormat get(){
    return tl.get();
  }
}
//不同线程执行下面代码
//返回的df是不同的
DateFormat df =
  SafeDateFormat.get()；
```

## ThreadLocal工作原理
### 自己实现的思路
```java
public class MyThreadLocal<T> {
    Map<Thread, T> locals = new ConcurrentHashMap<>();
    T get(){
        T t = locals.get(Thread.currentThread());
        return t;
    }
    void set(T t){
        locals.put(Thread.currentThread(),t);
    }
}
```
### java 的ThreadLocal实现
- Thread持有ThreadLocalMap
- ThreadLocal只是作为代理工具类
- ThreadLocalMap持有ThreadLocal和Object value的key-value
- 其中ThreadLocalMap的Entry对ThreadLocal是弱引用，Entry内部持有value是强引用

## ThreadLocal与内存泄露
- 自实现的ThreadLocal容易导致内存泄漏
   > 原因是ThreadLocal持有Thread，而ThreadLocal的存活时间比Thread要持久的多，如果ThreadLocal不回收，那么Thread就不能回收，容易出现内存泄漏
- java实现的ThreadLocal结合线程池使用时，容易出现内存泄漏
   > 原因：1.线程池的Thread存活时间特别长，则ThreadLocalMap一般不会被回收 2.Entry对ThreadLocal是弱引用，ThreadLocal结束自己的生命周期是可以回收的
   但是value是强引用
```JAVA
/**
 * 手动清理实现value回收，避免内存泄漏
 */
ExecutorService es = Executors.newCachedThreadPool();
ThreadLocal tl = ThreadLocal.withInitial(() -> new AtomicInteger(1));
ex.execute(() -> {
     //ThreadLocal增加变量
    tl.set(new Object());
    try {
        // 省略业务逻辑代码
    }finally {
        //手动清理ThreadLocal
        tl.remove();
    }
});
```

## InheritableThreadLocal与继承性
- 通过ThreadLocal创建的变量V，如果线程Thread创建子线程，子线程不能使用Thread父线程的变量V
- InheritableThreadLocal具有继承性，使用方式和ThreadLocal一样，是ThreadLocal的子类
- 不建议使用InheritableThreadLocal，因为线程是频繁回收的，容易导致继承逻辑错乱而业务出错，伤害是致命的

## 总结
### 在并发场景使用一个线程不安全的类
- 在局部变量中使用，对象频繁创建
- 在线程本地存储中ThreadLocal中使用
- 线程池中使用 ThreadLocal 仍可能导致内存泄漏，所以使用 ThreadLocal 还是需要你打起精神，足够谨慎，记得回收资源tl.remove();