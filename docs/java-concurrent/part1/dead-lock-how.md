# 死锁处理

## 性能问题(Account.class做锁，全是串行，性能不能接受)
> 向现实世界要答案 想在古代，没有信息化，账户的存在形式真的就是一个账本，而且每个账户都有一个账本。银行柜员在给我们做转账时，要去文件架上把转出账本和转入账本都拿到手，然后做转账

- 用两把锁就实现了，转出账本一把，转入账本另一把

```java
class Account {
  private int balance;
  // 转账
  void transfer(Account target, int amt){
    // 锁定转出账户
    synchronized(this) {              
      // 锁定转入账户
      synchronized(target) {           
        if (this.balance > amt) {
          this.balance -= amt;
          target.balance += amt;
        }
      }
    }
  } 
}
class Account {
  private int balance;
  // 转账
  void transfer(Account target, int amt){
    // 锁定转出账户
    synchronized(this){     //①
      // 锁定转入账户
      synchronized(target){ //②
        if (this.balance > amt) {
          this.balance -= amt;
          target.balance += amt;
        }
      }
    }
  } 
}
```
<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/mutual-exclusion/7.png" alt="png"> 
<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/mutual-exclusion/8.png" alt="png"> 
<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/mutual-exclusion/9.png" alt="png"> 

死锁的一个比较专业的定义是：**一组互相竞争资源的线程因互相等待，导致“永久”阻塞的现象。**

## 只有以下这四个条件都发生时才会出现死锁

- **互斥**，共享资源 X 和 Y 只能被一个线程占用
- **占有且等待**，线程 T1 已经取得共享资源 X，在等待共享资源 Y 的时候，不释放共享资源 X
- **不可抢占**，其他线程不能强行抢占线程 T1 占有的资源
- **循环等待**，线程 T1 等待线程 T2 占有的资源，线程 T2 等待线程 T1 占有的资源，就是循环等待

## 解决死锁的办法
只要我们破坏其中一个，就可以成功避免死锁的发生
### 对于“占用且等待”这个条件，我们可以一次性申请所有的资源，这样就不存在等待了
<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/mutual-exclusion/10.png" alt="png"> 

```java
class Allocator {
  private List<Object> als =
    new ArrayList<>();
  // 一次性申请所有资源
  synchronized boolean apply(
    Object from, Object to){
    if(als.contains(from) ||
         als.contains(to)){
      return false;  
    } else {
      als.add(from);
      als.add(to);  
    }
    return true;
  }
  // 归还资源
  synchronized void free(
    Object from, Object to){
    als.remove(from);
    als.remove(to);
  }
}

class Account {
  // actr应该为单例
  private Allocator actr;
  private int balance;
  // 转账
  void transfer(Account target, int amt){
    // 一次性申请转出账户和转入账户，直到成功
    while(!actr.apply(this, target))
      ；
    try{
      // 锁定转出账户
      synchronized(this){              
        // 锁定转入账户
        synchronized(target){           
          if (this.balance > amt){
            this.balance -= amt;
            target.balance += amt;
          }
        }
      }
    } finally {
      actr.free(this, target)
    }
  } 
}
```

### 对于“不可抢占”这个条件，占用部分资源的线程进一步申请其他资源时，如果申请不到，可以主动释放它占有的资源，这样不可抢占这个条件就破坏掉了
> 破坏不可抢占条件看上去很简单，核心是要能够主动释放它占有的资源，synchronized是做不到的。原因是 synchronized 申请资源的时候，如果申请不到，线程直接进入阻塞状态了，而线程进入阻塞状态，啥都干不了，也释放不了线程已经占有的资源 **synchronized不会释放已经占有的资源**

> java.util.concurrent 这个包下面提供的 Lock 是可以轻松解决这个问题的


### 对于“循环等待”这个条件，可以靠按序申请资源来预防。所谓按序申请，是指资源是有线性顺序的，申请的时候可以先申请资源序号小的，再申请资源序号大的，这样线性化后自然就不存在循环了
> 每个账户都有不同的属性 id，这个 id 可以作为排序字段，申请的时候，我们可以按照从小到大的顺序来申请
```java
class Account {
  private int id;
  private int balance;
  // 转账
  void transfer(Account target, int amt){
    Account left = this        //①
    Account right = target;    //②
    if (this.id > target.id) { //③
      left = target;           //④
      right = this;            //⑤
    }                          //⑥
    // 锁定序号小的账户
    synchronized(left){
      // 锁定序号大的账户
      synchronized(right){ 
        if (this.balance > amt){
          this.balance -= amt;
          target.balance += amt;
        }
      }
    }
  } 
}
```

## 总结
- 不局限于当下，可以换个思路，向现实世界要答案，**利用现实世界的模型来构思解决方案**
- **用细粒度锁来锁定多个资源时，要注意死锁的问题**当你知道风险之后，才有机会谈如何预防和避免，因此，识别出风险很重要
- 具体方案的时候，还需要评估一下操作成本，从中选择一个成本最低的方案

> 预防死锁主要是破坏三个条件中的一个,需注意的是，有时候预防死锁成本也是很高的。
> 我们破坏占用且等待条件的成本就比破坏循环等待条件的成本高，破坏占用且等待条件，
> 我们也是锁了所有的账户，而且还是用了死循环 while(!actr.apply(this, target))

