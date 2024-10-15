# 软件事务内存STM
平时工作中的并发问题都被tomcat，mysql等中间件解决了，尤其是数据库，成绩斐然，它的事务机制非常简单易用。

## STM
**软件事务内存STM**,从数据库事务管理中获得灵感，总结出的一个新的并发解决方案
### STM局限
STM借鉴数据库经验，仅仅存储数据，而编程语言除了有共享变量，还会执行IO操作，IO操作是很难支持回滚的。
> 目前支持STM的编程语言主要是函数式语言，函数式语言的数据天生具备不可变性，利用不可变性实现STM相对来说更简单

Multiverse使用实现STM转账(基于MVCC)
```java
class Account{
  //余额
  private TxnLong balance;
  //构造函数
  public Account(long balance){
    this.balance = StmUtils.newTxnLong(balance);
  }
  //转账
  public void transfer(Account to, int amt){
    //原子化操作
    atomic(()->{
      if (this.balance.get() > amt) {
        this.balance.decrement(amt);
        to.balance.increment(amt);
      }
    });
  }
}
```

## MVCC 多版本并发控制
- 数据库事务在开启的时候，给数据库打上一个快照，后面的读写都基于快照
- 提交事务时，如读写的数据在该事务期间无变化，可提交。如变化，不可提交
- 为记录数据是否变化，给每条数据添加版本号，类似StampedLock

## 实现STM
- VersionedRef(不变性类)负责包装数据使之有版本
- TxnRef 这个类负责完成事务内的读写操作
- 读写操作委托给了接口 Txn
- STMTxn 是 Txn 最关键的一个实现类 
  - inTxnMap，用于保存当前事务中所有读写的数据的快照
  - writeMap，用于保存当前事务需要写入的数据
  - txnId，这个 txnId 是全局递增的，唯一的事务 ID
- STMTxn 有三个核心方法
  - get() 方法将要读取数据作为快照放入 inTxnMap
  - set() 方法会将要写入的数据放入 writeMap
  - commit() 方法的实现很简单，首先检查 inTxnMap 中的数据是否发生过变化，如果没有发生变化，那么就将 writeMap 中的数据写入，如果发生过变化，那么就不能将 writeMap 中的数据写入了。
- STM atomic() 方法中使用了类似于 CAS 的操作，如果事务提交失败，那么就重新创建一个新的事务，重新执行

```java
/**
 * 带版本号的对象引用 不变性Immutability模式
 */
public final class VersionedRef<T> {
    final T value;
    final long version;
    public VersionedRef(T value, long version){
        this.value = value;
        this.version = version;
    }
}
/**
 * 支持事务的引用
 * 负责完成事务内的读写操作
 * 读写操作委托给了接口 Txn
 */
public class TxnRef<T> {
    //当前数据，带版本号
    volatile VersionedRef curRef;
    //构造方法
    public TxnRef(T value){
        this.curRef = new VersionedRef(value, 0L);
    }
    //获取当前事务中的数据
    public T getValue(Txn txn){
        return txn.get(this);
    }
    //在当前事务中设置数据
    public void setValue(T value, Txn txn){
        txn.set(this,value);
    }
}
/**
 * 事务接口
 */
public interface Txn {
    <T> T get(TxnRef<T> ref);
    <T> void set(TxnRef<T> ref, T value);
}
/**
 * STM事务实现类
 */
public final class STMTxn implements Txn{
    private static AtomicLong txnSeq = new AtomicLong(0);
    //保存当前事务中所有读写的数据的快照
    private Map<TxnRef, VersionedRef> inTxnMap = new HashMap<>();
    //当前事务所有需要修改的数据
    private Map<TxnRef, Object> writeMap = new HashMap<>();
    //当前事务ID
    private long txnId;
    //构造函数，自动生成当前事务ID
    STMTxn() {
        txnId = txnSeq.incrementAndGet();
    }

    //获取当前事务中的数据
    @Override
    public <T> T get(TxnRef<T> ref) {
        //将需要读取的数据，加入inTxnMap
        if (!inTxnMap.containsKey(ref)) {
            inTxnMap.put(ref, ref.curRef);
        }
        return (T) inTxnMap.get(ref).value;
    }
    //在当前事务中修改数据
    @Override
    public <T> void set(TxnRef<T> ref, T value) {
        //将需要修改的数据，加入inTxnMap
        if (!inTxnMap.containsKey(ref)) {
            inTxnMap.put(ref, ref.curRef);
        }
        writeMap.put(ref, value);
    }
    //提交事务
    boolean commit() {
        synchronized (STM.commitLock) {
            //是否校验通过
            boolean isValid = true;
            //校验所有读过的数据是否发生过变化
            for(Map.Entry<TxnRef, VersionedRef> entry : inTxnMap.entrySet()){
                VersionedRef curRef = entry.getKey().curRef;
                VersionedRef readRef = entry.getValue();
                //通过版本号来验证数据是否发生过变化
                if (curRef.version != readRef.version) {
                    isValid = false;
                    break;
                }
            }
            //如果校验通过，则所有更改生效
            if (isValid) {
                writeMap.forEach((k, v) -> {
                            k.curRef = new VersionedRef(v, txnId);//此处更改了version
                });
            }
            return isValid;
        }
    }
}
@FunctionalInterface
public interface TxnRunnable {
    void run(Txn txn);
}
/**
 * STM
 */
//STM
public final class STM {
    //提交数据需要用到的全局锁
    static final Object commitLock = new Object();
    //原子化提交方法
    public static void atomic (TxnRunnable action){
        boolean committed = false;
        //如果没有提交成功，则一直重试
        while (!committed) {
            //创建新的事务
            STMTxn txn = new STMTxn();
            //执行业务逻辑
            action.run(txn);
            //提交事务
            committed = txn.commit();
        }
    }
    //私有化构造方法
    private STM() {
    }
}
/**
 * 使用
 */
class STMAccount {
    //余额
    private TxnRef<Integer> balance;
    //构造方法
    public STMAccount(int balance) {
        this.balance = new TxnRef<Integer>(balance);
    }
    //转账操作
    public void transfer(STMAccount target, int amt){
        STM.atomic((txn)->{
            Integer from = balance.getValue(txn);
            balance.setValue(from-amt, txn);
            Integer to = target.balance.getValue(txn);
            target.balance.setValue(to+amt, txn);
        });
    }
}
```
