import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759743463469 implements MigrationInterface {
  name = 'Rdb_1759743463469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vaults" ADD "description" jsonb`);
    await queryRunner.query(`ALTER TABLE "vaults" ADD "keywords" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "keywords"`);
    await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "description"`);
  }
}
