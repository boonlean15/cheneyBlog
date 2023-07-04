# 编解码器框架

编码器、解码器、编解码器概述以及netty的编解码器类

## 什么是编解码器
消息：对于特定的应用程序具有具体含义的结构化的字节序列-它的数据
**编码器**
> 消息转换为适合于传输的格式

**解码器**
> 将网络字节流转换回应用程序的消息格式

**对于netty来说，编码器操作出站数据，解码器操作入站数据**

## 解码器
- 字节解码为消息 ByteToMessageDecoder和ReplayingDecoder
- 消息类型解码为另一种消息 MessageToMessageDecoder

## ByteToMessageDecoder

> 由于不可能知道远程节点是否会一次性发送一个完整的消息，所以**ByteToMessage会对入站数据进行缓冲，直到它准备好处理**

```java 
decode(ChannelHandlerContext ctx,ByteBuf in, List<Object> out);//方法被调用时将会传入一个包含了传入数据的ByteBuf，以及一个用来添加解码消息的List。对这个方法的调用将会重复进行，直到确定没有新的元素被添加到该List，或者该ByteBuf没有更多可读的字节为止。然后，如果该List不为空，那么它的内容将会被传递给ChannellPipeline中的下一个ChannelInboundHandler
decodeLast(ChannelHandlerContext ctx, ByteBuf in,List<Object> out);//简单调用了decode方法。当Channel的状态为非活动时，这个方法将会被调用一次。可以重写该方法以提供特殊的处理
```

### 示例 ToIntDecoder
**当没有更多元素可以被添加到该List中时，它的内容将会被发送给下一个ChannelInboundHandler**

```java
public class ToIntegerDecoder extends ByteToMessageDecoder{
    //拓展ByteToMessageDecoder类，以将字节解码为特定的格式
    @Override
    public void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        if(in.readableBytes() >= 4){//检查是否至少有4个字节可读(一个int的字节长度)
        out.add(in.readInt());//从入站ByteBuf中读取一个int，并将其添加到解码消息的List中
        }
    }
}
```

### 编解码器中的引用计数
> 对于编码器和解码器来说，其过程也是相当的简单：一旦消息被编码或解码，它就会被ReferenceCountUtil.release(message)调用自动释放。如你需要保留引用以便稍后使用，那么你可以调用ReferenceCountUtil.retain(message)方法。这将会增加该引用计数，从而防止该消息被释放

## ReplayingDecoder
> 解决ByteToMessageDecoder的每次转换都需要判断ByteBuf是否具有足够的数据

- 实现方式：
    > 通过使用一个自定义的ByteBuf实现，ReplayingDecoderByteBuf，包装传入的ByteBuf实现了这一点，其将在内部执行该调用

```java
public class ToIntegerDecoder extends ReplayingDecoder<Void>{
    //拓展ByteToMessageDecoder类，以将字节解码为特定的格式.Void代表不需要状态管理
    @Override
    public void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        out.add(in.readInt());//从入站ByteBuf中读取一个int，并将其添加到解码消息的List中
        }
    }
}
```
> 从ByteBuf中提取的int将会被添加到List中，如果没有足够的字节可用，这个readInt()方法实现将抛出一个Error，将在基类中被捕获并处理。当有更多的数据可供读取时，decode方法将被再次调用。

### 对比ByteToMessageDecoder

- 并不是所有的ByteBuf操作都被支持，如果调用了一个不被支持的方法，将会抛出一个UnsupportedOperationException
- ReplayingDecoder稍慢于ByteToMessageDecoder

**如果使用ByteToMessageDecoder不会引入太多的复杂性，那么请使用它；否则，请使用ReplayingDecoder**

#### 更多的解码器

- io.netty.handler.codec.LineBasedFrameDecoder：使用了行尾控制字符(\n或者\r\n)来解析消息数据
- io.netty.handler.codec.http.HttpObjectDecoder:一个Http数据的解码器。
- io.netty.handler.codec子包下面，有更多用于特定用例的编码器和解码器实现。


## MessageToMessageDecoder

```java
public abstract class MessageToMessageDecoder<T> extends ChannelInBoundHandlerAdapter
```
将消息解码为另一种类型编码格式的消息。类型参数I指定了decode()方法的输入参数msg的类型，decode方法是需要实现的唯一方法。对于每个需要被解码为另一种格式的入站消息来说，该方法都会被调用。

