import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1751725935044 implements MigrationInterface {
  name = 'Rdb_1751725935044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "is_admin" TO "is_creator"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "is_creator" TO "is_admin"`);
  }
}
