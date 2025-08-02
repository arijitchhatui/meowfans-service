import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1753531381085 implements MigrationInterface {
  name = 'Rdb_1753531381085';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message_channel_participants" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "message_channel_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role" character varying NOT NULL, "last_seen_at" TIMESTAMP, "last_sent_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f6fbfbb34de1d4dec400a9b38d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "message_channels" DROP COLUMN "creator_last_seen_at"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP COLUMN "fan_last_seen_at"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP COLUMN "creator_last_sent_at"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP COLUMN "fan_last_sent_at"`);
    await queryRunner.query(`ALTER TABLE "message_channels" ADD "last_message_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "UQ_3c4529b97abcb0de72856d316f3" UNIQUE ("last_message_id")`,
    );
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "FK_4297b125908228970139e00fcac"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "FK_65ae4d6d3e0a5eb73fdc04ba37b"`);
    await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "creator_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "fan_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "message_channel_participants" ADD CONSTRAINT "FK_3cd6479d36f8640b4c9d2292d0d" FOREIGN KEY ("message_channel_id") REFERENCES "message_channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "FK_3c4529b97abcb0de72856d316f3" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "FK_4297b125908228970139e00fcac" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "FK_65ae4d6d3e0a5eb73fdc04ba37b" FOREIGN KEY ("fan_id") REFERENCES "fan_profiles"("fan_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "FK_65ae4d6d3e0a5eb73fdc04ba37b"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "FK_4297b125908228970139e00fcac"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "FK_3c4529b97abcb0de72856d316f3"`);
    await queryRunner.query(
      `ALTER TABLE "message_channel_participants" DROP CONSTRAINT "FK_3cd6479d36f8640b4c9d2292d0d"`,
    );
    await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "fan_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message_channels" ALTER COLUMN "creator_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "FK_65ae4d6d3e0a5eb73fdc04ba37b" FOREIGN KEY ("fan_id") REFERENCES "fan_profiles"("fan_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "FK_4297b125908228970139e00fcac" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "UQ_3c4529b97abcb0de72856d316f3"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP COLUMN "last_message_id"`);
    await queryRunner.query(`ALTER TABLE "message_channels" ADD "fan_last_sent_at" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message_channels" ADD "creator_last_sent_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "message_channels" ADD "fan_last_seen_at" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "message_channels" ADD "creator_last_seen_at" TIMESTAMP`);
    await queryRunner.query(`DROP TABLE "message_channel_participants"`);
  }
}
