

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
    const {id, created_at, updated_at, deleted_at, expired_at, ...other} = merchandise;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, expired : expired_at,
    };
    return {id : id.toString(), timestamp, ...other};
};

const entityToModel = (merchandise : MerchandiseEntity) : MerchandiseModel => {
    const {id, timestamp, ...other} = merchandise;
    const {created, updated, deleted, expired} = timestamp;
    return {
        id : new ObjectID(id),
        created_at : created, updated_at : updated,
        deleted_at : deleted, expired_at : expired,
        ...other};
};


@EntityRepository(MerchandiseModel)
export class MerchandiseRepository extends BaseMongo<MerchandiseModel> {}


@Injectable()
export class MerchandiseQueryRepo extends AbcMerchandiseQueryRepo {

    constructor (
        @InjectRepository(MerchandiseRepository, 'postgres')
        private readonly repo : MerchandiseRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const MerchandiseModel = await this.repo.findOne(id ? id : other);
        return MerchandiseModel ? modelToEntity(MerchandiseModel) : MerchandiseModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList} = param;
        const query = this.repo.createQueryBuilder();
        if (idList) {
            if (idList.length === 0) { return []; }
            query.andWhere('id IN(:...idList})', {idList});
        }
        const result : MerchandiseModel[] = await query.printSql().getMany();
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
        const {remark} = target;
        const model = entityToModel({...origin, remark});
        const newModel = await this.repo.save(model);
        return modelToEntity(newModel);
    }

}
