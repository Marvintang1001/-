

import {EntityRepository, getManager, EntityManager} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {uniq} from 'ramda';

import {BasePostgres, modelToEntity} from '@app/core/repository';
import {
    SplitLogEntity, AbcSplitLogQueryRepo, AbcSplitLogSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {SplitLogModel} from './postgres';
import {PackageEntity, PackageItem} from '@app/domain/package/interface/repository';
import {AbcPackageSaveRepo} from '@app/domain/package/interface/repository';


const splitModelToEntity =
    (splitLog : SplitLogModel) : SplitLogEntity => modelToEntity(splitLog);


@EntityRepository(SplitLogModel)
export class SplitLogRepository extends BasePostgres<SplitLogModel> {}


@Injectable()
export class SplitLogQueryRepo extends AbcSplitLogQueryRepo {

    constructor (
        @InjectRepository(SplitLogRepository, 'postgres')
        private readonly repo : SplitLogRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const SplitLogModel = await this.repo.findOne(id ? id : other);
        return SplitLogModel ? splitModelToEntity(SplitLogModel) : SplitLogModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList, origin, target, stockId} = param;
        const query = this.repo.createQueryBuilder();
        if (idList) {
            if (idList.length === 0) { return []; }
            query.andWhere('id IN(:...idList)', {idList});
        }
        if (origin) {
            if (origin.length === 0) { return []; }
            query.andWhere('origin IN(:...origin)', {origin});
        }
        if (target) {
            if (target.length === 0) { return []; }
            query.andWhere('target IN(:...target)', {target});
        }
        if (stockId) {
            if (stockId.length === 0) { return []; }
            query.andWhere('stockId IN(:...stockId)', {stockId});
        }
        const result = await query.printSql().getMany();
        return result.map(x => splitModelToEntity(x));
    }

}

@Injectable()
export class SplitLogSaveRepo extends AbcSplitLogSaveRepo {

    constructor (
        @InjectRepository(SplitLogRepository, 'postgres')
        private readonly repo : SplitLogRepository,
        private readonly packageRepo : AbcPackageSaveRepo,
    ) { super(); }

    async save (splitLog : CreateBody, manager ?: EntityManager) {
        const model = manager ? await manager.save(
            manager.create(SplitLogModel, {
                ...splitLog, created_at : (new Date()).valueOf(),
                updated_at : (new Date()).valueOf(),
            })
        ) : await this.repo.save(splitLog);
        return modelToEntity(model);
    }

    async handleARSplit (origin : PackageEntity, target : PackageItem[][]) {
        return await getManager('postgres').transaction(
            async manager => {
                const {stockId, id} = origin;
                await this.packageRepo.modify(
                    {status : 'split', ...origin}, origin, manager,
                );
                const newList = await Promise.all(target.map(async content => {
                    return await this.packageRepo.save({
                        stockId, status : 'normal', content,
                    }, manager);
                }));
                const idList = newList.map(x => x.id.toString());
                await this.save(
                    {origin : [id.toString()], target : idList, stockId}, manager);
                return newList;
            });
    }

    async handleARCombine (origin : PackageEntity[], content : PackageItem[]) {
        return await getManager('postgres').transaction(
            async manager => {
                const stockIdList = uniq(origin.map(x => x.stockId));
                const newOne = await this.packageRepo.save({
                    stockId : stockIdList[0], status : 'normal', content,
                }, manager);
                await this.save({
                    origin : origin.map(x => x.id.toString()),
                    target : [newOne.id.toString()],
                    stockId : stockIdList[0],
                }, manager);
                await Promise.all(origin.map(async x => {
                    return await this.packageRepo.modify({status : 'split', ...x}, x);
                }));
                return newOne;
            });
    }

}
