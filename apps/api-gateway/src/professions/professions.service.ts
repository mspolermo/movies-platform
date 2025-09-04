import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { RabbitMQConfig } from '../config';
import { TProfessionBased } from '@common/types';

@Injectable()
export class ProfessionsService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, 'Professions Service');
  }

  async getAllProfessions() {
    return await firstValueFrom<TProfessionBased[]>(this.clientData.send('getAll.professions', {}));
  }

  isConnected(): boolean {
    return this.clientData && !this.clientData['_closed'];
  }
}
