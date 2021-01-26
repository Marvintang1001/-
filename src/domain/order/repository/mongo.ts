

import {Entity, Column} from 'typeorm';

import {MongoModel} from '@app/core/repository';


@Entity({name : 'order'})
export class OrderModel extends MongoModel {

    @Column() packageId : string;

    @Column({nullable : true}) loss ?: number;

    @Column() origin : string;

    @Column() target : string;

    @Column() type : string;

    @Column({nullable : true}) remark ?: string;

    @Column()
    status : 'start' | 'processing' | 'finish' | 'returning' | 'return' | 'unusual';


}
