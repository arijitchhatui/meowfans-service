import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1756541137407 implements MigrationInterface {
  name = 'Rdb_1756541137407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_5ad08604a291d62d985fcd569ad"`);
    await queryRunner.query(`ALTER TABLE "sessions" RENAME COLUMN "session_user" TO "user_id"`);
    await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "user_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`);
    await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "user_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "sessions" RENAME COLUMN "user_id" TO "session_user"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_5ad08604a291d62d985fcd569ad" FOREIGN KEY ("session_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
