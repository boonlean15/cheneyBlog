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




