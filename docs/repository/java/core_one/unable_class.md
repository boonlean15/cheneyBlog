### 不可变类
类的实例不能被修改。并且创建实例的时候就提供类实例所包含的所有信息，在类的生命周期中，保持不变

> An immutable class is simply a class whose instances cannot be modified. All of the information contained in each instance is provided when it is created and is fixed for the lifetime of the object.

- 类不可以被继承或者拓展 可通过声明类为final 
- 类的所有成员，全部声明为private final 
- 传入类的如果是引用的变量，可通过对传入引用进行深度copy，保证不能修改类的成员
- 所有获取类信息的方法，都应该保证不能改变类的成员，类的信息
  
**通过反射的方式是可以改变不可变类的成员和信息的**

demo:

```java
public class ChangeString{
   public static void changeStr(String str){
        str == null ? return : change(str);
    } 
   public static void change(String str){
      try{
         Field f = String.class.getDeclaredField("value");
         f.setAccessible(true);
         char[] chars = (char[])f.get(str);
         chars[0] = 'c';
       }catch(e) {
         e.printStackTrace();
       }
    }
}    　　
```
那么可以通过调用ChangeString的changeStr()方法，改变String的成员，这使得String的不可变变得无意义。`不要使用这种方式`

同理，其他不可变类也可以通过这种方式改变