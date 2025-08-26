import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1752775905244 implements MigrationInterface {
  name = 'Rdb_1752775905244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group_replies" DROP CONSTRAINT "FK_fc2c783b801e133965ff54550cc"`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "total_earning" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group_replies" DROP COLUMN "replier_id"`);
    await queryRunner.query(`ALTER TABLE "group_replies" ADD "replier_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "total_earning"`);
    await queryRunner.query(
      `ALTER TABLE "group_replies" ADD CONSTRAINT "FK_fc2c783b801e133965ff54550cc" FOREIGN KEY ("replier_id") REFERENCES "fan_profiles"("fan_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
