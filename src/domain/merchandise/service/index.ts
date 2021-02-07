

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
        const {ownerId} = modifyBO;
        const target = {
            ...origin, ownerId : ownerId || origin.ownerId,
        };
        return this.saveRepo.modify(target, origin);
    }

}
