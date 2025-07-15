import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1752600247932 implements MigrationInterface {
  name = 'Rdb_1752600247932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "unlock_price" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "unlock_price" SET NOT NULL`);
  }
}
