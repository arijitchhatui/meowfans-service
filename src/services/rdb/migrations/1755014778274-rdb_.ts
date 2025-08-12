import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1755014778274 implements MigrationInterface {
  name = 'Rdb_1755014778274';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message_assets" DROP CONSTRAINT "FK_b96d91a417ee77e2209cb07525d"`);
    await queryRunner.query(`ALTER TABLE "post_assets" DROP CONSTRAINT "FK_a4d8fd9a71f46468cd07c2d01e7"`);
    await queryRunner.query(`ALTER TABLE "message_assets" RENAME COLUMN "creator_asset_id" TO "asset_id"`);
    await queryRunner.query(`ALTER TABLE "post_assets" RENAME COLUMN "creator_asset_id" TO "asset_id"`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "last_comment_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "UQ_cbc318ed03389637c721e008ac0" UNIQUE ("last_comment_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_creator_follows_fanId_creator_id" ON "creator_follows" ("fan_id", "creator_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_follows" ADD CONSTRAINT "CHK_creator_follows_fan_id_is_not_equal_to_creator_id" CHECK ("fan_id" <> "creator_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_assets" ADD CONSTRAINT "FK_5c7a3b56ba2bc171d725913f8f5" FOREIGN KEY ("asset_id") REFERENCES "creator_assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_assets" ADD CONSTRAINT "FK_429328b24b6ac2040a29aeff9a7" FOREIGN KEY ("asset_id") REFERENCES "creator_assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_cbc318ed03389637c721e008ac0" FOREIGN KEY ("last_comment_id") REFERENCES "post_comments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_cbc318ed03389637c721e008ac0"`);
    await queryRunner.query(`ALTER TABLE "post_assets" DROP CONSTRAINT "FK_429328b24b6ac2040a29aeff9a7"`);
    await queryRunner.query(`ALTER TABLE "message_assets" DROP CONSTRAINT "FK_5c7a3b56ba2bc171d725913f8f5"`);
    await queryRunner.query(
      `ALTER TABLE "creator_follows" DROP CONSTRAINT "CHK_creator_follows_fan_id_is_not_equal_to_creator_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_creator_follows_fanId_creator_id"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "UQ_cbc318ed03389637c721e008ac0"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "last_comment_id"`);
    await queryRunner.query(`ALTER TABLE "post_assets" RENAME COLUMN "asset_id" TO "creator_asset_id"`);
    await queryRunner.query(`ALTER TABLE "message_assets" RENAME COLUMN "asset_id" TO "creator_asset_id"`);
    await queryRunner.query(
      `ALTER TABLE "post_assets" ADD CONSTRAINT "FK_a4d8fd9a71f46468cd07c2d01e7" FOREIGN KEY ("creator_asset_id") REFERENCES "creator_assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_assets" ADD CONSTRAINT "FK_b96d91a417ee77e2209cb07525d" FOREIGN KEY ("creator_asset_id") REFERENCES "creator_assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
