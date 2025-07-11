import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1752233086291 implements MigrationInterface {
    name = 'Rdb_1752233086291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_89d335717ae5351872114901ff9"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_385f1ee7c0f2ac1ceca7bfae9f4"`);
        await queryRunner.query(`ALTER TABLE "group_messages" RENAME COLUMN "price" TO "unlock_price"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "price" TO "unlock_price"`);
        await queryRunner.query(`CREATE TABLE "message_access" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "message_id" character varying NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "PK_2ccf81346f688e3b8235dd1c430" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "creator_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "fan_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "message_channels" ADD "is_muted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "message_channels" ADD "is_restricted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "message_channels" ADD "is_messaging_blocked" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "message_channels" ADD "total_earning" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "message_reactions" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "sender_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "recipient_user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "unlock_price" double precision`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "has_access" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "creator_last_seen_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "creator_last_sent_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "is_pinned" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "label" SET DEFAULT 'Follower'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "label" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "is_pinned" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "creator_last_sent_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "creator_last_seen_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "has_access"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "unlock_price"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "recipient_user_id"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "sender_id"`);
        await queryRunner.query(`ALTER TABLE "message_reactions" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "message_channels" DROP COLUMN "total_earning"`);
        await queryRunner.query(`ALTER TABLE "message_channels" DROP COLUMN "is_messaging_blocked"`);
        await queryRunner.query(`ALTER TABLE "message_channels" DROP COLUMN "is_restricted"`);
        await queryRunner.query(`ALTER TABLE "message_channels" DROP COLUMN "is_muted"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "price" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "fan_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "creator_id" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "message_access"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "unlock_price" TO "price"`);
        await queryRunner.query(`ALTER TABLE "group_messages" RENAME COLUMN "unlock_price" TO "price"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_385f1ee7c0f2ac1ceca7bfae9f4" FOREIGN KEY ("fan_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_89d335717ae5351872114901ff9" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
