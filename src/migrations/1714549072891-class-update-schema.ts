import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sh1714549072891 implements MigrationInterface {
  name = 'Sh1714549072891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "class" ADD "user_parent_id" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "class" DROP CONSTRAINT "UQ_574dd394846fb85d495d0f77dfd"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "class" ADD CONSTRAINT "UQ_574dd394846fb85d495d0f77dfd" UNIQUE ("name")`);
    await queryRunner.query(`ALTER TABLE "class" DROP COLUMN "user_parent_id"`);
  }
}
