

import {IsNumber, IsOptional, IsString} from 'class-validator';


export class CreateDto {

    @IsString() name : string;

    @IsString()@IsOptional() remark ?: string;

}

export class ModifyDto {

    @IsNumber() id : number;

    @IsString() remark : string;

}
