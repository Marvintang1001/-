

import {Timestamp} from '@app/core/repository';


export interface SplitLogEntity {
    id : number;
    timestamp : Timestamp
    origin : string[];  // package id array
    target : string[];
}


export interface OneQuery {
    id : number;
}

export interface ManyQuery {
    idList ?: number[];
    origin ?: string[];
    target ?: string[];
}


export abstract class AbcSplitLogQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<SplitLogEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<SplitLogEntity[]>;

}


export interface CreateBody {
    origin : string[];
    target : string[];
}

export abstract class AbcSplitLogSaveRepo {

    abstract save (body : CreateBody) : Promise<SplitLogEntity>;

}

