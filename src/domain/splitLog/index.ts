

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcSplitLog} from './interface/service';


class SplitLogProvider extends AbcProvider {

    // makeModule = compose(
        // this.addModules([CommonModule]),
        // this.addProviders([
        //     {provide : AbcAccount, useClass : AccountService},
        // ]),
    // );

}


@useProvider(new SplitLogProvider())
export class SplitLogModule {}
