import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1745073145250 implements MigrationInterface {
  name = 'InitialMigration1745073145250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_location" DROP COLUMN "lat"`);
    await queryRunner.query(`ALTER TABLE "event_location" DROP COLUMN "lng"`);
    await queryRunner.query(
      `ALTER TABLE "event_contact" DROP COLUMN "contactPhoneNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_contact" DROP COLUMN "contactEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_location" ADD "location" geometry(Point,4326) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_contact" ADD "phoneNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_contact" ADD "email" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32b296abf35bf4c43f52239ba5" ON "event_location" USING GiST ("location") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_32b296abf35bf4c43f52239ba5"`,
    );
    await queryRunner.query(`ALTER TABLE "event_contact" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "event_contact" DROP COLUMN "phoneNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_location" DROP COLUMN "location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_contact" ADD "contactEmail" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_contact" ADD "contactPhoneNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_location" ADD "lng" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_location" ADD "lat" double precision`,
    );
  }
}
