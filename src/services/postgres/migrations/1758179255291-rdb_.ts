import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1758179255291 implements MigrationInterface {
    name = 'Rdb_1758179255291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_assets" ADD "type" character varying NOT NULL DEFAULT 'private'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_assets" DROP COLUMN "type"`);
    }

}
