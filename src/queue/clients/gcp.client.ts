//GCP Pub-Sub agent
import { PubSub } from '@google-cloud/pubsub';
import { QueueClient } from './queue-client.interface';

export class GcpClient implements QueueClient {
  private readonly client = new PubSub();

  async publish(topic: string, message: unknown): Promise<void> {
    const t = this.client.topic(topic);
    await t.publishMessage({
      json: { message },
    });
  }

  async consume(
    topic: string,
    onMessage: (msg: unknown) => Promise<void>,
  ): Promise<void> {
    const subscription = this.client.subscription(`${topic}-sub`);

    subscription.on('message', async (msg) => {
      try {
        const data = JSON.parse(msg.data.toString());
        await onMessage(data);
        msg.ack();
      } catch {
        msg.nack();
      }
    });
  }
}