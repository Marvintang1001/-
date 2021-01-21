/**
 * 仓库商品服务
 */

import {MerchandiseEntity, CreateBody} from './repository';


interface ModifyBO {
    remark : any;
}


export abstract class AbcMerchandise {

    abstract create (CreateBody : CreateBody) : Promise<string>;

    abstract modify (origin : MerchandiseEntity, modifyBO : ModifyBO) :
    Promise<MerchandiseEntity>;

    abstract remove (entity : MerchandiseEntity) : Promise<boolean>;

}
