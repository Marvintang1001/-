

import {Timestamp} from '@app/core/repository';


export interface UserEntity {
    id : string;
    timestamp : Timestamp
    name : string;  // 公司名称
    phone : string;
    address : string;
    nickname ?: string;  // 代理人名称
}


export interface OneQuery {
    id ?: string;
}

export interface ManyQuery {
    idList ?: string[];
}


export abstract class AbcUserQueryRepo {

    abstract fetchOne (query : OneQuery) : Promise<UserEntity | undefined>;

    abstract fetchMany (query : ManyQuery) :  Promise<UserEntity[]>;

}


export interface CreateBody {
    name : string;
    phone : string;
    address : string;
    nickname ?: string;
}

export abstract class AbcUserSaveRepo {

    abstract save (body : CreateBody) : Promise<UserEntity>;

    abstract modify (target : UserEntity, origin : UserEntity) :
    Promise<UserEntity>;

}

