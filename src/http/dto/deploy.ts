

import {IsNumber, IsOptional, IsString} from 'class-validator';


export class ApplyDto {

    @IsString() origin : string;

    @IsString() target : string;

    @IsString()@IsOptional() remark ?: string;

    @IsString() packageId : string;

    @IsString() type : string;

}

export class ConfirmDto {

    @IsString() id : string;

    @IsNumber()@IsOptional() loss ?: number;

}
