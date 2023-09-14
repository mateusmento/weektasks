import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationAddCreatedAtToDiscussion1694689728636 implements MigrationInterface {
    name = 'MigrationAddCreatedAtToDiscussion1694689728636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "discussion"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "discussion" DROP COLUMN "created_at"
        `);
    }

}
