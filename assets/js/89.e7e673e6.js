(window.webpackJsonp=window.webpackJsonp||[]).push([[89],{368:function(t,a,s){"use strict";s.r(a);var n=s(14),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"eventloop和线程模型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#eventloop和线程模型"}},[t._v("#")]),t._v(" EventLoop和线程模型")]),t._v(" "),a("h2",{attrs:{id:"线程模型概述"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#线程模型概述"}},[t._v("#")]),t._v(" 线程模型概述")]),t._v(" "),a("blockquote",[a("p",[t._v("线程模型指定了操作系统、框架、或应用程序的上下文的线程管理。线程模型确定了代码的执行方式。我们必须规避并发执行带来的副作用，所以理解所采用的并发模型的影响非常重要。")])]),t._v(" "),a("blockquote",[a("p",[t._v("多核心和多CPU的计算机已经很普遍，大多数现代应用程序都利用了复杂的多线程并发处理技术以有效的利用系统资源。java5引入了线程池")])]),t._v(" "),a("h3",{attrs:{id:"基本的线程池化模式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#基本的线程池化模式"}},[t._v("#")]),t._v(" 基本的线程池化模式")]),t._v(" "),a("ul",[a("li",[t._v("从池的线程空闲列表中选择一个Thread，指派它运行一个已经提交的任务runable")]),t._v(" "),a("li",[t._v("任务完成时，将它返回给列表，使其可以重用")])]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/netty/25.png",alt:"png"}}),t._v(" "),a("h3",{attrs:{id:"多线程处理是复杂的"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#多线程处理是复杂的"}},[t._v("#")]),t._v(" 多线程处理是复杂的")]),t._v(" "),a("blockquote",[a("p",[t._v("虽然池化和重用线程相对于简单地为每个任务都创建和销毁线程是一种进步，但是它并不能消除由上下文切换所带来的开销，其将随着线程数量的增加很快变得明显，并且在高负载下愈演愈烈。此外，仅仅由于应用程序的整体复杂性或者并发需求，在项目的生命周期内也可能会出现其他和线程相关的问题。\n简而言之，多线程处理是很复杂的")])]),t._v(" "),a("h2",{attrs:{id:"eventloop接口"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#eventloop接口"}},[t._v("#")]),t._v(" EventLoop接口")]),t._v(" "),a("h3",{attrs:{id:"事件循环"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#事件循环"}},[t._v("#")]),t._v(" 事件循环")]),t._v(" "),a("blockquote",[a("p",[t._v("运行任务来处理在连接的生命周期内发生的事件是任何网络框架的基本功能。相应的编程上的构造通常被称为事件循环-netty使用eventLoop适配事件循环")])]),t._v(" "),a("ul",[a("li",[t._v("事件循环的基本思想，事件循环中执行任务：")])]),t._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("while")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("terminated"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n　"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("List")]),a("span",{pre:!0,attrs:{class:"token generics"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Runnable")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" readyEvents "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("blockUntilEventsReady")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("　 "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//阻塞，直到有事件已经就绪可被运行")]),t._v("\n　 "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Runnable")]),t._v(" ev"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" readyEvents"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n　　　ev"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("run")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("　"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//循环遍历，并处理所有的事件")]),t._v("\n　 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h3",{attrs:{id:"eventloop-概述"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#eventloop-概述"}},[t._v("#")]),t._v(" EventLoop 概述")]),t._v(" "),a("h4",{attrs:{id:"eventloop是协同设计的一部分-使用了两个基本api-并发和网络编程"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#eventloop是协同设计的一部分-使用了两个基本api-并发和网络编程"}},[t._v("#")]),t._v(" eventloop是协同设计的一部分，使用了两个基本API：并发和网络编程")]),t._v(" "),a("ul",[a("li",[t._v("io.netty.util.concurrent 包构建在java.util.concurrent包上，以提供线程执行器")]),t._v(" "),a("li",[t._v("io.netty.channel 为了与channel的事件进行交互，扩展这些接口\n"),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/netty/26.png",alt:"png"}})])]),t._v(" "),a("h4",{attrs:{id:"eventloop-层次结构"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#eventloop-层次结构"}},[t._v("#")]),t._v(" EventLoop 层次结构")]),t._v(" "),a("ul",[a("li",[t._v("一个EventLoop由一个不变的Thread驱动，同时任务(runable/callable)可以直接提交给EventLoop实现")]),t._v(" "),a("li",[t._v("配置和可用核心不同，可能创建多个EventLoop实例用以优化资源的使用，单个EvnetLoop可能被指派服务多个Channel")]),t._v(" "),a("li",[t._v("继承ScheduleExecutorService的同时，定义parent()方法返回当前EventLoop实现的实例所属的EventLoopGroup的引用"),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[t._v("  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("interface")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("EventLoop")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("EventExecutor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("EventLoopGroup")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  　　"),a("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Override")]),t._v("\n  　　"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("EventLoopGroup")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("parent")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])])]),t._v(" "),a("p",[a("strong",[t._v("事件/任务的执行顺序")])]),t._v(" "),a("blockquote",[a("p",[t._v("事件和任务是以先进先出（FIFO）的顺序执行的。这样可以通过保证字节内容总是按正确的顺序被处理，消除潜在的数据损坏的可能性")])]),t._v(" "),a("h3",{attrs:{id:"netty4中的i-o和事件处理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#netty4中的i-o和事件处理"}},[t._v("#")]),t._v(" Netty4中的I/O和事件处理")]),t._v(" "),a("ul",[a("li",[t._v("IO操作触发的事件将流经ChannelPipeline，可以被ChannelHandler所拦截，并按需处理")]),t._v(" "),a("li",[t._v("事件的性质通常决定了它将被如何处理，可能数据传递到你的应用程序，可能进行逆向操作或其他一些操作")]),t._v(" "),a("li",[a("strong",[t._v("事件处理逻辑必须足够灵活和通用，Netty4中，所有的IO操作和事件都由分配给EventLoop的Thread处理")])])]),t._v(" "),a("h3",{attrs:{id:"netty3中的i-o操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#netty3中的i-o操作"}},[t._v("#")]),t._v(" Netty3中的I/O操作")]),t._v(" "),a("ul",[a("li",[t._v("入站事件由IO操作的线程处理，出站事件由调用线程处理")]),t._v(" "),a("li",[t._v("调用线程需要保证当Channel.write等操作在多个线程被调用时的线程安全问题")]),t._v(" "),a("li",[t._v("exceptionCause是入站事件，由出站事件引起的异常导致触发入站事件，入站事件由IO操作的线程处理，增加了上下文切换的开销")])]),t._v(" "),a("p",[a("strong",[t._v("同一个线程中处理某个给定的EventLoop中所产生的所有事件，提供了更加简单的执行体系，消除了在多个ChannelHandler中进行同步的需要(除了可能需要在多个Channel中共享的)")])]),t._v(" "),a("h2",{attrs:{id:"任务调度"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#任务调度"}},[t._v("#")]),t._v(" 任务调度")]),t._v(" "),a("h3",{attrs:{id:"jdk的任务调度api"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#jdk的任务调度api"}},[t._v("#")]),t._v(" JDK的任务调度API")]),t._v(" "),a("p",[t._v("java5之前使用Timer类，java5开始提供了线程池，可以通过线程池实现任务调度")]),t._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ScheduledExecutorService")]),t._v(" executor "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Executors")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("newScheduledThreadPool")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 创建一个其线程池具有10 个线程的ScheduledExecutorService")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ScheduledFuture")]),a("span",{pre:!0,attrs:{class:"token generics"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" future "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" executor"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("schedule")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n　　"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Runnable")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n　　"),a("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Override")]),t._v("\n　　"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("run")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n　　　　"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("System")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("out"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("println")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"60 seconds later"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//该任务要打印的消息")]),t._v("\n　　"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("60")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TimeUnit")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("SECONDS")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//调度任务在从现在开始的60 秒之后执行")]),t._v("\nexecutor"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("shutdown")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//一旦调度任务执行完成，就关闭ScheduledExecutorService 以释放资源")]),t._v("\n")])])]),a("h4",{attrs:{id:"局限性"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#局限性"}},[t._v("#")]),t._v(" 局限性")]),t._v(" "),a("ul",[a("li",[t._v("作为线程池管理的一部分，将会有额外的线程创建。")]),t._v(" "),a("li",[t._v("如果有大量任务被紧凑的调度，那么这将成为一个瓶颈")])]),t._v(" "),a("h3",{attrs:{id:"使用eventloop调度任务"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#使用eventloop调度任务"}},[t._v("#")]),t._v(" 使用EventLoop调度任务")]),t._v(" "),a("ul",[a("li",[t._v("Netty通过Channel的EventLoop实现任务调度解决了JDK任务调度的瓶颈")]),t._v(" "),a("li",[t._v("Netty的EventLoop扩展了ScheduleExecutorService，所以它提供了JDK实现可用的所有方法")]),t._v(" "),a("li",[t._v("要想取消或者检查（被调度任务的）执行状态，可以使用每个异步操作所返回的ScheduledFuture")])]),t._v(" "),a("p",[a("strong",[t._v("EventLoop调度任务的用法")])]),t._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Channel")]),t._v(" ch "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ScheduledFuture")]),a("span",{pre:!0,attrs:{class:"token generics"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" future "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ch"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("eventLoop")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("scheduleAtFixedRate")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//创建一个Runnable，以供调度稍后执行 ")]),t._v("\n　　"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Runnable")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n　　"),a("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Override")]),t._v("\n　　"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("run")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n　　　　"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("System")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("out"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("println")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Run every 60 seconds"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//这将一直运行，直到ScheduledFuture 被取消")]),t._v("\n　　"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("60")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("60")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("TimeUnit"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Seconds")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//调度在60 秒之后，并且以后每间隔60 秒运行")]),t._v("\nfuture"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("cancel")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//取消该任务，防止它再次运行")]),t._v("\n")])])]),a("h2",{attrs:{id:"实现细节"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#实现细节"}},[t._v("#")]),t._v(" 实现细节")]),t._v(" "),a("h3",{attrs:{id:"线程管理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#线程管理"}},[t._v("#")]),t._v(" 线程管理")]),t._v(" "),a("blockquote",[a("p",[t._v("Netty线程模型的卓越性能取决于对于当前执行的thread的身份的确定，确定它是否是分配给当前Channel以及它的EventLoop的那一个线程。"),a("strong",[t._v("EventLoop负责处理一个Channel的整个生命周期内的所有事件")])])]),t._v(" "),a("ul",[a("li",[t._v("每个EventLoop都有自己的任务队列，独立于其他EventLoop")]),t._v(" "),a("li",[t._v("EventLoop确定线程thread的调度细节\n"),a("blockquote",[a("p",[t._v("如果当前调用线程正是支撑EventLoop的线程，那么所提交的代码块将会被直接执行。否则，EventLoop将调度该任务以便稍后执行，并将它放入到内部队列中。当EventLoop下次处理它的事件时，它会执行队列中的那些任务/事件。这也就解释了任何的thread是如何与Channel直接交互而无需在ChannelHandler中进行额外的同步的。")])])])]),t._v(" "),a("p",[a("strong",[t._v("EventLoop调度任务的执行逻辑，也是Netty的线程模型的关键组成部分")]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/netty/27.png",alt:"png"}})]),t._v(" "),a("h3",{attrs:{id:"eventloop-线程的分配"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#eventloop-线程的分配"}},[t._v("#")]),t._v(" EventLoop/线程的分配")]),t._v(" "),a("h4",{attrs:{id:"异步io"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#异步io"}},[t._v("#")]),t._v(" 异步IO")]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/netty/28.png",alt:"png"}}),t._v(" "),a("blockquote",[a("p",[t._v("一个EventLoop对应一个线程，一个EventLoop可以分配给多个channel，一个channel只对应跟一个EventLoop。另外，需要注意的是，EventLoop的分配方式对ThreadLocal的使用的影响。因为一个EventLoop通常会被用于支撑多个Channel，所以对于所有相关联的Channel来说，ThreadLocal都将是一样的")])]),t._v(" "),a("h4",{attrs:{id:"同步io"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#同步io"}},[t._v("#")]),t._v(" 同步IO")]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/netty/29.png",alt:"png"}}),t._v(" "),a("blockquote",[a("p",[t._v("每个channel对应分配一个eventLoop，一个eventloop对应一个thread")])])])}),[],!1,null,null,null);a.default=e.exports}}]);