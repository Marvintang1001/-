

import {EntityRepository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BasePostgres, entityToModel, modelToEntity} from '@app/core/repository';
import {
    CatagoryEntity, AbcCatagoryQueryRepo, AbcCatagorySaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {CatagoryModel} from './postgres';


const catagoryModelToEntity =
    (Catagory : CatagoryModel) : CatagoryEntity => modelToEntity(Catagory);

const catagoryEntityToModel =
    (catagory : CatagoryEntity) : CatagoryModel => entityToModel(catagory);


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
        return CatagoryModel ? catagoryModelToEntity(CatagoryModel) : CatagoryModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList} = param;
        const result = await this.repo.find({where : {
            _id : {$in : idList},
        }});
        return result.map(x => catagoryModelToEntity(x));
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
        return catagoryModelToEntity(model);
    }

    async modify (target : CatagoryEntity, origin : CatagoryEntity) {
        const {remark} = target;
        const model = catagoryEntityToModel({...origin, remark});
        const newModel = await this.repo.save(model);
        return catagoryModelToEntity(newModel);
    }

}
