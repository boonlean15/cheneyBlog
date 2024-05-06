# 等待-通知机制优化循环等待
<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/wait-notify/1.png" alt="png"> 

> 在细粒度锁的时候，获取转入和转出账户。使用**占用且等待**破坏死锁条件时，使用了while循环，如果并发量大时，操作耗时长，循环次数多，太消耗CPU了

## 就医流程

- 挂号分诊，等待叫号
- 到号，大夫就诊(没检查报告)
- 做检查，大夫叫号看下一个病人
- 检查完毕，重新等待分诊叫号
- 到号，大夫就诊(有检查报告)

## 等待-通知机制

- 获取互斥锁...
- 获取到互斥锁 条件不满足
- 阻塞，等待...释放锁
- 条件满足，获取互斥锁
- 获取到互斥锁

> 完整的等待 - 通知机制：线程首先获取互斥锁，当线程要求的条件不满足时，释放互斥锁，进入等待状态；当要求的条件满足时，通知等待的线程，重新获取互斥锁。

## synchronized 实现等待 - 通知机制

<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/wait-notify/2.png" alt="png"> 
<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/wait-notify/3.png" alt="png"> 

**等待队列和互斥锁是一对一关系，进入临界区有一个等待队列，wait是一个等待队列**

### 注意
- notify和notifyAll通知的是线程条件曾经满足过
  > 因为notify通知的时刻条件是满足的，但轮到线程执行的时候，条件则有可能不满足。(可能被其他线程抢占执行了，条件又变成不满足了)
- 线程要想重新执行，仍然需要获取到互斥锁
- 尽量使用notifyAll (notify容易造成死锁)

- wait()、notify()、notifyAll() 方法操作的等待队列是互斥锁的等待队列
- wait()、notify()、notifyAll() 都是在 synchronized{}内部被调用的
- 如果在 synchronized{}外部调用，或者锁定的 this，而用 target.wait() 调用的话，JVM 会抛出一个运行时异常：java.lang.IllegalMonitorStateException。

```java
//利用这种范式可以解决上面提到的条件曾经满足过这个问题
  while(条件不满足) {
    wait();
  }
```

### 示例
```java
public class MyLock {
// 测试转账的main方法
    public static void main(String[] args) throws InterruptedException {
        Account src = new Account(10000);
        Account target = new Account(10000);
        CountDownLatch countDownLatch = new CountDownLatch(9999);
        for (int i = 0; i < 9999; i++) {
            new Thread(()->{
                src.transactionToTarget(1,target);
            countDownLatch.countDown();
            }).start();
        }
        countDownLatch.await();
        System.out.println("src="+src.getBanalce() );
        System.out.println("target="+target.getBanalce() );
    }
    static class Account{ //账户类
        public Account(Integer banalce) {
            this.banalce = banalce;
        }
        private Integer banalce;
        public void transactionToTarget(Integer money,Account target){//转账方法
            Allocator.getInstance().apply(this,target);
            this.banalce -= money;
            target.setBanalce(target.getBanalce()+money);
            Allocator.getInstance().release(this,target);
        }
        public  Integer getBanalce() {
            return banalce;
        }
        public void setBanalce(Integer banalce) {
            this.banalce = banalce;
        }
    }
    static class Allocator { //单例锁类
        private Allocator(){}
        private List<Account> locks = new ArrayList<>();
        public  synchronized void apply(Account src,Account tag){
            while (locks.contains(src)||locks.contains(tag)) {
                try {
                    this.wait();
                } catch (InterruptedException e) {
                }
            }
            locks.add(src);
            locks.add(tag);
        }
        public synchronized void release(Account src,Account tag){
            locks.remove(src);
            locks.remove(tag);
            this.notifyAll();
        }
        public static  Allocator getInstance(){
            return AllocatorSingle.install;
        }
        static class AllocatorSingle{
            public static Allocator install = new Allocator();
        }
    }
}
```