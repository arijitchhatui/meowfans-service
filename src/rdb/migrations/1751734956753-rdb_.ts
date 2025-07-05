import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1751734956753 implements MigrationInterface {
  name = 'Rdb_1751734956753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "creator_blocks" DROP CONSTRAINT "FK_2e1739bb60f1cf25deb82dd0210"`);
    await queryRunner.query(`ALTER TABLE "creator_follows" DROP CONSTRAINT "FK_83687d7db194cba14fe7859b9d7"`);
    await queryRunner.query(`ALTER TABLE "creator_restricts" DROP CONSTRAINT "FK_8b30bcbc0fc9a555a9730534010"`);
    await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_6cb1e260e901719aee56add582d"`);
    await queryRunner.query(`ALTER TABLE "group_messages" DROP CONSTRAINT "FK_ada93de56050fe469b3c53fe49f"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_012c6546f2d7017a8380c325d08"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "FK_4297b125908228970139e00fcac"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_89d335717ae5351872114901ff9"`);
    await queryRunner.query(`ALTER TABLE "creator_assets" DROP CONSTRAINT "FK_c6df7373eb9c5f1b7fcefbfc0a1"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_3890b1907a16921b6841f2fa650"`);
    await queryRunner.query(`ALTER TABLE "creator_interfaces" DROP CONSTRAINT "FK_49329d47106472abdf647a8c292"`);
    await queryRunner.query(`ALTER TABLE "subscription_plans" DROP CONSTRAINT "FK_279f669e75485a611884f05d945"`);
    await queryRunner.query(`ALTER TABLE "creator_payment_profiles" DROP CONSTRAINT "FK_d1d1dc742512b4092e2017065c9"`);
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_bb6b7c4cfcbce9713d3e6adb683"`);
    await queryRunner.query(
      `CREATE TABLE "creator_profiles" ("creator_id" uuid NOT NULL DEFAULT gen_random_uuid(), "full_name" character varying NOT NULL, "username" character varying NOT NULL, "gender" character varying NOT NULL, "region" character varying NOT NULL, "bio" character varying, "avatar_url" character varying, "banner_url" character varying, "allows_messaging" boolean NOT NULL DEFAULT false, "display_online_status" boolean NOT NULL DEFAULT false, "allows_comment" boolean NOT NULL DEFAULT false, "display_total_post" boolean NOT NULL DEFAULT true, "display_total_subscriber" boolean NOT NULL DEFAULT false, "total_public_post" integer NOT NULL DEFAULT '0', "total_exclusive_post" integer NOT NULL DEFAULT '0', "total_subscriber" integer NOT NULL DEFAULT '0', "theme_color" character varying NOT NULL DEFAULT 'primary', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "UQ_817b1f769b78e0bb2e577442d07" UNIQUE ("username"), CONSTRAINT "REL_6fae0dfbe41d4c7b37a6e3251c" UNIQUE ("user_id"), CONSTRAINT "PK_160748c85c3c9634aba90c2b765" PRIMARY KEY ("creator_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_6fae0dfbe41d4c7b37a6e3251c" ON "creator_profiles" ("user_id") `);
    await queryRunner.query(
      `ALTER TABLE "creator_blocks" ADD CONSTRAINT "FK_2e1739bb60f1cf25deb82dd0210" FOREIGN KEY ("blocking_creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_follows" ADD CONSTRAINT "FK_83687d7db194cba14fe7859b9d7" FOREIGN KEY ("followed_creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_restricts" ADD CONSTRAINT "FK_8b30bcbc0fc9a555a9730534010" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_6cb1e260e901719aee56add582d" FOREIGN KEY ("admin_id") REFERENCES "creator_profiles"("creator_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_messages" ADD CONSTRAINT "FK_ada93de56050fe469b3c53fe49f" FOREIGN KEY ("sender_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_012c6546f2d7017a8380c325d08" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "FK_4297b125908228970139e00fcac" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_89d335717ae5351872114901ff9" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_assets" ADD CONSTRAINT "FK_c6df7373eb9c5f1b7fcefbfc0a1" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_3890b1907a16921b6841f2fa650" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_interfaces" ADD CONSTRAINT "FK_49329d47106472abdf647a8c292" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" ADD CONSTRAINT "FK_279f669e75485a611884f05d945" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_profiles" ADD CONSTRAINT "FK_6fae0dfbe41d4c7b37a6e3251c5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_payment_profiles" ADD CONSTRAINT "FK_d1d1dc742512b4092e2017065c9" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_bb6b7c4cfcbce9713d3e6adb683" FOREIGN KEY ("creator_id") REFERENCES "creator_profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_bb6b7c4cfcbce9713d3e6adb683"`);
    await queryRunner.query(`ALTER TABLE "creator_payment_profiles" DROP CONSTRAINT "FK_d1d1dc742512b4092e2017065c9"`);
    await queryRunner.query(`ALTER TABLE "creator_profiles" DROP CONSTRAINT "FK_6fae0dfbe41d4c7b37a6e3251c5"`);
    await queryRunner.query(`ALTER TABLE "subscription_plans" DROP CONSTRAINT "FK_279f669e75485a611884f05d945"`);
    await queryRunner.query(`ALTER TABLE "creator_interfaces" DROP CONSTRAINT "FK_49329d47106472abdf647a8c292"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_3890b1907a16921b6841f2fa650"`);
    await queryRunner.query(`ALTER TABLE "creator_assets" DROP CONSTRAINT "FK_c6df7373eb9c5f1b7fcefbfc0a1"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_89d335717ae5351872114901ff9"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "FK_4297b125908228970139e00fcac"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_012c6546f2d7017a8380c325d08"`);
    await queryRunner.query(`ALTER TABLE "group_messages" DROP CONSTRAINT "FK_ada93de56050fe469b3c53fe49f"`);
    await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_6cb1e260e901719aee56add582d"`);
    await queryRunner.query(`ALTER TABLE "creator_restricts" DROP CONSTRAINT "FK_8b30bcbc0fc9a555a9730534010"`);
    await queryRunner.query(`ALTER TABLE "creator_follows" DROP CONSTRAINT "FK_83687d7db194cba14fe7859b9d7"`);
    await queryRunner.query(`ALTER TABLE "creator_blocks" DROP CONSTRAINT "FK_2e1739bb60f1cf25deb82dd0210"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6fae0dfbe41d4c7b37a6e3251c"`);
    await queryRunner.query(`DROP TABLE "creator_profiles"`);
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_bb6b7c4cfcbce9713d3e6adb683" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_payment_profiles" ADD CONSTRAINT "FK_d1d1dc742512b4092e2017065c9" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" ADD CONSTRAINT "FK_279f669e75485a611884f05d945" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_interfaces" ADD CONSTRAINT "FK_49329d47106472abdf647a8c292" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_3890b1907a16921b6841f2fa650" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_assets" ADD CONSTRAINT "FK_c6df7373eb9c5f1b7fcefbfc0a1" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_89d335717ae5351872114901ff9" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "FK_4297b125908228970139e00fcac" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_012c6546f2d7017a8380c325d08" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_messages" ADD CONSTRAINT "FK_ada93de56050fe469b3c53fe49f" FOREIGN KEY ("sender_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_6cb1e260e901719aee56add582d" FOREIGN KEY ("admin_id") REFERENCES "creator-profiles"("creator_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_restricts" ADD CONSTRAINT "FK_8b30bcbc0fc9a555a9730534010" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_follows" ADD CONSTRAINT "FK_83687d7db194cba14fe7859b9d7" FOREIGN KEY ("followed_creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_blocks" ADD CONSTRAINT "FK_2e1739bb60f1cf25deb82dd0210" FOREIGN KEY ("blocking_creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
