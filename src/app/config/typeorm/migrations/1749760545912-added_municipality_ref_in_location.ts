import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedMunicipalityRefInLocation1749760545912 implements MigrationInterface {
    name = 'AddedMunicipalityRefInLocation1749760545912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_location" ADD "municipalityId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venture_location" ADD "municipalityId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_location" ADD CONSTRAINT "FK_007f8164896be5d3f0d55e66ddd" FOREIGN KEY ("municipalityId") REFERENCES "municipality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venture_location" ADD CONSTRAINT "FK_6ff019b318760c59fbc464aecdf" FOREIGN KEY ("municipalityId") REFERENCES "municipality"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venture_location" DROP CONSTRAINT "FK_6ff019b318760c59fbc464aecdf"`);
        await queryRunner.query(`ALTER TABLE "event_location" DROP CONSTRAINT "FK_007f8164896be5d3f0d55e66ddd"`);
        await queryRunner.query(`ALTER TABLE "venture_location" DROP COLUMN "municipalityId"`);
        await queryRunner.query(`ALTER TABLE "event_location" DROP COLUMN "municipalityId"`);
    }

}
