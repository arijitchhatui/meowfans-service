import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1754112119527 implements MigrationInterface {
  name = 'Rdb_1754112119527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."posts_type_enum" AS ENUM('PUBLIC', 'EXCLUSIVE', 'PRIVATE', 'ARCHIVED', 'HIDDEN', 'BANNED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "type" "public"."posts_type_enum" array NOT NULL DEFAULT '{EXCLUSIVE}'`,
    );
    await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "caption" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "caption" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."posts_type_enum"`);
  }
}
