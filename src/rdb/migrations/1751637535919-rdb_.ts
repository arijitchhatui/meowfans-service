import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rdb_1751637535919 implements MigrationInterface {
  name = 'Rdb_1751637535919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message_channels" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "creator_id" uuid NOT NULL, "fan_id" uuid NOT NULL, "creator_last_seen_at" TIMESTAMP NOT NULL, "fan_last_seen_at" TIMESTAMP NOT NULL, "creator_last_sent_at" TIMESTAMP NOT NULL, "fan_last_sent_at" TIMESTAMP NOT NULL, "is_pinned" boolean NOT NULL, "label" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9010c515344515e0b3f012593f7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_purchases" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "message_id" uuid NOT NULL, "fan_id" uuid NOT NULL, "purchased_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30997f909a7b0757e2ba2cc8b92" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_reactions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "message_id" uuid NOT NULL, "reaction" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_ce61e365d81a9dfc15cd36513b" UNIQUE ("message_id"), CONSTRAINT "PK_654a9f0059ff93a8f156be66a5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_replies" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "message_id" uuid NOT NULL, "replier_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_fda45a5a3210d71f099fab59d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "content" character varying NOT NULL, "creator_id" uuid NOT NULL, "fan_id" uuid NOT NULL, "channel_id" uuid NOT NULL, "price" integer NOT NULL DEFAULT '0', "is_exclusive" boolean NOT NULL DEFAULT false, "unlocked_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "replied_to" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_assets" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "message_id" uuid NOT NULL, "asset_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f7b9bbeae429a2a0e8b6356b1f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_comments" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "comment" character varying NOT NULL, "user_id" uuid NOT NULL, "post_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_2e99e04b4a1b31de6f833c18ced" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_likes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "post_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4ac7cb9daf243939c6eabb2e0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchases" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "type" character varying NOT NULL, "related_entity_id" character varying NOT NULL, "fan_id" uuid NOT NULL, "purchased_at" TIMESTAMP NOT NULL DEFAULT now(), "post_id" uuid, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_saves" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "post_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_cc353b734984826187670b5bca5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_shares" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "post_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_41290cd17ae407e8d73aaa4fa93" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "caption" character varying NOT NULL, "creator_id" uuid NOT NULL, "is_exclusive" boolean NOT NULL, "price" integer NOT NULL, "like_count" integer NOT NULL DEFAULT '0', "save_count" integer NOT NULL DEFAULT '0', "share_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_assets" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "post_id" uuid NOT NULL, "asset_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_ed08ca38aaa5e342de73e419b33" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "creator_assets" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "creator_id" uuid NOT NULL, "asset_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_15b27e2009e8054c90afeaa10a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fan_assets" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "fan_id" uuid NOT NULL, "asset_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_725034528539bf1cada4f776493" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "raw_url" character varying NOT NULL, "blurred_url" character varying NOT NULL, "creator_id" uuid NOT NULL, "type" character varying NOT NULL, "mime_type" character varying NOT NULL, "content_type" character varying NOT NULL, "is_video" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "creator_follows" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "following_user_id" uuid NOT NULL, "followed_creator_id" uuid NOT NULL, "followed_at" TIMESTAMP NOT NULL DEFAULT now(), "un_followed_at" TIMESTAMP, CONSTRAINT "PK_387c689dec7af1245dd2d7599c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "creator_interfaces" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "mode" character varying NOT NULL, "creator_id" uuid NOT NULL, "background_image" character varying NOT NULL, "can_receive_call" boolean NOT NULL DEFAULT true, "is_pg_filter_on" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_44d61461bb2b4f2091b19c9bb7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription_plans" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "creator_id" uuid NOT NULL, "description" character varying NOT NULL, "tier" character varying NOT NULL, "price" integer NOT NULL, "banner_url" character varying NOT NULL, "subscribed_at" TIMESTAMP NOT NULL DEFAULT now(), "synced_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "creator_id" uuid NOT NULL, "subscriber_id" uuid NOT NULL, "creator_payment_profile_id" uuid NOT NULL, "subscription_plan_id" uuid NOT NULL, "stripe_subscription_id" character varying NOT NULL, "months" integer NOT NULL, "price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "synced_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_a442b5ac4f7a8f51a64b2060c4" UNIQUE ("subscription_plan_id"), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "creator_payment_profiles" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "stripe_connect_id" character varying NOT NULL, "creator_id" uuid NOT NULL, "can_transfer" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_d1d1dc742512b4092e2017065c" UNIQUE ("creator_id"), CONSTRAINT "PK_fb1e3da0210d4df9aee3d12d431" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "creator_restricts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "creator_id" uuid NOT NULL, "restricted_user_id" uuid NOT NULL, "restricted_at" TIMESTAMP NOT NULL DEFAULT now(), "un_restricted_at" TIMESTAMP, CONSTRAINT "PK_abf0d14df7f8cc64f31017a67ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_message_replies" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "message_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_bccf57a58b5c4417dc3170e3e0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "admin_id" uuid NOT NULL, "description" character varying NOT NULL, "group_name" character varying NOT NULL, "icon_url" character varying NOT NULL, "banner_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_pinned" boolean NOT NULL, "is_muted" boolean NOT NULL, "is_restricted" boolean NOT NULL, "is_blocked" boolean NOT NULL, "background_color" character varying NOT NULL, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_messages" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "group_id" uuid NOT NULL, "sender_id" uuid NOT NULL, "message" character varying NOT NULL, "is_exclusive" boolean NOT NULL, "is_pinned" boolean NOT NULL, "price" integer NOT NULL, "is_creator" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f4b396868f303fa38023b61d742" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "creator_id" uuid NOT NULL, "fan_id" uuid NOT NULL, "related_entity_id" character varying NOT NULL, "stripe_payment_id" character varying NOT NULL, "amount_in_cents" integer NOT NULL, "currency" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_accounts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "creator_id" uuid NOT NULL, "face_book" character varying NOT NULL, "twitter" character varying NOT NULL, "instagram" character varying NOT NULL, "website" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_e267fee92b326e6833003f5d38" UNIQUE ("creator_id"), CONSTRAINT "PK_e9e58d2d8e9fafa20af914d9750" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "creator-profiles" ("creator_id" uuid NOT NULL DEFAULT gen_random_uuid(), "full_name" character varying NOT NULL, "username" character varying NOT NULL, "gender" character varying NOT NULL, "region" character varying NOT NULL, "bio" character varying, "avatar_url" character varying, "banner_url" character varying, "allows_messaging" boolean NOT NULL DEFAULT false, "display_online_status" boolean NOT NULL DEFAULT false, "allows_comment" boolean NOT NULL DEFAULT false, "display_total_post" boolean NOT NULL DEFAULT true, "display_total_subscriber" boolean NOT NULL DEFAULT false, "total_public_post" integer NOT NULL DEFAULT '0', "total_exclusive_post" integer NOT NULL DEFAULT '0', "total_subscriber" integer NOT NULL DEFAULT '0', "theme_color" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "UQ_13574f05b702895b0ebfbf37a4a" UNIQUE ("username"), CONSTRAINT "REL_db5bf24e7af1fd71d67894fe57" UNIQUE ("user_id"), CONSTRAINT "PK_c61990154697d0ebd18bba680b2" PRIMARY KEY ("creator_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_db5bf24e7af1fd71d67894fe57" ON "creator-profiles" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "creator_blocks" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "blocked_user_id" uuid NOT NULL, "blocking_creator_id" uuid NOT NULL, "blocked_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ec7054617e59148df299e1751a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fan_payment_profiles" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "fan_id" uuid NOT NULL, "stripe_customer_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_236087fecad302a1ae1e133c8a3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profiles" ("user_id" uuid NOT NULL DEFAULT gen_random_uuid(), "full_name" character varying NOT NULL, "username" character varying NOT NULL, "avatar_url" character varying, "banner_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_7bdaa0714f4c1087a926a2d8369" UNIQUE ("username"), CONSTRAINT "PK_6ca9503d77ae39b4b5a6cc3ba88" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_6ca9503d77ae39b4b5a6cc3ba8" ON "user_profiles" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying NOT NULL, "password" character varying NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    await queryRunner.query(
      `CREATE TABLE "group_message_repliers" ("group_reply_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_b7052cbd677ec7a0d16ef3edb48" PRIMARY KEY ("group_reply_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_88fbb183fc4b61e14b3dddfcb7" ON "group_message_repliers" ("group_reply_id") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_aa9e334685414df2fa33330aec" ON "group_message_repliers" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "group_participants" ("group_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_92021b85af6470d6b405e12f312" PRIMARY KEY ("group_id", "user_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_e61f897ae7a7df4b56595adaae" ON "group_participants" ("group_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_bb1d0ab0d82e0a62fa55b7e841" ON "group_participants" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "group_moderators" ("group_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_50d23ddff65435f063e96b60d9f" PRIMARY KEY ("group_id", "user_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d1854fc26e455db08662d92d97" ON "group_moderators" ("group_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_614412ed563db5beb604cd336f" ON "group_moderators" ("user_id") `);
    await queryRunner.query(
      `CREATE TABLE "group_receivers" ("group_message_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_a6258545895384310b896afd9c5" PRIMARY KEY ("group_message_id", "user_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_660486956536bf2c3d349ae49c" ON "group_receivers" ("group_message_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_b2af2b2de21395f2d79c0ba363" ON "group_receivers" ("user_id") `);
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "FK_4297b125908228970139e00fcac" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_channels" ADD CONSTRAINT "FK_65ae4d6d3e0a5eb73fdc04ba37b" FOREIGN KEY ("fan_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_purchases" ADD CONSTRAINT "FK_a7218e9969ec386848d4c6962df" FOREIGN KEY ("fan_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_purchases" ADD CONSTRAINT "FK_d078a712d4a8287988e1f9cbe03" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_reactions" ADD CONSTRAINT "FK_ce61e365d81a9dfc15cd36513b0" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_replies" ADD CONSTRAINT "FK_fc2c783b801e133965ff54550cc" FOREIGN KEY ("replier_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_replies" ADD CONSTRAINT "FK_3183522b94b6b7626231e52562d" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_6d3af7a1e039990c05674518313" FOREIGN KEY ("replied_to") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_385f1ee7c0f2ac1ceca7bfae9f4" FOREIGN KEY ("fan_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_89d335717ae5351872114901ff9" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_86b9109b155eb70c0a2ca3b4b6d" FOREIGN KEY ("channel_id") REFERENCES "message_channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_assets" ADD CONSTRAINT "FK_5c7a3b56ba2bc171d725913f8f5" FOREIGN KEY ("asset_id") REFERENCES "creator_assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_assets" ADD CONSTRAINT "FK_11ed3d5b2dfbc265705fff99938" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comments" ADD CONSTRAINT "FK_8eb985b7bd35fd7bc760b6cbe8b" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comments" ADD CONSTRAINT "FK_e8ffd07822f03f90f637b13cd59" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" ADD CONSTRAINT "FK_9b9a7fc5eeff133cf71b8e06a7b" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes" ADD CONSTRAINT "FK_b40d37469c501092203d285af80" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_9246f7fb3792e747c4782aba7cf" FOREIGN KEY ("fan_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_f44b1f444769b9fc7517a73b071" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_saves" ADD CONSTRAINT "FK_6a7514ae4838468521daef6bdf9" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_saves" ADD CONSTRAINT "FK_355ebd53d93832b425412d27b1b" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_shares" ADD CONSTRAINT "FK_7337042728d8e163edcc2be13af" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_shares" ADD CONSTRAINT "FK_604427d3550c7c701024f89f79c" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_assets" ADD CONSTRAINT "FK_ae3495fdc7a04ae0a3ed29c0370" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_assets" ADD CONSTRAINT "FK_429328b24b6ac2040a29aeff9a7" FOREIGN KEY ("asset_id") REFERENCES "creator_assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_assets" ADD CONSTRAINT "FK_c6df7373eb9c5f1b7fcefbfc0a1" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_assets" ADD CONSTRAINT "FK_14aac7e2e6122d9c642d6dad795" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fan_assets" ADD CONSTRAINT "FK_dc0b2e4cf181080b25d396c5e6f" FOREIGN KEY ("fan_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fan_assets" ADD CONSTRAINT "FK_262753c8478d479fcdededb73dc" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_3890b1907a16921b6841f2fa650" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_follows" ADD CONSTRAINT "FK_83687d7db194cba14fe7859b9d7" FOREIGN KEY ("followed_creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_follows" ADD CONSTRAINT "FK_544cb7a5e4b5fe894ab987cca69" FOREIGN KEY ("following_user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_interfaces" ADD CONSTRAINT "FK_49329d47106472abdf647a8c292" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" ADD CONSTRAINT "FK_279f669e75485a611884f05d945" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_0005e2b3cee033cd1de9d15f7f5" FOREIGN KEY ("creator_payment_profile_id") REFERENCES "creator_payment_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_f56b7683178d56b3907fea72489" FOREIGN KEY ("subscriber_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_bb6b7c4cfcbce9713d3e6adb683" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_a442b5ac4f7a8f51a64b2060c48" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_payment_profiles" ADD CONSTRAINT "FK_d1d1dc742512b4092e2017065c9" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_restricts" ADD CONSTRAINT "FK_8b30bcbc0fc9a555a9730534010" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_restricts" ADD CONSTRAINT "FK_3e59cb3ea529214119b0a056974" FOREIGN KEY ("restricted_user_id") REFERENCES "user_profiles"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_message_replies" ADD CONSTRAINT "FK_b8039b9d730e99f54695483d451" FOREIGN KEY ("message_id") REFERENCES "group_messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_6cb1e260e901719aee56add582d" FOREIGN KEY ("admin_id") REFERENCES "creator-profiles"("creator_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_messages" ADD CONSTRAINT "FK_be264b91ac62d3b00c01212f565" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_messages" ADD CONSTRAINT "FK_ada93de56050fe469b3c53fe49f" FOREIGN KEY ("sender_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_012c6546f2d7017a8380c325d08" FOREIGN KEY ("creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_822baa9aafe32b46fd106fc11fd" FOREIGN KEY ("fan_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_accounts" ADD CONSTRAINT "FK_e267fee92b326e6833003f5d381" FOREIGN KEY ("creator_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator-profiles" ADD CONSTRAINT "FK_db5bf24e7af1fd71d67894fe57c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_blocks" ADD CONSTRAINT "FK_2e1739bb60f1cf25deb82dd0210" FOREIGN KEY ("blocking_creator_id") REFERENCES "creator-profiles"("creator_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_blocks" ADD CONSTRAINT "FK_f6d11fe4bfdb1b8cb4513f65e50" FOREIGN KEY ("blocked_user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fan_payment_profiles" ADD CONSTRAINT "FK_45fcdd12a45c89c2cded82d792f" FOREIGN KEY ("fan_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_message_repliers" ADD CONSTRAINT "FK_88fbb183fc4b61e14b3dddfcb70" FOREIGN KEY ("group_reply_id") REFERENCES "group_message_replies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_message_repliers" ADD CONSTRAINT "FK_aa9e334685414df2fa33330aec1" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_participants" ADD CONSTRAINT "FK_e61f897ae7a7df4b56595adaae7" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_participants" ADD CONSTRAINT "FK_bb1d0ab0d82e0a62fa55b7e8411" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_moderators" ADD CONSTRAINT "FK_d1854fc26e455db08662d92d97e" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_moderators" ADD CONSTRAINT "FK_614412ed563db5beb604cd336f2" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_receivers" ADD CONSTRAINT "FK_660486956536bf2c3d349ae49c8" FOREIGN KEY ("group_message_id") REFERENCES "group_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_receivers" ADD CONSTRAINT "FK_b2af2b2de21395f2d79c0ba363c" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group_receivers" DROP CONSTRAINT "FK_b2af2b2de21395f2d79c0ba363c"`);
    await queryRunner.query(`ALTER TABLE "group_receivers" DROP CONSTRAINT "FK_660486956536bf2c3d349ae49c8"`);
    await queryRunner.query(`ALTER TABLE "group_moderators" DROP CONSTRAINT "FK_614412ed563db5beb604cd336f2"`);
    await queryRunner.query(`ALTER TABLE "group_moderators" DROP CONSTRAINT "FK_d1854fc26e455db08662d92d97e"`);
    await queryRunner.query(`ALTER TABLE "group_participants" DROP CONSTRAINT "FK_bb1d0ab0d82e0a62fa55b7e8411"`);
    await queryRunner.query(`ALTER TABLE "group_participants" DROP CONSTRAINT "FK_e61f897ae7a7df4b56595adaae7"`);
    await queryRunner.query(`ALTER TABLE "group_message_repliers" DROP CONSTRAINT "FK_aa9e334685414df2fa33330aec1"`);
    await queryRunner.query(`ALTER TABLE "group_message_repliers" DROP CONSTRAINT "FK_88fbb183fc4b61e14b3dddfcb70"`);
    await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
    await queryRunner.query(`ALTER TABLE "fan_payment_profiles" DROP CONSTRAINT "FK_45fcdd12a45c89c2cded82d792f"`);
    await queryRunner.query(`ALTER TABLE "creator_blocks" DROP CONSTRAINT "FK_f6d11fe4bfdb1b8cb4513f65e50"`);
    await queryRunner.query(`ALTER TABLE "creator_blocks" DROP CONSTRAINT "FK_2e1739bb60f1cf25deb82dd0210"`);
    await queryRunner.query(`ALTER TABLE "creator-profiles" DROP CONSTRAINT "FK_db5bf24e7af1fd71d67894fe57c"`);
    await queryRunner.query(`ALTER TABLE "social_accounts" DROP CONSTRAINT "FK_e267fee92b326e6833003f5d381"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_822baa9aafe32b46fd106fc11fd"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_012c6546f2d7017a8380c325d08"`);
    await queryRunner.query(`ALTER TABLE "group_messages" DROP CONSTRAINT "FK_ada93de56050fe469b3c53fe49f"`);
    await queryRunner.query(`ALTER TABLE "group_messages" DROP CONSTRAINT "FK_be264b91ac62d3b00c01212f565"`);
    await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_6cb1e260e901719aee56add582d"`);
    await queryRunner.query(`ALTER TABLE "group_message_replies" DROP CONSTRAINT "FK_b8039b9d730e99f54695483d451"`);
    await queryRunner.query(`ALTER TABLE "creator_restricts" DROP CONSTRAINT "FK_3e59cb3ea529214119b0a056974"`);
    await queryRunner.query(`ALTER TABLE "creator_restricts" DROP CONSTRAINT "FK_8b30bcbc0fc9a555a9730534010"`);
    await queryRunner.query(`ALTER TABLE "creator_payment_profiles" DROP CONSTRAINT "FK_d1d1dc742512b4092e2017065c9"`);
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_a442b5ac4f7a8f51a64b2060c48"`);
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_bb6b7c4cfcbce9713d3e6adb683"`);
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_f56b7683178d56b3907fea72489"`);
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_0005e2b3cee033cd1de9d15f7f5"`);
    await queryRunner.query(`ALTER TABLE "subscription_plans" DROP CONSTRAINT "FK_279f669e75485a611884f05d945"`);
    await queryRunner.query(`ALTER TABLE "creator_interfaces" DROP CONSTRAINT "FK_49329d47106472abdf647a8c292"`);
    await queryRunner.query(`ALTER TABLE "creator_follows" DROP CONSTRAINT "FK_544cb7a5e4b5fe894ab987cca69"`);
    await queryRunner.query(`ALTER TABLE "creator_follows" DROP CONSTRAINT "FK_83687d7db194cba14fe7859b9d7"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_3890b1907a16921b6841f2fa650"`);
    await queryRunner.query(`ALTER TABLE "fan_assets" DROP CONSTRAINT "FK_262753c8478d479fcdededb73dc"`);
    await queryRunner.query(`ALTER TABLE "fan_assets" DROP CONSTRAINT "FK_dc0b2e4cf181080b25d396c5e6f"`);
    await queryRunner.query(`ALTER TABLE "creator_assets" DROP CONSTRAINT "FK_14aac7e2e6122d9c642d6dad795"`);
    await queryRunner.query(`ALTER TABLE "creator_assets" DROP CONSTRAINT "FK_c6df7373eb9c5f1b7fcefbfc0a1"`);
    await queryRunner.query(`ALTER TABLE "post_assets" DROP CONSTRAINT "FK_429328b24b6ac2040a29aeff9a7"`);
    await queryRunner.query(`ALTER TABLE "post_assets" DROP CONSTRAINT "FK_ae3495fdc7a04ae0a3ed29c0370"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad"`);
    await queryRunner.query(`ALTER TABLE "post_shares" DROP CONSTRAINT "FK_604427d3550c7c701024f89f79c"`);
    await queryRunner.query(`ALTER TABLE "post_shares" DROP CONSTRAINT "FK_7337042728d8e163edcc2be13af"`);
    await queryRunner.query(`ALTER TABLE "post_saves" DROP CONSTRAINT "FK_355ebd53d93832b425412d27b1b"`);
    await queryRunner.query(`ALTER TABLE "post_saves" DROP CONSTRAINT "FK_6a7514ae4838468521daef6bdf9"`);
    await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_f44b1f444769b9fc7517a73b071"`);
    await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_9246f7fb3792e747c4782aba7cf"`);
    await queryRunner.query(`ALTER TABLE "post_likes" DROP CONSTRAINT "FK_b40d37469c501092203d285af80"`);
    await queryRunner.query(`ALTER TABLE "post_likes" DROP CONSTRAINT "FK_9b9a7fc5eeff133cf71b8e06a7b"`);
    await queryRunner.query(`ALTER TABLE "post_comments" DROP CONSTRAINT "FK_e8ffd07822f03f90f637b13cd59"`);
    await queryRunner.query(`ALTER TABLE "post_comments" DROP CONSTRAINT "FK_8eb985b7bd35fd7bc760b6cbe8b"`);
    await queryRunner.query(`ALTER TABLE "message_assets" DROP CONSTRAINT "FK_11ed3d5b2dfbc265705fff99938"`);
    await queryRunner.query(`ALTER TABLE "message_assets" DROP CONSTRAINT "FK_5c7a3b56ba2bc171d725913f8f5"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_86b9109b155eb70c0a2ca3b4b6d"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_89d335717ae5351872114901ff9"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_385f1ee7c0f2ac1ceca7bfae9f4"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_6d3af7a1e039990c05674518313"`);
    await queryRunner.query(`ALTER TABLE "group_replies" DROP CONSTRAINT "FK_3183522b94b6b7626231e52562d"`);
    await queryRunner.query(`ALTER TABLE "group_replies" DROP CONSTRAINT "FK_fc2c783b801e133965ff54550cc"`);
    await queryRunner.query(`ALTER TABLE "message_reactions" DROP CONSTRAINT "FK_ce61e365d81a9dfc15cd36513b0"`);
    await queryRunner.query(`ALTER TABLE "message_purchases" DROP CONSTRAINT "FK_d078a712d4a8287988e1f9cbe03"`);
    await queryRunner.query(`ALTER TABLE "message_purchases" DROP CONSTRAINT "FK_a7218e9969ec386848d4c6962df"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "FK_65ae4d6d3e0a5eb73fdc04ba37b"`);
    await queryRunner.query(`ALTER TABLE "message_channels" DROP CONSTRAINT "FK_4297b125908228970139e00fcac"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b2af2b2de21395f2d79c0ba363"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_660486956536bf2c3d349ae49c"`);
    await queryRunner.query(`DROP TABLE "group_receivers"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_614412ed563db5beb604cd336f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d1854fc26e455db08662d92d97"`);
    await queryRunner.query(`DROP TABLE "group_moderators"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bb1d0ab0d82e0a62fa55b7e841"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e61f897ae7a7df4b56595adaae"`);
    await queryRunner.query(`DROP TABLE "group_participants"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_aa9e334685414df2fa33330aec"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_88fbb183fc4b61e14b3dddfcb7"`);
    await queryRunner.query(`DROP TABLE "group_message_repliers"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6ca9503d77ae39b4b5a6cc3ba8"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`DROP TABLE "fan_payment_profiles"`);
    await queryRunner.query(`DROP TABLE "creator_blocks"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_db5bf24e7af1fd71d67894fe57"`);
    await queryRunner.query(`DROP TABLE "creator-profiles"`);
    await queryRunner.query(`DROP TABLE "social_accounts"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "group_messages"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "group_message_replies"`);
    await queryRunner.query(`DROP TABLE "creator_restricts"`);
    await queryRunner.query(`DROP TABLE "creator_payment_profiles"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "subscription_plans"`);
    await queryRunner.query(`DROP TABLE "creator_interfaces"`);
    await queryRunner.query(`DROP TABLE "creator_follows"`);
    await queryRunner.query(`DROP TABLE "assets"`);
    await queryRunner.query(`DROP TABLE "fan_assets"`);
    await queryRunner.query(`DROP TABLE "creator_assets"`);
    await queryRunner.query(`DROP TABLE "post_assets"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "post_shares"`);
    await queryRunner.query(`DROP TABLE "post_saves"`);
    await queryRunner.query(`DROP TABLE "purchases"`);
    await queryRunner.query(`DROP TABLE "post_likes"`);
    await queryRunner.query(`DROP TABLE "post_comments"`);
    await queryRunner.query(`DROP TABLE "message_assets"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "group_replies"`);
    await queryRunner.query(`DROP TABLE "message_reactions"`);
    await queryRunner.query(`DROP TABLE "message_purchases"`);
    await queryRunner.query(`DROP TABLE "message_channels"`);
  }
}
