// TODO: 暂未考虑已出库或未入库包裹的拆分限制

import {Injectable} from '@nestjs/common';
import {any, flatten, groupBy, mergeWithKey, uniq} from 'ramda';

import {AbcSplitLog} from '../interface/service';
import {
    AbcSplitLogSaveRepo, CreateBody, SplitLogEntity,
} from '../interface/repository';
import {PackageEntity, PackageItem} from '@app/domain/package/interface/repository';
import {ApiError} from '@app/error';


@Injectable()
export class SplitLogService extends AbcSplitLog {

    constructor (
        private readonly saveRepo : AbcSplitLogSaveRepo,
    ) { super(); }

    async split (origin : PackageEntity, target : PackageItem[][]) {
        const {status, content} = origin;
        if (status != 'normal') throw new ApiError('该包裹状态异常');
        const contentObj = groupBy(x => x.code.toString(), content);
        const targetObjList = groupBy(x => x.code.toString(), flatten(target));
        const targetObj = {};
        for (const key of Object.keys(targetObjList)) {
            const arr = targetObjList[key];
            const sum = arr.map(x => x.volume).reduce((a, b) => a + b, 0);
            targetObj[key] = sum;
        }
        for (const x of Object.keys(targetObj)) {
            const content = contentObj[x][0];
            if (content?.volume != targetObj[x]) {
                console.log(content?.volume, targetObj[x][0]?.volume);
                throw new ApiError(`该物品(${JSON.stringify(content)})拆分前后总数不相等`);
            }
        }

        const newList = await this.saveRepo.handleARSplit(origin, target);
        return newList;
    }

    async combine (origin : PackageEntity[]) {
        // 判断这些包裹是否出现在同一个地方并且状态都为normal
        if (any(x => x != 'normal')(origin.map(x => x.status))) {
            throw new ApiError('含状态异常的包裹');
        }
        const stockIdList = uniq(origin.map(x => x.stockId));
        if (stockIdList.length > 1) {
            throw new ApiError('包裹不在同一个仓库');
        }

        const contentObj = groupBy(
            x => x.code.toString(), flatten(origin.map(x => x.content)));
        const content = Object.values(contentObj).map(item => item.reduce(
            (x, y) => mergeWithKey((k, a, b) => k == 'volume' ? a + b : b, x, y), {}
        ));

        const newOne = await this.saveRepo.handleARCombine(origin, content);
        return newOne;
    }

}
