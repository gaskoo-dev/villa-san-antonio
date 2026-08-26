import type { CollectionConfig, Field, GlobalConfig } from 'payload'

const LOCALIZED_FIELD_TYPES = new Set(['text', 'textarea', 'richText'])

function isTechnicalField(name: string): boolean {
  const normalized = name.toLowerCase()
  return (
    normalized === 'slug' ||
    normalized === 'source' ||
    normalized.includes('url') ||
    normalized.includes('link') ||
    normalized.includes('phone') ||
    normalized.includes('email')
  )
}

export function localizeContentFields(fields: Field[]): Field[] {
  return fields.map((field) => {
    if ('tabs' in field && Array.isArray(field.tabs)) {
      return {
        ...field,
        tabs: field.tabs.map((tab) => ({
          ...tab,
          fields: localizeContentFields(tab.fields),
        })),
      }
    }

    if ('blocks' in field && Array.isArray(field.blocks)) {
      return {
        ...field,
        blocks: field.blocks.map((block) => ({
          ...block,
          fields: localizeContentFields(block.fields),
        })),
      }
    }

    if ('fields' in field && Array.isArray(field.fields)) {
      return {
        ...field,
        fields: localizeContentFields(field.fields),
      }
    }

    if (
      'name' in field &&
      typeof field.name === 'string' &&
      LOCALIZED_FIELD_TYPES.has(field.type) &&
      !isTechnicalField(field.name)
    ) {
      return { ...field, localized: true } as Field
    }

    return field
  })
}

export function withLocalizedContent<T extends CollectionConfig | GlobalConfig>(config: T): T {
  return {
    ...config,
    fields: localizeContentFields(config.fields),
  }
}
