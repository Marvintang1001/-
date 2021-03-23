

import {MigrationInterface, QueryRunner} from 'typeorm';

export class package1616491406720 implements MigrationInterface {

    public async up (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('CREATE SEQUENCE package_id_seq');
        await queryRunner.query(`
            CREATE TABLE package (
                created_at bigint NOT NULL,
                updated_at bigint NOT NULL,
                expired_at bigint,
                deleted_at bigint,
                id integer NOT NULL PRIMARY KEY
                    DEFAULT nextval('package_id_seq'),
                stockId integer NOT NULL,
                remark character varying(128) NOT NULL,
                content jsonb NOT NULL
            )
        `);
    }

    public async down (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('DROP TABLE package');
        await queryRunner.query('DROP SEQUENCE package_id_seq');
    }

}
