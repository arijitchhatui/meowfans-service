import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759941013204 implements MigrationInterface {
  name = 'Rdb_1759941013204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_TAG_LABEL_TRGM"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULTS_DESCRIPTION_TRGM"`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vault_tags" (
        "tag_id" uuid NOT NULL,
        "vault_id" uuid NOT NULL,
        CONSTRAINT "PK_b43bcaa347028f52de05c137789" PRIMARY KEY ("tag_id", "vault_id")
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_2b3fd4667b2be7a2d7a329083c" ON "vault_tags" ("tag_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_adf9f0b047319be1ec67ac1d1e" ON "vault_tags" ("vault_id")`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_TAG_LABEL_TRGM" ON "tags" USING GIN ("label" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_VAULTS_DESCRIPTION_TRGM" ON "vaults" USING GIN ("description" gin_trgm_ops)`,
    );
    await queryRunner.query(`
      ALTER TABLE "vault_tags"
      ADD CONSTRAINT "FK_2b3fd4667b2be7a2d7a329083cc"
      FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "vault_tags"
      ADD CONSTRAINT "FK_adf9f0b047319be1ec67ac1d1eb"
      FOREIGN KEY ("vault_id") REFERENCES "vaults"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vault_tags" DROP CONSTRAINT "FK_adf9f0b047319be1ec67ac1d1eb"`);
    await queryRunner.query(`ALTER TABLE "vault_tags" DROP CONSTRAINT "FK_2b3fd4667b2be7a2d7a329083cc"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_VAULTS_DESCRIPTION_TRGM"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_TAG_LABEL_TRGM"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_adf9f0b047319be1ec67ac1d1e"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_2b3fd4667b2be7a2d7a329083c"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vault_tags"`);
  }
}
