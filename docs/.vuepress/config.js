module.exports = {
    title: 'cheney blog',
    description: 'human is animal',
    base: '/cheneyBlog/',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: 'JAVA', link: '/java/jdkRelationship' },
            { text: '前端', link: 'http://www.lvyestudy.com/'},
            { text: 'Github', link: 'https://github.com/boonlean15'},
          ],
        sidebar: [
            {
                title: 'Markdown语法',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 0,
                path: '/markdown/',
            },
            {
                title: 'Vuepress构建项目',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 0,
                path: '/buildBlog/buildBlog',
            },
            {
                title: '学好英语',   // 必要的
                path: '/how-to-learn-english/how-to-learn-english',
            },
            {
                title: 'SQL',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: 'sql是如何执行的',
                        path: '/sql/how-sql-exec',
                    },{
                        title: 'DDL创建数据库和数据表时需要注意什么',
                        path: '/sql/ddl',
                    },{
                        title: 'Select基础查询',
                        path: '/sql/select_base',
                    }
                ]
            },
            {
                title: 'JAVA基础',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: 'JDK JRE JVM三者关系',
                        path: '/java/jdkRelationship',
                    },
                    {
                        title: '不可变类',
                        path: '/java/unableClass',
                    },
                    {
                        title: 'JAVA语法基础',
                        path: '/java/firstUnit'
                    },
                    {
                        title: 'JAVA 泛型',
                        path: '/java/generics'
                    },
                    {
                        title: 'JAVA 集合',
                        path: '/java/javaCollection'
                    },
                    {
                        title: 'JAVA 并发',
                        path: '/java/javaConcurrent'
                    },
                    {
                        title: 'JAVA 流库',
                        path: '/java/javaCoreStream'
                    },
                    {
                        title: 'JAVA 输入与输出',
                        path: '/java/javaInputOutput'
                    }
                ]
            },
            {
                title: '并发理论基础',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: '学好并发编程',
                        path: '/java-concurrent/part1/learn-concurrent',
                    },
                    {
                        title: 'java 管程实现的一些关键字总结',
                        path: '/java-concurrent/part1/general',
                    },
                    {
                        title: '并发编程bug源头 - 可见性、原子性、有序性',
                        path: '/java-concurrent/part1/concurrent-bug-source',
                    },
                    {
                        title: 'Java内存模型：看Java如何解决可见性和有序性问题',
                        path: '/java-concurrent/part1/java-heap-model',
                    },
                    {
                        title: '互斥锁 解决原子性问题',
                        path: '/java-concurrent/part1/mutual-exclusion',
                    },
                    {
                        title: '死锁处理',
                        path: '/java-concurrent/part1/dead-lock-how',
                    },
                    {
                        title: '等待-通知机制',
                        path: '/java-concurrent/part1/wait-notify',
                    },
                    {
                        title: '安全性、活跃性、性能问题',
                        path: '/java-concurrent/part1/safety-active-performance',
                    },
                    {
                        title: '管程 并发编程的万能钥匙',
                        path: '/java-concurrent/part1/monitor',
                    },
                    {
                        title: 'java线程的生命周期',
                        path: '/java-concurrent/part1/java-thread-life',
                    },
                    {
                        title: '创建多少线程合适',
                        path: '/java-concurrent/part1/how-many-thread',
                    },
                    {
                        title: '局部变量是线程安全的',
                        path: '/java-concurrent/part1/local-thread-is-safe',
                    },
                    {
                        title: '面向对象的思想写好并发程序',
                        path: '/java-concurrent/part1/how-to-code',
                    },
                    {
                        title: '学好理论有思路，关注细节定成败',
                        path: '/java-concurrent/part1/thinking-and-doing',
                    }
                ]
            },
            {
                title: '并发工具类',   // 必要的
                children: [
                    {
                        title: 'Lock和Condition 隐藏在并发包中的管程',
                        path: '/java-concurrent/part2/lock',
                    },
                    {
                        title: 'Lock和Condition Dubbo实现异步转同步',
                        path: '/java-concurrent/part2/condition',
                    },
                    {
                        title: 'Semaphore 信号量实现池化',
                        path: '/java-concurrent/part2/semaphore',
                    },
                    {
                        title: 'ReadWriteLock 实现缓存',
                        path: '/java-concurrent/part2/readWriteLock',
                    },
                    {
                        title: 'StampedLock 比ReadWriteLock还快的锁',
                        path: '/java-concurrent/part2/stampedLock',
                    },
                    {
                        title: 'CountDownLatch-CyclicBarrier',
                        path: '/java-concurrent/part2/countdownlatch-cyclicbarrier',
                    },
                    {
                        title: '并发容器需要填的坑',
                        path: '/java-concurrent/part2/container',
                    },
                    {
                        title: '原子类',
                        path: '/java-concurrent/part2/atomic',
                    },
                    {
                        title: 'executor 线程池',
                        path: '/java-concurrent/part2/executor',
                    },
                    {
                        title: 'Future',
                        path: '/java-concurrent/part2/future',
                    },
                    {
                        title: 'CompletableFuture',
                        path: '/java-concurrent/part2/completableFuture',
                    },
                    {
                        title: 'CompletableService',
                        path: '/java-concurrent/part2/completableService',
                    },
                    {
                        title: 'Fork Join',
                        path: '/java-concurrent/part2/forkJoin',
                    },
                    {
                        title: 'AQS分析',
                        path: '/java-concurrent/part2/lock-source',
                    },
                    {
                        title: '并发注意事项',
                        path: '/java-concurrent/part2/summary',
                    }
                ]    
            },
            {
                title: '并发设计模式',   // 必要的
                children: [
                    {
                        title: 'Immutability模式',
                        path: '/java-concurrent/part3/immutability',
                    },{
                        title: 'COW模式',
                        path: '/java-concurrent/part3/cow',
                    },{
                        title: 'ThreadLocal',
                        path: '/java-concurrent/part3/threadLocal',
                    },{
                        title: '等待唤醒机制的规范实现',
                        path: '/java-concurrent/part3/guard_suspension',
                    },{
                        title: 'balking模式',
                        path: '/java-concurrent/part3/balking',
                    },{
                        title: 'Thread-Per-Message模式：最简单实用的分工方法',
                        path: '/java-concurrent/part3/thread-per-message',
                    },{
                        title: 'Work-Thread模式：线程池模式',
                        path: '/java-concurrent/part3/work-thread',
                    },{
                        title: '优雅的终止线程',
                        path: '/java-concurrent/part3/grace-shutdown',
                    },{
                        title: '生产者-消费者模式',
                        path: '/java-concurrent/part3/provider-comsumer',
                    }
                ]    
            },
            {
                title: '并发案例分析',   // 必要的
                children: [
                    {
                        title: 'Guava RateLimiter限流器',
                        path: '/java-concurrent/part4/guava-ratelimiter',
                    },
                    {
                        title: '高性能网络应用框架Netty',
                        path: '/java-concurrent/part4/netty',
                    },
                    {
                        title: '高性能队列Disruptor',
                        path: '/java-concurrent/part4/disruptor',
                    },
                    {
                        title: '高性能数据库连接池HiKariCP',
                        path: '/java-concurrent/part4/hk',
                    },
                    {
                        title: 'CPU缓存命中率和缓存行详解',
                        path: '/java-concurrent/part4/cpu-cache',
                    }
                ]    
            },
            {
                title: '其他并发模型',   // 必要的
                children: [
                    {
                        title: '面向对象原生的并发模型-Actor模型',
                        path: '/java-concurrent/part5/actor',
                    },{
                        title: '软件事务内存STM-借鉴数据库事务的并发解决方案',
                        path: '/java-concurrent/part5/stm',
                    },{
                        title: '协程 更轻量级的线程',
                        path: '/java-concurrent/part5/assist',
                    },{
                        title: 'CSP模型 解决协程同步问题',
                        path: '/java-concurrent/part5/csp',
                    }
                ]    
            },
            {
                title: 'NIO',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: '网络编程',
                        path: '/nio/net_program',
                    },
                    {
                        title: 'NIO基础-相关模型和概念',
                        path: '/nio/nio_base_model',
                    }
                ]
            },
            {
                title: 'RPC',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 0,
                path: '/rpc/rpc',
            },
            {
                title: 'Netty in action',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: 'Netty 异步和事件驱动',
                        path: '/netty/netty_nio_event',
                    },
                    {
                        title: '第一个netty应用',
                        path: '/netty/netty_first_app',
                    },
                    {
                        title: 'netty组件和设计',
                        path: '/netty/netty_component_design',
                    },
                    {
                        title: 'netty传输',
                        path: '/netty/netty_transport',
                    },
                    {
                        title: 'ByteBuf',
                        path: '/netty/netty_bytebuf',
                    },
                    {
                        title: 'ChannelHandler和ChannelPipeline',
                        path: '/netty/netty_channelhandler',
                    },
                    {
                        title: 'EventLoop和线程模型',
                        path: '/netty/netty_eventloop',
                    },
                    {
                        title: '引导Boostrap',
                        path: '/netty/netty_bootstrap',
                    },
                    {
                        title: '单元测试EmbeddedChannel',
                        path: '/netty/netty_embedded',
                    },
                    {
                        title: '编解码器框架',
                        path: '/netty/netty_encode_frame',
                    },
                    {
                        title: '预置的ChannelHandler和编解码器',
                        path: '/netty/netty_encode_frame_pre',
                    },
                    {
                        title: '网络协议WebSocket',
                        path: '/netty/netty_protocol',
                    },
                    {
                        title: 'UDP广播事件',
                        path: '/netty/netty_udp',
                    }
                ]
            },
            {
                title: 'spring cloud',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: 'spring cloud 概述',
                        path: '/springcloud/generics',
                    },
                    {
                        title: 'Eureka',
                        path: '/springcloud/eureka',
                    },
                    {
                        title: 'Feign',
                        path: '/springcloud/feign'
                    },
                    {
                        title: 'Ribbon',
                        path: '/springcloud/ribbon'
                    },
                    {
                        title: 'Config',
                        path: '/springcloud/config'
                    },
                    {
                        title: 'spring cloud 认证和鉴权',
                        path: '/springcloud/auth'
                    },
                    {
                        title: 'spring cloud gateway网关',
                        path: '/springcloud/gateway'
                    }
                ]
            },
            {
                title: '认证',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 0,
                path: '/authentication/authentication',
            },
            {
                title: 'Mybatis',   // 必要的
                children: [
                    {
                        title: 'Mybatis',
                        path: '/mybatis/mybatis',
                    }
                ]
            },
            {
                title: 'Maven',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: 'Maven基本使用',
                        path: '/maven/maven',
                    }
                ]
            },
            {
                title: 'CICD',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: 'CICD',
                        path: '/cicd/harbor',
                    }
                ]
            },
            {
                title: 'AI知识',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: 'AI相关概念',
                        path: '/ai/concept',
                    },{
                        title: '大模型训练基础',
                        path: '/ai/llm-base',
                    },{
                        title: '神经网络',
                        path: '/ai/network',
                    },{
                        title: 'Dify',
                        path: '/ai/dify',
                    }
                ]
            },
            {
                title: 'springboot',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: 'springboot log 日志',
                        path: '/springboot/log',
                    }
                ]
            },
            {
                title: '其他',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: 'xss漏洞',
                        path: '/others/xss',
                    },
                    {
                        title: 'springboot+vue 前后端开启https',
                        path: '/others/https-active',
                    },
                    {
                        title: 'Linux常用命令',
                        path: '/linux-shell/linux-shell',
                    },
                    {
                        title: '常用统计和其他sql',
                        path: '/usedsql/usedsql',
                    },
                    {
                        title: 'Springboot 常用note',
                        path: '/others/springboot',
                    },
                    {
                        title: 'docker 磁盘问题处理',
                        path: '/others/docker',
                    },
                    {
                        title: 'windows相关',
                        path: '/others/win',
                    }
                ]
            }
        ]
    }
}