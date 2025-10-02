import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759421628923 implements MigrationInterface {
  name = 'Rdb_1759421628923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" ADD "display_order" BIGSERIAL NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "display_order"`);
  }
}
