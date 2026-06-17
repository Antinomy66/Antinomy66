# Hadoop 入门笔记

## 什么是 Hadoop

Hadoop 是一个由 Apache 基金会开发的分布式系统基础架构，主要用于解决大数据的存储和计算问题。

## 核心组件

### HDFS（分布式文件系统）
- **NameNode**：管理元数据
- **DataNode**：存储实际数据
- **Secondary NameNode**：辅助 NameNode

### MapReduce（分布式计算框架）
- **Map 阶段**：将任务分解成小任务
- **Reduce 阶段**：汇总结果

### YARN（资源调度）
- **ResourceManager**：全局资源管理
- **NodeManager**：节点资源管理

## 安装步骤

1. 安装 JDK（Java 8 或 11）
2. 配置 SSH 免密登录
3. 下载 Hadoop 安装包
4. 修改配置文件：core-site.xml, hdfs-site.xml, mapred-site.xml, yarn-site.xml
5. 格式化 NameNode
6. 启动集群

## 常用命令

`ash
hdfs dfs -ls /
hdfs dfs -put local_file hdfs_path
hdfs dfs -get hdfs_path local_file
`

> 注意：生产环境中建议使用高可用（HA）架构。