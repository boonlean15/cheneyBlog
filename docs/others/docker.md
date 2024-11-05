# docker 磁盘问题处理

## docker 日志问题
> Docker容器的日志默认存储位置是/var/lib/docker/containers/<container-id>/目录下的container-logs.json文件。
> 要清理这些日志，可以手动删除这些文件，或者使用Docker自身的清理机制。
- 查看文件占用大小
```shell
du -h --max-depth=1 /var/lib/docker

# 查看最新N行的数据，N是一个整数
docker logs --tail N container name
```

## 删除容器后清理容器存储卷
> 使用Docker删除一个镜像时，Docker默认不会删除与该镜像相关联的卷。这是为了保证数据的安全性和可移植性。如果你确实想删除与某个镜像相关联的卷，你需要手动进行. 
> **注意：在执行这些操作之前，请确保你已经备份了所有重要的数据**

- 首先，删除与镜像关联的所有容器
- 然后，删除镜像
- 最后，删除未被任何容器使用的卷
```shell
# 删除与镜像<image_name>关联的所有容器
docker rm $(docker ps -a -q -f ancestor=<image_name>)

# 删除镜像
docker rmi <image_name>

# 删除未被容器使用的卷
docker volume rm $(docker volume ls -qf dangling=true)

# 将 <image_name> 替换为你想要删除的镜像名称
```

## /var/lib/docker/volumes 磁盘占用过大的问题。
```shell
# 清理不再使用的容器和镜像：这个命令会删除所有未使用的容器、未挂载的镜像和悬空的网络。
docker system prune
# 清理悬空的镜像和未使用的网络：
docker image prune
docker network prune
# 清理特定容器和卷所占用的空间：
# 首先，停止并删除不需要的容器。然后，删除无用的卷：
docker volume rm <volume_name>
# 如果需要删除所有未使用的卷，可以使用以下脚本
docker volume rm $(docker volume ls -qf dangling=true)
```

> 如果上述方法无法释放足够的空间，可能需要更深入地检查哪些卷占用了大量空间，并决定是否可以删除或迁移这些卷。
> 最后，可以考虑清理其他不需要的文件或者日志，如系统日志等，确保不会影响系统的正常运行。
> 注意：在执行任何清理操作前，请确保不会删除重要或正在使用的数据。如果不确定，请备份相关数据。
> 
## linux 按条件删除文件
> 在Linux中，可以使用find命令配合其他命令来按条件删除文件。以下是一些常见的删除文件的例子：
> 请根据实际需求调整上述命令中的路径、文件名模式、时间条件或大小条件。在运行删除命令之前，请务必确认命令的正确性，以防误删除重要文件
```shell
# 删除当前目录下所有.txt文件
find . -type f -name "*.txt" -exec rm -f {} \;

# 删除当前目录下修改时间超过7天的文件
find . -type f -mtime +7 -exec rm -f {} \;

# 删除指定目录下所有空目录
find /path/to/directory -type d -empty -exec rmdir {} \;

# 删除指定大小以上的文件
find /path/to/directory -type f -size +100M -exec rm -f {} \;
```

## psql 删除10天前数据
```sql
select create_time from custom_nr_performance_day order by create_time desc limit 1;

delete from custom_nr_performance_day where create_time < '2024-10-14 10:38:23'; now() - interval '10 days';

select count(1) from custom_nr_performance_day;

-- 使用psql命令行工具，您可以直接运行上面的SQL命令
psql -d your_database -c "DELETE FROM your_table WHERE date_column < now() - interval '10 days';"


-- 看这个表的状态信息 n_live_tup          | 12674745   #表示当前表的数据量，n_dead_tup          | 37325572   #表示为回收的空间
select * from pg_stat_user_tables where relname='custom_nr_performance_hour';

select pg_size_pretty(pg_relation_size('custom_nr_performance_hour')) as size;

VACUUM FULL custom_nr_performance_day;

-- 释放特定表的空间
VACUUM (FULL, VERBOSE, ANALYZE) table_name;
 
-- 或者，对整个数据库执行VACUUM
VACUUM (FULL, VERBOSE, ANALYZE);

中文表名	英文表名	用途说明
现网基站版本	cmp_basedata_network_basestation_version	存储现网基站版本
现网板卡数据	cmp_basedata_network_piece_msg	存储现网板卡数据
EOMS工单基础信息	cmp_emos_record	存储EOMS工单基础信息
4G性能数据_天_自定义指标	custom_lte_performance_day	全量性能数据入库
4G性能数据_小时_自定义指标	custom_lte_performance_hour	全量性能数据入库
5G性能数据_天_自定义指标	custom_nr_performance_day	全量性能数据入库
5G性能数据_小时_自定义指标	custom_nr_performance_hour	全量性能数据入库
```

 
select T.PID,T.STATE,T.QUERY,T.WAIT_EVENT_TYPE,T.WAIT_EVENT,T.QUERY_START from PG_STAT_ACTIVITY T where T.DATNAME = 'cmdi_cmp';


TRUNCATE custom_lte_performance_hour_history;

DROP TABLE IF EXISTS custom_lte_performance_hour_history;




