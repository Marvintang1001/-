

import {Entity, Column} from 'typeorm';

import {PostgresModel} from '@app/core/repository';


@Entity({name : 'catagory'})
export class CatagoryModel extends PostgresModel {

    @Column() name : string;

    @Column({nullable : true}) remark ?: string;

}
