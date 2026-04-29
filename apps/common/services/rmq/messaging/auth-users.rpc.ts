/**
 * Паттерны сообщений RabbitMQ для микросервиса auth-users.
 * Значения строк не менять без согласования — это контракт с api-gateway.
 */
export const authUsersRpc = {
  users: {
    registration: "registration",
    outRegistration: "outRegistration",
    login: "login",
    getById: "getUserById",
  },
  roles: {
    create: "createRole",
  },
} as const;
