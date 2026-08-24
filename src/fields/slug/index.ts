import type { Field } from 'payload'
import { formatSlugHook } from './formatSlug'

export type SlugField = (
  fieldToUse?: string,
  overrides?: Partial<Field>,
) => Field

export const slugField: SlugField = (fieldToUse = 'title', overrides = {}) => {
  const { admin, ...restOverrides } = overrides

  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    hooks: {
      beforeValidate: [formatSlugHook(fieldToUse)],
    },
    admin: {
      position: 'sidebar',
      description: 'URL slug (auto-generated, click Unlock to edit manually)',
      components: {
        Field: '@/fields/slug/SlugComponent#SlugComponent',
      },
      custom: {
        fieldToUse,
      },
      ...admin,
    },
    ...restOverrides,
  } as Field
}

export { formatSlug, formatSlugHook } from './formatSlug'
export { SlugComponent } from './SlugComponent'
