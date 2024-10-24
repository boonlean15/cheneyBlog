# Select基础查询
SELECT 的作用是从一个表或多个表中检索出想要的数据行
## SELECT 查询的基础语法
### 查询列
对数据表中的某一列进行检索，在 SELECT 后面加上这个列的字段名即可。对多个列进行检索，在列名之间用逗号 (,) 分割即可
如果我们记不住所有的字段名称，可以使用 SELECT * 帮我们检索出所有的列
我们在做数据探索的时候，SELECT *还是很有用的，这样我们就不需要写很长的 SELECT 语句了。但是在生产环境时要尽量避免使用SELECT*，具体原因我会在后面讲。

### 起别名
```sql
SELECT name AS n, hp_max AS hm, mp_max AS mm, attack_max AS am, defense_max AS dm FROM heros
```
一般来说起别名的作用是对原有名称进行简化，从而让 SQL 语句看起来更精简.同样我们也可以对表名称起别名，这个在多表连接查询的时候会用到。
### 查询常数
SELECT 查询结果中增加一列固定的常数列,列的取值是我们指定的，而不是从数据表中动态取出的.
如果我们想整合不同的数据源，用常数列作为这个表的标记，就需要查询常数。
```sql
SELECT '王者荣耀' as platform, name FROM heros
SELECT 123 as platform, name FROM heros
```
- 单引号说明引号中的字符串是个常数
- 常数是英文字母，比如'WZRY'也需要加引号
- 常数是个数字，就可以直接写数字，不需要单引号
### 去除重复行
- 使用的关键字是 DISTINCT
- DISTINCT 需要放到所有列名的前面,如果写成SELECT name, DISTINCT attack_range FROM heros会报错
- DISTINCT 其实是对后面所有列名的组合进行去重,
  > 你能看到最后的结果是 69 条，因为这 69 个英雄名称不同，都有攻击范围（attack_range）这个属性值。如果你想要看都有哪些不同的攻击范围（attack_range），只需要写DISTINCT attack_range即可，后面不需要再加其他的列名了。
```sql
SELECT DISTINCT attack_range FROM heros
```
### 如何排序检索数据
需要使用 ORDER BY 子句,ORDER BY 子句有以下几个点需要掌握：
- 排序的列名：ORDER BY 后面可以有一个或多个列名
  > 如果是多个列名进行排序，会按照后面第一个列先进行排序，当第一列的值相同的时候，再按照第二列进行排序，以此类推。
- 排序的顺序：ORDER BY 后面可以注明排序规则
  > ASC 代表递增排序，DESC 代表递减排序。如果没有注明排序规则，默认情况下是按照 ASC 递增排序
  > 如果排序字段类型为文本数据，就需要参考数据库的设置方式了，这样才能判断 A 是在 B 之前，还是在 B 之后。比如使用 MySQL 在创建字段的时候设置为 BINARY 属性，就代表区分大小写。
- 非选择列排序：ORDER BY 可以使用非选择列进行排序
  > 即使在 SELECT 后面没有这个列名，你同样可以放到 ORDER BY 后面进行排序。
- ORDER BY 的位置：ORDER BY 通常位于 SELECT 语句的最后一条子句，否则会报错

```sql
//按照最大生命值从高到低的方式进行排序
SELECT name, hp_max FROM heros ORDER BY hp_max DESC 
//按照第一排序最大法力从低到高，当最大法力值相等的时候则按照第二排序进行，即最大生命值从高到低的方式进行排序
SELECT name, hp_max FROM heros ORDER BY mp_max, hp_max DESC  
```

### 约束返回结果的数量
约束返回结果的数量，使用 LIMIT 关键字
> 约束返回结果的数量可以减少数据表的网络传输量，也可以提升查询效率。如果我们知道返回结果只有 1 条，就可以使用LIMIT 1，告诉 SELECT 语句只需要返回一条记录即可
```sql
//按照最大生命值从高到低排序，返回 5 条记录即可
SELECT name, hp_max FROM heros ORDER BY hp_max DESC LIMIT 5
```

## SELECT 的执行顺序
理解 SELECT 语法的时候，还需要了解 SELECT 执行时的底层原理

- 关键字的顺序是不能颠倒的
  > SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ...
- SELECT 语句的执行顺序（在 MySQL 和 Oracle 中，SELECT 执行顺序基本相同）
  > FROM > WHERE > GROUP BY > HAVING > SELECT 的字段 > DISTINCT > ORDER BY > LIMIT

