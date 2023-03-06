# Spring cloud eureka

基于REST的服务发现组件

## 服务发现概述

1.服务发现由来
> 跟软件开发的架构方式的演进有着密切关系
* 单体架构，调用其他服务的时候，通过api方式调用
* soa 服务拆分，服务之间互相调用，服务提供者和服务消费者通过配置多个服务实例的访问地址实现调用
* 微服务 docker容器化，服务不再固定部署在服务器上，ip变化频繁，此时服务注册中心的出现则变得迫切、其他的服务组件例如网关等都通过访问服务注册中心来获取服务实例列表，实现动态路由

2.服务发现技术选型
> 根据CAP选型，是AP还是CP，采用的语言是什么，比如eureka和nacos采用的是java语言，eureka是AP，zookeeper是CP

## eureka的核心类

* InstanceInfo 代表注册的服务实例
* LeaseInfo 服务实例的租约信息
* ServiceInstance 服务发现的实例信息的抽象接口，约定服务实例有哪些通用的信息
* InstanceStatus 服务实例的状态

## 服务的核心操作

* 服务注册 register
* 服务下线 cancel
* 服务租约 renew
* 服务剔除 evict
  
> LeaseManager和LookupService是eureka关于服务发现相关操作定义的接口类

* LeaseManager 
> 定义了服务实例的regist、cancel、renew、evict操作方法
* LookupService 
> 定义了eureka client从服务中心获取服务实例的查询方法

## eureka的设计理念

* 服务实例如何注册到服务中心
  > 服务启动的时候调用REST api的register方法注册服务实例信息
* 服务实例如何从服务中心剔除
  > 正常情况，服务实例关闭的时候，调用钩子方法或其他生命周期回调方法，删除自身服务实例信息。服务实例挂掉或异常情况，通过租约续租的方式，通过心跳证明服务实例存活，如租约逾期，服务中心删除服务实例信息。
* 服务实例一致性问题
  > 服务实例本身应该是个集群，服务实例注册信息如何在集群中保持一致。主要由下面：AP优于CP、peer to peer 架构、zone及region设计、self preservation设计

## AP优于CP

* CAP理论
  * Consistency 数据一致性 对数据更新操作成功之后，要求副本之间数据保持一致性
  * Availability 可用性 客户端对集群进行读写操作，请求能够正常响应
  * Partition Tolerance 分区容错性 通信故障时，集群被分割为多个分区，集群仍然可用
    > 分布式系统，网络条件不可控，网络分区不可避免，系统必须具备分区容错性
    > > zookeeper采用“CP”，默认非强一致性，实例同步过半数时，则返回。如采用强一致性，则需要访问到服务实例时，sync操作同步信息。但无法保证availability

    > > Eureka网络分区不可用不可避免，选择拥抱服务实例不可用的问题，实现AP。服务注册中心保留可用及过期数据，比丢失数据来的好。

## peer to peer 架构
  * 主从复制 master-slave模式，主节点负责写操作，从节点从主节点复制更新数据。主节点的写操作压力是系统的瓶颈，但从节点可分担读操作
  * peer to peer 对等复制，任何副本都可以接受写操作，每个副本之间进行数据更新。数据同步和数据冲突处理是一个棘手的问题
    > eureka采用peer to peer
    * 客户端
      * 优先选择相同分区的server，没有则采用defaultZone
      * 可用和不可用server列表，可用server列表每隔一段时间刷新，避免访问顺序造成的server压力
    * 服务端
      * server本身也是client，启动时，register并syncUp操作同步数据
      * header_replication标识时复制操作，避免server之间复制死循环
      * lastDirtyTime 对比，如果大于，server数据之间冲突，要求重新register、如果小于，如果是peer节点的复制，则要求其同步自己的最新数据
      * heartbeat心跳，服务实例的renewLease操作，如发现数据不一致，要求重新register

## zone和region
   * eureka基于amazon开发，region代表区域。region下有多个availabilityZone，每个zone下可以有多个server服务实例
   * region之间不会进行复制，zone下的server服务实例是peer节点，构成复制
   * ribbon支持zoneAffinity，客户端路由或网关路由时，优先选择与自身实例在同一个zone的服务实例

## self preservation
   * 心跳保持租约，server通过实例数计算每分钟应该收到的心跳数
   * 最近一分钟的心跳数如果小于或等于指定阈值，则关闭租约失效剔除，以保护注册信息
