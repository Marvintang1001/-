

import {Entity, Column} from 'typeorm';

import {PostgresModel} from '@app/core/repository';


@Entity({name : 'stock'})
export class StockModel extends PostgresModel {

    @Column() address : string;

    @Column() name : string;

    @Column() status : 'unavailable' | 'available';

}
