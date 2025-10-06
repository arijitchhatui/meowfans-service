import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1759776535089 implements MigrationInterface {
    name = 'Rdb_1759776535089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_VAULTS_KEYWORDS_GIN"`);
        await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "keywords"`);
        await queryRunner.query(`ALTER TABLE "vaults" ADD "keywords" jsonb`);
        await queryRunner.query(`CREATE INDEX "IDX_VAULTS_KEYWORDS_GIN" ON "vaults" ("keywords") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_VAULTS_KEYWORDS_GIN"`);
        await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "keywords"`);
        await queryRunner.query(`ALTER TABLE "vaults" ADD "keywords" text array`);
        await queryRunner.query(`CREATE INDEX "IDX_VAULTS_KEYWORDS_GIN" ON "vaults" ("keywords") `);
    }

}
