# Cloudflare Turnstile

Turnstile protects both public forms while the existing honeypot and the
5-attempts-per-15-minutes rate limit remain active.

## Production activation

1. In Cloudflare, create a **Managed** Turnstile widget for the production site.
2. Restrict the widget to `villa-sanantonio.com` and
   `www.villa-sanantonio.com`.
3. Add these production environment variables:

   ```dotenv
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site-key>
   TURNSTILE_SECRET_KEY=<secret-key>
   TURNSTILE_ALLOWED_HOSTNAMES=villa-sanantonio.com,www.villa-sanantonio.com
   ```

4. Redeploy the application.

The site key is public and is embedded in the client bundle. The secret key
must remain server-only. If neither key exists, Turnstile is inactive. A partial
configuration fails closed so that forms cannot silently run without server
validation.

## Validation behavior

- Contact submissions use the action `contact_message`.
- Booking submissions use the action `booking_inquiry`.
- The server validates the token, action and allowed hostname through
  Cloudflare Siteverify before writing to Payload.
- Tokens longer than 2,048 characters, expired tokens, reused tokens and
  mismatched actions or hostnames are rejected.
- Siteverify requests time out after eight seconds and fail closed.
- A failed form submission resets the widget and obtains a fresh single-use
  token.

For staging or automated tests, create a separate widget or use Cloudflare's
documented dummy keys. Do not allow `localhost` on the production widget.
