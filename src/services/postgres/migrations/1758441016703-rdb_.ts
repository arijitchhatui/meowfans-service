import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1758441016703 implements MigrationInterface {
  name = 'Rdb_1758441016703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vault_objects" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "object_url" character varying NOT NULL, "vault_id" uuid NOT NULL, "status" "public"."DownloadStates" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_ea7abc279f6f12c966dad88fdf9" UNIQUE ("object_url"), CONSTRAINT "PK_168303f6a554c8bf5ac59903bed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_VAULT_ID" ON "vault_objects" ("vault_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_VAULT_OBJECT_URL" ON "vault_objects" ("object_url") `);
    await queryRunner.query(
      `ALTER TABLE "vault_objects" ADD CONSTRAINT "FK_0d57600c2c06f36cb793d17fc81" FOREIGN KEY ("vault_id") REFERENCES "vaults"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vault_objects" DROP CONSTRAINT "FK_0d57600c2c06f36cb793d17fc81"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_VAULT_OBJECT_URL"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_VAULT_ID"`);
    await queryRunner.query(`DROP TABLE "vault_objects"`);
  }
}
