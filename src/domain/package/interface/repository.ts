

import {Timestamp} from '@app/core/repository';

interface PackageItem {
    code : number;  // 物品编码，暂时是catagoryId
    volume : number;
    rfid ?: string;
}

export interface PackageEntity {
    id : string;
    timestamp : Timestamp;
    stockId : number;
    content : PackageItem[];
    status : 'normal' | 'unusual' | 'split';  // 在库/异常/已拆
}


export interface OneQuery {
    id : string;
}

export interface ManyQuery {
    idList ?: string[];
    status ?: string[];
}


export abstract class AbcPackageQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<PackageEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<PackageEntity[]>;

}


export interface CreateBody {
    capacity : number;
    merchandiseId : string[];
    status : 'normal' | 'unusual' | 'split';
    path : string;
}

export abstract class AbcPackageSaveRepo {

    abstract save (body : CreateBody) : Promise<PackageEntity>;

    abstract modify (target : PackageEntity, origin : PackageEntity) :
    Promise<PackageEntity>;

}
