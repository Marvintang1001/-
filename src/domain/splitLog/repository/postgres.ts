

import {Entity, Column} from 'typeorm';

import {PostgresModel} from '@app/core/repository';


@Entity({name : 'split'})
export class SplitLogModel extends PostgresModel {

    @Column() origin : number[];

    @Column() end : number[];

}
