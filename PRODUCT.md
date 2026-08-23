# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router, RSC) + Payload CMS 3.88 + PostgreSQL. Managed in this repo (`jjosip`). Frontend group `src/app/(frontend)`, admin at `/admin`. *Inferred from repo and approved plan.*

## Users

Primary: international families and groups of friends (mostly DACH region and Croatia, per review languages German/English/Croatian) looking for a private villa holiday near Šibenik, Dalmatia. Secondary: the villa owner (admin), who manages content and reads booking inquiries in the Payload admin.

## Product Purpose

Marketing and booking-inquiry site for Villa San Antonio, a private holiday villa for 6+2 guests near Šibenik (Podine). Success: a visitor sends a booking inquiry or contact message; the owner manages reviews, FAQ, gallery, amenities, and reads inquiries in the admin. Replaces the former WordPress/Elementor site at villa-sanantonio.com.

## Positioning

Complete privacy with premium comfort: heated pool, jacuzzi, outdoor kitchen/BBQ, fully fenced yard, pet-friendly, welcome package with homemade local products, host Josip praised across 27 real guest reviews. Agency-managed luxury-villa competitors list the same property; this is the owner's own direct channel.

## Operating Context

Seasonal holiday booking: guests typically inquire for summer weeks, pay 30% upfront by bank transfer or cash (no cards), €300 refundable security deposit. Inquiry-based booking, no live availability calendar. Villa facts: 8 guests max, 3 bedrooms, 4 bathrooms, 800 m² plot, 150 m² indoor, 36 m² heated/cooled pool. Location: Podine near Šibenik; beach 14 km, Šibenik 18 km, NP Krka 25 km, Split airport 31 km. *Inferred from migrated site content.*

## Capabilities and Constraints

- Pages: Home, About Villa, Gallery, FAQ, Contact (English only for now; content structured so i18n can be added later).
- Public booking inquiry form (dates, guests, pets, notes) and contact form, both storing submissions in Payload; guest data never exposed publicly.
- Content collections seeded from the old site: 27 reviews, 7 FAQ items, 11 amenity groups, 92 gallery images, site settings.
- No online payments, no live availability; inquiry workflow via email (kontakt@villa-sanantonio.com).
- Email sending not configured yet (no SMTP adapter); submissions are stored in the admin inbox. *Constraint recorded, undecided: transactional email provider.*

## Brand Commitments

Name: Villa San Antonio. Real guest photography (92 photos migrated from the old site) is the brand's core asset; the "quiet luxury in Dalmatia" voice from the old site carries over. Approved plan pinned the visual direction: editorial serif + warm Dalmatian palette avoiding the generic beige+brass luxury-template look; Emil Kowalski motion principles; Impeccable quality bar.

## Evidence on Hand

- `.migration/content.json`: extracted site content, 27 full reviews with sources/countries/ratings, 7 FAQ pairs, hero copy, stats, distances.
- `.migration/images/`: 94 original photos (88 villa shots, 4 aerials, 2 logo PNGs).
- Payload DB seeded (media, gallery, reviews, faq, amenities, settings).
- Absences that must not be fabricated: no pricing per night, no availability data, no email/phone beyond kontakt@villa-sanantonio.com (no public phone on old site).

## Product Principles

1. Photography leads; text supports. Every claim must be traceable to real villa facts or real reviews.
2. One conversion intent: "Check availability" (booking inquiry). Secondary: contact message.
3. Quiet luxury: generous space, restrained motion, no template patterns.
4. Guest privacy: inquiry data visible only to the authenticated owner.

## Accessibility & Inclusion

WCAG AA contrast target; prefers-reduced-motion honored (gentle opacity fades kept). Full keyboard support for accordion, gallery lightbox, carousels, and forms. *Standard established for this project, not a legacy constraint.*
