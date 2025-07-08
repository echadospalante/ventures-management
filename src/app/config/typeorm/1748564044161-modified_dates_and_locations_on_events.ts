import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifiedDatesAndLocationsOnEvents1748564044161
  implements MigrationInterface
{
  name = 'ModifiedDatesAndLocationsOnEvents1748564044161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "venture_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "coverPhoto" character varying NOT NULL, "slug" character varying NOT NULL, "datesAndHours" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ventureId" uuid, "locationId" uuid, "contactId" uuid, CONSTRAINT "UQ_095b870fcd338577b2893196f3a" UNIQUE ("slug"), CONSTRAINT "REL_efbde017900c28cfc9023a8ed8" UNIQUE ("locationId"), CONSTRAINT "REL_2baabe01c0475470bf640e66bb" UNIQUE ("contactId"), CONSTRAINT "PK_081322fa181072abf88054716f8" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "event_donation" ADD CONSTRAINT "FK_4958b9cde8f62fe60c1beda193d" FOREIGN KEY ("eventId") REFERENCES "venture_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "x_event_event_category" ADD CONSTRAINT "FK_96337ce4a54f81a0ce27eb73f93" FOREIGN KEY ("eventId") REFERENCES "venture_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "x_event_event_category" DROP CONSTRAINT "FK_96337ce4a54f81a0ce27eb73f93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_donation" DROP CONSTRAINT "FK_4958b9cde8f62fe60c1beda193d"`,
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
    await queryRunner.query(`DROP TABLE "venture_event"`);
  }
}
