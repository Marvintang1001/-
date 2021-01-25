

import {Entity, Column} from 'typeorm';

import {MongoModel} from '@app/core/repository';


@Entity({name : 'package'})
export class PackageModel extends MongoModel {

    @Column() capacity : number;

    @Column() merchandiseId : string;

    @Column() position : string;

    @Column() path : string;

    @Column() status : 'inStock' | 'onRoad' | 'unusual' | 'split';

}
