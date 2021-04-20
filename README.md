# 仓库管理系统

## （一）指令（需要先build）
- 生成typeorm迁移脚本：typeorm migration:create -n ${表名称} -d src/migration
- 执行typeorm迁移脚本：typeorm migration:run -f ./dist/config/index -c postgres
- 回退：typeorm migration:revert -f ./dist/config/index -c postgres


## （二）环境
- nestjs+typeorm+ts+postgres

## （三）领域
- catagory：种类
- order：货单
- package：包裹
- splitLog：拆分记录
- stock：仓库

## （四）备注
- 包裹：异常包括损坏
- 仓库暂时不要容量这个概念
- 不要商品领域，包裹代替
- 分开商品和物品（物品种类）
- 暂时没有统一物品编码，假设categoryID就是物品编码
- typeorm不支持postgres的所有数组类型，暂时用simple-array解决
- expired_at是结束时间
- 取消订单退货操作
- splitLog记录下stockId

## （五）测试
1. 仓库A创建，不能重名：√
2. 仓库修改状态：√
3. 物品种类a和b新增，不能重名，remark可空：√
4. 种类修改remark：√
5. 创建一个采购单aa，种类包含a和b; 落库A，包裹1状态normal：√
6. ~~创建一个采购单bb，种类包含a和b; 退货，包裹2状态unusual：√~~
7. 包裹1从仓库A调配到仓库B，其中种类a物品打碎了1支（先拆包，再修改该包状态）：√
8. 创建采购单cc和dd，落库A，包裹3和4合并成包裹5：√
9. 包裹5出库：√