import { fsdConfig } from './configs/eslint/fsdconfig.mjs'
import { reactConfig } from './configs/eslint/reactConfig.mjs'

/** @type {import('eslint').Linter.Config[]} */
export default [...fsdConfig, ...reactConfig]
