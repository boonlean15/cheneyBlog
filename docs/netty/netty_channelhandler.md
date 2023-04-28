# ChannelHandler和ChannelPipeline
> 主要内容：channelHandler API和ChannelPipeline API、检测资源泄露、异常处理

## ChannelHandler

### Channel的生命周期
- Channel生命周期状态
   - ChannelUnregistered Channel已创建，未注册到EventLoop
   - ChannelRegistered Channel已创建，已注册到EventLoop
   - ChannelActive 活动状态，可以接受和发送数据
   - ChannelInactive Channel没有连接到远程节点








