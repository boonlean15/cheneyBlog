# Actor模型-面向对象原生的并发模型
面向对象编程的理论，对象之间通信要依靠消息
- **一切都是actor**
- **actor之间通过消息通信**
- **所有的计算都是在actor里**

## Hello Actor模型
Actor模型本质是一个计算模型，在Actor模型里，一切都是Actor，并且Actor之间是完全隔离的，不会共享任何变量。

- 因为不共享任何变量，很多人把Actor模型定义为一种并发计算模型。
- java本身不支持Actor模型，目前能完备支持Actor模型的是Akka类库
- Akka示例：
```java
package com.cheney.concurrentmodel;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Props;
import akka.actor.UntypedAbstractActor;

public class ActorDemo {

    static class HelloActor extends UntypedAbstractActor {
        @Override
        public void onReceive(Object message) {
            System.out.println("Hello " + message);
        }
    }

    public static void main(String[] args) {
        //创建Actor系统
        ActorSystem actorSystem = ActorSystem.apply("HelloSystem");
        //创建HelloActor
        ActorRef helloActor = actorSystem.actorOf(Props.create(HelloActor.class));
        //发送消息给HelloActor
        helloActor.tell("cheney", ActorRef.noSender());
    }
}
```
> actor模型和面向对象编程契合度非常高，完全可以用Actor类比面向对象编程里面的对象，且Actor之间的通信方式完美地遵守消息机制，而不是通过对象方法实现对象的通信。

## 消息和对象方法的区别
Actor的消息机制，可以类比现实世界里的写信。
> Actor内部有一个邮箱，接收到消息先放到邮箱里，如果邮箱里有积压的消息，那么新收到的消息就不会马上得到处理，正是因为Actor使用单线程处理消息，所以不会出现并发问题。

- Actor内部工作模式：只有一个消费者线程的生产者-消费者模式
- **Actor中的消息机制是完全异步的**(对象方法在return之前，调用方一直等待)
- Actor模型适用于并发计算，也适用于分布式计算(对象方法需要持有对象引用，且所有对象必须在同一个进程中)
- **发送消息和接收消息的 Actor 可以不在一个进程中，也可以不在同一台机器上**

## Actor的规范化定义
Actor是一种基础的计算单元，具体包括三部分能力：
- 处理能力：处理接收到的消息
- 存储能力：Actor可以存储自己的内部状态，并且内部状态在不同Actor之间是绝对隔离的
- 通信能力：Actor可以和其他Actor通信

Actor接收一个消息后，可以做以下三件事：
- 创建更多的Actor
- 发消息给其他Actor
- 确定如何处理下一条消息
>  Actor 具备存储能力，它有自己的内部状态，所以你也可以把 Actor 看作一个状态机，把 Actor 处理消息看作是触发状态机的状态变化；而状态机的变化往往要基于上一个状态，触发状态机发生变化的时刻，上一个状态必须是确定的，所以确定如何处理下一条消息，本质上不过是改变内部状态。


## Actor实现累加器
- 整个程序没有锁，也没有 CAS，但是程序是线程安全的。
```java
package com.cheney.concurrentmodel;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Props;
import akka.actor.UntypedAbstractActor;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CounterActorDemo {

    //累加器
    static class CounterActor extends UntypedAbstractActor{
        private int count = 0;

        @Override
        public void onReceive(Object message) {
            //如果接收到的消息是数字类型，执行累加操作，否则打印counter的值
            if(message instanceof Number){
                count += ((Number) message).intValue();
            }else {
                System.out.println("count: " + count);
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        ActorSystem actorSystem = ActorSystem.apply("CountSystem");//创建Actor系统
        ActorRef counterActor = actorSystem.actorOf(Props.create(CounterActor.class));//创建CounterActor
        ExecutorService executorService = Executors.newFixedThreadPool(4);//4个线程生产消息
        //生产4*100000个消息
        for(int i = 0; i < 4; i++){
            executorService.execute(() -> {
                for(int j = 0; j < 10000; j++){
                    counterActor.tell(1, ActorRef.noSender());
                }
            });
        }
        executorService.shutdown();//关闭线程池
        Thread.sleep(1000);//等待CounterActor处理完所有消息
        counterActor.tell("",ActorRef.noSender());//打印结果
        actorSystem.terminate();//关闭Actor系统
    }

}
```


## 面向对象编程
Actor 与面向对象编程（OOP）中的对象匹配度非常高，在面向对象编程里，系统由类似于生物细胞那样的对象构成，对象之间也是通过消息进行通信，所以在面向对象语言里使用 Actor 模型基本上不会有违和感。

> Actor 可以创建新的 Actor，这些 Actor 最终会呈现出一个树状结构，非常像现实世界里的组织结构，所以利用 Actor 模型来对程序进行建模，和现实世界的匹配度非常高。
> Actor 模型和现实世界一样都是异步模型，理论上不保证消息百分百送达，也不保证消息送达的顺序和发送的顺序是一致的，甚至无法保证消息会被百分百处理。
> 虽然实现 Actor 模型的厂商都在试图解决这些问题，但遗憾的是解决得并不完美，所以使用 Actor 模型也是有成本的。
