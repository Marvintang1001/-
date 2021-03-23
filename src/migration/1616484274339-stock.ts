

import {MigrationInterface, QueryRunner} from 'typeorm';


export class stock1616484274339 implements MigrationInterface {

    public async up (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('CREATE SEQUENCE stock_id_seq');
        await queryRunner.query(`
            CREATE TABLE stock (
                created_at bigint NOT NULL,
                updated_at bigint NOT NULL,
                expired_at bigint,
                deleted_at bigint,
                id integer NOT NULL PRIMARY KEY
                    DEFAULT nextval('stock_id_seq'),
                address character varying(128) NOT NULL,
                name character varying(128) NOT NULL,
                status character varying(64) NOT NULL
            )
        `);
    }

    public async down (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('DROP TABLE stock');
        await queryRunner.query('DROP SEQUENCE stock_id_seq');
    }

}
