/**
 * 商品服务
 */

import {MerchandiseEntity, CreateBody} from './repository';


export interface ModifyBO {
    ownerId : string;
}


export abstract class AbcMerchandise {

    abstract create (CreateBody : CreateBody) : Promise<MerchandiseEntity>;

    abstract modify (origin : MerchandiseEntity, modifyBO : ModifyBO) :
    Promise<MerchandiseEntity>;

}
