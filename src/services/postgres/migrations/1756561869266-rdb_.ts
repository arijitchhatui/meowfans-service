import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1756561869266 implements MigrationInterface {
    name = 'Rdb_1756561869266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "first_name" SET DEFAULT 'MEOW'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_name" SET DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET DEFAULT 'meow_user'`);
        await queryRunner.query(`CREATE INDEX "IDX_CREATOR_RESTRICTS_FAN_ID_CREATOR_ID" ON "creator_restricts" ("fan_id", "creator_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CREATOR_RESTRICTS_FAN_ID" ON "creator_restricts" ("fan_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CREATOR_RESTRICTS_CREATOR_ID" ON "creator_restricts" ("creator_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_FAN_ASSETS_ASSET_ID" ON "fan_assets" ("asset_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_FAN_ASSETS_FAN_ID" ON "fan_assets" ("fan_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_MESSAGE_CHANNELS_LAST_MESSAGE_ID" ON "message_channels" ("last_message_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_MESSAGE_CHANNELS_CREATED_AT" ON "message_channels" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_POSTS_CREATOR_ID" ON "posts" ("creator_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_COMMENTS_POST_ID" ON "post_comments" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_SUBSCRIPTIONS_CREATOR_ID_FAN_ID" ON "subscriptions" ("creator_id", "fan_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USER_USERNAME" ON "users" ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USER_EMAIL" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_FAN_PROFILE_APPLIED_AT_REJECTED_AT" ON "fan_profiles" ("applied_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_FAN_PROFILE_FAN_ID" ON "fan_profiles" ("fan_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_CREATOR_BLOCKS_CREATOR_ID_FAN_ID" ON "creator_blocks" ("creator_id", "fan_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CREATOR_BLOCKS_CREATOR_ID" ON "creator_blocks" ("creator_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CREATOR_BLOCKS_FAN_ID" ON "creator_blocks" ("fan_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CREATOR_PROFILES_VERIFIED" ON "creator_profiles" ("verified") `);
        await queryRunner.query(`CREATE INDEX "IDX_CREATOR_PROFILES_REJECTED_AT" ON "creator_profiles" ("rejected_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_CREATOR_PROFILES_ACCEPTED_AT" ON "creator_profiles" ("accepted_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_PROFILES_ACCEPTED_AT"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_PROFILES_REJECTED_AT"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_PROFILES_VERIFIED"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_BLOCKS_FAN_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_BLOCKS_CREATOR_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_BLOCKS_CREATOR_ID_FAN_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_FAN_PROFILE_FAN_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_FAN_PROFILE_APPLIED_AT_REJECTED_AT"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_EMAIL"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_USERNAME"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_SUBSCRIPTIONS_CREATOR_ID_FAN_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_COMMENTS_POST_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_POSTS_CREATOR_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MESSAGE_CHANNELS_CREATED_AT"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MESSAGE_CHANNELS_LAST_MESSAGE_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_FAN_ASSETS_FAN_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_FAN_ASSETS_ASSET_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_RESTRICTS_CREATOR_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_RESTRICTS_FAN_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CREATOR_RESTRICTS_FAN_ID_CREATOR_ID"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET DEFAULT 'username'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_name" SET DEFAULT 'Send'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "first_name" SET DEFAULT 'Swift'`);
    }

}
