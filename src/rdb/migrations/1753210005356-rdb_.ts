import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1753210005356 implements MigrationInterface {
    name = 'Rdb_1753210005356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_creator"`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" DROP CONSTRAINT "UQ_9c968f59530c36324cf0746edd8"`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" DROP COLUMN "avatar_url"`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" DROP COLUMN "banner_url"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP CONSTRAINT "UQ_817b1f769b78e0bb2e577442d07"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "avatar_url"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "banner_url"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying NOT NULL DEFAULT 'Swift'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying NOT NULL DEFAULT 'Send'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL DEFAULT 'username'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar_url" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "banner_url" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" text array NOT NULL DEFAULT '{fan}'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_login_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" ADD "is_banned" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" ADD "applied_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "accepted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "rejected_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "social_accounts" ALTER COLUMN "face_book" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_accounts" ALTER COLUMN "twitter" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_accounts" ALTER COLUMN "instagram" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_accounts" ALTER COLUMN "website" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_accounts" ALTER COLUMN "website" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_accounts" ALTER COLUMN "instagram" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_accounts" ALTER COLUMN "twitter" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "social_accounts" ALTER COLUMN "face_book" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "verified"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "rejected_at"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" DROP COLUMN "accepted_at"`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" DROP COLUMN "applied_at"`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" DROP COLUMN "is_banned"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "banner_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "banner_url" character varying`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "avatar_url" character varying`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "region" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "gender" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD CONSTRAINT "UQ_817b1f769b78e0bb2e577442d07" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "creator_profiles" ADD "full_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" ADD "banner_url" character varying`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" ADD "avatar_url" character varying`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" ADD CONSTRAINT "UQ_9c968f59530c36324cf0746edd8" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "fan_profiles" ADD "full_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_creator" boolean NOT NULL DEFAULT false`);
    }

}
