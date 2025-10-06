import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759757201641 implements MigrationInterface {
  name = 'Rdb_1759757201641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "IDX_VAULTS_KEYWORDS_GIN" ON "vaults" USING GIN ("keywords") `);
    await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "vaults" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "keywords"`);
    await queryRunner.query(`ALTER TABLE "vaults" ADD "keywords" text array`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "keywords"`);
    await queryRunner.query(`ALTER TABLE "vaults" ADD "keywords" jsonb`);
    await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "vaults" ADD "description" jsonb`);
  }
}
