

import {compose} from 'ramda';

import {
    Mapper, ApplyResult,
    Monad, Functor, Applicative,
} from './base';


export class Cache<T> implements Monad<T>, Functor<T>, Applicative<T> {

    static of = <T>(x : T) => new Cache(() => x);

    constructor (private _value : () => T) {}

    join = () => this._value();

    map = <R>(func : Mapper<T, R>) => new Cache(compose(func, this._value));

    chain = <R>(func : Mapper<T, Monad<R>>) =>
        new Cache(() => this.map(func).join().join());

    ap = <R>(x : Functor<R>) => this.chain<ApplyResult<T>>(x.map as any);

}
