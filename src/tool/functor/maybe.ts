

import {Mapper, Monad, Functor, Applicative, ApplyResult} from './base';


export class Maybe<T> implements Monad<T>, Functor<T>, Applicative<T> {

    static of = <T>(x : T) => new Maybe(x as NonNullable<T>);

    constructor (private _value : T) {}

    isNothing = () => this._value === null || this._value === undefined;

    map = <R>(func : Mapper<NonNullable<T>, R>) : Maybe<NonNullable<R>> =>
        this.isNothing() ?
            (this as any) : Maybe.of(func(this._value as NonNullable<T>));

    join = () => this._value;

    chain = <R>(func : (x : NonNullable<T>) => R) => this.map(func).join();

    ap = <R>(
        x : Functor<R>,
    ) : Maybe<ApplyResult<T>> => this.chain(x.map as any);

}

export const maybe = <R, E, T>(
    f : Mapper<NonNullable<T>, R>, g : () => E, x : Maybe<T>,
) : E | R =>
    x.isNothing() ? g() : x.chain(f) as any;
