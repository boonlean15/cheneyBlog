# ByteBuf
Netty的数据容器 ByteBuf的API，通过ByteBuf和ByteBufHolder暴露
> API的详细信息、用例、内存分配

> java nio使用ByteBuffer作为它的字节容器，但过于复杂，有些繁琐。Netty的ByteBuffer替代品ByteBuf，一个强大的实现，解决了JDK API的局限性，又为网络应用程序的开发者提供了更好的API

## ByteBuf优点
- 可被用户自定义的缓冲区类型扩展
- 内置的复合缓冲区类型实现了透明的零拷贝
- 容量可以按需增长(类似StringBuilder)
- 读写切换不需要调用ByteBuffer的flip()方法
- 读写使用了不同的索引
- 支持方法的链式调用
- 支持引用计数
- 支持池化

## ByteBuf类
  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/2.png" alt="png"> 

### 索引 读写会改变索引 get set不会
ByteBuf拥有一个读索引和写索引：ReaderIndex和WriteIndex
> 如果ReaderIndex到WriteIndex到位置，然后继续读，则会IndexOutofBoundsException、可以指定ByteBuf的最大容量

## 使用模式

### 堆缓冲区
  > 最常用的byteBuf模式是将数据存储在JVM的堆空间中，这种模式称为支撑数组。可在没有池化的情况下提供快速的分配和释放。
```java
ByteBuf heapBuf = ...;
if(heapBuf.hasArray()){// 检查ByteBuf是否有一个支撑数组
    byte[] array = heapBuf.array();//如果有，获取对应数组的引用
    int offset = heapBuf.arrayOffset() + heapBuf.readerIndex();//计算第一个字节的偏移量    
    int length = heapBuf.readableBytes();//获取可读字节数
    handleArray(array, offset, length);//使用数组、偏移量、长度作为参数调用你的方法
}
```
### 直接缓冲区 
 > JDK的ByteBuffer允许JVM通过本地调用来分配内存、为了避免在每次调用本地I/O操作之前将缓冲区的内容复制到一个中间缓冲区。

 > 直接缓冲区的内容驻留在堆之外，直接缓冲区对于网络数据传输是理想的选择。如果数据在一个堆上分配的缓冲区中，通过socket发送它之前，JVM会在内部把你的缓冲区复制到一个直接缓冲区中

 - 缺点
   - 分配和释放都较为昂贵
   - 数据不是在堆上，需要进行一次复制
```java
ByteBuf directBuf = ...;
if(!directBuf.hasArray()){//检查ByteBuf 是否由支撑数组，如果不是，则这是一个直接缓冲区
    int length =  directBuf.readableBytes();//获取刻度字节数
    byte  array = new byte[length]; //分配一个新的数组保存具有该长度的字节数据
    directBuf.getBytes(directBuf.readerIndex(), array);//复制字节到该数组
    handleArray(array,  0, length);//使用数组，偏移量和长度作为参数调用你的方法
}
```
### 复合缓冲区
> 为多个ByteBuf提供一个聚合视图，可以根据需要添加或删除ByteBuf实例

CompositeByteBuf ByteBuf的子类，提供将多个缓冲区表示为单个合并缓冲区。如果只有一个实例，hasArray方法调用将返回该组件的hasArray方法的值，否则将返回false
  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/3.png" alt="png"> 

**使用CompositeByteBuf的复合缓冲区模式**
```java
CompositeByteBuf messageBuf = Unpooled.compositeBuffer();
ByteBuf headerBuf = ...;//can be backing or direct
ByteBuf bodyBuf = ...;//can be backing or direct
messagebuf.addComponents(headerBuf,bodyBuf);//将ByteBuf实例追加到compositeByteBuf
messageBuf.removeComponent(0);//删除位于索引0的ByteBuf
for(ByteBuf buf: messageBuf){//遍历所有ByteBuf实例
    System.out.println(buf.toString());
}
```

**访问compositeByteBuf中的数据**

CompositeByteBuf可能不支持访问其支撑数组
```java
CompositeByteBuf comBuf = Unpooled.compositeBuffer();
int length = comBuf.readableBytes();
byte[] array = new Byte[length];
comBuf.getBytes(comBuf.readerIndex(), array);//将字节读到数组中
handleArray(array, 0, array.length);
```

- > Netty使用了CompositeByteBuf来优化套接字的IO操作，尽可能的消除由JDK缓冲区实现所导致的性能以及内存使用率的惩罚。**(指的是：本地IO操作之前将缓冲区复制到一个中间缓冲区、包含堆上分配的缓冲区，在套接字发送前，JVM内部把缓冲区复制到直接缓冲区中)**

