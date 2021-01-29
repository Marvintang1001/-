

import {compose} from 'ramda';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcMerchandise} from './interface/service';
import {MerchandiseService} from './service';
import {AbcMerchandiseQueryRepo, AbcMerchandiseSaveRepo} from './interface/repository';
import {
    MerchandiseQueryRepo, MerchandiseRepository, MerchandiseSaveRepo,
} from './repository';
import {MerchandiseModel} from './repository/mongo';


class MerchandiseProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
        this.addModules([
            TypeOrmModule.forFeature(
                [MerchandiseModel, MerchandiseRepository], 'mongo',
            ),
        ], false),
        this.addProviders([
            {provide : AbcMerchandise, useClass : MerchandiseService},
            {provide : AbcMerchandiseQueryRepo, useClass : MerchandiseQueryRepo},
        ]),
        this.addProviders([
            {provide : AbcMerchandiseSaveRepo, useClass : MerchandiseSaveRepo},
        ], false)
    );

}


@useProvider(new MerchandiseProvider())
export class MerchandiseModule {}
