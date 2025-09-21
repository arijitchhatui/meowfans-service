import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1758451173752 implements MigrationInterface {
  name = 'Rdb_1758451173752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."DownloadStates" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."DownloadStates" AS ENUM('PENDING', 'FULFILLED', 'REJECTED', 'PROCESSING')`,
    );
    await queryRunner.query(`ALTER TABLE "vaults" ADD "status" "public"."DownloadStates" NOT NULL DEFAULT 'PENDING'`);
  }
}
