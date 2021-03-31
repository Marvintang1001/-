# 仓储管理模型

## （一）指令
- 生成typeorm迁移脚本：typeorm migration:create -n ${表名称} -d src/migration

## （二）环境
- nestjs+typeorm+ts+postgres

## （三）领域
- catagory：种类
- order：货单
- package：拖（包裹）
- splitLog：拆分日志
- stock：仓库

## （四）备注
- 包裹：异常包括损坏
- 仓库暂时不要容量这个概念
- 不要商品领域，包裹代替
- 分开商品和物品（物品种类）
- 暂时没有统一物品编码，假设categoryID就是物品编码