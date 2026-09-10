// Общие типы для монорепы
export * from './request';
export * from './response';

// ВАЖНО - экспорт наружу из entity запрещен!
// entity импортируется только в беке для orm напрямую: import type { ... } from '@common/types/entity'
