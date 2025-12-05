//feature module brings it all together and integrates it into Nest
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { loadQueueClients } from '../config/queue.config';
import { createQueueClient } from './clients/queue-client.factory';
import { QUEUE_CLIENT } from './clients/queue-client.token';

const client = createQueueClient(loadQueueClients());

@Module({
  providers: [
    {
      provide: QUEUE_CLIENT,
      useValue: client,
    },
    QueueService,
  ],
  controllers: [QueueController],
})
export class QueueModule {}
