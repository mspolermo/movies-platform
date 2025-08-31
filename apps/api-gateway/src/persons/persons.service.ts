import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { RabbitMQConfig } from "../config";
import { TPersonBased } from "@common/types";

@Injectable()
export class PersonsService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, "Persons Service");
  }

  async getAllPersons(): Promise<TPersonBased[]> {
    return await firstValueFrom(this.clientData.send("getAllPersons", {}));
  }

  async getPersonById(id: number): Promise<TPersonBased> {
    return await firstValueFrom(this.clientData.send("getPersonById", id));
  }

  async findPersonsByNameAndProfession(
    name?: string,
    professionId?: number
  ): Promise<TPersonBased[]> {
    return await firstValueFrom(
      this.clientData.send("findPersonsByNameAndProfession", {
        name,
        id: professionId,
      })
    );
  }
}
