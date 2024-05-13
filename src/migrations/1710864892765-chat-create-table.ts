import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatCreateTable1710864892765 implements MigrationInterface {
  name = 'ChatCreateTable1710864892765';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "chat" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "is_active" boolean NOT NULL DEFAULT true, "message" character varying NOT NULL, "sender" character varying(100) NOT NULL, "receiver" character varying(100) NOT NULL, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "chat"');
  }
}
