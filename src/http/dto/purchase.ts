

import {ArrayUnique, IsNumber, IsOptional, IsString} from 'class-validator';

import {PackageItem} from '@app/domain/package/interface/repository';


export class ApplyDto {

    @ArrayUnique(x => x.code) content : PackageItem[];  // TODO: 验证唯一检查是否实现

    @IsString() stockId : string;

    @IsString() origin : string;

    @IsOptional()@IsString() remark ?: string;

}
