'use client'

import {
  CheckboxField,
  DateTimeField,
  EmailField,
  NumberField,
  SelectField,
  TextareaField,
  TextField,
  useDocumentInfo,
} from '@payloadcms/ui'
import { hr } from 'date-fns/locale/hr'
import type {
  CheckboxFieldClientProps,
  DateFieldClientProps,
  EmailFieldClientProps,
  NumberFieldClientProps,
  SelectFieldClientProps,
  TextareaFieldClientProps,
  TextFieldClientProps,
} from 'payload'
import React, { type CSSProperties, type ReactNode, useMemo, useState } from 'react'
import { registerLocale } from 'react-datepicker'

registerLocale('hr', hr)

type LockableFieldShellProps = {
  children: (readOnly: boolean) => ReactNode
  field: {
    admin?: {
      width?: number | string
    }
    label?: unknown
    name: string
  }
  readOnly?: boolean
}

function LockableFieldShell({
  children,
  field,
  readOnly: readOnlyFromProps,
}: LockableFieldShellProps) {
  const { isEditing } = useDocumentInfo()
  const [isLocked, setIsLocked] = useState(Boolean(isEditing))
  const readOnly = Boolean(readOnlyFromProps || isLocked)
  const fieldName = typeof field.label === 'string' ? field.label : field.name
  const style = field.admin?.width
    ? ({ '--field-width': field.admin.width } as CSSProperties)
    : ({ flex: '1 1 auto' } as CSSProperties)

  return (
    <div
      className={`lockable-booking-field${readOnly ? ' lockable-booking-field--locked' : ''}`}
      style={style}
    >
      {!readOnlyFromProps && (
        <button
          aria-label={`${isLocked ? 'Unlock' : 'Lock'} ${fieldName}`}
          aria-pressed={!isLocked}
          className="lockable-booking-field__toggle"
          onClick={() => setIsLocked((current) => !current)}
          type="button"
        >
          {isLocked ? 'Unlock' : 'Lock'}
        </button>
      )}
      {children(readOnly)}
    </div>
  )
}

export function LockableTextField(props: TextFieldClientProps) {
  return (
    <LockableFieldShell field={props.field} readOnly={props.readOnly}>
      {(readOnly) => <TextField {...props} readOnly={readOnly} />}
    </LockableFieldShell>
  )
}

export function LockableEmailField(props: EmailFieldClientProps) {
  return (
    <LockableFieldShell field={props.field} readOnly={props.readOnly}>
      {(readOnly) => <EmailField {...props} readOnly={readOnly} />}
    </LockableFieldShell>
  )
}

export function LockableNumberField(props: NumberFieldClientProps) {
  return (
    <LockableFieldShell field={props.field} readOnly={props.readOnly}>
      {(readOnly) => <NumberField {...props} readOnly={readOnly} />}
    </LockableFieldShell>
  )
}

export function LockableSelectField(props: SelectFieldClientProps) {
  return (
    <LockableFieldShell field={props.field} readOnly={props.readOnly}>
      {(readOnly) => <SelectField {...props} readOnly={readOnly} />}
    </LockableFieldShell>
  )
}

export function LockableTextareaField(props: TextareaFieldClientProps) {
  return (
    <LockableFieldShell field={props.field} readOnly={props.readOnly}>
      {(readOnly) => <TextareaField {...props} readOnly={readOnly} />}
    </LockableFieldShell>
  )
}

export function LockableCheckboxField(props: CheckboxFieldClientProps) {
  return (
    <LockableFieldShell field={props.field} readOnly={props.readOnly}>
      {(readOnly) => <CheckboxField {...props} readOnly={readOnly} />}
    </LockableFieldShell>
  )
}

export function LockableDateField(props: DateFieldClientProps) {
  const field = useMemo(() => {
    const existingDate =
      props.field.admin?.date && typeof props.field.admin.date === 'object'
        ? (props.field.admin.date as Record<string, unknown>)
        : {}
    const existingOverrides =
      existingDate.overrides && typeof existingDate.overrides === 'object'
        ? (existingDate.overrides as Record<string, unknown>)
        : {}

    return {
      ...props.field,
      admin: {
        ...props.field.admin,
        date: {
          ...existingDate,
          displayFormat: 'd. MMMM yyyy.',
          overrides: {
            ...existingOverrides,
            locale: 'hr',
          },
          pickerAppearance: 'dayOnly' as const,
        },
      },
    } as DateFieldClientProps['field']
  }, [props.field])

  return (
    <LockableFieldShell field={field} readOnly={props.readOnly}>
      {(readOnly) => <DateTimeField {...props} field={field} readOnly={readOnly} />}
    </LockableFieldShell>
  )
}
