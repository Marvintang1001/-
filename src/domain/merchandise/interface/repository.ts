

import {Timestamp} from '@app/core/repository';


export interface MerchandiseEntity {
    id : string;
    timestamp : Timestamp
    name : string;
    remark ?: any;  // 备注
}


export interface OneQuery {
    id ?: string;
    name ?: string;
}

export interface ManyQuery {
    idList ?: string[];
}


export abstract class AbcMerchandiseQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<MerchandiseEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<MerchandiseEntity[]>;

}


export interface CreateBody {
    name : string;
    remark ?: any;
}

export abstract class AbcMerchandiseSaveRepo {

    abstract save (body : CreateBody) : Promise<MerchandiseEntity>;

    abstract modify (target : MerchandiseEntity, origin : MerchandiseEntity) :
    Promise<MerchandiseEntity>;

}

