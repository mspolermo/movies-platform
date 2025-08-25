## Архитектура

### Микросервисы
- **API Gateway** (порт 5000) - основной API
- **Auth Users** (порт 3001) - аутентификация
- **Kino DB** (порт 3002) - данные фильмов

### Технологии
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + Sequelize
- **Message Queue**: RabbitMQ
- **Containerization**: Docker + Docker Compose