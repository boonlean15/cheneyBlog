# Vuepress + Github Pages + Github Actions 构建开源文档

## Vuepress

1. 通过Vuepress构建文档
   
    [访问Vuepress](https://vuepress.vuejs.org/zh/)

    根据官方文档的快速开始，学习如果通过Vuepress构建个人博客或者开源官方文档

2. 步骤 
- 创建一个目录，作为项目目录
  
    ```mkdir vuepress-starter && cd vuepress-starter```

- 使用你喜欢的包管理器进行初始化

    ```yarn init # npm init```

- 将 VuePress 安装为本地依赖

    ```yarn add -D vuepress # npm install -D vuepress```

- 创建你的第一篇文档
    
    ```mkdir docs && echo '# Hello VuePress' > docs/README.md```

- 在 package.json 中添加一些 scripts脚本.**主要是设置启动脚本**
  
  ```{"scripts": {"docs:dev": "vuepress dev docs","docs:build": "vuepress build docs"}}```

- 在本地启动服务器
  
  ```yarn docs:dev # npm run docs:dev```

- 接着根据文档，按默认主题，设置导航和侧边栏。当然也可自定义主题
  
## Github Pages
    
您可以使用 GitHub Pages 直接从 GitHub 仓库托管关于自己、您的组织或您的项目的站点

GitHub Pages 是一项静态站点托管服务，它直接从 GitHub 上的仓库获取 HTML、CSS 和 JavaScript 文件，（可选）通过构建过程运行文件，然后发布网站。

我们Vuepress构建的项目可以直接托管到Github Pages上

## GitHub Actions

> Github Action是持续集成服务（Continuous Integration，简称 CI），它绑定 Github 上面的项目，只要有新的代码，就会自动抓取。然后，提供一个运行环境，执行测试，完成构建，还能部署到服务器。

> 持续集成指的是只要代码有变更，就自动运行构建和测试，反馈运行结果。确保符合预期以后，再将新代码"集成"到主干。

> 持续集成的好处在于，每次代码的小幅变更，就能看到运行结果，从而不断累积小的变更，而不是在开发周期结束时，一下子合并一大块代码。

### Github Action 配置

昨天在公司用的window电脑直接通过创建.github/workflows/main.yml文件，创建workflows工作流后，回到家用家里Mac电脑，修改内容后，push代码到仓库后，发现并未自动构建。

经过检查和测试，最后找到原因，可能是由于未在github上创建workflows导致。

今天在公司拉取直接在github创建的workflows，然后发现提交文件后，项目自动构建了。

步骤：

- 在项目的Actions标签下点击，然后new workflow，创建main.yml文件，具体内容参考VuePress的Github Pages + Github Actions提供的示例，详细的是需要修改对应的项目名
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/workflowsImg/1.jpg" alt="png">

##### yml内容如下：

```yml
name: Blog Demo CI
on:
  push:
    branches: [ master ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@master

    - name: Build and Deploy
      uses: jenkey2011/vuepress-deploy@master
      env:
        ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        TARGET_REPO: boonlean15/cheneyBlog
        TARGET_BRANCH: gh_pages
        BUILD_SCRIPT: yarn && yarn build
        BUILD_DIR: docs/.vuepress/dist/
```

- 需要在自己的settings里创建一个token，并添加到Actions 的Secret,名字可以取ACCESS_TOKEN、具体参看上面代码

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/workflowsImg/2.jpg" alt="png">

- 最后在项目的setting，找到Page选项，添加page的引用，我这里使用的gh_pages分支，点击save后，便有提示，项目可以准备部署到github page上
- 可以通过提交修改push到仓库，或者在git上修改代码触发构建

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/workflowsImg/3.jpg" alt="png">