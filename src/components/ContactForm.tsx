'use client'

import { IconArrowUpRight, IconCircleCheck, IconLoader2, IconSparkles } from '@tabler/icons-react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitContactMessage } from '@/actions/inquiries'
import { emptyFormState } from '@/lib/form-state'

const inputClass =
  'w-full rounded-2xl border border-ink/15 bg-paper/50 px-4.5 py-3.5 text-base sm:text-sm text-ink placeholder:text-ink/35 transition-colors duration-200 hover:border-ink/35 focus:border-ink/35 focus:outline-none'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 animate-[var(--animate-fade-in)]">
      {message}
    </p>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-4 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14rem] text-white shadow-lg transition-all duration-300 hover:bg-ink/85 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      <span>{pending ? 'Sending message...' : 'Send message'}</span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        {pending ? (
          <IconLoader2 size={15} className="animate-spin text-ink" />
        ) : (
          <IconArrowUpRight size={15} stroke={2.5} aria-hidden />
        )}
      </span>
    </button>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, emptyFormState)

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center rounded-3xl border border-emerald-900/10 bg-emerald-50/40 p-8 sm:p-12 text-center animate-[var(--animate-fade-in)]"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
          <IconCircleCheck size={32} stroke={1.8} />
        </div>
        <h3 className="mt-5 font-serif text-2xl sm:text-3xl text-ink">
          Message delivered safely.
        </h3>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-ink/70">
          {state.message || 'Thank you for reaching out. Josip and the family usually answer within 30 minutes.'}
        </p>
        <div className="mt-8 flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-medium text-ink/60">
          <IconSparkles size={15} className="text-amber-600" />
          <span>A copy will also be logged in our host inbox.</span>
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
          <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14rem] text-ink/50">
            Your Name <span className="text-amber-700">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="e.g. Elena Rostova"
            className={inputClass}
          />
          <FieldError message={state.errors?.name} />
        </div>

        <div>
          <label htmlFor="cemail" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14rem] text-ink/50">
            Email Address <span className="text-amber-700">*</span>
          </label>
          <input
            id="cemail"
            name="email"
            type="email"
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
        <label htmlFor="subject" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14rem] text-ink/50">
          Subject <span className="text-amber-700">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="What is your inquiry regarding?"
          className={inputClass}
        />
        <FieldError message={state.errors?.subject} />
      </div>

      {/* Message Textarea */}
      <div>
        <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14rem] text-ink/50">
          Message <span className="text-amber-700">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
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

      {/* Error Alert Box */}
      {state.status === 'error' && state.message && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50/70 p-4 text-xs sm:text-sm text-red-800 animate-[var(--animate-fade-in)]">
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  )
}
