import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCommentsCountOnPublication1745162722629 implements MigrationInterface {
    name = 'AddedCommentsCountOnPublication1745162722629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venture_publication" ADD "commentsCount" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venture_publication" DROP COLUMN "commentsCount"`);
    }

}
