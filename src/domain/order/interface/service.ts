/**
 * 货单服务
 */

import {OrderEntity, CreateBody} from './repository';


interface ModifyBO {
    endTime ?: number;
    type ?: string;
    loss ?: number;
    status ?: 'start' | 'processing' | 'finish' | 'returning' | 'return' | 'unusual';
    remark ?: string;
}

export abstract class AbcOrder {

    abstract create (CreateBody : CreateBody) : Promise<OrderEntity>;

    abstract modify (origin : OrderEntity, modifyBO : ModifyBO) :
    Promise<OrderEntity>;

}
