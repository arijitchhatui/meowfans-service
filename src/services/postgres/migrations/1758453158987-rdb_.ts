import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1758453158987 implements MigrationInterface {
  name = 'Rdb_1758453158987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."DownloadStates" AS ENUM('PENDING', 'FULFILLED', 'REJECTED', 'PROCESSING')`,
    );
    await queryRunner.query(
      `ALTER TABLE "vault_objects" ADD "status" "public"."DownloadStates" NOT NULL DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vault_objects" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."DownloadStates"`);
  }
}
