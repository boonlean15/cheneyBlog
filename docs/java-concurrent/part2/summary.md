# 并发代码注意事项

## while(true) 总不让人省心
- 死循环问题
- 死锁/活锁问题
```java
class Account {
  private int balance;
  private final Lock lock
          = new ReentrantLock();
  // 转账
  void transfer(Account tar, int amt){
    while (true) {
      if(this.lock.tryLock()) {
        try {
          if (tar.lock.tryLock()) {
            try {
              this.balance -= amt;
              tar.balance += amt;
              //新增：退出循环
              break;
            } finally {
              tar.lock.unlock();
            }
          }//if
        } finally {
          this.lock.unlock();
        }
      }//if
      //新增：sleep一个随机时间避免活锁
      Thread.sleep(随机时间);
    }//while
  }//transfer
}
```

## signalAll() 总让人省心
- signalAll更安全
- 尽量选择更安全的方式
```java
// RPC结果返回时调用该方法   
private void doReceived(Response res) {
  lock.lock();
  try {
    response = res;
    done.signalAll();
  } finally {
    lock.unlock();
  }
}
```

## Semaphore 需要锁中锁
- semaphore允许多个线程访问临界区
- 需要注意并发问题

## 锁的申请和释放要成对出现
- 最佳实践try{}catch{}
- stampedLock的使用，注意stamp的赋值
```java
private double x, y;
final StampedLock sl = new StampedLock();
// 存在问题的方法
void moveIfAtOrigin(double newX, double newY){
 long stamp = sl.readLock();
 try {
  while(x == 0.0 && y == 0.0){
    long ws = sl.tryConvertToWriteLock(stamp);
    if (ws != 0L) {
      //问题出在没有对stamp重新赋值
      //新增下面一行
      stamp = ws;
      x = newX;
      y = newY;
      break;
    } else {
      sl.unlockRead(stamp);
      stamp = sl.writeLock();
    }
  }
 } finally {
  //此处unlock的是stamp
  sl.unlock(stamp);
}
```

## 回调函数总要注意执行线程是谁
- 通过线程池(线程数为1,避免并发访问共享数据),执行回调函数,避免提升不了性能
- CyclicBarrier执行回调函数的是最后把计数器减为0的线程,同步调用回调函数
- 遇到回调函数应该本能的问自己，执行回调函数的线程是谁
- 不同线程的ThreadLocal数据不同，Spring通过ThreadLocal管理事务(如不清楚ThreadLocal数据，容易导致数据不一致)

## 共享线程池 有福同享就要有难同当
- 默认情况下ForkJoinTask共享一个线程池ForkJoinPool
- 共享线程池时，如有IO阻塞调用，则有难同当了
- 高可用的今天，使用隔离方案

## 线上问题定位利器 线程栈dump
- 查看线程状态，分析线程进入此状态的原因是否合理
- 给线程赋予一个有意义的名字，可以方便定位问题
   - ThreadFactory给线程池中的线程赋予有意义的名字
   - 执行run时，Thread.currentThread().setName();赋名



