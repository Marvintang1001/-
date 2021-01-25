

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcMerchandise} from './interface/service';
import {MerchandiseService} from './service';
import {AbcMerchandiseQueryRepo, AbcMerchandiseSaveRepo} from './interface/repository';
import {MerchandiseQueryRepo, MerchandiseSaveRepo} from './repository';


class MerchandiseProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
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
