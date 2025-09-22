import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1758548569318 implements MigrationInterface {
  name = 'Rdb_1758548569318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vaults" DROP CONSTRAINT "UQ_64fed5fa059564065b1848ca751"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vaults" ADD CONSTRAINT "UQ_64fed5fa059564065b1848ca751" UNIQUE ("url")`);
  }
}
