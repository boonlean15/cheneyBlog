# JAVA语法基础
[十一家林先生的博客园](https://www.cnblogs.com/lin-bunny/p/15591204.html)
之前整理的笔记--通过连接到博客园查看

比较容易忘记的点：
- 反射
- JDK动态代理

## java程序设计概述
### java程序设计平台
1. java是一个平台、有一个庞大的库，其中包含很多可重用的代码和一个提供安全性、跨操作系统的可移植性、以及自动垃圾回收集等服务的执行环境
2. 安全性、可移植性、垃圾回收集、数据库连接、网络连接

### java白皮书关键术语
- 简单性
- 面向对象
- 分布式
- 健壮性
- 安全性
- 体系结构中立  -- 编译器->class字节码文件（指令）->解释虚拟机指令解释成本地机器码。---- 可将执行最频繁的字节码翻译成机器码（即时编译）
- 可移植性  -- 数据类型确定、xml，文件操作，时间和日期，数据库，网络连接，线程等，不用担心底层代码。 用户界面工具包-可移植性仍旧是问题
- 解释型  -- java解释器，可以在任何移植了解释器的机器上执行java字节码
- 高性能 -- 字节码可以动态的翻译成运行这个应用的cpu的机器码
- 多线程
- 动态性 -- 动态添加方法到类库而不影响客户端的使用

## java程序设计环境
### 环境
1. 安装java开发工具包
    JDK JRE JVM 之间的关系
    JDK包含JRE，JRE包含JVM。可以近似的认为，jvm是jre包下的bin目录的程序，然后jre包下的lib目录是jvm运行时需要的类库.
    总的来说JDK是用于java程序的开发,而jre则是只能运行class而没有编译的功能。
    [JDK JRE JVM](https://boonlean15.github.io/cheneyBlog/repository/java/core_one/jdk_relationship.html)
2. classpath
    java运行时环境搜索类或其他资源文件的路径、默认是当前目录，当前项目目录

## java的基本程序设计结构
### 一个简单的java应用程序
运行java应用程序时，java虚拟机会在指定的类中，执行main方法
### 注释
1. //单行注释
2. /* */多行注释
3. /** */文档注释 可以生成api文档

### 数据类型 
java是强类型语言 变量初始化的时候，赋值类型
- 1Byte = 8bit bit代表二进制数位，取值范围：0或1.

#### 基本类型 
1. 整型
   - int　　4字节
   - short　　2字节
   - long　　8字节　　后缀L
   - byte　　1字节
2. 浮点类型
   - float　　4字节 后缀F
   - double　　8字节 double的精度是float的两倍 后缀D或没有
     正无穷大 Double.POSITIVE_INFINITY 负无穷大 Double.NAGATIVE_INFINITY NaN不是一个数字 Double.NaN
     无法解释舍入误差的金融计算，不能使用浮点数值，应该使用BigDecimal。
3. char类型
   'A'字符常量 "A"包含A的字符串
   Unicode转义序列会在解析代码之前得到处理
4. boolean类型
   true / false

### 变量
-    变量命名 -- 遵循java命名规范，如果需要判断unicode字符是否属于java中的字符，可通过Character.isJavaIdentifierPart 等判断
-    变量初始化 --  变量的声明尽可能地靠近变量第一次使用的地方
-    常量 -- final修饰的常量，只能被赋值一次
-    类常量 -- static final 修饰 并 赋值初始化

### 运算符
    + - * / % 对应加减乘除，取余
    15.0/2 等于7.5 15/2 等于7
*浮点数的算数运算实现可移植性是很困难的，java使用64位的double浮点运算，有些机器使用80位浮点寄存器。strictfp标记的方法或者类，内部都使用严格的浮点运算，即是不允许截取中间运算位*

#### 数学函数与常量  
- Math.sqrt(x) 计算平方根，如Math.sqrt(4) 等于2
- Math.pow(a,x)幂等运算，a的x次方
- Math.floorMod() 解决负数对某个数取余数，返回的都是正数
-  三角函数：
    1.Math.sin()  对边比斜边 计算的时候需要先把角度转为弧度，再计算三角函数，如：Math.sin(Math.toRadians(45)) 计算45度角的正弦值
    2.Math.cos() 临边比斜边
    3.Math.tan() 对边比临边
    
- 正弦或余弦值转换为角度，Math.acos或者Math.asin计算转换值，然后再Math.toDegrees转换为角度
  `double cosRange = Math.cos(Math.toRadians(p1.getRadius())) * 500;`
        
    ```java
    double x = 45.0;
    //将角度转换成弧度值
    x = Math.toRadians(x);
    log.info("45度对应的弧度--- " + x);
    System.out.println(Math.cos(x));//0.7071067811865476
    double acos = Math.acos(0.7071067811865476);
    log.info("acos ---- " + acos);
    double degrees = Math.toDegrees(acos);
    log.info("degrees ---- " + degrees);
    ```
    如果结果比运行速度更重要的，使用StrictMath类，进行严格运算，实现可移植性

#### 数值类型之间的转换

    byte -> short -> int -> long -> double
                     int -> double
                     int -> float -> double
            char  -> int  

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/markdown/1.jpg" alt="png">       
            
#### 强制类型转换
如：double x = 9.9; int y = (int)x;会直接截断，取小数点前的数
如果需要四舍五入，使用Math.round()

#### 结合赋值和运算符
 x +=4;  x -= 4;
 
#### 自增和自减运算符
n++ n-- ++n --n

#### 关系和boolean运算符
&& || 逻辑与，逻辑或，？ ：； 三元运算符

#### 位运算符
&("and") |("or") ^("xor") ~("not")  << >> >>>
#### 括号与运算符优先级
#### 枚举类型
### 字符串
- 拼接--String.join();定界符分割，
- 不可变字符串，编译器可以让字符串共享
- 检测字符串是否相等，equals，“hello”.equals(hello),字符字面量，字符变量  不要使用==判断字符串是否相等
- 码点与代码单元--- char类型采用utf-16编码表示的unicode码点的代码单元
- 常用的unicode字符用一个代码单元表示，一些辅助字符需要一对代码单元
    codePointCount()获取码点数量
    chatAt() 返回位置的代码单元
    codePointAt()返回码点
- int compareTo(String other) 按照字典顺序， 如果字符串位于 other 之前， 返回一个负数; 如果字符串位于 other 之后， 返回一个正数; 如果两个字符串相等， 返回 0。

### 输入输出
    获取当前路径 System.getProperty("user.dir");
    将数据写入文件 PrintWriter
### 控制流程
- if 语句
- while语句
- do while语句
- for语句
- switch语句
- 中断控制流程语句 break   
- 带标签的break--- 在多层循环的最外面添加一个标签:  如 read_me:     多层循环，， break read_me; ---跳出多层循环
### 大数值
BigInteger 、BigDecimal，可以用于任意精度的计算
### 数组
- 数组拷贝--- Arrays.copyOf();内部new了一个新数组
- main方法接收参数args 代表命令后参数
- 多维数组---java没有多维数组，只是数据之间的引用、

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/mult_array.jpg" alt="png">

## 对象与类 

### 类之间的关系
use-a 使用到了a对象，依赖、has-a 包含了a对象，聚合、is-a 继承了a对象、

### 使用预定义的类
- 局部变量不会自动初始化为null
- Date类生成时间点、LocalDate保存时间
  
### 用户自定义的类
一个源文件只能有一个public class 公有类，一个public class ，多个非public class

### 封装的优点
如果要返回一个可变数据域的拷贝，应该使用clone

### final 域
- final 一般修饰基本类型或者不可变类类型的域
- final修饰代表需要初始化变量值，然后初始化之后不可改变。这里如果final修饰的是可变类，那么final代表它的引用不能被修改

### 不可变类　
类的所有方法都不会改变其对象，那这个类就是不可变类

### 工厂方法
什么时候使用工厂方法：
1. 构造方法只能和类同名、无法命名构造器的时候
2. 返回不同的对象、使用构造器，无法改变所构造的对象类型

### 方法参数
- java采用按值调用
- double value = 10; obj.raiseValue(value);  --- value 还是等于10，传递参数，传递的是一个拷贝
- 参数:
  1. 基本数据类型
  2. 引用类型 方法得到对象类型的引用的拷贝，修改后，对象引用对应的数值变化了
  3. 不管是基本数据类型还是引用类型，都是传递的拷贝值
  4. 引用类型，试图交换数据的效果没有实现，因为参数传递的是引用的拷贝，原来的变量还是指向原来的引用地址

### 对象构造
- 构造方法、静态代码块、对象代码块、实例域初始化
- 所有的静态初始化语句以及静态初始化块都将依照类定义的顺序执行。
  
1. 数据域初始化
2. 类声明顺序，域初始化块语句和初始化块
3. 构造调用另外的构造，先执行另外构造
4. 执行当前构造
5. 第一次加载类的时候，执行静态代码块
6. **finalize方法将在垃圾回收器清除对象之前调用----不要依赖此方法回收任何短缺的资源，不建议使用
7. System.runFinalizersOnExit(true);方法可以确保finalize方法在java关闭前调用----此方法不安全
8. Runtime.addShutdownHook,添加关闭钩，实在要使用，可以用这个替代System.runFinaliersOnExit();**

### 包
- 静态导入---可以使用静态方法而不需要加类名
- 包作用域---没有用public或者private修饰，那么默认就是包作用域，包的其他类可以访问

## 继承

### 类、超类和子类

1. super关键字，只是指示编译器调用父类方法的一个关键字，不是引用
2. 继承能访问protect或者public的父类域，但是访问private私有域，需要通过super关键字调用
3. 子类构造器 --- 可以通过super调用超类构造器初始化超类私有域，必须在子类构造器的第一行调用 
   - **final类 --- final修饰的类，方法自动为final而不包括域**
4. 类型转换 --- 可用instanceof关键字判断后再进行类型转换
   - **尽量少用强制类型转换和instanceof关键字**
5. 四个访问修饰符
- public 公有可见
- private 私有，仅自己可见
- protect 包和子类可见
- 无修饰符，默认，包可见

### Object类，所有类的超类

#### equals方法
1. equals方法 -- 比较的是两个对象的引用对象，如果引用对象相等，则两个对象相等　　
2. Objects.equals(a,b);  --- 如果a和b都为null，返回true，如果其中一个为null，返回fasle、如果两个都不为null，返回a.equals(b)
3. 一般情况下，自定义的类自己定义equals方法，设置两个对象相同时的条件

#### 相等测试和继承
##### 1. 如果子类有自己的判断相等的方法，则使用getClass判断
##### 2. 如果使用超类的方法判断相等，则使用intanceof方法
- 建议：
   - 显示参数使用otherObject
   - Arrays　equals(a,b) -- 如果两个数组的长度相等，并且在索引的位置的元素相等，那么判断为相等
   - Objects equals(a,b) -- 如果a和b为null，返回true、如果ab其中一个为null，返回false、否则返回a.equals(b)
    
##### 3.hashCode方法 重新定义 equals 方法，就必须重新定义hashCode 方法
   - 如果a.equals(b) ，那么a.hashCode和b.hashCode应该相同
   - Objects.hash(a,b,c);可更简洁的获取a，b，c属性的hashCode值

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/hashcode.jpg" alt="jpg">

4. toString方法
   
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/toString.jpg" alt="jpg">   

### 泛型数据列表 --- ArrayList
   
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/arrayList.jpg" alt="jpg"> 

### 对象包装器与自动装箱

1. 所有基本类型都有对应的包装类   int -- > Integer
2. ArrayList<Integer> intList = new ArrayList<>();   intList.add(3); 自动转换为intList.add(Integer.valueOf(3)); --- 自动装箱
3. int i = intList.get(i); intList.get(i).intValue();  --- 自动拆箱
   
### 参数数量可变的方法

```java 
public static double max(double ... values){}
``` 
### 枚举类

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/enum.jpg" alt="jpg">

### 反射

#### 1. Class类 
> 保存java运行时为所有对象维护一个运行时的类型标识

- 常用方法: getName(); Class.forName(); Class cli = Random.class; newInstance();创建一个类型的Class实例
- Class对象实际上是一种类型，但是类型不一定是类：Class intCl = int.class;
- Constructor类的newInstance方法可以传递参数： Class cli = Class.forName();   cli.getConstructor(... args).newInstance(...init);

#### 2.利用反射分析类的能力 
> Field Method Constructor
- Class --- getFields  getMethods getConstructors 返回类的域，方法，构造方法，包括超类的public域，方法，构造方法 getModifiers 返回一个整形数值
- Modifier类 --- 的isPublic，isPrivate，isFinal，可以判断方法和构造方法是否是private，public final
  
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/reflect.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/reflect2.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/reflect3.jpg" alt="jpg">

#### 3.在运行时利用反射分析对象

- java安全机制只允许查看任意对象有那些域，而不允许读取他们的值，需要通过setAccessible(true)；覆盖访问控制
- 公用的toString()方法  
  
```java
package com.cheney.utils;

import java.lang.reflect.AccessibleObject;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;

/**
 * 公用类 ObjectAnalyzer
 * @author linch
 * @create 2021/12/7 17:18
 */
public class ObjectAnalyzer {

    private ArrayList<Object> visited = new ArrayList<>();

    /**
     * Converts an object to a string representation that lists all fields.
     * @param obj an object
     * @return a string with the object's class name and all field names and
     * values
     */
    public String toString(Object obj)
    {
        if (obj == null) {return "null";}
        if (visited.contains(obj)) {return "...";}
        visited.add(obj);
        Class cl = obj.getClass();
        if (cl == String.class) {return (String) obj;}
        if (cl.isArray())
        {
            String r = cl.getComponentType() + "[]{";
            for (int i = 0; i < Array.getLength(obj); i++)
            {
                if (i > 0) {r += ",";}
                Object val = Array.get(obj, i);
                if (cl.getComponentType().isPrimitive()) {r += val;}
                else {r += toString(val);}
            }
            return r + "}";
        }

        String r = cl.getName();
        // inspect the fields of this class and all superclasses
        do
        {
            r += "[";
            Field[] fields = cl.getDeclaredFields();
            AccessibleObject.setAccessible(fields, true);
            // get the names and values of all fields
            for (Field f : fields)
            {
                if (!Modifier.isStatic(f.getModifiers()))
                {
                    if (!r.endsWith("[")) {r += ",";}
                    r += f.getName() + "=";
                    try
                    {
                        Class t = f.getType();
                        Object val = f.get(obj);
                        if (t.isPrimitive()) {r += val;}
                        else {r += toString(val);}
                    }
                    catch (Exception e)
                    {
                        e.printStackTrace();
                    }
                }
            }
            r += "]";
            cl = cl.getSuperclass();
        }
        while (cl != null);

        return r;
    }
}
```
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/reflect4.jpg" alt="jpg">

#### 4.使用反射编写泛型数组代码

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/reflect5.jpg" alt="jpg">

#### 5.调用任意方法

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/reflect6.jpg" alt="jpg">

### 接口、lambda表达式、内部类

#### 1.接口
- 接口的方法自动属于public，接口种声明方法，不必添加public。接口常量自动设置为public static final
- x.compareTo(y) 当x小于y时，返回负数，当x等于y时，返回0，当x大于y，返回正数
- 接口可以有常量，简单方法。但是不能有实例
- 如果需要排序和复制，实现 Cloneable(Object类的clone方法可以创建类对象的一个拷贝)，Comparable接口
- 单继承多实现 --- 实现大多数多继承的好处，减低多继承的复杂性和低效性
- 静态方法 -- java 8以后可以定义静态方法 -- 但java 大多都采用伴随类的方式中定义  Path/Paths
- 默认方法 -- default关键字修饰方法，这样实现类可以不实现这个方法，只关心自己需要的事件
- 默认方法冲突 -- 1.超类优先2.接口冲突，覆盖方法解决冲突

#### 2.接口示例
- 回调Callback
```java
package timer;

/**
   @version 1.01 2015-05-12
   @author Cay Horstmann
*/

import java.awt.*;
import java.awt.event.*;
import java.util.*;
import javax.swing.*;
import javax.swing.Timer; 
// to resolve conflict with java.util.Timer

public class TimerTest
{  
   public static void main(String[] args)
   {  
      ActionListener listener = new TimePrinter();

      // construct a timer that calls the listener
      // once every 10 seconds
      Timer t = new Timer(10000, listener);
      t.start();

      JOptionPane.showMessageDialog(null, "Quit program?");
      System.exit(0);
   }
}

class TimePrinter implements ActionListener
{  
   public void actionPerformed(ActionEvent event)
   {  
      System.out.println("At the tone, the time is " + new Date());
      Toolkit.getDefaultToolkit().beep();
   }
}

```
> 定义接口，实现类做具体需要的执行的任务，然后具体的方法会在事件里被调用，通过传递对象。实现callback

##### 对象克隆
- Cloneable提供了一个安全的clone方法，Cloneable是一个标记接口，如果调用了对象的clone方法没有实现Cloneable方法，则会抛异常
- 深拷贝 - 浅拷贝
- - 拷贝的对象包含子对象
- 浅拷贝 --- 如果是默认的clone拷贝，则仍会共享一些子对象的引用   ---- 不可变类的子对象的浅拷贝(安全)
- 深拷贝 -- 　　自己实现子对象的拷贝，实现深拷贝
  
#### 3.lambda

- 函数式接口 - 只有一个抽象方法的接口  lambda表达式可以转换为函数式接口进行传递
- 方法引用 -- System.out::println   相当于 x -> System.out.println(x)
  
  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/lambda.jpg" alt="jpg">

- this和super同样适用
- 构造器引用 Person[]::new
- 变量作用域 
- - lambda表达式的this还是外面的类，lambda是捕获变量，变量初始化后不能改变
  
#### 4.内部类

- 局部内部类-- 把类定义在方法中，这样其他方法都访问不到，不需要给类定义修饰符
- 匿名内部类 --  lambda之后，可以使用lambda为最佳
- 双括号初始化数组 -- 
```java
    @Test
    public void testInnerClass(){
        List<String> list = new ArrayList<String>(){{add("1000");add("3434");}};
        log.info(Arrays.toString(list.toArray()));
    }
```
- 静态内部类 -- 不需要引用外部类变量或方法时，使用静态类
- 声明在接口的内部类，自动为static和public类

#### 5.代理

  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/proxy.jpg" alt="jpg">

- 1.何时使用代理  
  - 代理可以在运行时创建全新的类
  - 指定接口需要的全部方法
  - object类的全部方法，toString和equals方法等
  - 调用处理器 -- 不能在运行时定义这些方法的新代码  --- 只能通过调用处理器invocationHandler 接口的invoke方法处理调用的方式
- 2.创建代理对象
  - Object proxy = Proxy.newProxyInstance(类加载器，实现的接口Class数据对象，调用处理器handler);
  - 其中调用处理器就是在创建代理对象的时候关联起来的，invoke方法的proxy对象和这里返回的代理对象是同一个

```java
public class TraceHandler implements InvocationHandler {@Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // print implicit argument
        System.out.print(target);
        // print method name
        System.out.print("." + method.getName() + "(");
        // print explicit arguments
        if (args != null)
        {
            for (int i = 0; i < args.length; i++)
            {
                System.out.print(args[i]);
                if (i < args.length - 1) {System.out.print(", ");}
            }
        }
        System.out.println(")");

        // invoke actual method
        return method.invoke(target, args);
    }
}
```

```java
InvocationHandler handler = new TraceHandler(value);
Object proxy = Proxy.newProxyInstance(null, new Class[] { Comparable.class } , handler);
```

- 3.代理的特性
  - 代理类覆盖了Object的toString、equals、hashCode方法
  - 特定的类加载器和一组接口，只能有一个代理类，执行多次newProxyInstance是生成同一个类的多个对象

## 异常、断言、日志

### 1.异常

1. 层次结构：  
- 异常 throwable 
- --> Error  (java运行时系统内部错误和资源耗尽错误) 
- ---> Exception 
- ---->  RuntimeException （运行异常 -- 程序问题，也就是你的问题，需要解决） 数组索引越界，null指针，错误的类型转换 
- -----> IOException （其他异常）试图在文件末尾追加内容、试图打开不存在的文件、根据字符串查找Class对象，但不存在

2. 归类:
- 非受查异常  --- Error  、RuntimeException 
- 受查异常 --- IOException等所有其他异常  -- **java编译器将检查是否为所有的受查异常准备了异常处理器**

3. 抛出异常：4种情况应该抛出异常
   - `调用一个抛出受查异常的方法。如FileInputStream构造器`
   - `程序运行过程发现错误，并利用throw语句抛出一个受查异常`
   - 程序出现错误，比如a[-1] 抛出一个索引越界异常的非受查异常
   - java虚拟机和运行时库出现的内部错误
   - 
前两种情况，需要抛出异常。**一个程序应该声明所有可能抛出的受查异常，而所有的非受查异常，要么不可控制(Error)要么应该避免发生在RuntimeException**

4.创建异常类:
- 1.声明一个类，继承Exception或者其他已知异常类
- 2.提供一个默认构造器，提供一个带有详细描述信息的构造器 ---- 超类Throwable的toString方法会打印这些信息

### 2.捕获异常

- try{}catch(e){} -- catch中的代码，处理器代码
- catch(e | e2)  -- 可以捕获多个异常使代码更简单
- 捕获 --> 包装 -> 重新抛出  -- 不丢失原始错误信息 
  
  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/exception.jpg" alt="jpg">

- finally子句
   - 不管异常是否被捕获，finally子句都会被执行 -- 一般用来释放和回收资源
- 带资源的try语句
   - 需要关闭资源，就尽可能的使用带资源的try语句 -- 带资源的try语句后跟着catch和finally语句的话，会在资源关闭之后执行

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/exception2.jpg" alt="jpg">


- throwable
  
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/exception3.jpg" alt="jpg">

- Exception

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/exception4.jpg" alt="jpg">

### 3.异常的使用技巧
**如何决定一个异常是被捕获 ， 还是被抛出让其他的处理器进行处理**
- 1.捕获知道怎么处理的异常，抛出不知道怎么处理的异常
- 2.只在异常情况下使用异常机制
- 3.不要过分细化异常
- 4.利用异常层次结构
- 5.不要压制异常
- 6.早抛出，晚捕获

### 4.断言
断言允许在测试期间向代码插入一些检查语句，发布的时候会自动移除

assert 条件：       assert  条件：表达式；

- 1.启动和禁用断言
   - java -ea MyApp 或者java -enableassertions MyApp，也可跟在类或者某个具体的包下，对类或者包启动断言
   - java -da 或者 java -disableassertions 禁用断言
   - 对于没有类加载器的类，不能禁用和启动断言，比如对于jvm加载的类，需要通过 java -esa / java -enablesystemassertions 开关启用断言

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/assert.jpg" alt="jpg">

- 2.断言不满足的时候，程序会立刻中止，即使你使用了try catch也会中止，而如果是异常，程序会继续运行

### 5.日志

解决我们使用System.out.println打印日志的插入与删除，可以用于记录日志

#### 1.基本日志  --- 全局日志记录器

Logger.getGlobal().info();Logger.getGlobal.setLevel();设置日志级别，可设置关闭

#### 2.高级日志
调用getLogger方法创建或获取记录器
```java
private static final Logger myLogger = Logger.getLogger("com.myblog")
```
#### 3.修改日志管理器配置 等相关日志操作，最好在学习netty的时候，对日志进行系统的学习和使用

**java虚拟机对应用程序的跟踪和管理 jconsole工具 jmap堆栈转储工具**


