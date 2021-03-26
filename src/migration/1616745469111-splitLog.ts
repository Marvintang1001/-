

import {MigrationInterface, QueryRunner} from 'typeorm';

export class splitLog1616745469111 implements MigrationInterface {

    public async up (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('CREATE SEQUENCE split_id_seq');
        await queryRunner.query(`
            CREATE TABLE split (
                created_at bigint NOT NULL,
                updated_at bigint NOT NULL,
                expired_at bigint,
                deleted_at bigint,
                id integer NOT NULL PRIMARY KEY
                    DEFAULT nextval('split_id_seq'),
                origin integer[] NOT NULL,
                end integer[] NOT NULL
            )
        `);
    }

    public async down (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('DROP TABLE split');
        await queryRunner.query('DROP SEQUENCE split_id_seq');
    }

}
