# Guava RateLimiter限流器
Guava RateLimiter 谷歌的一个开源java类库。
```xml
<!-- https://mvnrepository.com/artifact/com.google.guava/guava -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>32.1.3-jre</version>
</dependency>
```

## 概述
- 流速 
  > 假如一个流速为 2 个请求 / 秒的限流器，大致可以理解为1秒内能同个2个请求。guava中的流速的深层含义：是一种匀速的概念，2 个请求 / 秒等价于 1 个请求 /500 毫秒。
- 示例
```java
public class RateLimiterDemo {
    public static void main(String[] args) {
        //限流器流速：2个请求/秒
        RateLimiter limiter = RateLimiter.create(2.0);
        //执行任务的线程池
        ExecutorService es = Executors.newFixedThreadPool(1);
        //记录上一次执行时间
        AtomicLong prev = new AtomicLong(System.nanoTime());
        //测试执行20次
        for (int i=0; i<20; i++){
            //限流器限流
            limiter.acquire();
            //提交任务异步执行
            es.execute(()->{
                long cur = System.nanoTime();
                //打印时间间隔：毫秒
                System.out.println( (cur- prev.get())/1000_000);
                prev.set(cur);
            });
        }
        es.shutdown();
    }
}
```

## 令牌桶算法
### 令牌桶算法核心
想要通过限流器，必须拿到令牌
### 算法详情
- 速率 令牌以固定的速率添加到令牌桶中，例如限流的速率是r/秒，那么令牌每1/r秒会添加一个
- 容量 burst(突发流量) 令牌桶的容量为b，如果令牌桶已满，新的令牌会被丢弃
  > 限流器允许的最大突发流量，如b=10，且令牌桶已满，则此时能允许最大10个请求同时通过限流器，10个请求带走10个令牌，后续流量只能按照速率r/秒通过限流器
- 请求能通过限流器的前提是能拿到令牌
### 生产者消费者模式不适合实现令牌桶算法的原因
- 限流一般出现在系统并发量非常大的情况
- 定时器添加令牌到令牌桶，定时器在高并发情况下调度精度下降，并且定时器需要调度线程，调度线程会对系统的性能产生影响

## Guava ratelimiter实现
google的guava ratelimiter不是采用生产者-消费者模式+定时器的方式实现
### 记录并动态计算下一令牌的发放时间实现限流
具体如图所示：
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/1.png" alt="png"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/2.png" alt="png"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/3.png" alt="png"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/4.png" alt="png"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/5.png" alt="png"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/6.png" alt="png"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/7.png" alt="png"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/8.png" alt="png"> 

### 只需要记录一个下一令牌产生的时间，并动态更新它，就能够轻松完成限流功能
```java
public class SimpleLimiter{
    //下一令牌产生时间
    long next = System.nanoTime();
    //发放令牌时间间隔:纳秒
    long interval = 1000_000_000;
    //预占令牌，返回能够获取令牌的时间
    synchronized long reserve(long now){
        //请求时间在下一令牌产生时间之后
        //重新计算下一令牌产生时间
        if(now > next){
            //将下一令牌产生时间重置为当前时间
            next = now;
        }
        //能够获取令牌的时间
        long at = next;
        //设置下一令牌产生时间
        next += interval;
        //返回线程需要等待的时间
        return Math.max(at, 0L);
    } 

    //申请令牌
    void acquire(){
        //申请令牌时的时间
        long now = System.nanoTime();
        //预占令牌
        long at = reserve(now);
        long waitTime = max(at-now, 0);
        //按照条件等待
        if(waitTime > 0) {
            try{
                TimeUnit.NANOSECONDS .sleep(waitTime);
            }catch(InterruptedException e){
                e.printStackTrace();
            }
        }
    }
}
```

## 令牌桶有数据的情况下实现
- 增加了一个 resync() 方法: 线程请求令牌的时间在下一令牌产生时间之后，会重新计算令牌桶中的令牌数，新产生的令牌的计算公式是：(now-next)/interval
```java
class SimpleLimiter {
  //当前令牌桶中的令牌数量
  long storedPermits = 0;
  //令牌桶的容量
  long maxPermits = 3;
  //下一令牌产生时间
  long next = System.nanoTime();
  //发放令牌间隔：纳秒
  long interval = 1000_000_000;
  
  //请求时间在下一令牌产生时间之后,则
  // 1.重新计算令牌桶中的令牌数
  // 2.将下一个令牌发放时间重置为当前时间
  void resync(long now) {
    if (now > next) {
      //新产生的令牌数
      long newPermits=(now-next)/interval;
      //新令牌增加到令牌桶
      storedPermits=min(maxPermits, 
        storedPermits + newPermits);
      //将下一个令牌发放时间重置为当前时间
      next = now;
    }
  }
  //预占令牌，返回能够获取令牌的时间
  synchronized long reserve(long now){
    resync(now);
    //能够获取令牌的时间
    long at = next;
    //令牌桶中能提供的令牌
    long fb=min(1, storedPermits);
    //令牌净需求：首先减掉令牌桶中的令牌
    long nr = 1 - fb;
    //重新计算下一令牌产生时间
    next = next + nr*interval;
    //重新计算令牌桶中的令牌
    this.storedPermits -= fb;
    return at;
  }
  //申请令牌
  void acquire() {
    //申请令牌时的时间
    long now = System.nanoTime();
    //预占令牌
    long at=reserve(now);
    long waitTime=max(at-now, 0);
    //按照条件等待
    if(waitTime > 0) {
      try {
        TimeUnit.NANOSECONDS
          .sleep(waitTime);
      }catch(InterruptedException e){
        e.printStackTrace();
      }
    }
  }
}
```

- Guava中代码实现主要如下:
```java
public class RateLimiter{
    @CanIgnoreReturnValue
    public double acquire() {
        return this.acquire(1);
    }

    @CanIgnoreReturnValue
    public double acquire(int permits) {
        long microsToWait = this.reserve(permits);
        this.stopwatch.sleepMicrosUninterruptibly(microsToWait);
        return 1.0D * (double)microsToWait / (double)TimeUnit.SECONDS.toMicros(1L);
    }

    final long reserve(int permits) {
        checkPermits(permits);
        synchronized(this.mutex()) {
            return this.reserveAndGetWaitLength(permits, this.stopwatch.readMicros());
        }
    }

    final long reserveAndGetWaitLength(int permits, long nowMicros) {
        long momentAvailable = this.reserveEarliestAvailable(permits, nowMicros);
        return Math.max(momentAvailable - nowMicros, 0L);
    }

    abstract long reserveEarliestAvailable(int permits, long nowMicros);
}
/**
 * reserveEarliestAvailable 实现
 */
public class SmoothRateLimiter{
    final long reserveEarliestAvailable(int requiredPermits, long nowMicros) {
        this.resync(nowMicros);
        long returnValue = this.nextFreeTicketMicros;
        double storedPermitsToSpend = Math.min((double)requiredPermits, this.storedPermits);
        double freshPermits = (double)requiredPermits - storedPermitsToSpend;
        long waitMicros = this.storedPermitsToWaitTime(this.storedPermits, storedPermitsToSpend) + (long)(freshPermits * this.stableIntervalMicros);
        this.nextFreeTicketMicros = LongMath.saturatedAdd(this.nextFreeTicketMicros, waitMicros);
        this.storedPermits -= storedPermitsToSpend;
        return returnValue;
    }
}
```







