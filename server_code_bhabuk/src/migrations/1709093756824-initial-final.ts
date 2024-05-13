import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialFinal1709093756824 implements MigrationInterface {
    name = 'InitialFinal1709093756824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "is_active" boolean NOT NULL DEFAULT true, "first_name" character varying(100) NOT NULL, "middle_name" character varying(100), "last_name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(20), "password" character varying(120) NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "role" character varying NOT NULL, "ancestor_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_class_mapping" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "is_active" boolean NOT NULL DEFAULT true, "user_id" integer NOT NULL, "class_id" integer NOT NULL, "class_trigger_id" integer NOT NULL, CONSTRAINT "PK_cb7a5fcaabc6ecd507abe3bb503" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "class_trigger_time_mapping" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "is_active" boolean NOT NULL DEFAULT true, "class_id" integer NOT NULL, "class_trigger_date_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_de300c748d35621672e5b274c05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otps_scope_enum" AS ENUM('FORGOT-PASSWORD')`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "is_active" boolean NOT NULL DEFAULT true, "otp" character varying(6) NOT NULL, "user_id" integer NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "scope" "public"."otps_scope_enum" NOT NULL, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "class" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_574dd394846fb85d495d0f77dfd" UNIQUE ("name"), CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."locations_project_module_enum" AS ENUM('user', 'auth', 'location', 'otp', 'class', 'user_class_time')`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "is_active" boolean NOT NULL DEFAULT true, "source_long" numeric(9,6) NOT NULL, "source_lat" numeric(9,6) NOT NULL, "dest_long" numeric(9,6), "dest_lat" numeric(9,6), "reference_id" integer NOT NULL, "project_module" "public"."locations_project_module_enum" NOT NULL, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TYPE "public"."locations_project_module_enum"`);
        await queryRunner.query(`DROP TABLE "class"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TYPE "public"."otps_scope_enum"`);
        await queryRunner.query(`DROP TABLE "class_trigger_time_mapping"`);
        await queryRunner.query(`DROP TABLE "user_class_mapping"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
