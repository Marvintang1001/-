

import {Timestamp} from '@app/core/repository';


export interface StockEntity {
    id : string;
    timestamp : Timestamp;
    address : string;
    name : string;
    status : 'full' | 'unavailable' | 'available';
    totalCapacity : number;
    remainCapacity : number;  // 剩余容量
}


export interface OneQuery {
    id ?: string;
    name ?: string;
}

export interface ManyQuery {
    idList ?: string[];
    status ?: string[];
}


export abstract class AbcStockQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<StockEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<StockEntity[]>;

}


export interface CreateBody {
    address : string;
    name : string;
    status : 'full' | 'unavailable' | 'available';
    totalCapacity : number;
}

export abstract class AbcStockSaveRepo {

    abstract save (body : CreateBody) : Promise<StockEntity>;

    abstract modify (target : StockEntity, origin : StockEntity) :
    Promise<StockEntity>;

}

