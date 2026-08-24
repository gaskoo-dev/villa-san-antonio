'use client'

import {
  IconArrowRight,
  IconCalendar,
  IconChevronLeft,
  IconCircleCheck,
  IconCreditCard,
  IconGlobe,
  IconLock,
  IconMail,
  IconRefresh,
  IconSparkles,
  IconUser,
  IconUsers,
} from '@tabler/icons-react'
import { AnimatePresence, motion } from 'motion/react'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitBookingInquiry } from '@/actions/inquiries'
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar'
import { useLocale } from '@/context/LocaleContext'
import { emptyFormState } from '@/lib/form-state'

const inputClass =
  'w-full rounded-2xl border border-ink/15 bg-paper/50 px-4.5 py-3.5 text-base sm:text-sm text-ink placeholder:text-ink/35 transition-colors duration-200 hover:border-ink/35 focus:border-ink/35 focus:outline-none'

const labelClass = 'mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.13rem] text-ink/55'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 animate-[var(--animate-fade-in)]">
      {message}
    </p>
  )
}

function formatHumanDate(dateStr: string, locale: string = 'hr'): string {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return dateStr
  const d = new Date(year, month - 1, day)

  const langCode = locale === 'hr' ? 'hr-HR' : locale === 'de' ? 'de-DE' : 'en-GB'

  return new Intl.DateTimeFormat(langCode, {
    day: 'numeric',
    month: locale === 'en' ? 'short' : 'long',
    year: 'numeric',
  }).format(d)
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative flex flex-1 items-center justify-center gap-4 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14rem] text-white shadow-lg transition-all duration-300 hover:bg-ink/85 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      <span>{pending ? pendingLabel : label}</span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-0.5">
        <IconArrowRight size={15} stroke={2.5} aria-hidden />
      </span>
    </button>
  )
}

