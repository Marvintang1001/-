

import {Monad, Mapper} from './base';


export class Either<T> implements Monad<T> {

    constructor (protected _value : T) {}

    join = () => this._value;

}

export class Left<T> extends Either<T> {

    static of = <T>(x : T) => new Left(x);

    map = () => this;

    chain = () => this;

}

export class Right<T> extends Either<T> {

    static of = <T>(x : T) => new Right(x);

    map = <R>(func : Mapper<T, R>) => new Right(func(this._value));

    chain = <R>(func : Mapper<T, R>) => this.map(func).join();

}

// export type Either<T, E> = Right<T> | Left<E>;

type EitherLeft<T> = T extends Left<infer R> ? R : never;
type EitherRight<T> = T extends Right<infer R> ? R : never;

export const either = <F, G, T extends Either<any>>(
    f : (x : EitherRight<T>) => F, g : (x : EitherLeft<T>) => G, x : T,
) => x instanceof Left ? g(x.join()) : f(x.join());

export const eitherOf = <T extends Either<any>>(x : T) =>
    either(Right.of, Left.of, x);
