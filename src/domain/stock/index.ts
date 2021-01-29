

import {compose} from 'ramda';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcStock} from './interface/service';
import {StockService} from './service';
import {AbcStockQueryRepo, AbcStockSaveRepo} from './interface/repository';
import {StockQueryRepo, StockRepository, StockSaveRepo} from './repository';
import {StockModel} from './repository/mongo';


class StockProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
        this.addModules([
            TypeOrmModule.forFeature(
                [StockModel, StockRepository], 'mongo',
            ),
        ], false),
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
