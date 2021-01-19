

export interface PackageEntity {
    id : number;
    capacity : number;
    merchandiseId : number;
    position : string;
    status : 'onWarehouse' | 'onRoad' | 'unusual' | 'split';  // 在库/在途/已拆/异常
    path : string;  // 路径。用'/'分隔
}


export interface OneQuery {
    id : number;
}

export interface ManyQuery {
    idList ?: number[];
    status ?: string[];
    merchandiseId ?: number[];
}


export abstract class AbcPackageQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<PackageEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<PackageEntity[]>;

}


export interface CreateBody {
    capacity : number;
    merchandiseId : number;
    position : string;
    status : 'onWarehouse' | 'onRoad' | 'unusual' | 'split';
    path : string;
}

export abstract class AbcPackageSaveRepo {

    abstract save (body : CreateBody) : Promise<PackageEntity>;

    abstract modify (target : PackageEntity, origin : PackageEntity) :
    Promise<PackageEntity>;

}

