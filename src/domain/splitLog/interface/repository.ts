

import {Timestamp} from '@app/core/repository';


export interface SplitLogEntity {
    id : string;
    timestamp : Timestamp
    origin : string[];  // package id array
    end : string[];
}


export interface OneQuery {
    id : string;
}

export interface ManyQuery {
    idList ?: string[];
    origin ?: string[];
    end ?: string[];
}


export abstract class AbcSplitLogQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<SplitLogEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<SplitLogEntity[]>;

}


export interface CreateBody {
    origin : string[];
    end : string[];
}

export abstract class AbcSplitLogSaveRepo {

    abstract save (body : CreateBody) : Promise<SplitLogEntity>;

}

