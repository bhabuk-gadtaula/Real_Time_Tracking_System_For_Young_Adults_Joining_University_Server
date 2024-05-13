import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationUpdateProjectModule1714573521049 implements MigrationInterface {
    name = 'NotificationUpdateProjectModule1714573521049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."locations_project_module_enum" RENAME TO "locations_project_module_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."locations_project_module_enum" AS ENUM('user', 'auth', 'location', 'otp', 'class', 'user_class_time', 'notification')`);
        await queryRunner.query(`ALTER TABLE "locations" ALTER COLUMN "project_module" TYPE "public"."locations_project_module_enum" USING "project_module"::"text"::"public"."locations_project_module_enum"`);
        await queryRunner.query(`DROP TYPE "public"."locations_project_module_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_project_module_enum" RENAME TO "notification_project_module_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_project_module_enum" AS ENUM('user', 'auth', 'location', 'otp', 'class', 'user_class_time', 'notification')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "project_module" TYPE "public"."notification_project_module_enum" USING "project_module"::"text"::"public"."notification_project_module_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_project_module_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_project_module_enum_old" AS ENUM('user', 'auth', 'location', 'otp', 'class', 'user_class_time')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "project_module" TYPE "public"."notification_project_module_enum_old" USING "project_module"::"text"::"public"."notification_project_module_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_project_module_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_project_module_enum_old" RENAME TO "notification_project_module_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."locations_project_module_enum_old" AS ENUM('user', 'auth', 'location', 'otp', 'class', 'user_class_time')`);
        await queryRunner.query(`ALTER TABLE "locations" ALTER COLUMN "project_module" TYPE "public"."locations_project_module_enum_old" USING "project_module"::"text"::"public"."locations_project_module_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."locations_project_module_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."locations_project_module_enum_old" RENAME TO "locations_project_module_enum"`);
    }

}
