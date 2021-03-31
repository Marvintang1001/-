

import {EntityRepository, ObjectID} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BasePostgres, modelToEntity} from '@app/core/repository';
import {
    SplitLogEntity, AbcSplitLogQueryRepo, AbcSplitLogSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {SplitLogModel} from './postgres';


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
        const {idList, origin, end} = param;
        const result = await this.repo.find({where : {
            _id : {$in : idList},
            origin : {$in : origin},
            end : {$in : end},
        }});
        return result.map(x => splitModelToEntity(x));
    }

}

@Injectable()
export class SplitLogSaveRepo extends AbcSplitLogSaveRepo {

    constructor (
        @InjectRepository(SplitLogRepository, 'postgres')
        private readonly repo : SplitLogRepository,
    ) { super(); }

    async save (splitLog : CreateBody) {
        const model = await this.repo.save(splitLog);
        return modelToEntity(model);
    }

}
