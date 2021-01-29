

export type Mapper<T, R> = (x : T) => R;


export interface Monad<T> {
    join : () => T;
}

export type MonadOf = <T, R extends Monad<T>>(x : T) => R;


export interface Functor<T> {
    map : <R>(func : Mapper<T, R>) => Functor<R>;
}


export type ApplyResult<T> = T extends (x : any) => infer R ? R : never;

export interface Applicative<T> {
    ap : <R>(x : Functor<R>) => Functor<ApplyResult<T>>;
}
