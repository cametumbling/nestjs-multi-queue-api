//RabbitMQ agent

import { Connection, Channel, connect } from 'amqplib';
import { QueueClient } from './queue-client.interface';

export class RabbitClient implements QueueClient {
  private connection!: Connection;
  private channel!: Channel;

  constructor(private readonly url: string) {}

  private async ensureChannel(): Promise<Channel> {
    if (!this.channel) {
      this.connection = await connect(this.url);
      this.channel = await this.connection.createChannel();
    }
    return this.channel;
  }

  async publish(topic: string, message: unknown): Promise<void> {
    const ch = await this.ensureChannel();
    await ch.assertQueue(topic);
    ch.sendToQueue(topic, Buffer.from(JSON.stringify(message)));
  }

  async consume(
    topic: string,
    onMessage: (msg: unknown) => Promise<void>,
  ): Promise<void> {
    const ch = await this.ensureChannel();
    await ch.assertQueue(topic);

    await ch.consume(topic, async (msg) => {
      if (!msg) return;
      const content = JSON.parse(msg.content.toString());
      await onMessage(content);
      ch.ack(msg);
    });
  }
}