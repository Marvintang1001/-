

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcOrder} from './interface/service';


class OrderProvider extends AbcProvider {

    // makeModule = compose(
        // this.addModules([CommonModule]),
        // this.addProviders([
        //     {provide : AbcAccount, useClass : AccountService},
        // ]),
    // );

}


@useProvider(new OrderProvider())
export class OrderModule {}
