# 局部变量是线程安全的
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/local-thread-is-safe/1.png" alt="png">

斐波那契数列: 第一个和第二个数是1，然后第三个数开始，等于n-1加上n-2的值
> cpu层面是没有方法的概念的，cpu的眼里只有一条一条的指令

## 方法是如何执行的
方法的调用过程如下，执行方法时会跳转到函数的内存地址去，执行后要能够返回。首先找到函数的下一条语句的地址，然后跳转到这个地址执行
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/local-thread-is-safe/2.png" alt="png">

### cpu去哪里找调用方法的参数和返回地址
通过**cpu堆栈寄存器即调用栈**，cpu支持一种栈结构，类似手枪的弹夹，先入后出

## 栈桢 
- 每个方法在调用栈里都有自己的空间 称为栈桢
- 每个栈桢都有对应方法的参数和返回地址
- 调用方法时，会创建新的栈桢，并压入调用栈
- 方法返回时，会自动弹出调用栈
- 栈桢和方法是同生共死的
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/local-thread-is-safe/3.png" alt="png">

**利用栈结构支持方法调用的方案非常普遍，以至于CPU内置了栈寄存器**
> 各家编程语言千奇百怪，但方法内部执行原理出奇的一致:都是靠栈结构解决的。java虽靠jvm解释执行，但方法的调用也是靠栈结构解决的

## 局部变量存在哪里
> 局部变量跟方法是同生共死的，而栈桢也是跟方法是同生共死的，所以局部变量存在栈桢上是合理的，而事实也是如此。如果一个局部变量想要跨越方法的边界，那么它只能创建在堆里

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/local-thread-is-safe/4.png" alt="png">

## 调用栈与线程
每个线程都有自己独立的调用栈，方法存在栈桢，栈桢存在调用栈里。而线程的调用栈是独立的，不存在共享，因此局部变量是线程安全的

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/local-thread-is-safe/5.png" alt="png">

## 线程封闭
局部变量不共享，是线程安全的。在单线程里访问数据，也称为**线程封闭**，由于不存在共享，即便不同步也是线程安全的，性能杠杠的。因此也成为了解决并发问题的一个解决思路。
- 示例：
> 从数据库连接池中获取的连接Connection，jdbc规范并没有要求这个连接是线程安全的。数据库连接池通过线程封闭技术，保证一个Connection被获取后，在线程未关闭Connection之前，不会在分配给其他线程，从而保证Connection不会有并发问题。

## 总结
调用栈是一个通用的概念，通过学习过的某一个语言的技术原理，可以推断出另一个语言实现某一个技术的原理。然后再通过源码验证，往往实现的情况就是如此。

**多研究原理性的东西，通用的东西，有了这些再学具体的技术就快多了**

**所有的递归算法都可以用非递归算法实现**
- 示例
> 读取一个目录及其子目录下的所有文件，请教一下不用递归改用循环怎么做？因为你不知道这个目录下有多少层子目录
```java
while(!queue.empty) {//文件夹队列，一开始只有自己一个
   var list = getDirList();//获取文件或文件夹方法,这里队列出栈
   queue.add(list);//添加文件夹到队列
   //当queue队列为空时，已经遍历了目录及其子目录下的所有文件
}
```