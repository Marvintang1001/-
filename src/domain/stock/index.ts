

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcStock} from './interface/service';
import {StockService} from './service';
import {AbcStockQueryRepo, AbcStockSaveRepo} from './interface/repository';
import {StockQueryRepo, StockSaveRepo} from './repository';


class StockProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
        this.addProviders([
            {provide : AbcStock, useClass : StockService},
            {provide : AbcStockQueryRepo, useClass : StockQueryRepo},
        ]),
        this.addProviders([
            {provide : AbcStockSaveRepo, useClass : StockSaveRepo},
        ], false)
    );

}


@useProvider(new StockProvider())
export class StockModule {}
