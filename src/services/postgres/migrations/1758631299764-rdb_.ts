import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1758631299764 implements MigrationInterface {
  name = 'Rdb_1758631299764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "passwords" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_72ee375de524a1d87396f4f2a0" UNIQUE ("user_id"), CONSTRAINT "PK_c5629066962a085dea3b605e49f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "passwords" ADD CONSTRAINT "FK_72ee375de524a1d87396f4f2a02" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "passwords" DROP CONSTRAINT "FK_72ee375de524a1d87396f4f2a02"`);
    await queryRunner.query(`DROP TABLE "passwords"`);
  }
}
