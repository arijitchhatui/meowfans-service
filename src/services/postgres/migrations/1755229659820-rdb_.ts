import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1755229659820 implements MigrationInterface {
  name = 'Rdb_1755229659820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "is_video"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "content_type"`);
    await queryRunner.query(`CREATE TYPE "public"."MediaType" AS ENUM('profileMedia', 'messageMedia', 'postMedia')`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "media_type" "public"."MediaType" NOT NULL DEFAULT 'postMedia'`);
    await queryRunner.query(`CREATE TYPE "public"."FileType" AS ENUM('video', 'image', 'audio', 'document')`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "file_type" "public"."FileType" NOT NULL DEFAULT 'image'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "file_type"`);
    await queryRunner.query(`DROP TYPE "public"."FileType"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "media_type"`);
    await queryRunner.query(`DROP TYPE "public"."MediaType"`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "content_type" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "is_video" boolean NOT NULL DEFAULT false`);
  }
}
