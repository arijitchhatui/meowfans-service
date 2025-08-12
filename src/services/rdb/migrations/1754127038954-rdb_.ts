import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1754127038954 implements MigrationInterface {
  name = 'Rdb_1754127038954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."posts_type_enum"`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "type" text array NOT NULL DEFAULT '{EXCLUSIVE}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "type"`);
    await queryRunner.query(
      `CREATE TYPE "public"."posts_type_enum" AS ENUM('PUBLIC', 'EXCLUSIVE', 'PRIVATE', 'ARCHIVED', 'HIDDEN', 'BANNED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "type" "public"."posts_type_enum" array NOT NULL DEFAULT '{EXCLUSIVE}'`,
    );
  }
}
