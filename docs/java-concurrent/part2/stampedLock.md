# StampedLock
> 三种模式的锁，读多写少的场景下比ReadWriteLock更快的锁
## StampedLock三种模式
- 悲观读锁
- 写锁
- 乐观读
## 与ReadWriteLock的区别
### 相同点
- 允许多个线程获取悲观读锁
- 只允许一个线程获取写锁
- 悲观读锁跟写锁是互斥的
### 不同点
- stampedLock悲观读锁和写锁加锁成功后都会返回一个stamp
- 解锁的时候需要传入stamp
- 乐观读是无锁的
### 示例
```java
final StampedLock sl = new StampedLock();
// 获取/释放悲观读锁示意代码
long stamp = sl.readLock();
try {
  //省略业务相关代码
} finally {
  sl.unlockRead(stamp);
}
// 获取/释放写锁示意代码
long stamp = sl.writeLock();
try {
  //省略业务相关代码
} finally {
  sl.unlockWrite(stamp);
}
```
### 乐观读升级悲观读锁最佳实践
```java
public class Point{
  private int x,y;
  final StampedLock sl = new StampedLock();
  //计算到原点的距离 
  int distanceFromOrigin() {
    long stamp = sl.tryOptimisticRead();//乐观读
    int curX = x;int curY = y;// 读的过程数据可能被修改
    if(!sl.validate(stamp)){//判断执行读操作期间，是否存在写操作，如果存在，validate会返回false
      stamp = sl.readLock();// 升级为悲观读锁
      try{
        curX = x;
        curY = y;
      }
      finally{
        sl.unlockRead(stamp);//释放悲观读锁
      }
    }
    return curX * curX + curY * curY;
  }
}
```
## StampedLock的乐观读
### 数据库的乐观锁
- 表增加version字段
- 查询的时候把version字段一起返回
- 每个使用者需要更新时，version+1
- 执行数据更新时，通过version校验，如果version等于查询返回的version值，那么update成功并返回1。
- 如果期间有其他update操作，那么version校验不通过

**数据库乐观锁的version字段就类似StampedLock的stamp**

## StampedLock的使用注意事项
> StampedLock是ReadWriteLock的功能子集，读多写少场景下StampedLock性能很好，简单的应用场景基本可以替代ReadWriteLock
- StampedLock不支持重入(命名上也没有Reentrant)
- StampedLock的写锁、悲观读锁不支持条件变量
- 如果线程阻塞在readLock/writeLock，调用interrupt中断会导致CPU飙升
- **StampLock不要调用中断操作，如果需要中断，使用可中断的悲观读锁 readLockInterruptibly() 和写锁 writeLockInterruptibly()**

## 最佳实践模版
### 读
```java
final StampedLock sl = new StampedLock();
long stamp = sl.tryOptimisticRead();// 乐观读
// 读入方法局部变量
......
// 校验stamp
if (!sl.validate(stamp)){
  stamp = sl.readLock();// 升级为悲观读锁
  try {
    // 读入方法局部变量
    .....
  } finally {
    sl.unlockRead(stamp);//释放悲观读锁
  }
}
//使用方法局部变量执行业务操作
......
```
### 写
```java
long stamp = sl.writeLock();
try {
  // 写共享变量
  ......
} finally {
  sl.unlockWrite(stamp);
}
```

## 拓展
StampedLock 支持锁的降级（通过 tryConvertToReadLock() 方法实现）和升级（通过 tryConvertToWriteLock() 方法实现，但需要谨慎使用
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
      x = newX;
      y = newY;//正确的应该这里加上ws = stamp; ws不等于0L就是升级了写锁，那么最后要unlock的就是ws
      break;
    } else {
      sl.unlockRead(stamp);
      stamp = sl.writeLock();
    }
  }
 } finally {
  sl.unlock(stamp);
}
```
