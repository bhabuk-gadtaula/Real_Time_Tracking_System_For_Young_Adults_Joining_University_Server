import { MigrationInterface, QueryRunner } from "typeorm";

export class LocationSchemaUpdate1714550944052 implements MigrationInterface {
    name = 'LocationSchemaUpdate1714550944052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_project_module_enum" AS ENUM('user', 'auth', 'location', 'otp', 'class', 'user_class_time')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "is_active" boolean NOT NULL DEFAULT true, "project_module" "public"."notification_project_module_enum" NOT NULL, "note" character varying(200) NOT NULL, "assigner" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "user_parent_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "user_parent_id"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_project_module_enum"`);
    }

}
