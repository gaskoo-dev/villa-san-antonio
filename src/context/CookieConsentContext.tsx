'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'

const CONSENT_COOKIE_NAME = 'villa_cookie_consent'
const CONSENT_COOKIE_VERSION = 'v2'
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180
const CONSENT_UPDATED_EVENT = 'villa-cookie-consent-updated'
const SERVER_SNAPSHOT = '__server__'
const MISSING_SNAPSHOT = '__missing__'

export type ConsentPreferences = {
  analytics: boolean
  externalMedia: boolean
  marketing: boolean
}

type CookieConsentContextValue = {
  analyticsAllowed: boolean
  externalMediaAllowed: boolean
  marketingAllowed: boolean
  hasDecision: boolean
  isReady: boolean
  settingsOpen: boolean
  acceptAll: () => void
  rejectNonEssential: () => void
  allowExternalMedia: () => void
  savePreferences: (preferences: ConsentPreferences) => void
  openSettings: () => void
  closeSettings: () => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

function subscribeToConsent(callback: () => void) {
  window.addEventListener(CONSENT_UPDATED_EVENT, callback)
  return () => window.removeEventListener(CONSENT_UPDATED_EVENT, callback)
}

function getConsentSnapshot() {
  const prefix = `${CONSENT_COOKIE_NAME}=`
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : MISSING_SNAPSHOT
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT
}

function parsePreferences(snapshot: string): ConsentPreferences | null {
  const match = snapshot.match(
    new RegExp(
      `^${CONSENT_COOKIE_VERSION}:analytics=([01])&external=([01])&marketing=([01])$`,
    ),
  )

  if (!match) return null

  return {
    analytics: match[1] === '1',
    externalMedia: match[2] === '1',
    marketing: match[3] === '1',
  }
}

function persistPreferences(preferences: ConsentPreferences) {
  const value = [
    `${CONSENT_COOKIE_VERSION}:analytics=${preferences.analytics ? '1' : '0'}`,
    `external=${preferences.externalMedia ? '1' : '0'}`,
    `marketing=${preferences.marketing ? '1' : '0'}`,
  ].join('&')
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''

  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new Event(CONSENT_UPDATED_EVENT))
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerSnapshot,
  )
  const [settingsOpen, setSettingsOpen] = useState(false)
  const preferences = parsePreferences(snapshot)
  const isReady = snapshot !== SERVER_SNAPSHOT

  const savePreferences = useCallback((nextPreferences: ConsentPreferences) => {
    persistPreferences(nextPreferences)
    setSettingsOpen(false)
  }, [])

  const acceptAll = useCallback(() => {
    savePreferences({ analytics: true, externalMedia: true, marketing: false })
  }, [savePreferences])

  const rejectNonEssential = useCallback(() => {
    savePreferences({ analytics: false, externalMedia: false, marketing: false })
  }, [savePreferences])

  const allowExternalMedia = useCallback(() => {
    savePreferences({
      analytics: preferences?.analytics ?? false,
      externalMedia: true,
      marketing: preferences?.marketing ?? false,
    })
  }, [preferences, savePreferences])

  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      analyticsAllowed: preferences?.analytics ?? false,
      externalMediaAllowed: preferences?.externalMedia ?? false,
      marketingAllowed: preferences?.marketing ?? false,
      hasDecision: preferences !== null,
      isReady,
      settingsOpen,
      acceptAll,
      rejectNonEssential,
      allowExternalMedia,
      savePreferences,
      openSettings,
      closeSettings,
    }),
    [
      acceptAll,
      allowExternalMedia,
      closeSettings,
      isReady,
      openSettings,
      preferences,
      rejectNonEssential,
      savePreferences,
      settingsOpen,
    ],
  )

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)

  if (!context) {
    throw new Error('useCookieConsent must be used inside CookieConsentProvider')
  }

  return context
}
