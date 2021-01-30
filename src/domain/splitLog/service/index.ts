

import {Injectable} from '@nestjs/common';

import {AbcSplitLog} from '../interface/service';
import {
    AbcSplitLogSaveRepo, CreateBody, SplitLogEntity,
} from '../interface/repository';
import {PackageEntity} from '@app/domain/package/interface/repository';
import {AbcPackage} from '@app/domain/package/interface/service';


@Injectable()
export class SplitLogService extends AbcSplitLog {

    constructor (
        private readonly saveRepo : AbcSplitLogSaveRepo,
        private readonly packageService : AbcPackage,
    ) { super(); }

    async create (storage : CreateBody) : Promise<SplitLogEntity> {
        return this.saveRepo.save(storage);
    }

    async split (origin : PackageEntity, target : number[]) {
        const path = origin.path.split('/').pop();
        await this.packageService.modify(origin, {status : 'split'});
        const newList = await Promise.all(target.map(async capacity => {
            return await this.packageService.create({
                capacity, merchandiseId : origin.merchandiseId,
                status : 'normal', path,
            });
        }));
        const idList = newList.map(x => x.id);
        await this.create({origin : [origin.id], end : idList});
        return newList;
    }

    async combine (origin : PackageEntity[]) {
        const {merchandiseId, path} = origin[0];
        const capacity = origin.map(x => x.capacity).reduce((x, y) => x + y, 0);
        await Promise.all(origin.map(async x => {
            return await this.packageService.modify(x, {status : 'split'});
        }));
        const newOne = await this.packageService.create({
            merchandiseId, capacity, status : 'normal', path : path.split('/').pop()});
        await this.create({origin : origin.map(x => x.id), end : [newOne.id]});
        return newOne;
    }

}
