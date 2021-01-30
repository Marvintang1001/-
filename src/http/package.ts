/**
 * 拆合：可以一个包拆成多个，也可以多个包组合成一个;
 * 注：只支持同库的拆合
 */

import {Body, Controller, Post} from '@nestjs/common';

import {all} from 'ramda';
import {SplitDto, CombineDto} from './dto/package';
import {AbcSplitLog} from '@app/domain/splitLog/interface/service';
import {AbcPackageQueryRepo} from '@app/domain/package/interface/repository';


@Controller('package')
export class PurchaseController {

    constructor (
        private readonly packageQuery : AbcPackageQueryRepo,
        private readonly splitLogService : AbcSplitLog,
    ) {}

    // 单个拆成多个
    @Post('split')
    async split (@Body() body : SplitDto) {
        const {origin, target} = body;
        const originPackage = await this.packageQuery.fetchOne({id : origin});
        if (!originPackage || originPackage.status != 'normal') {
            return {code : 301, error : '非法的包裹'};
        }
        const targetSum = target.reduce((x, y) => x + y, 0);
        if (targetSum > originPackage.capacity) {
            return {code : 302, error : '超出原有包裹容量'};
        }
        const rest = originPackage.capacity - targetSum;
        if (rest > 0) target.push(rest);
        const newList = await this.splitLogService.split(originPackage, target);
        return {code : 0, data : newList};
    }

    // 多个组合成单个：类型要一致，所有状态都是‘normal'
    @Post('combine')
    async combine (@Body() {origin} : CombineDto) {
        const originList = await this.packageQuery.fetchMany({idList : origin});
        if (originList.length < 2) {
            return {code : 303, error : '组合需要大于一个包裹'};
        }
        if (
            all((x) => x.status === 'normal', originList) &&
            all((x) => x.merchandiseId === originList[0].merchandiseId, originList)
        ) {
            const newPackage = await this.splitLogService.combine(originList);
            return {code : 0, data : newPackage};
        }
        return {code : 304, error : '提供的包裹类型不统一'};
    }

}

