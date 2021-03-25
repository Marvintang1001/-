

import {Entity, Column} from 'typeorm';

import {PostgresModel} from '@app/core/repository';
import {PackageItem} from '../interface/repository';


@Entity({name : 'package'})
export class PackageModel extends PostgresModel {

    @Column() status : 'normal' | 'unusual' | 'split';

    @Column() stockId : string;

    @Column('jsonb') content : PackageItem[];  // TODO: 未知是否可用。文档说“数组和对象能任意嵌套”

}
