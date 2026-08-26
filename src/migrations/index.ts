import * as migration_20260826_084000_cms_localization from './20260826_084000_cms_localization'

export const migrations = [
  {
    up: migration_20260826_084000_cms_localization.up,
    down: migration_20260826_084000_cms_localization.down,
    name: '20260826_084000_cms_localization',
  },
]
