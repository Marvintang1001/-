

import {MigrationInterface, QueryRunner} from 'typeorm';

export class splitLogStockId1618883153630 implements MigrationInterface {

    public async up (queryRunner : QueryRunner) : Promise<void> {
        await queryRunner.query(
            'ALTER TABLE split ADD stockid character varying(64) NOT NULL DEFAULT \'0\''
        );
    }

    public async down (queryRunner : QueryRunner) : Promise<void> {
        await queryRunner.query(
            'ALTER TABLE split DROP COLUMN stockid'
        );
    }

}
