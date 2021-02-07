/**
 * 用户服务
 */

import {UserEntity, CreateBody} from './repository';


export interface ModifyBO {
    name : string;
    phone : string;
    address : string;
    nickname ?: string;
}


export abstract class AbcUser {

    abstract create (CreateBody : CreateBody) : Promise<UserEntity>;

    abstract modify (origin : UserEntity, modifyBO : ModifyBO) :
    Promise<UserEntity>;

}
