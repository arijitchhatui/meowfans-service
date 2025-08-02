import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1754127319385 implements MigrationInterface {
    name = 'Rdb_1754127319385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "types" text array NOT NULL DEFAULT '{EXCLUSIVE}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "types"`);
    }

}
