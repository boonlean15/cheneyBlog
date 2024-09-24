# sql是如何执行的

## Oracle中的SQL是如何执行的
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/sql/1.jpg" alt="jpg"> 

### oracle执行过程
- 语法检查：检查sql拼写是否正确
- 语义检查：检查sql中的访问对象是否存在
    > 语法检查和语义检查的作用是保证SQL语句没有错误
- 权限检查：看用户是否具备访问该数据的权限
- 共享池检查：共享池是一块内存池，主要作用是缓存sql语句和该语句的执行计划
    > Oracle通过检查共享池是否存在sql语句的执行计划，来判断进行软解析还是硬解析。
    > 在共享池中，oracle对sql语句进行hash运算，根据hash值在库缓存中查找，如果存在sql语句执行计划，就直接拿来执行，直接进入执行器的环节，这就是软解析。
    > 如果没有找到sql语句执行计划，oracle需要创建解析树进行解析，生成执行计划，进入“优化器”这个步骤，这就是硬解析。
- 优化器：优化器中就是要进行硬解析，也就是决定怎么做，比如创建解析树，生成执行计划
- 执行器：有了解析树和执行计划后，就知道sql该怎么被执行，这样就可以在执行器中执行语句了

### 共享池
- 共享池：oracle的术语，包括了库缓存，数据字典缓冲区等
  - 库缓存：主要缓存sql语句和执行计划。决定sql语句是否需要进行硬解析
    > 创建解析树、生成执行计划很消耗资源，应尽量避免硬解析
  - 数据字典缓冲区：存储oracle中的对象定义，如表、视图、索引等对象
    > 当对sql语句进行解析时，如果需要相关的数据，会从数据字典缓冲区中提取

### oracle绑定变量
oracle绑定变量是它的一大特色，绑定变量就是在sql语句中使用变量，通过不同变量的取值来改变sql的执行结果。
```sql
select * from player where player_id = 10001;
--- 使用绑定变量
select * from player where player_id = :player_id;
```

- 绑定变量的好处
  - 提升软解析的可能性
- 缺点
  - 可能导致生成的执行计划不够优化

#### 如何避免硬解析，尽量使用软解析
**通过绑定变量**
> 在查询 player_id = 10001 之后，还会查询 10002、
10003 之类的数据，那么每一次查询都会创建一个新的查询
解析。
> 而第二种方式使用了绑定变量，那么在第一次查询之
后，在共享池中就会存在这类查询的执行计划，也就是软解
析。

> 使用动态SQL 的方式，因为参数不同，会导致 SQL 的执行效率不
同，同时 SQL 优化也会比较困难。


## MySQL 中的 SQL 是如何执行的
Mysql是典型的C/S架构，Client/Server架构，服务器端程序使用的mysqld。
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/sql/2.jpg" alt="jpg"> 

- 连接层：客户端和服务器端建立连接，客户端发送sql服务器端
- sql层：对sql语句进行查询处理
  <img width="800" src="https://boonlean15.github.io/cheneyBlog/images/sql/3.jpg" alt="jpg"> 
  - 查询缓存：server如果在查询缓存中发现这个sql语句，直接将结果返回给客户端；如果没有则进入到解析器阶段。(查询缓存往往效率不高，mysql8.0之后抛弃了这个功能)
  - 解析器：对sql语句进行语法分析，语义分析
  - 优化器：确定sql语句的执行路径，比如：根据全表检索还是根据索引检索等
  - 执行器：执行之前判断用户是否具备权限，具备则执行sql并返回结果。mysql8以下，如果设置了查询缓存，会将查询结果进行缓存
- 存储引擎层：与数据库文件打交道，负责数据的存储和读取
  
### Mysql的存储引擎
与oracle不同的是，mysql的存储引擎采用了插件的形式，每个存储引擎都面向一种特定的数据库应用环境。同时开源的mysql允许开发人员设置自己的存储引擎
- InnoDB：mysql5.5版本之后默认的存储引擎，最大的特点是支持事务、行级锁定、外键约束等
- MyISAM：mysql5.5之前默认的存储引擎，不支持事务、不支持外键，最大的特点是快，占用资源少
- Memory：使用系统内存作为存储介质，以得到更快的响应速度。如果mysqld进程崩溃，则会导致所有数据丢失，当数据是临时的情况下才使用Memory
- NDB：也叫所NDB Cluster存储引擎，主要用于Mysql Cluster分布式集群环境，类似Oracle的RAC集群
- Archive：有很好的压缩机制，用于文件归档，在请求写入时会进行压缩，所有常用来做仓库

### Mysql的强大之处
数据库的设计子在于表的设计，而在Mysql的每个表设计中，可以采用不同的存储引擎，我们可以根据实际的数据处理需求选择存储引擎


## 数据库管理系统也是一种软件
简单的把mysql和oracle看成数据库管理系统软件，从外部看难免晦涩难懂，毕竟组织结构太多了。
学习的时候，需要具备抽象的能力抓取最核心的部分**sql的执行原理**，不同的DBMS的sql的执行原理是相通的，只是在不同的软件中，各有各的实现路径。

### mysql中一条sql语句的执行时间分析
- 开启profiling：mysql收集在sql执行时所使用的资源情况
```sql
--- 0 代表关闭，1代表打开
select @@profiling;
set profiling=1;
---查看当前会话所产生的所有 profiles
show profiles;
```
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/sql/4.jpg" alt="jpg"> 

```sql
--- 获取上一次查询的执行时间
show profile;
--- 查询指定的 Query ID
show profile for query 2;
```
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/sql/5.jpg" alt="jpg">

```sql
--- 查看 MySQL 的版本情况
select version();
```
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/sql/6.jpg" alt="jpg">

- 一旦数据表有更新，缓存都将清空，
  > 因此只有数据表是静态的时候，或者数据表很少发生变化时，使用
缓存查询才有价值
- 如果数据表经常更新，反而增加了SQL 的查询时间


## oracle和mysql的sql执行过程区别
### 相同点
- oracle和mysql都是通过解析器->优化器->执行器这样的流程执行sql的
### 差异
- oracle提出共享池概念，通过共享池判断进行软解析还是硬解析
- mysql8之后不再支持查询缓存，而是直接执行解析器->优化器->执行器的流程
- mysql的一大特色是提供了各种存储引擎以供选择，不同的存储引擎有各自的使用场景，可以针对每张表选择适合的存储引擎