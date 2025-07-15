import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1752597097708 implements MigrationInterface {
  name = 'Rdb_1752597097708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "comment_count" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "comment_count"`);
  }
}
