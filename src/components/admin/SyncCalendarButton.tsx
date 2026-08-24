'use client'

import React, { useState } from 'react'

export function SyncCalendarButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    status: 'idle' | 'success' | 'error'
    message?: string
  }>({ status: 'idle' })

  const handleSync = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult({ status: 'idle' })

    try {
      const res = await fetch('/api/cron/sync-calendar', {
        method: 'POST',
      })
      const data = await res.json()

      if (data.success) {
        setResult({
          status: 'success',
          message: `Calendar successfully synchronized! Found ${data.totalBookedRanges} booked ranges.`,
        })
        // Refresh page so Last Calendar Sync date refreshes in Payload UI
        setTimeout(() => {
          window.location.reload()
        }, 1200)
      } else {
        setResult({
          status: 'error',
          message: data.error || 'Failed to sync calendar.',
        })
      }
    } catch (err) {
      setResult({
        status: 'error',
        message: err instanceof Error ? err.message : 'Network error during calendar sync.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={handleSync}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '0.5rem',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <span>Syncing iCal Feed...</span>
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
              <span>Sync Calendar Now</span>
            </>
          )}
        </button>

        <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
          Fetch external reservations from iCal link immediately
        </span>
      </div>

      {result.status === 'success' && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.625rem 0.875rem',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            border: '1px solid #a7f3d0',
          }}
        >
          ✓ {result.message}
        </div>
      )}

      {result.status === 'error' && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.625rem 0.875rem',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            border: '1px solid #fecaca',
          }}
        >
          ✕ {result.message}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default SyncCalendarButton
