import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1759757553359 implements MigrationInterface {
    name = 'Rdb_1759757553359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_VAULTS_KEYWORDS_GIN" ON "vaults" ("keywords") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_VAULTS_KEYWORDS_GIN"`);
    }

}
