# 信号量
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/semaphore/1.png" alt="png"> 

信号量模型在1965年由计算机科学家dijkstra迪杰斯特拉提出，此后的15年信号量都是并发编程领域的终结者。直到管程模型在1980年被提出，才有了第二选择

## 信号量模型
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/semaphore/2.png" alt="png"> 

- 组成部分：其中init、down、up三个方法都要求是原子性操作，由实现方保证
  - count 计数器
  - queue 等待队列
  - init 初始化计数器
  - down count值减1，如果小于0，则线程阻塞并放入等待队列queue
  - up count值加1，如果小于等于0，则从queue队列中唤醒一个线程并移除
- 代码示例
```java
class Semaphore{
    int count;
    Queue queue;
    //初始化方法
    Semaphore(int count){
        this.count = count;
    }
    //down
    void down(){
        this.count--;
        if(this.count < 0){
            //将当前线程插入等待队列
            queue.end(thread);
            //阻塞当前线程
            thread.wait();
        }
    }
    //up
    void up(){
        this.count++;
        if(this.count <= 0){
            //移除等待队列中的某个线程T
            queue.ded(thread);
            //唤醒线程T
            thread.single();
        }
    }
}
```

## java中实现信号量
java sdk中通过Semaphore实现信号量，down对应acquire、up对应release
- count+=1示例的互斥使用信号量实现代码
```java
static int count;
//初始化信号量
static final Semaphore s = new Semaphore(1);
//用信号量保证互斥    
static void addOne() {
  s.acquire();
  try {
    count+=1;
  } finally {
    s.release();
  }
}
```
> 如果有2个线程过来，由于方法是原子性，则只有一个线程能通过，第二个执行down方法是，count=-1，线程被阻塞，知道被通过执行的线程唤醒，由此保证了互斥性

## 实现限流器
Semaphore可以实现一个场景，允许多个线程访问同一个临界区代码(当count计数器当指不为1时)。这个是Lock做不到的一个功能点，也是有Lock后还提供Semaphore的原因
### 使用场景
- 各种池化资源：对象池、线程池、连接池
- 对象池示例：
```java
package com.cheney.utils.test;

import java.util.List;
import java.util.Vector;
import java.util.concurrent.Semaphore;
import java.util.function.Function;

/**
 * @author cheney
 * 日期 2024/5/9
 */
public class ObjPool<T,R> {
    final List<Object> pool;
    final Semaphore sem;
    ObjPool(int size,T t) throws InstantiationException, IllegalAccessException {
        pool = new Vector<Object>(){};
        for(int i=0; i<size; i++){
            Object o = t.getClass().newInstance();
            pool.add(o);
        }
        sem = new Semaphore(size);
    }
    // 利用对象池的对象，调用func
    R exec(Function<Object,R> func) {
        Object t = null;
        try {
            sem.acquire();
        } catch (InterruptedException e) {
            System.out.println("线程中断");
            sem.release();
        }
        try{
            t = pool.remove(0);
            return func.apply(t);
        }finally{
            pool.add(t);
            sem.release();
        }
    }

    public static void main(String[] args) throws InterruptedException, InstantiationException, IllegalAccessException {
        // 创建对象池
        ObjPool<Allocator, String> pool = new ObjPool<>(10, new Allocator());
        // 通过对象池获取t，之后执行
        pool.exec(t -> {
            System.out.println(t);
            return t.toString();
        });
    }
}
```
**List的Object如果不用使用T泛型的话，考虑传递List集合或数据到构造器**
- 分配工作是通过 pool.remove(0) 实现的

## 总结
> Java 在并发编程领域走的很快，重点支持的还是管程模型。 管程模型理论上解决了信号量模型的一些不足，主要体现在易用性和工程化方面，例如用信号量解决我们曾经提到过的阻塞队列问题，就比管程模型麻烦很多

- 信号量没有条件变量，用信号量实现阻塞队列问题，需要自己实现类似Condition的逻辑。

