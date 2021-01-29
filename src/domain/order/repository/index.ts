

import {EntityRepository, ObjectID} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BaseMongo} from '@app/core/repository';
import {
    OrderEntity, AbcOrderQueryRepo, AbcOrderSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {OrderModel} from './mongo';


const modelToEntity = (order : OrderModel) : OrderEntity => {
    const {id, created_at, updated_at, deleted_at, finished_at, ...other} = order;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, finished : finished_at,
    };
    return {id : id.toString(), timestamp, ...other};
};

const entityToModel = (order : OrderEntity) : OrderModel => {
    const {id, timestamp, ...other} = order;
    const {created, updated, deleted, finished} = timestamp;
    return {
        id : new ObjectID(id),
        created_at : created, updated_at : updated,
        deleted_at : deleted, finished_at : finished,
        ...other};
};


@EntityRepository(OrderModel)
export class OrderRepository extends BaseMongo<OrderModel> {}


@Injectable()
export class OrderQueryRepo extends AbcOrderQueryRepo {

    constructor (
        @InjectRepository(OrderRepository, 'mongo')
        private readonly repo : OrderRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const OrderModel = await this.repo.findOne(id ? id : other);
        return OrderModel ? modelToEntity(OrderModel) : OrderModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList, created, finished, origin, target, packageId, status} = param;
        const result = await this.repo.find({where : {
            _id : {$in : idList},
            origin : {$in : origin},
            target : {$in : target},
            packageId : {$in : packageId},
            status : {$in : status},
            created_at : {$gte : created},
            finished_at : {$lte : finished},
        }});
        return result.map((x : OrderModel) => modelToEntity(x));
    }

}

@Injectable()
export class OrderSaveRepo extends AbcOrderSaveRepo {

    constructor (
        @InjectRepository(OrderRepository, 'mongo')
        private readonly repo : OrderRepository,
    ) { super(); }

    async save (order : CreateBody) {
        const model = await this.repo.save(order);
        return modelToEntity(model);
    }

    async modify (target : OrderEntity, origin : OrderEntity) {
        const {timestamp, type, loss, status, remark} = target;
        const model = entityToModel({
            ...origin, timestamp, type, loss, status, remark,
        });
        const newModel = await this.repo.save(model);
        return modelToEntity(newModel);
    }

}
