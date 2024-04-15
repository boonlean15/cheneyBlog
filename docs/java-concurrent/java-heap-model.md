# Java内存模型：看Java如何解决可见性和有序性问题

## 什么是java内存模型

### Java内存模型与JVM内存模型的区别
1) Java内存模型定义了一套规范，能使JVM按需禁用cpu缓存和禁止编译优化。这套规范包括对volatile, synchronized, final三个关键字的解析，和6个Happen-Before规则。 
2) JVM内存模型是指程序计数器，JVM方法栈，本地方法栈，堆，方法区这5个要素。

## 使用 volatile 的困惑
> 告诉编译器，对这个变量的读写，不能使用 CPU 缓存，必须从内存中读取或者写入

- Java 内存模型在 1.5 版本对 volatile 语义进行了增强。怎么增强的呢？答案是一项 Happens-Before 规则。

## Happens-Before 规则
> **前面一个操作的结果对后续操作是可见的**
Happens-Before 约束了编译器的优化行为，虽允许编译器优化，但是要求编译器优化后一定遵守 Happens-Before 规则。

## 1. 程序的顺序性规则
> 在一个线程中，按照程序顺序，前面的操作happens-before于后续的任意操作，即在一个线程中，程序前面对某个变量的修改一定是对后续操作可见的

## 2.volatile 变量规则
> 指对一个 volatile 变量的写操作， Happens-Before 于后续对这个 volatile 变量的读操作。

## 3. 传递性
> 这条规则是指如果 A Happens-Before B，且 B Happens-Before C，那么 A Happens-Before C。

<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/javaheap/1.png" alt="png"> 

```java
class VolatileExample {
  int x = 0;
  volatile boolean v = false;
  public void writer() {
    x = 42;
    v = true;
  }
  public void reader() {
    if (v == true) {
      // 这里x会是多少呢？
    }
  }
}
//“x=42” Happens-Before 写变量 “v=true” ，这是规则 1 的内容；
//写变量“v=true” Happens-Before 读变量 “v=true”，这是规则 2 的内容
//
```
> 如果线程 B 读到了“v=true”，那么线程 A 设置的“x=42”对线程 B 是可见的。也就是说，线程 B 能看到 “x == 42” ，有没有一种恍然大悟的感觉？这就是 1.5 版本对 volatile 语义的增强，这个增强意义重大，1.5 版本的并发工具包（java.util.concurrent）就是靠 volatile 语义来搞定可见性的

## 4.管程中锁的规则
**这条规则是指对一个锁的解锁happens-before于后续对这个锁的加锁**
> 管程模型是一种解决并发问题的模型，称为管程模型。管程是一种同步原语，java中指的是synchronized，synchronized是java对管程的实现。

管程中的锁是隐式实现的，进入synchronized代码块自动加锁，执行完代码块自动解锁。加锁和释放锁是编译器帮我们实现的。

## 5.线程start()规则
**主线程A启动线程B，线程A调用线程B start()方法之前的操作对线程B可见**

## 6.线程join()规则
**主线程A调用线程B.join()方法，当join()方法返回时，线程B中的操作对主线程A可见**
```java
Thread B = new Thread(()->{
  // 此处对共享变量var修改
  var = 66;
});
// 例如此处对共享变量修改，
// 则这个修改结果对线程B可见
// 主线程启动子线程
B.start();
B.join()
// 子线程所有对共享变量的修改
// 在主线程调用B.join()之后皆可见
// 此例中，var==66
```

## final 
final 修饰变量时，初衷是告诉编译器：这个变量生而不变，可以可劲儿优化
### 逸出
```java
// 以下代码来源于【参考1】
final int x;
// 错误的构造函数
public FinalFieldExample() { 
  x = 3;
  y = 4;
  // 此处就是讲this逸出，
  global.obj = this;
}
```
在构造函数里面将 this 赋值给了全局变量 global.obj，这就是“逸出”，线程通过 global.obj 读取 x 是有可能读到 0 的
在 1.5 以后 Java 内存模型对 final 类型变量的重排进行了约束。现在只要我们提供正确构造函数没有“逸出”，就不会出问题了。

## 7.线程中断
对线程interrupt()方法的调用happens-before于被中断线程的代码检测到中断事件的发生

## 8.对象终结规则
一个对象的初始化完成(构造函数执行结束)happens-before于它的finalize()方法的开始

## 中断线程
- 线程终止：当run方法体的最后一行代码执行完毕，并经由return语句返回，或者方法中出现异常未捕获
- 没有可以强制线程终止的方法：interrupt方法可以用来请求终止线程
- 中断只是引起线程的注意，线程可以决定何时响应中断
- Thread
   - void interrupt()
   > 向线程发送中断请求。线程的中断状态将被设置为true。如果目前该线程被一个sleep调用阻塞，那么，Interrupt Exception异常将被抛出
   - static boolean interrupted()
   > 测试当前线程（正在执行这一命令的线程）是否被中断。注意，这是一个静态方法，这一调用会产生副作用，它将当前线程的中断状态重置为false
   - boolean isInterrupted
   > 测试线程是否被终止。不像静态的中断方法，这一调用不改变线程的中断状态
   - static Thread currentThread()
   > 返回代表当前执行线程的Thread对象


## java内存区域

- 线程共享数据区域
  - **方法区** 被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数据，静态常量池
  - **堆** 存放对象实例
- 线程私有数据区域
  - **虚拟机栈** 与线程同时创建，总数与线程关联。每个方法执行时都会创建一个栈桢来存储方法的的变量表、操作数栈、动态链接方法、返回值、返回地址等信息
  - **程序计数器** 字节码行号指示器。字节码解释器工作时，通过改变这个计数器的值来选取下一条需要执行的字节码指令
  - **本地方法栈** 虚拟机用到的 Native 方法相关