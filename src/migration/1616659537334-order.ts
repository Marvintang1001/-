

import {MigrationInterface, QueryRunner} from 'typeorm';

export class order1616659537334 implements MigrationInterface {

    public async up (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('CREATE SEQUENCE order_id_seq');
        await queryRunner.query(`
            CREATE TABLE order (
                created_at bigint NOT NULL,
                updated_at bigint NOT NULL,
                expired_at bigint,
                deleted_at bigint,
                id integer NOT NULL PRIMARY KEY
                    DEFAULT nextval('order_id_seq'),
                packageId integer NOT NULL,
                origin character varying(128) NOT NULL,
                target character varying(128) NOT NULL,
                type character varying(64) NOT NULL,
                status character varying(64) NOT NULL,
                remark character varying(128)
            )
        `);
    }

    public async down (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('DROP TABLE order');
        await queryRunner.query('DROP SEQUENCE order_id_seq');
    }

}
