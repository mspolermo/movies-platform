import { DocumentBuilder } from '@nestjs/swagger';

export const getSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Movies-platform')
    .setDescription('Документация REST API')
    .setVersion('1.0.1')
    .addBearerAuth()
    .build();
};
