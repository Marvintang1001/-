/**
 * 物理仓库服务：暂时仅支持仓库状态和剩余容量可以修改
 */

import {WarehouseEntity, CreateBody} from './repository';


interface ModifyBO {
    status : 'full' | 'unavailable' | 'available';
    remainCapacity : number;
}


export abstract class AbcWarehouse {

    abstract create (CreateBody : CreateBody) : Promise<string>;

    abstract modify (origin : WarehouseEntity, modifyBO : ModifyBO) :
    Promise<WarehouseEntity>;

}
