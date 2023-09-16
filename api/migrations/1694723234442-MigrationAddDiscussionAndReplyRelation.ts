import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationAddDiscussionAndReplyRelation1694723234442
  implements MigrationInterface
{
  name = 'MigrationAddDiscussionAndReplyRelation1694723234442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "reply"
            ADD CONSTRAINT "FK_522f2724d26dcdc524145105193" FOREIGN KEY ("discussion_id") REFERENCES "discussion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "reply" DROP CONSTRAINT "FK_522f2724d26dcdc524145105193"
        `);
  }
}
