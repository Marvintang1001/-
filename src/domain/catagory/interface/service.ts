/**
 * 商品种类服务
 */

import {CatagoryEntity, CreateBody} from './repository';


export interface ModifyBO {
    remark : string;
}

export abstract class AbcCatagory {

    abstract create (CreateBody : CreateBody) : Promise<CatagoryEntity>;

    abstract modify (origin : CatagoryEntity, modifyBO : ModifyBO) :
    Promise<CatagoryEntity>;

}
