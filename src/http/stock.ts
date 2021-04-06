/**
 * 仓库的新建和修改
 */

import {Body, Controller, Post} from '@nestjs/common';

import {CreateDto, ModifyDto} from './dto/stock';
import {AbcStockQueryRepo} from '@app/domain/stock/interface/repository';
import {AbcStock} from '@app/domain/stock/interface/service';


@Controller('stock')
 export class StockController {

    constructor (
        private readonly stockQuery : AbcStockQueryRepo,
        private readonly stockService : AbcStock,
    ) {}

    @Post('create')
    async create (@Body() body : CreateDto) {
        try {
            const stock = await this.stockService.create({status : 'available', ...body});
            return {code : 0, data : stock};
        } catch (e) {
            return {code : 4001, error : e};
        }
    }

    @Post('modify')
    async modify (@Body() {id, status} : ModifyDto) {
        if (status == 'available' || status == 'unavailable') {
            const stock = await this.stockQuery.fetchOne({id});
            const modified = await this.stockService.modify(stock, {status});
            return {code : 0, data : modified};
        }
        return {code : 4002, error : '状态仅支持"available"或"unavailable"'};
    }

}
