module.exports = {
    title: '我的知识库',
    description: '一蓑烟雨任平生',
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
                title: 'java并发编程实战',   // 必要的
                // collapsable: false, // 可选的, 默认值是 true,
                // sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: '学好并发编程',
                        path: '/java-concurrent/learn-concurrent',
                    },
                    {
                        title: 'java 管程实现的一些关键字总结',
                        path: '/java-concurrent/general',
                    },
                    {
                        title: '并发编程bug源头 - 可见性、原子性、有序性',
                        path: '/java-concurrent/concurrent-bug-source',
                    },
                    {
                        title: 'Java内存模型：看Java如何解决可见性和有序性问题',
                        path: '/java-concurrent/java-heap-model',
                    },
                    {
                        title: '互斥锁 解决原子性问题',
                        path: '/java-concurrent/mutual-exclusion',
                    },
                    {
                        title: '死锁处理',
                        path: '/java-concurrent/dead-lock-how',
                    },
                    {
                        title: '等待-通知机制',
                        path: '/java-concurrent/wait-notify',
                    },
                    {
                        title: '安全性、活跃性、性能问题',
                        path: '/java-concurrent/safety-active-performance',
                    }
                ]
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
                    }
                ]
            }
        ]
    }
}