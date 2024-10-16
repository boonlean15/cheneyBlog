(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{314:function(a,t,r){"use strict";r.r(t);var e=r(14),v=Object(e.a)({},(function(){var a=this,t=a._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"java线程的生命周期"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#java线程的生命周期"}},[a._v("#")]),a._v(" java线程的生命周期")]),a._v(" "),t("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/java-thread-life/1.png",alt:"png"}}),a._v(" "),t("ul",[t("li",[a._v("对于有生命周期的事物，学好它的最佳方式是：掌握生命周期内各个节点的状态转换机制就可以了")])]),a._v(" "),t("h2",{attrs:{id:"通用的线程生命周期"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#通用的线程生命周期"}},[a._v("#")]),a._v(" 通用的线程生命周期")]),a._v(" "),t("h3",{attrs:{id:"五态模型"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#五态模型"}},[a._v("#")]),a._v(" 五态模型")]),a._v(" "),t("ul",[t("li",[a._v("初始状态 开发语言层面的创建线程，操作系统层面线程未创建")]),a._v(" "),t("li",[a._v("可运行状态 操作系统层面线程已经创建，可以分配cpu使用权，但还未分配")]),a._v(" "),t("li",[a._v("运行状态 操作系统分配给可运行状态的某一线程cpu使用权，线程执行")]),a._v(" "),t("li",[a._v("阻塞状态 线程等待条件或者调用阻塞api，进入休眠状态，休眠状态无cpu使用权")]),a._v(" "),t("li",[a._v("终止状态 线程执行完毕或者出现异常线程终止，线程生命周期结束")])]),a._v(" "),t("blockquote",[t("p",[a._v("不同的开发语言可能会对五态进行简化合并/细化，c语言合并了初始状态和可运行状态，java语言则把可运行状态和运行状态合并了，因为jvm不关心这两个状态，操作系统有用，jvm把线程调度交给了操作系统处理。java细化了阻塞状态")])]),a._v(" "),t("h2",{attrs:{id:"java中线程的生命周期"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#java中线程的生命周期"}},[a._v("#")]),a._v(" java中线程的生命周期")]),a._v(" "),t("p",[a._v("JVM层面并不关心操作系统调度相关的状态(操作系统等待cpu使用权和等待IO，操作系统是休眠状态，但JVM层面都归入了RUNNABLE状态)")]),a._v(" "),t("blockquote",[t("p",[a._v("平时所谓的 Java 在调用阻塞式 API 时，线程会阻塞，指的是操作系统线程的状态，并不是 Java 线程的状态")])]),a._v(" "),t("ul",[t("li",[a._v("NEW 初始化状态")]),a._v(" "),t("li",[a._v("RUNNABLE (可运行状态/运行状态)")]),a._v(" "),t("li",[a._v("BLOCKED 阻塞状态")]),a._v(" "),t("li",[a._v("WAITING 无时限等待状态")]),a._v(" "),t("li",[a._v("TIME_WAITING 有时限等待状态")]),a._v(" "),t("li",[a._v("TERMINATED 终止状态")])]),a._v(" "),t("blockquote",[t("p",[a._v("BLOCKED、WAITING、TIME_WAITING三种休眠状态对于操作系统都是休眠状态，无CPU使用权\n"),t("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/java-thread-life/2.png",alt:"png"}})])]),a._v(" "),t("h2",{attrs:{id:"java线程间的状态转换"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#java线程间的状态转换"}},[a._v("#")]),a._v(" java线程间的状态转换")]),a._v(" "),t("h3",{attrs:{id:"runnable-与-blocked-的状态转换"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#runnable-与-blocked-的状态转换"}},[a._v("#")]),a._v(" RUNNABLE 与 BLOCKED 的状态转换")]),a._v(" "),t("p",[a._v("只有一种情况，线程等待synchronized隐式锁时，线程从Runnable状态转换到blocked状态。获得synchronized隐式锁后，从blocked状态转换到runnable状态")]),a._v(" "),t("h3",{attrs:{id:"runnable-与-waiting-的状态转换"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#runnable-与-waiting-的状态转换"}},[a._v("#")]),a._v(" RUNNABLE 与 WAITING 的状态转换")]),a._v(" "),t("ul",[t("li",[a._v("进入synchronized代码块内，调用Object.wait()方法")]),a._v(" "),t("li",[a._v("调用Thread.join()方法")])]),a._v(" "),t("blockquote",[t("p",[a._v("调用A.join()方法的线程，会等待A执行，A执行完后线程继续执行")])]),a._v(" "),t("ul",[t("li",[a._v("调用LockSupport.park()方法")])]),a._v(" "),t("blockquote",[t("p",[a._v("java并发包的锁，是基于LockSupport实现的。调用LockSupport.park()方法进入到waiting状态，调用LockSupport.unpark()方法，从waiting转换到runnable状态")])]),a._v(" "),t("h3",{attrs:{id:"runnable-与-time-waiting-的状态转换"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#runnable-与-time-waiting-的状态转换"}},[a._v("#")]),a._v(" RUNNABLE 与 TIME_WAITING 的状态转换")]),a._v(" "),t("ul",[t("li",[a._v("进入synchronized代码块，调用Object.wait(time)")]),a._v(" "),t("li",[a._v("调用Thread.sleep(time)")]),a._v(" "),t("li",[a._v("调用Thread.join(time)")]),a._v(" "),t("li",[a._v("调用LockSupport.parkNanoc(time)")]),a._v(" "),t("li",[a._v("调用LockSupport.parkUnit(time)")])]),a._v(" "),t("blockquote",[t("p",[a._v("唯一的区别就是多了time参数，当等待到某个时间时，线程会转换状态到Runnable，等待获取cpu执行权")])]),a._v(" "),t("h3",{attrs:{id:"new-与-runnable-的状态转换"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#new-与-runnable-的状态转换"}},[a._v("#")]),a._v(" NEW 与 RUNNABLE 的状态转换")]),a._v(" "),t("ul",[t("li",[a._v("java线程刚刚创建的时候，是NEW状态(new Thread、继承Runnable接口)")]),a._v(" "),t("li",[a._v("当调用线程的start()方法时，线程从NEW状态转换到RUNNABLE状态")])]),a._v(" "),t("h3",{attrs:{id:"runnable-与-terminated-的状态转换"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#runnable-与-terminated-的状态转换"}},[a._v("#")]),a._v(" RUNNABLE 与 TERMINATED 的状态转换")]),a._v(" "),t("p",[a._v("runnable到terminated状态的转换")]),a._v(" "),t("ul",[t("li",[a._v("线程的run方法执行完毕")]),a._v(" "),t("li",[a._v("线程执行run方法时抛出异常")])]),a._v(" "),t("p",[a._v("想要中断线程，该怎么办")]),a._v(" "),t("h4",{attrs:{id:"stop方法和interrupt方法的区别"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#stop方法和interrupt方法的区别"}},[a._v("#")]),a._v(" stop方法和interrupt方法的区别")]),a._v(" "),t("ul",[t("li",[a._v("stop方法会立刻停止线程，不给线程操作机会，如果线程还未释放锁，stop会导致其他线程永远无法获得锁，resume和suspend方法也同样被废弃了")]),a._v(" "),t("li",[a._v("interrupt方法是通知线程")])]),a._v(" "),t("h4",{attrs:{id:"被interrupt的线程是怎么收到通知的"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#被interrupt的线程是怎么收到通知的"}},[a._v("#")]),a._v(" 被interrupt的线程是怎么收到通知的")]),a._v(" "),t("ul",[t("li",[a._v("抛出异常\n"),t("ul",[t("li",[a._v("处于Waiting、time_waiting的状态的线程，如果被调用interrupt方法，线程会返回到runnable状态，同时线程会触发interrupted Exception")])]),a._v(" "),t("blockquote",[t("p",[a._v("转换到waiting、time_waiting状态的线程，都是类似调用了wait，sleep，join方法，这几个方法都定义都抛出了interruptedException")])]),a._v(" "),t("ul",[t("li",[a._v("当线程处于runnable状态时，并阻塞在java.nio.channel.interruptibleChannel上时，调用interrupt方法，线程会触发java.nio.channels.ClosedByInterruptException 这个异常")]),a._v(" "),t("li",[a._v("当线程处于runnable状态时，并阻塞在java.nio.channel.Selector上时，调用interrupt方法，线程 A 的 java.nio.channels.Selector 会立即返回。")])])]),a._v(" "),t("li",[a._v("主动检测\n"),t("ul",[t("li",[a._v("线程处于runnable状态时，并没有阻塞在某个I/O操作时，比如线程在执行圆周率计算，此时线程A被调用了interrupt,此时线程可以通过调用isInterrupted方法，主动检测是否被中断")])])])]),a._v(" "),t("h2",{attrs:{id:"总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[a._v("#")]),a._v(" 总结")]),a._v(" "),t("h3",{attrs:{id:"线程状态重要性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#线程状态重要性"}},[a._v("#")]),a._v(" 线程状态重要性")]),a._v(" "),t("p",[a._v("并发程序难调试，出现死锁、活锁、饥饿时，理解线程的状态和生命周期对分析bug有非常大的帮助")]),a._v(" "),t("h3",{attrs:{id:"jstack、java-visualvm-线程栈信息导出"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#jstack、java-visualvm-线程栈信息导出"}},[a._v("#")]),a._v(" jstack、java visualVM 线程栈信息导出")]),a._v(" "),t("p",[a._v("完整的线程栈信息不仅包括线程的当前状态、调用栈，还包括了锁的信息。通过线程栈信息导出，可以方便的分析并发bug问题")])])}),[],!1,null,null,null);t.default=v.exports}}]);