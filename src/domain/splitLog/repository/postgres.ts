

import {Entity, Column} from 'typeorm';

import {PostgresModel} from '@app/core/repository';


@Entity({name : 'split'})
export class SplitLogModel extends PostgresModel {

    @Column('simple-array') origin : string[];

    @Column('simple-array') target : string[];

}
