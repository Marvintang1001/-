

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcOrder} from './interface/service';
import {OrderService} from './service';
import {AbcOrderQueryRepo, AbcOrderSaveRepo} from './interface/repository';
import {OrderQueryRepo, OrderSaveRepo} from './repository';


class OrderProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
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
