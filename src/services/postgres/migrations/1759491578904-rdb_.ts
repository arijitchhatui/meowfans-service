import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759491578904 implements MigrationInterface {
  name = 'Rdb_1759491578904';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vault_objects" ADD "imported_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "blurred_url" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "blurred_url" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "vault_objects" DROP COLUMN "imported_at"`);
  }
}
