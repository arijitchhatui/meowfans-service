import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1758631481966 implements MigrationInterface {
    name = 'Rdb_1758631481966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passwords" ADD CONSTRAINT "UQ_d0a10460f043698b886b0bd97bf" UNIQUE ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_PASSWORD_USER_ID" ON "passwords" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_PASSWORD_EMAIL" ON "passwords" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_PASSWORD_EMAIL"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_PASSWORD_USER_ID"`);
        await queryRunner.query(`ALTER TABLE "passwords" DROP CONSTRAINT "UQ_d0a10460f043698b886b0bd97bf"`);
    }

}
