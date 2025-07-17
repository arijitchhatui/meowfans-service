import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1752776629939 implements MigrationInterface {
  name = 'Rdb_1752776629939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group_replies" RENAME TO "message_replies"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message_replies" RENAME TO "group_replies"`);
  }
}