## 字节级操作
指的是操作ByteBuf的数据，即操作的字节。跟普通java数组一样，ByteBuf的索引是从零开始的

### 随机访问索引
> 使用需要一个索引值参数的方法之一来访问数据既不会改变readerIndex也不会改变writeIndex。**调用readerIndex(index)或writerIndex(index)手动移动索引**

```java
ByteBuf buff = ...;
for(int i = 0; i<buff.capacity(); i++>){
    byte b = buff.getByte(i);
    System.out.println((char)b);
}
```
  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/4.png" alt="png"> 

### 可丢弃字节

> 调用discardReadBytes()方法后，丢弃并回收空间

  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/5.png" alt="png"> 

> 频繁地调用discardReadBytes()方法以确保可写分段的最大化，但极有可能会导致内存复制，因为可读字节（图中标记为CONTENT的部分）必须被移动到缓冲区的开始位置。建议只在有真正需要的时候才这样做，例如，当内存非常宝贵的时候

### 可读字节
> ByteBuf的刻度字节分段存储来实际数据，新分配、包装的、复制的缓冲区默认的readerIndex值为0.

被调用的方法需要一个ByteBuf参数作为写入的目标，并没指定目标索引参数，那么该目标缓冲区的writerIndex也将被增加
```java 
readBytes(ByteBuf dest); 
```
示例：读取所有数据
```java
ByteBuf buffer = ...;
while(buffer.isReadable()){
    log.info(buffer.readByte());
}
```

### 可写字节
> 新分配的缓冲区的writerIndex默认值为0，名为write开头的操作都将从当前的writerIndex处开始写数据

writeBytes(Bytebuf dest) 源缓冲区中的readerIndex同样被增加相同的大小、尝试写入超过capacity的数据，IndexOutOfBoundException

示例：写数据
```java
ByteBuf buffer = ...;
while(buffer.writeableBytes() >= 4){//缓冲区是否还有足够空间写
    buffer.writeInt(random.nextInt());
}
```

### 索引管理
```java
markReaderIndex();//标记read索引
markWriterIndex();//标记write索引
resetReaderIndex();//重置read索引
resetWriterIndex();//重置write索引

readerIndex(int);//移动read索引
writerIndex(int);//移动write索引

clear();//readerIndex和writerIndex设置为0  不会清除内存中的内容 
```

clear方法
> clear()比discardReadBytes()轻量，只是重置索引而不会复制任何内容

 <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/6.png" alt="png"> 

### 查找操作

- indexOf() 方法最常用,确定指定值的索引
- 复杂查找 借助ByteBufProcessor，它有很多内置的常用值
- ByteBufProcessor接口只有一个 process(byte var1)方法
- forEachByte(ByteBufProcessor.FIND_NUL) 

示例：“使用ByteBufProcessor来寻找\r”
```java
ByteBuf buffer = ...;
int index = buffer.forEachByte(ByteBufProcessor.FIND_CR);
```

### 派生缓冲区
- duplicate()
- slice()
- slice(int,int)
- Unpooled.unmodifiableBuffer(...)
- order(ByteOrder)
- readSlice(int)

> 都会返回一个新的实例，它具有自己的读写索引和标记索引，但内部存储是共享的，即引用，如果修改了数据，则源数据对应的也被修改。但复制的代价很低廉，可以避开复制内存的开销

如果需要复制一个不共享的，采用copy()/copy(int,int)方法

```java
Charset utf8 = Charset.forName("UTF-8");
 ByteBuf buf = Unpooled.copiedBuffer("Netty in Action rocks!", utf8);  //创建ByteBuf 以保存所提供的字符串的字节
 ByteBuf copy = buf.copy(0, 15);　 //创建该ByteBuf 从索引0 开始到索引15结束的分段的副本
System.out.println(copy.toString(utf8));　 //将打印“Netty in Action
buf.setByte(0, (byte) 'J');　 //更新索引0 处的字节 
assert buf.getByte(0) != copy.getByte(0);  //将会成功，因为数据不是共享的
```

### 读写操作

- get/set操作，从指定的索引开始，并保持索引不变
- read/write操作，从指定的索引开始，索引对应变化

