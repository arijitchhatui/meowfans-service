import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1751731606335 implements MigrationInterface {
  name = 'Rdb_1751731606335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "creator-profiles" ALTER COLUMN "theme_color" SET DEFAULT 'primary'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "creator-profiles" ALTER COLUMN "theme_color" DROP DEFAULT`);
  }
}
