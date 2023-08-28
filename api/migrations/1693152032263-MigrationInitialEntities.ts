import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationInitialEntities1693152032263
  implements MigrationInterface
{
  name = 'MigrationInitialEntities1693152032263';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
        "name" character varying NOT NULL,
        "credential_id" integer,
        CONSTRAINT "REL_23b9db2106e4f409452018f7a7" UNIQUE ("credential_id"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "credentials" (
        "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
        "username" character varying NOT NULL,
        "password" character varying NOT NULL,
        CONSTRAINT "UQ_9696610f85145a37910365498f9" UNIQUE ("username"),
        CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "sub_task" (
        "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
        "title" character varying NOT NULL,
        "completed" boolean NOT NULL DEFAULT false,
        "issue_id" integer NOT NULL,
        CONSTRAINT "PK_ccb15801cf521e9c45237f484c5" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "issue" (
        "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
        "title" character varying NOT NULL,
        "type" character varying NOT NULL DEFAULT 'story',
        "description" character varying NOT NULL DEFAULT '',
        "product_id" integer NOT NULL,
        "status" character varying NOT NULL DEFAULT 'todo',
        "estimation" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
            CREATE TABLE "backlog_item" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "product_id" integer NOT NULL,
                "issue_id" integer NOT NULL,
                "order" integer NOT NULL,
                CONSTRAINT "PK_4da836fa604d3eae1fc738701b4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "meetings" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "ongoing" boolean NOT NULL,
                "contact_id" integer NOT NULL,
                CONSTRAINT "REL_fb64da866a9ff812441898c857" UNIQUE ("contact_id"),
                CONSTRAINT "PK_aa73be861afa77eb4ed31f3ed57" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "meeting_attendees" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "remote_id" character varying NOT NULL,
                "user_id" integer NOT NULL,
                "meeting_id" integer NOT NULL,
                CONSTRAINT "PK_b49884a61337dbfb2f3018710da" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "messages" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "text" character varying NOT NULL,
                "sent_at" TIMESTAMP NOT NULL DEFAULT now(),
                "speaker_id" integer NOT NULL,
                "contact_id" integer NOT NULL,
                CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "contacts" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "type" character varying NOT NULL DEFAULT 'direct',
                "last_message_id" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "epic" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_1c02d43d72c5150bc888d452397" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "issue_comment" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "text" character varying NOT NULL,
                "issue_id" integer NOT NULL,
                "author_id" integer NOT NULL,
                CONSTRAINT "PK_2ad05784e2ae661fa409e5e0248" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "name" character varying NOT NULL,
                "owner_id" integer NOT NULL,
                CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "collaborator" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "user_id" integer NOT NULL,
                "product_id" integer NOT NULL,
                CONSTRAINT "PK_aa48142926d7bdb485d21ad2696" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "sprint_backlog_item" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "sprint_id" integer NOT NULL,
                "issue_id" integer NOT NULL,
                "order" integer NOT NULL,
                CONSTRAINT "PK_7e6bf4b8c5e4fc606e214e6e065" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "sprint" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "title" character varying NOT NULL,
                "product_id" integer NOT NULL,
                "order" integer NOT NULL,
                "started_at" TIMESTAMP,
                "ended_at" TIMESTAMP,
                "status" character varying NOT NULL DEFAULT 'idle',
                CONSTRAINT "PK_f371c7b5c4bc62fb2ba2bdb9f61" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "discussion" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "text" character varying NOT NULL,
                "type" character varying NOT NULL DEFAULT 'decision',
                "likes" integer NOT NULL DEFAULT '0',
                "issue_id" integer,
                "product_id" integer NOT NULL,
                "author_id" integer NOT NULL,
                CONSTRAINT "PK_b93169eb129e530c6a4c3b9fda1" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "like" (
                "user_id" integer NOT NULL,
                "discussion_id" integer NOT NULL,
                CONSTRAINT "PK_c21a03bf86116425b1d4f06da65" PRIMARY KEY ("user_id", "discussion_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "reply_like" (
                "user_id" integer NOT NULL,
                "reply_id" integer NOT NULL,
                CONSTRAINT "PK_0978c881738e7e45446cb731942" PRIMARY KEY ("user_id", "reply_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "reply" (
                "id" integer GENERATED ALWAYS AS IDENTITY NOT NULL,
                "text" character varying NOT NULL,
                "likes" integer NOT NULL DEFAULT '0',
                "discussion_id" integer NOT NULL,
                "author_id" integer NOT NULL,
                CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "assignee" (
                "issue_id" integer NOT NULL,
                "user_id" integer NOT NULL,
                CONSTRAINT "PK_c1c70432c3c61e006cd43c1d53d" PRIMARY KEY ("issue_id", "user_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_6f04b3461e2669379ff6c977ed" ON "assignee" ("issue_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_756526b664de47144ce637e63f" ON "assignee" ("user_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "contact_peers" (
                "contacts_id" integer NOT NULL,
                "users_id" integer NOT NULL,
                CONSTRAINT "PK_e6023f7d29610646daf725a621a" PRIMARY KEY ("contacts_id", "users_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_2b599525bb0ac2657f71ace439" ON "contact_peers" ("contacts_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_02845dd9703dc4d00a8a8834fd" ON "contact_peers" ("users_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_23b9db2106e4f409452018f7a76" FOREIGN KEY ("credential_id") REFERENCES "credentials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sub_task"
            ADD CONSTRAINT "FK_7240395fed5f911fefd409d1220" FOREIGN KEY ("issue_id") REFERENCES "issue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings"
            ADD CONSTRAINT "FK_fb64da866a9ff812441898c8577" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "meeting_attendees"
            ADD CONSTRAINT "FK_edda203440a111ad016876f8737" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "meeting_attendees"
            ADD CONSTRAINT "FK_8643679c49d7234b266433bc201" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "messages"
            ADD CONSTRAINT "FK_c9825229e2715f413a5b9b78d29" FOREIGN KEY ("speaker_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "messages"
            ADD CONSTRAINT "FK_d109211ed510ef10617c5e75927" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "contacts"
            ADD CONSTRAINT "FK_14fb2d56c2f4e323416414a8f0d" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "issue_comment"
            ADD CONSTRAINT "FK_029ff3bffa6d5a09b0a37b9a072" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product"
            ADD CONSTRAINT "FK_c2eedda8bf0194e1fb299ee7424" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "collaborator"
            ADD CONSTRAINT "FK_2b516ff163b9e85cb9adecc76c8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "collaborator"
            ADD CONSTRAINT "FK_1999a53048a1bfa764bdc39b927" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "discussion"
            ADD CONSTRAINT "FK_ece98699d7f7ab191a54202b6cb" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "reply"
            ADD CONSTRAINT "FK_0d98e8ade07b472e8af8b856e1b" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "assignee"
            ADD CONSTRAINT "FK_6f04b3461e2669379ff6c977eda" FOREIGN KEY ("issue_id") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "assignee"
            ADD CONSTRAINT "FK_756526b664de47144ce637e63fc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "contact_peers"
            ADD CONSTRAINT "FK_2b599525bb0ac2657f71ace439d" FOREIGN KEY ("contacts_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "contact_peers"
            ADD CONSTRAINT "FK_02845dd9703dc4d00a8a8834fd8" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "contact_peers" DROP CONSTRAINT "FK_02845dd9703dc4d00a8a8834fd8"
        `);
    await queryRunner.query(`
            ALTER TABLE "contact_peers" DROP CONSTRAINT "FK_2b599525bb0ac2657f71ace439d"
        `);
    await queryRunner.query(`
            ALTER TABLE "assignee" DROP CONSTRAINT "FK_756526b664de47144ce637e63fc"
        `);
    await queryRunner.query(`
            ALTER TABLE "assignee" DROP CONSTRAINT "FK_6f04b3461e2669379ff6c977eda"
        `);
    await queryRunner.query(`
            ALTER TABLE "reply" DROP CONSTRAINT "FK_0d98e8ade07b472e8af8b856e1b"
        `);
    await queryRunner.query(`
            ALTER TABLE "discussion" DROP CONSTRAINT "FK_ece98699d7f7ab191a54202b6cb"
        `);
    await queryRunner.query(`
            ALTER TABLE "collaborator" DROP CONSTRAINT "FK_1999a53048a1bfa764bdc39b927"
        `);
    await queryRunner.query(`
            ALTER TABLE "collaborator" DROP CONSTRAINT "FK_2b516ff163b9e85cb9adecc76c8"
        `);
    await queryRunner.query(`
            ALTER TABLE "product" DROP CONSTRAINT "FK_c2eedda8bf0194e1fb299ee7424"
        `);
    await queryRunner.query(`
            ALTER TABLE "issue_comment" DROP CONSTRAINT "FK_029ff3bffa6d5a09b0a37b9a072"
        `);
    await queryRunner.query(`
            ALTER TABLE "contacts" DROP CONSTRAINT "FK_14fb2d56c2f4e323416414a8f0d"
        `);
    await queryRunner.query(`
            ALTER TABLE "messages" DROP CONSTRAINT "FK_d109211ed510ef10617c5e75927"
        `);
    await queryRunner.query(`
            ALTER TABLE "messages" DROP CONSTRAINT "FK_c9825229e2715f413a5b9b78d29"
        `);
    await queryRunner.query(`
            ALTER TABLE "meeting_attendees" DROP CONSTRAINT "FK_8643679c49d7234b266433bc201"
        `);
    await queryRunner.query(`
            ALTER TABLE "meeting_attendees" DROP CONSTRAINT "FK_edda203440a111ad016876f8737"
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings" DROP CONSTRAINT "FK_fb64da866a9ff812441898c8577"
        `);
    await queryRunner.query(`
            ALTER TABLE "issue" DROP CONSTRAINT "FK_f85c57d1ef3145a5571679ced5c"
        `);
    await queryRunner.query(`
            ALTER TABLE "sub_task" DROP CONSTRAINT "FK_7240395fed5f911fefd409d1220"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_23b9db2106e4f409452018f7a76"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_02845dd9703dc4d00a8a8834fd"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_2b599525bb0ac2657f71ace439"
        `);
    await queryRunner.query(`
            DROP TABLE "contact_peers"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_756526b664de47144ce637e63f"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_6f04b3461e2669379ff6c977ed"
        `);
    await queryRunner.query(`
            DROP TABLE "assignee"
        `);
    await queryRunner.query(`
            DROP TABLE "reply"
        `);
    await queryRunner.query(`
            DROP TABLE "reply_like"
        `);
    await queryRunner.query(`
            DROP TABLE "like"
        `);
    await queryRunner.query(`
            DROP TABLE "discussion"
        `);
    await queryRunner.query(`
            DROP TABLE "sprint"
        `);
    await queryRunner.query(`
            DROP TABLE "sprint_backlog_item"
        `);
    await queryRunner.query(`
            DROP TABLE "collaborator"
        `);
    await queryRunner.query(`
            DROP TABLE "product"
        `);
    await queryRunner.query(`
            DROP TABLE "issue_comment"
        `);
    await queryRunner.query(`
            DROP TABLE "epic"
        `);
    await queryRunner.query(`
            DROP TABLE "contacts"
        `);
    await queryRunner.query(`
            DROP TABLE "messages"
        `);
    await queryRunner.query(`
            DROP TABLE "meeting_attendees"
        `);
    await queryRunner.query(`
            DROP TABLE "meetings"
        `);
    await queryRunner.query(`
            DROP TABLE "backlog_item"
        `);
    await queryRunner.query(`
            DROP TABLE "issue"
        `);
    await queryRunner.query(`
            DROP TABLE "sub_task"
        `);
    await queryRunner.query(`
            DROP TABLE "credentials"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
