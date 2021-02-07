

import {EntityRepository, ObjectID} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {BaseMongo} from '@app/core/repository';
import {
    UserEntity, AbcUserQueryRepo, AbcUserSaveRepo,
    OneQuery, ManyQuery, CreateBody,
} from '../interface/repository';
import {UserModel} from './mongo';


const modelToEntity = (User : UserModel) : UserEntity => {
    const {id, created_at, updated_at, deleted_at, finished_at, ...other} = User;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, finished : finished_at,
    };
    return {id : id.toString(), timestamp, ...other};
};

const entityToModel = (user : UserEntity) : UserModel => {
    const {id, timestamp, ...other} = user;
    const {created, updated, deleted, finished} = timestamp;
    return {
        id : new ObjectID(id),
        created_at : created, updated_at : updated,
        deleted_at : deleted, finished_at : finished,
        ...other};
};


@EntityRepository(UserModel)
export class UserRepository extends BaseMongo<UserModel> {}


@Injectable()
export class UserQueryRepo extends AbcUserQueryRepo {

    constructor (
        @InjectRepository(UserRepository, 'mongo')
        private readonly repo : UserRepository,
    ) { super(); }

    async fetchOne (query : OneQuery) {
        const {id, ...other} = query;
        const UserModel = await this.repo.findOne(id ? id : other);
        return UserModel ? modelToEntity(UserModel) : UserModel;
    }

    async fetchMany (param : ManyQuery) {
        const {idList} = param;
        const result = await this.repo.find({where : {
            _id : {$in : idList},
        }});
        return result.map(x => modelToEntity(x));
    }

}

@Injectable()
export class UserSaveRepo extends AbcUserSaveRepo {

    constructor (
        @InjectRepository(UserRepository, 'mongo')
        private readonly repo : UserRepository,
    ) { super(); }

    async save (User : CreateBody) {
        const model = await this.repo.save(User);
        return modelToEntity(model);
    }

    async modify (target : UserEntity, origin : UserEntity) {
        const {name, phone, address, nickname} = target;
        const model = entityToModel({...origin, name, phone, address, nickname});
        const newModel = await this.repo.save(model);
        return modelToEntity(newModel);
    }

}
