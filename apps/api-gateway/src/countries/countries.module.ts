import { Module } from "@nestjs/common";
import { CountriesController } from "./countries.controller";
import { CountriesService } from "./countries.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: "FILMS_CLIENT",
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          //TODO: вынести в общую логику по подключению к RabbitMQ
          const rabbitmqUrl = configService.get<string>("RABBITMQ_URL");
          const filmsQueue = configService.get<string>("FILMS_QUEUE");
          
          if (!rabbitmqUrl || !filmsQueue) {
            throw new Error("RABBITMQ_URL and FILMS_QUEUE must be defined");
          }
          
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitmqUrl],
              queue: filmsQueue,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
