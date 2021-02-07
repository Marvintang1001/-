

import {compose} from 'ramda';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcUser} from './interface/service';
import {UserService} from './service';
import {AbcUserQueryRepo, AbcUserSaveRepo} from './interface/repository';
import {
    UserQueryRepo, UserRepository, UserSaveRepo,
} from './repository';
import {UserModel} from './repository/mongo';


class UserProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
        this.addModules([
            TypeOrmModule.forFeature(
                [UserModel, UserRepository], 'mongo',
            ),
        ], false),
        this.addProviders([
            {provide : AbcUser, useClass : UserService},
            {provide : AbcUserQueryRepo, useClass : UserQueryRepo},
        ]),
        this.addProviders([
            {provide : AbcUserSaveRepo, useClass : UserSaveRepo},
        ], false)
    );

}


@useProvider(new UserProvider())
export class UserModule {}
