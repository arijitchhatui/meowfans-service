import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759201505990 implements MigrationInterface {
  name = 'Rdb_1759201505990';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."ContentType" AS ENUM('SFW', 'NSFW')`);
    await queryRunner.query(
      `ALTER TABLE "vault_objects" ADD "content_type" "public"."ContentType" NOT NULL DEFAULT 'SFW'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vault_objects" DROP COLUMN "content_type"`);
    await queryRunner.query(`DROP TYPE "public"."ContentType"`);
  }
}
