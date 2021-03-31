

import {IsArray, IsNumber, ArrayUnique} from 'class-validator';

import {PackageItem} from '@app/domain/package/interface/repository';

export class SplitDto {

    @IsNumber() origin : number;

    @ArrayUnique() content : PackageItem[][];

}

export class CombineDto {

    @IsArray() origin : number[];

}
