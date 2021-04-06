

import {EntityRepository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BasePostgres, entityToModel, modelToEntity} from '@app/core/repository';
import {
    PackageEntity, AbcPackageQueryRepo, AbcPackageSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {PackageModel} from './postgres';


const packageModelToEntity =
    (package_ : PackageModel) : PackageEntity => modelToEntity(package_);

const packageEntityToModel =
    (package_ : PackageEntity) : PackageModel => entityToModel(package_);


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
        return packageModel ? packageModelToEntity(packageModel) : packageModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList, status, stockId} = param;
        const query = this.repo.createQueryBuilder();
        if (idList) {
            if (idList.length === 0) { return []; }
            query.andWhere('id IN(:...idList)', {idList});
        }
        if (status) {
            if (status.length === 0) { return []; }
            query.andWhere('status IN(:...status)', {status});
        }
        if (stockId) {
            if (stockId.length === 0) { return []; }
            query.andWhere('stockId IN(:...stockId)', {stockId});
        }
        const result = await query.printSql().getMany();
        return result.map(x => packageModelToEntity(x));
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
        return packageModelToEntity(model);
    }

    async modify (target : PackageEntity, origin : PackageEntity) {
        const {status, stockId} = target;
        const model = packageEntityToModel({...origin, status, stockId});
        const newModel = await this.repo.save(model);
        return packageModelToEntity(newModel);
    }

}
