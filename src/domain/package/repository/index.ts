

import {EntityRepository, ObjectID} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BaseMongo} from '@app/core/repository';
import {
    PackageEntity, AbcPackageQueryRepo, AbcPackageSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {PackageModel} from './mongo';


const modelToEntity = (package_ : PackageModel) : PackageEntity => {
    const {id, created_at, updated_at, deleted_at, finished_at, ...other} = package_;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, finished : finished_at,
    };
    return {id : id.toString(), timestamp, ...other};
};

const entityToModel = (package_ : PackageEntity) : PackageModel => {
    const {id, timestamp, ...other} = package_;
    const {created, updated, deleted, finished} = timestamp;
    return {
        id : new ObjectID(id),
        created_at : created, updated_at : updated,
        deleted_at : deleted, finished_at : finished,
        ...other};
};


@EntityRepository(PackageModel)
export class PackageRepository extends BaseMongo<PackageModel> {}


@Injectable()
export class PackageQueryRepo extends AbcPackageQueryRepo {

    constructor (
        @InjectRepository(PackageRepository, 'mongo')
        private readonly repo : PackageRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const PackageModel = await this.repo.findOne(id ? id : other);
        return PackageModel ? modelToEntity(PackageModel) : PackageModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList, status, merchandiseId} = param;
        const result = await this.repo.find({where : {
            _id : {$in : idList},
            merchandiseId : {$in : merchandiseId},
            status : {$in : status},
        }});
        return result.map(x => modelToEntity(x));
    }

}

@Injectable()
export class PackageSaveRepo extends AbcPackageSaveRepo {

    constructor (
        @InjectRepository(PackageRepository, 'mongo')
        private readonly repo : PackageRepository,
    ) { super(); }

    async save (package_ : CreateBody) {
        const model = await this.repo.save(package_);
        return modelToEntity(model);
    }

    async modify (target : PackageEntity, origin : PackageEntity) {
        const {status, capacity, path} = target;
        const model = entityToModel({...origin, status, capacity, path});
        const newModel = await this.repo.save(model);
        return modelToEntity(newModel);
    }

}
