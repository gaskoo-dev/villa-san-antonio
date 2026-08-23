'use client'

import { IconArrowUpRight, IconCircleCheck } from '@tabler/icons-react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitContactMessage } from '@/actions/inquiries'
import { emptyFormState } from '@/lib/form-state'

const inputClass =
  'w-full border border-ink/20 bg-transparent px-4 py-3 text-[15px] text-ink transition-colors duration-200 placeholder:text-ink/40 focus:border-ink'

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-[0.13rem] text-ink/55'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 text-sm text-ink">
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
      className="inline-flex items-center gap-4 rounded-full bg-ink py-2 pl-6 pr-2 text-xs font-medium uppercase tracking-wider text-white transition-transform duration-300 ease-[var(--ease-reveal)] hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send message'}
      <span className="pill-chip">
        <IconArrowUpRight size={18} stroke={2} aria-hidden />
      </span>
    </button>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, emptyFormState)

  if (state.status === 'success') {
    return (
      <div role="status" className="flex flex-col items-start gap-4 border border-ink/15 bg-surface p-8 animate-[var(--animate-fade-in)]">
        <IconCircleCheck size={36} stroke={1.5} className="text-ink/70" />
        <p className="max-w-md text-lg leading-relaxed text-ink">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input id="name" name="name" type="text" autoComplete="name" required className={inputClass} />
        <FieldError message={state.errors?.name} />
      </div>
      <div>
        <label htmlFor="cemail" className={labelClass}>
          Email
        </label>
        <input id="cemail" name="email" type="email" autoComplete="email" required className={inputClass} />
        <FieldError message={state.errors?.email} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input id="subject" name="subject" type="text" required className={inputClass} />
        <FieldError message={state.errors?.subject} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea id="message" name="message" rows={6} required className={inputClass} />
        <FieldError message={state.errors?.message} />
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm leading-6 text-ink/60">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 shrink-0 accent-ink" />
          <span>I agree to the processing of my personal data for the purpose of responding to my inquiry.</span>
        </label>
        <FieldError message={state.errors?.consent} />
      </div>

      {state.status === 'error' && state.message && (
        <p role="alert" className="border border-ink/25 bg-surface px-4 py-3 text-[15px] text-ink sm:col-span-2">
          {state.message}
        </p>
      )}

      <div className="sm:col-span-2">
        <SubmitButton />
      </div>
    </form>
  )
}
