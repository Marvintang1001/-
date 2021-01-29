

import {Entity, Column} from 'typeorm';

import {MongoModel} from '@app/core/repository';


@Entity({name : 'stock'})
export class StockModel extends MongoModel {

    @Column() address : string;

    @Column() name : string;

    @Column() status : 'unavailable' | 'available';

    @Column() totalCapacity : number;

    @Column() remainCapacity : number;

}
