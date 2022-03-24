## 泛型

### 一、为什么使用泛型

**使得程序更加安全，可读**

例如： ArrayList<String> list = new ArrayList<>(); 声明了类型，避免了强制类型转换的错误

### 二.简单的泛型类
```java
public class Pair<T> 
{
   private T first;
   private T second;

   public Pair() { first = null; second = null; }
   public Pair(T first, T second) { this.first = first;  this.second = second; }

   public T getFirst() { return first; }
   public T getSecond() { return second; }

   public void setFirst(T newValue) { first = newValue; }
   public void setSecond(T newValue) { second = newValue; }
}
```

### 三.泛型方法

类型变量<T>放在public static 之后，返回类型之前。方法调用在方法之前添加<T> 或者省略，编译器可以自己推算出类型

```java
public static <T> T getMiddle(T.. a){
    return a[a.length / 2];
}
```

### 四.类型变量的限定 extends

public static <T extends MyType> min(T[] a) {} T是绑定类型的子类型，选择extends关键字是因为extends更接近子类的概念

extends限定了T只能是MyType的子类

一个类型变量或通配符可以有多个限定， T extends Comparable & Serializable，java继承中，可以有多个接口超类型，但限定中至多有一个类，如果用类做限定，必须是限定列表中的第一个

```java
class ArrayAlg
{
   /**
      Gets the minimum and maximum of an array of objects of type T.
      @param a an array of objects of type T
      @return a pair with the min and max value, or null if a is 
      null or empty
   */
   public static <T extends Comparable> Pair<T> minmax(T[] a) 
   {
      if (a == null || a.length == 0) return null;
      T min = a[0];
      T max = a[0];
      for (int i = 1; i < a.length; i++)
      {
         if (min.compareTo(a[i]) > 0) min = a[i];
         if (max.compareTo(a[i]) < 0) max = a[i];
      }
      return new Pair<>(min, max);
   }
}
```

### 五.泛型代码和虚拟机

#### 1.类型擦除 
- 虚拟机中没有泛型类型对象，都是普通类
- 定义泛型类型，都提供了原始类型，原始类型就是删除泛型类型名，擦除类型变量并替换成限定类型，如果没有限定，则替换成Object
- 多个限定类型，使用第一个替换类型变量

#### 2.翻译泛型表达式
程序调用泛型方法时，如果擦除返回类型，则编译器调用使用了强制类型转换

#### 3.翻译泛型方法
java泛型转换的事实：
- 虚拟机中没有泛型，只有普通类和方法
- 所有的类型参数都用它们的限定类型替换
- 桥方法被合成来保持多态
- 为保持类型安全，必要时插入强制类型转换　

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/generics1.jpg" alt="jpg">

#### 4.调用遗留代码，泛型的目标是运行泛型代码和遗留代码互相操作，编译器可能会有警告提示

### 六.约束与局限性
- 不能用基本类型替换泛型类型  Pair<double> //Error  Pair<Double>
- 运行时查询类型，只适用与原始类型 a instanceof Pair<String> //Error
- 不能创建参数化类型的数组 Pair<String>[] table = new Pair<String>[10];//Error 可以通过集合存储：ArrayList<Pair<String>>　

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/generics2.jpg" alt="jpg">

- 数组存储只会检查擦除的类型，但是处理的时候会出现异常

```java
@Test
public void testT(){
   Pair<String>[] pairs = (Pair<String>[]) new Pair<?>[10];
   pairs[1] = new Pair<>("2","2");
   pairs[0] = new Pair<>("dfdfdf","dfdfdfd");
   Object[] objects = pairs;
   objects[1] = new Pair<>(new LatLonReq(1,1), new LatLonReq(1,1));
   log.info(Arrays.toString(objects));
   String first = pairs[1].getFirst();
   log.info(first);


   Pair<String> pair1 = new Pair<>("1", "22");
   Pair<String> pair2 = new Pair<>("1fdfd", "你好");
   Pair<String>[] table = arrays(pair1, pair2);
   Object[] objarray = table;
   objarray[0] = new Pair<>(new LatLonReq(1.2,2.0), new LatLonReq(2.0,3.0));
   log.info(Arrays.toString(objarray));
   Pair<String> pair = table[0];
   log.info(pair.getFirst());
}
```

- 不能实例化类型变量  
- > new T(); new T[]; T.class非法
  
```java
public static <T> Pair<T> makePair(Supplier<T> constr){ 
    return new Pair<>(constr.get(), constr.get());
}
```

- > Supplier<T> 是一个函数式接口

```java
public static <T> Pair<T> makePair(Class<T> cli){
    return new Pair<>(cli.newInstance(), cli.newInstance());  
}
```

- 不能构造泛型数组
- > 擦除泛型后会导致全部是Comparable[] ，赋值会失败

```java
public static <T extends Comparable> T[] minmax(T... a){
    Object[] objs = new Object[10];
    return (T[]) objs;//Error
}    
```

- 泛型类的静态上下文中不能使用类型变量

```java
public class Singleton < T >
{
   private static T singlelnstance ; // Error
   public static T getSinglelnstanceO // Error
   {
      if ( singleinstance = = null ) construct new instance of T
      return singlelnstance ;
   }
}
```

- 不能捕获泛型类的实例，泛型类不能继承拓展Throwable，不过异常规范中使用类型变量是允许的
- 使用泛型可以消除对受查异常的检查
- 注意泛型擦除后的冲突 
- > 支持泛型擦除的转换，一个类或者类型变量不能同时成为两个接口类型的子类，而这两个接口是同一个接口的不同参数化

### 7.泛型类型的继承规则

PaiK<S > 与Pair < T > T 和 S 没有什么联系

泛型类可以拓展或者实现其他泛型类，ArrayList<T> 实现List<T> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/generics3.jpg" alt="jpg">


### 8.通配符类型

- ? extends E 限定？是E的子类 　　 ? super E   限定?是E的父类
- 单独使用? 无限定通配符，类似T，? 可读性更强
- 通配符捕获，? t = p.getFirst(); 不能使用?，可以通过其他捕获，T t = p.getFirst();


### 9.反射和泛型

#### 1、反射Class类
Class类是泛型的，String.class 是Class<String> 类的对象

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/generics4.jpg" alt="jpg">

#### 2.使用Class<T>参数进行类型匹配

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/generics5.jpg" alt="jpg">

#### 3.虚拟机中泛型类型信息

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/generics6.jpg" alt="jpg">

---