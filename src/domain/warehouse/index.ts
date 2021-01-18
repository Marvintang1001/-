

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcWarehouse} from './interface/service';


class WarehouseProvider extends AbcProvider {

    // makeModule = compose(
        // this.addModules([CommonModule]),
        // this.addProviders([
        //     {provide : AbcAccount, useClass : AccountService},
        // ]),
    // );

}


@useProvider(new WarehouseProvider())
export class WarehouseModule {}
