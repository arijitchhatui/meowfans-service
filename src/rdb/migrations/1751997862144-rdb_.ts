import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1751997862144 implements MigrationInterface {
    name = 'Rdb_1751997862144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_blocks" RENAME COLUMN "updated_at" TO "un_blocked_at"`);
        await queryRunner.query(`ALTER TABLE "creator_blocks" ALTER COLUMN "un_blocked_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creator_blocks" ALTER COLUMN "un_blocked_at" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_blocks" ALTER COLUMN "un_blocked_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "creator_blocks" ALTER COLUMN "un_blocked_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creator_blocks" RENAME COLUMN "un_blocked_at" TO "updated_at"`);
    }

}
