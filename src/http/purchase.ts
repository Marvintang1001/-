

import {Body, Controller, Post, Req, ForbiddenException} from '@nestjs/common';

import {AbcPackage} from '@app/domain/package/interface/service';
import {ApplyDto, ConfirmDto} from './dto/purchase';
import {AbcOrder} from '@app/domain/order/interface/service';
import {AbcOrderQueryRepo} from '@app/domain/order/interface/repository';
import {AbcStockQueryRepo} from '@app/domain/stock/interface/repository';
import {either} from '@app/tool/functor';


@Controller('purchase')
export class PurchaseController {

    constructor (
        private readonly packageService : AbcPackage,
        private readonly orderService : AbcOrder,
        private readonly stockQuery : AbcStockQueryRepo,
        private readonly orderQuery : AbcOrderQueryRepo,
    ) {}

    // 采购申请
    @Post('apply')
    async apply (@Body() body : ApplyDto) {
        const {merchandiseId, capacity, origin, target, remark} = body;
        const package_ = await this.packageService.create({
            merchandiseId, capacity, status : 'normal', path : origin,
        });
        const stock = await this.stockQuery.fetchOne({id : target});
        if (!stock) {
            return {code : 1, error : '无效的目的仓库id'};
        }
        const order = await this.orderService.create({
            origin, target, packageId : package_.id, type : 'purchase',
            status : 'start', remark,
        });
        return {code : 0, data : order};
    }

    // 落库
    @Post('inStock')
    async inStock (@Body() {id} : ConfirmDto) {
        const order = await this.orderQuery.fetchOne({id});
        if (!order || order.status != 'start') return {code : 2, error : '无效的货单id'};
        return either(
            ok => ({code : 0, data : ok}),
            err => ({code : 3, error : '该仓库已满或暂不可用'}),
            await this.orderService.inStock(order)
        );
    }

    // 退货
    @Post('return')
    async return (@Body() {id} : ConfirmDto) {
        const order = await this.orderQuery.fetchOne({id});
        if (!order || order.status != 'start') return {code : 2, error : '无效的货单id'};
        const result = await this.orderService.modify(order, {status : 'return'});
        return {code : 0, data : result};
    }

}
