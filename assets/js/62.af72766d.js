(window.webpackJsonp=window.webpackJsonp||[]).push([[62],{344:function(a,t,s){"use strict";s.r(t);var n=s(14),e=Object(n.a)({},(function(){var a=this,t=a._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"threadlocal-线程本地存储"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#threadlocal-线程本地存储"}},[a._v("#")]),a._v(" ThreadLocal 线程本地存储")]),a._v(" "),t("blockquote",[t("p",[a._v("每个线程都拥有自己的变量，彼此之间不共享，也就没有并发问题")])]),a._v(" "),t("ul",[t("li",[a._v("线程封闭，通过局部变量可以避免共享")]),a._v(" "),t("li",[a._v("Immutability和Cow突破的是写操作")]),a._v(" "),t("li",[a._v("ThreadLocal突破的是共享变量")])]),a._v(" "),t("h2",{attrs:{id:"threadlocal使用方法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#threadlocal使用方法"}},[a._v("#")]),a._v(" ThreadLocal使用方法")]),a._v(" "),t("ul",[t("li",[a._v("一个线程多次调用get方法，返回值相同")]),a._v(" "),t("li",[a._v("不同线程调用get方法，返回值不同")])]),a._v(" "),t("div",{staticClass:"language-java extra-class"},[t("pre",{pre:!0,attrs:{class:"language-java"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("/**\n * ThreadId 会为每个线程分配一个唯一的线程 Id\n */")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("static")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("class")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ThreadId")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("static")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("final")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("AtomicLong")]),a._v(" \n  nextId"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("new")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("AtomicLong")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("//定义ThreadLocal变量")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("static")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("final")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ThreadLocal")]),t("span",{pre:!0,attrs:{class:"token generics"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("<")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Long")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(">")])]),a._v(" \n  tl"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ThreadLocal")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("withInitial")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("->")]),a._v("nextId"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("getAndIncrement")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("//此方法会为每个线程分配一个唯一的Id")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("static")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("long")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("get")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("return")]),a._v(" tl"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("get")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("/**\n *  SafeDateFormat\n */")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("static")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("class")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("SafeDateFormat")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("//定义ThreadLocal变量")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("static")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("final")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ThreadLocal")]),t("span",{pre:!0,attrs:{class:"token generics"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("<")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("DateFormat")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(">")])]),a._v("\n  tl"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ThreadLocal")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("withInitial")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("->")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("new")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("SimpleDateFormat")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("\n      "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"yyyy-MM-dd HH:mm:ss"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n      \n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("static")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("DateFormat")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("get")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("return")]),a._v(" tl"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("get")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("//不同线程执行下面代码")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("//返回的df是不同的")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("DateFormat")]),a._v(" df "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v("\n  "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("SafeDateFormat")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("get")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("；\n")])])]),t("h2",{attrs:{id:"threadlocal工作原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#threadlocal工作原理"}},[a._v("#")]),a._v(" ThreadLocal工作原理")]),a._v(" "),t("h3",{attrs:{id:"自己实现的思路"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#自己实现的思路"}},[a._v("#")]),a._v(" 自己实现的思路")]),a._v(" "),t("div",{staticClass:"language-java extra-class"},[t("pre",{pre:!0,attrs:{class:"language-java"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("public")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("class")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("MyThreadLocal")]),t("span",{pre:!0,attrs:{class:"token generics"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("<")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("T")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(">")])]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Map")]),t("span",{pre:!0,attrs:{class:"token generics"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("<")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Thread")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("T")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(">")])]),a._v(" locals "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("new")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ConcurrentHashMap")]),t("span",{pre:!0,attrs:{class:"token generics"}},[t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("<")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(">")])]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("T")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("get")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("T")]),a._v(" t "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" locals"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("get")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Thread")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("currentThread")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("return")]),a._v(" t"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("void")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("set")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("T")]),a._v(" t"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        locals"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("put")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Thread")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("currentThread")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("t"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])]),t("h3",{attrs:{id:"java-的threadlocal实现"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#java-的threadlocal实现"}},[a._v("#")]),a._v(" java 的ThreadLocal实现")]),a._v(" "),t("ul",[t("li",[a._v("Thread持有ThreadLocalMap")]),a._v(" "),t("li",[a._v("ThreadLocal只是作为代理工具类")]),a._v(" "),t("li",[a._v("ThreadLocalMap持有ThreadLocal和Object value的key-value")]),a._v(" "),t("li",[a._v("其中ThreadLocalMap的Entry对ThreadLocal是弱引用，Entry内部持有value是强引用")])]),a._v(" "),t("h2",{attrs:{id:"threadlocal与内存泄露"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#threadlocal与内存泄露"}},[a._v("#")]),a._v(" ThreadLocal与内存泄露")]),a._v(" "),t("ul",[t("li",[a._v("自实现的ThreadLocal容易导致内存泄漏\n"),t("blockquote",[t("p",[a._v("原因是ThreadLocal持有Thread，而ThreadLocal的存活时间比Thread要持久的多，如果ThreadLocal不回收，那么Thread就不能回收，容易出现内存泄漏")])])]),a._v(" "),t("li",[a._v("java实现的ThreadLocal结合线程池使用时，容易出现内存泄漏\n"),t("blockquote",[t("p",[a._v("原因：1.线程池的Thread存活时间特别长，则ThreadLocalMap一般不会被回收 2.Entry对ThreadLocal是弱引用，ThreadLocal结束自己的生命周期是可以回收的\n但是")])])])]),a._v(" "),t("div",{staticClass:"language-JAVA extra-class"},[t("pre",{pre:!0,attrs:{class:"language-java"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("/**\n * 手动清理实现value回收，避免内存泄漏\n */")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ExecutorService")]),a._v(" es "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Executors")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("newCachedThreadPool")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ThreadLocal")]),a._v(" tl "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ThreadLocal")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("withInitial")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("->")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("new")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("AtomicInteger")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\nex"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("execute")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("->")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n     "),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("//ThreadLocal增加变量")]),a._v("\n    tl"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("set")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("new")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Object")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("try")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 省略业务逻辑代码")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("finally")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("//手动清理ThreadLocal")]),a._v("\n        tl"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("remove")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n")])])]),t("h2",{attrs:{id:"inheritablethreadlocal与继承性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#inheritablethreadlocal与继承性"}},[a._v("#")]),a._v(" InheritableThreadLocal与继承性")]),a._v(" "),t("ul",[t("li",[a._v("通过ThreadLocal创建的变量V，如果线程Thread创建子线程，子线程不能使用Thread父线程的变量V")]),a._v(" "),t("li",[a._v("InheritableThreadLocal具有继承性，使用方式和ThreadLocal一样，是ThreadLocal的子类")]),a._v(" "),t("li",[a._v("不建议使用InheritableThreadLocal，因为线程是频繁回收的，容易导致继承逻辑错乱而业务出错，伤害是致命的")])]),a._v(" "),t("h2",{attrs:{id:"总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[a._v("#")]),a._v(" 总结")]),a._v(" "),t("h3",{attrs:{id:"在并发场景使用一个线程不安全的类"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#在并发场景使用一个线程不安全的类"}},[a._v("#")]),a._v(" 在并发场景使用一个线程不安全的类")]),a._v(" "),t("ul",[t("li",[a._v("在局部变量中使用，对象频繁创建")]),a._v(" "),t("li",[a._v("在线程本地存储中ThreadLocal中使用")]),a._v(" "),t("li",[a._v("线程池中使用 ThreadLocal 仍可能导致内存泄漏，所以使用 ThreadLocal 还是需要你打起精神，足够谨慎，记得回收资源tl.remove();")])])])}),[],!1,null,null,null);t.default=e.exports}}]);