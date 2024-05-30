# 原子类 无锁工具类典范
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/atomic/1.png" alt="png"> 

## 原子类实现原理 CAS
只有当内存中 count 的值等于期望值 A 时，才能将内存中 count 的值更新为计算结果 A+1，这就是 CAS 的语义
> CAS 指令包含 3 个参数：共享变量的内存地址 A、用于比较的值 B 和共享变量的新值 C；并且只有当内存中地址 A 处的值等于 B 时，才能将内存中地址 A 处的值更新为新值 C。作为一条 CPU 指令，CAS 指令本身是能够保证原子性的。
- 使用 CAS 来解决并发问题，一般都会伴随着自旋，而所谓自旋，其实就是循环尝试
- 经典范例
```java
do {
  // 获取当前值
  oldV = xxxx；
  // 根据当前值计算新值
  newV = ...oldV...
}while(!compareAndSet(oldV,newV);
```
## Java 如何实现原子化的 count += 1
- 其实就是CAS
```java
public final long getAndAddLong(
  Object o, long offset, long delta){
  long v;
  do {
    // 读取内存中的值
    v = getLongVolatile(o, offset);
  } while (!compareAndSwapLong(
      o, offset, v, v + delta));
  return v;
}
//原子性地将变量更新为x
//条件是内存中的值等于expected
//更新成功则返回true
native boolean compareAndSwapLong(
  Object o, long offset, 
  long expected,
  long x);
```
## CAS 的ABA 的问题
> 假设 count 原本是 A，线程 T1 在执行完代码①处之后，执行代码②处之前，有可能 count 被线程 T2 更新成了 B，之后又被 T3 更新回了 A，这样线程 T1 虽然看到的一直是 A，但是其实已经被其他线程更新过了，这就是 ABA 问题
## 原子类概览
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/atomic/2.png" alt="png"> 

### 原子化方法
- 原子化的基本数据类型
```java
/**
 * 原子化的++i 的区别
 * Atomically increments by one the current value.
 *
 * @return the updated value
 */
public final int incrementAndGet() {
    return unsafe.getAndAddInt(this, valueOffset, 1) + 1;
}
getAndIncrement() //原子化i++
getAndDecrement() //原子化的i--
incrementAndGet() //原子化的++i 
decrementAndGet() //原子化的--i
//当前值+=delta，返回+=前的值
getAndAdd(delta) 
//当前值+=delta，返回+=后的值
addAndGet(delta)
//CAS操作，返回是否成功
compareAndSet(expect, update)
//以下四个方法
//新值可以通过传入func函数来计算
getAndUpdate(func)
updateAndGet(func)
getAndAccumulate(x,func)
accumulateAndGet(x,func)
```
- 原子化的对象引用类型
  - AtomicStampedReference 和 AtomicMarkableReference 这两个原子类可以解决 ABA 问题。
    > 通过附加再更新一个版本号，只要保证版本号是递增的，那么即便 A 变成 B 之后再变回 A，版本号也不会变回来（版本号递增的)
```java
boolean compareAndSet(V expectedReference,V newReference,int expectedStamp,int newStamp) 
```
- 原子化数组
- 原子化对象属性更新器
  > 对象属性必须是 volatile 类型的，只有这样才能保证可见性
```java
public static <U>
AtomicXXXFieldUpdater<U> 
newUpdater(Class<U> tclass, 
  String fieldName)
```
- 原子化的累加器
    > 如果你仅仅需要累加操作，使用原子化的累加器性能会更好

> 对象引用、数组、对象属性提供的方法都差不多，对应的方法多了参数(例如数组：每个方法多了一个数组的索引参数）

## 总结
- 性能好，其次是基本不会出现死锁问题
- 可能出现饥饿和活锁问题，因为自旋会反复重试
- 基于 compareAndSet() 方法，你可以构建自己的无锁数据结构
  > 建议你不要这样做，这个工作最好还是让大师们去完成，原因是无锁算法没你想象的那么简单
- 所有原子类的方法都是针对一个共享变量的
- 需要解决多个变量的原子性问题，建议还是使用互斥锁方案