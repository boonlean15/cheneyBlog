# 等待唤醒机制的规范实现

## 发送消息和消费消息不是一个线程的场景
> web需要发送消息给mq，服务消费mq中的消息，返回结果给mq，web消费mq中的消息

- web发送消息和onMessage消费消息不是一个线程
- 通过等待-唤醒的机制，让异步转同步

```java
class Message{
  String id;
  String content;
}
//该方法可以发送消息
void send(Message msg){
  //省略相关代码
}
//MQ消息返回后会调用该方法
//该方法的执行线程不同于
//发送消息的线程
void onMessage(Message msg){
  //省略相关代码
}
//处理浏览器发来的请求
Respond handleWebReq(){
  //创建一消息
  Message msg1 = new 
    Message("1","{...}");
  //发送消息
  send(msg1);
  //如何等待MQ返回的消息呢？
  String result = ...;
}
```

## Guarded Suspension规范实现
```java
package com.cheney.concurrentdesign;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Predicate;

/**
 * 等待唤醒机制规范实现
 * @author cheney
 * 日期 2024/8/11
 */
public class GuardedObject<T> {
    //受保护的对象
    T obj;
    final static Lock lock = new ReentrantLock();
    final static Condition done = lock.newCondition();
    final int timeout = 2;
    //保存所有GuardedObject
    final static Map<Object,GuardedObject> gos = new ConcurrentHashMap<>();
    //获取受保护对象
    T get(Predicate<T> p){
        lock.lock();
        try{
            while (!p.test(obj)){
                done.await(timeout, TimeUnit.SECONDS);
            }
        }catch (InterruptedException e){
            throw new RuntimeException(e);
        }finally {
            lock.unlock();
        }
        //返回非空的受保护对象
        return obj;
    }
    //事件通知方法
    void onChange(T obj){
        lock.lock();
        try{
            this.obj = obj;
            done.signalAll();
        }finally {
            lock.unlock();
        }
    }
    //静态方法创建GuardedObject
    static <K> GuardedObject create(K key){
        GuardedObject go = new GuardedObject();
        gos.put(key,go);
        return go;
    }
    static <K,T> void fireEvent(K key,T obj){
        GuardedObject go = gos.remove(key);
        if(go != null){
            go.onChange(obj);
        }
    }
    /*
    //处理浏览器发来的请求
    Respond handleWebReq(){
        int id=序号生成器.get();
        //创建一消息
        Message msg1 = new
                Message(id,"{...}");
        //创建GuardedObject实例
        GuardedObject<Message> go=
                GuardedObject.create(id);
        //发送消息
        send(msg1);
        //等待MQ消息
        Message r = go.get(
                t->t != null);
    }
    void onMessage(Message msg){
        //唤醒等待的线程
        GuardedObject.fireEvent(
                msg.id, msg);
    }
     */
}

```

## 总结
- Guarded Suspension 模式本质上是一种等待唤醒机制的实现
- Guarded Suspension 模式在解决实际问题的时候，往往还是需要扩展的
- Guarded Suspension 用来解决 发送消息和消费消息不是一个线程的场景
