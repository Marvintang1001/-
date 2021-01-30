

import {IsArray, IsNumber, IsOptional, IsString} from 'class-validator';


export class SplitDto {

    @IsString() origin : string;

    @IsArray() target : number[];  // 容量分配，如果超出origin容量报错，少于容量会把剩余的分多一个包

}

export class CombineDto {

    @IsArray() origin : string[];

}
