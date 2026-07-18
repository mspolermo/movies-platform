import { fsdConfig } from './configs/eslint/fsdconfig.mjs'
import { reactConfig } from './configs/eslint/reactConfig.mjs'

/**
 * Flat ESLint entry. Линт клиента = fsdConfig + reactConfig.
 * Парсер/плагины TS — только из reactConfig.mjs (@typescript-eslint v8).
 * `eslint-config-next` не используется (см. комментарий в reactConfig.mjs).
 *
 * @type {import('eslint').Linter.Config[]}
 */
export default [...fsdConfig, ...reactConfig]
