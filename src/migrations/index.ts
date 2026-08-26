import * as migration_20260826_084000_cms_localization from './20260826_084000_cms_localization'
import * as migration_20260826_170000_orderable_content from './20260826_170000_orderable_content'
import * as migration_20260826_174500_orderable_gallery_faq from './20260826_174500_orderable_gallery_faq'

export const migrations = [
  {
    up: migration_20260826_084000_cms_localization.up,
    down: migration_20260826_084000_cms_localization.down,
    name: '20260826_084000_cms_localization',
  },
  {
    up: migration_20260826_170000_orderable_content.up,
    down: migration_20260826_170000_orderable_content.down,
    name: '20260826_170000_orderable_content',
  },
  {
    up: migration_20260826_174500_orderable_gallery_faq.up,
    down: migration_20260826_174500_orderable_gallery_faq.down,
    name: '20260826_174500_orderable_gallery_faq',
  },
]
