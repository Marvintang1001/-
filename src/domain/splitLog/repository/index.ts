

import {EntityRepository, ObjectID} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BaseMongo} from '@app/core/repository';
import {
    SplitLogEntity, AbcSplitLogQueryRepo, AbcSplitLogSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {SplitLogModel} from './mongo';


const modelToEntity = (splitLog : SplitLogModel) : SplitLogEntity => {
    const {id, created_at, updated_at, deleted_at, expired_at, ...other} = splitLog;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, expired : expired_at,
    };
    return {id : id.toString(), timestamp, ...other};
};

// const entityToModel = (splitLog : SplitLogEntity) : SplitLogModel => {
//     const {id, timestamp, ...other} = splitLog;
//     const {created, updated, deleted, expired} = timestamp;
//     return {
//         id : new ObjectID(id),
//         created_at : created, updated_at : updated,
//         deleted_at : deleted, expired_at : expired,
//         ...other};
// };


@EntityRepository(SplitLogModel)
export class SplitLogRepository extends BaseMongo<SplitLogModel> {}


@Injectable()
export class SplitLogQueryRepo extends AbcSplitLogQueryRepo {

    constructor (
        @InjectRepository(SplitLogRepository, 'postgres')
        private readonly repo : SplitLogRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const SplitLogModel = await this.repo.findOne(id ? id : other);
        return SplitLogModel ? modelToEntity(SplitLogModel) : SplitLogModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList, origin, end} = param;
        const query = this.repo.createQueryBuilder();
        if (idList) {
            if (idList.length === 0) { return []; }
            query.andWhere('id IN(:...idList})', {idList});
        }
        if (origin) {
            if (origin.length === 0) { return []; }
            query.andWhere('origin IN(:...origin)', {origin});
        }
        if (end) {
            if (end.length === 0) { return []; }
            query.andWhere('end IN(:...end)', {end});
        }
        const result : SplitLogModel[] = await query.printSql().getMany();
        return result.map(x => modelToEntity(x));
    }

}

@Injectable()
export class SplitLogSaveRepo extends AbcSplitLogSaveRepo {

    constructor (
        @InjectRepository(SplitLogRepository, 'mongo')
        private readonly repo : SplitLogRepository,
    ) { super(); }

    async save (splitLog : CreateBody) {
        const model = await this.repo.save(splitLog);
        return modelToEntity(model);
    }

}
