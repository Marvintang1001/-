

import {MigrationInterface, QueryRunner} from 'typeorm';

export class catagory1616485454899 implements MigrationInterface {

    public async up (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('CREATE SEQUENCE catagory_id_seq');
        await queryRunner.query(`
            CREATE TABLE catagory (
                created_at bigint NOT NULL,
                updated_at bigint NOT NULL,
                expired_at bigint,
                deleted_at bigint,
                id integer NOT NULL PRIMARY KEY
                    DEFAULT nextval('catagory_id_seq'),
                name character varying(128) NOT NULL,
                remark character varying(128)
            )
        `);
    }

    public async down (queryRunner : QueryRunner) : Promise<any> {
        await queryRunner.query('DROP TABLE catagory');
        await queryRunner.query('DROP SEQUENCE catagory_id_seq');
    }

}
