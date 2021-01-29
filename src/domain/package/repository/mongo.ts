

import {Entity, Column} from 'typeorm';

import {MongoModel} from '@app/core/repository';


@Entity({name : 'package'})
export class PackageModel extends MongoModel {

    @Column() capacity : number;

    @Column() merchandiseId : string;

    @Column() path : string;

    @Column() status : 'normal' | 'unusual' | 'split';

}
