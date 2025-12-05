//pub sub operations

import { Inject, Injectable } from '@nestjs/common';
import type { QueueClient } from './clients/queue-client.interface';
import { QUEUE_CLIENT } from './clients/queue-client.token';

@Injectable()
export class QueueService {
  constructor(
    @Inject(QUEUE_CLIENT)
    private readonly client: QueueClient,
  ) {}

  async publish(topic: string, message: unknown): Promise<void> {
    await this.client.publish(topic, message);
  }

  async consume(topic: string): Promise<void> {
    await this.client.consume(topic, (msg: unknown) => {
      console.log(`message on ${topic}:`, msg);
      return Promise.resolve();
    });
  }
}
