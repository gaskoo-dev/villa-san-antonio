import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "gallery_images" ADD COLUMN IF NOT EXISTS "_order" varchar;
    ALTER TABLE "faq_items" ADD COLUMN IF NOT EXISTS "_order" varchar;

    CREATE INDEX IF NOT EXISTS "gallery_images__order_idx"
      ON "gallery_images" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "faq_items__order_idx"
      ON "faq_items" USING btree ("_order");

    WITH ranked AS (
      SELECT
        "id",
        row_number() OVER (ORDER BY "sort_order" ASC NULLS LAST, "id" ASC) AS position
      FROM "gallery_images"
      WHERE "_order" IS NULL
    )
    UPDATE "gallery_images" AS target
    SET "_order" = 'a0' || lpad(ranked.position::text, 12, '0') || '1'
    FROM ranked
    WHERE target."id" = ranked."id";

    WITH ranked AS (
      SELECT
        "id",
        row_number() OVER (ORDER BY "sort_order" ASC NULLS LAST, "id" ASC) AS position
      FROM "faq_items"
      WHERE "_order" IS NULL
    )
    UPDATE "faq_items" AS target
    SET "_order" = 'a0' || lpad(ranked.position::text, 12, '0') || '1'
    FROM ranked
    WHERE target."id" = ranked."id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "gallery_images__order_idx";
    DROP INDEX IF EXISTS "faq_items__order_idx";

    ALTER TABLE "gallery_images" DROP COLUMN IF EXISTS "_order";
    ALTER TABLE "faq_items" DROP COLUMN IF EXISTS "_order";
  `)
}
