import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1751737718549 implements MigrationInterface {
    name = 'Rdb_1751737718549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP CONSTRAINT "FK_6fae0dfbe41d4c7b37a6e3251c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6fae0dfbe41d4c7b37a6e3251c"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP CONSTRAINT "REL_6fae0dfbe41d4c7b37a6e3251c"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "user_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_160748c85c3c9634aba90c2b76" ON "creator_profiles" ("creator_id") `);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD CONSTRAINT "FK_160748c85c3c9634aba90c2b765" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP CONSTRAINT "FK_160748c85c3c9634aba90c2b765"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_160748c85c3c9634aba90c2b76"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD CONSTRAINT "REL_6fae0dfbe41d4c7b37a6e3251c" UNIQUE ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_6fae0dfbe41d4c7b37a6e3251c" ON "creator_profiles" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD CONSTRAINT "FK_6fae0dfbe41d4c7b37a6e3251c5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
