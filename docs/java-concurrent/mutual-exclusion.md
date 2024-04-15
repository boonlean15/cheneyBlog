# 互斥锁 解决原子性问题

## 简易锁模型

<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/mutual-exclusion/1.png" alt="png"> 

简易锁模型容易忽略两个点，我们锁的是什么？我们保护的是什么？

## 改进后的锁模型

<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/mutual-exclusion/2.png" alt="png"> 

**在锁 LR 和受保护资源之间，我特地用一条线做了关联**，这个关联关系非常重要。很多并发 Bug 的出现都是因为把它忽略了，然后就出现了类似**锁自家门来保护他家资产**的事情，这样的 Bug 非常不好诊断

## Java 语言提供的锁技术：synchronized

锁是一种通用的技术方案，Java 语言提供的 synchronized 关键字，就是锁的一种实现

1. synchronized可以修饰什么

```java
class X {
  // 修饰非静态方法
  synchronized void foo() {
    // 临界区
  }
  // 修饰静态方法
  synchronized static void bar() {
    // 临界区
  }
  // 修饰代码块
  Object obj = new Object()；
  void baz() {
    synchronized(obj) {
      // 临界区
    }
  }
}  
class X {
  // 修饰静态方法
  synchronized(X.class) static void bar() {
    // 临界区
  }
}
class X {
  // 修饰非静态方法
  synchronized(this) void foo() {
    // 临界区
  }
}
```
2. 隐式规则
- 加锁和解锁是编译器自动加上的。Java 编译器会在 synchronized 修饰的方法或代码块前后自动加上加锁 lock() 和解锁 unlock()，这样做的好处就是加锁 lock() 和解锁 unlock() 一定是成对出现的
- 锁定的对象

## 用 synchronized 解决 count+=1 问题

```java
//get() 和 addOne() 也是互斥的
class SafeCalc {
  long value = 0L;
  synchronized long get() {
    return value;
  }
  synchronized void addOne() {
    value += 1;
  }
}
```
synchronized 修饰的临界区是互斥的、管程中锁的规则：对一个锁的解锁 Happens-Before 于后续对这个锁的加锁。

前一个线程在临界区修改的共享变量（该操作在解锁之前），对后续进入临界区（该操作在加锁之后）的线程是可见的

<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/mutual-exclusion/3.png" alt="png"> 

## 锁和受保护资源的关系
受保护资源和锁之间的关联关系是 N:1 的关系

- 两把锁保护同一个资源示例：两个临界区没有互斥关系，临界区 addOne() 对 value 的修改对临界区 get() 也没有可见性保证
<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/mutual-exclusion/4.png" alt="png"> 


## 用一把锁保护多个资源

用一把锁有个问题，就是性能太差，会导致取款、查看余额、修改密码、查看密码这四个操作都是串行的。而我们用两把锁，取款和修改密码是可以并行的。用不同的锁对受保护资源进行精细化管理，能够提升性能。这种锁还有个名字，叫细粒度锁。

```java
class Account {
  // 锁：保护账户余额
  private final Object balLock
    = new Object();
  // 账户余额  
  private Integer balance;
  // 锁：保护账户密码
  private final Object pwLock
    = new Object();
  // 账户密码
  private String password;

  // 取款
  void withdraw(Integer amt) {
    synchronized(balLock) {
      if (this.balance > amt){
        this.balance -= amt;
      }
    }
  } 
  // 查看余额
  Integer getBalance() {
    synchronized(balLock) {
      return balance;
    }
  }

  // 更改密码
  void updatePassword(String pw){
    synchronized(pwLock) {
      this.password = pw;
    }
  } 
  // 查看密码
  String getPassword() {
    synchronized(pwLock) {
      return password;
    }
  }
}
```








