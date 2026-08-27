---
name: Villa San Antonio
description: MaisonFav-pinned estate album - paper ground, ink type, DM Sans tight headlines with Instrument Serif italic accents
colors:
  paper: "#f5f5f2"
  surface: "#e9e8e4"
  surface-deep: "#dedfdb"
  ink: "#090b0c"
  ink-soft: "#090c0d"
  fog: "#c9c3b9"
  mist: "#b8c0bc"
  sky: "#b9e5f3"
typography:
  display:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: "-0.075em"
    fontSize: "clamp(3.2rem, 7.2vw, 7.5rem)"
  accent:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontWeight: 400
    fontStyle: italic
  section:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.06em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  band: "16px"
  input: "0px"
  control: "9999px"
  focus-ring: "1px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "6px 6px 6px 20px"
  button-primary-on-dark:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  link-kicker:
    textColor: "rgba(9,11,12,0.65)"
---

# Villa San Antonio design system

Recorded from the built world (src/app/(frontend)/globals.css + components). Ground truth over intention.
Pinned reference: https://maisonfav.aura.build/ (owner-selected). Swiper is the mandated slider engine.

## Overview

Paper ground, ink type, one accent voice: Instrument Serif italic closing a tight DM Sans headline. Photography is sharp-cornered and full-bleed; the metrics band and the dark numbered section carry the signature moments. One light theme, locked. Single conversion intent, one label: "Check availability".

## Colors

- Ground: paper `#f5f5f2`; bands tint with surface `#e9e8e4` (surface-deep `#dedfdb` reserved). Dark sections are ink `#090b0c` with white/40-70 text, footer ink.
- Text: ink primary; secondary via ink alpha (60/55/50/45), never a second gray hue. On dark: white with alpha.
- Sky `#b9e5f3` is the only chromatic accent, used sparingly (form error text on dark). Stars are ink.
- Gradients only as none; photographic grain overlay is part of the material, not decoration.

## Typography

- Display: DM Sans 600, `clamp(3.2rem, 7.2vw, 7.5rem)`, `leading-[0.88]`, `tracking-[-0.075em]`, centered on home, left on subpages; last phrase in Instrument Serif 400 italic (`accent-serif`), tracking -0.02em.
- Section H2: DM Sans 500, `text-5xl sm:text-6xl lg:text-7xl`, `tracking-[-0.06em]`, with serif italic accent phrase.
- Kickers: `text-xs font-medium uppercase tracking-[0.13-0.16rem] text-ink/65` above headings (reference-pinned pattern; use once per section).
- Body: DM Sans 400, 14-15px, `leading-6`, ink/55-60, max 65ch. Nav/labels uppercase tracked xs.
- Card H3: DM Sans 500 `text-4xl sm:text-5xl tracking-[-0.06em]`. Dark numbered rows: Instrument Serif italic numerals 01-04 in white/40.

## Layout

- Container `container-page`: w-[91.5vw], max-w 1440px. Section rhythm py-24 lg:py-36, quiet bands less.
- Section header pattern: kicker + H2 left (2fr), quiet body or link right (1fr, justify-end), items-end.
- Signature blocks: metrics band (image | hairline-divided counters | image, rounded-2xl, bg-surface); dark numbered rows (`border-t border-white/15 py-9 md:grid-cols-[0.45fr_1fr_1fr]`); staggered bedroom trio (`lg:-mt-10`/`lg:mt-10`); Swiper gallery strip bleeding right.
- Hero: centered kicker + display headline + subtext + pill CTA, then Swiper fade slider (aspect 4/3 / 16:9 / 21:10) with grain.
- Sliders are Swiper (hero fade autoplay, reviews with arrow buttons, gallery free-mode strip); everything else stays static RSC.

## Elevation & Depth

- Hairline borders only: ink/10-20 on light, white/15-25 on dark. No drop shadows.
- Focus ring: global 2px ink outline, 3px offset, radius 1px, `:focus-visible` only.
- Film grain: `.grain::after` SVG noise, 0.5 opacity, overlay blend, on hero slider and dark BBQ photo only.

## Shapes

- Radius system: photography sharp (0), feature bands 16px (`rounded-2xl`), inputs 0, controls full pill, focus ring 1px. Documented rule, no exceptions.

## Components

- Buttons: `pill-cta` / `pill-cta-lg` - ink pill, xs uppercase tracked text, white circle chip (h-8 w-8) with arrow glyph inside, hover -translate-y, active translate-y-0. On dark: inverted (white pill, ink chip). One label per intent.
- Icon circles: h-8/9 w-8/9 rounded-full border ink/20 or white/25, Phosphor light 16-18.
- Forms: labels above inputs (xs uppercase tracked), inputs transparent with 1px borders (ink/20 light, white/25 dark), focus border full ink/white; errors below; honeypot; success replaces form with icon + message.
- Accordion: hairline ink/15 rows, question text-lg/xl medium, Plus rotates 45deg, grid-rows 0fr/1fr transition.
- Stars: Phosphor Star fill ink 15px. Reviews counter chip "N reviews".
- Custom cursor: 12px white dot, mix-blend-difference, spring follow, pointer:fine + lg only, reduced-motion aware.
- Header: fixed paper/90 blur, wordmark "Villa·San·Antonio", xs uppercase nav links, pill CTA; mobile menu full-screen ink with 4xl tight links.

## Motion

- One reveal language: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-reveal`), 900ms opacity+translateY(36px), stagger 70-140ms, once, viewport margin -100px. Reduced motion: opacity-only.
- UI feedback (hover, press): 200-300ms, same ease; pills lift -translate-y.
- Swiper owns slider transitions (fade 1200ms hero; standard elsewhere). Keyboard + a11y modules on all Swipers.
- No window scroll listeners (motion hooks only); no infinite loops except hero autoplay with pauseOnMouseEnter.

## Do's and Don'ts

- Do end every headline's accent phrase with the Instrument Serif italic, no synthetic italics elsewhere; DM Sans never italic.
- Don't add color beyond ink/paper/surface alphas + sky; no second accent, no gradients as decoration.
- Don't round photography or inputs; bands 16px and pills only.
- Do use Swiper for any new slider; don't hand-roll carousels.
- Don't put dense copy in dark sections; white/45-60 body, 14-15px max measure 65ch.
- Keep stats/claims traceable to Payload content or migrated source copy; label anything synthetic.
