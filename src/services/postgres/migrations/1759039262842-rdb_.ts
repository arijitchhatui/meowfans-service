import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1759039262842 implements MigrationInterface {
    name = 'Rdb_1759039262842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_objects" ADD "file_type" "public"."FileType" NOT NULL DEFAULT 'image'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault_objects" DROP COLUMN "file_type"`);
    }

}
