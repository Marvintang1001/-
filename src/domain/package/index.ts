

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcPackage} from './interface/service';
import {PackageService} from './service';
import {AbcPackageQueryRepo, AbcPackageSaveRepo} from './interface/repository';
import {PackageQueryRepo, PackageSaveRepo} from './repository';


class PackageProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
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
