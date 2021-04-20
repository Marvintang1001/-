/**
 * 货单服务
 */

import {Either} from '@app/tool/functor';
import {PackageEntity} from '@app/domain/package/interface/repository';
import {OrderEntity} from './repository';


export interface ModifyBO {
    type ?: string;
    status ?: 'process' | 'finish' | 'unusual';
    remark ?: string;
}

export interface CreateParam {
    origin : string;
    target : string;
    package_ : PackageEntity;
    type : string;
    status : 'process' | 'finish' | 'unusual';
    remark ?: string;
}

export abstract class AbcOrder {

    abstract create (CreateBody : CreateParam) : Promise<OrderEntity>;

    abstract modify (origin : OrderEntity, modifyBO : ModifyBO) :
    Promise<OrderEntity>;

    abstract inStock (order : OrderEntity) : Promise<Either<OrderEntity | string>>;

}
