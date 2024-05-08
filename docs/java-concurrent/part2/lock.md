# Lock和Condition 隐藏在并发包中的管程
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/lock/1.png" alt="png"> 

java sdk并发包内容丰富包罗万象，但最重要的还是对管程的实现。因为通过管程的方式，理论上可以实现并发包里所有的工具类
- Lock实现互斥
- Condition实现同步
> sdk并发包通过Lock和Condition实现管程

## 再造管程的理由
- synchronized java内置的管程，条件变量只有多个，通过Condition可以实现多个条件变量
- synchronized获取不到锁则阻塞了，针对synchronized获取多个锁资源导致死锁的问题
- 针对不可抢占的条件的破解，可以采取如下方式：
  - 能够响应中断 (响应中断时，有机会释放曾经持有的锁)
  - 支持超时 (等待一段时间，获取不到锁不阻塞，而是返回一个错误，有机会释放曾经持有的锁)
  - 非阻塞的获取锁 (获取不到锁不阻塞，有机会释放曾经持有的锁)
- Lock对应的api
```java
// 支持中断的API
void lockInterruptibly() throws InterruptedException;
// 支持超时的API
boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
// 支持非阻塞获取锁的API
boolean tryLock();
```

## 如何保证可见性
```java
class X {
  private final Lock rtl = new ReentrantLock();
  int value;
  public void addOne() {
    // 获取锁
    rtl.lock();  
    try {
      value+=1;
    } finally {
      // 保证锁能释放
      rtl.unlock();
    }
  }
}
//ReentrantLock，内部持有一个 volatile 的成员变量 state，获取锁的时候，会读写 state 的值；
class SampleLock {
  volatile int state;
  // 加锁
  lock() {
    // 省略代码无数
    state = 1;
  }
  // 解锁
  unlock() {
    // 省略代码无数
    state = 0;
  }
}
```
- java内存模型的顺序性
- java内存模型的volatile变量规则
- java内存模型的传递性规则
> 线程1 lock的时候读写一次state，然后执行value+=1，unlock的时候读写一次state。根据顺序性，value+=1 happens-before unlock,
> 线程2 lock时，由于volatile规则，线程1的lock happens-before 线程2的lock，
> 根据传递性，线程1的value+=1 happens-before 线程2的lock。由此保证了可见性

## 什么是可重入锁
### 可重入锁
```java
class X {
  private final Lock rtl = new ReentrantLock();
  int value;
  public int get() {
    // 获取锁
    rtl.lock();         //②
    try {
      return value;
    } finally {
      // 保证锁能释放
      rtl.unlock();
    }
  }
  public void addOne() {
    // 获取锁
    rtl.lock();  
    try {
      value = 1 + get(); //①
    } finally {
      // 保证锁能释放
      rtl.unlock();
    }
  }
}
```
- addOne时获取了锁，①的时候执行get方法在②处请求再次获取锁，如果锁不是可重入的，那么当前线程则会阻塞，这样会出现死锁
- 锁 rtl 是可重入的，那么线程 T1 可以再次加锁成功
### 可重入函数
可重入函数，指的是多个线程可以同时调用该函数，每个线程都能得到正确结果；
> 并且可以在cpu切换线程后，再次执行方法的时候，方法的结果仍是正确的，代表的是这个函数是线程安全的。

## 公平锁和非公平锁
```java
//无参构造函数：默认非公平锁
public ReentrantLock() {
    sync = new NonfairSync();
}
//根据公平策略参数创建锁
public ReentrantLock(boolean fair){
    sync = fair ? new FairSync() 
                : new NonfairSync();
}
```
> 锁对应有一个等待队列，如果线程获取不到锁，则进入等待队列。如果是公平锁，唤醒的策略则是谁的等待时间长就唤醒谁、如果是非公平锁，那么不提供公平保证，可能等待时间短的线程先被唤醒

## 锁的最佳实践
**并发大师 Doug Lea《Java 并发编程：设计原则与模式》**
- 永远只在更新对象的成员变量时加锁
- 永远只在访问可变的成员变量时加锁
- 永远不在调用其他对象的方法时加锁
**其他规则**
- 减少锁的持有时间
- 减小锁的粒度