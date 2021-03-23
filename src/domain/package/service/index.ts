

import {Injectable} from '@nestjs/common';

import {AbcPackage, ModifyBO} from '../interface/service';
import {
    AbcPackageSaveRepo, CreateBody, PackageEntity,
} from '../interface/repository';


@Injectable()
export class PackageService extends AbcPackage {

    constructor (
        private readonly saveRepo : AbcPackageSaveRepo,
    ) { super(); }

    async create (storage : CreateBody) : Promise<PackageEntity> {
        return this.saveRepo.save(storage);
    }

    async modify (origin : PackageEntity, modifyBO : ModifyBO) {
        const {status, stockId} = modifyBO;
        const target = {
            ...origin, status : status || origin.status,
            stockId : stockId || origin.stockId,
        };
        return this.saveRepo.modify(target, origin);
    }

}
