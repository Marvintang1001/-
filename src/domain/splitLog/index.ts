

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcSplitLog} from './interface/service';
import {SplitLogService} from './service';
import {AbcSplitLogQueryRepo, AbcSplitLogSaveRepo} from './interface/repository';
import {SplitLogQueryRepo, SplitLogSaveRepo} from './repository';


class SplitLogProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([]),
        this.addProviders([
            {provide : AbcSplitLog, useClass : SplitLogService},
            {provide : AbcSplitLogQueryRepo, useClass : SplitLogQueryRepo},
        ]),
        this.addProviders([
            {provide : AbcSplitLogSaveRepo, useClass : SplitLogSaveRepo},
        ], false)
    );

}


@useProvider(new SplitLogProvider())
export class SplitLogModule {}
