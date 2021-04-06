

import {
    DeepPartial, SaveOptions,
    Column, Repository, PrimaryGeneratedColumn,
    MongoRepository, ObjectID, ObjectIdColumn,
} from 'typeorm';


export interface Timestamp {
    created : number;
    updated : number;
    deleted ?: number;
    finished ?: number;
}

export class BaseModel {

    @Column({type : 'float'})
    created_at : number;

    @Column({type : 'float'})
    updated_at : number;

    @Column({type : 'float', nullable : true})
    expired_at ?: number;

    @Column({type : 'float', nullable : true})
    deleted_at ?: number;

}


export class MongoModel extends BaseModel {

    @ObjectIdColumn() id : ObjectID;

}

export class PostgresModel extends BaseModel {

    @PrimaryGeneratedColumn()
    id : number;

}


const createTime = () => (new Date()).valueOf();


const getNewModel = (model : any) => {
    const created_at = model.created_at ? model.created_at : createTime();
    return {
        ...model, created_at, updated_at : createTime(),
    };
};

type Constructor<T> = new (...args : any[]) => T;

type SubClass<T, K extends keyof T> =
    {[k in keyof T] : k extends K ? T[k] : any};


const RefactorSave = <
    E extends BaseModel,
    T extends Constructor<SubClass<Repository<E>, 'save'>>,
>(Base : T) => {
    return class extends Base {

        save = async <U extends DeepPartial<E>> (
            modelOrEntities : U, options ?: SaveOptions,
        ) => {
            const result = modelOrEntities instanceof Array ?
                modelOrEntities.map((model) => getNewModel(model))
                : getNewModel(modelOrEntities);
            return await super.save(result, options);
        };

    };
};


export const BaseMongo = RefactorSave(MongoRepository);

export const BasePostgres = RefactorSave(Repository);

export const entityToModel =
<T extends {timestamp : Timestamp}>(entity : T) => {
    const {timestamp, ...other} = entity;
    const {created, updated, deleted, finished} = timestamp;
    return {
        created_at : created, updated_at : updated,
        deleted_at : deleted, expired_at : finished,
        ...other};
};

export const modelToEntity = <T extends BaseModel>(modal : T) => {
    const {created_at, updated_at, deleted_at, expired_at, ...other} = modal;
    const timestamp = {
        created : created_at, updated : updated_at,
        deleted : deleted_at, finished : expired_at,
    };
    return {timestamp, ...other};
};
