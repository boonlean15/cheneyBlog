# Linux常用命令

## docker清理常用命令
### docker 命令清除
- docker system df
  > 可用于查询镜像（Images）、容器（Containers）和本地卷（Local Volumes）等空间使用大户的空间占用情况。
- docker system df -v 查看详细信息
- docker system prune --help
  > 该指令默认会清除所有如下资源：已停止的容器（container）、未被任何容器所使用的卷（volume)、未被任何容器所关联的网络（network）、所有悬空镜像（image）。该指令默认只会清除悬空镜像，未被使用的镜像不会被删除。添加-a 或 --all参数后，可以一并清除所有未使用的镜像和悬空镜像。可以添加-f 或 --force参数用以忽略相关告警确认信息。
- docker image prune：删除悬空的镜像
- docker container prune：删除无用的容器
  > 以使用--filter标志来筛选出不希望被清理掉的容器。例子：清除掉所有停掉的容器，但24内创建的除外：docker container prune --filter "until=24h"  
- docker volume prune：删除无用的卷
- docker network prune：删除无用的网络

### 手动清除
- 删除所有悬空镜像，不删除未使用镜像
  > docker rmi $(docker images -f "dangling=true" -q)
- 删除所有未使用镜像和悬空镜像
  > docker rmi $(docker images -q)
- 删除所有未被容器引用的卷
  > docker volume rm $(docker volume ls -qf dangling=true)
- 删除所有已退出的容器
  > docker rm -v $(docker ps -aq -f status=exited)
- 删除所有状态为dead的容器
  > docker rm -v $(docker ps -aq -f status=dead)

### 对标准输入日志大小与数量进行限制
- 新建或修改/etc/docker/daemon.json，添加log-dirver和log-opts参数,vi /etc/docker/daemon.json
```json
{
   "log-driver":"json-file",
   "log-opts": {"max-size":"3m", "max-file":"1"}
}
```
- 重启docker的守护线程
```shell
systemctl daemon-reload
systemctl restart docker
```

### 重新加载 docker
```shell
systemctl daemon-reload
systemctl restart docker
systemctl enable docker
```

### docker日志清理
- overlay2的同级目录下会有如下的目录，用大量空间的日志文件位于containers下
- 在目录中会存在以目录名为前缀，以“-json.log”为后缀的目录文件
- 可使用如下命令对该文件的内容进行清理
- > cat /dev/null -> *-json.log , 在此执行df -h命令之后，你会发现overlay2所占的磁盘空间已经减小。


## 查看磁盘使用情况
- df -h 总览查看磁盘使用情况
- 深挖每一层文件夹路径的情况
  > du -h --max-depth=1 
- ls -lh 以我们熟悉的计算方式查看文件大小
- 查询文件夹中文件数量的方法
  - > find /path/to/folder -type f | wc -l  将/path/to/folder替换为你要查询的文件夹路径
  - > ls -l | grep "^-" | wc -l 使用grep命令过滤出以-开头的行（表示文件），然后使用wc -l命令统计行数，即文件数量。
  - > ls -p | grep -v / | wc -l 使用grep -v /命令过滤掉以/结尾的行（表示子文件夹），然后使用wc -l命令统计行数，即文件数量。

### 查找系统中的大文件
- 查找指定目录下所有大于100M的所有文件
 > find /var/lib/docker/overlay2/ -type f -size +100M -print0 | xargs -0 du -h | sort -nr 


## 迁移 /var/lib/docker 目录

```shell
systemctl stop docker
mkdir -p /home/docker/lib
rsync -avz /var/lib/docker /home/docker/lib/
sudo mkdir -p /etc/systemd/system/docker.service.d/
sudo vi /etc/systemd/system/docker.service.d/devicemapper.conf

[Service]
ExecStart=
ExecStart=/usr/bin/dockerd  --graph=/home/docker/lib/docker

systemctl daemon-reload
systemctl restart docker
systemctl enable docker
docker info
```
> 显示  Docker Root Dir: /home/docker/lib/docker 确定容器没问题后删除/var/lib/docker/目录中的文件
