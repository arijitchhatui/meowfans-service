import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1759822539620 implements MigrationInterface {
  name = 'Rdb_1759822539620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vaults" ADD "preview" character varying NOT NULL DEFAULT 'https://meowfans-media.sfo3.cdn.digitaloceanspaces.com/meowfans_banner.png'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vaults" DROP COLUMN "preview"`);
  }
}
