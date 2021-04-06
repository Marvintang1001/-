

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
        const query = this.repo.createQueryBuilder();
        if (idList) {
            if (idList.length === 0) { return []; }
            query.andWhere('id IN(:...idList)', {idList});
        }
        if (origin) {
            if (origin.length === 0) { return []; }
            query.andWhere('origin IN(:...origin)', {origin});
        }
        if (target) {
            if (target.length === 0) { return []; }
            query.andWhere('target IN(:...target)', {target});
        }
        if (packageId) {
            if (packageId.length === 0) { return []; }
            query.andWhere('packageId IN(:...packageId)', {packageId});
        }
        if (status) {
            if (status.length === 0) { return []; }
            query.andWhere('status IN(:...status)', {status});
        }
        if (created) {
            query.andWhere('created_at >= :created', {created});
        }
        if (finished) {
            query.andWhere('expired_at <= :finished', {finished});
        }
        const result = await query.printSql().getMany();
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
