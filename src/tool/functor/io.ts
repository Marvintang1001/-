

import {compose} from 'ramda';

import {Mapper, Monad} from './base';


export class IO<T> implements Monad<PromiseLike<T>> {

    static of = <T>(x : T) => new IO(() => Promise.resolve(x));

    constructor (public unsafePerformIO : () => PromiseLike<T>) {}

    map = <R>(func : Mapper<T, R>) =>
        new IO(compose(x => x.then(func), this.unsafePerformIO));

    join = () => this.unsafePerformIO();

    chain = <R>(func : Mapper<T, Monad<R>>) =>
        new IO(() => this.map(func).join().then(x => x.join()));

    ap = <P>(func : IO<P>) :
    T extends (x : P) => PromiseLike<infer R> ? IO<R> : IO<unknown> =>
        (this.chain as any)(func.map);

}
