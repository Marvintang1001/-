

import {Timestamp} from '@app/core/repository';


export interface PackageItem {
    code : number;  // 物品编码，暂时是catagoryId
    volume : number;
    rfid ?: string;
}

export interface PackageEntity {
    id : number;
    timestamp : Timestamp;
    stockId : string;  // 当前所在仓库
    content : PackageItem[];
    status : 'normal' | 'unusual' | 'split';  // 在库/异常/已拆
}


export interface OneQuery {
    id : number;
}

export interface ManyQuery {
    idList ?: number[];
    status ?: string[];
    stockId : string[];
}


export abstract class AbcPackageQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<PackageEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<PackageEntity[]>;

}


export interface CreateBody {
    content : PackageItem[];
    status : 'normal' | 'unusual' | 'split';
    stockId : string;
}

export abstract class AbcPackageSaveRepo {

    abstract save (body : CreateBody) : Promise<PackageEntity>;

    abstract modify (target : PackageEntity, origin : PackageEntity) :
    Promise<PackageEntity>;

}
