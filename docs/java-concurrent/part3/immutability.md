# 不变性解决并发问题

## 快速实现具备不可变性的类
- class final
- 属性 final
- 所有方法均是只读的
### JDK中的String Long Integer基础类型包装类
- String 不可变性类
```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
    public String replace(char oldChar, char newChar) {
        if (oldChar != newChar) {
            int len = value.length;
            int i = -1;
            char[] val = value; /* avoid getfield opcode */

            while (++i < len) {
                if (val[i] == oldChar) {
                    break;
                }
            }
            if (i < len) {
                char buf[] = new char[len];
                for (int j = 0; j < i; j++) {
                    buf[j] = val[j];
                }
                while (i < len) {
                    char c = val[i];
                    buf[i] = (c == oldChar) ? newChar : c;
                    i++;
                }
                return new String(buf, true);
            }
        }
        return this;
    }
}
```
### 可变对象和不可变对象的区别
- 可变对象修改自己的属性
- 不可变对象通过new的方式创建新的对象返回

## 利用享元模式避免重复创建对象
> 享元模式也就是对象池，如果对象在对象池中存在，则从对象池中获取。如果对象池中不存在，则new创建对象，并把对象添加到对象池中

- String Long Integer等对象如果频繁的创建对象，会导致对象池的对象创建太多，占用太多内存
- 利用享元模式可以减少创建对象的数量，从而减少内存占用
### Long类型利用享元模式示例
- Long内部维护了一个静态的对象池，存储了[-128,127]。因为Long对象的状态共有 2^64 种，实在太多
```java
Long valueOf(long l) {
  final int offset = 128;
  // [-128,127]直接的数字做了缓存
  if (l >= -128 && l <= 127) { 
    return LongCache
      .cache[(int)l + offset];
  }
  return new Long(l);
}
//缓存，等价于对象池
//仅缓存[-128,127]直接的数字
static class LongCache {
  static final Long cache[] 
    = new Long[-(-128) + 127 + 1];

  static {
    for(int i=0; i<cache.length; i++)
      cache[i] = new Long(i-128);
  }
}
```

## Integer 和 String 类型的对象不适合做锁
- Integer和String是享元模式的，对象是可以共用的，如果synchronized("user"){}被其他的代码使用，如果另一个获取锁的代码不释放对象，那么则一直阻塞
- 实际上 al 和 bl 是一个对象，结果 A 和 B 共用的是一把锁
```java
class A {
  Long al=Long.valueOf(1);
  public void setAX(){
    synchronized (al) {
      //省略代码无数
    }
  }
}
class B {
  Long bl=Long.valueOf(1);
  public void setBY(){
    synchronized (bl) {
      //省略代码无数
    }
  }
}
```

## 使用Immutability模式注意事项
- 对象属性都是final的，并不能保证不可变性
  > 如果对象是引用类型，那么虽然对象是不可变的，但可以通过获取到引用后，改变属性对象的内部属性 
- 在使用 Immutability 模式的时候一定要确认保持不变性的边界在哪里，是否要求属性对象也具备不可变性
- 不可变对象也需要正确发布
```java
/**
 * 对象属性都是final的，并不能保证不可变性
 */
class Foo{
  int age=0;
  int name="abc";
}
final class Bar {
  final Foo foo;
  void setAge(int a){
    foo.age=a;
  }
}

/**
 * 正确的发布不可变对象
 */
//Foo线程安全
final class Foo{
  final int age=0;
  final int name="abc";
}
//Bar线程不安全
class Bar {
  Foo foo;
  void setFoo(Foo f){
    this.foo=f;
  }
}
```
- 合理库存的原子化实现
```java
public class SafeWM {
  class WMRange{
    final int upper;
    final int lower;
    WMRange(int upper,int lower){
    //省略构造函数实现
    }
  }
  final AtomicReference<WMRange>
    rf = new AtomicReference<>(
      new WMRange(0,0)
    );
  // 设置库存上限
  void setUpper(int v){
    while(true){
      WMRange or = rf.get();
      // 检查参数合法性
      if(v < or.lower){
        throw new IllegalArgumentException();
      }
      WMRange nr = new
          WMRange(v, or.lower);
      if(rf.compareAndSet(or, nr)){
        return;
      }
    }
  }
}
```

## 更简单的不变性对象-无状态对象
- 面对并发问题时，建议首先尝试使用Immutability模式解决并发问题
- 无状态对象是线程安全的，性能特别好
- 无状态服务、无状态协议
- 分布式领域，无状态服务意味着可以无限地水平拓展，分布式系统的性能问题一定不是出现在无状态服务上
