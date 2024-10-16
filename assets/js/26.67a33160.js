(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{307:function(t,a,s){"use strict";s.r(a);var n=s(14),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"并发编程bug源头-可见性、原子性、有序性"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#并发编程bug源头-可见性、原子性、有序性"}},[t._v("#")]),t._v(" 并发编程bug源头 - 可见性、原子性、有序性")]),t._v(" "),a("p",[t._v("CPU、内存、IO设备之间的一个核心矛盾，三者之间的速度，CPU天上一天，内存设备地上一年，IO设备更甚(内存天上一天，IO设备地上十年)")]),t._v(" "),a("p",[t._v("计算机体系结构，操作系统，编译程序都为三者的速度差异做出了贡献：")]),t._v(" "),a("ul",[a("li",[t._v("增加了CPU缓存以均衡和内存之间的速度差异")]),t._v(" "),a("li",[t._v("操作系统增加了进程和线程，以分时复用CPU，进而均衡CPU和IO设备之间的速度差异")]),t._v(" "),a("li",[t._v("编译程序优化指令执行次序，以更合理的利用CPU缓存")])]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/studyjava.jpg",alt:"png"}}),t._v(" "),a("h2",{attrs:{id:"缓存导致的可见性问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#缓存导致的可见性问题"}},[t._v("#")]),t._v(" 缓存导致的可见性问题")]),t._v(" "),a("h3",{attrs:{id:"可见性"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#可见性"}},[t._v("#")]),t._v(" 可见性")]),t._v(" "),a("p",[a("strong",[t._v("可见性")]),t._v("一个线程对共享变量的操作，另一个线程可以立即看到，称为可见性")]),t._v(" "),a("h3",{attrs:{id:"单核、多核cpu操作变量情况"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#单核、多核cpu操作变量情况"}},[t._v("#")]),t._v(" 单核、多核CPU操作变量情况")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("单核\n"),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/concurrentbugsource1.jpg",alt:"png"}})])]),t._v(" "),a("li",[a("p",[t._v("多核\n"),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/concurrentbugsource2.jpg",alt:"png"}})])])]),t._v(" "),a("blockquote",[a("p",[t._v("我们假设线程 A 和线程 B 同时开始执行，那么第一次都会将 count=0 读到各自的 CPU 缓存里，执行完 count+=1 之后，各自 CPU 缓存里的值都是 1，同时写入内存后，我们会发现内存中是 1，而不是我们期望的 2。"),a("strong",[t._v("表明，每一次操作，都会把结果写回内存中，但写回的时机不确定")])])]),t._v(" "),a("h2",{attrs:{id:"线程切换带来的原子性问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#线程切换带来的原子性问题"}},[t._v("#")]),t._v(" 线程切换带来的原子性问题")]),t._v(" "),a("h3",{attrs:{id:"原子性"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#原子性"}},[t._v("#")]),t._v(" 原子性")]),t._v(" "),a("p",[a("strong",[t._v("原子性")]),t._v("我们把一个或者多个操作在 CPU 执行的过程中不被中断的特性称为原子性")]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/concurrentbugsource3.jpg",alt:"png"}}),t._v(" "),a("h3",{attrs:{id:"相关概念"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#相关概念"}},[t._v("#")]),t._v(" 相关概念")]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("时间片")])])]),t._v(" "),a("blockquote",[a("p",[t._v("操作系统允许某个进程执行一小段时间，例如 50 毫秒，过了 50 毫秒操作系统就会重新选择一个进程来执行（我们称为“任务切换”），这个 50 毫秒称为“时间片”。")])]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("寄存器")])])]),t._v(" "),a("blockquote",[a("p",[t._v("cpu计算结果存储的地方")])]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("缓存")])])]),t._v(" "),a("blockquote",[a("p",[t._v("为了协调内存速率加入的中间存储单元、CPU缓存使用的硬件和内存不同，读写速度更快但是成本更高。")])]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("线程的上下文")])])]),t._v(" "),a("blockquote",[a("p",[t._v("每个线程都有自己的一组CPU寄存器，寄存器是共享的，线程上下文切换时，会把线程对应的寄存器内容存储到线程对应的工作内存中，下次切换回来时，从工作内存中加载到寄存器。这组寄存器可称之为线程的上下文，该上下文反映了线程上次运行该线程的CPU寄存器的状态。"),a("strong",[t._v("jvm 程序计数器")])])]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("硬件原子性")])])]),t._v(" "),a("blockquote",[a("p",[t._v("硬件支持 & 多核原子操作：软件级别的原子操作是依赖于硬件支持的。 在x86体系中，CPU提供了HLOCK pin引线，允许CPU在执行某一个指令(仅仅是一个指令)时拉低HLOCK pin引线的电位，直到这个指令执行完毕才放开。从而锁住了总线，如此在同一总线的CPU就暂时无法通过总线访问内存了，这样就保证了多核处理器的原子性。")])]),t._v(" "),a("h3",{attrs:{id:"cpu和io磁盘情况区别"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cpu和io磁盘情况区别"}},[t._v("#")]),t._v(" cpu和IO磁盘情况区别")]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("cpu任务切换")])])]),t._v(" "),a("blockquote",[a("p",[t._v("当持有CPU的进程进行IO读取的时候，会把当前CPU的使用权让出去（因为这个时候需要把IO读取到的内容加载到内存，CPU其实是在休眠状态），待内容读取进内存，操作系统再把休眠的进程唤醒，唤醒了之后再申请获取CPU的使用权，这个进程就得以继续工作。")]),t._v(" "),a("p",[t._v("早期操作系统，任务切换指进程切换(进程不共享内存空间、线程共享进程的内存空间)、现代操作系统，任务切换指线程切换，最新概念：协程")])]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("磁盘驱动")])])]),t._v(" "),a("blockquote",[a("p",[a("strong",[t._v("磁盘驱动")]),t._v("不会像CPU一样切换进程任务，而是执行完一个之后再执行另一个，轮着来。"),a("strong",[t._v("队列和堆栈是操作系统里面使用率比较高的数据结构")])])]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("高级语言里一条语句往往需要多条 CPU 指令完成")])])]),t._v(" "),a("blockquote",[a("p",[t._v("例如：count += 1;需要3条指令。1:将count加载到寄存器 2：在寄存器中将count + 1 3：将结果写入内存")])]),t._v(" "),a("ul",[a("li",[a("strong",[t._v("任务切换发生时机")])])]),t._v(" "),a("blockquote",[a("p",[t._v("操作系统做任务切换，可以发生在任何一条 CPU 指令执行完，是的，是 CPU 指令，而不是高级语言里的一条语句")])]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/4.jpg",alt:"png"}}),t._v(" "),a("h2",{attrs:{id:"编译优化带来的有序性问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#编译优化带来的有序性问题"}},[t._v("#")]),t._v(" 编译优化带来的有序性问题")]),t._v(" "),a("blockquote",[a("p",[t._v("编译器和解释器会优化我们写的代码的执行顺序，举例：比如 Single sin = new Single();直观的我们以为是1.分配内存 2.new 对象 3.赋值，而实际编译器优化后是：1.分配内存 2.赋值内存地址给变量 3.new 对象")])]),t._v(" "),a("h3",{attrs:{id:"doulbe-check的并发问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#doulbe-check的并发问题"}},[t._v("#")]),t._v(" doulbe check的并发问题")]),t._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Singleton")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Singleton")]),t._v(" instance"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Singleton")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getInstance")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("instance "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("synchronized")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Singleton")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("instance "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n          instance "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Singleton")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" instance"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("ul",[a("li",[t._v("如果线程A、B同时启动，然后在获取锁时A拿到，B阻塞，那A可以正常创建单例对象")]),t._v(" "),a("li",[t._v("如果A先启动，然后获取锁，在new Singleton时，执行到2.赋值内存地址给变量，此时cpu线程切换，B在第一步判断instance == null时，不为null，但实际并未new对象，此时会出现null空指针异常")])]),t._v(" "),a("h2",{attrs:{id:"总结"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),a("blockquote",[a("p",[t._v("要写好并发程序，首先要知道并发程序的问题在哪里，只有确定了“靶子”，才有可能把问题解决，毕竟所有的解决方案都是针对问题的。深究的话，无外乎就是直觉欺骗了我们,"),a("strong",[t._v("只要我们能够深刻理解可见性、原子性、有序性在并发场景下的原理，很多并发 Bug 都是可以理解、可以诊断的")])])]),t._v(" "),a("h2",{attrs:{id:"知识点总结"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#知识点总结"}},[t._v("#")]),t._v(" 知识点总结")]),t._v(" "),a("ul",[a("li",[t._v("可见性问题")])]),t._v(" "),a("blockquote",[a("p",[t._v("对于可见性那个例子我们先看下定义:\n可见性:一个线程对共享变量的修改，另外一个线程能够立刻看到")])]),t._v(" "),a("blockquote",[a("p",[t._v("并发问题往往都是综合证，这里即使是单核CPU，只要出现线程切换就会有原子性问题。")])]),t._v(" "),a("ul",[a("li",[t._v("CPU缓存刷新到内存的时机")])]),t._v(" "),a("blockquote",[a("p",[t._v("cpu将缓存写入内存的时机是不确定的。除非你调用cpu相关指令强刷")])]),t._v(" "),a("ul",[a("li",[t._v("synchronized")])]),t._v(" "),a("blockquote",[a("p",[t._v("线程在synchronized块中，发生线程切换，锁是不会释放的")])]),t._v(" "),a("ul",[a("li",[t._v("指令优化")])]),t._v(" "),a("blockquote",[a("p",[t._v("除了编译优化,有一部分可以通过看汇编代码来看，但是CPU和解释器在运行期也会做一部分优化，所以很多时候都是看不到的，也很难重现。")])]),t._v(" "),a("ul",[a("li",[t._v("IO操作")])]),t._v(" "),a("blockquote",[a("p",[t._v("io操作不占用cpu，读文件，是设备驱动干的事，cpu只管发命令。发完命令，就可以干别的事情了。")])]),t._v(" "),a("ul",[a("li",[t._v("寄存器切换")])]),t._v(" "),a("blockquote",[a("p",[t._v("寄存器是共用的，A线程切换到B线程的时候，寄存器会把操作A的相关内容会保存到(线程的工作内存)内存里，切换回来的时候，会从(线程的工作内存)内存把内容加载到寄存器。可以理解为每个线程有自己的寄存器")])]),t._v(" "),a("ul",[a("li",[t._v("JMM模型和物理内存、缓存等关系")])]),t._v(" "),a("blockquote",[a("p",[t._v("内存、cpu缓存是物理存在，jvm内存是软件存在的。\n关于线程的工作内存和寄存器、cpu缓存的关系 大家可以参考这篇文章\n参考自："),a("a",{attrs:{href:"https://blog.csdn.net/javazejian/article/details/72772461",target:"_blank",rel:"noopener noreferrer"}},[t._v("全面理解Java内存模型(JMM)及volatile关键字"),a("OutboundLink")],1)])])])}),[],!1,null,null,null);a.default=e.exports}}]);