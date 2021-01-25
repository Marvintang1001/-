

import {Injectable} from '@nestjs/common';

import {AbcMerchandise, ModifyBO} from '../interface/service';
import {
    AbcMerchandiseSaveRepo, CreateBody, MerchandiseEntity,
} from '../interface/repository';


@Injectable()
export class MerchandiseService extends AbcMerchandise {

    constructor (
        private readonly saveRepo : AbcMerchandiseSaveRepo,
    ) { super(); }

    async create (storage : CreateBody) : Promise<MerchandiseEntity> {
        return this.saveRepo.save(storage);
    }

    async modify (origin : MerchandiseEntity, modifyBO : ModifyBO) {
        const {remark} = modifyBO;
        const target = {
            ...origin, remark : remark || origin.remark,
        };
        return this.saveRepo.modify(target, origin);
    }

}
