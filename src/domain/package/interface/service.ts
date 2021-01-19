/**
 * 包裹服务
 */

import {PackageEntity, CreateBody} from './repository';


interface ModifyBO {
    status ?: 'onWarehouse' | 'onRoad' | 'unusual' | 'split';
    position ?: string;
    path ?: string;
}


export abstract class AbcPackage {

    abstract create (CreateBody : CreateBody) : Promise<string>;

    abstract modify (origin : PackageEntity, modifyBO : ModifyBO) :
    Promise<PackageEntity>;

}
