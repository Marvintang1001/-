

import {compose} from 'ramda';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcCatagory} from './interface/service';
import {CatagoryService} from './service';
import {AbcCatagoryQueryRepo, AbcCatagorySaveRepo} from './interface/repository';
import {
    CatagoryQueryRepo, CatagoryRepository, CatagorySaveRepo,
} from './repository';
import {CatagoryModel} from './repository/mongo';


class CatagoryProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
        this.addModules([
            TypeOrmModule.forFeature(
                [CatagoryModel, CatagoryRepository], 'mongo',
            ),
        ], false),
        this.addProviders([
            {provide : AbcCatagory, useClass : CatagoryService},
            {provide : AbcCatagoryQueryRepo, useClass : CatagoryQueryRepo},
        ]),
        this.addProviders([
            {provide : AbcCatagorySaveRepo, useClass : CatagorySaveRepo},
        ], false)
    );

}


@useProvider(new CatagoryProvider())
export class CatagoryModule {}
