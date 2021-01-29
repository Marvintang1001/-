

import {IsNumber, IsOptional, IsString} from 'class-validator';


export class ApplyDto {

    @IsString() merchandiseId : string;

    @IsString() origin : string;

    @IsString() target : string;

    @IsString()@IsOptional() remark ?: string;

    @IsNumber() capacity : number;

}

export class ConfirmDto {

    @IsString() id : string;

}
