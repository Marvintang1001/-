

import {Entity, Column} from 'typeorm';

import {PostgresModel} from '@app/core/repository';


@Entity({name : 'order'})
export class OrderModel extends PostgresModel {

    @Column() packageId : number;

    @Column() origin : string;

    @Column() target : string;

    @Column() type : string;

    @Column({nullable : true}) remark ?: string;

    @Column()
    status : 'process' | 'finish' | 'return' | 'unusual';

}
