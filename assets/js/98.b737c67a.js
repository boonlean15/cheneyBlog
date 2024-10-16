(window.webpackJsonp=window.webpackJsonp||[]).push([[98],{379:function(t,s,a){"use strict";a.r(s);var e=a(14),n=Object(e.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"网络编程"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#网络编程"}},[t._v("#")]),t._v(" 网络编程")]),t._v(" "),s("h3",{attrs:{id:"连接到服务器"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#连接到服务器"}},[t._v("#")]),t._v(" 连接到服务器")]),t._v(" "),s("h4",{attrs:{id:"相关概念"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#相关概念"}},[t._v("#")]),t._v(" 相关概念")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("端口：为了便于实现服务器和客户端之间的通信而使用的抽象概念")])]),t._v(" "),s("li",[s("p",[t._v("net包：java库隐藏了建立网络连接和通过连接发送数据的复杂过程")])]),t._v(" "),s("li",[s("p",[t._v("协议： TCP传输控制协议、UDP用户数据报协议")]),t._v(" "),s("blockquote",[s("p",[t._v("UDP付出的开销要比TCP少的多，但是数据报无须按照顺序传递到接收应用程序，接收者自己负责排序和重新获取丢失的数据报")])]),t._v(" "),s("blockquote",[s("p",[t._v("UDP一般用于音频和视频流的传输，或者连续测量的应用领域")])])])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Socket")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" host"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" port"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//构建一个套接字，用来连接给定的主机和端口")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("InputStream")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getInputStream")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("OutputStream")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getOutputStream")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("h4",{attrs:{id:"套接字超时"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#套接字超时"}},[t._v("#")]),t._v(" 套接字超时")]),t._v(" "),s("ul",[s("li",[t._v("Socket的getInputStream在没有数据可用的时候，会一直阻塞，受底层操作系统的限制，最终会导致超时。")]),t._v(" "),s("li",[t._v("Socket(String host,int port)在建立连接到服务器之前，会一直阻塞，")]),t._v(" "),s("li",[t._v("可通过先创建一个无连接到套接字，然后设置超时解决一直阻塞的问题")])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Socket")]),t._v(" socket "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Socket")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nsocket"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("connect")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("InetSocketAddress")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("host"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("port"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("timeout"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("blockquote",[s("p",[t._v("void setSoTimeout(int timeoutInMilliseconds) 设置该套接字读请求的阻塞时间")])]),t._v(" "),s("h4",{attrs:{id:"因特网地址"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#因特网地址"}},[t._v("#")]),t._v(" 因特网地址")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("因特网地址由4个字节组成，如129.6.15.28、IPv6由16个字节组成")])]),t._v(" "),s("li",[s("p",[t._v("因特网地址和主机名之间的转换，可以使用InetAddress类")]),t._v(" "),s("blockquote",[s("p",[t._v("static InetAddress getName(String host) 为给定主机名创建一个InetAddress对象")])]),t._v(" "),s("blockquote",[s("p",[t._v("static InetAddress getLocalHost() 为本地主机名创建一个InetAddress对象")])])])]),t._v(" "),s("h3",{attrs:{id:"实现服务器"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#实现服务器"}},[t._v("#")]),t._v(" 实现服务器")]),t._v(" "),s("h4",{attrs:{id:"服务器套接字"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#服务器套接字"}},[t._v("#")]),t._v(" 服务器套接字")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServerSocket")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("int")]),t._v(" port"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//创建一个监听端口的服务器套接字")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Socket")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("accept")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//等待连接。该方法阻塞当前线程直到建立连接为止。程序可以通过Socket与连接中的客户端通信")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("close")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//关闭服务器套接字")]),t._v("\n")])])]),s("h4",{attrs:{id:"为多个客户端服务"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#为多个客户端服务"}},[t._v("#")]),t._v(" 为多个客户端服务")]),t._v(" "),s("ul",[s("li",[t._v("accept方法会阻塞，而只accept一次的例子，只能为一个客户的服务、我们可以通过应对每个客户端连接，创建一个线程，然后线程各自负责处理连接")]),t._v(" "),s("li",[t._v("比如通过while true方式，让服务器一直启动，等待连接，然后给每个连接分配一个线程")]),t._v(" "),s("li",[t._v("当然，此方式不适合高并发的场景，为实现更高的吞吐量，可以通过nio方式")])]),t._v(" "),s("h4",{attrs:{id:"半关闭"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#半关闭"}},[t._v("#")]),t._v(" 半关闭")]),t._v(" "),s("ul",[s("li",[t._v("半关闭提供了这样一种能力：套接字连接的一端可以终止输出，然后保持接收来自另一端的输入")]),t._v(" "),s("li",[t._v("Socket")])]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("shutdownOutput")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//输出流设为结束")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("shutdownInput")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//输入流设为结束")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("boolean")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("isOutputShutdown")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//如果输出流被关闭，则返回true")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("boolean")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("isInputShutdown")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//如果输入流被关闭，则返回true")]),t._v("\n")])])]),s("h3",{attrs:{id:"可中断套接字"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#可中断套接字"}},[t._v("#")]),t._v(" 可中断套接字")]),t._v(" "),s("p",[t._v("当连接一个套接字时，当前线程会一直阻塞到建立连接为止。当通过套接字读取数据时，当前线程会一直阻塞到操作成功或超时为止。")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("为了能够实现可中断的套接字，可以使用SocketChannel.open()打开一个套接字通道。当中断线程时，会抛出异常，以实现中断套接字。")])]),t._v(" "),s("li",[s("p",[t._v("InetSocketAddress")]),t._v(" "),s("blockquote",[s("p",[t._v("InetSocketAddress(String host,int port) 用给定的主机和端口创建一个套接字通道，在创建过程中解析主机名，如果主机名不可解析，unResolve会被设置为true")])]),t._v(" "),s("blockquote",[s("p",[t._v("boolean isUnresolve() 如果不能解析该对象，则返回true")])])]),t._v(" "),s("li",[s("p",[t._v("SocketChannel")]),t._v(" "),s("blockquote",[s("p",[t._v("static SocketChannel open(SocketAddress address) 打开一个套接字通道，并连接到主机地址")])])]),t._v(" "),s("li",[s("p",[t._v("Channels")]),t._v(" "),s("blockquote",[s("p",[t._v("static InputStream newInputStream(ReadableByteChannel channel) 创建一个输入流，用以从指定通道读取数据")])]),t._v(" "),s("blockquote",[s("p",[t._v("static OutputStream newOutputStream(WriteableByteChannel channel) 创建一个输出流，用以从指定通道写出数据")])])])]),t._v(" "),s("h3",{attrs:{id:"获取web数据"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#获取web数据"}},[t._v("#")]),t._v(" 获取Web数据")]),t._v(" "),s("h4",{attrs:{id:"url和uri"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#url和uri"}},[t._v("#")]),t._v(" URL和URI")]),t._v(" "),s("p",[t._v("URL统一资源定位符、URI统一资源标识符、URN统一资源名称(根据标识符无法定位任何数据的成为统一资源名称)")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("URI 统一资源标识符，纯粹的语法结构，用来指定web资源的字符串的各个组成部分、URI类的作用之一是解析标识符，并将它分解成各种不同的组成部分")])]),t._v(" "),s("li",[s("p",[t._v("URI 的另一个作用是处理绝对标识符和相对标识符")])]),t._v(" "),s("li",[s("p",[t._v("URL 是URI的一个特例，可以打开一个到达资源的流")])]),t._v(" "),s("li",[s("p",[t._v("URI具有以下语法：")]),t._v(" "),s("blockquote",[s("p",[t._v("[schema:]schemaSpecificPart[#fragment] 包含schema:的称为绝对URI")])]),t._v(" "),s("blockquote",[s("p",[t._v("[]代表可选部分、schemaSpecificPart不是以/开头的称它是不透明的")])]),t._v(" "),s("blockquote",[s("p",[t._v("schemaSpecificPart拥有以下结构 [//authority][path][?query]")])]),t._v(" "),s("blockquote",[s("p",[t._v("authority包含以下结构 [user-info@]host:[port]")])])]),t._v(" "),s("li",[s("p",[t._v("URI 具有以下方法")]),t._v(" "),s("blockquote",[s("p",[t._v("getScheme、getSchemeSpecificPart、getAuthority、getUserInfo、getHost、getPort、getPath、getQuery、getFragment、")])]),t._v(" "),s("blockquote",[s("p",[t._v("URI 处理绝对标识符和相对化的方法：relative = base.relativize(combine)、combine = base.resolve(combine)")])])])]),t._v(" "),s("h4",{attrs:{id:"urlconnect"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#urlconnect"}},[t._v("#")]),t._v(" URLConnect")]),t._v(" "),s("p",[t._v("为了在java程序中访问web服务器，可能希望在更高级别上进行处理，而不只是创建套接字连接和发送http请求。 通过使用URLConnect操作，当然可使用一些网络访问框架，如HttpClient等，他们封装了URLConnect的相关操作。URLConnect底层封装了socket套接字的操作。")]),t._v(" "),s("h3",{attrs:{id:"网络的设计是怎么解决的"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#网络的设计是怎么解决的"}},[t._v("#")]),t._v(" 网络的设计是怎么解决的")]),t._v(" "),s("h4",{attrs:{id:"osi模型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#osi模型"}},[t._v("#")]),t._v(" OSI模型")]),t._v(" "),s("p",[t._v("为了分析网络通讯而引入的一套理论，为制定实用协议和产品打下基础。")]),t._v(" "),s("p",[s("strong",[t._v("OSI模型共分7层，从上到下分别为：")])]),t._v(" "),s("ul",[s("li",[t._v("应用层 指网络操作系统和应用程序 如：Ftp服务器，www服务器")]),t._v(" "),s("li",[t._v("表示层 数据语法的转换，数据的传送等")]),t._v(" "),s("li",[t._v("会话层 建立起两端的会话关系，并负责数据的传送")]),t._v(" "),s("li",[t._v("传输层 负责错误的检查与修复，以确保传送的质量，是TCP工作的地方")]),t._v(" "),s("li",[t._v("网络层 提供了编址方案，IP协议工作的地方(数据包)")]),t._v(" "),s("li",[t._v("数据链路层 将由物理层传来的未经处理的位数据包装层数据帧")]),t._v(" "),s("li",[t._v("物理层 对应网线、网卡、接口等物理设备")])]),t._v(" "),s("blockquote",[s("p",[t._v("物理层网络网卡等未经处理的位数据传递到数据链路层，数据链路层把位数据包装成数据帧，然后通过网络层，网络层提供编址方案，如IP协议，然后找到具体的地址，到达传输层，传输层负责错误的检查和修复，确保了数据传送的质量，如TCP协议工作的地方，再由会话层建立起两端的连接，表示层把数据进行相关数据语法的转换，然后给到应用层等具体的应用程序，如ftp服务器")])]),t._v(" "),s("h4",{attrs:{id:"tcp-ip协议"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#tcp-ip协议"}},[t._v("#")]),t._v(" TCP/IP协议")]),t._v(" "),s("p",[t._v("一般分为四层：应用层、传输层、网络层、链路层")]),t._v(" "),s("ul",[s("li",[t._v("数据传递到每一层时，都会加上相应的层的数据，然后到达另一端的时候，反向进行解析，这样就得到了原来要传递的数据包")]),t._v(" "),s("li",[t._v("具体的网络协议，还需要进一步学习，比如看http协议、TCP/IP协议")]),t._v(" "),s("li",[t._v("端口：未来方便服务器与客户端的通信引入的概念。比如在数据包上加上整数的端口号，然后如果端口号是多少则对应把数据包发送给对应端口号的进程")])]),t._v(" "),s("h4",{attrs:{id:"linux操作系统的网络编程"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#linux操作系统的网络编程"}},[t._v("#")]),t._v(" linux操作系统的网络编程")]),t._v(" "),s("p",[t._v("linux操作系统的网络编程也是涉及几个主要的函数，如：socket()、bind()、linsten()、connect()、accept()、read()、write()、")]),t._v(" "),s("p",[s("strong",[t._v("其实也是类似和java的socket网络编程类似。而jvm底层也是使用了操作系统的网络编程接口，使用方式，通过jni函数调用这些操作系统函数")])]),t._v(" "),s("p",[t._v("int socket(int domain, int type, int protocol);")]),t._v(" "),s("ul",[s("li",[t._v("domain 协议族 如AF_INET、AF_INET6、")]),t._v(" "),s("li",[t._v("type socket类型，如SOCK_STREAM、SOCK_DGRAM、SOCK_RAW、SOCK_PACKET、SOCK_SEQPACKET")]),t._v(" "),s("li",[t._v("protocol 指定协议，如IPPROTO_TCP、IPPTOTO_UDP、IPPROTO_SCTP、IPPROTO_TIPC")])]),t._v(" "),s("p",[t._v("int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);")]),t._v(" "),s("ul",[s("li",[t._v("sockfd：即socket描述字，有socket()创建")]),t._v(" "),s("li",[t._v("addr：一个const struct sockaddr *指针，指向要绑定给sockfd的协议地址")])]),t._v(" "),s("p",[t._v("int listen(int sockfd, int backlog);\nint connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);")]),t._v(" "),s("ul",[s("li",[t._v("listen函数的第一个参数即为要监听的socket描述字，第二个参数为相应socket可以排队的最大连接个数")]),t._v(" "),s("li",[t._v("connect函数的第一个参数即为客户端的socket描述字，第二参数为服务器的socket地址，第三个参数为socket地址的长度")])]),t._v(" "),s("p",[t._v("int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);")]),t._v(" "),s("ul",[s("li",[t._v("accept函数的第一个参数为服务器的socket描述字")]),t._v(" "),s("li",[t._v("如果accpet成功，那么其返回值是由内核自动生成的一个全新的描述字，代表与返回客户的TCP连接")])]),t._v(" "),s("p",[t._v("read()、write()等函数")]),t._v(" "),s("ul",[s("li",[t._v("服务器与客户已经建立好连接了。可以调用网络I/O进行读写操作了，即实现了网咯中不同进程之间的通信！网络I/O操作有下面几组：")]),t._v(" "),s("li",[t._v("read()/write()")]),t._v(" "),s("li",[t._v("recv()/send()")]),t._v(" "),s("li",[t._v("readv()/writev()")]),t._v(" "),s("li",[t._v("recvmsg()/sendmsg()")]),t._v(" "),s("li",[t._v("recvfrom()/sendto()")])]),t._v(" "),s("p",[t._v("close()函数")]),t._v(" "),s("ul",[s("li",[t._v("在服务器与客户端建立连接之后，会进行一些读写操作，完成了读写操作就要关闭相应的socket描述字，好比操作完打开的文件要调用fclose关闭打开的文件。")])])])}),[],!1,null,null,null);s.default=n.exports}}]);