import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_story_highlights_highlights_icon" AS ENUM('users', 'pool', 'flame', 'paw', 'bed', 'sun', 'sparkles');
  CREATE TYPE "public"."enum_pages_blocks_spaces_showcase_bg_style" AS ENUM('surface', 'paper');
  CREATE TYPE "public"."enum_pages_blocks_booking_band_guarantees_icon" AS ENUM('shield', 'receipt', 'sparkles', 'clock', 'paw', 'pool', 'users', 'star');
  CREATE TYPE "public"."enum_pages_blocks_places_items_icon" AS ENUM('sun', 'flame', 'moon', 'sparkles', 'clock');
  CREATE TYPE "public"."enum_pages_blocks_faq_section_quick_facts_icon" AS ENUM('clock', 'shield', 'pool', 'paw', 'wifi', 'flame', 'users');
  CREATE TYPE "public"."enum_pages_blocks_booking_section_privileges_icon" AS ENUM('shield', 'sparkles', 'clock', 'heart', 'check');
  CREATE TYPE "public"."enum_booking_inquiries_pets" AS ENUM('no', 'yes');
  CREATE TYPE "public"."enum_booking_inquiries_status" AS ENUM('new', 'contacted', 'booked', 'archived');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'handled', 'archived');
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('instagram', 'facebook', 'whatsapp', 'tiktok', 'youtube', 'airbnb', 'booking', 'other');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "pages_blocks_hero_slider_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"kicker" varchar,
  	"title" varchar NOT NULL,
  	"accent" varchar,
  	"subtext" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"transition_duration" numeric DEFAULT 2000,
  	"interval" numeric DEFAULT 6500,
  	"primary_cta_label" varchar DEFAULT 'Check availability',
  	"primary_cta_url" varchar DEFAULT '/booking',
  	"secondary_cta_label" varchar DEFAULT 'Explore the villa',
  	"secondary_cta_url" varchar DEFAULT '/about-villa',
  	"coords_text" varchar DEFAULT '43.647° N, 16.055° E · PODINE',
  	"scroll_label" varchar DEFAULT 'Scroll to explore',
  	"instagram_url" varchar DEFAULT 'https://www.instagram.com/villa_sanantonio/',
  	"facebook_url" varchar DEFAULT 'https://web.facebook.com/villasanantoniopodine/',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_sub" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"accent" varchar,
  	"lead" varchar,
  	"breadcrumb_label" varchar,
  	"image_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_story_highlights_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_story_highlights_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_story_highlights_highlights_icon" DEFAULT 'users',
  	"label" varchar NOT NULL,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_story_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'The villa',
  	"title" varchar DEFAULT 'One house,' NOT NULL,
  	"accent" varchar DEFAULT 'held for you.',
  	"badge" varchar DEFAULT 'Podine, Šibenik · 20 min to the sea',
  	"show_map" boolean DEFAULT true,
  	"map_embed_url" varchar DEFAULT 'https://maps.google.com/maps?q=43.6470678,16.0546611+(Villa+San+Antonio)&hl=en&z=13&output=embed',
  	"map_direct_url" varchar DEFAULT 'https://maps.app.goo.gl/Xm8sAH7drKf2pADaA',
  	"map_address" varchar DEFAULT 'Podine 14, Šibenik',
  	"lead" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_spaces_showcase_spaces_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_spaces_showcase_spaces_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_spaces_showcase_spaces" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category" varchar DEFAULT 'interior',
  	"subtitle" varchar
  );
  
  CREATE TABLE "pages_blocks_spaces_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Inside spaces',
  	"title" varchar DEFAULT 'Light rooms,' NOT NULL,
  	"accent" varchar DEFAULT 'nothing missing.',
  	"bg_style" "enum_pages_blocks_spaces_showcase_bg_style" DEFAULT 'surface',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_welcome_package_delicacies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_welcome_package" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Welcome package',
  	"headline" varchar DEFAULT 'A welcome worthy' NOT NULL,
  	"accent" varchar DEFAULT 'of the drive.',
  	"body" varchar DEFAULT 'Start your vacation with our exclusive Welcome Package, featuring homemade brandy, fine wine, prosciutto and cheese. This perfect combination of local delicacies offers an authentic experience and immediately immerses you in the pleasures of our region. Ideal for relaxation and socializing, making it the perfect start to your holiday.' NOT NULL,
  	"image_main_id" integer,
  	"image_top_id" integer,
  	"image_bottom_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_distances_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_distances" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Distances',
  	"title" varchar DEFAULT 'Quietly placed,' NOT NULL,
  	"accent" varchar DEFAULT 'close to everything.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_booking_band_guarantees" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_booking_band_guarantees_icon" DEFAULT 'shield',
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_booking_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Hold your dates' NOT NULL,
  	"accent" varchar DEFAULT 'for this summer.',
  	"body" varchar DEFAULT 'Direct contact with the owner. Best rates guaranteed, personal check-in, and zero booking commission.',
  	"primary_cta_label" varchar DEFAULT 'Check Availability & Book',
  	"primary_cta_link" varchar DEFAULT '/booking',
  	"whatsapp_label" varchar DEFAULT 'WhatsApp Chat',
  	"whatsapp_number" varchar DEFAULT '+385 91 602 1899',
  	"host_name" varchar DEFAULT 'Josip & Family',
  	"host_role" varchar DEFAULT 'Estate Owners & Hosts',
  	"host_initials" varchar DEFAULT 'JP',
  	"host_avatar_id" integer,
  	"host_phone" varchar DEFAULT '+385 91 602 1899',
  	"host_email" varchar DEFAULT 'kontakt@villa-sanantonio.com',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_perspective_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_perspective_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "pages_blocks_perspective" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'The perspective',
  	"title" varchar DEFAULT 'Quiet Dalmatian hills,' NOT NULL,
  	"accent" varchar DEFAULT 'twenty minutes',
  	"title_end" varchar DEFAULT 'from the sea.',
  	"primary_image_id" integer,
  	"secondary_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_places_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tag" varchar,
  	"time" varchar,
  	"desc" varchar,
  	"image_id" integer,
  	"link" varchar DEFAULT '/about-villa',
  	"icon" "enum_pages_blocks_places_items_icon" DEFAULT 'sun'
  );
  
  CREATE TABLE "pages_blocks_places" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Spaces & Ambience',
  	"title" varchar DEFAULT 'Every corner tailored for' NOT NULL,
  	"accent" varchar DEFAULT 'shared memories.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_regional_drives_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Regional Map & Travel Times',
  	"title" varchar DEFAULT 'Everything within effortless driving distance.' NOT NULL,
  	"text" varchar DEFAULT 'Located in Podine (Šibenik hinterland), Villa San Antonio provides complete sanctuary without isolation — scenic highways and coastal roads take you anywhere in minutes.' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_strip_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Gallery',
  	"title" varchar DEFAULT 'Atmosphere in',
  	"accent" varchar DEFAULT 'still frames.',
  	"speed" numeric DEFAULT 65,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_reviews" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'Guest Impressions',
  	"title" varchar DEFAULT 'Verified words from',
  	"accent" varchar DEFAULT 'our guests.',
  	"intro" varchar,
  	"limit" numeric DEFAULT 30,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_short" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar DEFAULT 'FAQ',
  	"title" varchar DEFAULT 'Everything you need to',
  	"accent" varchar DEFAULT 'know before.',
  	"subtext" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_section_quick_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_faq_section_quick_facts_icon" DEFAULT 'clock',
  	"title" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"subtitle" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_kicker" varchar DEFAULT 'At a glance',
  	"left_title" varchar DEFAULT 'Key facts',
  	"left_accent" varchar DEFAULT 'before arrival.',
  	"left_lead" varchar DEFAULT 'Quick summary of our key house standards and amenities to help you plan your Dalmatian holiday.',
  	"right_kicker" varchar DEFAULT 'House Guide & Details',
  	"right_title" varchar DEFAULT 'Frequently asked',
  	"right_accent" varchar DEFAULT 'questions.',
  	"right_lead" varchar DEFAULT 'Everything you need to know about staying at Villa San Antonio. Filter by category or search below.',
  	"enable_search" boolean DEFAULT true,
  	"enable_category_tabs" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar DEFAULT 'Get in',
  	"accent" varchar DEFAULT 'touch.',
  	"lead" varchar DEFAULT 'We answer every message personally, usually within 30 minutes.',
  	"email" varchar DEFAULT 'kontakt@villa-sanantonio.com',
  	"phone" varchar DEFAULT '+385 91 602 1899',
  	"whatsapp_number" varchar DEFAULT '+385 91 602 1899',
  	"whatsapp_label" varchar DEFAULT 'Chat on WhatsApp',
  	"location_address" varchar DEFAULT 'Podine 14, 22000 Šibenik, Dalmatia · Croatia',
  	"google_maps_url" varchar DEFAULT 'https://maps.app.goo.gl/Xm8sAH7drKf2pADaA',
  	"show_faq_card" boolean DEFAULT true,
  	"faq_card_title" varchar DEFAULT 'Need immediate answers?',
  	"faq_card_text" varchar DEFAULT 'Check our house guide for check-in hours, heated pool details, and pet rules.',
  	"faq_card_link_label" varchar DEFAULT 'Browse Frequently Asked Questions',
  	"faq_card_link_url" varchar DEFAULT '/faq',
  	"enable_map" boolean DEFAULT true,
  	"map_latitude" numeric DEFAULT 43.6470678,
  	"map_longitude" numeric DEFAULT 16.0546611,
  	"map_zoom" numeric DEFAULT 13,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_booking_section_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar DEFAULT '01',
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_booking_section_privileges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_booking_section_privileges_icon" DEFAULT 'shield',
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_booking_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"steps_title" varchar DEFAULT 'How direct reservation works',
  	"privileges_title" varchar DEFAULT 'Direct booking privileges',
  	"host_image_id" integer,
  	"host_name" varchar DEFAULT 'Josip & Family',
  	"host_subtitle" varchar DEFAULT 'Estate Owners & Hosts',
  	"badge_text" varchar DEFAULT 'Fast Reply',
  	"whatsapp_label" varchar DEFAULT 'WhatsApp Chat',
  	"whatsapp_number" varchar DEFAULT '+385 91 602 1899',
  	"phone" varchar DEFAULT '+385 91 602 1899',
  	"email" varchar DEFAULT 'kontakt@villa-sanantonio.com',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"reviews_id" integer,
  	"faq_items_id" integer
  );
  
  CREATE TABLE "discover_posts_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "discover_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"category_ref_id" integer NOT NULL,
  	"tag" varchar DEFAULT '18 min drive · 18 km',
  	"badge" varchar,
  	"external_link" varchar,
  	"maps_url" varchar,
  	"desc" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "discover_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "drives_distances" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"category" varchar,
  	"distance" varchar NOT NULL,
  	"drive_time" varchar NOT NULL,
  	"maps_url" varchar,
  	"desc" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar,
  	"sizes_desktop_url" varchar,
  	"sizes_desktop_width" numeric,
  	"sizes_desktop_height" numeric,
  	"sizes_desktop_mime_type" varchar,
  	"sizes_desktop_filesize" numeric,
  	"sizes_desktop_filename" varchar
  );
  
  CREATE TABLE "gallery_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar,
  	"category_id" integer,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"country" varchar,
  	"stars" numeric DEFAULT 5,
  	"text" varchar NOT NULL,
  	"source" varchar,
  	"source_url" varchar,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category_id" integer,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "booking_inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"country" varchar,
  	"check_in" timestamp(3) with time zone NOT NULL,
  	"check_out" timestamp(3) with time zone NOT NULL,
  	"adults" numeric DEFAULT 2 NOT NULL,
  	"kids" numeric DEFAULT 0,
  	"pets" "enum_booking_inquiries_pets" DEFAULT 'no' NOT NULL,
  	"notes" varchar,
  	"status" "enum_booking_inquiries_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"status" "enum_contact_messages_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"pages_id" integer,
  	"discover_posts_id" integer,
  	"discover_categories_id" integer,
  	"drives_distances_id" integer,
  	"media_id" integer,
  	"gallery_images_id" integer,
  	"gallery_categories_id" integer,
  	"reviews_id" integer,
  	"faq_items_id" integer,
  	"faq_categories_id" integer,
  	"booking_inquiries_id" integer,
  	"contact_messages_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"top_bar_phone" varchar DEFAULT '+385 91 602 1899',
  	"top_bar_email" varchar DEFAULT 'kontakt@villa-sanantonio.com',
  	"top_bar_enable_languages" boolean DEFAULT true,
  	"cta_label" varchar DEFAULT 'Check availability',
  	"cta_link" varchar DEFAULT '/booking',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" DEFAULT 'instagram' NOT NULL,
  	"label" varchar,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  	"direct_booking_cta_link" varchar DEFAULT '/booking',
  	"explore_title" varchar DEFAULT 'Explore',
  	"contact_section_title" varchar DEFAULT 'Contact & Location',
  	"contact_section_email" varchar DEFAULT 'kontakt@villa-sanantonio.com',
  	"contact_section_phone" varchar DEFAULT '+385 91 602 1899',
  	"contact_section_address" varchar DEFAULT 'Podine 14, near Šibenik',
  	"contact_section_region" varchar DEFAULT 'Dalmatia · Croatia',
  	"copyright" varchar DEFAULT 'Villa San Antonio. All rights reserved.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"calendar_ical_url" varchar DEFAULT 'https://www.myluxoria.com/api/v1/get-ical/358',
  	"calendar_no_store" boolean DEFAULT false,
  	"calendar_cache_minutes" numeric DEFAULT 15,
  	"min_nights" numeric DEFAULT 3,
  	"calendar_last_synced_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD CONSTRAINT "pages_blocks_hero_slider_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider_slides" ADD CONSTRAINT "pages_blocks_hero_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slider" ADD CONSTRAINT "pages_blocks_hero_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_sub" ADD CONSTRAINT "pages_blocks_hero_sub_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_sub" ADD CONSTRAINT "pages_blocks_hero_sub_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_highlights_paragraphs" ADD CONSTRAINT "pages_blocks_story_highlights_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_highlights_highlights" ADD CONSTRAINT "pages_blocks_story_highlights_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_highlights" ADD CONSTRAINT "pages_blocks_story_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces_images" ADD CONSTRAINT "pages_blocks_spaces_showcase_spaces_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces_images" ADD CONSTRAINT "pages_blocks_spaces_showcase_spaces_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_spaces_showcase_spaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces_features" ADD CONSTRAINT "pages_blocks_spaces_showcase_spaces_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_spaces_showcase_spaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spaces_showcase_spaces" ADD CONSTRAINT "pages_blocks_spaces_showcase_spaces_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_spaces_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spaces_showcase" ADD CONSTRAINT "pages_blocks_spaces_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_welcome_package_delicacies" ADD CONSTRAINT "pages_blocks_welcome_package_delicacies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_welcome_package"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_welcome_package" ADD CONSTRAINT "pages_blocks_welcome_package_image_main_id_media_id_fk" FOREIGN KEY ("image_main_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_welcome_package" ADD CONSTRAINT "pages_blocks_welcome_package_image_top_id_media_id_fk" FOREIGN KEY ("image_top_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_welcome_package" ADD CONSTRAINT "pages_blocks_welcome_package_image_bottom_id_media_id_fk" FOREIGN KEY ("image_bottom_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_welcome_package" ADD CONSTRAINT "pages_blocks_welcome_package_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_distances_items" ADD CONSTRAINT "pages_blocks_distances_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_distances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_distances" ADD CONSTRAINT "pages_blocks_distances_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_band_guarantees" ADD CONSTRAINT "pages_blocks_booking_band_guarantees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_band" ADD CONSTRAINT "pages_blocks_booking_band_host_avatar_id_media_id_fk" FOREIGN KEY ("host_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_band" ADD CONSTRAINT "pages_blocks_booking_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perspective_paragraphs" ADD CONSTRAINT "pages_blocks_perspective_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perspective"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perspective_stats" ADD CONSTRAINT "pages_blocks_perspective_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_perspective"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_perspective" ADD CONSTRAINT "pages_blocks_perspective_primary_image_id_media_id_fk" FOREIGN KEY ("primary_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_perspective" ADD CONSTRAINT "pages_blocks_perspective_secondary_image_id_media_id_fk" FOREIGN KEY ("secondary_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_perspective" ADD CONSTRAINT "pages_blocks_perspective_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_places_items" ADD CONSTRAINT "pages_blocks_places_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_places_items" ADD CONSTRAINT "pages_blocks_places_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_places" ADD CONSTRAINT "pages_blocks_places_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_regional_drives_text" ADD CONSTRAINT "pages_blocks_regional_drives_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_strip_images" ADD CONSTRAINT "pages_blocks_gallery_strip_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_strip_images" ADD CONSTRAINT "pages_blocks_gallery_strip_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_strip" ADD CONSTRAINT "pages_blocks_gallery_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_reviews" ADD CONSTRAINT "pages_blocks_reviews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_short" ADD CONSTRAINT "pages_blocks_faq_short_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section_quick_facts" ADD CONSTRAINT "pages_blocks_faq_section_quick_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_section" ADD CONSTRAINT "pages_blocks_faq_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section" ADD CONSTRAINT "pages_blocks_contact_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_section_steps" ADD CONSTRAINT "pages_blocks_booking_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_section_privileges" ADD CONSTRAINT "pages_blocks_booking_section_privileges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_section" ADD CONSTRAINT "pages_blocks_booking_section_host_image_id_media_id_fk" FOREIGN KEY ("host_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_section" ADD CONSTRAINT "pages_blocks_booking_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faq_items_fk" FOREIGN KEY ("faq_items_id") REFERENCES "public"."faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discover_posts_images" ADD CONSTRAINT "discover_posts_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "discover_posts_images" ADD CONSTRAINT "discover_posts_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."discover_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "discover_posts" ADD CONSTRAINT "discover_posts_category_ref_id_discover_categories_id_fk" FOREIGN KEY ("category_ref_id") REFERENCES "public"."discover_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_category_id_gallery_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."gallery_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_category_id_faq_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."faq_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_discover_posts_fk" FOREIGN KEY ("discover_posts_id") REFERENCES "public"."discover_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_discover_categories_fk" FOREIGN KEY ("discover_categories_id") REFERENCES "public"."discover_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_drives_distances_fk" FOREIGN KEY ("drives_distances_id") REFERENCES "public"."drives_distances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_images_fk" FOREIGN KEY ("gallery_images_id") REFERENCES "public"."gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_categories_fk" FOREIGN KEY ("gallery_categories_id") REFERENCES "public"."gallery_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_items_fk" FOREIGN KEY ("faq_items_id") REFERENCES "public"."faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_categories_fk" FOREIGN KEY ("faq_categories_id") REFERENCES "public"."faq_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_booking_inquiries_fk" FOREIGN KEY ("booking_inquiries_id") REFERENCES "public"."booking_inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_links" ADD CONSTRAINT "footer_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "pages_blocks_hero_slider_slides_order_idx" ON "pages_blocks_hero_slider_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_slides_parent_id_idx" ON "pages_blocks_hero_slider_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_slides_image_idx" ON "pages_blocks_hero_slider_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_slider_order_idx" ON "pages_blocks_hero_slider" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slider_parent_id_idx" ON "pages_blocks_hero_slider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slider_path_idx" ON "pages_blocks_hero_slider" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_sub_order_idx" ON "pages_blocks_hero_sub" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_sub_parent_id_idx" ON "pages_blocks_hero_sub" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_sub_path_idx" ON "pages_blocks_hero_sub" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_sub_image_idx" ON "pages_blocks_hero_sub" USING btree ("image_id");
  CREATE INDEX "pages_blocks_story_highlights_paragraphs_order_idx" ON "pages_blocks_story_highlights_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_highlights_paragraphs_parent_id_idx" ON "pages_blocks_story_highlights_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_highlights_highlights_order_idx" ON "pages_blocks_story_highlights_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_highlights_highlights_parent_id_idx" ON "pages_blocks_story_highlights_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_highlights_order_idx" ON "pages_blocks_story_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_highlights_parent_id_idx" ON "pages_blocks_story_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_highlights_path_idx" ON "pages_blocks_story_highlights" USING btree ("_path");
  CREATE INDEX "pages_blocks_spaces_showcase_spaces_images_order_idx" ON "pages_blocks_spaces_showcase_spaces_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_spaces_showcase_spaces_images_parent_id_idx" ON "pages_blocks_spaces_showcase_spaces_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spaces_showcase_spaces_images_image_idx" ON "pages_blocks_spaces_showcase_spaces_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_spaces_showcase_spaces_features_order_idx" ON "pages_blocks_spaces_showcase_spaces_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_spaces_showcase_spaces_features_parent_id_idx" ON "pages_blocks_spaces_showcase_spaces_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spaces_showcase_spaces_order_idx" ON "pages_blocks_spaces_showcase_spaces" USING btree ("_order");
  CREATE INDEX "pages_blocks_spaces_showcase_spaces_parent_id_idx" ON "pages_blocks_spaces_showcase_spaces" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spaces_showcase_order_idx" ON "pages_blocks_spaces_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_spaces_showcase_parent_id_idx" ON "pages_blocks_spaces_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spaces_showcase_path_idx" ON "pages_blocks_spaces_showcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_welcome_package_delicacies_order_idx" ON "pages_blocks_welcome_package_delicacies" USING btree ("_order");
  CREATE INDEX "pages_blocks_welcome_package_delicacies_parent_id_idx" ON "pages_blocks_welcome_package_delicacies" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_welcome_package_order_idx" ON "pages_blocks_welcome_package" USING btree ("_order");
  CREATE INDEX "pages_blocks_welcome_package_parent_id_idx" ON "pages_blocks_welcome_package" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_welcome_package_path_idx" ON "pages_blocks_welcome_package" USING btree ("_path");
  CREATE INDEX "pages_blocks_welcome_package_image_main_idx" ON "pages_blocks_welcome_package" USING btree ("image_main_id");
  CREATE INDEX "pages_blocks_welcome_package_image_top_idx" ON "pages_blocks_welcome_package" USING btree ("image_top_id");
  CREATE INDEX "pages_blocks_welcome_package_image_bottom_idx" ON "pages_blocks_welcome_package" USING btree ("image_bottom_id");
  CREATE INDEX "pages_blocks_distances_items_order_idx" ON "pages_blocks_distances_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_distances_items_parent_id_idx" ON "pages_blocks_distances_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_distances_order_idx" ON "pages_blocks_distances" USING btree ("_order");
  CREATE INDEX "pages_blocks_distances_parent_id_idx" ON "pages_blocks_distances" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_distances_path_idx" ON "pages_blocks_distances" USING btree ("_path");
  CREATE INDEX "pages_blocks_booking_band_guarantees_order_idx" ON "pages_blocks_booking_band_guarantees" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_band_guarantees_parent_id_idx" ON "pages_blocks_booking_band_guarantees" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_booking_band_order_idx" ON "pages_blocks_booking_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_band_parent_id_idx" ON "pages_blocks_booking_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_booking_band_path_idx" ON "pages_blocks_booking_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_booking_band_host_avatar_idx" ON "pages_blocks_booking_band" USING btree ("host_avatar_id");
  CREATE INDEX "pages_blocks_perspective_paragraphs_order_idx" ON "pages_blocks_perspective_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_perspective_paragraphs_parent_id_idx" ON "pages_blocks_perspective_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_perspective_stats_order_idx" ON "pages_blocks_perspective_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_perspective_stats_parent_id_idx" ON "pages_blocks_perspective_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_perspective_order_idx" ON "pages_blocks_perspective" USING btree ("_order");
  CREATE INDEX "pages_blocks_perspective_parent_id_idx" ON "pages_blocks_perspective" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_perspective_path_idx" ON "pages_blocks_perspective" USING btree ("_path");
  CREATE INDEX "pages_blocks_perspective_primary_image_idx" ON "pages_blocks_perspective" USING btree ("primary_image_id");
  CREATE INDEX "pages_blocks_perspective_secondary_image_idx" ON "pages_blocks_perspective" USING btree ("secondary_image_id");
  CREATE INDEX "pages_blocks_places_items_order_idx" ON "pages_blocks_places_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_places_items_parent_id_idx" ON "pages_blocks_places_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_places_items_image_idx" ON "pages_blocks_places_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_places_order_idx" ON "pages_blocks_places" USING btree ("_order");
  CREATE INDEX "pages_blocks_places_parent_id_idx" ON "pages_blocks_places" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_places_path_idx" ON "pages_blocks_places" USING btree ("_path");
  CREATE INDEX "pages_blocks_regional_drives_text_order_idx" ON "pages_blocks_regional_drives_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_regional_drives_text_parent_id_idx" ON "pages_blocks_regional_drives_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_regional_drives_text_path_idx" ON "pages_blocks_regional_drives_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_strip_images_order_idx" ON "pages_blocks_gallery_strip_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_strip_images_parent_id_idx" ON "pages_blocks_gallery_strip_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_strip_images_image_idx" ON "pages_blocks_gallery_strip_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_strip_order_idx" ON "pages_blocks_gallery_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_strip_parent_id_idx" ON "pages_blocks_gallery_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_strip_path_idx" ON "pages_blocks_gallery_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_reviews_order_idx" ON "pages_blocks_reviews" USING btree ("_order");
  CREATE INDEX "pages_blocks_reviews_parent_id_idx" ON "pages_blocks_reviews" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_reviews_path_idx" ON "pages_blocks_reviews" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_short_order_idx" ON "pages_blocks_faq_short" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_short_parent_id_idx" ON "pages_blocks_faq_short" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_short_path_idx" ON "pages_blocks_faq_short" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_section_quick_facts_order_idx" ON "pages_blocks_faq_section_quick_facts" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_section_quick_facts_parent_id_idx" ON "pages_blocks_faq_section_quick_facts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_section_order_idx" ON "pages_blocks_faq_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_section_parent_id_idx" ON "pages_blocks_faq_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_section_path_idx" ON "pages_blocks_faq_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_section_order_idx" ON "pages_blocks_contact_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_section_parent_id_idx" ON "pages_blocks_contact_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_section_path_idx" ON "pages_blocks_contact_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_booking_section_steps_order_idx" ON "pages_blocks_booking_section_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_section_steps_parent_id_idx" ON "pages_blocks_booking_section_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_booking_section_privileges_order_idx" ON "pages_blocks_booking_section_privileges" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_section_privileges_parent_id_idx" ON "pages_blocks_booking_section_privileges" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_booking_section_order_idx" ON "pages_blocks_booking_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_section_parent_id_idx" ON "pages_blocks_booking_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_booking_section_path_idx" ON "pages_blocks_booking_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_booking_section_host_image_idx" ON "pages_blocks_booking_section" USING btree ("host_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_reviews_id_idx" ON "pages_rels" USING btree ("reviews_id");
  CREATE INDEX "pages_rels_faq_items_id_idx" ON "pages_rels" USING btree ("faq_items_id");
  CREATE INDEX "discover_posts_images_order_idx" ON "discover_posts_images" USING btree ("_order");
  CREATE INDEX "discover_posts_images_parent_id_idx" ON "discover_posts_images" USING btree ("_parent_id");
  CREATE INDEX "discover_posts_images_image_idx" ON "discover_posts_images" USING btree ("image_id");
  CREATE INDEX "discover_posts__order_idx" ON "discover_posts" USING btree ("_order");
  CREATE INDEX "discover_posts_category_ref_idx" ON "discover_posts" USING btree ("category_ref_id");
  CREATE INDEX "discover_posts_updated_at_idx" ON "discover_posts" USING btree ("updated_at");
  CREATE INDEX "discover_posts_created_at_idx" ON "discover_posts" USING btree ("created_at");
  CREATE INDEX "discover_categories__order_idx" ON "discover_categories" USING btree ("_order");
  CREATE UNIQUE INDEX "discover_categories_slug_idx" ON "discover_categories" USING btree ("slug");
  CREATE INDEX "discover_categories_updated_at_idx" ON "discover_categories" USING btree ("updated_at");
  CREATE INDEX "discover_categories_created_at_idx" ON "discover_categories" USING btree ("created_at");
  CREATE INDEX "drives_distances__order_idx" ON "drives_distances" USING btree ("_order");
  CREATE INDEX "drives_distances_updated_at_idx" ON "drives_distances" USING btree ("updated_at");
  CREATE INDEX "drives_distances_created_at_idx" ON "drives_distances" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX "media_sizes_desktop_sizes_desktop_filename_idx" ON "media" USING btree ("sizes_desktop_filename");
  CREATE INDEX "gallery_images_image_idx" ON "gallery_images" USING btree ("image_id");
  CREATE INDEX "gallery_images_category_idx" ON "gallery_images" USING btree ("category_id");
  CREATE INDEX "gallery_images_updated_at_idx" ON "gallery_images" USING btree ("updated_at");
  CREATE INDEX "gallery_images_created_at_idx" ON "gallery_images" USING btree ("created_at");
  CREATE UNIQUE INDEX "gallery_categories_slug_idx" ON "gallery_categories" USING btree ("slug");
  CREATE INDEX "gallery_categories_updated_at_idx" ON "gallery_categories" USING btree ("updated_at");
  CREATE INDEX "gallery_categories_created_at_idx" ON "gallery_categories" USING btree ("created_at");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE INDEX "faq_items_category_idx" ON "faq_items" USING btree ("category_id");
  CREATE INDEX "faq_items_updated_at_idx" ON "faq_items" USING btree ("updated_at");
  CREATE INDEX "faq_items_created_at_idx" ON "faq_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "faq_categories_slug_idx" ON "faq_categories" USING btree ("slug");
  CREATE INDEX "faq_categories_updated_at_idx" ON "faq_categories" USING btree ("updated_at");
  CREATE INDEX "faq_categories_created_at_idx" ON "faq_categories" USING btree ("created_at");
  CREATE INDEX "booking_inquiries_updated_at_idx" ON "booking_inquiries" USING btree ("updated_at");
  CREATE INDEX "booking_inquiries_created_at_idx" ON "booking_inquiries" USING btree ("created_at");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_discover_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("discover_posts_id");
  CREATE INDEX "payload_locked_documents_rels_discover_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("discover_categories_id");
  CREATE INDEX "payload_locked_documents_rels_drives_distances_id_idx" ON "payload_locked_documents_rels" USING btree ("drives_distances_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_images_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_images_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_categories_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_faq_items_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_items_id");
  CREATE INDEX "payload_locked_documents_rels_faq_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_categories_id");
  CREATE INDEX "payload_locked_documents_rels_booking_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("booking_inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_nav_links_order_idx" ON "footer_nav_links" USING btree ("_order");
  CREATE INDEX "footer_nav_links_parent_id_idx" ON "footer_nav_links" USING btree ("_parent_id");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "pages_blocks_hero_slider_slides" CASCADE;
  DROP TABLE "pages_blocks_hero_slider" CASCADE;
  DROP TABLE "pages_blocks_hero_sub" CASCADE;
  DROP TABLE "pages_blocks_story_highlights_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_story_highlights_highlights" CASCADE;
  DROP TABLE "pages_blocks_story_highlights" CASCADE;
  DROP TABLE "pages_blocks_spaces_showcase_spaces_images" CASCADE;
  DROP TABLE "pages_blocks_spaces_showcase_spaces_features" CASCADE;
  DROP TABLE "pages_blocks_spaces_showcase_spaces" CASCADE;
  DROP TABLE "pages_blocks_spaces_showcase" CASCADE;
  DROP TABLE "pages_blocks_welcome_package_delicacies" CASCADE;
  DROP TABLE "pages_blocks_welcome_package" CASCADE;
  DROP TABLE "pages_blocks_distances_items" CASCADE;
  DROP TABLE "pages_blocks_distances" CASCADE;
  DROP TABLE "pages_blocks_booking_band_guarantees" CASCADE;
  DROP TABLE "pages_blocks_booking_band" CASCADE;
  DROP TABLE "pages_blocks_perspective_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_perspective_stats" CASCADE;
  DROP TABLE "pages_blocks_perspective" CASCADE;
  DROP TABLE "pages_blocks_places_items" CASCADE;
  DROP TABLE "pages_blocks_places" CASCADE;
  DROP TABLE "pages_blocks_regional_drives_text" CASCADE;
  DROP TABLE "pages_blocks_gallery_strip_images" CASCADE;
  DROP TABLE "pages_blocks_gallery_strip" CASCADE;
  DROP TABLE "pages_blocks_reviews" CASCADE;
  DROP TABLE "pages_blocks_faq_short" CASCADE;
  DROP TABLE "pages_blocks_faq_section_quick_facts" CASCADE;
  DROP TABLE "pages_blocks_faq_section" CASCADE;
  DROP TABLE "pages_blocks_contact_section" CASCADE;
  DROP TABLE "pages_blocks_booking_section_steps" CASCADE;
  DROP TABLE "pages_blocks_booking_section_privileges" CASCADE;
  DROP TABLE "pages_blocks_booking_section" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "discover_posts_images" CASCADE;
  DROP TABLE "discover_posts" CASCADE;
  DROP TABLE "discover_categories" CASCADE;
  DROP TABLE "drives_distances" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "gallery_images" CASCADE;
  DROP TABLE "gallery_categories" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "faq_items" CASCADE;
  DROP TABLE "faq_categories" CASCADE;
  DROP TABLE "booking_inquiries" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_nav_links" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_story_highlights_highlights_icon";
  DROP TYPE "public"."enum_pages_blocks_spaces_showcase_bg_style";
  DROP TYPE "public"."enum_pages_blocks_booking_band_guarantees_icon";
  DROP TYPE "public"."enum_pages_blocks_places_items_icon";
  DROP TYPE "public"."enum_pages_blocks_faq_section_quick_facts_icon";
  DROP TYPE "public"."enum_pages_blocks_booking_section_privileges_icon";
  DROP TYPE "public"."enum_booking_inquiries_pets";
  DROP TYPE "public"."enum_booking_inquiries_status";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_footer_social_links_platform";`)
}
