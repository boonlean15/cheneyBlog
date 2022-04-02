# 流库

流提供了一种让我们可以再比集合更高的概念级别上指定计算的数据视图 。

## 1.从迭代到流的操作

### 特性

- 流并不存储其元素
- 流的操作不会改变其数据源
  
### 操作流程

1. 创建一个流  ： 通过stream()方法
2. 指定将初始流转换为其他流的中间操作，可能包含多个步骤.如：filter()，flatMap()，map()，等等
3. 应用终止操作，从而产生结果。如：count()，collect();

### parallelStream

可以让流库以并行方式来执行过滤和计数。

## 2.流的创建

- Collection接口的stream方法
- Stream.of方法
- Stream.generate方法
- Stream.iterator方法
- Stream.empty方法，不包含任何元素的流
- Pattern类的splitAsStream方法
- Files.lines方法等等

## 3.filter、map、flatMap

### 1.filter 
> filter转换会产生一个流，它的元素和某种条件相匹配。
>> filter的引元是Predicate<T> ，即从T到boolean的函数

### 2.map

> 使用map时，会有一个函数应用到每个元素上，并且其结果是包含了应用该函数后所产生的所有结果的流。

### 3.flatMap

- Stream<Stream<String>> result = words.stream().map(w -> letters(w));
  > 一个包含流的流，可以使用flatMap将包含流的流平摊为字母流。
- Stream<String> flatResult = words.stream().flatMap(w -> letters(w));
  > flatMap 产生一个流，它是通过将mapper应用到当前流中的所有元素所产生的结果连接到一起而获得。**这里的每个结果都是一个流**

## 4.抽取子流和连接流

- stream.limit(n) 返回一个新的流，截取流的前n个元素生成一个新流
- stream.skip(n) 丢弃前n个元素
-  Stream.concat 将两个流连接起来

```java
Stream<Double> randoms = Stream.generate(Math::random).limit(100);
Stream<String> words = Stream.of(contents.split("\\PL+")).skip(100);
Stream<String> combined = Stream.concat(letters("hello"),letters("world"));
```

## 5.其他的流转换

### 1.distinct方法
    
元素从原有流中产生，原来的元素按照同样的顺序剔除重复元素后产生

```java
Stream<String> uniqueWords = Stream.of("merrily","java","java").distinct();
```

### 2.sort方法

一种用于操作Comparable元素的流，另一种用于接收一个Comparator

```java
Stream<String> longestFirst = words.stream().sorted(Comparator.comparing(String::length).reversed());
```

### 3.peek方法

产生另一个流，它的元素和原来流中的元素相同，但是再每次获取一个元素时，都会调用一个函数。对于调试来说很方便

```java
Object[] powers = Stream.iterate(1.0, p -> p * 2).peek(e -> System.out.println("Fetching " + e)).limit(20).toArray();
```
> 当实际访问一个元素时，就会打印一条信息。

```java
@Test
public void testStreamPeek(){
    Stream<Double> peek = Stream.iterate(1.0, p -> p * 2).peek(e -> System.out.println("fetching " + e));
    Optional<Double> first = peek.findFirst();
    Double aDouble = first.get();
    log.info("aDouble ------ > " + aDouble);
}
```

##  6.简单约简

从流数据中获取答案，称为约简。将流约简为可以在程序中使用的非流值。

- max(Comparator<? super T> comparator)
- min(Comparator<? super T> comparator)
- findFirst()
- findAny()
- anyMatch(Predicate<? super T> predicate)
- allMatch(Predicate<? super T> predicate)
- noneMatch(Predicate<? super T> predicate)

##  7.Optional类型
> Optional<T>对象是一种包装器对象，要么包装了T类型的对象，要么没有包装任何对象。

### 1.使用Optional值
    orElse、orElseGet、orElseThrow、ifPresent、map

### 2.不正确的使用
    get、isPresent、

### 3.创建Optional
    of、ofNullable、empty、

### 4.flatMap
类似Stream的map和flatMap的操作、map操作结果->Optional<T> 、flatMap是Optional<T>,T->Optional<U>操作的结果-> Optional<U>

