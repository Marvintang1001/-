

import {compose} from 'ramda';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from './core/provider';
import {WarehouseModule} from './domain/warehouse';
import config from './config';
import {MerchandiseModule} from './domain/merchandise';


class AppProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([
            ...config.db.map((x : any) => TypeOrmModule.forRoot(x)),
            ConfigModule.forRoot({isGlobal : true}),
            WarehouseModule, MerchandiseModule,
        ], false),
        this.addControllers([])
    );

}

@useProvider(new AppProvider())
export class AppModule {}
