/**
 * 采购操作
 */

import {Body, Controller, Post} from '@nestjs/common';

import {AbcPackage} from '@app/domain/package/interface/service';
import {ApplyDto} from './dto/purchase';
import {AbcOrder} from '@app/domain/order/interface/service';
import {AbcOrderQueryRepo} from '@app/domain/order/interface/repository';
import {AbcStockQueryRepo} from '@app/domain/stock/interface/repository';
import {AbcCatagoryQueryRepo} from '@app/domain/catagory/interface/repository';


@Controller('purchase')
export class PurchaseController {

    constructor (
        private readonly packageService : AbcPackage,
        private readonly orderService : AbcOrder,
        private readonly stockQuery : AbcStockQueryRepo,
        private readonly orderQuery : AbcOrderQueryRepo,
        private readonly catagoryQuery : AbcCatagoryQueryRepo,
    ) {}

    // 采购申请
    @Post('apply')
    async apply (@Body() {content, stockId, origin, remark} : ApplyDto) {
        const stock = await this.stockQuery.fetchOne({id : parseInt(stockId)});
        if (!stock) {
            return {code : 1001, error : '无效的目的仓库id'};
        }
        const codeList = content.map(x => x.code);  // 假设在dto已经保证code无重复
        const catagoryList = await this.catagoryQuery.fetchMany({idList : codeList});
        if (codeList.length != catagoryList.length) {
            return {code : 1002, error : '存在无效物品种类'};
        }
        const package_ = await this.packageService.create({
            status : 'normal', content, stockId : origin,
        });

        const order = await this.orderService.create({
            origin, target : stockId, packageId : package_.id, type : 'purchase',
            status : 'process', remark,
        });
        return {code : 0, data : order};
    }

}
