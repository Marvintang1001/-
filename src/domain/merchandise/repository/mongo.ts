

import {Entity, Column} from 'typeorm';

import {MongoModel} from '@app/core/repository';


@Entity({name : 'merchandise'})
export class MerchandiseModel extends MongoModel {

    @Column() catagoryId : string;

    @Column() ownerId : string;

}
