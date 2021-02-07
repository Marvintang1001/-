

import {Entity, Column} from 'typeorm';

import {MongoModel} from '@app/core/repository';


@Entity({name : 'user'})
export class UserModel extends MongoModel {

    @Column() name : string;

    @Column() phone : string;

    @Column() address : string;

    @Column({nullable : true}) nickname ?: string;

}
