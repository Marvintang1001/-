

import {compose} from 'ramda';

import {AbcProvider, useProvider} from '@app/core/provider';
import {AbcPackage} from './interface/service';


class PackageProvider extends AbcProvider {

    // makeModule = compose(
        // this.addModules([CommonModule]),
        // this.addProviders([
        //     {provide : AbcAccount, useClass : AccountService},
        // ]),
    // );

}


@useProvider(new PackageProvider())
export class PackageModule {}
