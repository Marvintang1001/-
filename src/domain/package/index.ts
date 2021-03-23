

import {compose} from 'ramda';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcPackage} from './interface/service';
import {PackageService} from './service';
import {AbcPackageQueryRepo, AbcPackageSaveRepo} from './interface/repository';
import {PackageQueryRepo, PackageRepository, PackageSaveRepo} from './repository';
import {PackageModel} from './repository/postgres';


class PackageProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
        this.addModules([
            TypeOrmModule.forFeature(
                [PackageModel, PackageRepository], 'postgres',
            ),
        ], false),
        this.addProviders([
            {provide : AbcPackage, useClass : PackageService},
            {provide : AbcPackageQueryRepo, useClass : PackageQueryRepo},
        ]),
        this.addProviders([
            {provide : AbcPackageSaveRepo, useClass : PackageSaveRepo},
        ], false)
    );

}


@useProvider(new PackageProvider())
export class PackageModule {}
