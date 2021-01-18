

import {Module} from '@nestjs/common';
import {
    Type, ModuleMetadata, Provider, DynamicModule,
} from '@nestjs/common/interfaces';


type ModuleType = Type<any> | DynamicModule | Promise<DynamicModule>;

export type ProviderEnv = 'prod' | 'dev' | 'local';

export abstract class AbcProvider {

    public readonly env : ProviderEnv;

    constructor (env ?: ProviderEnv) {
        const nodeEnv =
            process.env.NODE_ENV == 'dev' ? 'dev'
                : process.env.NODE_ENV == 'prod' ? 'prod' : 'local';

        this.env = env ? env : nodeEnv;
    }

    abstract makeModule (data : ModuleMetadata) : ModuleMetadata;

    addProviders = (allProvider : Provider[], isPublic = true) => (
        {providers = [], exports = [], ...other} : ModuleMetadata,
    ) : ModuleMetadata => ({
        providers : [...providers, ...allProvider],
        exports : isPublic ? [...exports, ...allProvider] : exports,
        ...other,
    });

    addModules = (allModule : ModuleType[], isPublic = true) => (
        {imports = [], exports = [], ...other} : ModuleMetadata,
    ) : ModuleMetadata => ({
        imports : [...imports, ...allModule],
        exports : isPublic ? [...exports, ...allModule] : exports,
        ...other,
    });

    addControllers = (allController : Type<any>[]) => (
        {controllers = [], ...other} : ModuleMetadata,
    ) : ModuleMetadata => ({
        controllers : [...controllers, ...allController], ...other,
    });

    useFactory = <T>(method : (...args : any[]) => T) => {
        const inject = Reflect.getMetadata('design:paramtypes', method) || [];
        return {useFactory : method, inject};
    };

}


export const useProvider =
    (provider : AbcProvider) => Module(provider.makeModule({}));
