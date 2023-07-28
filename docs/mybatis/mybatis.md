# Mybatis

## 原始的JDBC操作
```java
public class JDBCDemo {
    public static void main(String[] args) throws Exception{
        //获取数据库连接对象
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db1","root","root");
        //定义sql语句
        String sql = "select * from db1.emp";
        //获取执行sql的对象Statement
        Statement stmt = conn.createStatement();
        //执行sql
        ResultSet resultSet = stmt.executeQuery(sql);
        //处理结果
        while(resultSet.next()) {             
            int id = resultSet.getInt(1);                    //获取id
            String name = resultSet.getString("ename");             //获取姓名
            System.out.println("id:" + id + " name:" + name);
        }
        //释放资源
        stmt.close();
        conn.close();
    }
}
```

### JDBC的缺点
- 数据库连接创建、释放频繁，系统资源浪费，影响系统性能
- sql语句硬编码，不易维护，sql变动需要改动java代码 
- 查询需要设置结果集到对象、插入需要将实体数据设置到sql语句的占位符位置
  
## mybatis概述

### 概述
> MyBatis 是一款优秀的持久层框架，它支持**定制化 SQL、存储过程**以及高级映射。MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。MyBatis 可以使用简单的 XML 或注解来配置和映射原生信息，将接口和 Java 的 POJOs(Plain Ordinary Java Object,普通的 Java对象)映射成数据库中的记录

### 特点
- 简单易学：本身就很小且简单。没有任何第三方依赖，最简单安装只要两个jar文件+配置几个sql映射文件。易于学习，易于使用。通过文档和源代码，可以比较完全的掌握它的设计思路和实现
- 灵活：mybatis不会对应用程序或者数据库的现有设计强加任何影响。 sql写在xml里，便于统一管理和优化。通过sql语句可以满足操作数据库的所有需求
- 解除sql与程序代码的耦合：通过提供DAO层，将业务逻辑和数据访问逻辑分离，使系统的设计更清晰，更易维护，更易单元测试。sql和代码的分离，提高了可维护性
- 提供映射标签，支持对象与数据库的ORM字段关系映射
- 提供对象关系映射标签，支持对象关系组建维护
- 提供xml标签，支持编写动态sql

### 总体流程
- 加载配置并初始化 将SQL的配置信息加载成为一个个MappedStatement对象。（包括了传入参数映射配置、执行的SQL语句、结果映射配置），存储在内存中。
- 接收调用请求  调用Mybatis提供的API、将请求传递给下层的请求处理层进行处理。
- 处理操作请求 根据SQL的ID查找对应的MappedStatement对象、根据传入参数对象解析MappedStatement对象，得到最终要执行的SQL和执行传入参数、获取数据库连接，根据得到的最终SQL语句和执行传入参数到数据库执行，并得到执行结果、根据MappedStatement对象中的结果映射配置对得到的执行结果进行转换处理，并得到最终的处理结果、释放连接资源、返回处理结果将最终的处理结果返回

### 功能架构
- API接口层：提供给外部使用的接口API，开发人员通过这些本地API来操纵数据库。接口层一接收到调用请求就会调用数据处理层来完成具体的数据处理
- 数据处理层：负责具体的SQL查找、SQL解析、SQL执行和执行结果映射处理等。它主要的目的是根据调用的请求完成一次数据库操作
- 基础支撑层：负责最基础的功能支撑，包括连接管理、事务管理、配置加载和缓存处理，这些都是共用的东西，将他们抽取出来作为最基础的组件。为上层的数据处理层提供最基础的支撑。

### 框架架构
- 加载配置：配置来源于两个地方，一处是配置文件，一处是Java代码的注解，将SQL的配置信息加载成为一个个MappedStatement对象（包括了传入参数映射配置、执行的SQL语句、结果映射配置），存储在内存中
- SQL解析：当API接口层接收到调用请求时，会接收到传入SQL的ID和传入对象（可以是Map、JavaBean或者基本数据类型），Mybatis会根据SQL的ID找到对应的MappedStatement，然后根据传入参数对象对MappedStatement进行解析，解析后可以得到最终要执行的SQL语句和参数。
- SQL执行：将最终得到的SQL和参数拿到数据库进行执行，得到操作数据库的结果。
- 结果映射：将操作数据库的结果按照映射的配置进行转换，可以转换成HashMap、JavaBean或者基本数据类型，并将最终结果返回

### 强大之处 
- 动态sql
- MyBatis 3 中有了许多的改进，现在只剩下差不多二分之一的元素。MyBatis使用了基于强大的OGNL表达式来消除了大部分元素

### mybatis缓存
mybatis缓存分为：一级缓存和二级缓存
- 查询顺序： 二级缓存->一级缓存->数据库
**一级缓存**
在同一个会话中Mybatis会自动将第一次查询的结果集缓存，后续的同一查询不再调用数据库查询，大大提升效率。
生命周期是一次会话，session关闭一级缓存就失效了。（sqlsession执行commit，清空sqlSession中的一级缓存，保证缓存中始终保存的是最新的信息，避免脏读）

**二级缓存**
需手动开启，mapper级别的缓存，同一个namespace共用这个缓存，对sqlsession是共享的。进入一级缓存查询前，现在CachingExecutor进行二级缓存的查询。











