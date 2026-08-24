'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button, FieldLabel, TextInput, useField, useForm, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import { formatSlug } from './formatSlug'

type SlugComponentProps = TextFieldClientProps & {
  fieldToUse?: string
}

export const SlugComponent: React.FC<SlugComponentProps> = ({
  field,
  path,
  readOnly: readOnlyFromProps,
}) => {
  const { label } = field
  const fieldPath = path || field.name
  const { value, setValue, showError } = useField<string>({ path: fieldPath })
  const { getDataByPath } = useForm()

  // Get the target field to auto-generate slug from (e.g. 'title' or 'name')
  const custom = field.admin?.custom as { fieldToUse?: string } | undefined
  const fieldToUse = custom?.fieldToUse || 'title'

  // Watch the source field value
  const targetFieldValue = useFormFields(([fields]) => {
    return fields[fieldToUse]?.value as string | undefined
  })

  // By default, slug field starts locked
  const [isLocked, setIsLocked] = useState(true)

  // When locked and creating / editing, auto-sync slug with title/name
  useEffect(() => {
    if (isLocked && targetFieldValue && typeof targetFieldValue === 'string') {
      const formatted = formatSlug(targetFieldValue)
      if (formatted !== value) {
        setValue(formatted)
      }
    }
  }, [isLocked, targetFieldValue, setValue, value])

  const handleGenerate = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const rawVal = getDataByPath(fieldToUse) as string | undefined
      if (rawVal && typeof rawVal === 'string') {
        setValue(formatSlug(rawVal))
      }
    },
    [fieldToUse, getDataByPath, setValue],
  )

  const toggleLock = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsLocked((prev) => !prev)
  }, [])

  return (
    <div className="field-type slug-field-component" style={{ marginBottom: '1.25rem' }}>
      <div
        className="label-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.35rem',
        }}
      >
        <FieldLabel htmlFor={`field-${fieldPath}`} label={label || 'Slug'} required={field.required} />
        {!readOnlyFromProps && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {!isLocked && (
              <Button
                buttonStyle="none"
                size="small"
                onClick={handleGenerate}
                className="lock-button"
              >
                Generate
              </Button>
            )}
            <Button
              buttonStyle="none"
              size="small"
              onClick={toggleLock}
              className="lock-button"
            >
              {isLocked ? 'Unlock' : 'Lock'}
            </Button>
          </div>
        )}
      </div>

      <TextInput
        path={fieldPath}
        value={value || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => {
          if (typeof e === 'string') {
            setValue(formatSlug(e))
          } else if (e?.target?.value !== undefined) {
            setValue(formatSlug(e.target.value))
          }
        }}
        readOnly={Boolean(readOnlyFromProps || isLocked)}
        showError={showError}
      />
    </div>
  )
}
