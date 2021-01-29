

import {Mapper, Monad} from './base';


export class Identity<T> implements Monad<T> {

    static of = <T>(x : T) => new Identity(x);

    constructor (private _value : T) {}

    map = <R>(func : Mapper<T, R>) => Identity.of(func(this._value));

    join = () => this._value;

    chain = <R>(func : Mapper<T, R>) => this.map(func).join();

}
