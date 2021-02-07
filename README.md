# 仓储管理模型

## （一）设计
- 见《库存管理2.0.xmind》


## （二）环境
- nestjs+typeorm+ts+mongodb

## （三）领域
- catagory：种类
- merchandise：商品
- order：货单
- package：拖（包裹）
- splitLog：拆分日志
- stock：仓库
- user：用户

## （四）备注
- 考虑换成mysql可以使用事务，多表同步修改
