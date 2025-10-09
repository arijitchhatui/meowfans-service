import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759938726413 implements MigrationInterface {
  name = 'Rdb_1759938726413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await queryRunner.query(
      `CREATE INDEX "IDX_VAULTS_DESCRIPTION_TRGM" ON "vaults" USING gin ("description" gin_trgm_ops)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_VAULTS_PREVIEW" ON "vaults" ("preview")`);
    await queryRunner.query(`CREATE INDEX "IDX_VAULT_OBJECT_STATUS" ON "vault_objects" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_VAULT_OBJECT_FILE_TYPE" ON "vault_objects" ("file_type")`);
    await queryRunner.query(`CREATE INDEX "IDX_VAULT_OBJECT_CONTENT_TYPE" ON "vault_objects" ("content_type")`);

    await queryRunner.query(`CREATE INDEX "IDX_TAG_LABEL_TRGM" ON "tags" USING gin ("label" gin_trgm_ops)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_TAG_LABEL_TRGM"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULT_OBJECT_CONTENT_TYPE"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULT_OBJECT_FILE_TYPE"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULT_OBJECT_STATUS"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULT_ID"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULT_OBJECT_URL"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULTS_PREVIEW"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULTS_KEYWORDS_TRGM"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULTS_DESCRIPTION_TRGM"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_CREATOR_ID"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULT_URL"`);
  }
}
