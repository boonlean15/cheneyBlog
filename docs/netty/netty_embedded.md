# 单元测试EmbeddedChannel

Netty提供了它的Embedded传输，用于测试ChannelHandler

## Embedded概述
> 将入站数据或者出站数据写入到EmbeddedChannel中，然后检查是否有任何东西到达了ChannelPipeline的尾端。以此方式，你可以确定消息是否已经被编解码过，以及是否触发了任何的ChannelHandler动作。

- Embedded的方法
```java
writeInbound(Object... msgs) //将入站消息写到embeddedchannel中，如果可以通过readInbound()方法读取数据，则返回true
readInbound()//从EmbeddedChannel中读取一个入站消息。任何返回的东西都穿越了整个ChannelPipeline，如果没有任何可供读取的，则返回null
writeOutbound()//将出站消息写到EmbeddedChannel中。如果现在可以通过readOutbound()方法从EmbeddedChannel中读取到什么，则返回true
readOutbound()//从EmbeddedChannel中读取一个出站消息。任何返回的东西都穿越了整个ChannelPipeline。如果没有任何可读，则返回null
finish()//将Embeddedchannel标记为完成，并且如果有可能被读取的入站数据或者出站数据，则返回true。这个方法还将调用EmbeddedChannel上的close()方法
```

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/netty/36.png" alt="png">

## 使用EmbeddedChannel测试ChannelHandler

- junit断言 失败的断言将导致一个异常被抛出，并终止当前正在执行中的测试

```java
import static org.junit.Assert.*;
```
- 示例 特定的解码器产生固定为3字节大小的帧、测试类验证是否如预期执行
```java
public class FixLengthFrameDecoder extends ByteToMessageDecoder {


    private final int frameLength;

    public FixLengthFrameDecoder(int frameLength) {
        if(frameLength <= 0){
            throw new IllegalArgumentException("frameLength must be positive integer: " + frameLength);
        }
        this.frameLength = frameLength;
    }
    
    @Override
    protected void decode(ChannelHandlerContext channelHandlerContext, ByteBuf in, List<Object> list) throws Exception {
        while (in.readableBytes() >= frameLength){
            ByteBuf buf = in.readBytes(frameLength);
            list.add(buf);
        }
    }
}

public class EmbeddedhanderlTest {
    @Test
    public void testFramesDecoded(){
        ByteBuf buf = Unpooled.buffer();
        for(int i =0; i < 9; i++){
            buf.writeByte(i);
        }
        ByteBuf input = buf.duplicate();
        EmbeddedChannel channel = new EmbeddedChannel(new FixLengthFrameDecoder(3));
        assertTrue(channel.writeInbound(input.retain()));
        assertTrue(channel.finish());
        ByteBuf read = (ByteBuf) channel.readInbound();
        assertEquals(buf.readSlice(3),read);
        read.release();
        read = (ByteBuf) channel.readInbound();
        assertEquals(buf.readSlice(3),read);
        read.release();
        read = (ByteBuf) channel.readInbound();
        assertEquals(buf.readSlice(3),read);
        read.release();
        assertNull(channel.readInbound());
        buf.release();
    }
}
```



