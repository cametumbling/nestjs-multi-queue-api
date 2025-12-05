//composite queues - fan out to multiple providers

import { QueueClient } from './queue-client.interface';

export class CompositeClient implements QueueClient {
  constructor(private readonly clients: QueueClient[]) {}

  async publish(topic: string, message: unknown): Promise<void> {
    await Promise.all(this.clients.map((c) => c.publish(topic, message)));
  }

  async consume(
    topic: string,
    handler: (msg: unknown) => Promise<void>,
  ): Promise<void> {
    await Promise.all(this.clients.map((c) => c.consume(topic, handler)));
  }
}
