

import {EntityRepository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BasePostgres, modelToEntity, entityToModel} from '@app/core/repository';
import {
    OrderEntity, AbcOrderQueryRepo, AbcOrderSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {OrderModel} from './postgres';


const orderModelToEntity = (order : OrderModel) : OrderEntity => modelToEntity(order);

const orderEntityToModel = (order : OrderEntity) : OrderModel => entityToModel(order);


@EntityRepository(OrderModel)
export class OrderRepository extends BasePostgres<OrderModel> {}

@Injectable()
export class OrderQueryRepo extends AbcOrderQueryRepo {

    constructor (
        @InjectRepository(OrderRepository, 'postgres')
        private readonly repo : OrderRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const OrderModel = await this.repo.findOne(id ? id : other);
        return OrderModel ? orderModelToEntity(OrderModel) : OrderModel;
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
        return result.map((x : OrderModel) => orderModelToEntity(x));
    }

}

@Injectable()
export class OrderSaveRepo extends AbcOrderSaveRepo {

    constructor (
        @InjectRepository(OrderRepository, 'postgres')
        private readonly repo : OrderRepository,
    ) { super(); }

    async save (order : CreateBody) {
        const model = await this.repo.save(order);
        return orderModelToEntity(model);
    }

    async modify (target : OrderEntity, origin : OrderEntity) {
        const {timestamp, type, status, remark} = target;
        const model = orderEntityToModel({
            ...origin, timestamp, type, status, remark,
        });
        const newModel = await this.repo.save(model);
        return orderModelToEntity(newModel);
    }

}
