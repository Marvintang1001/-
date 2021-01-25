

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
        const {status, position, path} = modifyBO;
        const target = {
            ...origin, status : status || origin.status,
            position : position || origin.position,
            path : path || origin.path,
        };
        return this.saveRepo.modify(target, origin);
    }

}
