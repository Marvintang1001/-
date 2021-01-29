

import {Body, Controller, Post, Req, ForbiddenException} from '@nestjs/common';

import {ApplyDto, ConfirmDto} from './dto/deploy';
import {AbcOrder} from '@app/domain/order/interface/service';
import {AbcOrderQueryRepo} from '@app/domain/order/interface/repository';
import {AbcStockQueryRepo} from '@app/domain/stock/interface/repository';
import {either} from '@app/tool/functor';


@Controller('deploy')
export class DeployController {

    constructor (
        private readonly orderService : AbcOrder,
        private readonly stockQuery : AbcStockQueryRepo,
        private readonly orderQuery : AbcOrderQueryRepo,
    ) {}

    /**
     * 调配申请
     * type = 'deploy_to_stock' | 'deploy_to_other';
     */
    @Post('apply')
    async apply (@Body() body : ApplyDto) {
        const {packageId, origin, target, remark, type} = body;
        const originStock = await this.stockQuery.fetchOne({id : origin});
        if (!originStock) {
            return {code : 201, error : '无效的发货仓库id'};
        }
        if (type === 'deploy_to_stock') {
            const targetStock = await this.stockQuery.fetchOne({id : target});
            if (!targetStock) {
                return {code : 203, error : '无效的目的仓库id'};
            }
        }
        const order = await this.orderService.create({
            origin, target, packageId, type, status : 'start', remark,
        });
        return {code : 0, data : order};
    }

    // 送达
    @Post('complete')
    async inStock (@Body() {id, loss} : ConfirmDto) {
        const order = await this.orderQuery.fetchOne({id});
        if (!order || order.status != 'start') return {code : 202, error : '无效的货单id'};
        if (order.type != 'deploy_to_stock') {
            const result = await this.orderService.modify(order,
                {status : 'finish', loss});
            return ({code : 0, data : result});
        }
        return either(
            ok => ({code : 0, data : ok}),
            err => ({code : 203, error : '该仓库已满或暂不可用'}),
            await this.orderService.inStock(order, false, loss)
        );
    }

    // 退回
    @Post('return')
    async return (@Body() {id, loss} : ConfirmDto) {
        const order = await this.orderQuery.fetchOne({id});
        if (!order || order.status != 'start') return {code : 202, error : '无效的货单id'};
        return either(
            ok => ({code : 0, data : ok}),
            err => ({code : 203, error : '该仓库已满或暂不可用'}),
            await this.orderService.inStock(order, true, loss)
        );
    }

}
