/**
 * 拆分日志服务
 */

import {PackageEntity, PackageItem} from '@app/domain/package/interface/repository';
import {SplitLogEntity, CreateBody} from './repository';


export abstract class AbcSplitLog {

    abstract create (CreateBody : CreateBody) : Promise<SplitLogEntity>;

    abstract split (origin : PackageEntity, target : PackageItem[][]) :
    Promise<PackageEntity[]>;

    abstract combine (origin : PackageEntity[]) : Promise<PackageEntity>;

}
