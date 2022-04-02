# 集合

priorityQueue 可用于任务执行，执行优先级最高的任务(每次添加都把最小的元素放在了根部)

**LinkedHashMap 最近最少使用非常有用(根据访问顺序，而非添加顺序)**

**可以set操作的称为可修改的集合，可以add或者remove的称为可改变大小**

> 不可变集合--Arrays和Collections获取的视图集合，不能add和remove，Arrays和Collections获取的subList子范围，不能clear，否则unSupportOperationException

> 可remove不可add--一些集合的keyset，values，entrySet，只可以删除不能添加

- 集合框架---常用的一些集合
  - ArrayList-数组列表 
  - LinkedList-链表列表
  - HashMap-哈希键值对 
  - TreeMap-红黑树Map 
  - PriorityQueue-优先级队列 
  - LinkedHashMap-链表哈希键值对 
  - ArrayDueue-数组双端队列

## 1.集合框架中的类

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection1.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection2.jpg" alt="jpg">


## 2.具体的集合

### 1.数组列表 ArrayList
当需要快速访问集合的元素，选用ArrayList  如果需要同步使用Vector

### 2.链表
如果需要插入和删除的操作比较频繁，并且集合比较大，选用链表集合

> 结构图：

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection3.jpg" alt="jpg">

### 3.散列集合

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection4.jpg" alt="jpg">

- 左边是桶，链表是桶对应存放的对象链表
- 对象存放在哪个桶  ==   对象的散列值%桶的数量  取余
- 如果桶中没有数据，直接插入，如果桶中对象满了- --> 散列冲突　　(java 8 中，桶中对象满时，会从链表变成平衡二叉树)
- 减少散列冲突 ： 1. 设置桶数 一般设置为要填充的个数的75%-150%  2.填充因子0.75，如果填入元素超过了75%，则会再散列，双倍桶数进行再散列
- 标准类库使用的桶数是2的幂，默认值是16

### 4.树集 treeset

**有序集合** -- 按红黑树结构实现，插入的元素都查找到指定位置，然后add，add的速度比hashset要慢

如果集合的元素有n，新插入的元素大概需要log2N次比较(如果N 等于1000 ，那么大概需要10次， log2N--- 2的多少次幂等于N)　

> 前提：要使用树集，元素必须可以比较，需要实现Comparable接口


### 5.队列与双端队列

队列，双端队列可以在头部或者尾部添加和删除元素

- ArrayDeque
- - ArrayDeque()
- - ArrayDeque(int initialCapacty)
- - > 用初始容量16或者给定的初始容量构造一个无限的双端队列

### 6.优先级队列

PriorityQueue 优先级队列，总会获取优先级队列中最小的元素

> 迭代并不按照元素的排列顺序，实际上是没有排序，只是每次添加都把最小的元素放在了根部，使用堆(heap)一种二叉树

**优先级队列可以用来存放任务，然后每次获取优先级最高的任务执行**

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection5.jpg" alt="jpg">


## 3.映射

### 1.基本映射操作 hashMap treeMap
- 如果不需要对键进行排列，使用hashMap，它比treemap快
- treemap用键的整体顺序对元素进行排序

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection6.jpg" alt="jpg">


### 2.更新映射项

- map.merge("key", 2, Integer::sum);//如果key无值，设置为2，如果有，加上2
- map.compute();如果key不存在会报空指针异常，merge不会
- `map的键值都可为null，compute、computeIfAbent、computeIfPresent、merge都是对键进行更新的操作`


### 3.映射视图　

3种视图:
- Set<K> keySet()
- Collection<V> values()
- Set<Map.Entry<K,V>> entrySet()

可以在视图迭代器调用remove方法，不过不能增加元素

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection7.jpg" alt="jpg">


### 4. 弱散列映射
weakhashmap 使用弱引用保存键，某个对象只由弱引用，垃圾回收回收它，但要放入队列，weakhashmap周期性的检查队列，以便找出新的弱引用，然后删除对应的条目

### 5.链接散列集和映射  LinkedHashSet LinkedHashMap

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection8.jpg" alt="jpg">

LinkedhashMap，如果添加元素后，直接遍历或者使用迭代器，那么按添加后的顺序打印出来

> LinkedHashMap将按访问顺序而不是插入顺序对条目进行迭代，从第二次访问可以看到，每次get或者put的条目会被放到末尾  --- LinkedHashMap对最近最少使用原则十分重要

```java
    @Test
    public void testLinkedHashMap(){
        LinkedHashMap<String, String> linkedHashMap = new LinkedHashMap<String, String>(4, 0.75F,true);
        linkedHashMap.put("144-25-5464", "Amy Lee");
        linkedHashMap.put("567-24-2546", "Harry Hacker");
        linkedHashMap.put("157-62-7935", "Gary Cooper");
        linkedHashMap.put("456-62-5527", "Francesca Cruz");

        log.info("linkedHashMap --- " + linkedHashMap);
        linkedHashMap.forEach((k,v) -> log.info("k --- " + k + " --- v ----" + v));
        String s = linkedHashMap.get("567-24-2546");
        log.info("s --- " + s);
        log.info("linkedHashMap --- " + linkedHashMap);
        linkedHashMap.forEach((k,v) -> log.info("k --- " + k + " --- v ----" + v));
    }
```

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection9.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection10.jpg" alt="jpg">


### 6.枚举集和映射 EnumSet EnumMap

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection11.jpg" alt="jpg">


### 7.标识散列映射
IdentifyHashMap  键的散列值是用System.identifyHashCode计算的

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection12.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection13.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection14.jpg" alt="jpg">


