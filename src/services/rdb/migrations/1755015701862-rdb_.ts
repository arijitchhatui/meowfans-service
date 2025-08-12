import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1755015701862 implements MigrationInterface {
  name = 'Rdb_1755015701862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message_assets" DROP CONSTRAINT "FK_5c7a3b56ba2bc171d725913f8f5"`);
    await queryRunner.query(`ALTER TABLE "post_assets" DROP CONSTRAINT "FK_429328b24b6ac2040a29aeff9a7"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_assets" ADD CONSTRAINT "FK_429328b24b6ac2040a29aeff9a7" FOREIGN KEY ("asset_id") REFERENCES "creator_assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_assets" ADD CONSTRAINT "FK_5c7a3b56ba2bc171d725913f8f5" FOREIGN KEY ("asset_id") REFERENCES "creator_assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
