'use client'

import { IconArrowUpRight, IconCircleCheck, IconLoader2 } from '@tabler/icons-react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitContactMessage } from '@/actions/inquiries'
import { TurnstileWidget, turnstileClientEnabled } from '@/components/TurnstileWidget'
import { useAnalytics } from '@/hooks/useAnalytics'
import { emptyFormState } from '@/lib/form-state'

const inputClass =
  'w-full rounded-2xl border border-ink/15 bg-paper/50 px-4.5 py-3.5 text-base sm:text-sm text-ink placeholder:text-ink/55 transition-colors duration-200 hover:border-ink/35 focus:border-ink/35 focus:outline-none'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 animate-[var(--animate-fade-in)]">
      {message}
    </p>
  )
}

function SubmitButton({ securityReady }: { securityReady: boolean }) {
  const { pending } = useFormStatus()
  const waitingForSecurity = !pending && !securityReady
  return (
    <button
      type="submit"
      disabled={pending || !securityReady}
      className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-4 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14rem] text-white shadow-lg transition-all duration-300 hover:bg-ink/85 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      <span>
        {pending
          ? 'Sending message...'
          : waitingForSecurity
            ? 'Completing security check...'
            : 'Send message'}
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        {pending || waitingForSecurity ? (
          <IconLoader2 size={15} className="animate-spin text-ink" />
        ) : (
          <IconArrowUpRight size={15} stroke={2.5} aria-hidden />
        )}
      </span>
    </button>
  )
}

export function ContactForm() {
  const track = useAnalytics()
  const [state, formAction] = useActionState(submitContactMessage, emptyFormState)
  const [turnstileReady, setTurnstileReady] = useState(!turnstileClientEnabled)
  const leadTrackedRef = useRef(false)

  useEffect(() => {
    if (state.status !== 'success' || leadTrackedRef.current) return
    leadTrackedRef.current = true
    track('generate_lead', { lead_type: 'contact_message' })
  }, [state.status, track])

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center py-10 sm:py-14 text-center space-y-4 animate-[var(--animate-fade-in)]"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shadow-xs">
          <IconCircleCheck size={28} stroke={2} />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl text-ink">
            Thank you for reaching out
          </h3>
          <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed text-ink/70">
            Your message has been received. Josip and the family typically reply within 30 minutes.
          </p>
        </div>
        <div className="pt-4">
          <a
            href="/contact-us"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white cursor-pointer"
          >
            <span>Send another message</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      {/* Honeypot for spam bots */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {/* Name and Email Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14rem] text-ink/65">
            Your Name <span className="text-amber-700">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={120}
            autoComplete="name"
            required
            placeholder="e.g. Elena Rostova"
            className={inputClass}
          />
          <FieldError message={state.errors?.name} />
        </div>

        <div>
          <label htmlFor="cemail" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14rem] text-ink/65">
            Email Address <span className="text-amber-700">*</span>
          </label>
          <input
            id="cemail"
            name="email"
            type="email"
            maxLength={254}
            autoComplete="email"
            required
            placeholder="e.g. elena@domain.com"
            className={inputClass}
          />
          <FieldError message={state.errors?.email} />
        </div>
      </div>

      {/* Subject Input */}
      <div>
        <label htmlFor="subject" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14rem] text-ink/65">
          Subject <span className="text-amber-700">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={200}
          required
          placeholder="What is your inquiry regarding?"
          className={inputClass}
        />
        <FieldError message={state.errors?.subject} />
      </div>

      {/* Message Textarea */}
      <div>
        <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14rem] text-ink/65">
          Message <span className="text-amber-700">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={5000}
          required
          placeholder="Tell us your approximate arrival dates, number of guests, or any specific wishes for your Dalmatian holiday..."
          className={`${inputClass} resize-y`}
        />
        <FieldError message={state.errors?.message} />
      </div>

      {/* Privacy Consent Checkbox */}
      <div>
        <label className="group flex items-start gap-3 text-xs sm:text-sm leading-6 text-ink/65 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            defaultChecked
            className="mt-1 h-4 w-4 shrink-0 rounded-md border-ink/20 accent-ink cursor-pointer"
          />
          <span className="transition-colors group-hover:text-ink">
            I agree to the processing of my contact details for the direct reply to my inquiry. No marketing emails or newsletters.
          </span>
        </label>
        <FieldError message={state.errors?.consent} />
      </div>

      <TurnstileWidget
        action="contact_message"
        onVerifiedChange={setTurnstileReady}
        resetSignal={state}
      />
      <FieldError message={state.errors?.turnstile} />

      {/* Error Alert Box */}
      {state.status === 'error' && state.message && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50/70 p-4 text-xs sm:text-sm text-red-800 animate-[var(--animate-fade-in)]">
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <SubmitButton securityReady={turnstileReady} />
      </div>
    </form>
  )
}
