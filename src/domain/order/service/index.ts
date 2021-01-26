

import {Injectable} from '@nestjs/common';

import {AbcOrder, ModifyBO} from '../interface/service';
import {
    AbcOrderSaveRepo, CreateBody, OrderEntity,
} from '../interface/repository';


@Injectable()
export class OrderService extends AbcOrder {

    constructor (
        private readonly saveRepo : AbcOrderSaveRepo,
    ) { super(); }

    async create (storage : CreateBody) : Promise<OrderEntity> {
        return this.saveRepo.save(storage);
    }

    async modify (origin : OrderEntity, modifyBO : ModifyBO) {
        const {type, loss, status, remark, finished} = modifyBO;
        const timestamp = origin.timestamp;
        timestamp.finished = finished;
        const target = {
            ...origin, status : status || origin.status,
            type : type || origin.type,
            loss : loss || origin.loss,
            remark : remark || origin.remark,
            timestamp : finished ? timestamp : origin.timestamp,
        };
        return this.saveRepo.modify(target, origin);
    }

}
