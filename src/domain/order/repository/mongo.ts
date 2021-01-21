

import {Entity, Column} from 'typeorm';

import {MongoModel} from '@app/core/repository';


@Entity({name : 'order'})
export class OrderModel extends MongoModel {

    @Column() endTime : number;

    @Column() packageId : number;

    @Column() loss : number;

    @Column() origin : string;

    @Column() target : string;

    @Column() type : string;

    @Column() remark : string;

    @Column()
    status : 'start' | 'processing' | 'finish' | 'returning' | 'return' | 'unusual';


}
