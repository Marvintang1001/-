

import {
    DeepPartial, SaveOptions,
    Column, Repository,
    MongoRepository, ObjectID, ObjectIdColumn,
} from 'typeorm';


export interface Timestamp {
    created : number;
    updated : number;
    deleted ?: number;
    expired ?: number;
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
