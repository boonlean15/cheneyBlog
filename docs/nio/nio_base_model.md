# NIO

如何学习NIO

- 有哪些IO模型，他们的区别是什么
- IO模型的缺陷是什么，高并发情况，为什么阻塞式接口+多线程会遇到瓶颈
- 解决方案：IO多路复用
- 掌握selector的用法

## nio基础

linux操作系统的网络编程也是涉及几个主要的函数，如：socket()、bind()、linsten()、connect()、accept()、read()、write()、

**其实也是类似和java的socket网络编程类似。而jvm底层也是使用了操作系统的网络编程接口，使用方式，通过jni函数调用这些操作系统函数**

### buffer
在没有学习nio之前，只能自己维护一个byte数组进行读写

缓冲区数据结构

- 一个容量，它永远不能改变
- 一个读写位置，下一个值将在此进行读写
- 一个界限，超过它进行读写是没有意义的
- 一个可勾选的标记，用于重复一个读入或写出操作
- 0<标记<位置<界限<容量
- API
 > Buffer clear()为缓冲区写出做准备、Buffer rewind()读写位置复位到0，保持界限不变，为重新读入做准备

 > Buffer filp()界限设置到位置，位置复位到0，为读入做准备

### channel
channel最主要的作用是用于非阻塞IO

Channel 提供了一种被称为 Scatter/Gather 的新功能，也称为本地矢量 I/O。**指在多个缓冲区上实现一个简单的IO操作**
- Scatter 对于read操作，从通道读取的数据会按顺序被散布到多个缓冲区
- Gather 对于write操作，多个缓冲区的数据，按顺序抽取，然后用channel发送出去

## io模型
- 阻塞和非阻塞IO的区别
  > 最直接的区别在于有没有让线程直接休眠，阻塞的调用，线程休眠了，而非阻塞IO线程不休眠

- 同步IO和异步IO的区别 - 阻塞、非阻塞、IO多路复用、信号驱动IO都是同步IO
  > 同步IO和异步IO可以理解为IO的过程是否需要进程参与其中，如需要进程参与其中，那么本质上还是同步IO，如果不需要进程参与，那么就是异步IO。

  > 比如：POSIX定义了一组异步操作IO的接口，不用关系fd是阻塞还是非阻塞，异步IO由内核接管应用层对fd的操作。异步IO向应用层通知IO操作完成事件。

  > 信号驱动IO的区别是，通知进程事件就绪，你可以来拿IO数据了，本质上还是进程参与了。


举例：外卖例子
- 阻塞IO
  > 例如：我点了外卖，然后就跑到门口等外卖来，然后中间什么其他事情都不做。如下：当connect没有连接完成之前，hello不会被打印
```java
socketChannel = SocketChannel.open();
socketChannel.connect(new InetSocketAddress("192.168.0.13", 8000));
System.out.println("Hello");
```
- 非阻塞IO
  > 例如：我点了外卖，然后看下外卖来了没有，没有的话我就扫一下地，扫两下就去门口看外卖来了没有，如此循环往复。
  Java中的非阻塞，在socketChannel上调用socketChannel.configureBlocking(false);

- IO多路复用
  > 例如：我点了外卖，小区的其他人也点了外卖，然后快递小哥一样送餐，全部都统一由楼下门卫小哥接受，然后门卫小哥再通知外卖到了的下去拿。

- 信号驱动IO SIGIO
  > 例如：我点了外卖，然后就在家里扫地，冲茶，然后外卖到了，小哥到门口按门铃，然后我再去拿。

- 异步IO
  > 例如：我网购了空调，然后其他的我都不用管了，我只负责下单，然后空调到货和安装都是有商家安排人员进行。

## IO多路复用
java中创建线程，默认会预留1M的内存，那么当线程数不断增加时，线程之间的调度切换，引发的资源竞争也会加剧，使得整个系统变得很慢。

- 这个问题的最佳解决方案就是select、epoll、poll
- 从IO多路复用模型的外卖例子中：门卫小哥就相当于poll，可以帮助服务端把所有的客户端的socket连接给管理起来。
  > poll可以同时观察许多socket的IO事件，如果所有socket都空闲时，会把当前线程阻塞掉，如果有一个或多个socket有IO事件时，则会被唤醒。它的返回值就是有IO事件的那一个或多个socket。得到返回值后，我们就可以处理这些socket上的IO事件了。**这样就把多个客户端都要去轮询处理的事件，交给poll去实现了**
- poll是java nio的底层实现
  

### selector
java的Selector是select、epoll、poll的外包类，在不同的平台，底层的实现可能有所不同，但基本原理是一样的。
- selector管理所有的channel
- 只要有一个channel有IO操作，则可以通过selector.select()方法检测到
- selector.selectedKeys返回所有有IO操作的Channel，然后对他们调用相应的IO操作
- **Channel是为了和Selector适配用的，Selector直接适配Socket比较困难，所以封装了一层Channel**

