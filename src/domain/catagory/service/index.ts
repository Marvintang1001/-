

import {Injectable} from '@nestjs/common';

import {AbcCatagory, ModifyBO} from '../interface/service';
import {
    AbcCatagorySaveRepo, CreateBody, CatagoryEntity,
} from '../interface/repository';


@Injectable()
export class CatagoryService extends AbcCatagory {

    constructor (
        private readonly saveRepo : AbcCatagorySaveRepo,
    ) { super(); }

    async create (storage : CreateBody) : Promise<CatagoryEntity> {
        return this.saveRepo.save(storage);
    }

    async modify (origin : CatagoryEntity, modifyBO : ModifyBO) {
        const {remark} = modifyBO;
        const target = {
            ...origin, remark : remark || origin.remark,
        };
        return this.saveRepo.modify(target, origin);
    }

}
