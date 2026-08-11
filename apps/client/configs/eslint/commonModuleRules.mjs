/**
 * Периметр `@common` для клиента (ADR-009).
 * Разрешено: `@common/types`, grade / `API_GATEWAY_URL` / `NETWORK` из constants.
 * Запрещено: JWT, `@common/services` (RMQ), dto / orm / entity; `import *` из constants barrels.
 *
 * Спредь в `rules` reactConfig (или другого flat-блока).
 *
 * @type {import('eslint').Linter.RulesRecord}
 */
export const commonModuleRules = {
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: '@common/constants',
          importNames: [
            'JWT_ENV',
            'JWT_DEFAULTS',
            'resolveJwtSecret',
          ],
          message:
            'JWT — backend-only. Клиент: grade / API_GATEWAY_URL / NETWORK из @common/constants или @common/constants/network.',
        },
        {
          name: '@common/constants/jwt',
          message: 'JWT helpers — backend-only (ADR-009).',
        },
        {
          name: '@common/services',
          message:
            'RMQ/services — backend-only. Клиент: @common/types / @common/constants/network.',
        },
        {
          name: '@common/services/rmq',
          message:
            'RMQ — backend-only. Клиент: @common/constants/network (публичная топология).',
        },
        {
          name: '@common/services/rmq/rmq.constants',
          message:
            'RMQ/PG DX, asserts, DI tokens — backend-only.',
        },
        {
          name: '@common/dto',
          message: 'DTO — только бэкенд. Клиент: @common/types.',
        },
        {
          name: '@common/types/orm',
          message: 'ORM-типы — только бэкенд. Клиент: @common/types (response/request).',
        },
        {
          name: '@common/types/entity',
          message: 'Entity-типы — не публичный API. Клиент: T*Response из @common/types.',
        },
      ],
      patterns: [
        {
          group: ['@common/dto/*'],
          message: 'DTO — только бэкенд. Клиент: @common/types.',
        },
        {
          group: ['@common/types/orm/*', '@common/types/entity/*'],
          message: 'orm/entity — не для клиента. Используй @common/types.',
        },
        {
          group: ['@common/services', '@common/services/*'],
          message:
            'RMQ/services — backend-only. Клиент: @common/constants/network.',
        },
        {
          group: ['@common/constants/jwt', '@common/constants/jwt/*'],
          message: 'JWT helpers — backend-only (ADR-009).',
        },
      ],
    },
  ],
  // namespace import обходит importNames — запрещаем * из constants barrels
  'no-restricted-syntax': [
    'error',
    {
      selector:
        "ImportDeclaration[source.value='@common/constants'] ImportNamespaceSpecifier",
      message:
        'Не import * из @common/constants — только named imports (ADR-009).',
    },
    {
      selector:
        "ImportDeclaration[source.value='@common/constants/network'] ImportNamespaceSpecifier",
      message:
        'Не import * из @common/constants/network — только named imports (ADR-009).',
    },
  ],
}
