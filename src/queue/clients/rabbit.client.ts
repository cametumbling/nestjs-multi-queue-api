//RabbitMQ agent

import { Connection, Channel, connect } from 'amqplib';
import { QueueClient } from './queue-client.interface';

export class RabbitClient implements QueueClient {
  private connection!: Connection;
  private channel!: Channel;

  constructor(private readonly url: string) {}

  private async ensureChannel(): Promise<Channel> {
    if (!this.channel) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      this.connection = await connect(this.url);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.channel = await this.connection.createChannel();
    }
    return this.channel;
  }

  async publish(topic: string, message: unknown): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ch = await this.ensureChannel();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await ch.assertQueue(topic);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ch.sendToQueue(topic, Buffer.from(JSON.stringify(message)));
  }

  async consume(
    topic: string,
    onMessage: (msg: unknown) => Promise<void>,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ch = await this.ensureChannel();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await ch.assertQueue(topic);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await ch.consume(topic, async (msg) => {
      if (!msg) return;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const content = JSON.parse(msg.content.toString());
      await onMessage(content);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      ch.ack(msg);
    });
  }
}
