

import {compose} from 'ramda';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcOrder} from './interface/service';
import {OrderService} from './service';
import {AbcOrderQueryRepo, AbcOrderSaveRepo} from './interface/repository';
import {OrderQueryRepo, OrderRepository, OrderSaveRepo} from './repository';
import {PackageModule} from '../package';
import {StockModule} from '../stock';
import {OrderModel} from './repository/mongo';


class OrderProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([PackageModule, StockModule]),
        this.addModules([
            TypeOrmModule.forFeature(
                [OrderModel, OrderRepository], 'mongo',
            ),
        ], false),
        this.addProviders([
            {provide : AbcOrder, useClass : OrderService},
            {provide : AbcOrderQueryRepo, useClass : OrderQueryRepo},
        ]),
        this.addProviders([
            {provide : AbcOrderSaveRepo, useClass : OrderSaveRepo},
        ], false)
    );

}


@useProvider(new OrderProvider())
export class OrderModule {}
