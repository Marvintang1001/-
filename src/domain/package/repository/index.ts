

import {EntityRepository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BasePostgres} from '@app/core/repository';
import {
    PackageEntity, AbcPackageQueryRepo, AbcPackageSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {PackageModel} from './postgres';


const modelToEntity = (package_ : PackageModel) : PackageEntity => {
    const {created_at, updated_at, deleted_at, finished_at, ...other} = package_;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, finished : finished_at,
    };
    return {timestamp, ...other};
};

const entityToModel = (package_ : PackageEntity) : PackageModel => {
    const {timestamp, ...other} = package_;
    const {created, updated, deleted, finished} = timestamp;
    return {
        created_at : created, updated_at : updated,
        deleted_at : deleted, finished_at : finished,
        ...other};
};


@EntityRepository(PackageModel)
export class PackageRepository extends BasePostgres<PackageModel> {}


@Injectable()
export class PackageQueryRepo extends AbcPackageQueryRepo {

    constructor (
        @InjectRepository(PackageRepository, 'postgres')
        private readonly repo : PackageRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const packageModel = await this.repo.findOne(id ? id : other);
        return packageModel ? modelToEntity(packageModel) : packageModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList, status, stockId} = param;
        const result = await this.repo.find({where : {
            _id : {$in : idList},
            status : {$in : status},
            stockId : {$in : stockId},
        }});
        return result.map(x => modelToEntity(x));
    }

}

@Injectable()
export class PackageSaveRepo extends AbcPackageSaveRepo {

    constructor (
        @InjectRepository(PackageRepository, 'postgres')
        private readonly repo : PackageRepository,
    ) { super(); }

    async save (package_ : CreateBody) {
        const model = await this.repo.save(package_);
        return modelToEntity(model);
    }

    async modify (target : PackageEntity, origin : PackageEntity) {
        const {status, stockId} = target;
        const model = entityToModel({...origin, status, stockId});
        const newModel = await this.repo.save(model);
        return modelToEntity(newModel);
    }

}
