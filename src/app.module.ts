

import {compose} from 'ramda';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from './core/provider';
import {StockModule} from './domain/stock';
import config from './config/index.json';
import {OrderModule} from './domain/order';
import {PurchaseController} from './http/purchase';
import {DeployController} from './http/order';
import {CatagoryModule} from './domain/catagory';


class AppProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([
            ...config.map((x : any) => TypeOrmModule.forRoot(x)),
            ConfigModule.forRoot({isGlobal : true}),
            StockModule, OrderModule, CatagoryModule,
        ], false),
        this.addControllers([PurchaseController, DeployController])
    );

}

@useProvider(new AppProvider())
export class AppModule {}
