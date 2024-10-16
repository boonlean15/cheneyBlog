(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{317:function(t,a,s){"use strict";s.r(a);var n=s(14),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"管程"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#管程"}},[t._v("#")]),t._v(" 管程")]),t._v(" "),a("h2",{attrs:{id:"概述"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#概述"}},[t._v("#")]),t._v(" 概述")]),t._v(" "),a("ul",[a("li",[t._v("概念")])]),t._v(" "),a("blockquote",[a("p",[t._v("管程：管理共享变量以及操作共享变量的过程，让他们支持并发")])]),t._v(" "),a("blockquote",[a("p",[t._v("java领域：管理类的成员变量和成员方法，让类是线程安全的")]),t._v(" "),a("blockquote",[a("p",[t._v("java1.5之前仅仅提供了synchronized、wait、notify、notifyAll")])])]),t._v(" "),a("ul",[a("li",[t._v("信号量等价于管程")])]),t._v(" "),a("blockquote",[a("p",[t._v("管程可以实现信号量，信号量可以实现管程，管程更容易使用，java因此采用它")])]),t._v(" "),a("h2",{attrs:{id:"管程解决互斥的方式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#管程解决互斥的方式"}},[t._v("#")]),t._v(" 管程解决互斥的方式")]),t._v(" "),a("ul",[a("li",[t._v("例子：实现一个线程安全的队列")])]),t._v(" "),a("blockquote",[a("p",[t._v("实现方式: 把共享变量和共享变量的操作过程封装起来。提供入队和出队的方法")])]),t._v(" "),a("img",{attrs:{width:"600",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/monitor/1.png",alt:"png"}}),t._v(" "),a("blockquote",[a("p",[t._v("线程 A 和线程 B 如果想访问共享变量 queue，只能通过调用管程提供的 enq()、deq() 方法来实现；enq()、deq() 保证互斥性，只允许一个线程进入管程。")])]),t._v(" "),a("h2",{attrs:{id:"管程解决同步的方式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#管程解决同步的方式"}},[t._v("#")]),t._v(" 管程解决同步的方式")]),t._v(" "),a("ul",[a("li",[t._v("MESA模型示意图\n"),a("img",{attrs:{width:"600",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/monitor/2.png",alt:"png"}})]),t._v(" "),a("li",[t._v("1.共享变量和操作共享变量的过程被封装起来，同一时刻，只允许一个线程进入管程，类似挂号等待分诊")]),t._v(" "),a("li",[t._v("2.每个条件变量对应有一个等待队列(条件变量 A 和条件变量 B 分别都有自己的等待队列)，当线程条件不满足时，wait等待。类似需要检查报告，病人去做检查")]),t._v(" "),a("li",[t._v("3.当条件满足时，notify、notifyAll、唤醒通知线程，线程重新进入要进入管程区域的等待队列。类似病人检查完，需要重新分诊")]),t._v(" "),a("li",[t._v("4.当允许进入管程区域时，此时再次跟医生看病")])]),t._v(" "),a("blockquote",[a("p",[t._v("阻塞队列和等待队列是不同的")])]),t._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("BlockedQueue")]),a("span",{pre:!0,attrs:{class:"token generics"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("T")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Lock")]),t._v(" lock "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ReentrantLock")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 条件变量：队列不满  ")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Condition")]),t._v(" notFull "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("  lock"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("newCondition")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 条件变量：队列不空  ")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Condition")]),t._v(" notEmpty "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("  lock"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("newCondition")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 入队")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("enq")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("T")]),t._v(" x"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    lock"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("lock")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("try")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("while")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("队列已满"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 等待队列不满 ")]),t._v("\n        notFull"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("await")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("  \n      "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 省略入队操作...")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//入队后,通知可出队")]),t._v("\n      notEmpty"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("signal")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("finally")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      lock"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("unlock")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 出队")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("deq")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    lock"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("lock")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("try")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("while")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("队列已空"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 等待队列不空")]),t._v("\n        notEmpty"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("await")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 省略出队操作...")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//出队后，通知可入队")]),t._v("\n      notFull"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("signal")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("finally")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      lock"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("unlock")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("  \n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("blockquote",[a("p",[t._v("await等价wait，single等价notify，singleAll等价notifyAll")])]),t._v(" "),a("h2",{attrs:{id:"hasen、hoare、mesa模型类比"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#hasen、hoare、mesa模型类比"}},[t._v("#")]),t._v(" Hasen、Hoare、Mesa模型类比")]),t._v(" "),a("ul",[a("li",[t._v("Hasen模型，当条件满足时，通知的代码需要放在最后，即当线程A通知线程B时，线程A已经执行结束")]),t._v(" "),a("li",[t._v("Hoare模型，线程A通知线程B后，立刻阻塞，然后等待线程B执行结束，线程B执行结束后通知线程A，线程A再次执行")]),t._v(" "),a("li",[t._v("Mesa模型，线程A通知线程B后线程A还会继续执行，线程B进入等待进入管程区域的队列。副作用，线程A再次进入管程区域时，可能条件是曾经满足。因此有wait范式代码")])]),t._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("while")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("条件不满足"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("wait")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h2",{attrs:{id:"notify何时使用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#notify何时使用"}},[t._v("#")]),t._v(" notify何时使用")]),t._v(" "),a("ul",[a("li",[t._v("所有线程的等待条件都相同时")]),t._v(" "),a("li",[t._v("被唤醒后，所有线程执行相同的操作")]),t._v(" "),a("li",[t._v("只需要唤醒一个线程")])]),t._v(" "),a("h2",{attrs:{id:"总结"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),a("p",[t._v("管程是一个解决并发问题的万能钥匙，理论上所有的并发问题都可以用管程解决。java语言内置管程对mesa模型进行精简")]),t._v(" "),a("img",{attrs:{width:"600",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/monitor/3.png",alt:"png"}}),t._v(" "),a("p",[t._v("Mesa模型里，wait方法增加了参数，代表当等待足够时间后，去到等待进入管程区域的队列。避免条件不满足时，傻等")])])}),[],!1,null,null,null);a.default=e.exports}}]);