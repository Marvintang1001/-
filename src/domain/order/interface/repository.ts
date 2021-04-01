

import {Timestamp} from '@app/core/repository';


export interface OrderEntity {
    id : number;
    timestamp : Timestamp;
    origin : string;
    target : string;
    packageId : number;
    type : string;  // 区分采购(purchase)、调货(deploy)、出货(sale)
    status : 'process' | 'finish' | 'return' | 'unusual';
    remark ?: string;
}


export interface OneQuery {
    id : number;
}

export interface ManyQuery {
    idList ?: number[];
    created ?: number;
    finished ?: number;
    origin ?: string[];
    target ?: string[];
    packageId ?: number[];
    status ?: string[];
}


export abstract class AbcOrderQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<OrderEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<OrderEntity[]>;

}


export interface CreateBody {
    origin : string;
    target : string;
    packageId : number;
    type : string;
    status : 'process' | 'finish' | 'return' | 'unusual';
    remark ?: string;
}

export abstract class AbcOrderSaveRepo {

    abstract save (body : CreateBody) : Promise<OrderEntity>;

    abstract modify (target : OrderEntity, origin : OrderEntity) :
    Promise<OrderEntity>;

}

