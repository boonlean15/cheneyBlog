# 常用统计和其他sql

## Postgresql去除完全相同的数据 
[参考Postgresql 如何去除完全相同的数据](https://zhuanlan.zhihu.com/p/642309567?utm_id=0)
- 去重思路
>  主要的思路是找到字段的唯一条件，根据字段取出掉重复记录。Postgresql的去重是通过 ctid 完成的。注意本文针对的是 单表 的数据库数据去重处理。
> 
> ctid 是什么？ ctid： 表示数据记录的物理行当信息，指的是 一条记录位于哪个数据块的哪个位移上面。

- 数据查看
  ```sql 
  select ctid, * from emp;
  ```
- 重复数据查询
  ```sql
  select distinct id, count(*) from emp group by id having count(*) > 1;
  ```
- 保留需要的数据
  ```sql
  select ctid, * from emp where ctid in (select min(ctid) from emp group by id);
    ctid	id	name
    (0,1)	1	david
    (0,4)	2	sandy
    (0,6)	3	renee
    (0,7)	4	jack
    (0,8)	5	rose
  ```
- 删除重复数据
  ```sql
  delete from emp where ctid not in (select min(ctid) from emp group by id);
  ```
- 查看最后结果
  ```sql
  select ctid, * from emp;
    ctid	id	name
    (0,1)	1	david
    (0,4)	2	sandy
    (0,6)	3	renee
    (0,7)	4	jack
    (0,8)	5	rose
  ```

**关于Postgresql去重的小技巧，不同数据库实现细节不同，但是多数的思路是类似的**

### 数据库字段做了脱敏处理：

- 通过查询找出当前表的重复记录
- 删除重复数据（PS：如果重复数据是海量数据，需要使用 limit 配合 for 循环进行多次处理，不允许一次性大批量删除数据）
- 检查去重之后的结果

```sql
begin;
-- 通过查询找出当前表的重复记录
select ctid, * from results where ctid in (select min(ctid) from results  where code = 'BANK1' and status = 0 group by trade_numeber) and code = 'BANK1' and status = 0 order by trade_numeber;

-- 删除重复数据
-- 如果这里有海量数据，需要使用limit配合for循环进行多次处理，不允许一次性大批量删除数据
delete from results where ctid in (select min(ctid) from results  where code = 'BANK1' and status = 0 group by trade_numeber) and code = 'BANK1' and status = 0 order by trade_numeber;

-- 检查去重之后的结果
select * from results where code = 'BANK1' and status = 0 ;
commit;
```

## 数据备份
### 备份单表数据
```shell
docker exec -it postgres pg_dump -U postgres -d cmp -t order  -f order.sql
docker exec -it postgres pg_dump -U postgres -d cmp  -t change_list -f change_list.sql
```
### 备份数据库结构
```shell
docker exec -it postgres pg_dump -U postgres -s cmdi_cmp  -f cmdi_cmp_schema_full.sql
```

## pg查看表结构信息
- 通过命令行查询
```shell
\d 数据库 —— 得到所有表的名字
\d 表名 —— 得到表结构
``` 
- 通过SQL语句查询
```shell
"select * from pg_tables" —— 得到当前db中所有表的信息
"select tablename from pg_tables where schemaname='public'" —— 得到所有用户自定义表的名字
select count(tablename) from pg_tables where schemaname='public' --- 得到用户自定义表数量
# "tablename"字段是表的名字 "schemaname"是schema的名字 用户自定义的表，如果未经特殊处理，默认都是放在名为public的schema下
```

## 统计大小
- 统计数据库大小
```shell
单个数据库的大小
select datname, pg_size_pretty (pg_database_size(datname)) AS size from pg_database where datname = 'cmp'; 
所有数据库的大小
select datname, pg_size_pretty (pg_database_size(datname)) AS size from pg_database;
```
- 统计数据表大小
```shell
单个表大小
select pg_size_pretty(pg_relation_size(‘mytab’)) as size;
查询单个表的总大小，包括该表的索引大小
select pg_size_pretty(pg_total_relation_size(‘tab’)) as size;
所有表大小
select relname, pg_size_pretty(pg_relation_size(relid)) from pg_stat_user_tables order by pg_relation_size(relid) desc;
```
- 查询单个表的数据大小，索引大小，表大小，并按表大小倒序排列
```sql
SELECT
    table_name,
    pg_size_pretty(table_size) AS table_size,
    pg_size_pretty(indexes_size) AS indexes_size,
    pg_size_pretty(total_size) AS total_size
FROM (
    SELECT
        table_name,
        pg_table_size(table_name) AS table_size,
        pg_indexes_size(table_name) AS indexes_size,
        pg_total_relation_size(table_name) AS total_size
    FROM (
        SELECT ('"' || table_schema || '"."' || table_name || '"') AS table_name
        FROM information_schema.tables
    ) AS all_tables
    ORDER BY total_size DESC
) AS pretty_sizes;
```
- 所有表的记录数
```shell
select relname as TABLE_NAME, reltuples as rowCounts from pg_class where relkind = 'r' order by rowCounts desc
```
- 查询数据库及大小
```sql
select pg_database.datname, pg_size_pretty (pg_database_size(pg_database.datname)) AS size from pg_database;
```
- 参考

[POSTGRESQL 查看数据库 数据表大小](https://www.cnblogs.com/liqiu/p/3922288.html)

[PostgreSQL 查询所有数据库大小，表大小，索引大小，以及表空间大小](https://www.cnblogs.com/telwanggs/p/13645310.html)

[PostgreSQL查询出所有表的记录数](https://blog.csdn.net/leo_qi/article/details/84804644)

[PostgreSQL Daily Maintenance - reindex](https://blog.csdn.net/DB_su/article/details/77935740)

[Postgresql 删除大量数据优化表空间](https://zhuanlan.zhihu.com/p/592895865)

[PostgreSQL数据库磁盘空间占用剧增后的解决方法](https://www.alibabacloud.com/help/zh/apsaradb-for-rds/latest/solutions-to-sharp-increase-in-disk-space-usage-in-postgresql-or-ppas-databases)


## 查询数据库空间(mysql和oracle)
### Mysql版
```shell
查看所有数据库容量大小
-- 查看所有数据库容量大小
SELECT
    table_schema AS '数据库',
    sum( table_rows ) AS '记录数',
    sum(
    TRUNCATE ( data_length / 1024 / 1024, 2 )) AS '数据容量(MB)',
    sum(
    TRUNCATE ( index_length / 1024 / 1024, 2 )) AS '索引容量(MB)' 
FROM
    information_schema.TABLES 
GROUP BY
    table_schema 
ORDER BY
    sum( data_length ) DESC,
    sum( index_length ) DESC;

查看所有数据库各表容量大小
SELECT
    table_schema AS '数据库',
    table_name AS '表名',
    table_rows AS '记录数',
    TRUNCATE ( data_length / 1024 / 1024, 2 ) AS '数据容量(MB)',
    TRUNCATE ( index_length / 1024 / 1024, 2 ) AS '索引容量(MB)' 
FROM
    information_schema.TABLES 
ORDER BY
    data_length DESC,
    index_length DESC;

查看指定数据库容量大小
SELECT
    table_schema AS '数据库',
    sum( table_rows ) AS '记录数',
    sum(
    TRUNCATE ( data_length / 1024 / 1024, 2 )) AS '数据容量(MB)',
    sum(
    TRUNCATE ( index_length / 1024 / 1024, 2 )) AS '索引容量(MB)' 
FROM
    information_schema.TABLES 
WHERE
    table_schema = '数据库名';

查看指定数据库各表容量大小
SELECT
    table_schema AS '数据库',
    table_name AS '表名',
    table_rows AS '记录数',
    TRUNCATE ( data_length / 1024 / 1024, 2 ) AS '数据容量(MB)',
    TRUNCATE ( index_length / 1024 / 1024, 2 ) AS '索引容量(MB)' 
FROM
    information_schema.TABLES 
WHERE
    table_schema = '数据库名' 
ORDER BY
    data_length DESC,
    index_length DESC;

查看指定数据库各表信息
SHOW TABLE STATUS;
```

### oracle版
```shell
查看表所占的空间大小
--  不需要DBA权限
SELECT SEGMENT_NAME TABLENAME,(BYTES/1024/1024) MB
,RANK() OVER (PARTITION BY NULL ORDER BY BYTES DESC) RANK_ID  //根据表大小进行排序
FROM USER_SEGMENTS
WHERE SEGMENT_TYPE='TABLE'

-- 需要DBA权限,一般情况下很少会给这么高的权限,可以说这个权限基本没有,所以一般工作中不是DBA的人不会常用到这个命令
SELECT t.tablespace_name, round(SUM(bytes / (1024 * 1024)), 0) ts_size 
FROM dba_tablespaces t, dba_data_files d 
WHERE t.tablespace_name = d.tablespace_name 
GROUP BY t.tablespace_name; 
 

查看表空间的使用情况
SELECT a.tablespace_name "表空间名称",
       total / (1024 * 1024) "表空间大小(M)",
       free / (1024 * 1024) "表空间剩余大小(M)",
       (total - free) / (1024 * 1024 ) "表空间使用大小(M)",
       total / (1024 * 1024 * 1024) "表空间大小(G)",
       free / (1024 * 1024 * 1024) "表空间剩余大小(G)",
       (total - free) / (1024 * 1024 * 1024) "表空间使用大小(G)",
       round((total - free) / total, 4) * 100 "使用率 %"
FROM (SELECT tablespace_name, SUM(bytes) free
      FROM dba_free_space
      GROUP BY tablespace_name) a,
     (SELECT tablespace_name, SUM(bytes) total
      FROM dba_data_files
      GROUP BY tablespace_name) b
WHERE a.tablespace_name = b.tablespace_name

查看回滚段名称及大小
SELECT segment_name, 
tablespace_name, 
r.status, 
(initial_extent / 1024) initialextent, 
(next_extent / 1024) nextextent, 
max_extents, 
v.curext curextent 
FROM dba_rollback_segs r, v$rollstat v 
WHERE r.segment_id = v.usn(+) 
ORDER BY segment_name; 

查看控制文件
SELECT NAME FROM v$controlfile; 

查看日志文件
SELECT MEMBER FROM v$logfile; 

查看数据库对象
SELECT owner, object_type, status, COUNT(*) count# 
FROM all_objects 
GROUP BY owner, object_type, status; 

查看数据库版本
SELECT version 
FROM product_component_version 
WHERE substr(product, 1, 6) = 'Oracle'; 

查看数据库的创建日期和归档方式
SELECT created, log_mode, log_mode FROM v$database; 

查看表空间是否具有自动扩展的能力
SELECT T.TABLESPACE_NAME,D.FILE_NAME,
D.AUTOEXTENSIBLE,D.BYTES,D.MAXBYTES,D.STATUS
FROM DBA_TABLESPACES T,DBA_DATA_FILES D
WHERE T.TABLESPACE_NAME =D.TABLESPACE_NAME
 ORDER BY TABLESPACE_NAME,FILE_NAME;

oracle加强版
一、查看表空间使用率
1.查看数据库表空间文件:
--查看数据库表空间文件
select * from dba_data_files;

--查看所有表空间的总容量
select dba.TABLESPACE_NAME, sum(bytes)/1024/1024 as MB  
from dba_data_files dba 
group by dba.TABLESPACE_NAME;

--查看数据库表空间使用率
select total.tablespace_name,round(total.MB, 2) as Total_MB,round(total.MB - free.MB, 2) as Used_MB,round((1-free.MB / total.MB)* 100, 2) || '%' as Used_Pct 
from (
select tablespace_name, sum(bytes) /1024/1024 as MB 
from dba_free_space group by tablespace_name) free,
(select tablespace_name, sum(bytes) / 1024 / 1024 as MB 
from dba_data_files group by tablespace_name) total     
where free.tablespace_name = total.tablespace_name 
order by used_pct desc;

--查看表空间总大小、使用率、剩余空间
select a.tablespace_name, total, free, total-free as used, substr(free/total * 100, 1, 5) as "FREE%", substr((total - free)/total * 100, 1, 5) as "USED%"
from
(select tablespace_name, sum(bytes)/1024/1024 as total from dba_data_files group by tablespace_name) a,
(select tablespace_name, sum(bytes)/1024/1024 as free from dba_free_space group by tablespace_name) b
where a.tablespace_name = b.tablespace_name
order by a.tablespace_name

--查看表空间使用率(包含临时表空间)
select * from (
Select a.tablespace_name,
(a.bytes- b.bytes) "表空间使用大小(BYTE)",
a.bytes/(1024*1024*1024) "表空间大小(GB)",
b.bytes/(1024*1024*1024) "表空间剩余大小(GB)",
(a.bytes- b.bytes)/(1024*1024*1024) "表空间使用大小(GB)",
to_char((1 - b.bytes/a.bytes)*100,'99.99999') || '%' "使用率"
from (select tablespace_name,
sum(bytes) bytes
from dba_data_files
group by tablespace_name) a,
(select tablespace_name,
sum(bytes) bytes
from dba_free_space
group by tablespace_name) b
where a.tablespace_name = b.tablespace_name
union all
select c.tablespace_name,
d.bytes_used "表空间使用大小(BYTE)",
c.bytes/(1024*1024*1024) "表空间大小(GB)",
(c.bytes-d.bytes_used)/(1024*1024*1024) "表空间剩余大小(GB)",
d.bytes_used/(1024*1024*1024) "表空间使用大小(GB)",
to_char(d.bytes_used*100/c.bytes,'99.99999') || '%' "使用率"
from
(select tablespace_name,sum(bytes) bytes
from dba_temp_files group by tablespace_name) c,
(select tablespace_name,sum(bytes_cached) bytes_used
from v$temp_extent_pool group by tablespace_name) d
where c.tablespace_name = d.tablespace_name
)
order by tablespace_name

--查看具体表的占用空间大小
select * from (
select t.tablespace_name,t.owner, t.segment_name, t.segment_type, sum(t.bytes / 1024 / 1024) mb
from dba_segments t
where t.segment_type='TABLE'
group by t.tablespace_name,t.OWNER, t.segment_name, t.segment_type
) t
order by t.mb desc


扩展大小或增加表空间文
更改表空间的dbf数据文件分配空间大小
alter database datafile ‘...\system_01.dbf' autoextend on;
alter database datafile ‘...\system_01.dbf' resize 1024M;

为表空间新增一个数据文件(表空间满32G不能扩展则增加表空间文件)
alter tablespace SYSTEM add datafile '/****' size 1000m autoextend on next 100m;

如果是temp临时表新增表空间会报错:
0RA-03217: 变更TEMPORARY TABLESPACE 无效的选项
解决方法: datafile改为tempfile
alter tablespace TEMP01 add tempfile'/****' size 1000m autoextend on next 100m maxsize 10000m

针对temp临时表空间使用率爆满问题
临时表空间主要用途是在数据库进行排序运算、管理索引、访问视图等操作时提供临时的运算空间，当运算完成之后系统会自动清理，但有些时候我们会遇到临时段没有被释放，TEMP表空间几乎满使用率情况；
引起临时表空间增大主要使用在以下几种情况：
1、order by or group by (disc sort占主要部分)；
2、索引的创建和重创建；
3、distinct操作；
4、union & intersect & minus sort-merge joins；
5、Analyze 操作；
6、有些异常也会引起TEMP的暴涨。
解决方法一：用上述方法给temp增加表空间文件
解决方法二：在服务器资源空间有限的情况下，重新建立新的临时表空间替换当前的表空间
--1.查看当前的数据库默认表空间：
select * from database_properties
where property_name='DEFAULT_TEMP_TABLESPACE';
 
--2.创建新的临时表空间
create temporary tablespace TEMP01 tempfile 
'/home/temp01.dbf' size 31G;
 
--3.更改默认临时表空间
alter database default temporary tablespace TEMP01;
 
--4.删除原来的临时表空间
drop tablespace TEMP02 including contents and datafiles;
 
--如果删除原来临时表空间报错ORA-60100：由于排序段，已阻止删除表空间...
--（说明有语句正在使用原来的临时表空间，需要将其kill掉再删除，此语句多为排序的语句）
--查询语句
Select se.username,se.sid,se.serial#,su.extents,su.blocks*to_number(rtrim(p.value))as Space,
tablespace,segtype,sql_text
from v$sort_usage su,v$parameter p,v$session se,v$sql s
where p.name='db_block_size' and su.session_addr=se.saddr and s.hash_value=su.sqlhash
and s.address=su.sqladdr
order by se.username,se.sid;
 
--删除对应的'sid,serial#'
alter system kill session 'sid,serial#'

附：查看表空间是否具有自动扩展的能力
--查看表空间是否具有自动扩展的能力     
SELECT T.TABLESPACE_NAME,D.FILE_NAME,     
D.AUTOEXTENSIBLE,D.BYTES,D.MAXBYTES,D.STATUS     
FROM DBA_TABLESPACES T,DBA_DATA_FILES D     
WHERE T.TABLESPACE_NAME =D.TABLESPACE_NAME     
 ORDER BY TABLESPACE_NAME,FILE_NAME;
```