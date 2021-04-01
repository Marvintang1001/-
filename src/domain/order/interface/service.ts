/**
 * 货单服务
 */

import {Either} from '@app/tool/functor';
import {OrderEntity, CreateBody} from './repository';


export interface ModifyBO {
    type ?: string;
    status ?: 'process' | 'finish' | 'return' | 'unusual';
    remark ?: string;
}

export abstract class AbcOrder {

    abstract create (CreateBody : CreateBody) : Promise<OrderEntity>;

    abstract modify (origin : OrderEntity, modifyBO : ModifyBO) :
    Promise<OrderEntity>;

    abstract inStock (order : OrderEntity, back ?: boolean) :
    Promise<Either<OrderEntity | string>>;

}