```java
public class OptionalTest
{
   public static void main(String[] args) throws IOException
   {
      String contents = new String(Files.readAllBytes(
            Paths.get("../gutenberg/alice30.txt")), StandardCharsets.UTF_8);
      List<String> wordList = Arrays.asList(contents.split("\\PL+"));

      Optional<String> optionalValue = wordList.stream()
         .filter(s -> s.contains("fred"))
         .findFirst();
      System.out.println(optionalValue.orElse("No word") + " contains fred");

      Optional<String> optionalString = Optional.empty();
      String result = optionalString.orElse("N/A");
      System.out.println("result: " + result);
      result = optionalString.orElseGet(() -> Locale.getDefault().getDisplayName());
      System.out.println("result: " + result);
      try
      {
         result = optionalString.orElseThrow(IllegalStateException::new);
         System.out.println("result: " + result);
      }
      catch (Throwable t)
      {
         t.printStackTrace();
      }

      optionalValue = wordList.stream()
         .filter(s -> s.contains("red"))
         .findFirst();
      optionalValue.ifPresent(s -> System.out.println(s + " contains red"));

      Set<String> results = new HashSet<>();
      optionalValue.ifPresent(results::add);
      Optional<Boolean> added = optionalValue.map(results::add);
      System.out.println(added);

      System.out.println(inverse(4.0).flatMap(OptionalTest::squareRoot));
      System.out.println(inverse(-1.0).flatMap(OptionalTest::squareRoot));
      System.out.println(inverse(0.0).flatMap(OptionalTest::squareRoot));
      Optional<Double> result2 = Optional.of(-4.0)
         .flatMap(OptionalTest::inverse).flatMap(OptionalTest::squareRoot);
      System.out.println(result2);
   }

   public static Optional<Double> inverse(Double x)
   {
      return x == 0 ? Optional.empty() : Optional.of(1 / x);
   }

   public static Optional<Double> squareRoot(Double x)
   {
      return x < 0 ? Optional.empty() : Optional.of(Math.sqrt(x));
   }
}
```

##  8.收集结果到集合或者列表

- toArray 结果存储到数组中，可以提供数组的new，确定数组类型。因为运行时，不能确定类型，未提供的情况下，结果是Object[]
- collect（Collector ）方法，使用给定的的收集器收集当前流中的元素
- Collectors 
  - toList
  - toSet
  - toCollection 可以提供TreeSet::new 构造器引用，产生一个将元素收集到集合中的收集器。
  - joining
  - sumarizing 可以获取max，min，average，等

## 9.收集结果到映射表中

```java
@NotNull 
@Contract(value = "_,_,_,_->new", pure = true) 
public static <T, K, U, M extends java.util.Map<K, U>> java.util.stream.Collector<T, ?, M> toMap(@NotNull java.util.function.Function<? super T, ? extends K> keyMapper,
@NotNull java.util.function.Function<? super T, ? extends U> valueMapper,
java.util.function.BinaryOperator<U> mergeFunction,
java.util.function.Supplier<M> mapSupplier)
```
>产生一个收集器，产生一个映射表或者并发映射表。keyMapper和valueMapper函数会引用到每个收集的元素上，从而产生映射表中的键/值项。默认情况，当两个元素的键相同时，会抛出

>一个IllegalStateException异常。提供一个mergeFunction，来合并相同键的值。默认结果是HashMap或者ConcurrentHashMap，可以提供一个mapSupplier，它产生期望的映射表实例。        
## 10.群组和分区
1. **groupingBy 产生一个收集器，键是应用classifier分类函数后所有元素收集到的结果。**

```java
Stream<Locale>  locales = Stream.of(Locale.getAvailableLocales());
Map<String, List<Locale>> collect = locales.collect(Collectors.groupingBy(l -> l.getCountry()));
System.out.println("groupingBySets: " + countryLanguageSets);
```

2. **partitioningBy 产生一个收集器，键是应用断言后所有元素收集到的结果。true/false**

```java
Stream<Locale> locales = Stream.of(Locale.getAvailableLocales());
Map<Boolean, List<Locale>> partition = locales.collect(Collectors.partitioningBy(l -> l.getLanguage().equals("en")));
System.out.println("partition: " + partition);
List<Locale> locales1 = partition.get(true);
List<Locale> locales2 = partition.get(false);
System.out.println("partition: locales1" + locales1);
System.out.println("partition: locales2" + locales2);
```

## 11.下游收集器

