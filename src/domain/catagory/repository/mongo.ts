

import {Entity, Column} from 'typeorm';

import {MongoModel} from '@app/core/repository';


@Entity({name : 'catagory'})
export class CatagoryModel extends MongoModel {

    @Column() name : string;

    @Column({nullable : true}) remark ?: string;

}
