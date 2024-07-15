# MAVEN

## 标准的目录结构

如：项目的目录结构  src resources

## pom大纲

> schema元素 \<project/> \<profiles/> 等

## 构建

> \<packaging/> 指定构件类型

## POM文件的用例

默认、父POM、聚合器\<modules/>. 父POM和聚合器的\<packaging/>值为POM

## GAV坐标

> \<groupId/> \<artifactId/>\<version/> 
> > \<classifier/>用于区分属于相同的POM但是却被以不同的方式构建的构件。如：javadoc、sources、jdk16、jdk17

## \<dependency/>下的\<scope/>取值

> compile、runtime、optional：不被引用了这个项目所产生的构件的其他项目，视为传递依赖、provided：不会被包含在由这个pom产生的war文件的wen-inf/lib目录中、test、import

## dependencyManagement

> 依赖管理，pom的子项自动继承这些声明、其他项目可以通过scope：import导入他们，引用dependencyManagement元素的项目可以使用它所声明的依赖

## 生命周期

> clean、validate、compile、test、package、verify、install、site、deploy等，执行命令会运行所有到该阶段的默认阶段

## 插件 

> maven协调了所有生命周期阶段的执行，但没直接实现他们，相反委推给插件。\<maven-plugin/>类型的构件

## 插件管理

> pluginManagement 类似dependencyManagement，但没有导入声明，version坐标所继承的

## 配置文件

> profiles中定义，可以通过自动或手动启用激活来改变POM的行为 可以通过-P 显式引用配置文件：mvn -P jdk16 clean install 激活一个将POM自定义为jdk1.6的配置文件

## 存储库

远程存储库、公司中转存储库、本地存储库

## 快照和发布

> 远程存储库会为正在发布的构件以及稳定发布或生产发布的构件，定义不同的区域。成为快照存储库和发布存储库

```yml
<repositories>
        <repository>
            <id>public</id>
            <url>http://192.168.110.24:5014/repository/maven-public/</url>
            <name>maven-public</name>
            <snapshots>
                <enabled>true</enabled>
                <updatePolicy>always</updatePolicy>
            </snapshots>
        </repository>
       </repositories>
```

## lib包下打不进jar包解决方案
> 第三方jar放在resources/lib里，在pom文件里引入，能正常运行，但是打jar的时候，引入的第三方jar死活进不去，很多第三方的jar，并不能在maven仓库中找到

- 将第三方的jar的加入到本地库中即可
```java
mvn install:install-file -Dfile="G:\yhk-common-core-5.3.0.jar" -DgroupId=yhk.common.core -DartifactId=yhk-common-core-5.3.0 -Dversion=1.0.0 -Dpackaging=jar
mvn install:install-file -Dfile="G:\yhk-common-data-5.3.0.jar" -DgroupId=yhk.common.data -DartifactId=yhk-common-data-5.3.0 -Dversion=1.0.0 -Dpackaging=jar
mvn install:install-file -Dfile="G:\yhk-common-security-5.3.0.jar" -DgroupId=yhk.common.security -DartifactId=yhk-common-security-5.3.0 -Dversion=1.0.0 -Dpackaging=jar
```
- 命令说明
  - -DgroupId=自定义groupId设置groupId 名
  - -DartifactId=自定义artifactId设置该包artifactId名
  - -Dversion=自定义版本1.0.0设置版本号
  - -Dpackaging=jar设置该包的类型，有如下值：pom、jar、war、maven-plugin。但是一般常用的是jar类型
  - -Dfile=文件路径设置该jar包文件所在的路径与文件名
  - 如果是windows环境，在cmd窗口下运行上面命令可以将c盘myfile下的test.jar安装到maven仓库。注意 需要安装maven环境变量
- 成功之后，配置pom.xml
```xml
        <dependency>
            <groupId>com.sun.jna</groupId>
            <artifactId>jna</artifactId>
            <version>1.0</version>
        </dependency>
 
        <dependency>
            <groupId>com.sun.jna.examples</groupId>
            <artifactId>examples</artifactId>
            <version>1.0</version>
        </dependency>
```







