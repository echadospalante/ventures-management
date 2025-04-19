import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeModificaEager1745075271854 implements MigrationInterface {
  name = 'SeModificaEager1745075271854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."role_label2_enum" AS ENUM('ADMIN', 'USER', 'MODERATOR', 'NEWS_WRITER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD "label2" "public"."role_label2_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "UQ_1d4b7d61ab19913b556c855a7cf" UNIQUE ("label2")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "UQ_1d4b7d61ab19913b556c855a7cf"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "label2"`);
    await queryRunner.query(`DROP TYPE "public"."role_label2_enum"`);
  }
}
