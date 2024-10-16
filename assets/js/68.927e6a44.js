(window.webpackJsonp=window.webpackJsonp||[]).push([[68],{349:function(t,a,e){"use strict";e.r(a);var s=e(14),n=Object(s.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"高性能网络应用框架netty"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#高性能网络应用框架netty"}},[t._v("#")]),t._v(" 高性能网络应用框架Netty")]),t._v(" "),a("p",[a("strong",[t._v("线程模型直接影响网络程序的性能")]),t._v("，了解网络编程性能瓶颈，然后再看netty是如何解决这个问题的")]),t._v(" "),a("h2",{attrs:{id:"网络编程性能瓶颈"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#网络编程性能瓶颈"}},[t._v("#")]),t._v(" 网络编程性能瓶颈")]),t._v(" "),a("ul",[a("li",[t._v("Thread-Per-Message模式，一个任务对应一个线程。Thread-Per-Message模式其实就是BIO模式")]),t._v(" "),a("li",[t._v("所有的read和write操作都会阻塞线程")]),t._v(" "),a("li",[t._v("互联网时代，百万连接，一个任务创建一个线程的方式不现实")]),t._v(" "),a("li",[t._v("网络程序，线程大部分是在等待IO操作，造成了很多线程阻塞，是极大的浪费")])]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/7.png",alt:"png"}}),t._v(" "),a("h3",{attrs:{id:"一个线程处理多个连接"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一个线程处理多个连接"}},[t._v("#")]),t._v(" 一个线程处理多个连接")]),t._v(" "),a("p",[t._v("如果一个线程处理多个连接，那么就不需要那么多线程了")]),t._v(" "),a("ul",[a("li",[t._v("BIO的API无法解决，调用阻塞API时，线程就阻塞了，无法处理其他请求")]),t._v(" "),a("li",[t._v("Java提供了NIO非阻塞式的API，也就是IO多路复用，其实也是Reactor模式")])]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/8.png",alt:"png"}}),t._v(" "),a("h2",{attrs:{id:"reactor-模式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#reactor-模式"}},[t._v("#")]),t._v(" Reactor 模式")]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/9.png",alt:"png"}}),t._v(" "),a("ul",[a("li",[t._v("Handle IO句柄，本质是一个网络连接")]),t._v(" "),a("li",[t._v("Event Handler 事件处理器，handleEvent处理IO事件，getHandler返回这个IO的Handle")]),t._v(" "),a("li",[t._v("Synchronous Event Demultiplexer 操作系统提供的IO多路复用API,例如：POSIX的select,linux的epoll")]),t._v(" "),a("li",[t._v("Reactor类，register_handler/remove_handler注册/删除事件处理器，handle_events方法是核心，Reactor模式的发动机\n"),a("ul",[a("li",[t._v("通过同步事件多路选择器提供的select方法监听网络事件")]),t._v(" "),a("li",[t._v("网络事件就绪后，遍历事件处理器处理该网络事件")])])])]),t._v(" "),a("div",{staticClass:"language-JAVA extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Reactor")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("::")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("handle_events")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//通过同步事件多路选择器提供的")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//select()方法监听网络事件")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("select")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("handlers"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//处理网络事件")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("h in handlers"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    h"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("handle_event")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 在主程序中启动事件循环")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("while")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" \n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("handle_events")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("h2",{attrs:{id:"netty-中的线程模型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#netty-中的线程模型"}},[t._v("#")]),t._v(" Netty 中的线程模型")]),t._v(" "),a("p",[t._v("Netty参考了Reactor模式，但没照搬，Netty的核心是EventLoop，也就是Reactor模式的Reactor，负责监听网络事件并调用事件处理器进行处理。")]),t._v(" "),a("h3",{attrs:{id:"netty核心概念eventloop"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#netty核心概念eventloop"}},[t._v("#")]),t._v(" Netty核心概念EventLoop")]),t._v(" "),a("ul",[a("li",[t._v("网络事件和EventLoop是N对1关系")]),t._v(" "),a("li",[t._v("EventLoop和线程是一对一关系")]),t._v(" "),a("li",[t._v("上面的关系确定后就不再变化。使得网络事件跟线程的关系是一对一，1个网络事件对应1个EventLoop，一个EventLoop对应一个线程")]),t._v(" "),a("li",[t._v("网络事件处理是单线程的，避免了很多并发问题")]),t._v(" "),a("li",[a("strong",[t._v("Netty的线程模型就是跟并发编程相关的部分")])])]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part4/10.png",alt:"png"}}),t._v(" "),a("h3",{attrs:{id:"netty-另一个核心概念eventloopgroup"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#netty-另一个核心概念eventloopgroup"}},[t._v("#")]),t._v(" Netty 另一个核心概念EventLoopGroup")]),t._v(" "),a("p",[t._v("一个 EventLoopGroup 由一组 EventLoop 组成")]),t._v(" "),a("ul",[a("li",[t._v("一般都会创建两个 EventLoopGroup")]),t._v(" "),a("li",[t._v("一个称为 bossGroup，一个称为 workerGroup")]),t._v(" "),a("li",[t._v("在 Netty 中，bossGroup 就用来处理连接请求的，而 workerGroup 是用来处理读写请求的。Netty 中目前使用的是轮询算法\n"),a("blockquote",[a("p",[t._v("这个和 socket 处理网络请求的机制有关，socket 处理 TCP 网络连接请求，是在一个独立的 socket 中，每当有一个 TCP 连接成功建立，都会创建一个新的 socket，之后对 TCP 连接的读写都是由新创建处理的 socket 完成的\n"),a("strong",[t._v("也就是说处理 TCP 连接请求和读写请求是通过两个不同的 socket 完成的")])])])])]),t._v(" "),a("h3",{attrs:{id:"netty使用注意点"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#netty使用注意点"}},[t._v("#")]),t._v(" Netty使用注意点")]),t._v(" "),a("ul",[a("li",[t._v("如果 NettybossGroup 只监听一个端口，那 bossGroup 只需要 1 个 EventLoop 就可以了，多了纯属浪费")]),t._v(" "),a("li",[t._v("默认情况下，Netty 会创建“2*CPU 核数”个 EventLoop，由于网络连接与 EventLoop 有稳定的关系，所以事件处理器在处理网络事件的时候是不能有阻塞操作的，否则很容易导致请求大面积超时。如果实在无法避免使用阻塞操作，那可以通过线程池来异步处理")])]),t._v(" "),a("h2",{attrs:{id:"总结"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),a("blockquote",[a("p",[t._v("Netty 是一个款优秀的网络编程框架，性能非常好，为了实现高性能的目标，Netty 做了很多优化，例如优化了 ByteBuffer、支持零拷贝等等，和并发编程相关的就是它的线程模型了。Netty 的线程模型设计得很精巧，每个网络连接都关联到了一个线程上，这样做的好处是：对于一个网络连接，读写操作都是单线程执行的，从而避免了并发程序的各种问题")])])])}),[],!1,null,null,null);a.default=n.exports}}]);