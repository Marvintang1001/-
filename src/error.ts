

import {HttpException} from '@nestjs/common';
import {AxiosResponse, AxiosError} from 'axios';


export class UnknownError<T> {

    constructor (public readonly error : AxiosError<T>) {}

}

export class HTTPError {

    constructor (
        public readonly code : number,
        public readonly message : string,
        public readonly response : AxiosResponse,
    ) {}

}

export class ApiError {

    constructor (public readonly error : string) {}

}


export class SendError {

    success : boolean;

    error : string;

    constructor (reason ?: string) {
        this.success = false;
        this.error = reason || '';
    }

}
