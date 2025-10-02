import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759421556638 implements MigrationInterface {
  name = 'Rdb_1759421556638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "display_order"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" ADD "display_order" BIGSERIAL`);
  }
}
