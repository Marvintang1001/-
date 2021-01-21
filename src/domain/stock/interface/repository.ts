

export interface StockEntity {
    id : number;
    address : string;
    name : string;
    status : 'full' | 'unavailable' | 'available';
    totalCapacity : number;
    remainCapacity : number;  // 剩余容量
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
    status : 'full' | 'unavailable' | 'available';
    totalCapacity : number;
}

export abstract class AbcStockSaveRepo {

    abstract save (body : CreateBody) : Promise<StockEntity>;

    abstract modify (target : StockEntity, origin : StockEntity) :
    Promise<StockEntity>;

}

