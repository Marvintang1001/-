

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
    const {id, created_at, updated_at, deleted_at, finished_at, ...other} = splitLog;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, finished : finished_at,
    };
    return {id : id.toString(), timestamp, ...other};
};

// const entityToModel = (splitLog : SplitLogEntity) : SplitLogModel => {
//     const {id, timestamp, ...other} = splitLog;
//     const {created, updated, deleted, finished} = timestamp;
//     return {
//         id : new ObjectID(id),
//         created_at : created, updated_at : updated,
//         deleted_at : deleted, finished_at : finished,
//         ...other};
// };


@EntityRepository(SplitLogModel)
export class SplitLogRepository extends BaseMongo<SplitLogModel> {}


@Injectable()
export class SplitLogQueryRepo extends AbcSplitLogQueryRepo {

    constructor (
        @InjectRepository(SplitLogRepository, 'mongo')
        private readonly repo : SplitLogRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const SplitLogModel = await this.repo.findOne(id ? id : other);
        return SplitLogModel ? modelToEntity(SplitLogModel) : SplitLogModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList, origin, end} = param;
        const result = await this.repo.find({where : {
            _id : {$in : idList},
            origin : {$in : origin},
            end : {$in : end},
        }});
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
