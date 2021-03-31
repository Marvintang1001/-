

import {Timestamp} from '@app/core/repository';


export interface CatagoryEntity {
    id : number;
    timestamp : Timestamp
    name : string;
    remark ?: string;  // 备注
}

export interface OneQuery {
    id ?: number;
    name ?: string;
}

export interface ManyQuery {
    idList ?: number[];
}

export abstract class AbcCatagoryQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<CatagoryEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<CatagoryEntity[]>;

}

export interface CreateBody {
    name : string;
    remark ?: string;
}

export abstract class AbcCatagorySaveRepo {

    abstract save (body : CreateBody) : Promise<CatagoryEntity>;

    abstract modify (target : CatagoryEntity, origin : CatagoryEntity) :
    Promise<CatagoryEntity>;

}

