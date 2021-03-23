

import {Injectable} from '@nestjs/common';

import {AbcStock, ModifyBO} from '../interface/service';
import {AbcStockSaveRepo, CreateBody, StockEntity} from '../interface/repository';


@Injectable()
export class StockService extends AbcStock {

    constructor (
        private readonly saveRepo : AbcStockSaveRepo,
    ) { super(); }

    async create (storage : CreateBody) : Promise<StockEntity> {
        return this.saveRepo.save(storage);
    }

    async modify (origin : StockEntity, modifyBO : ModifyBO) {
        const {status} = modifyBO;
        const target = {
            ...origin, status : status || origin.status,
        };
        return this.saveRepo.modify(target, origin);
    }

}
