(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{327:function(t,a,s){"use strict";s.r(a);var n=s(14),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"并发容器"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#并发容器"}},[t._v("#")]),t._v(" 并发容器")]),t._v(" "),a("p",[t._v("java1.5之前提供的同步容器性能较差，1.5之后提供了更多的同步容器和提升了性能")]),t._v(" "),a("h2",{attrs:{id:"同步容器和注意事项"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#同步容器和注意事项"}},[t._v("#")]),t._v(" 同步容器和注意事项")]),t._v(" "),a("p",[t._v("java提供的容器主要有四大类，List、Map、Set、Queue")]),t._v(" "),a("h3",{attrs:{id:"实现线程安全的容器"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#实现线程安全的容器"}},[t._v("#")]),t._v(" 实现线程安全的容器")]),t._v(" "),a("ul",[a("li",[t._v("把ArrayList变成线程安全的容器SafeArrayList\n"),a("blockquote",[a("p",[t._v("通过封装ArrayList到内部，然后控制访问路径实现线程安全")])])]),t._v(" "),a("li",[t._v("示例")])]),t._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("SafeArrayList")]),a("span",{pre:!0,attrs:{class:"token generics"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("T")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//封装ArrayList")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("List")]),a("span",{pre:!0,attrs:{class:"token generics"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("T")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" c "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ArrayList")]),a("span",{pre:!0,attrs:{class:"token generics"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//控制访问路径")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("synchronized")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("T")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" idx"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" c"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("idx"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("synchronized")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("add")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" idx"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("T")]),t._v(" t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    c"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("add")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("idx"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("synchronized")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("boolean")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("addIfNotExist")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("T")]),t._v(" t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("c"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("contains")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      c"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("add")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("blockquote",[a("p",[t._v("其中addIfNotExist需要注意竞态条件，此处把synchronized关键字放在了方法上实现原子性")])]),t._v(" "),a("ul",[a("li",[t._v("java的Collections工具类同样的使用包装方式，实现了一套完备的线程安全包装类")])]),t._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("List")]),t._v(" list "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Collections")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("synchronizedList")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ArrayList")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Set")]),t._v(" set "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Collections")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("synchronizedSet")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HashSet")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Map")]),t._v(" map "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Collections")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("synchronizedMap")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HashMap")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("blockquote",[a("p",[t._v("当存在组合操作时，需要注意竞态条件，例如容器遍历时")])]),t._v(" "),a("ul",[a("li",[t._v("Collections内部的synchronized锁定的是this对象，所以容器遍历时，锁住list是线程安全的\n"),a("blockquote",[a("p",[t._v("Java 提供的同步容器还有 Vector、Stack 和 Hashtable，这三个容器不是基于包装类实现的，但同样是基于 synchronized 实现的，对这三个容器的遍历，同样要加锁保证互斥。")])])])]),t._v(" "),a("div",{staticClass:"language-java extra-class"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("List")]),t._v(" list "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Collections")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("synchronizedList")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ArrayList")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Iterator")]),t._v(" i "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" list"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("iterator")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("while")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("hasNext")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("foo")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//线程安全")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("List")]),t._v(" list "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Collections")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("synchronizedList")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ArrayList")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("synchronized")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("list"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Iterator")]),t._v(" i "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" list"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("iterator")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("while")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("hasNext")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("foo")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h2",{attrs:{id:"并发容器和注意事项"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#并发容器和注意事项"}},[t._v("#")]),t._v(" 并发容器和注意事项")]),t._v(" "),a("p",[t._v("1.5之前的线程安全的容器，一般称为同步容器，因为是synchronized实现的，性能相对较差。1.5之后提供的线程安全的容器，称为并发容器，性能相对较好")]),t._v(" "),a("ul",[a("li",[t._v("并发容器主要也是四大类：List、Set、Map、Queue\n"),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/1.png",alt:"png"}})])]),t._v(" "),a("h3",{attrs:{id:"list-copyonwritearraylist"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#list-copyonwritearraylist"}},[t._v("#")]),t._v(" List CopyOnWriteArrayList")]),t._v(" "),a("p",[t._v("CopyOnWriteArrayList内部维护了一个数组array，迭代器Iterator遍历的就是array\n"),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/2.png",alt:"png"}}),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/3.png",alt:"png"}})]),t._v(" "),a("ul",[a("li",[t._v("读操作完全无锁")]),t._v(" "),a("li",[t._v("如果有写操作，则复制一份array进行写操作")]),t._v(" "),a("li",[t._v("写操作执行完毕后，再把array指向这个新数组")])]),t._v(" "),a("h4",{attrs:{id:"copyonwritearraylist的坑"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#copyonwritearraylist的坑"}},[t._v("#")]),t._v(" CopyOnWriteArrayList的坑")]),t._v(" "),a("ul",[a("li",[t._v("CopyOnWriteArrayList 仅适用于写操作非常少的场景，而且能够容忍读写的短暂不一致，写入的新元素并不能立刻被遍历到。")]),t._v(" "),a("li",[t._v("CopyOnWriteArrayList 迭代器是只读的，不支持增删改。因为迭代器遍历的仅仅是一个快照，而对快照进行增删改是没有意义的。")])]),t._v(" "),a("h3",{attrs:{id:"map-concurrenthashmap-和-concurrentskiplistmap"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#map-concurrenthashmap-和-concurrentskiplistmap"}},[t._v("#")]),t._v(" Map ConcurrentHashMap 和 ConcurrentSkipListMap")]),t._v(" "),a("h4",{attrs:{id:"主要区别"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#主要区别"}},[t._v("#")]),t._v(" 主要区别")]),t._v(" "),a("ul",[a("li",[t._v("ConcurrentHashMap 的 key 是无序的")]),t._v(" "),a("li",[t._v("ConcurrentSkipListMap 的 key 是有序的")])]),t._v(" "),a("h4",{attrs:{id:"相同点"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#相同点"}},[t._v("#")]),t._v(" 相同点")]),t._v(" "),a("ul",[a("li",[t._v("它们的 key 和 value 都不能为空，否则会抛出NullPointerException这个运行时异常\n"),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/4.png",alt:"png"}})])]),t._v(" "),a("h4",{attrs:{id:"concurrenthashmap-并发底层实现-1-8"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#concurrenthashmap-并发底层实现-1-8"}},[t._v("#")]),t._v(" ConcurrentHashMap 并发底层实现 (1.8)")]),t._v(" "),a("ul",[a("li",[t._v("底层数据结构：Node数组 + 红黑树\n"),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/7.png",alt:"png"}})]),t._v(" "),a("li",[t._v("保证线程安全的方式：乐观锁 + Sysnchronized")]),t._v(" "),a("li",[t._v("读操作是无锁：Node 的 val 和 next 使用 volatile 修饰，读写线程对该变量互相可见")]),t._v(" "),a("li",[t._v("为什么在有Synchronized 的情况下还要使用CAS\n"),a("blockquote",[a("p",[t._v("因为CAS是乐观锁,在一些场景中（并发不激烈的情况下）它比Synchronized和ReentrentLock的效率要，当CAS保障不了线程安全的情况下（扩容或者hash冲突的情况下）转成Synchronized 来保证线程安全，大大提高了低并发下的性能。")])])])]),t._v(" "),a("h5",{attrs:{id:"get-put-流程"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#get-put-流程"}},[t._v("#")]),t._v(" get put 流程")]),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/5.png",alt:"png"}}),t._v(" "),a("img",{attrs:{width:"800",src:"https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/container/6.png",alt:"png"}}),t._v(" "),a("h4",{attrs:{id:"skiplist-跳表"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#skiplist-跳表"}},[t._v("#")]),t._v(" SkipList 跳表")]),t._v(" "),a("p",[t._v("SkipList 本身就是一种数据结构，中文一般都翻译为“跳表”。跳表插入、删除、查询操作平均的时间复杂度是 O(log n)")]),t._v(" "),a("blockquote",[a("p",[t._v("理论上和并发线程数没有关系，所以在并发度非常高的情况下，若你对 ConcurrentHashMap 的性能还不满意，可以尝试一下 ConcurrentSkipListMap。")])]),t._v(" "),a("h3",{attrs:{id:"set-copyonwritearrayset-和-concurrentskiplistset"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#set-copyonwritearrayset-和-concurrentskiplistset"}},[t._v("#")]),t._v(" Set CopyOnWriteArraySet 和 ConcurrentSkipListSet")]),t._v(" "),a("blockquote",[a("p",[t._v("跟前面的CopyOnWriteArrayList以及ConcurrentSkipListMap类似")])]),t._v(" "),a("h3",{attrs:{id:"queue"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#queue"}},[t._v("#")]),t._v(" Queue")]),t._v(" "),a("p",[t._v("纬度分类")]),t._v(" "),a("ul",[a("li",[t._v("阻塞和非阻塞 阻塞队列都用blocking关键字标识")]),t._v(" "),a("li",[t._v("单端和双端 单端用Queue双端用Deque")])]),t._v(" "),a("h4",{attrs:{id:"queue分类"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#queue分类"}},[t._v("#")]),t._v(" Queue分类")]),t._v(" "),a("ul",[a("li",[t._v("单端阻塞队列\n"),a("blockquote",[a("p",[t._v("其实现有 ArrayBlockingQueue、LinkedBlockingQueue、SynchronousQueue、LinkedTransferQueue、PriorityBlockingQueue 和 DelayQueue。")])])])]),t._v(" "),a("blockquote",[a("p",[t._v("内部一般会持有一个队列，这个队列可以是数组（其实现是 ArrayBlockingQueue）也可以是链表（其实现是 LinkedBlockingQueue）；甚至还可以不持有队列（其实现是 SynchronousQueue），此时生产者线程的入队操作必须等待消费者线程的出队操作。而 LinkedTransferQueue 融合 LinkedBlockingQueue 和 SynchronousQueue 的功能，性能比 LinkedBlockingQueue 更好；PriorityBlockingQueue 支持按照优先级出队；DelayQueue 支持延时出队。")])]),t._v(" "),a("ul",[a("li",[t._v("双端阻塞队列\n"),a("blockquote",[a("p",[t._v("实现是LinkedBlockingDeque")])])]),t._v(" "),a("li",[t._v("单端非阻塞队列 ConcurrentLinkedQueue")]),t._v(" "),a("li",[t._v("双端非阻塞队列 ConcurrentLinkedDeque")])]),t._v(" "),a("h4",{attrs:{id:"注意"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注意"}},[t._v("#")]),t._v(" 注意")]),t._v(" "),a("ul",[a("li",[t._v("使用队列时，需要格外注意队列是否支持有界\n"),a("blockquote",[a("p",[t._v("（所谓有界指的是内部的队列是否有容量限制）。实际工作中，一般都不建议使用无界的队列")])])]),t._v(" "),a("li",[t._v("只有 ArrayBlockingQueue 和 LinkedBlockingQueue 是支持有界的\n"),a("blockquote",[a("p",[t._v("所以在使用其他无界队列时，一定要充分考虑是否存在导致 OOM 的隐患。")])])])]),t._v(" "),a("blockquote",[a("p",[t._v("而在实际工作中，你不单要清楚每种容器的特性，还要能选对容器，这才是关键，至于每种容器的用法，用的时候看一下 API 说明就可以了，这些容器的使用都不难。")])]),t._v(" "),a("h2",{attrs:{id:"java-容器的快速失败机制-fail-fast"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#java-容器的快速失败机制-fail-fast"}},[t._v("#")]),t._v(" Java 容器的快速失败机制（Fail-Fast）")]),t._v(" "),a("blockquote",[a("p",[t._v("当一个线程遍历容器时，有另一个线程对其修改就会触发fail fast机制，遍历容器的线程也会抛出异常，本质是为了确保遍历时的线程安全，容器内部维护一个初始化为modCount的expectedModeCount变量，遍历时会去检查该期望值是否等于modCount，不等于就说明出现了修改集合操作")])]),t._v(" "),a("h2",{attrs:{id:"hashmap-线程不安全"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#hashmap-线程不安全"}},[t._v("#")]),t._v(" HashMap 线程不安全")]),t._v(" "),a("p",[t._v("并发场景里使用了 HashMap，因为在 1.8 之前的版本里并发执行 HashMap.put() 可能会导致 CPU 飙升到 100%")]),t._v(" "),a("ul",[a("li",[t._v("在jdk1.7中，在多线程环境下，扩容时会造成环形链或数据丢失。\n"),a("blockquote",[a("p",[t._v("resize->transfer的时候采用indexFor头插法导致形成环形链")])])]),t._v(" "),a("li",[t._v("在jdk1.8中，在多线程环境下，会发生数据覆盖的情况\n"),a("blockquote",[a("p",[t._v("在发生hash碰撞，不再采用头插法方式，而是直接插入链表尾部，因此不会出现环形链表的情况。但并发时存在数据覆盖的问题")])])])]),t._v(" "),a("p",[a("a",{attrs:{href:"https://mp.weixin.qq.com/s/yxn47A4UcsrORoDJyREEuQ",target:"_blank",rel:"noopener noreferrer"}},[t._v("HashMap 线程不安全，它为啥不安全呢？"),a("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=e.exports}}]);