

import {Injectable} from '@nestjs/common';

import {AbcUser, ModifyBO} from '../interface/service';
import {
    AbcUserSaveRepo, CreateBody, UserEntity,
} from '../interface/repository';


@Injectable()
export class UserService extends AbcUser {

    constructor (
        private readonly saveRepo : AbcUserSaveRepo,
    ) { super(); }

    async create (storage : CreateBody) : Promise<UserEntity> {
        return this.saveRepo.save(storage);
    }

    async modify (origin : UserEntity, modifyBO : ModifyBO) {
        const {name, phone, address, nickname} = modifyBO;
        const target = {
            ...origin, name : name || origin.name,
            phone : phone || origin.phone,
            address : address || origin.address,
            nickname : nickname || origin.nickname,
        };
        return this.saveRepo.modify(target, origin);
    }

}
