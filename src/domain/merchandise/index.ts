

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcMerchandise} from './interface/service';


class MerchandiseProvider extends AbcProvider {

    // makeModule = compose(
        // this.addModules([CommonModule]),
        // this.addProviders([
        //     {provide : AbcAccount, useClass : AccountService},
        // ]),
    // );

}


@useProvider(new MerchandiseProvider())
export class MerchandiseModule {}
