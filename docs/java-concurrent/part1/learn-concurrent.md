# 学习并发编程
技术背后的理论和模型同样重要，坚持学习是一个难能可贵的天赋

## 管程
管程是一种解决并发问题的模型 synchronized、wait、notify、condition等是管程模型的一种实现而已

## 分工、同步、互斥
并发编程三个核心问题：分工、同步、互斥
- 分工 fork/join
- 同步 CountDownLatch
- 互斥 可重入锁
> java sdk并发包大部分都是按照这三个维度组织的

<img width="600" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/general.jpg" alt="jpg"> 

# 如何学好并发编程

- 跳出来，看全景  分工、同步、互斥
- 钻进去，看本质  技术后面的理论基础