import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1754127540983 implements MigrationInterface {
    name = 'Rdb_1754127540983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "type"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "type" text array NOT NULL DEFAULT '{EXCLUSIVE}'`);
    }

}
