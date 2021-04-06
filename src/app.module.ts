

import {compose} from 'ramda';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from './core/provider';
import {StockModule} from './domain/stock';
import config from './config/index.json';
import {OrderModule} from './domain/order';
import {PurchaseController} from './http/purchase';
import {OrderController} from './http/order';
import {CatagoryModule} from './domain/catagory';
import {StockController} from './http/stock';
import {CatagoryController} from './http/catagory';
import {PackageController} from './http/package';
import {PackageModule} from './domain/package';
import {SplitLogModule} from './domain/splitLog';


class AppProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([
            ...config.map((x : any) => TypeOrmModule.forRoot(x)),
            ConfigModule.forRoot({isGlobal : true}),
            StockModule, OrderModule, CatagoryModule, PackageModule,
            SplitLogModule,
        ], false),
        this.addControllers([
            PurchaseController, OrderController, StockController,
            CatagoryController, PackageController,
        ])
    );

}

@useProvider(new AppProvider())
export class AppModule {}
