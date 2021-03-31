

import {EntityRepository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BasePostgres, entityToModel, modelToEntity} from '@app/core/repository';
import {
    StockEntity, AbcStockQueryRepo, AbcStockSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {StockModel} from './postgres';


const stockModelToEntity = (x : StockModel) : StockEntity => modelToEntity(x);

const stockEntityToModel = (x : StockEntity) : StockModel => entityToModel(x);


@EntityRepository(StockModel)
export class StockRepository extends BasePostgres<StockModel> {}


@Injectable()
export class StockQueryRepo extends AbcStockQueryRepo {

    constructor (
        @InjectRepository(StockRepository, 'postgres')
        private readonly repo : StockRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const StockModel = await this.repo.findOne(id ? id : other);
        return StockModel ? stockModelToEntity(StockModel) : StockModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList, status} = param;
        const result = await this.repo.find({where : {
            _id : {$in : idList},
            status : {$in : status},
        }});
        return result.map(x => stockModelToEntity(x));
    }

}

@Injectable()
export class StockSaveRepo extends AbcStockSaveRepo {

    constructor (
        @InjectRepository(StockRepository, 'postgres')
        private readonly repo : StockRepository,
    ) { super(); }

    async save (Stock : CreateBody) {
        const model = await this.repo.save(Stock);
        return stockModelToEntity(model);
    }

    async modify (target : StockEntity, origin : StockEntity) {
        const {status} = target;
        if (status != origin.status) {
            const model = stockEntityToModel({...origin, status});
            const newModel = await this.repo.save(model);
            return stockModelToEntity(newModel);
        }
        return origin;
    }

}
