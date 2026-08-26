import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "gallery_categories" ADD COLUMN IF NOT EXISTS "_order" varchar;
    ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "_order" varchar;
    ALTER TABLE "faq_categories" ADD COLUMN IF NOT EXISTS "_order" varchar;

    CREATE INDEX IF NOT EXISTS "gallery_categories__order_idx"
      ON "gallery_categories" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "reviews__order_idx"
      ON "reviews" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "faq_categories__order_idx"
      ON "faq_categories" USING btree ("_order");

    WITH ranked AS (
      SELECT
        "id",
        row_number() OVER (ORDER BY "sort_order" ASC NULLS LAST, "id" ASC) AS position
      FROM "gallery_categories"
      WHERE "_order" IS NULL
    )
    UPDATE "gallery_categories" AS target
    SET "_order" = 'a0' || lpad(ranked.position::text, 12, '0') || '1'
    FROM ranked
    WHERE target."id" = ranked."id";

    WITH ranked AS (
      SELECT
        "id",
        row_number() OVER (ORDER BY "sort_order" ASC NULLS LAST, "id" ASC) AS position
      FROM "reviews"
      WHERE "_order" IS NULL
    )
    UPDATE "reviews" AS target
    SET "_order" = 'a0' || lpad(ranked.position::text, 12, '0') || '1'
    FROM ranked
    WHERE target."id" = ranked."id";

    WITH ranked AS (
      SELECT
        "id",
        row_number() OVER (ORDER BY "sort_order" ASC NULLS LAST, "id" ASC) AS position
      FROM "faq_categories"
      WHERE "_order" IS NULL
    )
    UPDATE "faq_categories" AS target
    SET "_order" = 'a0' || lpad(ranked.position::text, 12, '0') || '1'
    FROM ranked
    WHERE target."id" = ranked."id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "gallery_categories__order_idx";
    DROP INDEX IF EXISTS "reviews__order_idx";
    DROP INDEX IF EXISTS "faq_categories__order_idx";

    ALTER TABLE "gallery_categories" DROP COLUMN IF EXISTS "_order";
    ALTER TABLE "reviews" DROP COLUMN IF EXISTS "_order";
    ALTER TABLE "faq_categories" DROP COLUMN IF EXISTS "_order";
  `)
}