```java
getBytes(int,...);//将该缓冲区中从给定索引开始的数据传送到指定目的地
setByte(int index, int value);//设置给定索引处的字节值
readByte();//返回当前readerIndex的字节，readerIndex增加1
readMedium();//返回当前readerIndex处的24位的中等int值，并将readerIndex增加3
readInt();//返回当前readerIndex的int值，并将readerIndex增加4”
readBytes(ByteBuf | byte[] destination, int dstIndex [,int length]);//将当前ByteBuf中从当前readerIndex处开始的（如果设置了，length长度的字节）数据传送到一个目标ByteBuf或者byte[]，从目标的dstIndex开始的位置。本地的readerIndex将被增加已经传输的字节数
writeByte(int);//在当前writerIndex处写入一个字节值，并将writerIndex增加1
writeBytes(ByteBuf source |byte[] [,int srcIndex ,int length]);//从当前writerIndex开始，传输来自于指定源（ByteBuf或者byte[]）的数据。如果提供了srcIndex和length，则从srcIndex开始读取，并且处理长度为length的字节。当前writerIndex将会被增加所写入的字节数”
```
 <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/7.png" alt="png"> 


## ByteBufHolder
> 除了实际数据负载外，还需要存储各种属性,例如Http响应。netty提供了ByteBufHolder来处理，它支持缓冲区池化，可以从池中借用ByteBuf，在需要时自动释放

- content() 返回ByteBufHolder所持有的ByteBuf
- copy() 深拷贝这个ByteBufHolder，包括它所包含的ByteBuf的非共享拷贝
- duplicate() 浅拷贝这个ByteBufHolder

## ByteBuf实例管理方式

### 按需分配ByteBufAllocator
> Netty通过ByteBufAllocator实现ByteBuf的池化，用来分配任意类型的ByteBuf实例。它不会改变ByteBuf API

- 可以从Channel或者ChannelHandlerContext获取ByteBufAllocator
- netty默认使用pooledByteBufAllocator，可通过ChannelConfig或引导时配置
- ByteBufAllocator实现
   - PooledByteBufAllocator 池化了ByteBuf实例以提高性能并最大限度减少内存碎片。jemalloc-分配内存的方法-被大量现代操作系统采用
   - UnpooledByteBufAllocator 不池化ByteBuf实例，每次调用都是一个新的实例
```java
buffer();
buffer(int initialCapacity);
buffer(int initialCapacity, maxCapaccity);//返回一个基于堆或直接内存存储的ByteBuf
heapBuffer();
heapBuffer(int initialCapacity);
heapBuffer(int initialCapacity,int maxCapacity);//返回一个基于堆内存存储的ByteBuf
directBuffer();
directBuffer(int initialCapacity);
directBuffer(int initialCapacity,int maxCapacity);//返回一个基于直接内存存储的ByteBuf
compositeBuffer();//返回一个可以通过添加最大到指定数目的基于堆或直接内存存储的缓冲区来拓展的CompositeByteBuf
ioBuffer();//返回一个用于套接字的I/O操作的ByteBuf
```

### Unpooled缓冲区
> 未能获取ByteBufAllocator的情况，netty提供了Unpooled的工具类，静态辅助方法创建未池化的ByteBuf实例。

```java
buffer();
buffer(int initialCapacity);
buffer(int initialCapacity,int maxCapacity);//返回一个未池化的基于堆内存存储的ByteBuf
directBuffer();//返回一个未池化的基于直接内存存储的ByteBuf
wrappedBuffer();//返回一个包装了给定数据的ByteBuf
copiedBuffer();//返回一个复制了给定数据的ByteBuf
```
- Unpooled使得ByteBuf可用于不需要Netty的其他组件的非网络项目，使得其能得益于高性能的可扩展的缓冲区API
  
### ByteBufUtil
> ByteBufUtil提供操作ByteBuf的静态的辅助方法。和池化无关

- hexdump() 十六进制的表示形式打印ByteBuf的内容
- boolean equals(ByteBuf，ByteBuf) 判断两个ByteBuf实例的相等性
  
## 引用计数 
Netty第4版中为ByteBuf和ByteBufHolder引入引用计数，实现自ReferenceCounted
> 引用计数：通过在某个对象所持有的资源不再被其他对象引用时释放该对象所持有的资源来优化内存使用和性能的技术

- 通常以活动的引用计数为1开始，引用计数大于0，对象不会被释放。减少到0时，该实例会被释放。
- 已经释放到对象应该不可在用了
- 引用计数对于池化的实现是至关重要的，它降低内存分配的开销
- 谁负责释放：一般由最后访问(引用计数)对象的那一方负责释放

示例：引用计数
```java
Channel channel = ...;
ByteBufAllocator alloc = channel.alloc();//获取ByteBufAllocator
ByteBuf buff = alloc.directbuffer();//从ByteBufAllocator分配一个ByteBuf
assert buff.refCnt() == 1;//检查引用计数是否为预期的1
```
示例：释放引用计数的对象
```java
ByteBuf buffer = ...;
boolean released = buffer.release();//减少该对象的活动引用。当减少到0，该对象呗释放，并且该方法返回true
```
