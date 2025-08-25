import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Person } from '../shared/interfaces';

@Injectable()
export class PersonsService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');
    const filmsQueue = this.configService.get<string>('FILMS_QUEUE');

    this.clientData = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: filmsQueue,
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.clientData.connect();
    } catch (error) {
      console.error('❌ Ошибка подключения к RabbitMQ:', error);
      throw error;
    }
  }

  async getAllPersons(): Promise<Person[]> {
    return await firstValueFrom(this.clientData.send('getAllPersons', {}));
  }

  async getPersonById(id: number): Promise<Person> {
    return await firstValueFrom(this.clientData.send('getPersonById', id));
  }

  async findPersonsByNameAndProfession(
    name?: string,
    professionId?: number,
  ): Promise<Person[]> {
    return await firstValueFrom(
      this.clientData.send('findPersonsByNameAndProfession', {
        name,
        id: professionId,
      }),
    );
  }
}
