# Analytics and Google Tag Manager

The website owns consent and event collection. Google Tag Manager only receives events after the visitor allows Analytics or, in the future, Marketing.

## Environment

Set the public GTM container ID in every deployed environment:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Without a valid `GTM-` ID, the site keeps the consent controls working but does not request the GTM script or send analytics data.

## Consent contract

The site sets Google Consent Mode v2 defaults before GTM can load:

- `analytics_storage`: denied
- `ad_storage`: denied
- `ad_user_data`: denied
- `ad_personalization`: denied
- `functionality_storage`: granted
- `security_storage`: granted

After a visitor saves a choice, the site sends a Consent Mode update and a `villa_consent_update` data-layer event with:

- `consent_analytics`
- `consent_external_media`
- `consent_marketing`

The GTM script is loaded only after Analytics or Marketing consent. The Marketing control is intentionally inactive until Google Ads or Meta tags are ready to publish.

## GTM container setup

1. Create a Google tag in GTM using the GA4 measurement ID.
2. Set `send_page_view` to `false`; the application sends its own `page_view` event on initial load and Next.js route changes.
3. Require `analytics_storage` consent for the Google tag and all GA4 event tags.
4. Create Custom Event triggers for the events listed below.
5. Use the built-in `Event` variable as the GA4 event name and pass only the documented non-personal parameters.
6. Preview the container, verify consent in Tag Assistant, then publish.

## Events

| Data-layer event | Safe parameters | Intended use |
| --- | --- | --- |
| `page_view` | `page_path`, `page_title` | GA4 page view |
| `generate_lead` | `lead_type` | GA4 key event; later Google Ads/Meta conversion |
| `booking_form_start` | none | Booking funnel start |
| `date_range_selected` | `nights`, `minimum_nights` | Booking funnel progress |
| `click_whatsapp` | `link_location` | Contact intent |
| `click_phone` | `link_location` | Contact intent |
| `click_email` | `link_location` | Contact intent |
| `check_availability_click` | `link_location` | Booking CTA intent |
| `gallery_open` | `link_location` | Gallery intent |
| `map_open` | `link_location` or `interaction` | Location intent |

Never send names, email addresses, phone numbers, form messages, exact stay dates, or URL values containing those details to GTM, GA4, Google Ads, or Meta.

## Future Google Ads and Meta setup

Do not publish advertising or remarketing tags while the Marketing category is marked inactive in the consent UI.

When those campaigns are ready:

1. Enable the Marketing switch and increment the consent-cookie version so visitors are asked for the new purpose.
2. Fire Google Ads tags only with `ad_storage`, `ad_user_data`, and `ad_personalization` granted.
3. Fire the Meta base pixel and conversion events only when `consent_marketing` equals `granted`.
4. Reuse `generate_lead` for the lead conversion; do not create separate client events that contain form data.
5. Verify denied, Analytics-only, and Marketing-enabled flows in GTM Preview before publishing.
