# CSP模型 解决协程同步问题

## GO支持协作的两种方案
- 支持协程之间以共享内存的方式通信，Golang提供了管程和原子类对协程进行同步控制，跟java类似
- 支持协程之间以消息传递(Message-Passing)的方式通信，本质是避免共享。go这个方案是基于CSP模型实现的Communicating Sequential Processes














