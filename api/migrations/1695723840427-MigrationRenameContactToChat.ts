import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationRenameContactToChat1695723840427
  implements MigrationInterface
{
  name = 'MigrationRenameContactToChat1695723840427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contacts" RENAME TO "chats"`);

    await queryRunner.query(
      `ALTER TABLE "meetings" RENAME COLUMN "contact_id" TO "chat_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "messages" RENAME COLUMN "contact_id" TO "chat_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "contact_peers" RENAME COLUMN "contacts_id" TO "chats_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "contact_peers" RENAME TO "chat_peers"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chats" RENAME TO "contacts"`);

    await queryRunner.query(
      `ALTER TABLE "meetings" RENAME COLUMN "chat_id" TO "contact_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "messages" RENAME COLUMN "chat_id" TO "contact_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "chat_peers" RENAME COLUMN "chats_id" TO "contacts_id"`
    );

    await queryRunner.query(
      `ALTER TABLE "chat_peers" RENAME TO "contact_peers"`
    );
  }
}
