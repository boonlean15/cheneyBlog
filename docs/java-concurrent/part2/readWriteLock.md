# ReadWriteLock 实现快速完备的缓存
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/readWriteLock/1.png" alt="png"> 

## 读写锁遵循的基本原则
读写锁不是java特有的，所有的读写锁都遵循一下三个基本原则
- 允许多个线程读共享变量
- 只允许一个线程写共享变量
- 如果有写线程执行写操作，禁止其他线程读共享变量

## ReadwriteLock实现缓存
```java
class Cache<K,V> {
  final Map<K, V> m =
    new HashMap<>();
  final ReadWriteLock rwl =
    new ReentrantReadWriteLock();
  // 读锁
  final Lock r = rwl.readLock();
  // 写锁
  final Lock w = rwl.writeLock();
  // 读缓存
  V get(K key) {
    r.lock();
    try { return m.get(key); }
    finally { r.unlock(); }
  }
  // 写缓存
  V put(K key, V value) {
    w.lock();
    try { return m.put(key, v); }
    finally { w.unlock(); }
  }
  // 按需加载
  V get(K key) {
    V v = null;
    //读缓存
    r.lock();         ①
    try {
      v = m.get(key); ②
    } finally{
      r.unlock();     ③
    }
    //缓存中存在，返回
    if(v != null) {   ④
      return v;
    }  
    //缓存中不存在，查询数据库
    w.lock();         ⑤
    try {
      //再次验证
      //其他线程可能已经查询过数据库
      v = m.get(key); ⑥
      if(v == null){  ⑦
        //查询数据库
        v=省略代码无数
        m.put(key, v);
      }
    } finally{
      w.unlock();
    }
    return v; 
  }
}
```
- 一次性加载缓存
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/readWriteLock/2.png" alt="png"> 

- 按需加载
  - 释放读锁后再获取写锁
  - 再次验证的方式，能够避免高并发场景下重复查询数据的问题
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/readWriteLock/3.png" alt="png"> 

- 按需加载数据同步问题
  - 超时机制
  - 数据库和缓存双写方案
  - 数据库数据更新后通知缓存方案

## ReadWriteLock不允许升级、允许降级
```java
//升级 这里写锁获取不到锁，导致这个线程阻塞住，并且第一步的读锁不会释放，导致死锁
//读缓存
r.lock();         ①
try {
  v = m.get(key); ②
  if (v == null) {
    w.lock();
    try {
      //再次验证并更新缓存
      //省略详细代码
    } finally{
      w.unlock();
    }
  }
} finally{
  r.unlock();     ③
}

//降级 降级是允许的，获取写锁后，允许获取读锁，这是同一个线程
class CachedData {
  Object data;
  volatile boolean cacheValid;
  final ReadWriteLock rwl =
    new ReentrantReadWriteLock();
  // 读锁  
  final Lock r = rwl.readLock();
  //写锁
  final Lock w = rwl.writeLock();
  
  void processCachedData() {
    // 获取读锁
    r.lock();
    if (!cacheValid) {
      // 释放读锁，因为不允许读锁的升级
      r.unlock();
      // 获取写锁
      w.lock();
      try {
        // 再次检查状态  
        if (!cacheValid) {
          data = ...
          cacheValid = true;
        }
        // 释放写锁前，降级为读锁
        // 降级是可以的
        r.lock(); ①
      } finally {
        // 释放写锁
        w.unlock(); 
      }
    }
    // 此处仍然持有读锁
    try {use(data);} 
    finally {r.unlock();}
  }
}
```
## ReentrantReadWriteLock

0000 0000 0000 0000 0000 0000 0000 0000  0
0000 0000 0000 0000 0000 0000 0000 0001  1
0000 0000 0000 0001 0000 0000 0000 0000  65536 
0000 0000 0000 0000 1111 1111 1111 1111  65535
```java
static final int EXCLUSIVE_MASK = (1 << SHARED_SHIFT) - 1;  //65535
/** Returns the number of exclusive holds represented in count 1到65535数据执行exclusiveCount返回的是1-65535的值 */
static int exclusiveCount(int c) { return c & EXCLUSIVE_MASK; }

static final int SHARED_SHIFT   = 16;
/** Returns the number of shared holds represented in count  */
static int sharedCount(int c)    { return c >>> SHARED_SHIFT; }
```
1 << 16 
0000 0000 0000 0000 0000 0000 0000 0001
0000 0000 0000 0000 1111 1111 1111 1111
1 & 65535 == 1      2 & 65535 == 2

- ReentrantReadWriteLock 的state 低16位用于独占模式锁、高16位用于共享read锁，以此来实现读写

### 原因分析
- 获取了写锁，那么当前线程自然也允许读了，因不允许其他线程读和写
### 疑问解答
- 获取写锁的前提是读锁和写锁均未被占用
- 获取读锁的前提是没有其他线程占用写锁
- 申请写锁时不中断其他线程申请读锁 (公平锁如果有写申请，能禁止读锁)

