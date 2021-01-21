

export interface MerchandiseEntity {
    id : number;
    name : string;
    remark ?: any;  // 备注
}


export interface OneQuery {
    id ?: number;
    name ?: string;
}

export interface ManyQuery {
    idList ?: number[];
}


export abstract class AbcMerchandiseQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<MerchandiseEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<MerchandiseEntity[]>;

}


export interface CreateBody {
    id : number;
    name : string;
    remark ?: any;
}

export abstract class AbcMerchandiseSaveRepo {

    abstract save (body : CreateBody) : Promise<MerchandiseEntity>;

    abstract modify (target : MerchandiseEntity, origin : MerchandiseEntity) :
    Promise<MerchandiseEntity>;

    abstract delete (entity : MerchandiseEntity) : Promise<MerchandiseEntity>;

}

