import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { RabbitMQConfig } from '../config';
import { TProfessionBased } from '@common/types';

interface ClientProxyWithClosed extends ClientProxy {
  _closed?: boolean;
}

// Type guard для проверки ClientProxy с закрытым соединением
function hasClosedProperty(client: ClientProxy): client is ClientProxyWithClosed {
  return '_closed' in client;
}

@Injectable()
export class ProfessionsService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, 'Professions Service');
  }

  async getAllProfessions(): Promise<TProfessionBased[]> {
    return await firstValueFrom<TProfessionBased[]>(this.clientData.send('getAll.professions', {}));
  }

  isConnected(): boolean {
    // TODO: такая же логика есть в persons.service.ts
    if (!this.clientData) return false;
    
    if (hasClosedProperty(this.clientData)) {
      return !this.clientData._closed;
    }
    
    return true; // Если нет свойства _closed, считаем соединение активным
  }
}
