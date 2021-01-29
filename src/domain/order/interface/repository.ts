

import {Timestamp} from '@app/core/repository';


export interface OrderEntity {
    id : string;
    timestamp : Timestamp;
    origin : string;
    target : string;
    packageId : string;
    type : string;
    loss ?: number;
    status : 'start' | 'finish' | 'return' | 'unusual';
    remark ?: string;
}


export interface OneQuery {
    id : string;
}

export interface ManyQuery {
    idList ?: string[];
    created ?: number;
    finished ?: number;
    origin ?: string[];
    target ?: string[];
    packageId ?: string[];
    status ?: string[];
}


export abstract class AbcOrderQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<OrderEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<OrderEntity[]>;

}


export interface CreateBody {
    origin : string;
    target : string;
    packageId : string;
    type : string;  // purchase
    loss ?: number;
    status : 'start' | 'finish' | 'return' | 'unusual';
    remark ?: string;
}

export abstract class AbcOrderSaveRepo {

    abstract save (body : CreateBody) : Promise<OrderEntity>;

    abstract modify (target : OrderEntity, origin : OrderEntity) :
    Promise<OrderEntity>;

}

