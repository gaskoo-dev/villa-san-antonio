import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'de', 'hr');
  CREATE TABLE "pages_blocks_hero_slider_slides_locales" (
  	"kicker" varchar,
  	"title" varchar NOT NULL,
  	"accent" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_slider_locales" (
  	"primary_cta_label" varchar DEFAULT 'Check availability',
  	"secondary_cta_label" varchar DEFAULT 'Explore the villa',
  	"coords_text" varchar DEFAULT '43.647° N, 16.055° E · PODINE',
  	"scroll_label" varchar DEFAULT 'Scroll to explore',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_sub_locales" (
  	"title" varchar NOT NULL,
  	"accent" varchar,
  	"lead" varchar,
  	"breadcrumb_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_story_highlights_paragraphs_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_story_highlights_highlights_locales" (
  	"label" varchar NOT NULL,
  	"detail" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_story_highlights_locales" (
  	"kicker" varchar DEFAULT 'The villa',
  	"title" varchar DEFAULT 'One house,' NOT NULL,
  	"accent" varchar DEFAULT 'held for you.',
  	"badge" varchar DEFAULT 'Podine, Šibenik · 20 min to the sea',
  	"map_address" varchar DEFAULT 'Podine 14, Šibenik',
  	"lead" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_spaces_showcase_spaces_features_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_spaces_showcase_spaces_locales" (
  	"name" varchar NOT NULL,
  	"category" varchar DEFAULT 'interior',
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_spaces_showcase_locales" (
  	"kicker" varchar DEFAULT 'Inside spaces',
  	"title" varchar DEFAULT 'Light rooms,' NOT NULL,
  	"accent" varchar DEFAULT 'nothing missing.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_welcome_package_delicacies_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_welcome_package_locales" (
  	"kicker" varchar DEFAULT 'Welcome package',
  	"headline" varchar DEFAULT 'A welcome worthy' NOT NULL,
  	"accent" varchar DEFAULT 'of the drive.',
  	"body" varchar DEFAULT 'Start your vacation with our exclusive Welcome Package, featuring homemade brandy, fine wine, prosciutto and cheese. This perfect combination of local delicacies offers an authentic experience and immediately immerses you in the pleasures of our region. Ideal for relaxation and socializing, making it the perfect start to your holiday.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_distances_items_locales" (
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_distances_locales" (
  	"kicker" varchar DEFAULT 'Distances',
  	"title" varchar DEFAULT 'Quietly placed,' NOT NULL,
  	"accent" varchar DEFAULT 'close to everything.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_booking_band_guarantees_locales" (
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_booking_band_locales" (
  	"title" varchar DEFAULT 'Hold your dates' NOT NULL,
  	"accent" varchar DEFAULT 'for this summer.',
  	"body" varchar DEFAULT 'Direct contact with the owner. Best rates guaranteed, personal check-in, and zero booking commission.',
  	"primary_cta_label" varchar DEFAULT 'Check Availability & Book',
  	"whatsapp_label" varchar DEFAULT 'WhatsApp Chat',
  	"whatsapp_number" varchar DEFAULT '+385 91 602 1899',
  	"host_name" varchar DEFAULT 'Josip & Family',
  	"host_role" varchar DEFAULT 'Estate Owners & Hosts',
  	"host_initials" varchar DEFAULT 'JP',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_perspective_paragraphs_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_perspective_stats_locales" (
  	"label" varchar NOT NULL,
  	"suffix" varchar,
  	"detail" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_perspective_locales" (
  	"kicker" varchar DEFAULT 'The perspective',
  	"title" varchar DEFAULT 'Quiet Dalmatian hills,' NOT NULL,
  	"accent" varchar DEFAULT 'twenty minutes',
  	"title_end" varchar DEFAULT 'from the sea.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_places_items_locales" (
  	"name" varchar NOT NULL,
  	"tag" varchar,
  	"time" varchar,
  	"desc" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_places_locales" (
  	"kicker" varchar DEFAULT 'Spaces & Ambience',
  	"title" varchar DEFAULT 'Every corner tailored for' NOT NULL,
  	"accent" varchar DEFAULT 'shared memories.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_regional_drives_text_locales" (
  	"kicker" varchar DEFAULT 'Regional Map & Travel Times',
  	"title" varchar DEFAULT 'Everything within effortless driving distance.' NOT NULL,
  	"text" varchar DEFAULT 'Located in Podine (Šibenik hinterland), Villa San Antonio provides complete sanctuary without isolation — scenic highways and coastal roads take you anywhere in minutes.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery_strip_images_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery_strip_locales" (
  	"kicker" varchar DEFAULT 'Gallery',
  	"title" varchar DEFAULT 'Atmosphere in',
  	"accent" varchar DEFAULT 'still frames.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_reviews_locales" (
  	"kicker" varchar DEFAULT 'Guest Impressions',
  	"title" varchar DEFAULT 'Verified words from',
  	"accent" varchar DEFAULT 'our guests.',
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_short_locales" (
  	"kicker" varchar DEFAULT 'FAQ',
  	"title" varchar DEFAULT 'Everything you need to',
  	"accent" varchar DEFAULT 'know before.',
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_section_quick_facts_locales" (
  	"title" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_section_locales" (
  	"left_kicker" varchar DEFAULT 'At a glance',
  	"left_title" varchar DEFAULT 'Key facts',
  	"left_accent" varchar DEFAULT 'before arrival.',
  	"left_lead" varchar DEFAULT 'Quick summary of our key house standards and amenities to help you plan your Dalmatian holiday.',
  	"right_kicker" varchar DEFAULT 'House Guide & Details',
  	"right_title" varchar DEFAULT 'Frequently asked',
  	"right_accent" varchar DEFAULT 'questions.',
  	"right_lead" varchar DEFAULT 'Everything you need to know about staying at Villa San Antonio. Filter by category or search below.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact_section_locales" (
  	"kicker" varchar,
  	"title" varchar DEFAULT 'Get in',
  	"accent" varchar DEFAULT 'touch.',
  	"lead" varchar DEFAULT 'We answer every message personally, usually within 30 minutes.',
  	"whatsapp_number" varchar DEFAULT '+385 91 602 1899',
  	"whatsapp_label" varchar DEFAULT 'Chat on WhatsApp',
  	"location_address" varchar DEFAULT 'Podine 14, 22000 Šibenik, Dalmatia · Croatia',
  	"faq_card_title" varchar DEFAULT 'Need immediate answers?',
  	"faq_card_text" varchar DEFAULT 'Check our house guide for check-in hours, heated pool details, and pet rules.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_booking_section_steps_locales" (
  	"num" varchar DEFAULT '01',
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_booking_section_privileges_locales" (
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_booking_section_locales" (
  	"steps_title" varchar DEFAULT 'How direct reservation works',
  	"privileges_title" varchar DEFAULT 'Direct booking privileges',
  	"host_name" varchar DEFAULT 'Josip & Family',
  	"host_subtitle" varchar DEFAULT 'Estate Owners & Hosts',
  	"badge_text" varchar DEFAULT 'Fast Reply',
  	"whatsapp_label" varchar DEFAULT 'WhatsApp Chat',
  	"whatsapp_number" varchar DEFAULT '+385 91 602 1899',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "discover_posts_locales" (
  	"title" varchar NOT NULL,
  	"tag" varchar DEFAULT '18 min drive · 18 km',
  	"badge" varchar,
  	"desc" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "discover_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "drives_distances_locales" (
  	"name" varchar NOT NULL,
  	"category" varchar,
  	"distance" varchar NOT NULL,
  	"drive_time" varchar NOT NULL,
  	"desc" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "gallery_images_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "gallery_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faq_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_nav_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_locales" (
  	"cta_label" varchar DEFAULT 'Check availability',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_nav_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_locales" (
  	"editorial_subheading" varchar DEFAULT 'Villa San Antonio · Dalmatia',
  	"editorial_heading" varchar DEFAULT 'Your private sanctuary in the Dalmatian hills.',
  	"editorial_short_bio" varchar DEFAULT 'Peaceful Mediterranean seclusion with modern comforts, just minutes from the Adriatic coast.',
  	"brand_tagline" varchar DEFAULT 'Where slow mornings meet warm evenings. A private retreat for families & friends, tucked into the quiet Dalmatian hills near Šibenik.',
  	"direct_booking_title" varchar DEFAULT 'Direct Booking Perks',
  	"direct_booking_perk1" varchar DEFAULT 'Best direct rate guarantee',
  	"direct_booking_perk2" varchar DEFAULT 'Heated pool & private jacuzzi',
  	"direct_booking_perk3" varchar DEFAULT 'Fully fenced & pet-friendly garden',
  	"direct_booking_perk4" varchar DEFAULT 'Personal host support (Josip)',
  	"direct_booking_cta_label" varchar DEFAULT 'Check availability',
  	"explore_title" varchar DEFAULT 'Explore',
  	"contact_section_title" varchar DEFAULT 'Contact & Location',
  	"contact_section_address" varchar DEFAULT 'Podine 14, near Šibenik',
  	"contact_section_region" varchar DEFAULT 'Dalmatia · Croatia',
  	"copyright" varchar DEFAULT 'Villa San Antonio. All rights reserved.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  
  DROP INDEX "pages_meta_meta_image_idx";
  ALTER TABLE "pages_blocks_hero_slider_slides_locales" ADD CONSTRAINT "pages_blocks_hero_slider_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slider_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_locales" ADD CONSTRAINT "pages_blocks_hero_slider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_sub_locales" ADD CONSTRAINT "pages_blocks_hero_sub_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_sub"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_highlights_paragraphs_locales" ADD CONSTRAINT "pages_blocks_story_highlights_paragraphs_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story_highlights_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_highlights_highlights_locales" ADD CONSTRAINT "pages_blocks_story_highlights_highlights_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story_highlights_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_highlights_locales" ADD CONSTRAINT "pages_blocks_story_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces_features_locales" ADD CONSTRAINT "pages_blocks_spaces_showcase_spaces_features_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_spaces_showcase_spaces_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces_locales" ADD CONSTRAINT "pages_blocks_spaces_showcase_spaces_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_spaces_showcase_spaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spaces_showcase_locales" ADD CONSTRAINT "pages_blocks_spaces_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_spaces_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_welcome_package_delicacies_locales" ADD CONSTRAINT "pages_blocks_welcome_package_delicacies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_welcome_package_delicacies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_welcome_package_locales" ADD CONSTRAINT "pages_blocks_welcome_package_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_welcome_package"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_distances_items_locales" ADD CONSTRAINT "pages_blocks_distances_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_distances_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_distances_locales" ADD CONSTRAINT "pages_blocks_distances_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_distances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_band_guarantees_locales" ADD CONSTRAINT "pages_blocks_booking_band_guarantees_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_band_guarantees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_band_locales" ADD CONSTRAINT "pages_blocks_booking_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perspective_paragraphs_locales" ADD CONSTRAINT "pages_blocks_perspective_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perspective_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perspective_stats_locales" ADD CONSTRAINT "pages_blocks_perspective_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perspective_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perspective_locales" ADD CONSTRAINT "pages_blocks_perspective_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perspective"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_places_items_locales" ADD CONSTRAINT "pages_blocks_places_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_places_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_places_locales" ADD CONSTRAINT "pages_blocks_places_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_regional_drives_text_locales" ADD CONSTRAINT "pages_blocks_regional_drives_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_regional_drives_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_strip_images_locales" ADD CONSTRAINT "pages_blocks_gallery_strip_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery_strip_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_strip_locales" ADD CONSTRAINT "pages_blocks_gallery_strip_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews_locales" ADD CONSTRAINT "pages_blocks_reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_short_locales" ADD CONSTRAINT "pages_blocks_faq_short_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_short"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section_quick_facts_locales" ADD CONSTRAINT "pages_blocks_faq_section_quick_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section_quick_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section_locales" ADD CONSTRAINT "pages_blocks_faq_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section_locales" ADD CONSTRAINT "pages_blocks_contact_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_section_steps_locales" ADD CONSTRAINT "pages_blocks_booking_section_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_section_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_section_privileges_locales" ADD CONSTRAINT "pages_blocks_booking_section_privileges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_section_privileges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_section_locales" ADD CONSTRAINT "pages_blocks_booking_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discover_posts_locales" ADD CONSTRAINT "discover_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."discover_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discover_categories_locales" ADD CONSTRAINT "discover_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."discover_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drives_distances_locales" ADD CONSTRAINT "drives_distances_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drives_distances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_images_locales" ADD CONSTRAINT "gallery_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_categories_locales" ADD CONSTRAINT "gallery_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_items_locales" ADD CONSTRAINT "faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_categories_locales" ADD CONSTRAINT "faq_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_locales" ADD CONSTRAINT "header_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_links_locales" ADD CONSTRAINT "footer_nav_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links_locales" ADD CONSTRAINT "footer_social_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links_locales" ADD CONSTRAINT "footer_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_blocks_hero_slider_slides_locales_locale_parent_id_uni" ON "pages_blocks_hero_slider_slides_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_slider_locales_locale_parent_id_unique" ON "pages_blocks_hero_slider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_sub_locales_locale_parent_id_unique" ON "pages_blocks_hero_sub_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_story_highlights_paragraphs_locales_locale_pare" ON "pages_blocks_story_highlights_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_story_highlights_highlights_locales_locale_pare" ON "pages_blocks_story_highlights_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_story_highlights_locales_locale_parent_id_uniqu" ON "pages_blocks_story_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_spaces_showcase_spaces_features_locales_locale_" ON "pages_blocks_spaces_showcase_spaces_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_spaces_showcase_spaces_locales_locale_parent_id" ON "pages_blocks_spaces_showcase_spaces_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_spaces_showcase_locales_locale_parent_id_unique" ON "pages_blocks_spaces_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_welcome_package_delicacies_locales_locale_paren" ON "pages_blocks_welcome_package_delicacies_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_welcome_package_locales_locale_parent_id_unique" ON "pages_blocks_welcome_package_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_distances_items_locales_locale_parent_id_unique" ON "pages_blocks_distances_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_distances_locales_locale_parent_id_unique" ON "pages_blocks_distances_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_booking_band_guarantees_locales_locale_parent_i" ON "pages_blocks_booking_band_guarantees_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_booking_band_locales_locale_parent_id_unique" ON "pages_blocks_booking_band_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_perspective_paragraphs_locales_locale_parent_id" ON "pages_blocks_perspective_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_perspective_stats_locales_locale_parent_id_uniq" ON "pages_blocks_perspective_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_perspective_locales_locale_parent_id_unique" ON "pages_blocks_perspective_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_places_items_locales_locale_parent_id_unique" ON "pages_blocks_places_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_places_locales_locale_parent_id_unique" ON "pages_blocks_places_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_regional_drives_text_locales_locale_parent_id_u" ON "pages_blocks_regional_drives_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_gallery_strip_images_locales_locale_parent_id_u" ON "pages_blocks_gallery_strip_images_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_gallery_strip_locales_locale_parent_id_unique" ON "pages_blocks_gallery_strip_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_reviews_locales_locale_parent_id_unique" ON "pages_blocks_reviews_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_short_locales_locale_parent_id_unique" ON "pages_blocks_faq_short_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_section_quick_facts_locales_locale_parent_i" ON "pages_blocks_faq_section_quick_facts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_section_locales_locale_parent_id_unique" ON "pages_blocks_faq_section_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_contact_section_locales_locale_parent_id_unique" ON "pages_blocks_contact_section_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_booking_section_steps_locales_locale_parent_id_" ON "pages_blocks_booking_section_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_booking_section_privileges_locales_locale_paren" ON "pages_blocks_booking_section_privileges_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_booking_section_locales_locale_parent_id_unique" ON "pages_blocks_booking_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "discover_posts_locales_locale_parent_id_unique" ON "discover_posts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "discover_categories_locales_locale_parent_id_unique" ON "discover_categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "drives_distances_locales_locale_parent_id_unique" ON "drives_distances_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "gallery_images_locales_locale_parent_id_unique" ON "gallery_images_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "gallery_categories_locales_locale_parent_id_unique" ON "gallery_categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "faq_items_locales_locale_parent_id_unique" ON "faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "faq_categories_locales_locale_parent_id_unique" ON "faq_categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_locales_locale_parent_id_unique" ON "header_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_nav_links_locales_locale_parent_id_unique" ON "footer_nav_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_social_links_locales_locale_parent_id_unique" ON "footer_social_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_legal_links_locales_locale_parent_id_unique" ON "footer_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  -- Preserve existing CMS content as the English locale before removing legacy columns.
  INSERT INTO "pages_blocks_hero_slider_slides_locales" ("kicker", "title", "accent", "subtext", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", "subtext", 'en'::"_locales", "id" FROM "pages_blocks_hero_slider_slides"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_hero_slider_locales" ("primary_cta_label", "secondary_cta_label", "coords_text", "scroll_label", "_locale", "_parent_id")
  SELECT "primary_cta_label", "secondary_cta_label", "coords_text", "scroll_label", 'en'::"_locales", "id" FROM "pages_blocks_hero_slider"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_hero_sub_locales" ("title", "accent", "lead", "breadcrumb_label", "_locale", "_parent_id")
  SELECT "title", "accent", "lead", "breadcrumb_label", 'en'::"_locales", "id" FROM "pages_blocks_hero_sub"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_story_highlights_paragraphs_locales" ("text", "_locale", "_parent_id")
  SELECT "text", 'en'::"_locales", "id" FROM "pages_blocks_story_highlights_paragraphs"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_story_highlights_highlights_locales" ("label", "detail", "_locale", "_parent_id")
  SELECT "label", "detail", 'en'::"_locales", "id" FROM "pages_blocks_story_highlights_highlights"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_story_highlights_locales" ("kicker", "title", "accent", "badge", "map_address", "lead", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", "badge", "map_address", "lead", 'en'::"_locales", "id" FROM "pages_blocks_story_highlights"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_spaces_showcase_spaces_features_locales" ("label", "_locale", "_parent_id")
  SELECT "label", 'en'::"_locales", "id" FROM "pages_blocks_spaces_showcase_spaces_features"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_spaces_showcase_spaces_locales" ("name", "category", "subtitle", "_locale", "_parent_id")
  SELECT "name", "category", "subtitle", 'en'::"_locales", "id" FROM "pages_blocks_spaces_showcase_spaces"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_spaces_showcase_locales" ("kicker", "title", "accent", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", 'en'::"_locales", "id" FROM "pages_blocks_spaces_showcase"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_welcome_package_delicacies_locales" ("label", "_locale", "_parent_id")
  SELECT "label", 'en'::"_locales", "id" FROM "pages_blocks_welcome_package_delicacies"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_welcome_package_locales" ("kicker", "headline", "accent", "body", "_locale", "_parent_id")
  SELECT "kicker", "headline", "accent", "body", 'en'::"_locales", "id" FROM "pages_blocks_welcome_package"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_distances_items_locales" ("value", "label", "_locale", "_parent_id")
  SELECT "value", "label", 'en'::"_locales", "id" FROM "pages_blocks_distances_items"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_distances_locales" ("kicker", "title", "accent", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", 'en'::"_locales", "id" FROM "pages_blocks_distances"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_booking_band_guarantees_locales" ("title", "desc", "_locale", "_parent_id")
  SELECT "title", "desc", 'en'::"_locales", "id" FROM "pages_blocks_booking_band_guarantees"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_booking_band_locales" ("title", "accent", "body", "primary_cta_label", "whatsapp_label", "whatsapp_number", "host_name", "host_role", "host_initials", "_locale", "_parent_id")
  SELECT "title", "accent", "body", "primary_cta_label", "whatsapp_label", "whatsapp_number", "host_name", "host_role", "host_initials", 'en'::"_locales", "id" FROM "pages_blocks_booking_band"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_perspective_paragraphs_locales" ("text", "_locale", "_parent_id")
  SELECT "text", 'en'::"_locales", "id" FROM "pages_blocks_perspective_paragraphs"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_perspective_stats_locales" ("label", "suffix", "detail", "_locale", "_parent_id")
  SELECT "label", "suffix", "detail", 'en'::"_locales", "id" FROM "pages_blocks_perspective_stats"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_perspective_locales" ("kicker", "title", "accent", "title_end", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", "title_end", 'en'::"_locales", "id" FROM "pages_blocks_perspective"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_places_items_locales" ("name", "tag", "time", "desc", "_locale", "_parent_id")
  SELECT "name", "tag", "time", "desc", 'en'::"_locales", "id" FROM "pages_blocks_places_items"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_places_locales" ("kicker", "title", "accent", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", 'en'::"_locales", "id" FROM "pages_blocks_places"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_regional_drives_text_locales" ("kicker", "title", "text", "_locale", "_parent_id")
  SELECT "kicker", "title", "text", 'en'::"_locales", "id" FROM "pages_blocks_regional_drives_text"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_gallery_strip_images_locales" ("alt", "_locale", "_parent_id")
  SELECT "alt", 'en'::"_locales", "id" FROM "pages_blocks_gallery_strip_images"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_gallery_strip_locales" ("kicker", "title", "accent", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", 'en'::"_locales", "id" FROM "pages_blocks_gallery_strip"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_reviews_locales" ("kicker", "title", "accent", "intro", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", "intro", 'en'::"_locales", "id" FROM "pages_blocks_reviews"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_faq_short_locales" ("kicker", "title", "accent", "subtext", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", "subtext", 'en'::"_locales", "id" FROM "pages_blocks_faq_short"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_faq_section_quick_facts_locales" ("title", "value", "subtitle", "_locale", "_parent_id")
  SELECT "title", "value", "subtitle", 'en'::"_locales", "id" FROM "pages_blocks_faq_section_quick_facts"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_faq_section_locales" ("left_kicker", "left_title", "left_accent", "left_lead", "right_kicker", "right_title", "right_accent", "right_lead", "_locale", "_parent_id")
  SELECT "left_kicker", "left_title", "left_accent", "left_lead", "right_kicker", "right_title", "right_accent", "right_lead", 'en'::"_locales", "id" FROM "pages_blocks_faq_section"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_contact_section_locales" ("kicker", "title", "accent", "lead", "whatsapp_number", "whatsapp_label", "location_address", "faq_card_title", "faq_card_text", "_locale", "_parent_id")
  SELECT "kicker", "title", "accent", "lead", "whatsapp_number", "whatsapp_label", "location_address", "faq_card_title", "faq_card_text", 'en'::"_locales", "id" FROM "pages_blocks_contact_section"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_booking_section_steps_locales" ("num", "title", "desc", "_locale", "_parent_id")
  SELECT "num", "title", "desc", 'en'::"_locales", "id" FROM "pages_blocks_booking_section_steps"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_booking_section_privileges_locales" ("title", "desc", "_locale", "_parent_id")
  SELECT "title", "desc", 'en'::"_locales", "id" FROM "pages_blocks_booking_section_privileges"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_blocks_booking_section_locales" ("steps_title", "privileges_title", "host_name", "host_subtitle", "badge_text", "whatsapp_label", "whatsapp_number", "_locale", "_parent_id")
  SELECT "steps_title", "privileges_title", "host_name", "host_subtitle", "badge_text", "whatsapp_label", "whatsapp_number", 'en'::"_locales", "id" FROM "pages_blocks_booking_section"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "pages_locales" ("title", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id")
  SELECT "title", "meta_title", "meta_description", "meta_image_id", 'en'::"_locales", "id" FROM "pages"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "discover_posts_locales" ("title", "tag", "badge", "desc", "_locale", "_parent_id")
  SELECT "title", "tag", "badge", "desc", 'en'::"_locales", "id" FROM "discover_posts"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "discover_categories_locales" ("name", "_locale", "_parent_id")
  SELECT "name", 'en'::"_locales", "id" FROM "discover_categories"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "drives_distances_locales" ("name", "category", "distance", "drive_time", "desc", "_locale", "_parent_id")
  SELECT "name", "category", "distance", "drive_time", "desc", 'en'::"_locales", "id" FROM "drives_distances"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
  SELECT "alt", 'en'::"_locales", "id" FROM "media"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "gallery_images_locales" ("alt", "_locale", "_parent_id")
  SELECT "alt", 'en'::"_locales", "id" FROM "gallery_images"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "gallery_categories_locales" ("name", "_locale", "_parent_id")
  SELECT "name", 'en'::"_locales", "id" FROM "gallery_categories"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "faq_items_locales" ("question", "answer", "_locale", "_parent_id")
  SELECT "question", "answer", 'en'::"_locales", "id" FROM "faq_items"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "faq_categories_locales" ("name", "_locale", "_parent_id")
  SELECT "name", 'en'::"_locales", "id" FROM "faq_categories"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "header_nav_items_locales" ("label", "_locale", "_parent_id")
  SELECT "label", 'en'::"_locales", "id" FROM "header_nav_items"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "header_locales" ("cta_label", "_locale", "_parent_id")
  SELECT "cta_label", 'en'::"_locales", "id" FROM "header"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "footer_nav_links_locales" ("label", "_locale", "_parent_id")
  SELECT "label", 'en'::"_locales", "id" FROM "footer_nav_links"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "footer_social_links_locales" ("label", "_locale", "_parent_id")
  SELECT "label", 'en'::"_locales", "id" FROM "footer_social_links"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "footer_legal_links_locales" ("label", "_locale", "_parent_id")
  SELECT "label", 'en'::"_locales", "id" FROM "footer_legal_links"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  INSERT INTO "footer_locales" ("editorial_subheading", "editorial_heading", "editorial_short_bio", "brand_tagline", "direct_booking_title", "direct_booking_perk1", "direct_booking_perk2", "direct_booking_perk3", "direct_booking_perk4", "direct_booking_cta_label", "explore_title", "contact_section_title", "contact_section_address", "contact_section_region", "copyright", "_locale", "_parent_id")
  SELECT "editorial_subheading", "editorial_heading", "editorial_short_bio", "brand_tagline", "direct_booking_title", "direct_booking_perk1", "direct_booking_perk2", "direct_booking_perk3", "direct_booking_perk4", "direct_booking_cta_label", "explore_title", "contact_section_title", "contact_section_address", "contact_section_region", "copyright", 'en'::"_locales", "id" FROM "footer"
  ON CONFLICT ("_locale", "_parent_id") DO NOTHING;

  ALTER TABLE "pages_blocks_hero_slider_slides" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_hero_slider_slides" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_hero_slider_slides" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_hero_slider_slides" DROP COLUMN "subtext";
  ALTER TABLE "pages_blocks_hero_slider" DROP COLUMN "primary_cta_label";
  ALTER TABLE "pages_blocks_hero_slider" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "pages_blocks_hero_slider" DROP COLUMN "coords_text";
  ALTER TABLE "pages_blocks_hero_slider" DROP COLUMN "scroll_label";
  ALTER TABLE "pages_blocks_hero_sub" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_hero_sub" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_hero_sub" DROP COLUMN "lead";
  ALTER TABLE "pages_blocks_hero_sub" DROP COLUMN "breadcrumb_label";
  ALTER TABLE "pages_blocks_story_highlights_paragraphs" DROP COLUMN "text";
  ALTER TABLE "pages_blocks_story_highlights_highlights" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_story_highlights_highlights" DROP COLUMN "detail";
  ALTER TABLE "pages_blocks_story_highlights" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_story_highlights" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_story_highlights" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_story_highlights" DROP COLUMN "badge";
  ALTER TABLE "pages_blocks_story_highlights" DROP COLUMN "map_address";
  ALTER TABLE "pages_blocks_story_highlights" DROP COLUMN "lead";
  ALTER TABLE "pages_blocks_spaces_showcase_spaces_features" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_spaces_showcase_spaces" DROP COLUMN "name";
  ALTER TABLE "pages_blocks_spaces_showcase_spaces" DROP COLUMN "category";
  ALTER TABLE "pages_blocks_spaces_showcase_spaces" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_spaces_showcase" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_spaces_showcase" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_spaces_showcase" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_welcome_package_delicacies" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_welcome_package" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_welcome_package" DROP COLUMN "headline";
  ALTER TABLE "pages_blocks_welcome_package" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_welcome_package" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_distances_items" DROP COLUMN "value";
  ALTER TABLE "pages_blocks_distances_items" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_distances" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_distances" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_distances" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_booking_band_guarantees" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_booking_band_guarantees" DROP COLUMN "desc";
  ALTER TABLE "pages_blocks_booking_band" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_booking_band" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_booking_band" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_booking_band" DROP COLUMN "primary_cta_label";
  ALTER TABLE "pages_blocks_booking_band" DROP COLUMN "whatsapp_label";
  ALTER TABLE "pages_blocks_booking_band" DROP COLUMN "whatsapp_number";
  ALTER TABLE "pages_blocks_booking_band" DROP COLUMN "host_name";
  ALTER TABLE "pages_blocks_booking_band" DROP COLUMN "host_role";
  ALTER TABLE "pages_blocks_booking_band" DROP COLUMN "host_initials";
  ALTER TABLE "pages_blocks_perspective_paragraphs" DROP COLUMN "text";
  ALTER TABLE "pages_blocks_perspective_stats" DROP COLUMN "label";
  ALTER TABLE "pages_blocks_perspective_stats" DROP COLUMN "suffix";
  ALTER TABLE "pages_blocks_perspective_stats" DROP COLUMN "detail";
  ALTER TABLE "pages_blocks_perspective" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_perspective" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_perspective" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_perspective" DROP COLUMN "title_end";
  ALTER TABLE "pages_blocks_places_items" DROP COLUMN "name";
  ALTER TABLE "pages_blocks_places_items" DROP COLUMN "tag";
  ALTER TABLE "pages_blocks_places_items" DROP COLUMN "time";
  ALTER TABLE "pages_blocks_places_items" DROP COLUMN "desc";
  ALTER TABLE "pages_blocks_places" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_places" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_places" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_regional_drives_text" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_regional_drives_text" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_regional_drives_text" DROP COLUMN "text";
  ALTER TABLE "pages_blocks_gallery_strip_images" DROP COLUMN "alt";
  ALTER TABLE "pages_blocks_gallery_strip" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_gallery_strip" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_gallery_strip" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_reviews" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_reviews" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_reviews" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_reviews" DROP COLUMN "intro";
  ALTER TABLE "pages_blocks_faq_short" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_faq_short" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_faq_short" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_faq_short" DROP COLUMN "subtext";
  ALTER TABLE "pages_blocks_faq_section_quick_facts" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_faq_section_quick_facts" DROP COLUMN "value";
  ALTER TABLE "pages_blocks_faq_section_quick_facts" DROP COLUMN "subtitle";
  ALTER TABLE "pages_blocks_faq_section" DROP COLUMN "left_kicker";
  ALTER TABLE "pages_blocks_faq_section" DROP COLUMN "left_title";
  ALTER TABLE "pages_blocks_faq_section" DROP COLUMN "left_accent";
  ALTER TABLE "pages_blocks_faq_section" DROP COLUMN "left_lead";
  ALTER TABLE "pages_blocks_faq_section" DROP COLUMN "right_kicker";
  ALTER TABLE "pages_blocks_faq_section" DROP COLUMN "right_title";
  ALTER TABLE "pages_blocks_faq_section" DROP COLUMN "right_accent";
  ALTER TABLE "pages_blocks_faq_section" DROP COLUMN "right_lead";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "kicker";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "lead";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "whatsapp_number";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "whatsapp_label";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "location_address";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "faq_card_title";
  ALTER TABLE "pages_blocks_contact_section" DROP COLUMN "faq_card_text";
  ALTER TABLE "pages_blocks_booking_section_steps" DROP COLUMN "num";
  ALTER TABLE "pages_blocks_booking_section_steps" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_booking_section_steps" DROP COLUMN "desc";
  ALTER TABLE "pages_blocks_booking_section_privileges" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_booking_section_privileges" DROP COLUMN "desc";
  ALTER TABLE "pages_blocks_booking_section" DROP COLUMN "steps_title";
  ALTER TABLE "pages_blocks_booking_section" DROP COLUMN "privileges_title";
  ALTER TABLE "pages_blocks_booking_section" DROP COLUMN "host_name";
  ALTER TABLE "pages_blocks_booking_section" DROP COLUMN "host_subtitle";
  ALTER TABLE "pages_blocks_booking_section" DROP COLUMN "badge_text";
  ALTER TABLE "pages_blocks_booking_section" DROP COLUMN "whatsapp_label";
  ALTER TABLE "pages_blocks_booking_section" DROP COLUMN "whatsapp_number";
  ALTER TABLE "pages" DROP COLUMN "title";
  ALTER TABLE "pages" DROP COLUMN "meta_title";
  ALTER TABLE "pages" DROP COLUMN "meta_description";
  ALTER TABLE "pages" DROP COLUMN "meta_image_id";
  ALTER TABLE "discover_posts" DROP COLUMN "title";
  ALTER TABLE "discover_posts" DROP COLUMN "tag";
  ALTER TABLE "discover_posts" DROP COLUMN "badge";
  ALTER TABLE "discover_posts" DROP COLUMN "desc";
  ALTER TABLE "discover_categories" DROP COLUMN "name";
  ALTER TABLE "drives_distances" DROP COLUMN "name";
  ALTER TABLE "drives_distances" DROP COLUMN "category";
  ALTER TABLE "drives_distances" DROP COLUMN "distance";
  ALTER TABLE "drives_distances" DROP COLUMN "drive_time";
  ALTER TABLE "drives_distances" DROP COLUMN "desc";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "gallery_images" DROP COLUMN "alt";
  ALTER TABLE "gallery_categories" DROP COLUMN "name";
  ALTER TABLE "faq_items" DROP COLUMN "question";
  ALTER TABLE "faq_items" DROP COLUMN "answer";
  ALTER TABLE "faq_categories" DROP COLUMN "name";
  ALTER TABLE "header_nav_items" DROP COLUMN "label";
  ALTER TABLE "header" DROP COLUMN "cta_label";
  ALTER TABLE "footer_nav_links" DROP COLUMN "label";
  ALTER TABLE "footer_social_links" DROP COLUMN "label";
  ALTER TABLE "footer_legal_links" DROP COLUMN "label";
  ALTER TABLE "footer" DROP COLUMN "editorial_subheading";
  ALTER TABLE "footer" DROP COLUMN "editorial_heading";
  ALTER TABLE "footer" DROP COLUMN "editorial_short_bio";
  ALTER TABLE "footer" DROP COLUMN "brand_tagline";
  ALTER TABLE "footer" DROP COLUMN "direct_booking_title";
  ALTER TABLE "footer" DROP COLUMN "direct_booking_perk1";
  ALTER TABLE "footer" DROP COLUMN "direct_booking_perk2";
  ALTER TABLE "footer" DROP COLUMN "direct_booking_perk3";
  ALTER TABLE "footer" DROP COLUMN "direct_booking_perk4";
  ALTER TABLE "footer" DROP COLUMN "direct_booking_cta_label";
  ALTER TABLE "footer" DROP COLUMN "explore_title";
  ALTER TABLE "footer" DROP COLUMN "contact_section_title";
  ALTER TABLE "footer" DROP COLUMN "contact_section_address";
  ALTER TABLE "footer" DROP COLUMN "contact_section_region";
  ALTER TABLE "footer" DROP COLUMN "copyright";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_slider_slides_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_slider_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_sub_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_story_highlights_paragraphs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_story_highlights_highlights_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_story_highlights_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_spaces_showcase_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_welcome_package_delicacies_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_welcome_package_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_distances_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_distances_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_booking_band_guarantees_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_booking_band_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_perspective_paragraphs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_perspective_stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_perspective_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_places_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_places_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_regional_drives_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery_strip_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery_strip_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_reviews_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_short_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_section_quick_facts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_booking_section_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_booking_section_privileges_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_booking_section_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "discover_posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "discover_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "drives_distances_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_nav_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_social_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_legal_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_slider_slides_locales" CASCADE;
  DROP TABLE "pages_blocks_hero_slider_locales" CASCADE;
  DROP TABLE "pages_blocks_hero_sub_locales" CASCADE;
  DROP TABLE "pages_blocks_story_highlights_paragraphs_locales" CASCADE;
  DROP TABLE "pages_blocks_story_highlights_highlights_locales" CASCADE;
  DROP TABLE "pages_blocks_story_highlights_locales" CASCADE;
  DROP TABLE "pages_blocks_spaces_showcase_spaces_features_locales" CASCADE;
  DROP TABLE "pages_blocks_spaces_showcase_spaces_locales" CASCADE;
  DROP TABLE "pages_blocks_spaces_showcase_locales" CASCADE;
  DROP TABLE "pages_blocks_welcome_package_delicacies_locales" CASCADE;
  DROP TABLE "pages_blocks_welcome_package_locales" CASCADE;
  DROP TABLE "pages_blocks_distances_items_locales" CASCADE;
  DROP TABLE "pages_blocks_distances_locales" CASCADE;
  DROP TABLE "pages_blocks_booking_band_guarantees_locales" CASCADE;
  DROP TABLE "pages_blocks_booking_band_locales" CASCADE;
  DROP TABLE "pages_blocks_perspective_paragraphs_locales" CASCADE;
  DROP TABLE "pages_blocks_perspective_stats_locales" CASCADE;
  DROP TABLE "pages_blocks_perspective_locales" CASCADE;
  DROP TABLE "pages_blocks_places_items_locales" CASCADE;
  DROP TABLE "pages_blocks_places_locales" CASCADE;
  DROP TABLE "pages_blocks_regional_drives_text_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery_strip_images_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery_strip_locales" CASCADE;
  DROP TABLE "pages_blocks_reviews_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_short_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_section_quick_facts_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_section_locales" CASCADE;
  DROP TABLE "pages_blocks_contact_section_locales" CASCADE;
  DROP TABLE "pages_blocks_booking_section_steps_locales" CASCADE;
  DROP TABLE "pages_blocks_booking_section_privileges_locales" CASCADE;
  DROP TABLE "pages_blocks_booking_section_locales" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "discover_posts_locales" CASCADE;
  DROP TABLE "discover_categories_locales" CASCADE;
  DROP TABLE "drives_distances_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "gallery_images_locales" CASCADE;
  DROP TABLE "gallery_categories_locales" CASCADE;
  DROP TABLE "faq_items_locales" CASCADE;
  DROP TABLE "faq_categories_locales" CASCADE;
  DROP TABLE "header_nav_items_locales" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "footer_nav_links_locales" CASCADE;
  DROP TABLE "footer_social_links_locales" CASCADE;
  DROP TABLE "footer_legal_links_locales" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD COLUMN "kicker" varchar;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD COLUMN "accent" varchar;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD COLUMN "subtext" varchar;
  ALTER TABLE "pages_blocks_hero_slider" ADD COLUMN "primary_cta_label" varchar DEFAULT 'Check availability';
  ALTER TABLE "pages_blocks_hero_slider" ADD COLUMN "secondary_cta_label" varchar DEFAULT 'Explore the villa';
  ALTER TABLE "pages_blocks_hero_slider" ADD COLUMN "coords_text" varchar DEFAULT '43.647° N, 16.055° E · PODINE';
  ALTER TABLE "pages_blocks_hero_slider" ADD COLUMN "scroll_label" varchar DEFAULT 'Scroll to explore';
  ALTER TABLE "pages_blocks_hero_sub" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_hero_sub" ADD COLUMN "accent" varchar;
  ALTER TABLE "pages_blocks_hero_sub" ADD COLUMN "lead" varchar;
  ALTER TABLE "pages_blocks_hero_sub" ADD COLUMN "breadcrumb_label" varchar;
  ALTER TABLE "pages_blocks_story_highlights_paragraphs" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "pages_blocks_story_highlights_highlights" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "pages_blocks_story_highlights_highlights" ADD COLUMN "detail" varchar NOT NULL;
  ALTER TABLE "pages_blocks_story_highlights" ADD COLUMN "kicker" varchar DEFAULT 'The villa';
  ALTER TABLE "pages_blocks_story_highlights" ADD COLUMN "title" varchar DEFAULT 'One house,' NOT NULL;
  ALTER TABLE "pages_blocks_story_highlights" ADD COLUMN "accent" varchar DEFAULT 'held for you.';
  ALTER TABLE "pages_blocks_story_highlights" ADD COLUMN "badge" varchar DEFAULT 'Podine, Šibenik · 20 min to the sea';
  ALTER TABLE "pages_blocks_story_highlights" ADD COLUMN "map_address" varchar DEFAULT 'Podine 14, Šibenik';
  ALTER TABLE "pages_blocks_story_highlights" ADD COLUMN "lead" varchar NOT NULL;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces_features" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces" ADD COLUMN "category" varchar DEFAULT 'interior';
  ALTER TABLE "pages_blocks_spaces_showcase_spaces" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_spaces_showcase" ADD COLUMN "kicker" varchar DEFAULT 'Inside spaces';
  ALTER TABLE "pages_blocks_spaces_showcase" ADD COLUMN "title" varchar DEFAULT 'Light rooms,' NOT NULL;
  ALTER TABLE "pages_blocks_spaces_showcase" ADD COLUMN "accent" varchar DEFAULT 'nothing missing.';
  ALTER TABLE "pages_blocks_welcome_package_delicacies" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "pages_blocks_welcome_package" ADD COLUMN "kicker" varchar DEFAULT 'Welcome package';
  ALTER TABLE "pages_blocks_welcome_package" ADD COLUMN "headline" varchar DEFAULT 'A welcome worthy' NOT NULL;
  ALTER TABLE "pages_blocks_welcome_package" ADD COLUMN "accent" varchar DEFAULT 'of the drive.';
  ALTER TABLE "pages_blocks_welcome_package" ADD COLUMN "body" varchar DEFAULT 'Start your vacation with our exclusive Welcome Package, featuring homemade brandy, fine wine, prosciutto and cheese. This perfect combination of local delicacies offers an authentic experience and immediately immerses you in the pleasures of our region. Ideal for relaxation and socializing, making it the perfect start to your holiday.' NOT NULL;
  ALTER TABLE "pages_blocks_distances_items" ADD COLUMN "value" varchar NOT NULL;
  ALTER TABLE "pages_blocks_distances_items" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "pages_blocks_distances" ADD COLUMN "kicker" varchar DEFAULT 'Distances';
  ALTER TABLE "pages_blocks_distances" ADD COLUMN "title" varchar DEFAULT 'Quietly placed,' NOT NULL;
  ALTER TABLE "pages_blocks_distances" ADD COLUMN "accent" varchar DEFAULT 'close to everything.';
  ALTER TABLE "pages_blocks_booking_band_guarantees" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_booking_band_guarantees" ADD COLUMN "desc" varchar NOT NULL;
  ALTER TABLE "pages_blocks_booking_band" ADD COLUMN "title" varchar DEFAULT 'Hold your dates' NOT NULL;
  ALTER TABLE "pages_blocks_booking_band" ADD COLUMN "accent" varchar DEFAULT 'for this summer.';
  ALTER TABLE "pages_blocks_booking_band" ADD COLUMN "body" varchar DEFAULT 'Direct contact with the owner. Best rates guaranteed, personal check-in, and zero booking commission.';
  ALTER TABLE "pages_blocks_booking_band" ADD COLUMN "primary_cta_label" varchar DEFAULT 'Check Availability & Book';
  ALTER TABLE "pages_blocks_booking_band" ADD COLUMN "whatsapp_label" varchar DEFAULT 'WhatsApp Chat';
  ALTER TABLE "pages_blocks_booking_band" ADD COLUMN "whatsapp_number" varchar DEFAULT '+385 91 602 1899';
  ALTER TABLE "pages_blocks_booking_band" ADD COLUMN "host_name" varchar DEFAULT 'Josip & Family';
  ALTER TABLE "pages_blocks_booking_band" ADD COLUMN "host_role" varchar DEFAULT 'Estate Owners & Hosts';
  ALTER TABLE "pages_blocks_booking_band" ADD COLUMN "host_initials" varchar DEFAULT 'JP';
  ALTER TABLE "pages_blocks_perspective_paragraphs" ADD COLUMN "text" varchar NOT NULL;
  ALTER TABLE "pages_blocks_perspective_stats" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "pages_blocks_perspective_stats" ADD COLUMN "suffix" varchar;
  ALTER TABLE "pages_blocks_perspective_stats" ADD COLUMN "detail" varchar;
  ALTER TABLE "pages_blocks_perspective" ADD COLUMN "kicker" varchar DEFAULT 'The perspective';
  ALTER TABLE "pages_blocks_perspective" ADD COLUMN "title" varchar DEFAULT 'Quiet Dalmatian hills,' NOT NULL;
  ALTER TABLE "pages_blocks_perspective" ADD COLUMN "accent" varchar DEFAULT 'twenty minutes';
  ALTER TABLE "pages_blocks_perspective" ADD COLUMN "title_end" varchar DEFAULT 'from the sea.';
  ALTER TABLE "pages_blocks_places_items" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "pages_blocks_places_items" ADD COLUMN "tag" varchar;
  ALTER TABLE "pages_blocks_places_items" ADD COLUMN "time" varchar;
  ALTER TABLE "pages_blocks_places_items" ADD COLUMN "desc" varchar;
  ALTER TABLE "pages_blocks_places" ADD COLUMN "kicker" varchar DEFAULT 'Spaces & Ambience';
  ALTER TABLE "pages_blocks_places" ADD COLUMN "title" varchar DEFAULT 'Every corner tailored for' NOT NULL;
  ALTER TABLE "pages_blocks_places" ADD COLUMN "accent" varchar DEFAULT 'shared memories.';
  ALTER TABLE "pages_blocks_regional_drives_text" ADD COLUMN "kicker" varchar DEFAULT 'Regional Map & Travel Times';
  ALTER TABLE "pages_blocks_regional_drives_text" ADD COLUMN "title" varchar DEFAULT 'Everything within effortless driving distance.' NOT NULL;
  ALTER TABLE "pages_blocks_regional_drives_text" ADD COLUMN "text" varchar DEFAULT 'Located in Podine (Šibenik hinterland), Villa San Antonio provides complete sanctuary without isolation — scenic highways and coastal roads take you anywhere in minutes.' NOT NULL;
  ALTER TABLE "pages_blocks_gallery_strip_images" ADD COLUMN "alt" varchar;
  ALTER TABLE "pages_blocks_gallery_strip" ADD COLUMN "kicker" varchar DEFAULT 'Gallery';
  ALTER TABLE "pages_blocks_gallery_strip" ADD COLUMN "title" varchar DEFAULT 'Atmosphere in';
  ALTER TABLE "pages_blocks_gallery_strip" ADD COLUMN "accent" varchar DEFAULT 'still frames.';
  ALTER TABLE "pages_blocks_reviews" ADD COLUMN "kicker" varchar DEFAULT 'Guest Impressions';
  ALTER TABLE "pages_blocks_reviews" ADD COLUMN "title" varchar DEFAULT 'Verified words from';
  ALTER TABLE "pages_blocks_reviews" ADD COLUMN "accent" varchar DEFAULT 'our guests.';
  ALTER TABLE "pages_blocks_reviews" ADD COLUMN "intro" varchar;
  ALTER TABLE "pages_blocks_faq_short" ADD COLUMN "kicker" varchar DEFAULT 'FAQ';
  ALTER TABLE "pages_blocks_faq_short" ADD COLUMN "title" varchar DEFAULT 'Everything you need to';
  ALTER TABLE "pages_blocks_faq_short" ADD COLUMN "accent" varchar DEFAULT 'know before.';
  ALTER TABLE "pages_blocks_faq_short" ADD COLUMN "subtext" varchar;
  ALTER TABLE "pages_blocks_faq_section_quick_facts" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_faq_section_quick_facts" ADD COLUMN "value" varchar NOT NULL;
  ALTER TABLE "pages_blocks_faq_section_quick_facts" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pages_blocks_faq_section" ADD COLUMN "left_kicker" varchar DEFAULT 'At a glance';
  ALTER TABLE "pages_blocks_faq_section" ADD COLUMN "left_title" varchar DEFAULT 'Key facts';
  ALTER TABLE "pages_blocks_faq_section" ADD COLUMN "left_accent" varchar DEFAULT 'before arrival.';
  ALTER TABLE "pages_blocks_faq_section" ADD COLUMN "left_lead" varchar DEFAULT 'Quick summary of our key house standards and amenities to help you plan your Dalmatian holiday.';
  ALTER TABLE "pages_blocks_faq_section" ADD COLUMN "right_kicker" varchar DEFAULT 'House Guide & Details';
  ALTER TABLE "pages_blocks_faq_section" ADD COLUMN "right_title" varchar DEFAULT 'Frequently asked';
  ALTER TABLE "pages_blocks_faq_section" ADD COLUMN "right_accent" varchar DEFAULT 'questions.';
  ALTER TABLE "pages_blocks_faq_section" ADD COLUMN "right_lead" varchar DEFAULT 'Everything you need to know about staying at Villa San Antonio. Filter by category or search below.';
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "kicker" varchar;
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "title" varchar DEFAULT 'Get in';
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "accent" varchar DEFAULT 'touch.';
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "lead" varchar DEFAULT 'We answer every message personally, usually within 30 minutes.';
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "whatsapp_number" varchar DEFAULT '+385 91 602 1899';
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "whatsapp_label" varchar DEFAULT 'Chat on WhatsApp';
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "location_address" varchar DEFAULT 'Podine 14, 22000 Šibenik, Dalmatia · Croatia';
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "faq_card_title" varchar DEFAULT 'Need immediate answers?';
  ALTER TABLE "pages_blocks_contact_section" ADD COLUMN "faq_card_text" varchar DEFAULT 'Check our house guide for check-in hours, heated pool details, and pet rules.';
  ALTER TABLE "pages_blocks_booking_section_steps" ADD COLUMN "num" varchar DEFAULT '01';
  ALTER TABLE "pages_blocks_booking_section_steps" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_booking_section_steps" ADD COLUMN "desc" varchar NOT NULL;
  ALTER TABLE "pages_blocks_booking_section_privileges" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages_blocks_booking_section_privileges" ADD COLUMN "desc" varchar NOT NULL;
  ALTER TABLE "pages_blocks_booking_section" ADD COLUMN "steps_title" varchar DEFAULT 'How direct reservation works';
  ALTER TABLE "pages_blocks_booking_section" ADD COLUMN "privileges_title" varchar DEFAULT 'Direct booking privileges';
  ALTER TABLE "pages_blocks_booking_section" ADD COLUMN "host_name" varchar DEFAULT 'Josip & Family';
  ALTER TABLE "pages_blocks_booking_section" ADD COLUMN "host_subtitle" varchar DEFAULT 'Estate Owners & Hosts';
  ALTER TABLE "pages_blocks_booking_section" ADD COLUMN "badge_text" varchar DEFAULT 'Fast Reply';
  ALTER TABLE "pages_blocks_booking_section" ADD COLUMN "whatsapp_label" varchar DEFAULT 'WhatsApp Chat';
  ALTER TABLE "pages_blocks_booking_section" ADD COLUMN "whatsapp_number" varchar DEFAULT '+385 91 602 1899';
  ALTER TABLE "pages" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "discover_posts" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "discover_posts" ADD COLUMN "tag" varchar DEFAULT '18 min drive · 18 km';
  ALTER TABLE "discover_posts" ADD COLUMN "badge" varchar;
  ALTER TABLE "discover_posts" ADD COLUMN "desc" jsonb NOT NULL;
  ALTER TABLE "discover_categories" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "drives_distances" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "drives_distances" ADD COLUMN "category" varchar;
  ALTER TABLE "drives_distances" ADD COLUMN "distance" varchar NOT NULL;
  ALTER TABLE "drives_distances" ADD COLUMN "drive_time" varchar NOT NULL;
  ALTER TABLE "drives_distances" ADD COLUMN "desc" varchar;
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "gallery_images" ADD COLUMN "alt" varchar;
  ALTER TABLE "gallery_categories" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "faq_items" ADD COLUMN "question" varchar NOT NULL;
  ALTER TABLE "faq_items" ADD COLUMN "answer" varchar NOT NULL;
  ALTER TABLE "faq_categories" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "header_nav_items" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "header" ADD COLUMN "cta_label" varchar DEFAULT 'Check availability';
  ALTER TABLE "footer_nav_links" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "footer_social_links" ADD COLUMN "label" varchar;
  ALTER TABLE "footer_legal_links" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "editorial_subheading" varchar DEFAULT 'Villa San Antonio · Dalmatia';
  ALTER TABLE "footer" ADD COLUMN "editorial_heading" varchar DEFAULT 'Your private sanctuary in the Dalmatian hills.';
  ALTER TABLE "footer" ADD COLUMN "editorial_short_bio" varchar DEFAULT 'Peaceful Mediterranean seclusion with modern comforts, just minutes from the Adriatic coast.';
  ALTER TABLE "footer" ADD COLUMN "brand_tagline" varchar DEFAULT 'Where slow mornings meet warm evenings. A private retreat for families & friends, tucked into the quiet Dalmatian hills near Šibenik.';
  ALTER TABLE "footer" ADD COLUMN "direct_booking_title" varchar DEFAULT 'Direct Booking Perks';
  ALTER TABLE "footer" ADD COLUMN "direct_booking_perk1" varchar DEFAULT 'Best direct rate guarantee';
  ALTER TABLE "footer" ADD COLUMN "direct_booking_perk2" varchar DEFAULT 'Heated pool & private jacuzzi';
  ALTER TABLE "footer" ADD COLUMN "direct_booking_perk3" varchar DEFAULT 'Fully fenced & pet-friendly garden';
  ALTER TABLE "footer" ADD COLUMN "direct_booking_perk4" varchar DEFAULT 'Personal host support (Josip)';
  ALTER TABLE "footer" ADD COLUMN "direct_booking_cta_label" varchar DEFAULT 'Check availability';
  ALTER TABLE "footer" ADD COLUMN "explore_title" varchar DEFAULT 'Explore';
  ALTER TABLE "footer" ADD COLUMN "contact_section_title" varchar DEFAULT 'Contact & Location';
  ALTER TABLE "footer" ADD COLUMN "contact_section_address" varchar DEFAULT 'Podine 14, near Šibenik';
  ALTER TABLE "footer" ADD COLUMN "contact_section_region" varchar DEFAULT 'Dalmatia · Croatia';
  ALTER TABLE "footer" ADD COLUMN "copyright" varchar DEFAULT 'Villa San Antonio. All rights reserved.';
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  DROP TYPE "public"."_locales";`)
}