export function BookingForm({ minNights = 3 }: { minNights?: number }) {
  const { t, locale } = useLocale()
  const [state, formAction] = useActionState(submitBookingInquiry, emptyFormState)
  const [step, setStep] = useState<1 | 2>(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const handleSelectRange = (start: string, end: string) => {
    setCheckIn(start)
    setCheckOut(end)
  }

  // Calculate nights count
  let nights = 0
  if (checkIn && checkOut) {
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const diffTime = d2.getTime() - d1.getTime()
    nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="rounded-3xl border border-emerald-900/10 bg-emerald-50/40 p-8 sm:p-12 text-center space-y-6 animate-[var(--animate-fade-in)]"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
          <IconCircleCheck size={32} stroke={1.8} />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl text-ink">
            {t.booking.successTitle}
          </h3>
          <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed text-ink/70">
            {state.message || t.booking.successMessage}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4.5 py-2 text-xs font-medium text-ink/65 shadow-xs">
          <IconCreditCard size={15} stroke={1.8} />
          <span>No payment charged now · 30% deposit upon confirmation</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-3xl border border-ink/10 bg-white/90 backdrop-blur-sm p-6 sm:p-9 shadow-[0_8px_32px_rgba(0,0,0,0.04)] space-y-6 overflow-hidden">
      {/* Step Progress Header */}
      <div className="border-b border-ink/10 pb-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14rem] text-ink/50">
              Step {step} of 2
            </span>
            <h3 className="text-xl font-medium tracking-tight text-ink">
              {step === 1 ? 'Select Your Dates' : 'Guest Details & Inquiry'}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sync</span>
          </span>
        </div>

        {/* Minimalist Animated Step Progress Navigation */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`relative inline-flex items-center gap-2 rounded-full py-1.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              step === 1 ? 'text-white' : 'text-ink/60 hover:text-ink hover:bg-black/[0.04]'
            }`}
          >
            {step === 1 && (
              <motion.div
                layoutId="activeBookingStepPill"
                className="absolute inset-0 rounded-full bg-ink shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 text-[11px]">01</span>
            <span className="relative z-10">Dates</span>
          </button>

          <button
            type="button"
            onClick={() => checkIn && checkOut && nights >= minNights && setStep(2)}
            disabled={!checkIn || !checkOut || nights < minNights}
            className={`relative inline-flex items-center gap-2 rounded-full py-1.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors ${
              step === 2
                ? 'text-white'
                : 'text-ink/60 hover:text-ink hover:bg-black/[0.04] disabled:opacity-30 disabled:cursor-not-allowed'
            }`}
          >
            {step === 2 && (
              <motion.div
                layoutId="activeBookingStepPill"
                className="absolute inset-0 rounded-full bg-ink shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 text-[11px]">02</span>
            <span className="relative z-10">Guest Details</span>
          </button>
        </div>
      </div>

      {/* Animated Step View Transitions */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step-dates"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <AvailabilityCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              minNights={minNights}
              onSelectRange={handleSelectRange}
            />

            {/* Selected Stay Highlight Banner */}
            {checkIn && checkOut ? (
              nights < minNights ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-900 shadow-xs animate-[var(--animate-fade-in)]">
                  <div className="flex items-center gap-2.5">
                    <IconSparkles size={18} className="text-amber-700 shrink-0" />
                    <span>
                      <strong>Selected:</strong> {formatHumanDate(checkIn, locale)} &rarr;{' '}
                      {formatHumanDate(checkOut, locale)} ({nights}{' '}
                      {nights === 1 ? 'night' : 'nights'})
                    </span>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold">
                    Minimum stay is {minNights} nights
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/15 bg-paper/60 p-4 text-xs sm:text-sm text-ink shadow-xs animate-[var(--animate-fade-in)]">
                  <div className="flex items-center gap-2.5">
                    <IconSparkles size={18} className="text-amber-600 shrink-0" />
                    <span>
                      <strong>Selected Stay:</strong> {formatHumanDate(checkIn, locale)} &rarr;{' '}
                      {formatHumanDate(checkOut, locale)} ({nights}{' '}
                      {nights === 1 ? 'night' : 'nights'})
                    </span>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold">
                    Dates Available
                  </span>
                </div>
              )
            ) : checkIn ? (
              <div className="rounded-2xl border border-ink/15 bg-paper/60 p-4 text-xs text-ink/80">
                <span>
                  <strong>Check-in:</strong> {formatHumanDate(checkIn, locale)} &rarr;{' '}
                  <em>Select departure date (minimum {minNights} nights)</em>
                </span>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-ink/15 bg-paper/30 p-3.5 text-center text-xs text-ink/55">
                Select arrival and departure dates on the calendar (minimum {minNights} nights stay)
              </div>
            )}

            {/* Continue to Step 2 Button */}
            <div>
              <button
                type="button"
                disabled={!checkIn || !checkOut || nights < minNights}
                onClick={() => setStep(2)}
                className="group flex w-full items-center justify-center gap-4 rounded-full bg-ink px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14rem] text-white shadow-lg transition-all duration-300 hover:bg-ink/85 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                <span>
                  {!checkIn || !checkOut
                    ? 'Select Dates to Continue'
                    : nights < minNights
                      ? `Minimum stay is ${minNights} nights (${nights} selected)`
                      : `Continue to Guest Details (${nights} ${nights === 1 ? 'night' : 'nights'})`}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-0.5">
                  <IconArrowRight size={15} stroke={2.5} aria-hidden />
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-guest-details"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Active Date Recap Banner with Edit action */}
            <div className="flex items-center justify-between rounded-2xl border border-ink/15 bg-paper/60 p-4 text-xs sm:text-sm text-ink shadow-xs">
              <div className="flex items-center gap-2">
                <IconCalendar size={16} className="text-ink/70" />
                <span>
                  <strong>Selected Stay:</strong> {formatHumanDate(checkIn, locale)} &rarr;{' '}
                  {formatHumanDate(checkOut, locale)} ({nights}{' '}
                  {nights === 1 ? 'night' : 'nights'})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-ink/70 hover:text-ink transition-colors underline decoration-ink/30 cursor-pointer"
              >
                <IconRefresh size={12} stroke={2} />
                <span>Change</span>
              </button>
            </div>

            <form action={formAction} noValidate className="space-y-5">
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              <input type="hidden" name="checkIn" value={checkIn} />
              <input type="hidden" name="checkOut" value={checkOut} />

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={labelClass}>
                    <IconUser size={14} stroke={2} className="text-ink/50" />
                    <span>{locale === 'de' ? 'Vorname' : locale === 'hr' ? 'Ime' : 'First name'}</span>
                    <span className="text-amber-700">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="e.g. Michael"
                    autoComplete="given-name"
                    required
                    className={inputClass}
                  />
                  <FieldError message={state.errors?.firstName} />
                </div>

                <div>
                  <label htmlFor="lastName" className={labelClass}>
                    <IconUser size={14} stroke={2} className="text-ink/50" />
                    <span>{locale === 'de' ? 'Nachname' : locale === 'hr' ? 'Prezime' : 'Last name'}</span>
                    <span className="text-amber-700">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="e.g. Weber"
                    autoComplete="family-name"
                    required
                    className={inputClass}
                  />
                  <FieldError message={state.errors?.lastName} />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  <IconMail size={14} stroke={2} className="text-ink/50" />
                  <span>{t.booking.email}</span>
                  <span className="text-amber-700">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your-email@example.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
                <FieldError message={state.errors?.email} />
              </div>

              {/* Country & Party Composition */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="country" className={labelClass}>
                    <IconGlobe size={14} stroke={2} className="text-ink/50" />
                    <span>{locale === 'de' ? 'Land' : locale === 'hr' ? 'Država' : 'Country'}</span>
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Germany, Austria..."
                    autoComplete="country-name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="adults" className={labelClass}>
                    <IconUsers size={14} stroke={2} className="text-ink/50" />
                    <span>{locale === 'de' ? 'Erwachsene' : locale === 'hr' ? 'Odrasli' : 'Adults'}</span>
                    <span className="text-amber-700">*</span>
                  </label>
                  <input
                    id="adults"
                    name="adults"
                    type="number"
                    min={1}
                    max={8}
                    defaultValue={2}
                    required
                    className={`${inputClass} tabular-nums`}
                  />
                  <FieldError message={state.errors?.adults} />
                </div>

                <div>
                  <label htmlFor="kids" className={labelClass}>
                    <span>{locale === 'de' ? 'Kinder' : locale === 'hr' ? 'Djeca' : 'Kids'}</span>
                  </label>
                  <input
                    id="kids"
                    name="kids"
                    type="number"
                    min={0}
                    max={8}
                    defaultValue={0}
                    className={`${inputClass} tabular-nums`}
                  />
                </div>

                <div>
                  <label htmlFor="pets" className={labelClass}>
                    <span>{locale === 'de' ? 'Haustiere' : locale === 'hr' ? 'Ljubimci' : 'Pets'}</span>
                  </label>
                  <select
                    id="pets"
                    name="pets"
                    defaultValue="no"
                    className={`${inputClass} cursor-pointer bg-white`}
                  >
                    <option value="no" className="bg-white text-ink">
                      {locale === 'de' ? 'Nein' : locale === 'hr' ? 'Ne' : 'No'}
                    </option>
                    <option value="yes" className="bg-white text-ink">
                      {locale === 'de' ? 'Ja' : locale === 'hr' ? 'Da' : 'Yes'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Special Requests / Notes */}
              <div>
                <label htmlFor="notes" className={labelClass}>
                  <span>{t.booking.notes}</span>
                  <span className="font-normal normal-case tracking-normal text-ink/40">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Estimated arrival time, baby cot request, airport transfer, or any questions for Josip..."
                  className={`${inputClass} resize-y min-h-[85px]`}
                />
              </div>

              {state.status === 'error' && state.message && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50/70 p-4 text-xs sm:text-sm text-red-800 animate-[var(--animate-fade-in)]"
                >
                  <p className="font-medium">{state.message}</p>
                </div>
              )}

              {/* Action Buttons: Back + Submit */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-paper/60 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink/75 transition-colors hover:border-ink/35 hover:text-ink cursor-pointer"
                >
                  <IconChevronLeft size={16} />
                  <span>Back</span>
                </button>

                <SubmitButton label={t.booking.submit} pendingLabel={t.booking.sending} />
              </div>

              {/* Reassurance trust footer */}
              <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-ink/45 pt-1">
                <IconLock size={13} stroke={2} className="text-ink/55" />
                <span>Direct inquiry · No instant charges · Dates held securely</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
