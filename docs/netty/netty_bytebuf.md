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

### 索引
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
    int length = heapBuf.readabeBytes();//获取可读字节数
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
handle Array(array, 0, array.length);
```

