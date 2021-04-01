

import {IsNumber, IsOptional, IsString} from 'class-validator';


export class DeployDto {

    @IsString() origin : string;

    @IsString() target : string;

    @IsString()@IsOptional() remark ?: string;

    @IsNumber() packageId : number;

    @IsString() type : 'deploy' | 'sale';

}

export class ConfirmDto {

    @IsNumber() id : number;

}

export class SaleDto {

    @IsNumber() stockId : number;

    @IsString() target : string;

    @IsNumber() packageId : number;

    @IsOptional()@IsString() remark ?: string;

}
