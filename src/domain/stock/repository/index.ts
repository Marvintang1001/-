

import {EntityRepository, ObjectID} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BaseMongo} from '@app/core/repository';
import {
    StockEntity, AbcStockQueryRepo, AbcStockSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {StockModel} from './mongo';
import { ApiError } from '@app/error';


const modelToEntity = (stock : StockModel) : StockEntity => {
    const {id, created_at, updated_at, deleted_at, finished_at, ...other} = stock;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, finished : finished_at,
    };
    return {id : id.toString(), timestamp, ...other};
};

const entityToModel = (stock : StockEntity) : StockModel => {
    const {id, timestamp, ...other} = stock;
    const {created, updated, deleted, finished} = timestamp;
    return {
        id : new ObjectID(id),
        created_at : created, updated_at : updated,
        deleted_at : deleted, finished_at : finished,
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
        const result = await this.repo.find({where : {
            _id : {$in : idList},
            origin : {$in : origin},
            status : {$in : status},
        }});
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
        const {status, remainCapacity} = target;  // 暂不支持同时修改
        if (status != origin.status) {
            const model = entityToModel({...origin, status});
            const newModel = await this.repo.save(model);
            return modelToEntity(newModel);
        }
        const diff = remainCapacity - origin.remainCapacity;  // 小于0：入库；大于0：出库
        if (diff < 0) {
            const {value, ok} = await this.repo.findOneAndUpdate({
                    _id : new ObjectID(target.id),
                    status : 'avaliable',
                    remainCapacity : {$gte : diff},
                }, {$inc : {remainCapacity : diff}}
            );
            if (!ok) {
                throw new ApiError('仓库容量不足');
            }
            return modelToEntity(value);
        }
        if (diff > 0) {
            const {value, ok} = await this.repo.findOneAndUpdate({
                    _id : new ObjectID(target.id),
                    status : 'avaliable',
                    remainCapacity : {$lte : diff},
                }, {$inc : {remainCapacity : diff}}
            );
            if (!ok) {
                throw new ApiError('库存不足');
            }
            return modelToEntity(value);
        }
        return origin;
    }

}
