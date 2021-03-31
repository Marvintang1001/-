

import {Injectable} from '@nestjs/common';

import {AbcCatagory, ModifyBO} from '../interface/service';
import {
    AbcCatagorySaveRepo, CreateBody, CatagoryEntity, AbcCatagoryQueryRepo,
} from '../interface/repository';
import {ApiError} from '@app/error';


@Injectable()
export class CatagoryService extends AbcCatagory {

    constructor (
        private readonly saveRepo : AbcCatagorySaveRepo,
        private readonly queryRepo : AbcCatagoryQueryRepo,
    ) { super(); }

    async create (catagory : CreateBody) : Promise<CatagoryEntity> {
        const repeat = await this.queryRepo.fetchOne({name : catagory.name});
        if (!!repeat) throw new ApiError('catagory\'s name is repeated!');
        return this.saveRepo.save(catagory);
    }

    async modify (origin : CatagoryEntity, modifyBO : ModifyBO) {
        const {remark} = modifyBO;
        const target = {
            ...origin, remark : remark || origin.remark,
        };
        return this.saveRepo.modify(target, origin);
    }

}
