# Copy-On-Write模式
仔细思考会发现Immutability模式的不可变性对象的写操作其实是Cow模式

## Cow的应用领域
### 并发容器
- CopyOnWriteArrayList
- CopyOnWriteArraySet
> 实现读操作无锁，写操作时复制，由于无锁，所以将读操作的性能发挥到了极致

### 操作系统领域
> 类Unix操作系统中，创建进程fork()操作会复制父进程的完整副本。而Linux操作系统，是先引用同一地址空间，而真正需要复制时才进行复制(例如写操作)

- 延时策略，只有在真正需要复制的时候才复制，而不是提前复制好
- 按需复制
- Copy-on-Write 在操作系统领域是能够提升性能的
- Docker 容器镜像的设计是 Copy-on-Write，甚至分布式源码管理系统 Git 背后的设计思想都有 Copy-on-Write

### 操作系统跟并发容器对比
- Copy-on-Write 容器，修改的同时会复制整个容器。提升读操作性能的同时，是以内存复制为代价
- 操作系统延时策略，按需复制
- 不同的场景对性能影响是不同的

### opy-on-Write 最大的应用领域在函数式编程领域
- 函数式编程的基础是不可变性
- 函数式编程里面所有的修改操作都需要 Copy-on-Write 来解决
- 不像 Java 里的 CopyOnWriteArrayList 那样笨：整个数组都复制一遍。Copy-on-Write 也是可以按需复制的

## Cow使用示例
- 对读的性能要求很高，读多写少，弱一致性
- CopyOnWriteArrayList 和 CopyOnWriteArraySet 天生就适用这种场景
> 一个 RPC 框架，有点类似 Dubbo，服务提供方是多实例分布式部署的，所以服务的客户端在调用 RPC 的时候，会选定一个服务实例来调用，这个选定的过程本质上就是在做负载均衡，而做负载均衡的前提是客户端要有全部的路由信息。例如在下图中，A 服务的提供方有 3 个实例，分别是 192.168.1.1、192.168.1.2 和 192.168.1.3，客户端在调用目标服务 A 前，首先需要做的是负载均衡，也就是从这 3 个实例中选出 1 个来，然后再通过 RPC 把请求发送选中的目标实例

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part3/cow/1.png" alt="png"> 

> RPC 框架的一个**核心任务**就是**维护服务的路由关系**，我们可以把服务的路由关系简化成下图所示的路由表。当服务提供方上线或者下线的时候，就需要更新客户端的这张路由表

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part3/cow/2.png" alt="png"> 

```java
/**
 * 重写了 equals 方法，这样 CopyOnWriteArraySet 的 add() 和 remove() 方法才能正常工作
 */
//路由信息
public final class Router{
  private final String  ip;
  private final Integer port;
  private final String  iface;
  //构造函数
  public Router(String ip, 
      Integer port, String iface){
    this.ip = ip;
    this.port = port;
    this.iface = iface;
  }
  //重写equals方法
  public boolean equals(Object obj){
    if (obj instanceof Router) {
      Router r = (Router)obj;
      return iface.equals(r.iface) &&
             ip.equals(r.ip) &&
             port.equals(r.port);
    }
    return false;
  }
  public int hashCode() {
    //省略hashCode相关代码
  }
}
//路由表信息
public class RouterTable {
  //Key:接口名
  //Value:路由集合
  ConcurrentHashMap<String, CopyOnWriteArraySet<Router>> 
    rt = new ConcurrentHashMap<>();
  //根据接口名获取路由表
  public Set<Router> get(String iface){
    return rt.get(iface);
  }
  //删除路由
  public void remove(Router router) {
    Set<Router> set=rt.get(router.iface);
    if (set != null) {
      set.remove(router);
    }
  }
  //增加路由
  public void add(Router router) {
    Set<Router> set = rt.computeIfAbsent(
      route.iface, r -> 
        new CopyOnWriteArraySet<>());
    set.add(router);
  }
}
```

## 优缺点
### 优点
- 其实 Copy-on-Write 才是最简单的并发解决方案
- Java 中的基本数据类型 String、Integer、Long 等都是基于 Copy-on-Write 方案实现的
### 缺点
- 消耗内存，每次修改都需要复制一个新的对象出来







