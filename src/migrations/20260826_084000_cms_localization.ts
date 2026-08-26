import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

import * as baseline from './support/baseline'
import * as localization from './support/localization'

async function removeEmptyPartialLocalizationSchema({ db }: MigrateUpArgs): Promise<void> {
  const schemaState = await db.execute(sql`
    SELECT
      to_regtype('public._locales') IS NOT NULL AS "hasLocaleEnum",
      to_regclass('public.footer_locales') IS NOT NULL AS "hasFooterLocales"
  `)
  const state = schemaState.rows[0] as
    | { hasFooterLocales?: boolean; hasLocaleEnum?: boolean }
    | undefined

  if (!state?.hasLocaleEnum) return

  // A complete localization schema without a migration record may already contain
  // edited translations. Never try to repair that state automatically.
  if (state.hasFooterLocales) {
    throw new Error(
      'A localization schema already exists but the migration is not recorded. Refusing automatic cleanup to protect localized content.',
    )
  }

  // Payload dev schema push can stop halfway through a large localization change.
  // Only remove known generated tables, and only when every one of them is empty.
  await db.execute(sql`
    DO $payload_partial_localization$
    DECLARE
      locale_table_name text;
      locale_table_has_rows boolean;
    BEGIN
      FOREACH locale_table_name IN ARRAY ARRAY[
        'pages_blocks_hero_slider_slides_locales',
        'pages_blocks_hero_slider_locales',
        'pages_blocks_hero_sub_locales',
        'pages_blocks_story_highlights_paragraphs_locales',
        'pages_blocks_story_highlights_highlights_locales',
        'pages_blocks_story_highlights_locales',
        'pages_blocks_spaces_showcase_spaces_features_locales',
        'pages_blocks_spaces_showcase_spaces_locales',
        'pages_blocks_spaces_showcase_locales',
        'pages_blocks_welcome_package_delicacies_locales',
        'pages_blocks_welcome_package_locales',
        'pages_blocks_distances_items_locales',
        'pages_blocks_distances_locales',
        'pages_blocks_booking_band_guarantees_locales',
        'pages_blocks_booking_band_locales',
        'pages_blocks_perspective_paragraphs_locales',
        'pages_blocks_perspective_stats_locales',
        'pages_blocks_perspective_locales',
        'pages_blocks_places_items_locales',
        'pages_blocks_places_locales',
        'pages_blocks_regional_drives_text_locales',
        'pages_blocks_gallery_strip_images_locales',
        'pages_blocks_gallery_strip_locales',
        'pages_blocks_reviews_locales',
        'pages_blocks_faq_short_locales',
        'pages_blocks_faq_section_quick_facts_locales',
        'pages_blocks_faq_section_locales',
        'pages_blocks_contact_section_locales',
        'pages_blocks_booking_section_steps_locales',
        'pages_blocks_booking_section_privileges_locales',
        'pages_blocks_booking_section_locales',
        'pages_locales',
        'discover_posts_locales',
        'discover_categories_locales',
        'drives_distances_locales',
        'media_locales',
        'gallery_images_locales',
        'gallery_categories_locales',
        'faq_items_locales',
        'faq_categories_locales',
        'header_nav_items_locales',
        'header_locales',
        'footer_nav_links_locales',
        'footer_social_links_locales',
        'footer_legal_links_locales',
        'footer_locales'
      ]
      LOOP
        IF to_regclass(format('public.%I', locale_table_name)) IS NOT NULL THEN
          EXECUTE format(
            'SELECT EXISTS (SELECT 1 FROM public.%I LIMIT 1)',
            locale_table_name
          ) INTO locale_table_has_rows;

          IF locale_table_has_rows THEN
            RAISE EXCEPTION
              'Partial localization table % contains data; refusing automatic cleanup.',
              locale_table_name;
          END IF;
        END IF;
      END LOOP;
    END
    $payload_partial_localization$;

    DROP TABLE IF EXISTS "pages_blocks_hero_slider_slides_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_hero_slider_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_hero_sub_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_story_highlights_paragraphs_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_story_highlights_highlights_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_story_highlights_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_spaces_showcase_spaces_features_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_spaces_showcase_spaces_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_spaces_showcase_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_welcome_package_delicacies_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_welcome_package_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_distances_items_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_distances_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_booking_band_guarantees_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_booking_band_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_perspective_paragraphs_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_perspective_stats_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_perspective_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_places_items_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_places_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_regional_drives_text_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery_strip_images_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery_strip_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_reviews_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_faq_short_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_faq_section_quick_facts_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_faq_section_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_contact_section_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_booking_section_steps_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_booking_section_privileges_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_booking_section_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_locales" CASCADE;
    DROP TABLE IF EXISTS "discover_posts_locales" CASCADE;
    DROP TABLE IF EXISTS "discover_categories_locales" CASCADE;
    DROP TABLE IF EXISTS "drives_distances_locales" CASCADE;
    DROP TABLE IF EXISTS "media_locales" CASCADE;
    DROP TABLE IF EXISTS "gallery_images_locales" CASCADE;
    DROP TABLE IF EXISTS "gallery_categories_locales" CASCADE;
    DROP TABLE IF EXISTS "faq_items_locales" CASCADE;
    DROP TABLE IF EXISTS "faq_categories_locales" CASCADE;
    DROP TABLE IF EXISTS "header_nav_items_locales" CASCADE;
    DROP TABLE IF EXISTS "header_locales" CASCADE;
    DROP TABLE IF EXISTS "footer_nav_links_locales" CASCADE;
    DROP TABLE IF EXISTS "footer_social_links_locales" CASCADE;
    DROP TABLE IF EXISTS "footer_legal_links_locales" CASCADE;
    DROP TABLE IF EXISTS "footer_locales" CASCADE;
    DROP TYPE IF EXISTS "public"."_locales";
  `)
}

export async function up(args: MigrateUpArgs): Promise<void> {
  const existingSchema = await args.db.execute(
    sql`SELECT to_regclass('public.pages') IS NOT NULL AS "exists"`,
  )
  const hasExistingSchema = Boolean(
    (existingSchema.rows[0] as { exists?: boolean } | undefined)?.exists,
  )

  // Existing deployments already have the pre-localization schema because Payload
  // previously used development schema push. New databases need that baseline first.
  if (!hasExistingSchema) {
    await baseline.up(args)
  }

  await removeEmptyPartialLocalizationSchema(args)
  await localization.up(args)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error(
    'Automatic rollback is disabled because it would discard localized CMS content. Restore a database backup instead.',
  )
}
