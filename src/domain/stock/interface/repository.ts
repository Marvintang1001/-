

import {Timestamp} from '@app/core/repository';


export interface StockEntity {
    id : number;
    timestamp : Timestamp;
    address : string;
    name : string;
    status : 'unavailable' | 'available';
}


export interface OneQuery {
    id ?: number;
    name ?: string;
}

export interface ManyQuery {
    idList ?: number[];
    status ?: string[];
}


export abstract class AbcStockQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<StockEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<StockEntity[]>;

}


export interface CreateBody {
    address : string;
    name : string;
    status : 'unavailable' | 'available';
}

export abstract class AbcStockSaveRepo {

    abstract save (body : CreateBody) : Promise<StockEntity>;

    abstract modify (target : StockEntity, origin : StockEntity) :
    Promise<StockEntity>;

}

