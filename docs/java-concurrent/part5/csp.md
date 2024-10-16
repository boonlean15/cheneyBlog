# CSP模型 解决协程协作问题

## GO支持协作的两种方案
- 支持协程之间以共享内存的方式通信，Golang提供了管程和原子类对协程进行同步控制，跟java类似
- 支持协程之间以消息传递(Message-Passing)的方式通信，本质是避免共享。go这个方案是基于CSP模型实现的Communicating Sequential Processes

## 什么是CSP模型
**协程之间以消息传递方式来通信**，Go实现CSP模型和Actor相似
通信顺序进程（CSP）是一种形式语言，用来描述并发性系统间进行交互的模式。它基于通过通道的消息传递
- 不要以共享内存的方式通信，要以通信的方式共享内存
- Go可以共享内存方式通信，但不推荐；推荐以通信的方式共享内存，指协程之间以消息传递方式来通信
- Go中协程之间的通信推荐的是使用Channel管道

示例：单个协程执行累加，4个协程执行累加
```go
import (
  "fmt"
  "time"
)

func main() {
    // 变量声明
  var result, i uint64
    // 单个协程执行累加操作
  start := time.Now()
  for i = 1; i <= 10000000000; i++ {
    result += i
  }
  // 统计计算耗时
  elapsed := time.Since(start)
  fmt.Printf("执行消耗的时间为:", elapsed)
  fmt.Println(", result:", result)

    // 4个协程共同执行累加操作
  start = time.Now()
  ch1 := calc(1, 2500000000)
  ch2 := calc(2500000001, 5000000000)
  ch3 := calc(5000000001, 7500000000)
  ch4 := calc(7500000001, 10000000000)
    // 汇总4个协程的累加结果
  result = <-ch1 + <-ch2 + <-ch3 + <-ch4
  // 统计计算耗时
  elapsed = time.Since(start)
  fmt.Printf("执行消耗的时间为:", elapsed)
  fmt.Println(", result:", result)
}
// 在协程中异步执行累加操作，累加结果通过channel传递
func calc(from uint64, to uint64) <-chan uint64 {
    // channel用于协程间的通信
  ch := make(chan uint64)
    // 在协程中执行累加操作
  go func() {
    result := from
    for i := from + 1; i <= to; i++ {
      result += i
    }
        // 将结果写入channel
    ch <- result
  }()
    // 返回结果是用于通信的channel
  return ch
}
```

## CSP模型与生产者-消费者模式
- Go实现的CSP类比生产者-消费者，channel类比生产者-消费者模式的阻塞队列
### channel特点
- Go中channel的容量可以是0，容量0的channel称为无缓冲的channel，容量不为0的称为有缓冲的channel
- 无缓冲的channel类似java中的SynchronousQueue，用于在两个协程之间做数据交换
- Go的channel是语言层面支持的，可以用一个向左箭头(<-)完成向channel发送数据和读取数据的任务
- Go的channel支持双向传输，指协程即可向它发送数据，也可接收数据
- Go中可以将双向channel变成一个单向channel
  > 在累加器的例子中，calc() 方法中创建了一个双向 channel，但是返回的就是一个只能接收数据的单向 channel，所以主协程中只能通过它接收数据，而不能通过它发送数据;
  > 如果试图通过它发送数据，编译器会提示错误。对比之下，双向变单向的功能，如果以 SDK 方式实现，还是很困难的。

示例：创建容量为4的channel，4个协程作为生产者，4个协程作为消费者
```go
// 创建一个容量为4的channel 
ch := make(chan int, 4)
// 创建4个协程，作为生产者
for i := 0; i < 4; i++ {
  go func() {
    ch <- 7
  }()
}
// 创建4个协程，作为消费者
for i := 0; i < 4; i++ {
    go func() {
      o := <-ch
      fmt.Println("received:", o)
    }()
}
```

## CSP 模型与 Actor 模型的区别
- Actor 模型中没有 channel
 > Actor 模型中的 mailbox 对于程序员来说是“透明”的，mailbox 明确归属于一个特定的 Actor，是 Actor 模型中的内部机制；Actor 之间是可以直接通信的，不需要通信中介
 > CSP 模型中的 channel 就不一样了，它对于程序员来说是“可见”的，是通信的中介，传递的消息都是直接发送到 channel 中的
- Actor 模型中发送消息是非阻塞的，而 CSP 模型中是阻塞的
  > Golang 实现的 CSP 模型，channel 是一个阻塞队列，当阻塞队列已满的时候，向 channel 中发送数据，会导致发送消息的协程阻塞。
- CSP 模型中，是能保证消息百分百送达的,Actor 模型理论上不保证消息百分百送达
  > 不过这种百分百送达也是有代价的，那就是有可能会导致死锁

死锁示例：
```go
//在主协程中，我们创建了一个无缓冲的 channel ch，然后从 ch 中接收数据，此时主协程阻塞，main() 方法中的主协程阻塞，整个应用就阻塞了
//这就是 Golang 中最简单的一种死锁。
func main() {
    // 创建一个无缓冲的channel  
    ch := make(chan int)
    // 主协程会阻塞在此处，发生死锁
    <- ch 
}
```

## 拓展
- Go支持select语句
> Golang 中实现的 CSP 模型功能上还是很丰富的，例如支持 select 语句，select 语句类似于网络编程里的多路复用函数 select()，只要有一个 channel 能够发送成功或者接收到数据就可以跳出阻塞状态。
- CSP 模型是托尼·霍尔（Tony Hoare）在 1978 年提出的[Communicating Sequential Processes](http://www.usingcsp.com/cspbook.pdf)；另外，霍尔在并发领域还有一项重要成就，那就是提出了霍尔管程模型
- Java 领域可以借助第三方的类库JCSP来支持 CSP 模型[JCSP](https://www.cs.kent.ac.uk/projects/ofa/jcsp/)
  > 相比 Golang 的实现，JCSP 更接近理论模型，如果你感兴趣，可以下载学习。不过需要注意的是，JCSP 并没有经过广泛的生产环境检验，所以并不建议你在生产环境中使用。