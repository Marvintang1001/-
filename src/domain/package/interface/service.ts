/**
 * 包裹服务
 */

import {PackageEntity, CreateBody} from './repository';


export interface ModifyBO {
    status ?: 'normal' | 'unusual' | 'split';
    stockId ?: number;
}


export abstract class AbcPackage {

    abstract create (CreateBody : CreateBody) : Promise<PackageEntity>;

    abstract modify (origin : PackageEntity, modifyBO : ModifyBO) :
    Promise<PackageEntity>;

}
