# 引导

引导一个应用程序，是指对它进行配置，并使它运行起来的过程。

## Bootstrap

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/30.png" alt="png">

> bootstrap本意是用来支撑不同应用程序的功能的。服务器致力于用一个父Channel来接受来自客户端的连接，并创建Channel以用于他们之间的通信。客户端只需要一个单独的，没有父Channel的Channel来用于所有的网络交互。

- AbstractBootstrap实现cloneable的原因
> 可能需要创建多个具有类似配置或相同配置的channel，为了支持这种模式而又不需要为每个channel创建并配置一个新的引导类实例。这种方式只会创建引导类实例的EventLoopGroup的一个浅拷贝，所以后者将在所有克隆的channel实例之间共享。
- 类的声明
```java
public abstract class AbstractBootstrap<B extends AbstractBootstrap<B,C>,C extends Channel>{}
public class Bootstrap extends AbstractBootstrap<Bootstrap,Channel>{}
public class ServerBootstrap extends AbstractBootstrap<ServerBootstrap, ServerChannel>{}
```

## 引导客户端和无连接协议 Bootstrap
Bootstrap用于客户端或者使用了无连接协议的应用程序中，Bootstrap类部分方法如下：

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/31.png" alt="png">
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/32.png" alt="png">

### 引导客户的
- Bootstrap为客户端和无连接协议的应用程序创建Channel

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/33.png", alt="png">

### Channel和EventLoopGroup的兼容性

