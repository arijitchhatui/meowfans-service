import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1752776851320 implements MigrationInterface {
  name = 'Rdb_1752776851320';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message_replies" DROP CONSTRAINT "FK_3183522b94b6b7626231e52562d"`);
    await queryRunner.query(
      `ALTER TABLE "message_replies" ADD CONSTRAINT "FK_6be8c1ed3936f924e8abd422dd4" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message_replies" DROP CONSTRAINT "FK_6be8c1ed3936f924e8abd422dd4"`);
    await queryRunner.query(
      `ALTER TABLE "message_replies" ADD CONSTRAINT "FK_3183522b94b6b7626231e52562d" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