示例：
```java
public class IntegerToStringDecoder extends MessageToMessageDecoder<Integer> {
    @Override
    public void decode(ChannelHandlerContext ctx, Integer msg, List<Object> out) throws Exception{
        out.add(String.valueOf(msg));//将Integer消息转换为它的String表示，并将其添加到输出List中
    }
}
```

- 更加复杂的例子：io.netty.handler.codec.http.HttpObjectAggregator
- 

## ToLongFrameException 

> netty是异步框架，在字节可被解码之前在内存中缓冲它，避免解码器缓冲大量的数据以至于耗尽可用的内存。netty提供ToLongFrameException，可以通过设置一个阈值，如果缓冲的内存超过这个阈值，则抛出这个异常(随后会被ChannelHandller.exceptionCaught()方法捕获)。

- 怎么处理此异常，取决于该解码器的用户
- 某些协议，如http，允许返回一个特殊的响应。其他情况，唯一的选择可能是关闭对应的连接

示例：
```java
public class SafeByteToMessageDecoder extends ByteToMessageDecoder{
    private static final int MAX_FRAME_SIZE = 1024;
    @Override
    public void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception{
        int readable = in.readableBytes();
        if(readable > MAX_FRAME_SIZE){
            in.skipBytes(readable);//跳过所有可读的字节，抛出TooLongFrameException，并通知ChannelHandler
            throw new TooLongException("frame too big"); 
        }
        // do something
    }
}
```

## 编码器

解码器的逆操作，编码器实现了ChannelOutBoundHandler，操作的出站数据。将出站数据从一种格式转换为另一种格式，以适用于传输。

- 将消息编码为字节
- 将消息编码为消息

## MessageToByteEncoder

- ByteToMessageDecoder的逆操作
- encode(ChannelHandlerContext ctx, I msg, ByteBuf out);
- 只有一个encode方法，因为出站不需要在连接被关闭之后仍然产生消息。解码器通常需要在连接被关闭时产生最后一个消息，调用一次decodeLast方法

示例：
```java
public class ShortToByteEncoder extends MessageToByteEncoder<Short> {
    @Override
    public void encode(ChannelHandlerContext ctx, Short msg, ByteBuf  out) throw Exception{
        out.writeShort(msg);//将short写入byteBuf buf中
    }
}
```

- netty提供了一些专门化的MessageToByteEncoder
- io.netty.handler.codec.http.Websocketx包的一个很好的实例：WebSocket08FrameEncoder

## MessageToMessageEncoder

- 将消息格式编码为另一种消息
- encode(ChannelHandlerContext ctx, I msg, List<Object> out) 每个通过wirte方法写入的消息会被传递给encode方法，以编码为一个或者多个出站消息
- 有趣的MessageToMessageEncoder，请查看io.netty.handler.codec.protobuf.ProtobufEncoder,它处理Google的Protocol Buffers规范所定义的数据格式

示例：
```java
public class IntegerToStringEncoder extends MessageToMessageEncoder<Integer> {
    @Override
    public void encode(ChannelHandlerContext ctx, Integer msg, List<Object> out) throws Exception{
        out.add(String.valueOf(msg));//将Integer转换为String，并将其添加到List中
    }
}
```

## 编解码器

每一个都捆绑一个解码器/编码器对，同时实现了ChannelInboundHandler和ChannelOutboundHandler接口

- 编解码功能尽可能分开的原因是，最大化代码的可重用性和可拓展性。netty设计的一个基本原则

## ByteToMessageCodec
- 将字节解码为某种形式的消息，可能是POJO，随后再次对它编码。
- 结合了ByteToMessageDecoder和MessageToByteEncoder
- 任何的请求/响应协议都可以作为使用ByteToMessageCodec的理想选择

```java
decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out);//只要有字节可以被消费，方法就会调用。将入站in转换为指定的Object消息格式，并将其转发给ChannelPipeline的下一个ChannelInboundHandler
decodeLast();//连接关闭时，调用一次
encode(ChannelHandlerContext ctx, I msg, ByteBuf out);//将I编码并写入ByteBuf
```

## MessageToMessageCodec

```java
public abstract class MessageToMessageCodec<INBOUND_IN,OUTBOUND_IN>
//重要的方法
protected abstract decode(ChannelHandlerContext ctx, INBOUND_IN msg, List<Object> out);//传入Inbound_in类型，解码为Outbound_in类型
protected abstract encode(ChannelHandlerContext ctx, OUTBOUND_IN msg, List<Object> out);//传入Outbound_in类型，编码为Inbound_in类型
```
- 将INBOUND_IN看作是通过网络发送的类型，OUTBOUND_IN看作是应用程序所处理的类型

