/**
 * 物理仓库服务：暂时仅支持仓库状态和剩余容量可以修改
 */

import {StockEntity, CreateBody} from './repository';


export interface ModifyBO {
    status ?: 'unavailable' | 'available';
    remainCapacity ?: number;
}


export abstract class AbcStock {

    abstract create (CreateBody : CreateBody) : Promise<StockEntity>;

    abstract modify (origin : StockEntity, modifyBO : ModifyBO) :
    Promise<StockEntity>;

}
