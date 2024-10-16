(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{322:function(v,t,_){"use strict";_.r(t);var i=_(14),l=Object(i.a)({},(function(){var v=this,t=v._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("h1",{attrs:{id:"学好理论有思路-关注细节定成败"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#学好理论有思路-关注细节定成败"}},[v._v("#")]),v._v(" 学好理论有思路，关注细节定成败")]),v._v(" "),t("h2",{attrs:{id:"理论部分总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#理论部分总结"}},[v._v("#")]),v._v(" 理论部分总结")]),v._v(" "),t("ul",[t("li",[v._v("硬件的核心矛盾：CPU、内存、IO存在速率的问题，解决这个问题的时候，引入了可见性、原子性、有序性问题")]),v._v(" "),t("li",[v._v("java内存模型解决可见性、有序性问题")]),v._v(" "),t("li",[v._v("锁来解决原子性问题")]),v._v(" "),t("li",[v._v("使用锁，针对性，共享资源和锁的对应关系，应该是N:1")]),v._v(" "),t("li",[v._v("锁的粒度问题，一不小心，容易死锁，死锁的原因")]),v._v(" "),t("li",[v._v("解决死锁的问题，wait-notify机制，同时引出了线程间的协作")]),v._v(" "),t("li",[v._v("安全性，活跃性，性能(延迟、吞吐量)，从宏观层面对前面的章节进行了总结")]),v._v(" "),t("li",[v._v("管程，解决并发编程的万能钥匙")]),v._v(" "),t("li",[v._v("并发问题是复杂的，因此介绍了线程的生命周期、多少线程数合理、局部变量是线程安全的")])]),v._v(" "),t("blockquote",[t("p",[v._v("而多少线程数合理，往往根据不同的IO和CPU情况，理论数据是不同的，根据得到的公式，还需要根据实际情况进行压测来得到最佳线程数")])]),v._v(" "),t("h2",{attrs:{id:"注意点"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#注意点"}},[v._v("#")]),v._v(" 注意点")]),v._v(" "),t("ul",[t("li",[v._v("锁的最佳实践\n"),t("ul",[t("li",[v._v("new Object，逃逸分析，代码会被优化掉，实际上相当于无锁结构")]),v._v(" "),t("li",[v._v("Integer，String不适合做锁，可变的对象一旦发生变化，则失去了互斥的功能")]),v._v(" "),t("li",[v._v("锁应该是私有的、不可变的、不可重用的")])])]),v._v(" "),t("li",[v._v("锁的性能看场景\n"),t("ul",[t("li",[v._v("每种技术方案都有对应的优缺点和适用场景")])])]),v._v(" "),t("li",[v._v("竞态条件需要格外注意\n"),t("ul",[t("li",[v._v("当存在if条件")]),v._v(" "),t("li",[v._v("多个线程安全的方法组合在一起时")])])]),v._v(" "),t("li",[v._v("方法调用是先计算参数\n"),t("ul",[t("li",[v._v('日志打印的最佳方案是使用log.info("日志：{}",val);而非log.info("日志："+val)，因为方法调用是先计算参数，这里val变量会被计算，即使日记不打印，如果变量是共享变量的话，容易引发bug')])])]),v._v(" "),t("li",[v._v("InterruptException需要格外注意")]),v._v(" "),t("li",[v._v("interrupt的本意是中断，isInterrupted是判断线程是否被中断，而如果线程处于Waiting、time_waiting状态，interrupt的时候，线程抛出异常，此时会重置/清除中断标识，true->false，isInterrupted方法不起作用")]),v._v(" "),t("li",[v._v("理论值or经验值\n"),t("ul",[t("li",[v._v("理论上讲，经验值肯定是靠不住的")]),v._v(" "),t("li",[v._v("IO耗时/CPU耗时，实践中肯定是大于1的，线程数基本上都是在初始值的基础上增加，增加过程中要注意延迟、吞吐量，当吞吐量开始不再增加或者下降时，延迟急速增多，基本上就是线程数的最佳数量了")])])])]),v._v(" "),t("h2",{attrs:{id:"书籍"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#书籍"}},[v._v("#")]),v._v(" 书籍")]),v._v(" "),t("p",[v._v("《java并发编程实战》《java安全编码标准》")])])}),[],!1,null,null,null);t.default=l.exports}}]);