groupingBy的每个值都是一个列表，如果想以某种方式处理列表，那么就需要提供一个下游收集器

最佳的用法是结合groupingBy和partitioningBy群组分类一起处理下游映射表中的值

```java
public static void main(String[] args) throws IOException
   {
      Stream<Locale> locales = Stream.of(Locale.getAvailableLocales());
      Map<String, Set<Locale>> countryToLocaleSet = locales.collect(groupingBy(
            Locale::getCountry, toSet()));
      System.out.println("countryToLocaleSet: " + countryToLocaleSet);

      locales = Stream.of(Locale.getAvailableLocales());
      Map<String, Long> countryToLocaleCounts = locales.collect(groupingBy(
            Locale::getCountry, counting()));
      System.out.println("countryToLocaleCounts: " + countryToLocaleCounts);

      Stream<City> cities = readCities("cities.txt");
      Map<String, Integer> stateToCityPopulation = cities.collect(groupingBy(
            City::getState, summingInt(City::getPopulation)));
      System.out.println("stateToCityPopulation: " + stateToCityPopulation);

      cities = readCities("cities.txt");
      Map<String, Optional<String>> stateToLongestCityName = cities
            .collect(groupingBy(
                  City::getState,
                  mapping(City::getName,
                        maxBy(Comparator.comparing(String::length)))));

      System.out.println("stateToLongestCityName: " + stateToLongestCityName);

      locales = Stream.of(Locale.getAvailableLocales());
      Map<String, Set<String>> countryToLanguages = locales.collect(groupingBy(
            Locale::getDisplayCountry,
            mapping(Locale::getDisplayLanguage, toSet())));
      System.out.println("countryToLanguages: " + countryToLanguages);

      cities = readCities("cities.txt");
      Map<String, IntSummaryStatistics> stateToCityPopulationSummary = cities
            .collect(groupingBy(City::getState,
                  summarizingInt(City::getPopulation)));
      System.out.println(stateToCityPopulationSummary.get("NY"));

      cities = readCities("cities.txt");
      Map<String, String> stateToCityNames = cities.collect(groupingBy(
            City::getState,
            reducing("", City::getName, (s, t) -> s.length() == 0 ? t : s
                  + ", " + t)));

      cities = readCities("cities.txt");
      stateToCityNames = cities.collect(groupingBy(City::getState,
            mapping(City::getName, joining(", "))));
      System.out.println("stateToCityNames: " + stateToCityNames);
   }
```

下游收集器 - Collectors静态方法有：
- counting()
- sumingInt(ToIntFunction<? super T> mapper)
- sumingLong(ToIntFunction<? super T> mapper)
- sumingDouble(ToIntFunction<? super T> mapper)
- minBy(Comparator<? super T> comparator)
- maxBy(Comparator<? super T> comparator)
- mapping(Function<? super T,? extends U> mapper, Collector<? super U,A,R> downstream)
   > 产生一个收集器，它会产生一个映射表，其键是将mapper应用到收集到的数据上而产生的，其值是使用downStream收集器收集到的具有相同键的元素

## 12.约简操作
### reduce

- 约简操作 操作持续作用在两个元素上
>例如：collects.reduce(0,(a, b) -> a + b); 计算两个数的和，持续作用，0为幺元素，如果流为空，则会返回幺元素，这样就不用操作Optional

- reduce(T identity, BiFunction accumulator, BinaryOperator combiner); 1 幺元素，2 累积操作， 3 对累积操作的组合
>例如：int sum. = words.reduce(0, (total, word) -> total + word.length, (total1, total2) -> total1 + total2);//一般用于并行化操作的时候

- collect(Supplier supplier, BiConsumer accumulator, BiConsumer combiner); 1 提供初始结果，2 将元素累积操作，3 结合累积操作的结果

- BitSet result = stream.collect(BitSet::new, BitSet::set, BitSet::or);//一般用于并行化操作的时候

## 13.基本类型流
- 1.对象流-> 基本类型流  mapToInt()
- 2.基本类型流 -> 对象流 boxed()

## 14.并行流

只有在对已经存在于内存中的数据进行大量的计算时，才采用并行流。
**并行流使用Fork-join框架**

- parallel() 产生一个与当前流中元素相同的并行流
- unordered() 产生一个与当前流中元素相同的无序流
- parallelStream() 用当前集合中的元素产生一个并行流