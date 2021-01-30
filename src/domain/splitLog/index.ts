

import {compose} from 'ramda';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcSplitLog} from './interface/service';
import {SplitLogService} from './service';
import {AbcSplitLogQueryRepo, AbcSplitLogSaveRepo} from './interface/repository';
import {SplitLogQueryRepo, SplitLogRepository, SplitLogSaveRepo} from './repository';
import {SplitLogModel} from './repository/mongo';
import {PackageModule} from '../package';


class SplitLogProvider extends AbcProvider {

    makeModule = compose(
        this.addModules([PackageModule]),
        this.addModules([
            TypeOrmModule.forFeature(
                [SplitLogModel, SplitLogRepository], 'mongo',
            ),
        ], false),
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
