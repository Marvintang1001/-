

import {Body, Controller, Post, Req, ForbiddenException} from '@nestjs/common';

import {DeployDto, ConfirmDto, SaleDto} from './dto/order';
import {AbcOrder} from '@app/domain/order/interface/service';
import {AbcOrderQueryRepo} from '@app/domain/order/interface/repository';
import {AbcStockQueryRepo} from '@app/domain/stock/interface/repository';
import {either} from '@app/tool/functor';
import {AbcPackageQueryRepo} from '@app/domain/package/interface/repository';


@Controller('order')
export class OrderController {

    constructor (
        private readonly orderService : AbcOrder,
        private readonly stockQuery : AbcStockQueryRepo,
        private readonly orderQuery : AbcOrderQueryRepo,
        private readonly packageQuery : AbcPackageQueryRepo,
    ) {}

    /**
     * 订单操作：调配或出货
     */
    @Post('deploy')
    async apply (@Body() body : DeployDto) {
        const {packageId, origin, target, remark, type} = body;
        const originStock = await this.stockQuery.fetchOne({id : parseInt(origin)});
        if (!originStock) {
            return {code : 2001, error : '无效的发货仓库id'};
        }
        const package_ = await this.packageQuery.fetchOne({id : packageId});
        if (package_?.status != 'normal') {
            return {code : 2003, error : '非法的包裹或包裹不存在'};
        }
        if (package_.stockId != origin) {
            return {code : 2002, error : '目标包裹当前不在此仓库'};
        }
        if (type != 'deploy' && type != 'sale') {
            return {code : 2004, error : '无效的订单类型'};
        }
        if (type == 'deploy') {
            const targetStock = await this.stockQuery.fetchOne({id : parseInt(target)});
            if (!targetStock) {
                return {code : 2005, error : '无效的目的仓库id'};
            }
        }
        const order = await this.orderService.create({
            origin : origin, target : target,
            packageId, type, status : 'process', remark,
        });
        return {code : 0, data : order};
    }

    // 落库
    @Post('instock')
    async inStock (@Body() {id} : ConfirmDto) {
        const order = await this.orderQuery.fetchOne({id});
        if (!order || order.status != 'process') {
            return {code : 2006, error : '无效的货单id'};
        }
        return either(
            ok => ({code : 0, data : ok}),
            err => ({code : 2007, error : err}),
            await this.orderService.inStock(order)
        );
    }

    // 退货
    @Post('return')
    async back (@Body() {id} : ConfirmDto) {
        const order = await this.orderQuery.fetchOne({id});
        if (!order || order.status != 'process') {
            return {code : 2006, error : '无效的货单id'};
        }
        return either(
            ok => ({code : 0, data : ok}),
            err => ({code : 2008, error : err}),
            await this.orderService.inStock(order, true)
        );
    }

}
