import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationAddCreatedAtToReply1694690620929
  implements MigrationInterface
{
  name = 'MigrationAddCreatedAtToReply1694690620929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "reply"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "reply" DROP COLUMN "created_at"
        `);
  }
}
