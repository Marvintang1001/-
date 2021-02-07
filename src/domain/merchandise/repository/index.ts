

import {EntityRepository, ObjectID} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BaseMongo} from '@app/core/repository';
import {
    MerchandiseEntity, AbcMerchandiseQueryRepo, AbcMerchandiseSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {MerchandiseModel} from './mongo';


const modelToEntity = (merchandise : MerchandiseModel) : MerchandiseEntity => {
    const {id, created_at, updated_at, deleted_at, finished_at, ...other} = merchandise;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, finished : finished_at,
    };
    return {id : id.toString(), timestamp, ...other};
};

const entityToModel = (merchandise : MerchandiseEntity) : MerchandiseModel => {
    const {id, timestamp, ...other} = merchandise;
    const {created, updated, deleted, finished} = timestamp;
    return {
        id : new ObjectID(id),
        created_at : created, updated_at : updated,
        deleted_at : deleted, finished_at : finished,
        ...other};
};


@EntityRepository(MerchandiseModel)
export class MerchandiseRepository extends BaseMongo<MerchandiseModel> {}


@Injectable()
export class MerchandiseQueryRepo extends AbcMerchandiseQueryRepo {

    constructor (
        @InjectRepository(MerchandiseRepository, 'mongo')
        private readonly repo : MerchandiseRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const MerchandiseModel = await this.repo.findOne(id ? id : other);
        return MerchandiseModel ? modelToEntity(MerchandiseModel) : MerchandiseModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList} = param;
        const result = await this.repo.find({where : {
            _id : {$in : idList},
        }});
        return result.map(x => modelToEntity(x));
    }

}

@Injectable()
export class MerchandiseSaveRepo extends AbcMerchandiseSaveRepo {

    constructor (
        @InjectRepository(MerchandiseRepository, 'mongo')
        private readonly repo : MerchandiseRepository,
    ) { super(); }

    async save (Merchandise : CreateBody) {
        const model = await this.repo.save(Merchandise);
        return modelToEntity(model);
    }

    async modify (target : MerchandiseEntity, origin : MerchandiseEntity) {
        const {ownerId} = target;
        const model = entityToModel({...origin, ownerId});
        const newModel = await this.repo.save(model);
        return modelToEntity(newModel);
    }

}
