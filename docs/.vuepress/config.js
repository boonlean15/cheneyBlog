module.exports = {
    title: '我的知识库',
    description: '十一家的林先生',
    base: '/cheneyBlog/',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: 'JAVA', link: '/repository/java/core_one/jdk_relationship' },
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
                path: '/repository/buildBlog/buildBlog',
            },
            {
                title: 'JAVA基础',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    {
                        title: '不可变类',
                        path: '/repository/java/core_one/unable_class',
                    },
                    {
                        title: 'JDK JRE JVM三者关系',
                        path: '/repository/java/core_one/jdk_relationship',
                    },
                    {
                        title: 'JAVA语法基础',
                        path: '/repository/java/core_one/first_unit'
                    },
                ]
            },
        ]
    }
}