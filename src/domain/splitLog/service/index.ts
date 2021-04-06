// TODO: 暂未考虑已出库或未入库包裹的拆分限制

import {Injectable} from '@nestjs/common';
import {any, flatten, groupBy, mergeAll, mergeWith} from 'ramda';

import {AbcSplitLog} from '../interface/service';
import {
    AbcSplitLogSaveRepo, CreateBody, SplitLogEntity,
} from '../interface/repository';
import {PackageEntity, PackageItem} from '@app/domain/package/interface/repository';
import {AbcPackage} from '@app/domain/package/interface/service';
import {ApiError} from '@app/error';


@Injectable()
export class SplitLogService extends AbcSplitLog {

    constructor (
        private readonly saveRepo : AbcSplitLogSaveRepo,
        private readonly packageService : AbcPackage,
    ) { super(); }

    async create (storage : CreateBody) : Promise<SplitLogEntity> {
        return this.saveRepo.save(storage);
    }

    async split (origin : PackageEntity, target : PackageItem[][]) {
        const {status, stockId, id, content} = origin;
        if (status != 'normal') throw new ApiError('该包裹状态异常');
        const contentObj = groupBy(x => x.code.toString(), content);
        const targetObjList = target.map(x => groupBy(x => x.code.toString(), x));
        const targetObj = targetObjList.reduce(
            (x, y) => mergeWith((a, b) => a[0].volume + b[0].volume, x, y), {});
        for (const x of Object.keys(targetObj)) {
            const content = contentObj[x][0];
            if (content?.volume != targetObj[x][0]?.volume) {
                console.log('aaaa');
                throw new ApiError(`该物品(${content})拆分前后总数不相等`);
            }
        }

        await this.packageService.modify(origin, {status : 'split'});
        const newList = await Promise.all(target.map(async content => {
            return await this.packageService.create({
                stockId, status : 'normal', content,
            });
        }));
        const idList = newList.map(x => x.id.toString());
        await this.create({origin : [id.toString()], target : idList});
        return newList;
    }

    async combine (origin : PackageEntity[]) {
        // 判断这些包裹是否出现在同一个地方并且状态都为normal
        if (any(x => x != 'normal')(origin.map(x => x.status))) {
            throw new ApiError('含状态异常的包裹');
        }
        const stockIdList = origin.map(x => x.stockId);
        if (stockIdList.length > 1) {
            throw new ApiError('包裹不在同一个仓库');
        }
        await Promise.all(origin.map(async x => {
            return await this.packageService.modify(x, {status : 'split'});
        }));  // TODO: 事务？

        const contentObj = groupBy(
            x => x.code.toString(), flatten(origin.map(x => x.content)));
        const content = Object.values(contentObj).reduce(
            (x, y) => mergeWith((a, b) => a[0].volume + b[0].volume, x, y), {});

        const newOne = await this.packageService.create({
            stockId : stockIdList[0], status : 'normal', content,
        });
        await this.create({
            origin : origin.map(x => x.id.toString()), target : [newOne.id.toString()],
        });
        return newOne;
    }

}