## 4.视图和包装器

keySet方法返回一个实现了Set接口的类对象，这个类的方法对原映射进行操作，这种集合称为视图。

### 1.轻量级集合包装器
Arrays.asList()方法得到一个List包装器，是视图对象，Collections.nCopies()，存储代价很小，是视图技术的巧妙应用。生成的集合不可变集合。

- **视图集合不能add或者remove，否则会抛出java.lang.UnsupportedOperationException异常，以下会报错**

```java
    @Test
    public void testUnChange(){
        String[] strings = new String[]{"a", "b", "c"};

        List<String> list = Arrays.asList(strings);
        Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()){
            String next = iterator.next();
            if(next.equals("a")){
                iterator.remove();
            }
        }
        log.info("list --- " + list);

    }
```

### 2.子范围
- 针对集合，可以使用subList获取集合的子范围的视图集合。list.subList(index a, index b);包左不包右
- 如果是Arrays或者Collections获取到的视图集合，执行clear方法会报错，即还是遵循了不可变集合的原则。

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection15.jpg" alt="jpg">


### 3.不可修改的视图

Collections的以下方法可以获取不可修改的视图，如果试图修改，则会抛出异常

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection16.jpg" alt="jpg">


> unmodifiableList和unmodifiableSet仍然使用底层集合的equals和hashCode方法进行比较，而且其他的获取不可修改的试图的，再也无法比较底层集合对象

> 不可修改试图不是集合本身不能修改，原来的集合仍然可以修改，只是生成的视图集合不可修改 -- unSupportOperationException

### 4.同步视图
类库的设计者使用视图来保证常规集合的线程安全，而不是使用线程安全的集合类。例如：Collections.synchronizedMap方法可以将任何一个映射表转换成具有同步访问方法的map视图

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection17.jpg" alt="jpg">


### 5.受查视图

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection18.jpg" alt="jpg">


### 6.关于可选操作的说明

如果不是可选操作，接口会成倍的增加，让类库设计者无法接受，所以采用这个折中的办法

可选指的是一些集合的keyset，values，entrySet，只可以删除不能添加，Arrays和Collections获取的视图集合，不能add和remove，Arrays和Collections获取的subList子范围，不能clear，否则unSupportOperationException

Collections类：可用于：
- 1.构造一个集合视图，不可修改，否则unSupportOperationException
- 2.构造一个集合视图，视图中的方法同步
- 3.构造一个集合视图，如果插入错误类型，ClassCastException
- 4.构造一个集合视图，不可修改列表，可以是n个，单个元素
- 5.构造一个集合视图，空集合，列表，映射，迭代器

Arrays类： 可用于：　
- 1.asList，构造列表视图，数组可修改，但大小不可变

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection19.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection20.jpg" alt="jpg">


## 5.算法
将max方法实现为能接受任何实现Collection接口的对象，这样不用写数组，列表，数据集合的max多个方法，一个便可以，泛型集合的重要概念。

### 1.排序与混排
- Collections.sort(); 或者list.sort();
- 查看书籍发现很多都是对数组的排序算法，使用随机访问的方式，但是对列表的随机访问方式效率很低。
- java使用的是：`将所有元素转入一个数组，然后对数组进行排序，然后排序后的序列复制回列表。`

下面是有关术语定义：
- 如果列表支持Set方法，则是可以修改的
- 如果列表支持add和remove方法，则是可以改变大小的


### 2.二分查找
集合必须是排好序的，然后查找一半，判断，然后再查找一半，如果数组中有1024个元素，那么大概需要10次查找。如果返回值大于0，则是元素的位置，如返回负值则是没有找到

如果把集合插入到正确的位置。

**只有采用随机访问，二分查找才有意义**

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection21.jpg" alt="jpg">

```java
    @Test
    public void testSort(){

        List<Integer> list = new ArrayList<>();
        list.add(55);
        list.add(15);
        list.add(35);
        list.add(25);
        list.add(5);
        Collections.sort(list);
        int i = Collections.binarySearch(list, 45);
        log.info("i ---- " + i);
        if(i < 0)
            list.add(-i -1 , 45);
        log.info("list --- " + list);
    }
```

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection22.jpg" alt="jpg">


### 3.简单算法

1. 查找最大值
2. 一个列表元素复制到另一个列表
3. 用一个常量值填充容器
4. 逆置一个列表元素顺序

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection23.jpg" alt="jpg">


### 4.批操作

coll1.removeAll(coll2); coll1中删除coll2中出现的元素，coll1.retainAll(coll2); coll1中删除coll2中未出现的元素


### 5.集合和数组的转换

- Arrays.asList();转换为视图集合
- list.toArray()得到的是Object[]数组
- 想得到相同类型：需要使用变体，list.toArray(new String[0]);

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection24.jpg" alt="jpg">

### 6.编写自己的算法
使用最通用的集合接口

## 6.遗留的集合

### 1.hashtable 类
如果不需要同步使用HashMap，如果需要同步，使用ConcurrentHashMap


### 2.枚举 Enumeration
Collections.enumeration(list)将产生一个枚举对象

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection25.jpg" alt="jpg">


### 3.属性映射

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection26.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection27.jpg" alt="jpg">


### 4.栈 Stack

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection28.jpg" alt="jpg">


### 5.位集 BitSet
存储boolean，比boolean的ArrayList还要高效率

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection29.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection30.jpg" alt="jpg">

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaImg/collection31.jpg" alt="jpg">








