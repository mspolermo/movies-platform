// Общие типы для монорепы
export * from './request';
export * from './response';

// ВАЖНО - экспорт наружу из entity и orm запрещен!
// orm импортируется в беке напрямую: import type { ... } from '@common/types/orm'
