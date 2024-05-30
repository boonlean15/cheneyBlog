# 并发容器
java1.5之前提供的同步容器性能较差，1.5之后提供了更多的同步容器和提升了性能
## 同步容器和注意事项
java提供的容器主要有四大类，List、Map、Set、Queue
### 实现线程安全的容器
- 把ArrayList变成线程安全的容器SafeArrayList
  > 通过封装ArrayList到内部，然后控制访问路径实现线程安全
- 示例
```java
SafeArrayList<T>{
  //封装ArrayList
  List<T> c = new ArrayList<>();
  //控制访问路径
  synchronized T get(int idx){
    return c.get(idx);
  }
  synchronized void add(int idx, T t) {
    c.add(idx, t);
  }
  synchronized boolean addIfNotExist(T t){
    if(!c.contains(t)) {
      c.add(t);
      return true;
    }
    return false;
  }
}
```
  > 其中addIfNotExist需要注意竞态条件，此处把synchronized关键字放在了方法上实现原子性
- java的Collections工具类同样的使用包装方式，实现了一套完备的线程安全包装类
```java
List list = Collections.synchronizedList(new ArrayList());
Set set = Collections.synchronizedSet(new HashSet());
Map map = Collections.synchronizedMap(new HashMap());
```
> 当存在组合操作时，需要注意竞态条件，例如容器遍历时
- Collections内部的synchronized锁定的是this对象，所以容器遍历时，锁住list是线程安全的
  > Java 提供的同步容器还有 Vector、Stack 和 Hashtable，这三个容器不是基于包装类实现的，但同样是基于 synchronized 实现的，对这三个容器的遍历，同样要加锁保证互斥。
```java
List list = Collections.synchronizedList(new ArrayList());
Iterator i = list.iterator(); 
while (i.hasNext())
  foo(i.next());
//线程安全
List list = Collections.synchronizedList(new ArrayList());
synchronized (list){
    Iterator i = list.iterator(); 
    while (i.hasNext())
    foo(i.next());
}
```

## 并发容器和注意事项
1.5之前的线程安全的容器，一般称为同步容器，因为是synchronized实现的，性能相对较差。1.5之后提供的线程安全的容器，称为并发容器，性能相对较好
- 并发容器主要也是四大类：List、Set、Map、Queue
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/1.png" alt="png"> 

### List CopyOnWriteArrayList
CopyOnWriteArrayList内部维护了一个数组array，迭代器Iterator遍历的就是array
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/2.png" alt="png"> 
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/3.png" alt="png"> 

- 读操作完全无锁
- 如果有写操作，则复制一份array进行写操作
- 写操作执行完毕后，再把array指向这个新数组

#### CopyOnWriteArrayList的坑
- CopyOnWriteArrayList 仅适用于写操作非常少的场景，而且能够容忍读写的短暂不一致，写入的新元素并不能立刻被遍历到。
- CopyOnWriteArrayList 迭代器是只读的，不支持增删改。因为迭代器遍历的仅仅是一个快照，而对快照进行增删改是没有意义的。

### Map ConcurrentHashMap 和 ConcurrentSkipListMap
#### 主要区别
- ConcurrentHashMap 的 key 是无序的
- ConcurrentSkipListMap 的 key 是有序的
#### 相同点
- 它们的 key 和 value 都不能为空，否则会抛出NullPointerException这个运行时异常
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/4.png" alt="png"> 

#### ConcurrentHashMap 并发底层实现 (1.8)
- 底层数据结构：Node数组 + 红黑树
  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/7.png" alt="png"> 
- 保证线程安全的方式：乐观锁 + Sysnchronized
- 读操作是无锁：Node 的 val 和 next 使用 volatile 修饰，读写线程对该变量互相可见
- 为什么在有Synchronized 的情况下还要使用CAS
  > 因为CAS是乐观锁,在一些场景中（并发不激烈的情况下）它比Synchronized和ReentrentLock的效率要，当CAS保障不了线程安全的情况下（扩容或者hash冲突的情况下）转成Synchronized 来保证线程安全，大大提高了低并发下的性能。
##### get put 流程
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/5.png" alt="png"> 
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/6.png" alt="png"> 

#### SkipList 跳表
SkipList 本身就是一种数据结构，中文一般都翻译为“跳表”。跳表插入、删除、查询操作平均的时间复杂度是 O(log n)
> 理论上和并发线程数没有关系，所以在并发度非常高的情况下，若你对 ConcurrentHashMap 的性能还不满意，可以尝试一下 ConcurrentSkipListMap。

### Set CopyOnWriteArraySet 和 ConcurrentSkipListSet
> 跟前面的CopyOnWriteArrayList以及ConcurrentSkipListMap类似

### Queue
纬度分类
- 阻塞和非阻塞 阻塞队列都用blocking关键字标识
- 单端和双端 单端用Queue双端用Deque
#### Queue分类
- 单端阻塞队列
  > 其实现有 ArrayBlockingQueue、LinkedBlockingQueue、SynchronousQueue、LinkedTransferQueue、PriorityBlockingQueue 和 DelayQueue。
> 内部一般会持有一个队列，这个队列可以是数组（其实现是 ArrayBlockingQueue）也可以是链表（其实现是 LinkedBlockingQueue）；甚至还可以不持有队列（其实现是 SynchronousQueue），此时生产者线程的入队操作必须等待消费者线程的出队操作。而 LinkedTransferQueue 融合 LinkedBlockingQueue 和 SynchronousQueue 的功能，性能比 LinkedBlockingQueue 更好；PriorityBlockingQueue 支持按照优先级出队；DelayQueue 支持延时出队。
- 双端阻塞队列
  > 实现是LinkedBlockingDeque
- 单端非阻塞队列 ConcurrentLinkedQueue
- 双端非阻塞队列 ConcurrentLinkedDeque
#### 注意
- 使用队列时，需要格外注意队列是否支持有界
  >（所谓有界指的是内部的队列是否有容量限制）。实际工作中，一般都不建议使用无界的队列
- 只有 ArrayBlockingQueue 和 LinkedBlockingQueue 是支持有界的
  > 所以在使用其他无界队列时，一定要充分考虑是否存在导致 OOM 的隐患。
> 而在实际工作中，你不单要清楚每种容器的特性，还要能选对容器，这才是关键，至于每种容器的用法，用的时候看一下 API 说明就可以了，这些容器的使用都不难。

## Java 容器的快速失败机制（Fail-Fast）
> 当一个线程遍历容器时，有另一个线程对其修改就会触发fail fast机制，遍历容器的线程也会抛出异常，本质是为了确保遍历时的线程安全，容器内部维护一个初始化为modCount的expectedModeCount变量，遍历时会去检查该期望值是否等于modCount，不等于就说明出现了修改集合操作

## HashMap 线程不安全
并发场景里使用了 HashMap，因为在 1.8 之前的版本里并发执行 HashMap.put() 可能会导致 CPU 飙升到 100%
- 在jdk1.7中，在多线程环境下，扩容时会造成环形链或数据丢失。
  > resize->transfer的时候采用indexFor头插法导致形成环形链
- 在jdk1.8中，在多线程环境下，会发生数据覆盖的情况
  > 在发生hash碰撞，不再采用头插法方式，而是直接插入链表尾部，因此不会出现环形链表的情况。但并发时存在数据覆盖的问题

[HashMap 线程不安全，它为啥不安全呢？](https://mp.weixin.qq.com/s/yxn47A4UcsrORoDJyREEuQ)