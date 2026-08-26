import { expect, test } from '@playwright/test'

test.describe('Frontend CMS integration', () => {
  test('renders the CMS-driven homepage', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Villa San Antonio/i)
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.getByRole('link', { name: /discover/i }).first()).toBeVisible()
  })

  for (const pathname of [
    '/about-villa',
    '/booking',
    '/contact-us',
    '/discover',
    '/faq',
    '/gallery',
  ]) {
    test(`renders ${pathname} without a server error`, async ({ page }) => {
      const response = await page.goto(pathname)
      expect(response?.ok()).toBe(true)
      await expect(page.locator('h1').first()).toBeVisible()
    })
  }
})
