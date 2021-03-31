

import {Injectable} from '@nestjs/common';

import {AbcStock, ModifyBO} from '../interface/service';
import {
    AbcStockQueryRepo, AbcStockSaveRepo, CreateBody, StockEntity,
} from '../interface/repository';
import {ApiError} from '@app/error';


@Injectable()
export class StockService extends AbcStock {

    constructor (
        private readonly saveRepo : AbcStockSaveRepo,
        private readonly queryRepo : AbcStockQueryRepo,
    ) { super(); }

    async create (stock : CreateBody) : Promise<StockEntity> {
        // name不能重复
        const repeat = await this.queryRepo.fetchOne({name : stock.name});
        if (!!repeat) throw new ApiError('stock\'s name is repeated!');
        return await this.saveRepo.save(stock);
    }

    async modify (origin : StockEntity, modifyBO : ModifyBO) {
        const {status} = modifyBO;
        const target = {
            ...origin, status : status || origin.status,
        };
        return this.saveRepo.modify(target, origin);
    }

}
