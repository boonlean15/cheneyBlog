# Markdown 语法

## 关于Markdown
Markdown是一个 Web 上使用的文本到HTML的转换工具，可以通过简单、易读易写的文本格式生成结构化的HTML文档。

优点:
- 简单标记符完成排版，所写即所见，让你专注于文字而不是排版
- 纯文本，所以兼容性极强，可以用所有文本编辑器打开
- 格式转换方便，Markdown文本可以轻松转换为 html、pdf等
- Markdown 的标记语法有极好的可读性
  
## Markdown简单语法示例

### 区块元素

#### 1. 段落和换行

一个 Markdown 段落是由一个或多个连续的文本行组成，它的前后要有一个以上的空行。

#### 2. 标题

用#标识符表示，例如：

- \# 一级标题
- \# 二级标题
- \### 三级标题

#### 3. 区块引用

1. 在段落的第一行最前面加">"

    \> An immutable class is simply a class whose instances cannot be modified. All of the information contained in each instance is provided when it is created and is fixed for the lifetime of the object.

    > An immutable class is simply a class whose instances cannot be modified. All of the information contained in each instance is provided when it is created and is fixed for the lifetime of the object.
2. 区块引用可以嵌套（例如：引用内的引用），只要根据层次加上不同数量的 > ：

    \>An immutable class is simply a class whose instances cannot be modified.

    \>>All of the information contained in each instance is provided when it is created and is fixed for the lifetime of the object.
    >An immutable class is simply a class whose instances cannot be modified.
    >>All of the information contained in each instance is provided when it is created and is fixed for the lifetime of the object.

3. 区块内也可以套用其他的 Markdown 语法，包括加粗、列表、代码区块等：
   
    - \>\*\*加粗**
    - >**加粗**
    - \>*无序
    - >- 列表
    - >- 列表
    - \>\```public ```
    - > ```public static void main(String[] args){}```
#### 4. 列表
Markdown 支持有序列表和无序列表。

- >无序列表使用星号、加号或是减号作为列表标记，效果一样：

  * \* 无序列表
  - \- 无序列表
  + \+ 无序列表

- 有序列表则使用数字接着一个英文句点
  1. 1\. 有序列表
  2. 2\. 有序列表
  3. 3\. 有序列表

如果是列表里面嵌套列表，则在列表下用制表符缩进

#### 5. 代码区块
- 简单地缩进 4 个空格或是 1 个制表符就可以**如果是标题后缩进则是代码块、如果是列表后缩进则还是段落**
- 或者使用```三个包围代码块 **建议使用此方式**
  
    ```public void test```

#### 6.分隔线
三个以上的星号、减号、底线来建立一个分隔线，建议采用其中一种，如---、***、___

---

### 区段元素

#### 1.链接

方块括号后面紧接着圆括号并插入网址链接即可，例如：
我的\[GitHub](https://github.com/boonlean15)
我的:[GitHub](https://github.com/boonlean15)

#### 2.强调
- 单个星号包围 斜体 *斜体*
- 两个星号包围 加粗 **加粗**
- 两个~删除线包围 ~~删除~~
- 空格
 
    >Markdown语法会忽略首行开头的空格、**目前列表后缩进我尝试可以，标题后缩进未成功**

#### 3.行内标记
行内标记用反引号把它包起来' '，例如

行内标记`标记`

#### 4.插入图片
使用Paste Image插件
- 图片url的基本路径。你可以使用变量${currentFileDir}和${projectRoot}。${currentFileDir}将被包含当前编辑文件的目录路径所取代。${projectRoot}将被替换为vscode中打开的项目的路径。如果你设置basePath为空字符串，它将插入绝对路径到文件。

示例：

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/markdown/1.jpg" alt="png">

#### 5.其他
- 反斜杠 转义字符 \\>

- 自动邮箱连接 自动链接形式来处理电子邮件信箱\<10086@qq.com> 
 
<10086@qq.com>

---

参考自：[Markdown基础语法整理](https://www.jianshu.com/p/815788f4b01d)