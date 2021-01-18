

export interface WarehouseEntity {
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


export abstract class AbcWarehouseQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<WarehouseEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<WarehouseEntity[]>;

}


export interface CreateBody {
    address : string;
    name : string;
    status : 'full' | 'unavailable' | 'available';
    totalCapacity : number;
}

export abstract class AbcWarehouseSaveRepo {

    abstract save (body : CreateBody) : Promise<WarehouseEntity>;

    abstract modify (target : WarehouseEntity, origin : WarehouseEntity) :
    Promise<WarehouseEntity>;

}

