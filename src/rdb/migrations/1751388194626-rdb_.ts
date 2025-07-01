import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1751388194626 implements MigrationInterface {
    name = 'Rdb_1751388194626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "caption" character varying NOT NULL, "is_exclusive" boolean NOT NULL, "price" integer NOT NULL, "like_count" integer NOT NULL DEFAULT '0', "save_count" integer NOT NULL DEFAULT '0', "share_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_profile_user_id" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_e942b3452db1cd41d3d615ce3b0" FOREIGN KEY ("user_profile_user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_e942b3452db1cd41d3d615ce3b0"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
