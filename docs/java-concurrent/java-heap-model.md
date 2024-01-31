# Java内存模型：看Java如何解决可见性和有序性问题

## 什么是java内存模型

### Java内存模型与JVM内存模型的区别
1) Java内存模型定义了一套规范，能使JVM按需禁用cpu缓存和禁止编译优化。这套规范包括对volatile, synchronized, final三个关键字的解析，和6个Happen-Before规则。 
2) JVM内存模型是指程序计数器，JVM方法栈，本地方法栈，堆，方法区这5个要素。

### 使用 volatile 的困惑
> 告诉编译器，对这个变量的读写，不能使用 CPU 缓存，必须从内存中读取或者写入

- Java 内存模型在 1.5 版本对 volatile 语义进行了增强。怎么增强的呢？答案是一项 Happens-Before 规则。

## Happens-Before 规则
> **前面一个操作的结果对后续操作是可见的**
Happens-Before 约束了编译器的优化行为，虽允许编译器优化，但是要求编译器优化后一定遵守 Happens-Before 规则。

### 1. 程序的顺序性规则
> 前面的操作happens-before于后续的任意操作，即程序前面对某个变量的修改一定是对后续操作可见的

### 2.volatile 变量规则
> 指对一个 volatile 变量的写操作， Happens-Before 于后续对这个 volatile 变量的读操作。

### 3. 传递性
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
