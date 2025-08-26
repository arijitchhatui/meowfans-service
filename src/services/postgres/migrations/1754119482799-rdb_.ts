import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1754119482799 implements MigrationInterface {
  name = 'Rdb_1754119482799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "is_exclusive"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "is_exclusive" boolean NOT NULL`);
  }
}
