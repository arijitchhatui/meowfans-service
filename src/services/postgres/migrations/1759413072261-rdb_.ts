import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759413072261 implements MigrationInterface {
  name = 'Rdb_1759413072261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" ADD "display_order" bigint`);
    await queryRunner.query(`ALTER TABLE "vault_objects" ADD "suffix" bigint`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "vault_object_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "UQ_46d1fa7f2659c2381dacfb2c3fb" UNIQUE ("vault_object_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_46d1fa7f2659c2381dacfb2c3fb" FOREIGN KEY ("vault_object_id") REFERENCES "vault_objects"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_46d1fa7f2659c2381dacfb2c3fb"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "UQ_46d1fa7f2659c2381dacfb2c3fb"`);
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_46d1fa7f2659c2381dacfb2c3fb" FOREIGN KEY ("vault_object_id") REFERENCES "vault_objects"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
