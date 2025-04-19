import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletedMiddlewareRelations1745083221970
  implements MigrationInterface
{
  name = 'DeletedMiddlewareRelations1745083221970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "publication_clap" DROP CONSTRAINT "FK_d416fa3a042be6ef74eda25366f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_comment" DROP CONSTRAINT "FK_2b450fc521733fc7b201d1b6db2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_publication" DROP CONSTRAINT "FK_51604a9b0c9fe8b98d2830be3c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" DROP CONSTRAINT "FK_5ee085724b9dd045b32cc883e20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" DROP CONSTRAINT "FK_9ab73c93814d73b17bad742038c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" DROP CONSTRAINT "FK_283aedf2d20f13ee2f1b94ab4e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" DROP CONSTRAINT "FK_4fc7d41d3a6092a3e86beaf61a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" DROP CONSTRAINT "FK_949a957b1c17b89edb682d97ed5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" DROP CONSTRAINT "FK_95c2fd6f679a7d55bb07cb87cd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" DROP CONSTRAINT "FK_b9c64ca0f53eb12ab48c1613a66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" DROP CONSTRAINT "FK_60a1fcc2b968a655b1eafb1500a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_a90f56a5cd4cb6823f2e632db6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_f05fcc9b589876b45e82e17b313"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_clap" RENAME COLUMN "userDetailId" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_comment" RENAME COLUMN "authorDetailId" TO "authorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_publication" RENAME COLUMN "detailId" TO "ventureId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" RENAME COLUMN "subscriberDetailId" TO "subscriberId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" RENAME COLUMN "donorDetailId" TO "donorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" RENAME COLUMN "userDetailId" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" DROP COLUMN "sponsorDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" DROP COLUMN "ventureDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" DROP CONSTRAINT "REL_95c2fd6f679a7d55bb07cb87cd"`,
    );
    await queryRunner.query(`ALTER TABLE "venture" DROP COLUMN "detailId"`);
    await queryRunner.query(
      `ALTER TABLE "venture" DROP COLUMN "ownerDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "REL_f05fcc9b589876b45e82e17b31"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "detailId"`);
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" ADD "sponsorId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" ADD "ventureId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "venture" ADD "ownerId" uuid`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('M', 'F', 'O')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "gender" "public"."user_gender_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "birthDate" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "user" ADD "municipalityId" integer`);
    await queryRunner.query(
      `ALTER TABLE "venture_publication" ALTER COLUMN "ventureId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_clap" ADD CONSTRAINT "FK_185eda225bae4dd49767a5f1715" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_comment" ADD CONSTRAINT "FK_beec41ad6b289cbb3807a75606b" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "venture" ADD CONSTRAINT "FK_6fbaf21ef151926c152487526d7" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" ADD CONSTRAINT "FK_b9c64ca0f53eb12ab48c1613a66" FOREIGN KEY ("ventureId") REFERENCES "venture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" ADD CONSTRAINT "FK_bb37ac65de33ee1d40fed551afd" FOREIGN KEY ("donorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9e842bb46880bd914d89d678f23" FOREIGN KEY ("municipalityId") REFERENCES "municipality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9e842bb46880bd914d89d678f23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" DROP CONSTRAINT "FK_bb37ac65de33ee1d40fed551afd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" DROP CONSTRAINT "FK_b9c64ca0f53eb12ab48c1613a66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" DROP CONSTRAINT "FK_6fbaf21ef151926c152487526d7"`,
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
      `ALTER TABLE "publication_comment" DROP CONSTRAINT "FK_beec41ad6b289cbb3807a75606b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_clap" DROP CONSTRAINT "FK_185eda225bae4dd49767a5f1715"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_publication" ALTER COLUMN "ventureId" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "municipalityId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthDate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    await queryRunner.query(`ALTER TABLE "venture" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" DROP COLUMN "ventureId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" DROP COLUMN "sponsorId"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "detailId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "REL_f05fcc9b589876b45e82e17b31" UNIQUE ("detailId")`,
    );
    await queryRunner.query(`ALTER TABLE "venture" ADD "ownerDetailId" uuid`);
    await queryRunner.query(`ALTER TABLE "venture" ADD "detailId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "venture" ADD CONSTRAINT "REL_95c2fd6f679a7d55bb07cb87cd" UNIQUE ("detailId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" ADD "ventureDetailId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" ADD "sponsorDetailId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" RENAME COLUMN "userId" TO "userDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" RENAME COLUMN "donorId" TO "donorDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" RENAME COLUMN "subscriberId" TO "subscriberDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_publication" RENAME COLUMN "ventureId" TO "detailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_comment" RENAME COLUMN "authorId" TO "authorDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_clap" RENAME COLUMN "userId" TO "userDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_f05fcc9b589876b45e82e17b313" FOREIGN KEY ("detailId") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_a90f56a5cd4cb6823f2e632db6b" FOREIGN KEY ("userDetailId") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" ADD CONSTRAINT "FK_60a1fcc2b968a655b1eafb1500a" FOREIGN KEY ("donorDetailId") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_event" ADD CONSTRAINT "FK_b9c64ca0f53eb12ab48c1613a66" FOREIGN KEY ("ventureId") REFERENCES "venture_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" ADD CONSTRAINT "FK_95c2fd6f679a7d55bb07cb87cd3" FOREIGN KEY ("detailId") REFERENCES "venture_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture" ADD CONSTRAINT "FK_949a957b1c17b89edb682d97ed5" FOREIGN KEY ("ownerDetailId") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" ADD CONSTRAINT "FK_4fc7d41d3a6092a3e86beaf61a8" FOREIGN KEY ("ventureId") REFERENCES "venture_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_subscription" ADD CONSTRAINT "FK_283aedf2d20f13ee2f1b94ab4e9" FOREIGN KEY ("subscriberDetailId") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" ADD CONSTRAINT "FK_9ab73c93814d73b17bad742038c" FOREIGN KEY ("ventureDetailId") REFERENCES "venture_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_sponsorship" ADD CONSTRAINT "FK_5ee085724b9dd045b32cc883e20" FOREIGN KEY ("sponsorDetailId") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "venture_publication" ADD CONSTRAINT "FK_51604a9b0c9fe8b98d2830be3c0" FOREIGN KEY ("detailId") REFERENCES "venture_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_comment" ADD CONSTRAINT "FK_2b450fc521733fc7b201d1b6db2" FOREIGN KEY ("authorDetailId") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publication_clap" ADD CONSTRAINT "FK_d416fa3a042be6ef74eda25366f" FOREIGN KEY ("userDetailId") REFERENCES "user_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
