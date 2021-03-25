

import {EntityRepository, ObjectID} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BasePostgres} from '@app/core/repository';
import {
    CatagoryEntity, AbcCatagoryQueryRepo, AbcCatagorySaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {CatagoryModel} from './postgres';


const modelToEntity = (Catagory : CatagoryModel) : CatagoryEntity => {
    const {created_at, updated_at, deleted_at, finished_at, ...other} = Catagory;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, finished : finished_at,
    };
    return {timestamp, ...other};
};

const entityToModel = (Catagory : CatagoryEntity) : CatagoryModel => {
    const {timestamp, ...other} = Catagory;
    const {created, updated, deleted, finished} = timestamp;
    return {
        created_at : created, updated_at : updated,
        deleted_at : deleted, finished_at : finished,
        ...other};
};


@EntityRepository(CatagoryModel)
export class CatagoryRepository extends BasePostgres<CatagoryModel> {}


@Injectable()
export class CatagoryQueryRepo extends AbcCatagoryQueryRepo {

    constructor (
        @InjectRepository(CatagoryRepository, 'postgres')
        private readonly repo : CatagoryRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const CatagoryModel = await this.repo.findOne(id ? id : other);
        return CatagoryModel ? modelToEntity(CatagoryModel) : CatagoryModel;
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
export class CatagorySaveRepo extends AbcCatagorySaveRepo {

    constructor (
        @InjectRepository(CatagoryRepository, 'postgres')
        private readonly repo : CatagoryRepository,
    ) { super(); }

    async save (catagory : CreateBody) {
        const model = await this.repo.save(catagory);
        return modelToEntity(model);
    }

    async modify (target : CatagoryEntity, origin : CatagoryEntity) {
        const {remark} = target;
        const model = entityToModel({...origin, remark});
        const newModel = await this.repo.save(model);
        return modelToEntity(newModel);
    }

}
