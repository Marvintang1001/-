

import {EntityManager} from 'typeorm';

import {Timestamp} from '@app/core/repository';
import {PackageEntity, PackageItem} from '@app/domain/package/interface/repository';


export interface SplitLogEntity {
    id : number;
    timestamp : Timestamp
    origin : string[];  // package id array
    target : string[];
    stockId : string;
}


export interface SplitLogAR {
    splitLog ?: SplitLogEntity;
    package : PackageEntity;
}

export interface OneQuery {
    id : number;
}

export interface ManyQuery {
    idList ?: number[];
    origin ?: string[];
    target ?: string[];
    stockId ?: string[];
}


export abstract class AbcSplitLogQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<SplitLogEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<SplitLogEntity[]>;

}


export interface CreateBody {
    origin : string[];
    target : string[];
    stockId : string;
}

export abstract class AbcSplitLogSaveRepo {

    abstract save (body : CreateBody, manager ?: EntityManager) : Promise<SplitLogEntity>;

    abstract handleARSplit (origin : PackageEntity, target : PackageItem[][]) :
    Promise<PackageEntity[]>;

    abstract handleARCombine (origin : PackageEntity[], target : PackageItem[]) :
    Promise<PackageEntity>;

}

