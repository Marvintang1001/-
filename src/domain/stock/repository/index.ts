

import {EntityRepository, ObjectID} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BaseMongo} from '@app/core/repository';
import {
    StockEntity, AbcStockQueryRepo, AbcStockSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {StockModel} from './mongo';


const modelToEntity = (stock : StockModel) : StockEntity => {
    const {id, created_at, updated_at, deleted_at, expired_at, ...other} = stock;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, expired : expired_at,
    };
    return {id : id.toString(), timestamp, ...other};
};

const entityToModel = (stock : StockEntity) : StockModel => {
    const {id, timestamp, ...other} = stock;
    const {created, updated, deleted, expired} = timestamp;
    return {
        id : new ObjectID(id),
        created_at : created, updated_at : updated,
        deleted_at : deleted, expired_at : expired,
        ...other};
};


@EntityRepository(StockModel)
export class StockRepository extends BaseMongo<StockModel> {}


@Injectable()
export class StockQueryRepo extends AbcStockQueryRepo {

    constructor (
        @InjectRepository(StockRepository, 'postgres')
        private readonly repo : StockRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const StockModel = await this.repo.findOne(id ? id : other);
        return StockModel ? modelToEntity(StockModel) : StockModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList, status} = param;
        const query = this.repo.createQueryBuilder();
        if (idList) {
            if (idList.length === 0) { return []; }
            query.andWhere('id IN(:...idList})', {idList});
        }
        if (status) {
            if (status.length === 0) { return []; }
            query.andWhere('status IN(:...status)', {status});
        }
        const result : StockModel[] = await query.printSql().getMany();
        return result.map(x => modelToEntity(x));
    }

}

@Injectable()
export class StockSaveRepo extends AbcStockSaveRepo {

    constructor (
        @InjectRepository(StockRepository, 'mongo')
        private readonly repo : StockRepository,
    ) { super(); }

    async save (Stock : CreateBody) {
        const model = await this.repo.save(Stock);
        return modelToEntity(model);
    }

    async modify (target : StockEntity, origin : StockEntity) {
        const {status, remainCapacity} = target;
        const model = entityToModel({...origin, status, remainCapacity});
        const newModel = await this.repo.save(model);
        return modelToEntity(newModel);
    }

}
