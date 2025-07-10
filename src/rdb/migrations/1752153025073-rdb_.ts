import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1752153025073 implements MigrationInterface {
    name = 'Rdb_1752153025073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_assets" DROP CONSTRAINT "FK_14aac7e2e6122d9c642d6dad795"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "total_post" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "creator_assets" ADD CONSTRAINT "FK_14aac7e2e6122d9c642d6dad795" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_assets" DROP CONSTRAINT "FK_14aac7e2e6122d9c642d6dad795"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "total_post"`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "creator_assets" ADD CONSTRAINT "FK_14aac7e2e6122d9c642d6dad795" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
