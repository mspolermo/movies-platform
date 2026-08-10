/**
 * Backend-only RMQ defaults (host-run URL, DX creds, queue names).
 * Клиент не импортирует — eslint + отдельный модуль от `network.ts` (ADR-009).
 */

import { NETWORK } from "./network";

/** DX defaults в host-run URL (те же, что compose defaults). Прод — USER/PASS в `.env`. */
export const RABBITMQ_DX_USER = "mp";
export const RABBITMQ_DX_PASS = "mp_dev_change_me";

/** Host-run default. Docker URL собирает compose на `@rabbitmq`. */
export const RABBITMQ_URL = `amqp://${RABBITMQ_DX_USER}:${RABBITMQ_DX_PASS}@localhost:${NETWORK.rabbitmq.amqpPublish}`;

export const USERS_QUEUE = "users_queue";
export const FILMS_QUEUE = "films_queue";
