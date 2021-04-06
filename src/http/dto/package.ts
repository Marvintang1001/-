

import {IsArray, IsNumber, IsString} from 'class-validator';

import {PackageItem} from '@app/domain/package/interface/repository';

export class SplitDto {

    @IsNumber() origin : number;

    @IsArray() content : PackageItem[][];

}

export class CombineDto {

    @IsArray() origin : number[];

}

export class ModifyDto {

    @IsNumber() id : number;

    @IsString() status : 'split' | 'normal' | 'unusual';

}
