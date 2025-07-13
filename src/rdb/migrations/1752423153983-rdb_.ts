import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1752423153983 implements MigrationInterface {
    name = 'Rdb_1752423153983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "premium_post_unlocks" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "fan_id" uuid NOT NULL, "post_id" uuid NOT NULL, "amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6264200d57e672852d60f5f4693" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "related_entity_id"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_f44b1f444769b9fc7517a73b071"`);
        await queryRunner.query(`ALTER TABLE "purchases" ALTER COLUMN "post_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_f44b1f444769b9fc7517a73b071" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "premium_post_unlocks" ADD CONSTRAINT "FK_87a35c33a032443e3b84cad0906" FOREIGN KEY ("fan_id") REFERENCES "user_profiles"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "premium_post_unlocks" ADD CONSTRAINT "FK_aee9e99835374ebdf57c1f94c5d" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "premium_post_unlocks" DROP CONSTRAINT "FK_aee9e99835374ebdf57c1f94c5d"`);
        await queryRunner.query(`ALTER TABLE "premium_post_unlocks" DROP CONSTRAINT "FK_87a35c33a032443e3b84cad0906"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_f44b1f444769b9fc7517a73b071"`);
        await queryRunner.query(`ALTER TABLE "purchases" ALTER COLUMN "post_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_f44b1f444769b9fc7517a73b071" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "related_entity_id" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "premium_post_unlocks"`);
    }

}
