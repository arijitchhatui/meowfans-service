import { MigrationInterface, QueryRunner } from "typeorm";

export class Rdb_1756535647834 implements MigrationInterface {
    name = 'Rdb_1756535647834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "ip" character varying NOT NULL, "user_agent" character varying NOT NULL, "session_user" uuid, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_5ad08604a291d62d985fcd569ad" FOREIGN KEY ("session_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_5ad08604a291d62d985fcd569ad"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
    }

}
