//GCP Pub-Sub agent
import { PubSub } from '@google-cloud/pubsub';
import { QueueClient } from './queue-client.interface';

export class GcpClient implements QueueClient {
  //private readonly client = new PubSub();
  private readonly pubsub: PubSub;
  constructor(projectId: string) {
    this.pubsub = new PubSub({ projectId });
  }
  // constructor(
  //   projectId: string,
  //   emulatorHost?: string,
  // ) {
  //   this.pubsub = new PubSub({
  //     projectId,
  //     apiEndpoint: emulatorHost ? emulatorHost.replace('http://', '') : undefined,
  //   });
  // }
  async publish(topic: string, message: unknown): Promise<void> {
    // const t = this.client.topic(topic);
    // await t.publishMessage({
    //   json: { message },
    // });
    const buffer = Buffer.from(JSON.stringify(message));
    //await this.pubsub.topic(topic).publish(buffer);
    await this.pubsub.topic(topic).publishMessage({ data: buffer });
  }

  async consume(
    topic: string,
    onMessage: (msg: unknown) => Promise<void>,
  ): Promise<void> {
    //const subscription = this.client.subscription(`${topic}-sub`);
    const subscriptionName = `${topic}-sub`;
    const [subscription] = await this.pubsub
      .topic(topic)
      .subscription(subscriptionName)
      .get({ autoCreate: true });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    subscription.on('message', async (msg) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = JSON.parse(msg.data.toString());
        await onMessage(data);
        msg.ack();
      } catch {
        msg.nack();
      }
    });
  }
}
