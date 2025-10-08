import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759855799039 implements MigrationInterface {
  name = 'Rdb_1759855799039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "label" character varying NOT NULL, CONSTRAINT "UQ_c3f918aeb3a1bba2e46f5945809" UNIQUE ("label"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vault_tags" ("tag_id" uuid NOT NULL, "vault_id" uuid NOT NULL, CONSTRAINT "PK_b43bcaa347028f52de05c137789" PRIMARY KEY ("tag_id", "vault_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_2b3fd4667b2be7a2d7a329083c" ON "vault_tags" ("tag_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_adf9f0b047319be1ec67ac1d1e" ON "vault_tags" ("vault_id") `);
    await queryRunner.query(
      `ALTER TABLE "vault_tags" ADD CONSTRAINT "FK_2b3fd4667b2be7a2d7a329083cc" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "vault_tags" ADD CONSTRAINT "FK_adf9f0b047319be1ec67ac1d1eb" FOREIGN KEY ("vault_id") REFERENCES "vaults"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vault_tags" DROP CONSTRAINT "FK_adf9f0b047319be1ec67ac1d1eb"`);
    await queryRunner.query(`ALTER TABLE "vault_tags" DROP CONSTRAINT "FK_2b3fd4667b2be7a2d7a329083cc"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_adf9f0b047319be1ec67ac1d1e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2b3fd4667b2be7a2d7a329083c"`);
    await queryRunner.query(`DROP TABLE "vault_tags"`);
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