1-创建ServerSocketChannel和Selector,并把channel注册到selector上

2-selector.select()阻塞线程，当有IO操作时，select被唤醒

3-遍历selectedKeys，处理channel，如有新的channel连接到达，也注册到selector上

4-如果channel是读，则读取数据，把它感兴趣的事件改成写。，如是写，则写数据，它感兴趣的事件改成读。
示例：
```java
public static void main(String[] args) {
        try {
            ServerSocketChannel ssc = ServerSocketChannel.open();
            ssc.bind(new InetSocketAddress("127.0.0.1",8000));
            ssc.configureBlocking(false);
            //创建一个ServerSocketChannel，和一个Selector，
            // 并且把这个server channel 注册到 selector上，注册的时间指定，
            // 这个channel 所感觉兴趣的事件是 SelectionKey.OP_ACCEPT，这个事件代表的是有客户端发起TCP连接请求。
            Selector selector = Selector.open();
            ssc.register(selector, SelectionKey.OP_ACCEPT);

            ByteBuffer writeBuffer = ByteBuffer.allocate(1024);
            ByteBuffer readBuffer = ByteBuffer.allocate(1024);
            writeBuffer.put("received".getBytes());
            writeBuffer.flip();

            while (true){
                //使用 select 方法阻塞住线程，当select 返回的时候，线程被唤醒
                int select = selector.select();
                //再通过selectedKeys方法得到所有可用channel的集合
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                Iterator<SelectionKey> iterator = selectionKeys.iterator();
                System.out.println("打印key---");
                while (iterator.hasNext()){
                    SelectionKey key = iterator.next();
                    iterator.remove();

                    if(key.isAcceptable()){
                        SocketChannel socketChannel = ssc.accept();
                        socketChannel.configureBlocking(false);
                        socketChannel.register(selector,SelectionKey.OP_READ);
                        System.out.println("s有客户端connect 连接到服务端 服务端的accept");
                    } else if(key.isReadable()){
                        SocketChannel channel = (SocketChannel) key.channel();
                        readBuffer.clear();
                        channel.read(readBuffer);
                        readBuffer.flip();
                        System.out.println("服务端读操作 server received :" + new String(readBuffer.array()));
                        key.interestOps(SelectionKey.OP_WRITE);
                    } else if(key.isWritable()){
                        SocketChannel channel = (SocketChannel) key.channel();
                        writeBuffer.rewind();
                        channel.write(writeBuffer);
                        key.interestOps(SelectionKey.OP_READ);
                        System.out.println("服务端写操作 server write a writeBuffer to client");
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
```

### epoll 和poll

- poll poll返回一个整数，得到这个返回值后，还是需要逐个去检查。如有一万个socket同时poll，返回3，我们需要遍历一万个socket，然后找到有IO动作的socket
- epoll 直接通过输出参数(指针类型的参数)，一个epoll_event数组，直接获得这三个socket，这样就快了很多

### 状态机
状态机--状态机本质上是一个能保存状态的对象。
- 状态机定义了状态，以及这个状态下所能接受的动作，这些状态和操作一起组成了状态机

### 异步模型的状态机
状态机示例：
```java
public class EpollTask {
    private SocketChannel socketChannel;
    private SelectionKey key;
    private int state;
    private int dividend;
    private int divisor;
    private int result;
    private ByteBuffer writeBuffer;

    public EpollTask(SocketChannel socketChannel, SelectionKey key) {
        this.socketChannel = socketChannel;
        writeBuffer = ByteBuffer.allocate(64);
        this.key = key;
    }

    public void onRead(int data) {
        if (state == 0) {
            dividend = data;
            System.out.println(dividend);
            state = 1;
        }
        else if (state == 2) {
            divisor = data;
            System.out.println(divisor);

            if (divisor == 0)
                result = Integer.MAX_VALUE;
            else
                result = dividend / divisor;
            state = 3;
        }
        else {
            throw new RuntimeException("wrong state " + state);
        }
    }

    public void onWrite() {
        try {
            if (state == 1) {
                writeBuffer.clear();
                writeBuffer.put("divident".getBytes());
                writeBuffer.flip();
                socketChannel.write(writeBuffer);
                state = 2;
            }
            else if (state == 3) {
                writeBuffer.clear();
                writeBuffer.put(String.valueOf(result).getBytes());
                writeBuffer.flip();
                socketChannel.write(writeBuffer);

                socketChannel.close();
                key.cancel();
                state = 4;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 异步模型之callback
- A通知B做一件事情，告诉他，你做完之后通知我：即A向B注册回调函数
- 老板通知员工查客户资料，员工问，查完后做什么，老板说打电话通知客户系统升级。查到后做什么对应请求注册回调函数，老板说查到后做某事，是真正注册的回调函数。老板只做了注册回调告诉员工





