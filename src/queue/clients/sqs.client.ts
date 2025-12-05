//AWS SQS agent

import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { QueueClient } from './queue-client.interface';

export class SqsClient implements QueueClient {
  //private readonly client = new SQSClient({});
  private sqs: SQSClient;

  constructor(private queueUrl: string) {
    this.sqs = new SQSClient({
      region: process.env.AWS_REGION || 'eu-west-2',
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });
  }
  async publish(topic: string, message: unknown): Promise<void> {
    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify({ topic, message }),
      }),
    );
  }
  catch(err) {
    // best-effort SQS for test; don’t break API
    console.error('SQS publish failed (non-fatal)', err);
  }

  async consume(
    topic: string,
    onMessage: (msg: unknown) => Promise<void>,
  ): Promise<void> {
    // stub for test; real polling intentionally omitted
    await onMessage({ note: 'SQS consume stub', topic });
  }
}
