import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1758383507238 implements MigrationInterface {
  name = 'Rdb_1758383507238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."DownloadStates" AS ENUM('PENDING', 'FULFILLED', 'REJECTED', 'PROCESSING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vaults" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "creator_id" uuid NOT NULL, "url" character varying NOT NULL, "status" "public"."DownloadStates" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_64fed5fa059564065b1848ca751" UNIQUE ("url"), CONSTRAINT "PK_487a5346fa3693a430b6d6db60c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_CREATOR_ID" ON "vaults" ("creator_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_VAULT_URL" ON "vaults" ("url") `);
    await queryRunner.query(
      `ALTER TABLE "vaults" ADD CONSTRAINT "FK_e6554cab56fde4ee56e4f00f52e" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vaults" DROP CONSTRAINT "FK_e6554cab56fde4ee56e4f00f52e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_VAULT_URL"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_ID"`);
    await queryRunner.query(`DROP TABLE "vaults"`);
    await queryRunner.query(`DROP TYPE "public"."DownloadStates"`);
  }
}
