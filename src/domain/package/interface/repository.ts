

import {Timestamp} from '@app/core/repository';


export interface PackageEntity {
    id : string;
    timestamp : Timestamp;
    capacity : number;
    merchandiseId : string[];
    status : 'normal' | 'unusual' | 'split';  // 在库/已拆/异常
    path : string;  // 路径。用'/'分隔
}


export interface OneQuery {
    id : string;
}

export interface ManyQuery {
    idList ?: string[];
    status ?: string[];
    merchandiseId ?: string[];
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

