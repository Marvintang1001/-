

import {Injectable} from '@nestjs/common';

import {AbcSplitLog} from '../interface/service';
import {
    AbcSplitLogSaveRepo, CreateBody, SplitLogEntity,
} from '../interface/repository';


@Injectable()
export class SplitLogService extends AbcSplitLog {

    constructor (
        private readonly saveRepo : AbcSplitLogSaveRepo,
    ) { super(); }

    async create (storage : CreateBody) : Promise<SplitLogEntity> {
        return this.saveRepo.save(storage);
    }

}
