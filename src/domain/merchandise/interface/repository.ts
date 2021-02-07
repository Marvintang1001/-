

import {Timestamp} from '@app/core/repository';


export interface MerchandiseEntity {
    id : string;
    timestamp : Timestamp
    catagoryId : string;
    ownerId : string;
}


export interface OneQuery {
    id ?: string;
}

export interface ManyQuery {
    idList ?: string[];
    catagoryId ?: string[];
    ownerId ?: string[];
}


export abstract class AbcMerchandiseQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<MerchandiseEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<MerchandiseEntity[]>;

}


export interface CreateBody {
    catagoryId : string;
    ownerId : string;
}

export abstract class AbcMerchandiseSaveRepo {

    abstract save (body : CreateBody) : Promise<MerchandiseEntity>;

    abstract modify (target : MerchandiseEntity, origin : MerchandiseEntity) :
    Promise<MerchandiseEntity>;

}

