

import {IsNumber, IsString} from 'class-validator';


export class CreateDto {

    @IsString() address : string;

    @IsString() name : string;

}

export class ModifyDto {

    @IsNumber() id : number;

    @IsString() status : 'available' | 'unavailable';

}
