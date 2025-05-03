import { MigrationInterface, QueryRunner } from 'typeorm';

export class FullMigration1746304848560 implements MigrationInterface {
  name = 'FullMigration1746304848560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event_location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "location" geometry(Point,4326), "description" character varying, CONSTRAINT "PK_ff5c43e186f7faf15a975004d76" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32b296abf35bf4c43f52239ba5" ON "event_location" USING GiST ("location") `,
    );
    await queryRunner.query(
      `CREATE TABLE "event_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d2c138089f45f7c3fa916ffb680" UNIQUE ("name"), CONSTRAINT "UQ_e54027ddeaa367b9424368369fe" UNIQUE ("slug"), CONSTRAINT "PK_697909a55bde1b28a90560f3ae2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying, "email" character varying, CONSTRAINT "PK_116c524d7488f6d480e81486dd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "venture_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cd0cbf85fda2894ca3670e13dba" UNIQUE ("slug"), CONSTRAINT "PK_080ff1d61711c66ff3d0d0047a3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "venture_contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d5ab63d9515bc9e8fddc02fed16" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "venture_location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "location" geometry(Point,4326) NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_171e4b54255956cd8c1ebf8cdb9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_206c3cdd3b9d531f20a753211c" ON "venture_location" USING GiST ("location") `,
    );
    await queryRunner.query(
      `CREATE TABLE "publication_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48cf7036f633bc8b4273e16029f" UNIQUE ("name"), CONSTRAINT "UQ_f71b553d24fc2c030d2992eea8c" UNIQUE ("slug"), CONSTRAINT "PK_18d2ff1319078daf8b3389d784b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "publication_clap" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "publicationId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c0605459d0002d718a2b4489fd1" UNIQUE ("publicationId", "userId"), CONSTRAINT "PK_b922aaa32a25269409e4be916a9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "publication_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "publicationId" uuid, CONSTRAINT "PK_94aa9acc74dc91f6d8a67b65561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."publication_content_type_enum" AS ENUM('TEXT', 'IMAGE', 'VIDEO', 'LINK', 'FILE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "publication_content" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."publication_content_type_enum" NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "publicationId" uuid, CONSTRAINT "PK_c648065d0892dad82db6391d9a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "venture_publication" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "clapsCount" integer NOT NULL DEFAULT '0', "commentsCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "ventureId" uuid, CONSTRAINT "PK_c3103680864a54b94200b942c8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "venture_sponsorship" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "monthlyAmount" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sponsorId" uuid, "ventureId" uuid, CONSTRAINT "PK_7181db499e44d450815c3c6e41e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "venture_subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "subscriberId" uuid NOT NULL, "ventureId" uuid NOT NULL, CONSTRAINT "UQ_1b8c89660f51b020bfaa06045aa" UNIQUE ("subscriberId", "ventureId"), CONSTRAINT "PK_2a7113c36b63dcc57eac62c5d7e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "venture" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "coverPhoto" character varying NOT NULL, "description" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "verified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "locationId" uuid, "ownerId" uuid, "ventureContactId" uuid, CONSTRAINT "UQ_178c50144f7917026343db20a14" UNIQUE ("slug"), CONSTRAINT "REL_1c9f271ebecb43a7fcfc22b520" UNIQUE ("locationId"), CONSTRAINT "REL_eb81407836a7107c7da87c795f" UNIQUE ("ventureContactId"), CONSTRAINT "PK_a0c1eb7cf68fcd445c8e95e54cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "venture_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "coverPhoto" character varying NOT NULL, "slug" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ventureId" uuid, "locationId" uuid, "contactId" uuid, CONSTRAINT "UQ_095b870fcd338577b2893196f3a" UNIQUE ("slug"), CONSTRAINT "REL_efbde017900c28cfc9023a8ed8" UNIQUE ("locationId"), CONSTRAINT "REL_2baabe01c0475470bf640e66bb" UNIQUE ("contactId"), CONSTRAINT "PK_081322fa181072abf88054716f8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_donation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "currency" character varying NOT NULL, "amount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "donorId" uuid, "eventId" uuid, CONSTRAINT "PK_d675cf6ad8b6b4692cd15117913" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('WELCOME', 'ACCOUNT_VERIFIED', 'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED', 'NEW_FOLLOWER', 'NEW_COMMENT', 'NEW_SPONSOR', 'NEW_DONATION')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_status_enum" AS ENUM('READ', 'UNREAD')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "type" "public"."notification_type_enum" NOT NULL, "status" "public"."notification_status_enum" NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."role_name_enum" AS ENUM('ADMIN', 'USER', 'MODERATOR', 'NEWS_WRITER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."role_name_enum" NOT NULL, "label" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "address" character varying NOT NULL, "facebookUrl" character varying NOT NULL, "linkedinUrl" character varying NOT NULL, "twitterUrl" character varying NOT NULL, "instagramUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_894dc440ade508fba6831724ec6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('M', 'F', 'O')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "picture" character varying NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "onboardingCompleted" boolean NOT NULL DEFAULT false, "verified" boolean NOT NULL DEFAULT false, "gender" "public"."user_gender_enum", "birthDate" TIMESTAMP, "contactId" uuid, "municipalityId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_6530f8ceb93f81306e5396384e" UNIQUE ("contactId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "municipality" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departmentId" integer, CONSTRAINT "PK_281ad341f20df7c41b83a182e2a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "department" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "x_event_event_category" ("categoryId" uuid NOT NULL, "eventId" uuid NOT NULL, CONSTRAINT "PK_41d7f531e70bb833bd5ea0971b1" PRIMARY KEY ("categoryId", "eventId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9d88210cf43325fa3280da4a88" ON "x_event_event_category" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96337ce4a54f81a0ce27eb73f9" ON "x_event_event_category" ("eventId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "x_publication_publication_category" ("categoryId" uuid NOT NULL, "publicationId" uuid NOT NULL, CONSTRAINT "PK_71ab91fe98d3cdaff8a072dd810" PRIMARY KEY ("categoryId", "publicationId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_77c7108489a46bc63c47c0b302" ON "x_publication_publication_category" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a2ad3fdf06807b54fd3e04594f" ON "x_publication_publication_category" ("publicationId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "x_venture_venture_category" ("ventureId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_c53b77d9d77d675a9f3ff4ee2fe" PRIMARY KEY ("ventureId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a107ce426b94c0018cd2568077" ON "x_venture_venture_category" ("ventureId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f71ebdce08f3477fb93900e947" ON "x_venture_venture_category" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "x_user_preference" ("userId" uuid NOT NULL, "ventureCategoryId" uuid NOT NULL, CONSTRAINT "PK_72bafb3f74dd6b7d638ac7a010a" PRIMARY KEY ("userId", "ventureCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17567bf0eff77322c8a8328a1f" ON "x_user_preference" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0b2bdbae10cace9b15f0cb2931" ON "x_user_preference" ("ventureCategoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "x_user_role" ("userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_efc5b209cbcd07a6ba330f7b794" PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c1b0e6079b8931f32e563a1ed0" ON "x_user_role" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5b52a843d579d6bcb9bb87d073" ON "x_user_role" ("roleId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_clap" ADD CONSTRAINT "FK_0005a860b5bf7ed00a91438fb45" FOREIGN KEY ("publicationId") REFERENCES "venture_publication"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_clap" ADD CONSTRAINT "FK_185eda225bae4dd49767a5f1715" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_comment" ADD CONSTRAINT "FK_beec41ad6b289cbb3807a75606b" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_comment" ADD CONSTRAINT "FK_56cb9d029614767e671164f4103" FOREIGN KEY ("publicationId") REFERENCES "venture_publication"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_content" ADD CONSTRAINT "FK_e2a679842415dd0aa7ddb2d7a40" FOREIGN KEY ("publicationId") REFERENCES "venture_publication"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_publication" ADD CONSTRAINT "FK_baabc52bc136ac925e254484c04" FOREIGN KEY ("ventureId") REFERENCES "venture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" ADD CONSTRAINT "FK_95dcaa21d49f568fc3d158c886c" FOREIGN KEY ("sponsorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" ADD CONSTRAINT "FK_ddc3c45f2df0bdc1aeb6b4662b6" FOREIGN KEY ("ventureId") REFERENCES "venture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" ADD CONSTRAINT "FK_80b776176b2d81dd7f181eb65c2" FOREIGN KEY ("subscriberId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" ADD CONSTRAINT "FK_4fc7d41d3a6092a3e86beaf61a8" FOREIGN KEY ("ventureId") REFERENCES "venture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" ADD CONSTRAINT "FK_1c9f271ebecb43a7fcfc22b5206" FOREIGN KEY ("locationId") REFERENCES "venture_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" ADD CONSTRAINT "FK_6fbaf21ef151926c152487526d7" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" ADD CONSTRAINT "FK_eb81407836a7107c7da87c795ff" FOREIGN KEY ("ventureContactId") REFERENCES "venture_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" ADD CONSTRAINT "FK_b9c64ca0f53eb12ab48c1613a66" FOREIGN KEY ("ventureId") REFERENCES "venture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" ADD CONSTRAINT "FK_efbde017900c28cfc9023a8ed8b" FOREIGN KEY ("locationId") REFERENCES "event_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" ADD CONSTRAINT "FK_2baabe01c0475470bf640e66bb4" FOREIGN KEY ("contactId") REFERENCES "event_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" ADD CONSTRAINT "FK_bb37ac65de33ee1d40fed551afd" FOREIGN KEY ("donorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" ADD CONSTRAINT "FK_4958b9cde8f62fe60c1beda193d" FOREIGN KEY ("eventId") REFERENCES "venture_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_6530f8ceb93f81306e5396384e8" FOREIGN KEY ("contactId") REFERENCES "user_contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9e842bb46880bd914d89d678f23" FOREIGN KEY ("municipalityId") REFERENCES "municipality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "municipality" ADD CONSTRAINT "FK_1b1dc8aafdb17dec9067cc5bdb1" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_event_event_category" ADD CONSTRAINT "FK_9d88210cf43325fa3280da4a88b" FOREIGN KEY ("categoryId") REFERENCES "event_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_event_event_category" ADD CONSTRAINT "FK_96337ce4a54f81a0ce27eb73f93" FOREIGN KEY ("eventId") REFERENCES "venture_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_publication_publication_category" ADD CONSTRAINT "FK_77c7108489a46bc63c47c0b3026" FOREIGN KEY ("categoryId") REFERENCES "publication_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_publication_publication_category" ADD CONSTRAINT "FK_a2ad3fdf06807b54fd3e04594fc" FOREIGN KEY ("publicationId") REFERENCES "venture_publication"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_venture_venture_category" ADD CONSTRAINT "FK_a107ce426b94c0018cd2568077e" FOREIGN KEY ("ventureId") REFERENCES "venture"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_venture_venture_category" ADD CONSTRAINT "FK_f71ebdce08f3477fb93900e947a" FOREIGN KEY ("categoryId") REFERENCES "venture_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_user_preference" ADD CONSTRAINT "FK_17567bf0eff77322c8a8328a1f5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_user_preference" ADD CONSTRAINT "FK_0b2bdbae10cace9b15f0cb29313" FOREIGN KEY ("ventureCategoryId") REFERENCES "venture_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_user_role" ADD CONSTRAINT "FK_c1b0e6079b8931f32e563a1ed0f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_user_role" ADD CONSTRAINT "FK_5b52a843d579d6bcb9bb87d0736" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "x_user_role" DROP CONSTRAINT "FK_5b52a843d579d6bcb9bb87d0736"`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_user_role" DROP CONSTRAINT "FK_c1b0e6079b8931f32e563a1ed0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_user_preference" DROP CONSTRAINT "FK_0b2bdbae10cace9b15f0cb29313"`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_user_preference" DROP CONSTRAINT "FK_17567bf0eff77322c8a8328a1f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_venture_venture_category" DROP CONSTRAINT "FK_f71ebdce08f3477fb93900e947a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_venture_venture_category" DROP CONSTRAINT "FK_a107ce426b94c0018cd2568077e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_publication_publication_category" DROP CONSTRAINT "FK_a2ad3fdf06807b54fd3e04594fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_publication_publication_category" DROP CONSTRAINT "FK_77c7108489a46bc63c47c0b3026"`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_event_event_category" DROP CONSTRAINT "FK_96337ce4a54f81a0ce27eb73f93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_event_event_category" DROP CONSTRAINT "FK_9d88210cf43325fa3280da4a88b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "municipality" DROP CONSTRAINT "FK_1b1dc8aafdb17dec9067cc5bdb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9e842bb46880bd914d89d678f23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_6530f8ceb93f81306e5396384e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" DROP CONSTRAINT "FK_4958b9cde8f62fe60c1beda193d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" DROP CONSTRAINT "FK_bb37ac65de33ee1d40fed551afd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" DROP CONSTRAINT "FK_2baabe01c0475470bf640e66bb4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" DROP CONSTRAINT "FK_efbde017900c28cfc9023a8ed8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" DROP CONSTRAINT "FK_b9c64ca0f53eb12ab48c1613a66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" DROP CONSTRAINT "FK_eb81407836a7107c7da87c795ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" DROP CONSTRAINT "FK_6fbaf21ef151926c152487526d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" DROP CONSTRAINT "FK_1c9f271ebecb43a7fcfc22b5206"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" DROP CONSTRAINT "FK_4fc7d41d3a6092a3e86beaf61a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" DROP CONSTRAINT "FK_80b776176b2d81dd7f181eb65c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" DROP CONSTRAINT "FK_ddc3c45f2df0bdc1aeb6b4662b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" DROP CONSTRAINT "FK_95dcaa21d49f568fc3d158c886c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_publication" DROP CONSTRAINT "FK_baabc52bc136ac925e254484c04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_content" DROP CONSTRAINT "FK_e2a679842415dd0aa7ddb2d7a40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_comment" DROP CONSTRAINT "FK_56cb9d029614767e671164f4103"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_comment" DROP CONSTRAINT "FK_beec41ad6b289cbb3807a75606b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_clap" DROP CONSTRAINT "FK_185eda225bae4dd49767a5f1715"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_clap" DROP CONSTRAINT "FK_0005a860b5bf7ed00a91438fb45"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5b52a843d579d6bcb9bb87d073"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c1b0e6079b8931f32e563a1ed0"`,
    );
    await queryRunner.query(`DROP TABLE "x_user_role"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b2bdbae10cace9b15f0cb2931"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17567bf0eff77322c8a8328a1f"`,
    );
    await queryRunner.query(`DROP TABLE "x_user_preference"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f71ebdce08f3477fb93900e947"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a107ce426b94c0018cd2568077"`,
    );
    await queryRunner.query(`DROP TABLE "x_venture_venture_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a2ad3fdf06807b54fd3e04594f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_77c7108489a46bc63c47c0b302"`,
    );
    await queryRunner.query(`DROP TABLE "x_publication_publication_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96337ce4a54f81a0ce27eb73f9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9d88210cf43325fa3280da4a88"`,
    );
    await queryRunner.query(`DROP TABLE "x_event_event_category"`);
    await queryRunner.query(`DROP TABLE "department"`);
    await queryRunner.query(`DROP TABLE "municipality"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    await queryRunner.query(`DROP TABLE "user_contact"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TYPE "public"."notification_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    await queryRunner.query(`DROP TABLE "event_donation"`);
    await queryRunner.query(`DROP TABLE "venture_event"`);
    await queryRunner.query(`DROP TABLE "venture"`);
    await queryRunner.query(`DROP TABLE "venture_subscription"`);
    await queryRunner.query(`DROP TABLE "venture_sponsorship"`);
    await queryRunner.query(`DROP TABLE "venture_publication"`);
    await queryRunner.query(`DROP TABLE "publication_content"`);
    await queryRunner.query(
      `DROP TYPE "public"."publication_content_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "publication_comment"`);
    await queryRunner.query(`DROP TABLE "publication_clap"`);
    await queryRunner.query(`DROP TABLE "publication_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_206c3cdd3b9d531f20a753211c"`,
    );
    await queryRunner.query(`DROP TABLE "venture_location"`);
    await queryRunner.query(`DROP TABLE "venture_contact"`);
    await queryRunner.query(`DROP TABLE "venture_category"`);
    await queryRunner.query(`DROP TABLE "event_contact"`);
    await queryRunner.query(`DROP TABLE "event_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_32b296abf35bf4c43f52239ba5"`,
    );
    await queryRunner.query(`DROP TABLE "event_location"`);
  }
}
