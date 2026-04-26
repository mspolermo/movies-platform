import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { rmqProviders } from "./rmq.providers";
import { RmqService } from "./rmq.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...rmqProviders, RmqService],
  exports: [...rmqProviders, RmqService],
})
export class RmqModule {}