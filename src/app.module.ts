

import {compose} from 'ramda';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from './core/provider';
import config from './config';


class AppProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([
            ...config.db.map((x : any) => TypeOrmModule.forRoot(x)),
            ConfigModule.forRoot({isGlobal : true}),
        ], false),
        this.addControllers([])
    );

}

@useProvider(new AppProvider())
export class AppModule {}
