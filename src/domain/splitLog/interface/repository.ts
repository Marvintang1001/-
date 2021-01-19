

export interface SplitLogEntity {
    id : number;
    createTime : number;
    origin : number[];
    end : number[];
}


export interface OneQuery {
    id : number;
}

export interface ManyQuery {
    idList ?: number[];
    origin ?: number[];
    end ?: number[];
}


export abstract class AbcSplitLogQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<SplitLogEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<SplitLogEntity[]>;

}


export interface CreateBody {
    origin : number[];
    end : number[];
}

export abstract class AbcSplitLogSaveRepo {

    abstract save (body : CreateBody) : Promise<SplitLogEntity>;

}

