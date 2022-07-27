module.exports = {
    title: '我的知识库',
    description: '十一家的林先生',
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
        ]
    }
}